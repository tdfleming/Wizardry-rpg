# ⚔️ Wizardry RPG ⚔️

A modern React-based dungeon crawler inspired by the classic Wizardry games, featuring turn-based combat, party management, and procedurally generated dungeons.

## 🎮 Features

### Core Gameplay
- **6 Character Classes**: Fighter, Mage, Priest, Thief, Ranger, Paladin
- **Turn-Based Combat**: Strategic battles with class-specific attacks and spells
- **Dungeon Exploration**: Grid-based movement with procedurally generated levels
- **Party Management**: Create and manage a party of up to 6 adventurers
- **Leveling System**: Characters gain XP, level up, and increase their stats

### Combat System
- **Class-Specific Animations**: Each class has unique attack styles
  - Fighters: Powerful sword slashes
  - Thieves: Lightning-fast dagger strikes
  - Rangers: Precise arrow shots
  - Mages: Elemental spells (Fireball, Ice Lance, Lightning)
  - Priests: Healing and holy magic
- **Critical Hits**: 15% base chance + DEX bonus, deals 1.8x damage
- **Spell System**: MP-based magic with healing and offensive spells
- **Advanced Visual Effects**:
  - Particle system with spell-specific effects (fire embers, ice crystals, lightning bolts)
  - Hit sparks and impact particles on attacks
  - Death explosions and magical glitter
  - Floating damage numbers with arc trajectories
  - Hit-stop freeze frames for impactful combat feel
  - Screen shake (light, medium, heavy) based on attack power
  - Flash effects (damage, healing, critical hits)
  - Treasure sparkle and level-up burst effects

### UI/UX
- **Keyboard Navigation**: Full keyboard support for movement and combat
  - Arrow Keys/WASD for exploration
  - Number keys for combat selection
  - Hotkeys for actions
- **Battle Animations**: Dynamic sprite movements, projectiles, and effects
- **Victory Celebrations**: Confetti and animations when you win
- **Character Auras**: Class-colored visual effects
- **Map System**: Live dungeon map with color-coded tiles
- **Alert System**: Top-positioned alerts for important messages

### Polish
- **Custom Typography**: Fondamento font for that medieval RPG feel
- **Status Tracking**: Real-time HP/MP bars, XP progress, gold tracking
- **Multiple Dungeon Levels**: Descend deeper for greater challenges
- **Treasure System**: Find gold and rewards throughout the dungeon
- **Rest Mechanic**: Recover HP/MP between battles

## 🎯 How to Play

### Party Creation
1. Select character classes from 6 options
2. Name your heroes
3. Build a party of 1-6 adventurers
4. Enter the dungeon!

### Exploration
- **Move Forward/Back**: Arrow Up/W, Arrow Down/S
- **Turn Left/Right**: Arrow Left/A, Arrow Right/D
- **Rest**: R key
- Watch for colored tiles:
  - 🟥 Red = Enemy encounters
  - 🟨 Yellow = Treasure
  - 🟦 Blue = Stairs to next level

### Combat
1. **Select Party Member**: Press 1-6
2. **Choose Action**: A for Attack, S for Spell
3. **Select Target**: Press 1-X to target enemy/ally
4. **ESC**: Cancel selection

### Character Classes
- **Fighter** ⚔️: High HP/STR, powerful physical attacks
- **Mage** 🔮: Low HP, high MP/INT, devastating spells
- **Priest** ✨: Balanced stats, healing and holy magic
- **Thief** 🗝️: High DEX, critical hit specialist
- **Ranger** 🏹: Balanced combat, ranged attacks
- **Paladin** 🛡️: Tank/healer hybrid with holy powers

## 🛠️ Technical Details

### Built With
- **React 18** with hooks (useState, useEffect)
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Google Fonts** (Fondamento)

### Project Structure
```
Wizardry-rpg/
├── src/
│   ├── components/
│   │   ├── combat/          # Combat screen components
│   │   │   ├── BattleAnimations.jsx
│   │   │   ├── CharacterSprite.jsx
│   │   │   ├── Combat.jsx
│   │   │   ├── EnemyInfo.jsx
│   │   │   ├── MonsterSprite.jsx
│   │   │   └── PartyActions.jsx
│   │   ├── exploration/     # Exploration screen components
│   │   │   ├── DungeonMap.jsx
│   │   │   ├── Exploration.jsx
│   │   │   ├── NavigationControls.jsx
│   │   │   └── PartyStatus.jsx
│   │   ├── party/           # Party creation components
│   │   │   ├── ClassSelector.jsx
│   │   │   ├── PartyCreation.jsx
│   │   │   └── PartyList.jsx
│   │   ├── ui/              # Reusable UI components
│   │   │   └── Alert.jsx
│   │   └── GameOver.jsx     # Game over screen
│   ├── data/                # Game data constants
│   │   ├── classes.js
│   │   ├── constants.js
│   │   ├── monsters.js
│   │   └── spells.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameState.js
│   │   └── useKeyboardControls.js
│   ├── utils/               # Utility functions
│   │   ├── characterUtils.js
│   │   ├── combatUtils.js
│   │   └── dungeonUtils.js
│   ├── styles/              # CSS files
│   │   └── animations.css
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

### Game Mechanics
- **XP Curve**: 100 base XP, scales by 1.5x per level
- **Stat Growth**: HP/MP/attributes increase on level up
- **Critical Calculation**: Base 15% + (DEX/200)
- **Dungeon Generation**: Procedural 10x10 grid with walls, encounters, treasure
- **Enemy Scaling**: Monster difficulty increases with dungeon level

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm (or yarn/pnpm)

### Setup
1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd Wizardry-rpg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 🎨 Screenshots

*(Add screenshots of party creation, exploration, and combat)*

## 🚀 Future Enhancements

- Equipment system
- More classes and spells
- Status effects (poison, stun, etc.)
- Boss encounters
- Save/load functionality
- Permadeath mode
- Achievement system
- Sound effects and music

## 📝 License

MIT License - Feel free to use and modify!

## 🙏 Credits

Inspired by the classic Wizardry series by Sir-Tech Software.

---

Made with ⚔️ by Tony
