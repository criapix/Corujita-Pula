import { BlockType } from './Block';
import { GrassBlock } from './GrassBlock';
import { DirtBlock } from './DirtBlock';
import { WoodBlock } from './WoodBlock';
import { StoneBlock } from './StoneBlock';
import { Block } from './Block';

/**
 * Factory class for creating block instances
 */
export class BlockFactory {
  /**
   * Creates a block of the specified type
   * @param blockType The type of block to create
   * @param x The x coordinate
   * @param y The y coordinate
   * @param width The width of the block
   * @param height The height of the block
   * @returns A new block instance
   */
  public static createBlock(blockType: BlockType, x: number, y: number, width: number, height: number): Block {
    switch (blockType) {
      case BlockType.GRASS:
        return new GrassBlock(x, y, width, height);
      case BlockType.DIRT:
        return new DirtBlock(x, y, width, height);
      case BlockType.WOOD:
        return new WoodBlock(x, y, width, height);
      case BlockType.STONE:
        return new StoneBlock(x, y, width, height);
      default:
        // Default to grass if unknown type
        return new GrassBlock(x, y, width, height);
    }
  }
}