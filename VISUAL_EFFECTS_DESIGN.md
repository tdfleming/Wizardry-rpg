# Visual Effects Enhancement Design Document

## Overview
This document outlines the planned visual effects and modern enhancements for the Wizardry RPG game to create a more flashy, polished, and contemporary gaming experience.

## Implementation Priority

### Phase 1: Core Visual Effects (High Impact)
**Priority: CRITICAL - Immediate visual impact**

#### 1.1 Particle System
**Goal**: Create reusable particle system for dynamic visual effects

**Components**:
- `ParticleSystem.jsx` - Core particle engine
- Particle types:
  - `HitSparks` - Burst on physical attacks (yellow/orange sparks)
  - `MagicGlitter` - Magical spell particles (class-colored)
  - `BloodSplatter` - Combat impact feedback (red particles)
  - `HealingMotes` - Rising green/gold particles for healing
  - `FireEmbers` - Floating fire particles for fire spells
  - `IceCrystals` - Shattering ice for ice spells
  - `LightningBolts` - Crackling electricity for lightning
  - `DeathExplosion` - Enemy defeat particle burst
  - `TreasureSparkle` - Glittering particles for loot
  - `LevelUpBurst` - Radial burst on level up

**Technical Approach**:
```javascript
// Particle properties
{
  position: { x, y },
  velocity: { x, y },
  lifetime: number,
  size: number,
  color: string,
  gravity: boolean,
  fadeOut: boolean,
  rotation: number,
  rotationSpeed: number
}
```

**Animation Strategy**:
- Use CSS transforms for performance
- RequestAnimationFrame for smooth updates
- Particle pooling for memory efficiency
- Max 200 particles on screen at once

#### 1.2 Sound Effects System
**Goal**: Add audio feedback for all game actions

**Sound Categories**:
1. **Combat Sounds**
   - Sword slash (whoosh + clang)
   - Dagger stab (quick swipe)
   - Arrow shot (twang + whistle)
   - Fireball (whoosh + explosion)
   - Ice lance (crystalline impact)
   - Lightning (electric crackle + thunder)
   - Healing (magical chime)
   - Critical hit (metallic clang + bell)
   - Hit impact (thud/smack)
   - Monster attack (growl + impact)
   - Enemy death (defeated sound)

2. **UI Sounds**
   - Menu select (soft click)
   - Menu navigate (subtle tick)
   - Character select (confirm beep)
   - Victory fanfare (triumphant jingle)
   - Level up (ascending chime)
   - Error (negative beep)

3. **Exploration Sounds**
   - Footsteps (stone floor)
   - Door open (creak)
   - Treasure found (coins jingling)
   - Stairs descend (echoing steps)
   - Dungeon ambiance (drips, echoes)

4. **Music Tracks**
   - Menu theme (peaceful)
   - Exploration theme (mysterious)
   - Combat theme (intense)
   - Victory theme (triumphant)
   - Game over theme (somber)

**Technical Implementation**:
```javascript
// Sound manager hook
useSoundManager({
  volume: { master, sfx, music },
  enabled: boolean,
  spatialAudio: boolean
})

// Play sound with variations
playSound('swordSlash', {
  volume: 0.7,
  pitch: randomize(0.9, 1.1),
  pan: calculatePan(sourcePosition)
})
```

**Audio Sources**:
- Use royalty-free libraries: freesound.org, OpenGameArt
- Or generate with tools like jsfxr, ChipTone
- Format: Web Audio API compatible (MP3, OGG)

#### 1.3 Hit-Stop & Screen Effects
**Goal**: Add impact feel to combat actions

**Features**:
- **Hit-Stop**: 60-150ms freeze on hit
  - Normal hit: 60ms
  - Critical hit: 150ms
  - Spell hit: 100ms
  - Final blow: 200ms

- **Screen Shake Varieties**:
  - Light shake: ±3px (normal hit)
  - Medium shake: ±8px (critical hit)
  - Heavy shake: ±15px (spell/death)
  - Duration: 200-400ms

- **Camera Effects**:
  - Zoom punch: Scale 1.0 → 1.05 → 1.0 (200ms)
  - Flash overlay: White/colored flash on impact
  - Chromatic aberration: RGB split on heavy hits
  - Motion blur: Trail effect on fast attacks

- **Color Effects**:
  - Damage flash: Red tint on character
  - Heal flash: Green glow pulse
  - Crit flash: Yellow screen flash
  - Death fade: Grayscale + fade out

