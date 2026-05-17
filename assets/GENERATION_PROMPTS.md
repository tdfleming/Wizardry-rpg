# Asset Generation Guide

This game runs today on **procedural placeholder art** generated at runtime
(`src/game/placeholders.js`). To give it the real "Phaser graphical feel",
generate the images below with an AI image tool and drop them into
`public/assets/` using the exact paths from `src/game/assetManifest.js`.

## Workflow

1. Generate each image with the prompt provided.
2. Save it to the path shown (create the folders under `public/assets/`).
3. Match the pixel size given — the game positions art assuming these sizes.
4. Export PNG with a **transparent background** for everything except tiles.
5. Once files are in place, a later build phase will load them automatically
   in place of the placeholders.

## Shared style direction

Prepend this to every prompt for a cohesive look:

> Dark fantasy dungeon-crawler game asset, hand-painted illustration style,
> moody torch-lit colour palette (deep slate, ember orange, cold blue),
> clean readable silhouette, crisp edges, no text, no watermark.

---

## Dungeon tiles — `public/assets/tiles/` — 64×64 px, top-down, opaque

| File | Prompt addition |
| --- | --- |
| `floor.png` | top-down seamless dungeon stone floor tile, worn flagstones, subtle cracks, dim lighting |
| `wall.png` | top-down seamless dungeon stone wall tile, heavy carved blocks, deep shadow gaps, slightly raised |
| `encounter.png` | top-down dungeon floor tile identical in feel to the plain floor (encounters stay hidden), faint dark stain |
| `treasure.png` | top-down dungeon floor tile with an ornate wooden treasure chest, gold trim, glints of coins |
| `stairs.png` | top-down stone spiral staircase descending into darkness, carved steps, downward depth |
| `fog.png` | solid near-black 64×64 fog-of-war tile, very dark blue-black, fully opaque |

## Party sprites — `public/assets/party/` — 48×48 px, transparent, top-down 3/4 token

| File | Prompt addition |
| --- | --- |
| `fighter.png` | armoured human fighter with sword and shield, crimson tabard, sturdy stance |
| `mage.png` | robed human mage with glowing staff, deep blue robes, arcane aura |
| `priest.png` | white-and-gold robed priest holding a holy symbol, gentle radiant glow |
| `thief.png` | hooded rogue in dark green leathers, twin daggers, nimble crouch |
| `ranger.png` | cloaked ranger with longbow and quiver, earthy brown leathers |
| `paladin.png` | gleaming plate-armoured paladin with warhammer, orange-gold heraldry |

## Monster sprites — `public/assets/monsters/` — front-facing combat sprite, transparent

| File | Size | Prompt addition |
| --- | --- | --- |
| `goblin.png` | 112×112 | snarling green goblin with a crude dagger, ragged loincloth, menacing grin |
| `skeleton.png` | 112×112 | animated skeleton warrior with chipped sword and shield, glowing eye sockets |
| `orc.png` | 112×112 | hulking grey-green orc brute with a massive cleaver, tusked and scarred |
| `dark-wizard.png` | 112×112 | sinister dark wizard in tattered purple robes, crackling shadow magic |
| `dragon.png` | 200×200 | fearsome red dragon, spread wings, smouldering maw, dungeon boss scale |

## VFX — `public/assets/vfx/` — transparent

| File | Size | Prompt addition |
| --- | --- | --- |
| `spark.png` | 16×16 | single soft round white particle spark with a glowing core, used for bursts |

## Audio — `public/assets/audio/` — short MP3 clips

| File | Description |
| --- | --- |
| `hit.mp3` | sharp physical weapon impact, ~0.4 s |
| `cast.mp3` | magical spell cast whoosh, ~0.6 s |
| `heal.mp3` | gentle restorative shimmer chime, ~0.7 s |
| `treasure.mp3` | bright coin/treasure pickup jingle, ~0.8 s |
| `levelup.mp3` | triumphant level-up fanfare, ~1.2 s |
| `step.mp3` | soft dungeon footstep on stone, ~0.2 s |
| `music-dungeon.mp3` | looping dark ambient dungeon exploration track |
| `music-combat.mp3` | looping tense orchestral battle track |
