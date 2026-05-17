import { DUNGEON_SIZE, TILE_TYPES } from '../data/constants';

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// Flood-fill from the start tile, returning which cells are reachable
// without crossing a wall.
function reachableFrom(grid, startX, startY) {
  const size = grid.length;
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const stack = [[startX, startY]];
  seen[startY][startX] = true;
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of NEIGHBOURS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
      if (seen[ny][nx] || grid[ny][nx] === TILE_TYPES.WALL) continue;
      seen[ny][nx] = true;
      stack.push([nx, ny]);
    }
  }
  return seen;
}

// Knock down walls until every non-wall tile is reachable from the start,
// so no encounter, treasure, or the stairs can be sealed off.
function ensureConnected(grid) {
  const size = grid.length;
  for (let guard = 0; guard < size * size * 4; guard++) {
    const seen = reachableFrom(grid, 0, 0);
    let isolated = false;
    for (let y = 0; y < size && !isolated; y++) {
      for (let x = 0; x < size && !isolated; x++) {
        if (!seen[y][x] && grid[y][x] !== TILE_TYPES.WALL) isolated = true;
      }
    }
    if (!isolated) return;

    // Prefer a wall that directly bridges the reachable region to an
    // isolated pocket; otherwise erode any wall on the reachable frontier.
    let bridge = null;
    let frontier = null;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (grid[y][x] !== TILE_TYPES.WALL) continue;
        let touchesReachable = false;
        let touchesIsolated = false;
        for (const [dx, dy] of NEIGHBOURS) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (seen[ny][nx]) touchesReachable = true;
          else if (grid[ny][nx] !== TILE_TYPES.WALL) touchesIsolated = true;
        }
        if (touchesReachable && touchesIsolated) bridge = [x, y];
        else if (touchesReachable) frontier = [x, y];
      }
    }
    const open = bridge || frontier;
    if (!open) return;
    grid[open[1]][open[0]] = TILE_TYPES.FLOOR;
  }
}

export function generateDungeon() {
  const size = DUNGEON_SIZE;
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill(TILE_TYPES.FLOOR));

  // Walls — never on the start tile or the stairs tile.
  for (let i = 0; i < 20; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if ((x === 0 && y === 0) || (x === size - 1 && y === size - 1)) continue;
    grid[y][x] = TILE_TYPES.WALL;
  }

  grid[size - 1][size - 1] = TILE_TYPES.STAIRS;

  ensureConnected(grid);

  // Encounters and treasure, only on open floor.
  const scatter = (type, count) => {
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (x === 0 && y === 0) continue;
      if (grid[y][x] === TILE_TYPES.FLOOR) grid[y][x] = type;
    }
  };
  scatter(TILE_TYPES.ENCOUNTER, 8);
  scatter(TILE_TYPES.TREASURE, 3);

  return grid;
}
