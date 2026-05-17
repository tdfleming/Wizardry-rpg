// Declares the real art/audio assets the game expects. Drop generated files
// into public/assets/ using these exact paths and a future BootScene pass can
// load them in place of the procedural placeholders.
//
// See assets/GENERATION_PROMPTS.md for an AI generation prompt per asset.
export const ASSET_MANIFEST = {
  images: [
    { key: 'tile_floor', path: 'assets/tiles/floor.png' },
    { key: 'tile_wall', path: 'assets/tiles/wall.png' },
    { key: 'tile_encounter', path: 'assets/tiles/encounter.png' },
    { key: 'tile_treasure', path: 'assets/tiles/treasure.png' },
    { key: 'tile_stairs', path: 'assets/tiles/stairs.png' },
    { key: 'fog', path: 'assets/tiles/fog.png' },

    { key: 'pc_FIGHTER', path: 'assets/party/fighter.png' },
    { key: 'pc_MAGE', path: 'assets/party/mage.png' },
    { key: 'pc_PRIEST', path: 'assets/party/priest.png' },
    { key: 'pc_THIEF', path: 'assets/party/thief.png' },
    { key: 'pc_RANGER', path: 'assets/party/ranger.png' },
    { key: 'pc_PALADIN', path: 'assets/party/paladin.png' },

    // Goblin currently uses the sprite sheet's kobold art as a stand-in.
    { key: 'mob_Goblin', path: 'assets/monsters/kobold.png' },
    { key: 'mob_Skeleton', path: 'assets/monsters/skeleton.png' },
    { key: 'mob_Orc', path: 'assets/monsters/orc.png' },
    { key: 'mob_Dark Wizard', path: 'assets/monsters/darkwizard.png' },
    { key: 'mob_Dragon', path: 'assets/monsters/dragon.png' },

    { key: 'spark', path: 'assets/vfx/spark.png' },
  ],
  audio: [
    { key: 'sfx_hit', path: ['assets/audio/hit.mp3'] },
    { key: 'sfx_cast', path: ['assets/audio/cast.mp3'] },
    { key: 'sfx_heal', path: ['assets/audio/heal.mp3'] },
    { key: 'sfx_treasure', path: ['assets/audio/treasure.mp3'] },
    { key: 'sfx_levelup', path: ['assets/audio/levelup.mp3'] },
    { key: 'sfx_step', path: ['assets/audio/step.mp3'] },
    { key: 'music_dungeon', path: ['assets/audio/music-dungeon.mp3'] },
    { key: 'music_combat', path: ['assets/audio/music-combat.mp3'] },
  ],
};