**Implementation**:
```css
/* Screen shake intensities */
@keyframes screenShakeLight { ... }
@keyframes screenShakeMedium { ... }
@keyframes screenShakeHeavy { ... }

/* Flash effects */
.flash-damage { background: rgba(255,0,0,0.3); }
.flash-crit { background: rgba(255,255,0,0.5); }
```

### Phase 2: UI/UX Polish (Medium Impact)
**Priority: HIGH - Professional appearance**

#### 2.1 Smooth Transitions
**Screen Transitions**:
- Fade in/out between game states (300ms)
- Slide transitions for panels (250ms easing)
- Cross-fade for content swaps
- Page curl effect for level transitions

**UI Animations**:
- Button hover: Scale 1.0 → 1.05 + shadow grow
- Button press: Scale 0.95 + shadow shrink
- Modal appear: Scale 0.8 → 1.0 with backdrop fade
- Toast notifications: Slide from top with bounce

#### 2.2 Enhanced Status Bars
**HP/MP Bars**:
- Smooth fill transitions (CSS transition: 0.3s ease-out)
- Color gradient based on percentage:
  - 100-70%: Green gradient
  - 69-30%: Yellow gradient
  - 29-0%: Red gradient
- Glow effect when full
- Pulse animation when low (<30%)
- Damage preview: Ghost bar showing damage before applying

**XP Bar**:
- Animated fill on XP gain
- Flash gold when gaining XP
- Rainbow shimmer on level up
- Progress percentage display

#### 2.3 Character Portraits
**Features**:
- Emotion states:
  - Idle: Normal expression
  - Attacking: Determined face
  - Taking damage: Pain expression
  - Low HP: Exhausted look
  - Victory: Celebrating
  - Defeated: Knocked out (X eyes)
- Animated breathing in idle
- Shake on damage
- Glow pulse on selection

**Implementation**:
- SVG-based portraits for scalability
- Class-specific portrait designs
- Emotion state machine

#### 2.4 Floating Combat Text
**Damage Numbers**:
- Arc trajectory (parabolic motion)
- Size based on damage amount
- Color coded:
  - Physical damage: Red
  - Magic damage: Purple
  - Critical: Yellow/gold with outline
  - Heal: Green
  - Miss: Gray "MISS!"
- Font: Bold, outlined for readability
- Randomized horizontal spread to avoid overlap

**Combat Labels**:
- "CRITICAL!" - Large, glowing, bouncing
- "MISS!" - Small, gray, quick fade
- "BLOCKED!" - Blue, sliding
- "RESISTED!" - Purple, shrinking
- "DODGED!" - Yellow, swoosh away

### Phase 3: Environmental Atmosphere (Medium Impact)
**Priority: MEDIUM - Immersion**

#### 3.1 Animated Backgrounds
**Dungeon Layers** (Parallax):
- Background wall (slowest)
- Mid-ground pillars (medium)
- Foreground debris (fastest)
- Scroll speeds: 0.3x, 0.6x, 1.0x

**Dynamic Elements**:
- Animated torches with flickering light
- Dripping water with ripples
- Floating dust motes
- Cobwebs swaying
- Fog/mist drifting (CSS animation)
- Background monsters in shadows

#### 3.2 Dynamic Lighting
**Light Sources**:
- Torch flicker: Random opacity 0.7-1.0
- Spell glow: Radial gradient around caster
- Character auras: Class-colored glow
- Combat flash: Bright burst on attacks
- Darkness creep: Vignette at screen edges

