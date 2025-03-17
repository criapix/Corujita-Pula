import { collision, checkTopCollision } from '../../src/utils/CollisionUtils';
import { GameObject } from '../../src/core/GameObject';
import { Player } from '../../src/core/Player';
import { EnemyObject } from '../../src/enemies/EnemyObject';
import { EnemyType } from '../../src/enemies/EnemyType';

describe('CollisionUtils', () => {
  describe('collision', () => {
    it('should detect collision when objects overlap', () => {
      // Arrange
      const obj1: GameObject = { x: 0, y: 0, width: 10, height: 10 };
      const obj2: GameObject = { x: 5, y: 5, width: 10, height: 10 };
      
      // Act
      const result = collision(obj1, obj2);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should not detect collision when objects do not overlap', () => {
      // Arrange
      const obj1: GameObject = { x: 0, y: 0, width: 10, height: 10 };
      const obj2: GameObject = { x: 20, y: 20, width: 10, height: 10 };
      
      // Act
      const result = collision(obj1, obj2);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should detect collision when objects touch at edges', () => {
      // Arrange
      const obj1: GameObject = { x: 0, y: 0, width: 10, height: 10 };
      const obj2: GameObject = { x: 10, y: 0, width: 10, height: 10 };
      
      // Act
      const result = collision(obj1, obj2);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('checkTopCollision', () => {
    it('should detect top collision when player is above enemy', () => {
      // Arrange
      const player = {
        x: 5,
        y: 0,
        width: 10,
        height: 10,
        velocityY: 5, // Moving downward
        speed: 5,
        jumpForce: -10,
        isGrounded: false
      } as Player;
      
      const enemy = {
        x: 5,
        y: 10,
        width: 10,
        height: 10,
        speed: 2,
        direction: 1,
        platform: null,
        type: EnemyType.WALKER,
        update: jest.fn(),
        alive: true,
        spritePath: ''
      } as EnemyObject;
      
      // Act
      const result = checkTopCollision(player, enemy);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should not detect top collision when player is below enemy', () => {
      // Arrange
      const player = {
        x: 5,
        y: 20,
        width: 10,
        height: 10,
        velocityY: -5, // Moving upward
        speed: 5,
        jumpForce: -10,
        isGrounded: false
      } as Player;
      
      const enemy = {
        x: 5,
        y: 10,
        width: 10,
        height: 10,
        speed: 2,
        direction: 1,
        platform: null,
        type: EnemyType.WALKER,
        update: jest.fn(),
        alive: true,
        spritePath: ''
      } as EnemyObject;
      
      // Act
      const result = checkTopCollision(player, enemy);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should not detect top collision when player is moving upward', () => {
      // Arrange
      const player = {
        x: 5,
        y: 0,
        width: 10,
        height: 10,
        velocityY: -5, // Moving upward
        speed: 5,
        jumpForce: -10,
        isGrounded: false
      } as Player;
      
      const enemy = {
        x: 5,
        y: 10,
        width: 10,
        height: 10,
        speed: 2,
        direction: 1,
        platform: null,
        type: EnemyType.WALKER,
        update: jest.fn(),
        alive: true,
        spritePath: ''
      } as EnemyObject;
      
      // Act
      const result = checkTopCollision(player, enemy);
      
      // Assert
      expect(result).toBe(false);
    });
  });
});