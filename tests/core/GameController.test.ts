import { GameController } from '../../src/core/GameController';
import { Player } from '../../src/core/Player';
import { Platform } from '../../src/Platform';
import { EnemyObject } from '../../src/enemies/EnemyObject';
import { KeyState } from '../../src/KeyState';
import { EnemyType } from '../../src/enemies/EnemyType';
import { JumperEnemy } from '../../src/enemies/JumperEnemy';
import { FlyerEnemy } from '../../src/enemies/FlyerEnemy';
import { ThrowerEnemy } from '../../src/enemies/ThrowerEnemy';

describe('GameController', () => {
  // Mock objects for testing
  let player: Player;
  let platforms: Platform[];
  let enemies: (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[];
  let keys: KeyState;
  let gameController: GameController;
  
  // Setup before each test
  beforeEach(() => {
    // Create a mock player
    player = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      speed: 5,
      jumpForce: -10,
      velocityY: 0,
      isGrounded: true
    };
    
    // Create mock platforms
    platforms = [
      { x: 0, y: 300, width: 500, height: 20 }
    ];
    
    // Create mock enemies with different properties to test reset
    enemies = [
      {
        x: 200,
        y: 250,
        width: 64,
        height: 64,
        speed: 2,
        direction: 1,
        platform: platforms[0],
        type: EnemyType.WALKER,
        alive: true,
        spritePath: 'assets/images/fox-svgrepo-com.svg',
        update: jest.fn(),
        // Properties from extended enemy types
        velocityY: 5, // From JumperEnemy
        lastThrowTime: 1000, // From ThrowerEnemy
        time: 500 // From FlyerEnemy
      } as EnemyObject & Partial<JumperEnemy> & Partial<FlyerEnemy> & Partial<ThrowerEnemy>
    ];
    
    // Create mock key state
    keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ' ': false
    };
    
    // Create the game controller instance
    gameController = new GameController(
      player,
      platforms,
      enemies,
      keys,
      0.5, // gravity
      1000, // worldWidth
      500 // fireballCooldown
    );
    
    // Clear any projectiles from previous tests
    GameController.projectiles = [];
  });
  
  describe('resetGame', () => {
    it('should reset player position', () => {
      // Arrange - Move player to a different position
      player.x = 500;
      player.y = 200;
      
      // Act - Call resetGame through private method access
      (gameController as any).resetGame();
      
      // Assert - Player should be back at starting position
      expect(player.x).toBe(50);
      expect(player.y).toBe(100);
    });
    
    it('should clear all projectiles', () => {
      // Arrange - Add some projectiles
      GameController.projectiles.push({
        x: 100,
        y: 100,
        width: 20,
        height: 20,
        velocityX: 8,
        velocityY: -5,
        active: true,
        isFireball: true
      });
      
      // Act
      (gameController as any).resetGame();
      
      // Assert
      expect(GameController.projectiles.length).toBe(0);
    });
    
    it('should reset all enemies to their initial state', () => {
      // Arrange - Modify enemy state
      enemies[0].alive = false;
      (enemies[0] as any).velocityY = 10;
      (enemies[0] as any).lastThrowTime = 2000;
      (enemies[0] as any).time = 1000;
      
      // Act
      (gameController as any).resetGame();
      
      // Assert
      expect(enemies[0].alive).toBe(true);
      expect((enemies[0] as any).velocityY).toBe(0);
      expect((enemies[0] as any).lastThrowTime).toBe(0);
      expect((enemies[0] as any).time).toBe(0);
    });
  });
  
  describe('checkWinCondition', () => {
    it('should reset key states when player reaches the end of the level', () => {
      // Mock the alert function
      global.alert = jest.fn();
      
      // Arrange - Set player position to end of level and set some keys as pressed
      player.x = 1000 - player.width; // At the edge of worldWidth
      keys.ArrowRight = true;
      keys.ArrowUp = true;
      
      // Act
      (gameController as any).checkWinCondition();
      
      // Assert
      expect(keys.ArrowRight).toBe(false);
      expect(keys.ArrowUp).toBe(false);
      expect(keys[' ']).toBe(false);
      expect(global.alert).toHaveBeenCalledWith('Parabéns! Você completou a fase!');
    });
  });
});