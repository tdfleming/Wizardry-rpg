import Phaser from 'phaser';
import { gameStore } from '../store';
import { GAME_WIDTH, GAME_HEIGHT, TILE } from '../constants';
import { TILE_TYPES } from '../../data/constants';
import { generateMonsters } from '../../utils/combatUtils';
import { audio } from '../audio';

const TILE_TEXTURE = {
  [TILE_TYPES.FLOOR]: 'tile_floor',
  [TILE_TYPES.WALL]: 'tile_wall',
  [TILE_TYPES.ENCOUNTER]: 'tile_encounter',
  [TILE_TYPES.TREASURE]: 'tile_treasure',
  [TILE_TYPES.STAIRS]: 'tile_stairs',
};

// Wall tiles rotate through these variants for visual variety.
const WALL_TEXTURES = ['tile_wall', 'tile_wall2', 'tile_wall3'];

const REVEAL_RADIUS = 1;

export class DungeonScene extends Phaser.Scene {
  constructor() {
    super('DungeonScene');
  }

  create() {
    const state = gameStore.getState();
    if (!state.dungeon) return;

    this.busy = false;
    gameStore.setState({ inCombat: false });
    audio.playMusic('dungeon');
    this.gridW = state.dungeon[0].length;
    this.gridH = state.dungeon.length;
    this.offsetX = Math.round((GAME_WIDTH - this.gridW * TILE) / 2);
    // Centred vertically, leaving bands top and bottom for the React HUD.
    this.offsetY = Math.round((GAME_HEIGHT - this.gridH * TILE) / 2);

    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x07070d).setOrigin(0);

    this.wallKeys = WALL_TEXTURES.filter((k) => this.textures.exists(k));
    this.drawDungeon(state);

    const lead = state.party.find((p) => p.alive) || state.party[0];
    this.player = this.add
      .image(
        this.tileX(state.position.x),
        this.tileY(state.position.y),
        `pc_${lead.class}`,
      )
      .setScale(0.42)
      .setDepth(10);

    this.revealAround(state.position.x, state.position.y);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,R');
  }

  tileX(x) {
    return this.offsetX + x * TILE + TILE / 2;
  }

  tileY(y) {
    return this.offsetY + y * TILE + TILE / 2;
  }

  drawDungeon(state) {
    this.tileSprites = [];
    this.fogSprites = [];
    for (let y = 0; y < this.gridH; y++) {
      this.tileSprites[y] = [];
      this.fogSprites[y] = [];
      for (let x = 0; x < this.gridW; x++) {
        const type = state.dungeon[y][x];
        // Pick a wall variant deterministically so it stays stable across
        // scene redraws (returning from combat, etc.).
        const key =
          type === TILE_TYPES.WALL
            ? this.wallKeys[(x * 3 + y * 7) % this.wallKeys.length]
            : TILE_TEXTURE[type];
        const tile = this.add
          .image(this.tileX(x), this.tileY(y), key)
          .setDepth(0);
        const fog = this.add
          .image(this.tileX(x), this.tileY(y), 'fog')
          .setDepth(5)
          .setVisible(!state.visited[y][x]);
        this.tileSprites[y][x] = tile;
        this.fogSprites[y][x] = fog;
      }
    }
  }

  revealAround(cx, cy) {
    const visited = gameStore.getState().visited.map((row) => row.slice());
    for (let dy = -REVEAL_RADIUS; dy <= REVEAL_RADIUS; dy++) {
      for (let dx = -REVEAL_RADIUS; dx <= REVEAL_RADIUS; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= this.gridW || y >= this.gridH) continue;
        visited[y][x] = true;
        this.fogSprites[y][x].setVisible(false);
      }
    }
    gameStore.setState({ visited });
  }

  update() {
    if (this.busy) return;
    const c = this.cursors;
    const k = this.keys;
    const JustDown = Phaser.Input.Keyboard.JustDown;

    if (JustDown(c.up) || JustDown(k.W)) this.tryMove(0, -1, 'N');
    else if (JustDown(c.down) || JustDown(k.S)) this.tryMove(0, 1, 'S');
    else if (JustDown(c.left) || JustDown(k.A)) this.tryMove(-1, 0, 'W');
    else if (JustDown(c.right) || JustDown(k.D)) this.tryMove(1, 0, 'E');
    else if (JustDown(k.R)) this.rest();
  }

  tryMove(dx, dy, facing) {
    const state = gameStore.getState();
    const nx = state.position.x + dx;
    const ny = state.position.y + dy;

    if (nx < 0 || ny < 0 || nx >= this.gridW || ny >= this.gridH) {
      gameStore.setState({ message: 'A cold stone wall blocks your path.' });
      this.cameras.main.shake(110, 0.006);
      audio.bump();
      return;
    }
    if (state.dungeon[ny][nx] === TILE_TYPES.WALL) {
      gameStore.setState({ message: 'A cold stone wall blocks your path.' });
      this.cameras.main.shake(110, 0.006);
      audio.bump();
      return;
    }

    this.busy = true;
    audio.step();
    gameStore.setState({ position: { x: nx, y: ny, facing } });

    this.tweens.add({
      targets: this.player,
      x: this.tileX(nx),
      y: this.tileY(ny),
      duration: 160,
      ease: 'Quad.easeInOut',
      onComplete: () => {
        this.revealAround(nx, ny);
        this.handleTile(nx, ny);
      },
    });
  }

  handleTile(x, y) {
    const state = gameStore.getState();
    const type = state.dungeon[y][x];

    if (type === TILE_TYPES.ENCOUNTER) {
      gameStore.setState({ message: 'Monsters lunge from the shadows!' });
      const monsters = generateMonsters(state.dungeonLevel);
      this.scene.start('CombatScene', { monsters, encounter: { x, y } });
      return;
    }

    if (type === TILE_TYPES.TREASURE) {
      const aliveCount = state.party.filter((p) => p.alive).length || 1;
      const gold = Math.floor(Math.random() * 50) + 20;
      const perChar = Math.floor(gold / aliveCount);
      const party = state.party.map((p) =>
        p.alive ? { ...p, gold: p.gold + perChar } : p,
      );
      const dungeon = state.dungeon.map((row) => row.slice());
      dungeon[y][x] = TILE_TYPES.FLOOR;

      gameStore.setState({
        party,
        dungeon,
        message: `Your party finds a hoard of ${gold} gold!`,
      });
      this.tileSprites[y][x].setTexture('tile_floor');
      this.sparkle(this.tileX(x), this.tileY(y));
      audio.treasure();
      this.busy = false;
      return;
    }

    if (type === TILE_TYPES.STAIRS) {
      audio.descend();
      gameStore.descend();
      this.scene.restart();
      return;
    }

    gameStore.setState({ message: 'The party presses deeper into the gloom.' });
    this.busy = false;
  }

  rest() {
    const state = gameStore.getState();
    const party = state.party.map((p) =>
      p.alive ? { ...p, hp: p.maxHp, mp: p.maxMp } : p,
    );
    gameStore.setState({
      party,
      message: 'The party rests and recovers its strength.',
    });
    audio.heal();
  }

  sparkle(x, y) {
    const emitter = this.add.particles(x, y, 'spark', {
      speed: { min: 60, max: 220 },
      lifespan: 600,
      scale: { start: 0.7, end: 0 },
      tint: 0xf1c40f,
      emitting: false,
    });
    emitter.setDepth(20);
    emitter.explode(24);
    this.time.delayedCall(900, () => emitter.destroy());
  }
}
