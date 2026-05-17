import Phaser from 'phaser';
import { generatePlaceholders } from '../placeholders';

// Real art extracted from the sprite sheets. Only the fog overlay still uses
// a procedural placeholder (it is just a dark square).
const REAL_ASSETS = [
  ['pc_FIGHTER', 'assets/party/fighter.png'],
  ['pc_MAGE', 'assets/party/mage.png'],
  ['pc_PRIEST', 'assets/party/priest.png'],
  ['pc_THIEF', 'assets/party/thief.png'],
  ['pc_RANGER', 'assets/party/ranger.png'],
  ['pc_PALADIN', 'assets/party/paladin.png'],
  ['mob_Skeleton', 'assets/monsters/skeleton.png'],
  ['mob_Goblin', 'assets/monsters/kobold.png'],
  ['mob_Orc', 'assets/monsters/orc.png'],
  ['mob_Dark Wizard', 'assets/monsters/darkwizard.png'],
  ['mob_Dragon', 'assets/monsters/dragon.png'],
  ['tile_floor', 'assets/tiles/floor.png'],
  ['tile_wall', 'assets/tiles/wall.png'],
  ['tile_wall2', 'assets/tiles/wall2.png'],
  ['tile_wall3', 'assets/tiles/wall3.png'],
  ['tile_encounter', 'assets/tiles/encounter.png'],
  ['tile_treasure', 'assets/tiles/treasure.png'],
  ['tile_stairs', 'assets/tiles/stairs.png'],
  ['spark', 'assets/vfx/spark.png'],
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    REAL_ASSETS.forEach(([key, path]) => this.load.image(key, path));
  }

  create() {
    // Fills in textures (tiles, VFX, and any class/monster lacking real art).
    generatePlaceholders(this);
    this.scene.start('DungeonScene');
  }
}
