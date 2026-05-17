// Phaser render constants — kept separate from gameplay data in src/data.
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// Top-down dungeon tile size in pixels. A 10x10 grid leaves vertical room
// above and below for the React HUD bands that overlay the canvas.
export const TILE = 48;

// Canvas dimensions every party / monster texture is padded to, so real art
// and procedural placeholders are interchangeable and scale uniformly.
export const PARTY_TEX_W = 100;
export const PARTY_TEX_H = 123;
export const MONSTER_TEX_W = 100;
export const MONSTER_TEX_H = 117;

// Class accent colours, used for placeholder art and combat UI highlights.
export const CLASS_COLORS = {
  FIGHTER: 0xc0392b,
  MAGE: 0x2980b9,
  PRIEST: 0xecf0f1,
  THIEF: 0x27ae60,
  RANGER: 0x9c6b3c,
  PALADIN: 0xf39c12,
};

// Monster accent colours, keyed by the name field in src/data/monsters.js.
export const MONSTER_COLORS = {
  Goblin: 0x6b8e23,
  Skeleton: 0xd9d9c8,
  Orc: 0x4a7023,
  'Dark Wizard': 0x6c3483,
  Dragon: 0x922b21,
};

// Spell colours for combat VFX, by keyword.
export const SPELL_COLORS = {
  fire: 0xff6b1a,
  ice: 0x4fc3f7,
  lightning: 0xf4d03f,
  heal: 0x2ecc71,
  default: 0x9b59b6,
};
