import { KeyState } from '../src/KeyState';

describe('KeyState', () => {
  let keyState: KeyState;
  
  beforeEach(() => {
    keyState = {} as KeyState;
  });
  
  it('should track key press state correctly', () => {
    // Arrange & Act
    keyState['ArrowRight'] = true;
    keyState['ArrowLeft'] = false;
    keyState[' '] = true; // Space key
    
    // Assert
    expect(keyState['ArrowRight']).toBe(true);
    expect(keyState['ArrowLeft']).toBe(false);
    expect(keyState[' ']).toBe(true);
  });
  
  it('should allow changing key state', () => {
    // Arrange
    keyState['ArrowUp'] = false;
    
    // Act
    keyState['ArrowUp'] = true;
    
    // Assert
    expect(keyState['ArrowUp']).toBe(true);
  });
});