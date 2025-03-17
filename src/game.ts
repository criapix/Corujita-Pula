import { Player } from './core/Player';
import { Platform } from './Platform';
import { EnemyObject } from './enemies/EnemyObject';
import { JumperEnemy, JumperEnemyImpl } from './enemies/JumperEnemy';
import { FlyerEnemy, FlyerEnemyImpl } from './enemies/FlyerEnemy';
import { ThrowerEnemy, ThrowerEnemyImpl } from './enemies/ThrowerEnemy';
import { KeyState } from './KeyState';
import { WalkerEnemy } from './enemies/WalkerEnemy';
import { GameController } from './core/GameController';
import { GameRenderer } from './GameRenderer';
import { EnemyRegistry } from './core/EnemyRegistry';

// Get canvas and context
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Load game assets
const playerImage = new Image();

// Track loaded assets
let assetsLoaded = 0;
const totalAssets = 2; // Player + all enemy types (counted as 1)

// Game constants
const worldWidth = 5000;
const gravity = 0.5;
const fireballCooldown = 500; // Cooldown in milliseconds between fireballs

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

const platforms: Platform[] = [
    {x: 0, y: canvas.height - 40, width: worldWidth, height: 40},
    {x: 500, y: 500, width: 200, height: 20},
    {x: 1200, y: 400, width: 150, height: 20},
    {x: 1800, y: 300, width: 200, height: 20},
    // Novas plataformas
    {x: 2300, y: 450, width: 180, height: 20},
    {x: 2700, y: 350, width: 150, height: 20},
    {x: 3000, y: 500, width: 200, height: 20},
    {x: 3300, y: 400, width: 120, height: 20},
    {x: 3600, y: 300, width: 180, height: 20},
    {x: 4000, y: 350, width: 150, height: 20},
    {x: 4300, y: 250, width: 200, height: 20},
    {x: 4600, y: 350, width: 180, height: 20}
];

const keys: KeyState = {};

// Initialize enemies on platforms with different types
const enemies: (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[] = [
    // Walkers (original behavior)
    {...WalkerEnemy, x: 600, y: 450, platform: platforms[1], alive: true},
    {...WalkerEnemy, x: 3050, y: 450, platform: platforms[6], alive: true},
    
    // Jumpers
    {...JumperEnemyImpl, x: 1250, y: 350, platform: platforms[2], alive: true},
    {...JumperEnemyImpl, x: 2750, y: 300, platform: platforms[5], alive: true},
    
    // Flyers
    {...FlyerEnemyImpl, x: 1850, y: 250, initialY: 250, platform: null, alive: true},
    {...FlyerEnemyImpl, x: 3650, y: 200, initialY: 200, platform: null, alive: true},
    
    // Throwers
    {...ThrowerEnemyImpl, x: 2350, y: 400, platform: platforms[4], alive: true},
    {...ThrowerEnemyImpl, x: 4050, y: 300, platform: platforms[9], alive: true},
    {...ThrowerEnemyImpl, x: 4350, y: 200, platform: platforms[10], alive: true}
];

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