import { Block, BlockType } from './Block';

/**
 * Implementation of a dirt block
 */
export class DirtBlock extends Block {
  /**
   * Creates a new dirt block
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  
  /**
   * Draw the dirt block on the canvas
   * @param ctx The canvas rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    // Dirt block - Brown with speckled texture
    ctx.fillStyle = '#795548'; // Brown color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add darker border
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Add dirt texture (small dots)
    ctx.fillStyle = '#8d6e63';
    for (let i = 0; i < 15; i++) {
      const dotX = this.x + Math.random() * this.width;
      const dotY = this.y + Math.random() * this.height;
      const dotSize = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  /**
   * Get the type identifier for this block
   */
  getType(): string {
    return BlockType.DIRT;
  }
}