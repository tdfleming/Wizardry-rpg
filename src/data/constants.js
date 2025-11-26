export const GAME_STATES = {
  PARTY_CREATION: 'partyCreation',
  EXPLORING: 'exploring',
  COMBAT: 'combat',
  GAME_OVER: 'gameOver'
};

export const TILE_TYPES = {
  FLOOR: 'floor',
  WALL: 'wall',
  ENCOUNTER: 'encounter',
  TREASURE: 'treasure',
  STAIRS: 'stairs'
};

export const DIRECTIONS = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  W: { x: -1, y: 0 }
};

export const DUNGEON_SIZE = 10;
export const MAX_PARTY_SIZE = 6;
export const CRIT_BASE_CHANCE = 0.15;
export const CRIT_MULTIPLIER = 1.8;
