import { Block, BlockType } from './Block';

/**
 * Implementation of a wood block
 */
export class WoodBlock extends Block {
  /**
   * Creates a new wood block
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  
  /**
   * Draw the wood block on the canvas
   * @param ctx The canvas rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    // Wood block - Brown with wood grain texture
    ctx.fillStyle = '#a1887f'; // Light brown color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add darker border
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Add wood grain texture (horizontal lines)
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.height; i += 8) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + i);
      ctx.lineTo(this.x + this.width, this.y + i);
      ctx.stroke();
    }
    
    // Add vertical wood grain
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 2;
    for (let i = 0; i < this.width; i += this.width / 3) {
      ctx.beginPath();
      ctx.moveTo(this.x + i, this.y);
      ctx.lineTo(this.x + i, this.y + this.height);
      ctx.stroke();
    }
  }
  
  /**
   * Get the type identifier for this block
   */
  getType(): string {
    return BlockType.WOOD;
  }
}