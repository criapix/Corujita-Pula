import { Projectile } from '../src/Projectile';

describe('Projectile', () => {
  describe('constructor', () => {
    it('should initialize with the correct properties', () => {
      // Arrange & Act
      const x = 100;
      const y = 200;
      const velocityX = 5;
      const velocityY = -3;
      const active = true;
      const isFireball = true;
      const projectile = new Projectile(x, y, velocityX, velocityY, active, isFireball);
      
      // Assert
      expect(projectile.x).toBe(x);
      expect(projectile.y).toBe(y);
      expect(projectile.velocityX).toBe(velocityX);
      expect(projectile.velocityY).toBe(velocityY);
      expect(projectile.active).toBe(active);
      expect(projectile.isFireball).toBe(isFireball);
    });
    
    it('should initialize without isFireball property when not provided', () => {
      // Arrange & Act
      const x = 100;
      const y = 200;
      const velocityX = 5;
      const velocityY = -3;
      const active = true;
      const projectile = new Projectile(x, y, velocityX, velocityY, active);
      
      // Assert
      expect(projectile.x).toBe(x);
      expect(projectile.y).toBe(y);
      expect(projectile.velocityX).toBe(velocityX);
      expect(projectile.velocityY).toBe(velocityY);
      expect(projectile.active).toBe(active);
      expect(projectile.isFireball).toBeUndefined();
    });
  });
});