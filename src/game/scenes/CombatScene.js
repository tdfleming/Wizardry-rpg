import Phaser from 'phaser';
import { gameStore } from '../store';
import { GAME_WIDTH, CLASS_COLORS, SPELL_COLORS } from '../constants';
import { TILE_TYPES } from '../../data/constants';
import {
  calculateDamage,
  checkCriticalHit,
  applyCriticalMultiplier,
  calculateHealing,
} from '../../utils/combatUtils';
import { checkLevelUp, getXpForLevel } from '../../utils/characterUtils';
import { SPELLS, SPELL_COST } from '../../data/spells';
import { audio } from '../audio';

const MONSTER_Y = 220;
const PARTY_Y = 540;
const PANEL_W = 150;
const PANEL_H = 168;

const HEAL_SPELLS = ['Heal', 'Lay on Hands'];

function spellColor(name) {
  const n = name.toLowerCase();
  if (n.includes('fire')) return SPELL_COLORS.fire;
  if (n.includes('ice')) return SPELL_COLORS.ice;
  if (n.includes('lightning')) return SPELL_COLORS.lightning;
  if (HEAL_SPELLS.includes(name)) return SPELL_COLORS.heal;
  return SPELL_COLORS.default;
}

export class CombatScene extends Phaser.Scene {
  constructor() {
    super('CombatScene');
  }

  init(data) {
    this.monsters = data.monsters.map((m) => ({ ...m }));
    this.encounter = data.encounter;
    this.party = gameStore.getState().party.map((p) => ({ ...p }));
    this.dungeonLevel = gameStore.getState().dungeonLevel;
    this.phase = 'busy';
    this.actor = null;
    this.pendingSpell = null;
    this.menuObjects = [];
  }

  create() {
    gameStore.setState({ inCombat: true });
    audio.playMusic('combat');
    this.add.rectangle(0, 0, GAME_WIDTH, 768, 0x0c0c14).setOrigin(0);
    this.add.rectangle(0, 0, GAME_WIDTH, 360, 0x141426).setOrigin(0);

    this.add
      .text(GAME_WIDTH / 2, 38, 'BATTLE', {
        fontFamily: "Fondamento, Georgia, serif",
        fontSize: '34px',
        color: '#e6c46a',
      })
      .setOrigin(0.5);

    this.messageText = this.add
      .text(GAME_WIDTH / 2, 84, '', {
        fontFamily: "Fondamento, Georgia, serif",
        fontSize: '19px',
        color: '#d8d8e4',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 120 },
      })
      .setOrigin(0.5);

    this.buildMonsters();
    this.buildParty();

