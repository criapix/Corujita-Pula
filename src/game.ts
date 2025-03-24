import { Player } from './core/Player';
import { Platform } from './Platform';
import { EnemyObject } from './enemies/EnemyObject';
import { JumperEnemy } from './enemies/JumperEnemy';
import { FlyerEnemy } from './enemies/FlyerEnemy';
import { ThrowerEnemy } from './enemies/ThrowerEnemy';
import { KeyState } from './KeyState';
import { GameController } from './core/GameController';
import { GameRenderer } from './GameRenderer';
import { EnemyRegistry } from './core/EnemyRegistry';
import { Stage1 } from './stages/Stage1';

// Get canvas and context
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Initialize game controller and renderer
let gameController: GameController | null = null;
let gameRenderer: GameRenderer | null = null;

// Load game assets
const playerImage = new Image();



// Set up responsive canvas
function resizeCanvas(): void {
    // Set canvas dimensions to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Set canvas style dimensions to match window size
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Center the canvas
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    
    // Update renderer scale factors if available
    if (gameRenderer !== null) {
        gameRenderer.updateScaleFactors();
    }
    
    console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
}

// Initial canvas sizing
resizeCanvas();

// Add resize event listener
window.addEventListener('resize', resizeCanvas);

// Track loaded assets
let assetsLoaded = 0;
const totalAssets = 2; // Player + all enemy types (counted as 1)

// Game constants
const fireballCooldown = 500; // Cooldown in milliseconds between fireballs

// Load the first stage
const currentStage = new Stage1();
const worldWidth = currentStage.getWorldWidth();
const worldHeight = currentStage.getWorldHeight();
const gravity = currentStage.getGravity();

// Game scale factors
let scaleX = 1;
let scaleY = 1;

// Initialize game objects
const player: Player = {
    x: 50,
    y: 100,
    width: 64,
    height: 64,
    speed: 5,
    jumpForce: -15,
    velocityY: 0,
    isGrounded: false,
    canDoubleJump: false // Inicialmente não pode fazer pulo duplo até que esteja no ar
};

// Get platforms and enemies from the stage
const platforms: Platform[] = currentStage.getPlatforms();
const enemies: (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[] = currentStage.getEnemies();



const keys: KeyState = {};

// Expose keys globally for TouchControls to access
(window as any).gameKeys = keys;

// Event listeners for controls
document.addEventListener('keydown', (e: KeyboardEvent) => keys[e.key] = true);
document.addEventListener('keyup', (e: KeyboardEvent) => keys[e.key] = false);



// Get enemy registry instance
const enemyRegistry = EnemyRegistry.getInstance();

// Start game when assets are loaded
function startGame(): void {
    // Initialize controller and renderer
    gameController = new GameController(
        player,
        platforms,
        enemies,
        keys,
        gravity,
        worldWidth,
        worldHeight,
        fireballCooldown
    );
    
    gameRenderer = new GameRenderer(
        ctx,
        playerImage,
        enemyRegistry.getEnemySprites(),
        worldWidth
    );
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Asset loading
playerImage.onload = (): void => {
    assetsLoaded++;
    if(assetsLoaded === totalAssets) startGame();
};
playerImage.onerror = (): void => alert('Error loading player sprite');
playerImage.src = 'assets/images/owl.svg';

// Load all enemy sprites
enemyRegistry.loadAllSprites(() => {
    assetsLoaded++;
    if(assetsLoaded === totalAssets) startGame();
});

// Calculate scale factors based on current canvas size
function calculateScaleFactors(): { scaleX: number, scaleY: number } {
    return {
        scaleX: window.innerWidth / canvas.width,
        scaleY: window.innerHeight / canvas.height
    };
}

// Variables for deltaTime calculation
let lastFrameTime: number = 0;

// Main game loop
function gameLoop(timestamp: number): void {
    // Calculate deltaTime in seconds
    const currentTime = timestamp || performance.now();
    const deltaTime = lastFrameTime ? (currentTime - lastFrameTime) / 1000 : 1/60; // Convert to seconds, default to 1/60 on first frame
    lastFrameTime = currentTime;
    
    // Limit deltaTime to prevent large jumps after tab switch or lag
    const cappedDeltaTime = Math.min(deltaTime, 0.1); // Cap at 100ms to prevent extreme jumps
    
    // Update scale factors
    const { scaleX: currentScaleX, scaleY: currentScaleY } = calculateScaleFactors();
    scaleX = currentScaleX;
    scaleY = currentScaleY;
    
    if (gameController) {
        // Update game state with scaled canvas width and real deltaTime
        gameController.update(canvas.width / scaleX, cappedDeltaTime);
        
        // Render game
        if (gameRenderer) {
            gameRenderer.draw(
                player,
                platforms,
                enemies,
                gameController.getCameraOffset()
            );
        }
    }
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}