import { GameObject } from './core/GameObject';
import { Block, BlockType, BlockFactory } from './blocks/index';

// Simple platform interface
export interface Platform extends GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  blockType: BlockType;
  block: Block;
}

export class Platform implements Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  blockType: BlockType;
  block: Block;

  constructor(x: number, y: number, width: number, height: number, blockType: BlockType = BlockType.GRASS) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.blockType = blockType;
    // Create the appropriate block instance using the factory
    this.block = BlockFactory.createBlock(blockType, x, y, width, height);
  }
}

// Re-export BlockType for backward compatibility
export { BlockType } from './blocks/index';