**Implementation**:
```css
.torch-light {
  box-shadow: 0 0 100px 50px rgba(255,150,50,0.8);
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

#### 3.3 Weather & Atmosphere
**Effects by Dungeon Level**:
- Level 1-2: Light dust, calm
- Level 3-5: Heavier fog, drips
- Level 6-8: Mist, falling debris
- Level 9-10: Heavy atmosphere, ominous particles
- Boss levels: Dramatic weather (rain, storm)

**Particle Density**:
- Adjustable in settings (off, low, medium, high)
- Default: Medium (30-50 particles)

### Phase 4: Advanced Features (Lower Priority)
**Priority: LOW - Nice to have**

#### 4.1 Combo System
**Mechanics**:
- Track consecutive hits without miss
- Combo multiplier: ×1.1, ×1.2, ×1.3 (max ×2.0)
- Visual: Combo counter with flame effect
- Audio: Pitch increases with combo
- Reset on miss or enemy turn

#### 4.2 Status Effects Visuals
**Effect Types**:
- Poison: Green bubbles rising
- Burn: Orange flames flickering
- Freeze: Blue ice crystals
- Stun: Yellow stars circling head
- Buff: Upward arrows + glow
- Debuff: Downward arrows + dark aura

#### 4.3 Skill Animations
**Class Ultimates**:
- Fighter: Whirlwind sword spin
- Mage: Giant fireball
- Priest: Divine light beam
- Thief: Shadow clone strikes
- Ranger: Multi-arrow volley
- Paladin: Holy ground effect

#### 4.4 Victory Screen Enhancement
**Features**:
- Spotlight on party
- Individual character victory poses
- Stat summary with animated counters
- Loot cards flipping to reveal
- Star rating system (1-3 stars)
- Screenshot button for sharing

## Technical Specifications

### Performance Targets
- 60 FPS during normal gameplay
- 30 FPS minimum during intense particle effects
- Particle budget: Max 200 simultaneous particles
- Animation frame budget: 16ms per frame
- Asset load time: <2 seconds total

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (test iOS)
- Mobile: Reduced particle effects for performance

### File Structure
```
src/
├── components/
│   ├── effects/
│   │   ├── ParticleSystem.jsx
│   │   ├── HitEffects.jsx
│   │   ├── ScreenEffects.jsx
│   │   └── WeatherEffects.jsx
│   ├── audio/
│   │   ├── SoundManager.jsx
│   │   └── MusicPlayer.jsx
│   └── ...
├── hooks/
│   ├── useSoundEffects.js
│   ├── useParticles.js
│   └── useScreenEffects.js
├── assets/
│   ├── sounds/
│   │   ├── combat/
│   │   ├── ui/
│   │   └── music/
│   └── images/
│       └── portraits/
└── styles/
    ├── animations.css (existing)
    ├── particles.css (new)
    └── effects.css (new)
```

### Dependencies to Add
```json
{
  "howler": "^2.2.3",  // Audio library
  "framer-motion": "^10.16.0",  // Advanced animations (optional)
  "canvas-confetti": "^1.9.0"  // Victory celebrations
}
```

## Quality Assurance

### Testing Checklist
- [ ] All particles render correctly on different screen sizes
- [ ] Sound effects play at appropriate volume
- [ ] No memory leaks from particle pooling
- [ ] Animations don't cause layout thrashing
- [ ] Accessibility: Motion can be reduced
- [ ] Mobile: Touch controls work with new effects
- [ ] Performance: Maintains 60 FPS on target devices

### Accessibility Considerations
- Settings panel with:
  - Reduce motion toggle
  - Particle density slider
  - Screen shake intensity
  - Flash effect toggle (photosensitivity)
  - Volume controls (master, SFX, music)
  - Colorblind mode options

## Implementation Timeline

### Sprint 1: Core Effects (Current)
- Week 1: Particle system + basic particles
- Week 2: Sound effects system + core sounds
- Week 3: Hit-stop & screen shake
- Week 4: Testing & polish

### Sprint 2: UI Polish
- Week 5: Smooth transitions
- Week 6: Enhanced status bars & floating text
- Week 7: Character portraits
- Week 8: Testing & refinement

### Sprint 3: Atmosphere
- Week 9: Animated backgrounds
- Week 10: Dynamic lighting
- Week 11: Weather effects
- Week 12: Testing & optimization

### Sprint 4: Advanced Features (Future)
- TBD based on feedback

## Success Metrics

### Visual Quality
- User feedback: "Game feels more polished"
- Visual consistency: All effects have cohesive art style
- Screen recording: Looks good in videos/streams

### Performance
- FPS: Average ≥55 FPS during combat
- Load time: ≤3 seconds for all assets
- Memory: ≤100MB additional for all effects

### Player Engagement
- Session length: Increase by 20%
- Retention: More players return
- Social sharing: More screenshots/videos shared

## Notes
- Start with particle system as foundation
- Sound effects can be added incrementally
- All effects should be toggleable in settings
- Maintain retro-modern hybrid aesthetic
- Effects should enhance, not distract from gameplay

## References
- Hades (Supergiant Games) - Combat feel reference
- Dead Cells - Particle effects reference
- Slay the Spire - UI/UX reference
- Enter the Gungeon - Screen shake reference

---
**Document Version**: 1.0
**Last Updated**: 2025-12-02
**Author**: Claude Code
**Status**: Ready for Implementation