    this.setMessage('The enemy stirs. Choose your champion.');
    this.promptMember();
  }

  // --- layout helpers ------------------------------------------------------

  makeBar(x, y, w, h, color) {
    const bg = this.add.rectangle(x, y, w, h, 0x000000).setOrigin(0, 0.5);
    bg.setStrokeStyle(1, 0x000000);
    const fill = this.add.rectangle(x, y, w, h, color).setOrigin(0, 0.5);
    return {
      bg,
      fill,
      width: w,
      set(ratio) {
        this.fill.scaleX = Phaser.Math.Clamp(ratio, 0, 1);
      },
      setDepth(d) {
        this.bg.setDepth(d);
        this.fill.setDepth(d);
        return this;
      },
    };
  }

  buildMonsters() {
    const n = this.monsters.length;
    const spacing = 210;
    const startX = GAME_WIDTH / 2 - ((n - 1) * spacing) / 2;
    this.monsterViews = this.monsters.map((m, i) => {
      const x = startX + i * spacing;
      const baseScale = m.name === 'Dragon' ? 0.82 : 1.0;
      const sprite = this.add
        .image(x, MONSTER_Y, `mob_${m.name}`)
        .setScale(baseScale);
      const nameText = this.add
        .text(x, MONSTER_Y - 78, `${m.icon} ${m.name}`, {
          fontFamily: "Fondamento, Georgia, serif",
          fontSize: '17px',
          color: '#f0d9a8',
        })
        .setOrigin(0.5);
      const bar = this.makeBar(x - 56, MONSTER_Y + 70, 112, 12, 0xc0392b);
      const zone = this.add
        .rectangle(x, MONSTER_Y, 150, 200, 0xffffff, 0)
        .setInteractive();
      const view = { monster: m, sprite, nameText, bar, zone, baseScale };
      this.refreshMonster(view);
      return view;
    });
  }

  refreshMonster(view) {
    const alive = view.monster.currentHp > 0;
    view.bar.set(view.monster.currentHp / view.monster.hp);
    view.bar.fill.setVisible(alive);
    if (!alive) {
      view.sprite.setAlpha(0.18).setTint(0x444444);
      view.bar.bg.setVisible(false);
      view.nameText.setAlpha(0.3);
    }
  }

  buildParty() {
    const n = this.party.length;
    const spacing = PANEL_W + 8;
    const startX = GAME_WIDTH / 2 - ((n - 1) * spacing) / 2;
    this.partyViews = this.party.map((member, i) => {
      const x = startX + i * spacing;
      const color = CLASS_COLORS[member.class] || 0x888888;
      const panel = this.add
        .rectangle(x, PARTY_Y, PANEL_W, PANEL_H, 0x1d1d2c)
        .setStrokeStyle(2, 0x3a3a52);
      const sprite = this.add
        .image(x, PARTY_Y - 42, `pc_${member.class}`)
        .setScale(0.56);
      const nameText = this.add
        .text(x, PARTY_Y - 2, member.name, {
          fontFamily: "Fondamento, Georgia, serif",
          fontSize: '16px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
      const hpBar = this.makeBar(x - 60, PARTY_Y + 22, 120, 11, 0x2ecc71);
      const mpBar = this.makeBar(x - 60, PARTY_Y + 44, 120, 9, 0x3498db);
      const hpText = this.add
        .text(x, PARTY_Y + 22, '', {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
      const mpText = this.add
        .text(x, PARTY_Y + 44, '', {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
      const zone = this.add
        .rectangle(x, PARTY_Y, PANEL_W, PANEL_H, 0xffffff, 0)
        .setInteractive();
      const view = {
        member,
        index: i,
        panel,
        sprite,
        nameText,
        hpBar,
        mpBar,
        hpText,
        mpText,
        zone,
        accent: color,
      };
      this.refreshPartyMember(view);
      return view;
    });
  }

  refreshPartyMember(view) {
    const m = view.member;
    view.hpBar.set(m.hp / m.maxHp);
    view.mpBar.set(m.maxMp > 0 ? m.mp / m.maxMp : 0);
    view.hpText.setText(`HP ${m.hp}/${m.maxHp}`);
    view.mpText.setText(m.maxMp > 0 ? `MP ${m.mp}/${m.maxMp}` : '—');
    if (!m.alive) {
      view.panel.setFillStyle(0x16161e);
      view.sprite.setAlpha(0.22).setTint(0x333333);
      view.nameText.setColor('#6a6a78');
    }
  }

  // --- turn flow -----------------------------------------------------------

  setMessage(text) {
    this.messageText.setText(text);
    gameStore.setState({ message: text });
  }

  clearMenu() {
    this.menuObjects.forEach((o) => o.destroy());
    this.menuObjects = [];
  }

  promptMember() {
    this.phase = 'selectMember';
    this.actor = null;
    this.pendingSpell = null;
    this.clearMenu();
    this.disableAllZones();
    this.setMessage('Choose a champion to act.');

    let any = false;
    this.partyViews.forEach((pv) => {
      if (!pv.member.alive) return;
      any = true;
      this.enableZone(pv, pv.panel, () => this.onSelectActor(pv));
    });
    if (!any) this.defeat();
  }

  onSelectActor(pv) {
    if (this.phase !== 'selectMember') return;
    this.actor = pv;
    this.disableAllZones();
    this.showActions();
  }

  showActions() {
    this.phase = 'action';
    this.clearMenu();
    this.setMessage(`${this.actor.member.name} — choose an action.`);

    const buttons = [['Attack', () => this.beginAttack()]];
    const spells = SPELLS[this.actor.member.class];
    if (spells && spells.length > 0) {
      const canCast = this.actor.member.mp >= SPELL_COST;
      buttons.push([
        canCast ? 'Magic' : 'Magic (no MP)',
        () => canCast && this.showSpells(),
      ]);
    }
    buttons.push(['Back', () => this.promptMember()]);
    this.layoutButtons(buttons);
  }

  showSpells() {
    this.phase = 'spell';
    this.clearMenu();
    this.setMessage(`${this.actor.member.name} — choose a spell.`);
    const spells = SPELLS[this.actor.member.class] || [];
    const buttons = spells.map((s) => [s, () => this.beginSpell(s)]);
    buttons.push(['Back', () => this.showActions()]);
    this.layoutButtons(buttons);
  }

  layoutButtons(buttons) {
    const w = 190;
    const h = 46;
    const gap = 16;
    const total = buttons.length * w + (buttons.length - 1) * gap;
    let x = GAME_WIDTH / 2 - total / 2 + w / 2;
    buttons.forEach(([label, cb]) => {
      this.makeButton(x, 690, w, h, label, cb);
      x += w + gap;
    });
  }

  makeButton(x, y, w, h, label, cb) {
    const bg = this.add
      .rectangle(x, y, w, h, 0x2a2a44)
      .setStrokeStyle(2, 0xe6c46a)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: "Fondamento, Georgia, serif",
        fontSize: '18px',
        color: '#f0d9a8',
      })
      .setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x3d3d63));
    bg.on('pointerout', () => bg.setFillStyle(0x2a2a44));
    bg.on('pointerdown', () => cb());
    this.menuObjects.push(bg, text);
  }

  beginAttack() {
    this.phase = 'selectEnemy';
    this.pendingSpell = null;
    this.clearMenu();
    this.setMessage('Select a target.');
    this.enableEnemyTargets();
    this.menuBackButton(() => this.showActions());
  }

  beginSpell(spell) {
    this.pendingSpell = spell;
    this.clearMenu();
    if (HEAL_SPELLS.includes(spell)) {
      this.phase = 'selectAlly';
      this.setMessage(`Select an ally to receive ${spell}.`);
      this.partyViews.forEach((pv) => {
        if (!pv.member.alive) return;
        this.enableZone(pv, pv.panel, () => this.onSelectAlly(pv));
      });
    } else {
      this.phase = 'selectEnemy';
      this.setMessage(`Select a target for ${spell}.`);
      this.enableEnemyTargets();
    }
    this.menuBackButton(() => this.showSpells());
  }

  menuBackButton(cb) {
    this.makeButton(GAME_WIDTH / 2, 690, 190, 46, 'Back', () => {
      this.disableAllZones();
      cb();
    });
  }

  enableEnemyTargets() {
    this.monsterViews.forEach((mv) => {
      if (mv.monster.currentHp <= 0) return;
      this.enableZone(mv, mv.sprite, () => this.onSelectEnemy(mv));
    });
  }

  enableZone(view, hoverTarget, handler) {
    view.zone.setInteractive();
    view.zone.removeAllListeners();
    const base = hoverTarget.scaleX || 1;
    view.zone.on('pointerover', () => hoverTarget.setScale(base * 1.12));
    view.zone.on('pointerout', () => hoverTarget.setScale(base));
    view.zone.on('pointerdown', () => {
      hoverTarget.setScale(base);
      handler();
    });
  }

  disableAllZones() {
    [...(this.monsterViews || []), ...(this.partyViews || [])].forEach((v) => {
      v.zone.disableInteractive();
      v.zone.removeAllListeners();
    });
  }

  // --- resolution ----------------------------------------------------------

  onSelectEnemy(mv) {
    if (this.phase !== 'selectEnemy') return;
    this.phase = 'busy';
    this.disableAllZones();
    this.clearMenu();
    if (this.pendingSpell) this.resolveDamageSpell(this.actor, mv, this.pendingSpell);
    else this.resolvePhysical(this.actor, mv);
  }

  onSelectAlly(pv) {
    if (this.phase !== 'selectAlly') return;
    this.phase = 'busy';
    this.disableAllZones();
    this.clearMenu();
    this.resolveHeal(this.actor, pv, this.pendingSpell);
  }

  resolvePhysical(actorView, targetView) {
    const actor = actorView.member;
    const isCrit = checkCriticalHit(actor);
    let damage = calculateDamage(actor, true);
    if (isCrit) damage = applyCriticalMultiplier(damage);

    this.lunge(actorView.sprite, targetView.sprite, () => {
      audio.hit(isCrit);
      this.applyMonsterDamage(targetView, damage);
      this.burst(targetView.sprite.x, targetView.sprite.y, 0xffffff, isCrit ? 30 : 16);
      this.floatText(
        targetView.sprite.x,
        targetView.sprite.y - 40,
        isCrit ? `CRIT ${damage}` : `${damage}`,
        isCrit ? '#ff5252' : '#ffffff',
      );
      this.cameras.main.shake(isCrit ? 220 : 110, isCrit ? 0.012 : 0.006);
      this.setMessage(
        `${actor.name} strikes ${targetView.monster.name} for ${damage} damage!` +
          (isCrit ? '  CRITICAL HIT!' : ''),
      );
      this.time.delayedCall(520, () => this.afterPlayerAction());
    });
  }

  resolveDamageSpell(actorView, targetView, spell) {
    const actor = actorView.member;
    actor.mp = Math.max(0, actor.mp - SPELL_COST);
    this.refreshPartyMember(actorView);
    this.syncParty();
    const damage = calculateDamage(actor, false);
    const color = spellColor(spell);
    const n = spell.toLowerCase();
    audio.cast(
      n.includes('fire')
        ? 'fire'
        : n.includes('ice')
          ? 'ice'
          : n.includes('lightning')
            ? 'lightning'
            : 'default',
    );

    this.castFlash(actorView.sprite, color);
    this.time.delayedCall(260, () => {
      this.applyMonsterDamage(targetView, damage);
      this.burst(targetView.sprite.x, targetView.sprite.y, color, 36);
      this.floatText(
        targetView.sprite.x,
        targetView.sprite.y - 40,
        `${damage}`,
        '#c39bff',
      );
      this.cameras.main.shake(140, 0.008);
      this.setMessage(
        `${actor.name} casts ${spell} on ${targetView.monster.name} for ${damage} damage!`,
      );
      this.time.delayedCall(520, () => this.afterPlayerAction());
    });
  }

  resolveHeal(actorView, targetView, spell) {
    const actor = actorView.member;
    actor.mp = Math.max(0, actor.mp - SPELL_COST);
    const healing = calculateHealing();
    const target = targetView.member;
    target.hp = Math.min(target.maxHp, target.hp + healing);

    this.refreshPartyMember(actorView);
    this.refreshPartyMember(targetView);
    this.syncParty();

    audio.heal();
    this.castFlash(actorView.sprite, SPELL_COLORS.heal);
    this.burst(targetView.sprite.x, targetView.sprite.y, SPELL_COLORS.heal, 28);
    this.floatText(
      targetView.sprite.x,
      targetView.sprite.y - 40,
      `+${healing}`,
      '#7CFC9A',
    );
    this.setMessage(`${actor.name} casts ${spell}, restoring ${healing} HP to ${target.name}.`);
    this.time.delayedCall(700, () => this.afterPlayerAction());
  }

  applyMonsterDamage(view, damage) {
    view.monster.currentHp = Math.max(0, view.monster.currentHp - damage);
    view.sprite.setTint(0xffffff);
    this.time.delayedCall(120, () => {
      if (view.monster.currentHp > 0) view.sprite.clearTint();
    });
    this.refreshMonster(view);
    if (view.monster.currentHp <= 0) {
      this.tweens.add({
        targets: view.sprite,
        alpha: 0.18,
        scale: view.baseScale * 0.7,
        duration: 320,
      });
    }
  }

  afterPlayerAction() {
    if (this.monsters.every((m) => m.currentHp <= 0)) {
      this.victory();
      return;
    }
    this.monsterTurn();
  }

  monsterTurn() {
    this.phase = 'busy';
    const attackers = this.monsterViews.filter((mv) => mv.monster.currentHp > 0);
    let step = 0;

    const runNext = () => {
      if (step >= attackers.length) {
        if (this.party.every((p) => !p.alive)) this.defeat();
        else this.promptMember();
        return;
      }
      const mv = attackers[step];
      step += 1;
      const targets = this.partyViews.filter((pv) => pv.member.alive);
      if (targets.length === 0) {
        this.defeat();
        return;
      }
      const targetView = Phaser.Utils.Array.GetRandom(targets);
      const monster = mv.monster;
      const damage =
        Math.floor(Math.random() * monster.damage) +
        Math.floor(monster.damage / 2);

      this.lunge(mv.sprite, targetView.sprite, () => {
        audio.monsterHit();
        const target = targetView.member;
        target.hp = Math.max(0, target.hp - damage);
        target.alive = target.hp > 0;
        this.refreshPartyMember(targetView);
        this.syncParty();
        this.burst(targetView.sprite.x, targetView.sprite.y, 0xff4444, 14);
        this.floatText(
          targetView.sprite.x,
          targetView.sprite.y - 30,
          `${damage}`,
          '#ff6b6b',
        );
        this.cameras.main.shake(110, 0.006);
        this.setMessage(
          `${monster.name} attacks ${target.name} for ${damage} damage!`,
        );
        this.time.delayedCall(620, runNext);
      });
    };

    runNext();
  }

  // --- outcomes ------------------------------------------------------------

  victory() {
    this.phase = 'busy';
    this.disableAllZones();
    this.clearMenu();

    const totalXp = this.monsters.reduce((sum, m) => sum + m.xp, 0);
    const totalGold = Math.floor(Math.random() * 30) + 10;
    const aliveCount = this.party.filter((p) => p.alive).length || 1;

    const leveled = [];
    const rewarded = this.party.map((p) => {
      if (!p.alive) return p;
      let char = {
        ...p,
        xp: p.xp + totalXp,
        gold: p.gold + Math.floor(totalGold / aliveCount),
      };
      const startLevel = char.level;
      let next = checkLevelUp(char);
      while (next.level > char.level && next.xp >= getXpForLevel(next.level + 1)) {
        char = next;
        next = checkLevelUp(char);
      }
      char = next;
      if (char.level > startLevel) leveled.push(char.name);
      return char;
    });

    gameStore.setState({ party: rewarded });

    let msg = `Victory! The party gains ${totalXp} XP and ${totalGold} gold.`;
    if (leveled.length > 0) msg += `  ${leveled.join(', ')} leveled up!`;
    this.setMessage(msg);

    this.burst(GAME_WIDTH / 2, MONSTER_Y, 0xf1c40f, 60);
    audio.victory();
    if (leveled.length > 0) this.time.delayedCall(800, () => audio.levelUp());

    this.time.delayedCall(1900, () => {
      if (this.encounter) {
        const state = gameStore.getState();
        const dungeon = state.dungeon.map((row) => row.slice());
        dungeon[this.encounter.y][this.encounter.x] = TILE_TYPES.FLOOR;
        gameStore.setState({ dungeon });
      }
      this.scene.start('DungeonScene');
    });
  }

  defeat() {
    this.phase = 'busy';
    this.disableAllZones();
    this.clearMenu();
    this.syncParty();
    this.setMessage('The party has fallen...');
    this.cameras.main.shake(400, 0.014);
    audio.defeat();
    this.time.delayedCall(1400, () => {
      gameStore.gameOver('Your party has been slain in the depths of the dungeon.');
    });
  }

  syncParty() {
    gameStore.setState({ party: this.party.map((p) => ({ ...p })) });
  }

  // --- effects -------------------------------------------------------------

  lunge(sprite, target, onHit) {
    const ox = sprite.x;
    const oy = sprite.y;
    const dx = (target.x - ox) * 0.32;
    const dy = (target.y - oy) * 0.32;
    this.tweens.add({
      targets: sprite,
      x: ox + dx,
      y: oy + dy,
      duration: 150,
      ease: 'Quad.easeIn',
      yoyo: true,
      onYoyo: onHit,
    });
  }

  castFlash(sprite, color) {
    sprite.setTint(color);
    this.tweens.add({
      targets: sprite,
      scale: sprite.scaleX * 1.18,
      duration: 130,
      yoyo: true,
      onComplete: () => sprite.clearTint(),
    });
  }

  floatText(x, y, text, color) {
    const label = this.add
      .text(x, y, text, {
        fontFamily: "Fondamento, Georgia, serif",
        fontSize: '26px',
        color,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(50);
    this.tweens.add({
      targets: label,
      y: y - 56,
      alpha: 0,
      duration: 850,
      ease: 'Quad.easeOut',
      onComplete: () => label.destroy(),
    });
  }

  burst(x, y, color, count) {
    const emitter = this.add.particles(x, y, 'spark', {
      speed: { min: 70, max: 260 },
      lifespan: 560,
      scale: { start: 0.8, end: 0 },
      tint: color,
      emitting: false,
    });
    emitter.setDepth(40);
    emitter.explode(count);
    this.time.delayedCall(900, () => emitter.destroy());
  }
}
