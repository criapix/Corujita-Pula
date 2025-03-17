import { Sky } from '../../src/core/Sky';

describe('Sky', () => {
  let mockCtx: CanvasRenderingContext2D;
  
  beforeEach(() => {
    // Create a mock canvas context
    mockCtx = {
      canvas: { width: 800, height: 600 },
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      fillRect: jest.fn(),
      fillStyle: '',
      globalAlpha: 1,
      beginPath: jest.fn(),
      arc: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      createLinearGradient: jest.fn().mockReturnValue({
        addColorStop: jest.fn()
      })
    } as unknown as CanvasRenderingContext2D;
  });
  
  describe('constructor', () => {
    it('should initialize with the correct properties and generate clouds', () => {
      // Arrange & Act
      const worldWidth = 2000;
      const maxClouds = 5;
      const sky = new Sky(mockCtx, worldWidth, maxClouds);
      
      // Assert - Using private property access for testing
      // @ts-ignore - Accessing private property for testing
      expect(sky.ctx).toBe(mockCtx);
      // @ts-ignore - Accessing private property for testing
      expect(sky.worldWidth).toBe(worldWidth);
      // @ts-ignore - Accessing private property for testing
      expect(sky.maxClouds).toBe(maxClouds);
      // @ts-ignore - Accessing private property for testing
      expect(sky.clouds.length).toBe(maxClouds);
    });
    
    it('should use default maxClouds value when not provided', () => {
      // Arrange & Act
      const worldWidth = 2000;
      const sky = new Sky(mockCtx, worldWidth);
      
      // Assert
      // @ts-ignore - Accessing private property for testing
      expect(sky.maxClouds).toBe(10); // Default value
      // @ts-ignore - Accessing private property for testing
      expect(sky.clouds.length).toBe(10);
    });
  });
  
  describe('update', () => {
    it('should update cloud positions', () => {
      // Arrange
      const worldWidth = 2000;
      const sky = new Sky(mockCtx, worldWidth, 3);
      const cameraOffset = 100;
      
      // Get initial cloud positions
      // @ts-ignore - Accessing private property for testing
      const initialPositions = sky.clouds.map(cloud => ({ x: cloud.x, y: cloud.y }));
      
      // Act
      sky.update(cameraOffset);
      
      // Assert
      // @ts-ignore - Accessing private property for testing
      sky.clouds.forEach((cloud, index) => {
        // Each cloud should have moved to the left by its speed
        expect(cloud.x).toBeLessThan(initialPositions[index].x);
      });
    });
    
    it('should reset cloud position when it moves off-screen', () => {
      // Arrange
      const worldWidth = 2000;
      const sky = new Sky(mockCtx, worldWidth, 1);
      const cameraOffset = 0;
      
      // Manually position cloud to just before the left edge
      // @ts-ignore - Accessing private property for testing
      sky.clouds[0].x = -sky.clouds[0].width + 1;
      // @ts-ignore - Accessing private property for testing
      sky.clouds[0].speed = 2; // Ensure it will move off-screen
      
      // Act
      sky.update(cameraOffset);
      
      // Assert
      // @ts-ignore - Accessing private property for testing
      expect(sky.clouds[0].x).toBeGreaterThan(worldWidth); // Should be reset to right side
    });
  });
  
  describe('draw', () => {
    it('should call context methods to draw sky and clouds', () => {
      // Arrange
      const worldWidth = 2000;
      const sky = new Sky(mockCtx, worldWidth, 3);
      const cameraOffset = 100;
      
      // Act
      sky.draw(cameraOffset);
      
      // Assert
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.createLinearGradient).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.translate).toHaveBeenCalledWith(-cameraOffset * 0.5, 0);
      expect(mockCtx.restore).toHaveBeenCalled();
    });
  });
});