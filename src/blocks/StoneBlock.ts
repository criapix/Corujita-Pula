import { Block, BlockType } from './Block';

/**
 * Implementation of a stone block
 */
export class StoneBlock extends Block {
  /**
   * Creates a new stone block
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }
  
  /**
   * Draw the stone block on the canvas
   * @param ctx The canvas rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    // Stone block - Gray with cracked texture
    ctx.fillStyle = '#78909c'; // Gray color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add darker border
    ctx.strokeStyle = '#546e7a';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Add stone texture (cracks)
    ctx.strokeStyle = '#546e7a';
    ctx.lineWidth = 1;
    
    // Add a few random cracks
    for (let i = 0; i < 3; i++) {
      const startX = this.x + Math.random() * this.width;
      const startY = this.y + Math.random() * this.height;
      const length = 5 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length
      );
      ctx.stroke();
      
      // Add a branch to the crack
      if (Math.random() > 0.5) {
        const branchAngle = angle + (Math.random() * Math.PI / 2 - Math.PI / 4);
        const branchLength = length * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(
          startX + Math.cos(angle) * length * 0.5,
          startY + Math.sin(angle) * length * 0.5
        );
        ctx.lineTo(
          startX + Math.cos(angle) * length * 0.5 + Math.cos(branchAngle) * branchLength,
          startY + Math.sin(angle) * length * 0.5 + Math.sin(branchAngle) * branchLength
        );
        ctx.stroke();
      }
    }
  }
  
  /**
   * Get the type identifier for this block
   */
  getType(): string {
    return BlockType.STONE;
  }
}