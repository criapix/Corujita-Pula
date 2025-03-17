import { Platform } from '../src/Platform';

describe('Platform', () => {
  describe('constructor', () => {
    it('should initialize with the correct properties', () => {
      // Arrange & Act
      const x = 100;
      const y = 200;
      const width = 300;
      const height = 50;
      const platform = new Platform(x, y, width, height);
      
      // Assert
      expect(platform.x).toBe(x);
      expect(platform.y).toBe(y);
      expect(platform.width).toBe(width);
      expect(platform.height).toBe(height);
    });
  });
});