import { DUNGEON_SIZE, TILE_TYPES } from '../data/constants';

export function generateDungeon() {
  const size = DUNGEON_SIZE;
  const grid = Array(size).fill().map(() => Array(size).fill(TILE_TYPES.FLOOR));

  // Add walls
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!(x === 0 && y === 0)) grid[y][x] = TILE_TYPES.WALL;
  }

  // Add encounters
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!(x === 0 && y === 0) && grid[y][x] === TILE_TYPES.FLOOR) {
      grid[y][x] = TILE_TYPES.ENCOUNTER;
    }
  }

  // Add treasure
  for (let i = 0; i < 3; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!(x === 0 && y === 0) && grid[y][x] === TILE_TYPES.FLOOR) {
      grid[y][x] = TILE_TYPES.TREASURE;
    }
  }

  // Add stairs
  grid[size-1][size-1] = TILE_TYPES.STAIRS;

  return grid;
}
