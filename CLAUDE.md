# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Wizardry RPG is a React-based dungeon crawler game inspired by the classic Wizardry series. It features turn-based combat, party management, and procedurally generated dungeons.

## Tech Stack

- **React 18** with hooks (functional components only)
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ES Modules** (type: "module" in package.json)

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── combat/         # Combat screen (BattleAnimations, Combat, CharacterSprite, etc.)
│   ├── exploration/    # Dungeon exploration (DungeonMap, Exploration, PartyStatus, etc.)
│   ├── party/          # Party creation (ClassSelector, PartyCreation, PartyList)
│   ├── effects/        # Visual effects (ParticleSystem, ScreenEffects, AtmosphereEffects)
│   ├── ui/             # Reusable UI (Alert, Button, EnhancedBar, Tooltip)
│   └── GameOver.jsx    # Victory/defeat screens
├── data/               # Game constants
│   ├── classes.js      # Character class definitions
│   ├── constants.js    # Game-wide constants
│   ├── monsters.js     # Monster definitions
│   └── spells.js       # Spell definitions
├── hooks/              # Custom React hooks
│   ├── useGameState.js       # Main game state management
│   └── useKeyboardControls.js # Keyboard input handling
├── utils/              # Utility functions
│   ├── characterUtils.js # Character creation, leveling, XP
│   ├── combatUtils.js    # Damage calculation, combat logic
│   └── dungeonUtils.js   # Dungeon generation, tile handling
├── styles/
│   └── animations.css  # CSS keyframe animations
├── App.jsx             # Main app with screen routing
├── main.jsx            # Entry point
└── index.css           # Global Tailwind styles
```

## Code Conventions

- **Components**: Functional components with hooks, one component per file
- **Styling**: Tailwind CSS classes inline, animations in `animations.css`
- **State**: Main game state in `useGameState` hook, local state with `useState`
- **No prop-types**: Disabled in ESLint config
- **Imports**: Use `@/` alias for src directory paths

## Key Architecture Patterns

### Game State Flow
The `useGameState` hook (`src/hooks/useGameState.js`) manages all game state and provides actions:
- `party`, `enemies`, `dungeon`, `currentFloor`, `gold`
- Game screen: `'title'` | `'party-creation'` | `'exploration'` | `'combat'` | `'game-over'`
- Combat state: `combatPhase`, `currentActorIndex`, `selectedTarget`

### Combat System
- Turn-based with initiative order
- Combat phases: `'selecting'` | `'animating'` | `'enemy-turn'` | `'victory'` | `'defeat'`
- Damage formula in `combatUtils.js` with critical hits (15% base + DEX bonus)

### Dungeon Generation
- 10x10 grid with procedural generation
- Tile types: `0` (floor), `1` (wall), `2` (enemy), `3` (treasure), `4` (stairs)
- Generation logic in `dungeonUtils.js`

## Adding New Features

### New Character Class
1. Add to `src/data/classes.js` with stats (hp, mp, str, int, dex) and icon
2. Add class-specific spells to `src/data/spells.js` if needed
3. Update `CharacterSprite.jsx` for visual representation

### New Monster
1. Add to `src/data/monsters.js` with stats and floor range
2. Update `MonsterSprite.jsx` for visual if needed

### New Spell
1. Add to `src/data/spells.js` with damage, cost, type, and description
2. Combat logic automatically handles offensive vs healing spells

### New Visual Effect
1. Add to `src/components/effects/ParticleSystem.jsx` for particle effects
2. Use `ScreenEffects.jsx` for screen-wide effects (shake, flash)
