import Phaser from 'phaser';
import { generatePlaceholders } from '../placeholders';

// Phase 1: builds every texture procedurally so the game runs with zero art
// files. When real assets land in public/assets/, add a preload() that loads
// them from ASSET_MANIFEST and skip placeholder generation for matched keys.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    generatePlaceholders(this);
    this.scene.start('DungeonScene');
  }
}
