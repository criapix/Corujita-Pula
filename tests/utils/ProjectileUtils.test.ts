import { shootFireball, updateProjectiles } from '../../src/utils/ProjectileUtils';
import { Player } from '../../src/core/Player';
import { Projectile } from '../../src/Projectile';
import { Platform } from '../../src/Platform';
import { EnemyObject } from '../../src/enemies/EnemyObject';

describe('ProjectileUtils', () => {
  describe('shootFireball', () => {
    it('should create a new fireball and add it to projectiles array', () => {
      // Arrange
      const player: Player = {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        speed: 5,
        jumpForce: -10,
        velocityY: 0,
        isGrounded: true
      };
      const projectiles: Projectile[] = [];
      const lastDirection = 1;
      const lastFireballTime = 0;
      const fireballCooldown = 500;
      
      // Act
      const newLastFireballTime = shootFireball(player, projectiles, lastDirection, lastFireballTime, fireballCooldown);
      
      // Assert
      expect(projectiles.length).toBe(1);
      expect(projectiles[0].x).toBe(player.x + player.width / 2);
      expect(projectiles[0].y).toBe(player.y + player.height / 2);
      expect(projectiles[0].velocityX).toBe(lastDirection * 8);
      expect(projectiles[0].velocityY).toBe(-5);
      expect(projectiles[0].active).toBe(true);
      expect(projectiles[0].isFireball).toBe(true);
      expect(newLastFireballTime).toBeGreaterThan(lastFireballTime);
    });
    
    it('should not create a new fireball if cooldown has not elapsed', () => {
      // Arrange
      const player: Player = {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        speed: 5,
        jumpForce: -10,
        velocityY: 0,
        isGrounded: true
      };
      const projectiles: Projectile[] = [];
      const lastDirection = 1;
      const currentTime = Date.now();
      const lastFireballTime = currentTime - 100; // 100ms ago
      const fireballCooldown = 500; // 500ms cooldown
      
      // Act
      const newLastFireballTime = shootFireball(player, projectiles, lastDirection, lastFireballTime, fireballCooldown);
      
      // Assert
      expect(projectiles.length).toBe(0); // No new projectile
      expect(newLastFireballTime).toBe(lastFireballTime); // Time unchanged
    });
  });
});