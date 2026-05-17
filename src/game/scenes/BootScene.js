import Phaser from 'phaser';
import { generatePlaceholders } from '../placeholders';

// Real art extracted from the sprite sheet. Any key not listed here (Ranger,
// Paladin, Orc, Dark Wizard, Dragon) falls back to a procedural placeholder.
const REAL_ASSETS = [
  ['pc_FIGHTER', 'assets/party/fighter.png'],
  ['pc_MAGE', 'assets/party/mage.png'],
  ['pc_PRIEST', 'assets/party/priest.png'],
  ['pc_THIEF', 'assets/party/thief.png'],
  ['mob_Skeleton', 'assets/monsters/skeleton.png'],
  ['mob_Goblin', 'assets/monsters/kobold.png'],
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
