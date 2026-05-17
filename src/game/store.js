// Framework-agnostic game store: the single source of truth shared by the
// React shell (menus + HUD) and the Phaser scenes (dungeon + combat).
// React reads it through useSyncExternalStore; Phaser scenes read getState()
// and call setState() directly.
import { generateDungeon } from '../utils/dungeonUtils';
import { DUNGEON_SIZE } from '../data/constants';

const WELCOME = 'Welcome, adventurer! Create your party to begin.';

function makeVisited() {
  return Array.from({ length: DUNGEON_SIZE }, () =>
    Array(DUNGEON_SIZE).fill(false),
  );
}

function initialState() {
  return {
    // 'creation' | 'playing' | 'gameover'
    screen: 'creation',
    party: [],
    dungeonLevel: 1,
    position: { x: 0, y: 0, facing: 'S' },
    dungeon: null,
    visited: makeVisited(),
    message: WELCOME,
    // true while a Phaser CombatScene is active — the React HUD hides itself
    // so it does not overlap the combat UI Phaser draws on the canvas.
    inCombat: false,
  };
}

class GameStore {
  constructor() {
    this.state = initialState();
    this.listeners = new Set();
  }

  getState = () => this.state;

  subscribe = (fn) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  setState = (patch) => {
    const next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...next };
    this.listeners.forEach((fn) => fn());
  };

  startGame(party) {
    this.setState({
      screen: 'playing',
      party,
      dungeonLevel: 1,
      position: { x: 0, y: 0, facing: 'S' },
      dungeon: generateDungeon(),
      visited: makeVisited(),
      message: 'Your party enters the dungeon...',
    });
  }

  descend() {
    this.setState((s) => ({
      dungeonLevel: s.dungeonLevel + 1,
      dungeon: generateDungeon(),
      position: { x: 0, y: 0, facing: 'S' },
      visited: makeVisited(),
      message: 'You descend the stairs into deeper darkness...',
    }));
  }

  gameOver(message) {
    this.setState({ screen: 'gameover', message });
  }

  reset() {
    this.state = initialState();
    this.listeners.forEach((fn) => fn());
  }
}

export const gameStore = new GameStore();
