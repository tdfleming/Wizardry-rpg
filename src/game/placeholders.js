// Generates placeholder textures with Phaser Graphics so the game is fully
// playable before any real art exists. Once generated art is dropped into
// public/assets/, BootScene will load those instead (see assetManifest.js).
import {
  TILE,
  CLASS_COLORS,
  MONSTER_COLORS,
  PARTY_TEX_W,
  PARTY_TEX_H,
  MONSTER_TEX_W,
  MONSTER_TEX_H,
} from './constants';
import { MONSTERS } from '../data/monsters';

function darken(color, amount = 0.5) {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return (
    (Math.round(r * amount) << 16) |
    (Math.round(g * amount) << 8) |
    Math.round(b * amount)
  );
}

export function generatePlaceholders(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  const missing = (key) => !scene.textures.exists(key);

  // --- Floor tile ---
  if (missing('tile_floor')) {
    g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
    g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
    g.fillStyle(0x2e2e3d);
    g.fillRect(10, 12, 16, 16);
    g.fillRect(34, 36, 18, 14);
    g.generateTexture('tile_floor', TILE, TILE);
    g.clear();
  }

  // --- Encounter tile (drawn identical to floor so it stays hidden) ---
  if (missing('tile_encounter')) {
    g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
    g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
    g.fillStyle(0x2e2e3d);
    g.fillRect(18, 20, 16, 16);
    g.generateTexture('tile_encounter', TILE, TILE);
    g.clear();
  }

  // --- Wall tile ---
  if (missing('tile_wall')) {
    g.fillStyle(0x14141c).fillRect(0, 0, TILE, TILE);
    g.fillStyle(0x2c2c3c).fillRect(0, 0, TILE, 6);
    g.fillStyle(0x2c2c3c).fillRect(0, 0, 6, TILE);
    g.fillStyle(0x0a0a10).fillRect(0, TILE - 6, TILE, 6);
    g.lineStyle(2, 0x070709);
    g.beginPath();
    g.moveTo(0, TILE / 2);
    g.lineTo(TILE, TILE / 2);
    g.moveTo(TILE / 2, 0);
    g.lineTo(TILE / 2, TILE / 2);
    g.moveTo(TILE / 4, TILE / 2);
    g.lineTo(TILE / 4, TILE);
    g.strokePath();
    g.generateTexture('tile_wall', TILE, TILE);
    g.clear();
  }

  // --- Treasure tile ---
  if (missing('tile_treasure')) {
    g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
    g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
    g.fillStyle(0x6e4621).fillRoundedRect(14, 22, 36, 26, 4);
    g.fillStyle(0x8a5a2b).fillRoundedRect(14, 18, 36, 12, 4);
    g.fillStyle(0xf1c40f).fillRect(30, 22, 4, 22);
    g.generateTexture('tile_treasure', TILE, TILE);
    g.clear();
  }

  // --- Stairs tile ---
  if (missing('tile_stairs')) {
    g.fillStyle(0x1c1c28).fillRect(0, 0, TILE, TILE);
    for (let i = 0; i < 4; i++) {
      const shade = 0x2a2a3a + i * 0x0a0a0a;
      g.fillStyle(shade).fillRect(8, 10 + i * 12, TILE - 16, 9);
    }
    g.fillStyle(0xe6c46a);
    g.fillTriangle(TILE / 2 - 8, 50, TILE / 2 + 8, 50, TILE / 2, 60);
    g.generateTexture('tile_stairs', TILE, TILE);
    g.clear();
  }

  // --- Fog overlay (always procedural — just a dark square) ---
  g.fillStyle(0x05050a, 1).fillRect(0, 0, TILE, TILE);
  g.generateTexture('fog', TILE, TILE);
  g.clear();

  // --- Spark (particles) ---
  if (missing('spark')) {
    g.fillStyle(0xffffff, 1).fillCircle(8, 8, 8);
    g.generateTexture('spark', 16, 16);
    g.clear();
  }

  // --- Party member sprites — skip any class with real art already loaded ---
  const pcx = PARTY_TEX_W / 2;
  const pcy = PARTY_TEX_H / 2;
  Object.entries(CLASS_COLORS).forEach(([cls, color]) => {
    if (scene.textures.exists(`pc_${cls}`)) return;
    const outline = darken(color, 0.45);
    g.fillStyle(0x000000, 0).fillRect(0, 0, PARTY_TEX_W, PARTY_TEX_H);
    g.fillStyle(outline, 1).fillCircle(pcx, pcy + 4, 36);
    g.fillStyle(color, 1).fillCircle(pcx, pcy, 33);
    g.fillStyle(0xffffff, 0.22).fillCircle(pcx - 11, pcy - 12, 12);
    g.lineStyle(3, outline).strokeCircle(pcx, pcy, 33);
    g.generateTexture(`pc_${cls}`, PARTY_TEX_W, PARTY_TEX_H);
    g.clear();
  });

  // --- Monster sprites — skip any monster with real art already loaded ---
  const mcx = MONSTER_TEX_W / 2;
  const mcy = MONSTER_TEX_H / 2;
  MONSTERS.forEach((m) => {
    if (scene.textures.exists(`mob_${m.name}`)) return;
    const color = MONSTER_COLORS[m.name] || 0x888888;
    const outline = darken(color, 0.4);
    g.fillStyle(0x000000, 0).fillRect(0, 0, MONSTER_TEX_W, MONSTER_TEX_H);
    g.fillStyle(outline, 1).fillEllipse(mcx, mcy + 3, 84, 78);
    g.fillStyle(color, 1).fillEllipse(mcx, mcy, 78, 72);
    g.fillStyle(0xffffff, 1).fillCircle(mcx - 12, mcy - 8, 9);
    g.fillStyle(0xffffff, 1).fillCircle(mcx + 12, mcy - 8, 9);
    g.fillStyle(0x1a0000, 1).fillCircle(mcx - 11, mcy - 6, 4);
    g.fillStyle(0x1a0000, 1).fillCircle(mcx + 13, mcy - 6, 4);
    g.generateTexture(`mob_${m.name}`, MONSTER_TEX_W, MONSTER_TEX_H);
    g.clear();
  });

  g.destroy();
}
