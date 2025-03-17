import { GameObject } from '../../src/core/GameObject';

describe('GameObject', () => {
  it('should create a game object with the correct properties', () => {
    // Arrange & Act
    const gameObject: GameObject = {
      x: 100,
      y: 200,
      width: 50,
      height: 75
    };
    
    // Assert
    expect(gameObject.x).toBe(100);
    expect(gameObject.y).toBe(200);
    expect(gameObject.width).toBe(50);
    expect(gameObject.height).toBe(75);
  });
});