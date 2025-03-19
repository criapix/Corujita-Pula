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

// Load game assets
const playerImage = new Image();

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

// Configure canvas
canvas.width = 800;
canvas.height = 600;

// Initialize game objects
const player: Player = {
    x: 50,
    y: 100,
    width: 64,
    height: 64,
    speed: 5,
    jumpForce: -15,
    velocityY: 0,
    isGrounded: false
};

// Get platforms and enemies from the stage
const platforms: Platform[] = currentStage.getPlatforms();
const enemies: (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[] = currentStage.getEnemies();

// Debug: Log platform count
console.log(`Loaded ${platforms.length} platforms from Stage1`);
// Debug: Log a few platforms
if (platforms.length > 0) {
    console.log('First platform:', platforms[0]);
    console.log('Last platform:', platforms[platforms.length - 1]);
}

const keys: KeyState = {};

// Event listeners for controls
document.addEventListener('keydown', (e: KeyboardEvent) => keys[e.key] = true);
document.addEventListener('keyup', (e: KeyboardEvent) => keys[e.key] = false);

// Initialize game controller and renderer
let gameController: GameController;
let gameRenderer: GameRenderer;

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
        fireballCooldown
    );
    
    gameRenderer = new GameRenderer(
        ctx,
        playerImage,
        enemyRegistry.getEnemySprites(),
        worldWidth
    );
    
    // Start game loop
    gameLoop();
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

// Main game loop
function gameLoop(): void {
    // Update game state
    gameController.update(canvas.width);
    
    // Render game
    gameRenderer.draw(
        player,
        platforms,
        enemies,
        gameController.getCameraOffset()
    );
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}