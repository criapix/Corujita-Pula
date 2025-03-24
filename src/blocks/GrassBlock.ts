import { Block, BlockType } from './Block';

/**
 * Implementation of a grass block
 */
export class GrassBlock extends Block {
  /**
   * Creates a new grass block
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  
  /**
   * Draw the grass block on the canvas
   * @param ctx The canvas rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    // Grass block - Green with grass texture on top
    ctx.fillStyle = '#2ecc71'; // Base green color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add darker border
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Add grass texture on top (small vertical lines)
    ctx.fillStyle = '#27ae60';
    const grassHeight = this.height / 4;
    for (let i = 0; i < this.width; i += 4) {
      const height = grassHeight * (0.7 + Math.random() * 0.3);
      ctx.fillRect(this.x + i, this.y, 2, height);
    }
  }
  
  /**
   * Get the type identifier for this block
   */
  getType(): string {
    return BlockType.GRASS;
  }
}