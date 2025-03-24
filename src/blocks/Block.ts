import { GameObject } from '../core/GameObject';

/**
 * Abstract base class for all block types
 */
export abstract class Block implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  /**
   * Draw the block on the canvas
   * @param ctx The canvas rendering context
   */
  abstract draw(ctx: CanvasRenderingContext2D): void;
  
  /**
   * Get the type identifier for this block
   */
  abstract getType(): string;
}

/**
 * Enum for block types - kept for backward compatibility
 */
export enum BlockType {
  GRASS = 'grass',
  DIRT = 'dirt',
  WOOD = 'wood',
  STONE = 'stone'
}