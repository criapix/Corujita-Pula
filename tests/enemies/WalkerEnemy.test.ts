import { WalkerEnemy } from '../../src/enemies/WalkerEnemy';
import { Platform } from '../../src/Platform';
import { Player } from '../../src/core/Player';
import { EnemyType } from '../../src/enemies/EnemyType';

describe('WalkerEnemy', () => {
  let enemy: typeof WalkerEnemy;
  let player: Player;
  
  beforeEach(() => {
    // Create a fresh copy of the enemy for each test
    enemy = { ...WalkerEnemy };
    enemy.x = 100;
    enemy.y = 200;
    enemy.direction = 1;
    enemy.alive = true;
    
    player = {
      x: 300,
      y: 200,
      width: 50,
      height: 50,
      speed: 5,
      jumpForce: -10,
      velocityY: 0,
      isGrounded: true
    };
  });
  
  describe('properties', () => {
    it('should have correct default properties', () => {
      expect(WalkerEnemy.width).toBe(64);
      expect(WalkerEnemy.height).toBe(64);
      expect(WalkerEnemy.speed).toBe(2);
      expect(WalkerEnemy.type).toBe(EnemyType.WALKER);
      expect(WalkerEnemy.alive).toBe(true);
      expect(WalkerEnemy.spritePath).toBe('assets/images/fox-svgrepo-com.svg');
    });
  });
  
  describe('update', () => {
    it('should move in the current direction', () => {
      // Arrange
      const initialX = enemy.x;
      
      // Act
      enemy.update(player);
      
      // Assert
      expect(enemy.x).toBe(initialX + enemy.speed * enemy.direction);
    });
    
    it('should not update position if enemy is dead', () => {
      // Arrange
      const initialX = enemy.x;
      enemy.alive = false;
      
      // Act
      enemy.update(player);
      
      // Assert
      expect(enemy.x).toBe(initialX); // Position unchanged
    });
    
    it('should reverse direction when reaching left edge of platform', () => {
      // Arrange
      enemy.platform = new Platform(100, 250, 200, 20);
      enemy.x = enemy.platform.x; // At left edge
      enemy.direction = -1; // Moving left
      
      // Act
      enemy.update(player);
      
      // Assert
      expect(enemy.direction).toBe(1); // Direction reversed
    });
    
    it('should reverse direction when reaching right edge of platform', () => {
      // Arrange
      enemy.platform = new Platform(100, 250, 200, 20);
      enemy.x = enemy.platform.x + enemy.platform.width - enemy.width; // At right edge
      enemy.direction = 1; // Moving right
      
      // Act
      enemy.update(player);
      
      // Assert
      expect(enemy.direction).toBe(-1); // Direction reversed
    });
    
    it('should not reverse direction when not on a platform', () => {
      // Arrange
      enemy.platform = null;
      enemy.direction = 1;
      
      // Act
      enemy.update(player);
      
      // Assert
      expect(enemy.direction).toBe(1); // Direction unchanged
    });
  });
});