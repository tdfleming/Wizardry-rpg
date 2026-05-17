// Generates placeholder textures with Phaser Graphics so the game is fully
// playable before any real art exists. Once generated art is dropped into
// public/assets/, BootScene will load those instead (see assetManifest.js).
import { TILE, CLASS_COLORS, MONSTER_COLORS } from './constants';
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

  // --- Floor tile ---
  g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
  g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
  g.fillStyle(0x2e2e3d);
  g.fillRect(10, 12, 16, 16);
  g.fillRect(34, 36, 18, 14);
  g.generateTexture('tile_floor', TILE, TILE);
  g.clear();

  // --- Encounter tile (drawn identical to floor so it stays hidden) ---
  g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
  g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
  g.fillStyle(0x2e2e3d);
  g.fillRect(18, 20, 16, 16);
  g.generateTexture('tile_encounter', TILE, TILE);
  g.clear();

  // --- Wall tile ---
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

  // --- Treasure tile ---
  g.fillStyle(0x262633).fillRect(0, 0, TILE, TILE);
  g.lineStyle(2, 0x33334a).strokeRect(1, 1, TILE - 2, TILE - 2);
  g.fillStyle(0x6e4621).fillRoundedRect(14, 22, 36, 26, 4);
  g.fillStyle(0x8a5a2b).fillRoundedRect(14, 18, 36, 12, 4);
  g.fillStyle(0xf1c40f).fillRect(30, 22, 4, 22);
  g.generateTexture('tile_treasure', TILE, TILE);
  g.clear();

  // --- Stairs tile ---
  g.fillStyle(0x1c1c28).fillRect(0, 0, TILE, TILE);
  for (let i = 0; i < 4; i++) {
    const shade = 0x2a2a3a + i * 0x0a0a0a;
    g.fillStyle(shade).fillRect(8, 10 + i * 12, TILE - 16, 9);
  }
  g.fillStyle(0xe6c46a);
  g.fillTriangle(TILE / 2 - 8, 50, TILE / 2 + 8, 50, TILE / 2, 60);
  g.generateTexture('tile_stairs', TILE, TILE);
  g.clear();

  // --- Fog overlay ---
  g.fillStyle(0x05050a, 1).fillRect(0, 0, TILE, TILE);
  g.generateTexture('fog', TILE, TILE);
  g.clear();

  // --- Spark (particles) ---
  g.fillStyle(0xffffff, 1).fillCircle(8, 8, 8);
  g.generateTexture('spark', 16, 16);
  g.clear();

  // --- Party member sprites, one per class ---
  Object.entries(CLASS_COLORS).forEach(([cls, color]) => {
    const outline = darken(color, 0.45);
    g.fillStyle(0x000000, 0).fillRect(0, 0, 48, 48);
    g.fillStyle(outline, 1).fillCircle(24, 26, 19);
    g.fillStyle(color, 1).fillCircle(24, 24, 17);
    g.fillStyle(0xffffff, 0.25).fillCircle(19, 18, 6);
    g.lineStyle(2, outline).strokeCircle(24, 24, 17);
    g.generateTexture(`pc_${cls}`, 48, 48);
    g.clear();
  });

  // --- Monster sprites, one per monster type ---
  MONSTERS.forEach((m) => {
    const color = MONSTER_COLORS[m.name] || 0x888888;
    const outline = darken(color, 0.4);
    g.fillStyle(0x000000, 0).fillRect(0, 0, 112, 112);
    g.fillStyle(outline, 1).fillEllipse(56, 60, 84, 78);
    g.fillStyle(color, 1).fillEllipse(56, 58, 78, 72);
    // eyes
    g.fillStyle(0xffffff, 1).fillCircle(44, 50, 9);
    g.fillStyle(0xffffff, 1).fillCircle(68, 50, 9);
    g.fillStyle(0x1a0000, 1).fillCircle(45, 52, 4);
    g.fillStyle(0x1a0000, 1).fillCircle(67, 52, 4);
    g.generateTexture(`mob_${m.name}`, 112, 112);
    g.clear();
  });

  g.destroy();
}
