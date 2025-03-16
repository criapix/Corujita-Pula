import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { EnemyObject } from './EnemyObject.js';
import { Projectile } from './Projectile.js';
import { KeyState } from './KeyState.js';
import { collision, checkTopCollision } from './CollisionUtils.js';
import { updateProjectiles, shootFireball } from './ProjectileUtils.js';

// Class to handle game logic and updates
export class GameController {
    static projectiles: Projectile[] = [];
    private player: Player;
    private platforms: Platform[];
    private enemies: EnemyObject[];
    private keys: KeyState;
    private gravity: number;
    private worldWidth: number;
    private cameraOffset: number = 0;
    private lastFireballTime: number = 0;
    private fireballCooldown: number;
    private lastDirection: number = 1; // 1 for right (default), -1 for left
    
    constructor(
        player: Player,
        platforms: Platform[],
        enemies: EnemyObject[],
        keys: KeyState,
        gravity: number,
        worldWidth: number,
        fireballCooldown: number
    ) {
        this.player = player;
        this.platforms = platforms;
        this.enemies = enemies;
        this.keys = keys;
        this.gravity = gravity;
        this.worldWidth = worldWidth;
        this.fireballCooldown = fireballCooldown;
    }
    
    // Main update function
    public update(canvasWidth: number): void {
        this.handlePlayerMovement();
        this.handleFireball();
        this.applyGravity();
        this.checkPlatformCollisions();
        this.updateCamera(canvasWidth);
        this.checkWinCondition();
        this.checkEnemyCollisions();
        this.updateEnemies();
        this.updateProjectiles();
    }
    
    // Handle player horizontal movement
    private handlePlayerMovement(): void {
        if (this.keys.ArrowLeft) {
            this.player.x -= this.player.speed;
            this.lastDirection = -1; // Update last direction when moving left
        }
        if (this.keys.ArrowRight) {
            this.player.x += this.player.speed;
            this.lastDirection = 1; // Update last direction when moving right
        }
        
        // Handle jump
        if (this.keys.ArrowUp && this.player.isGrounded) {
            this.player.velocityY = this.player.jumpForce;
            this.player.isGrounded = false;
        }
        
        // Movement boundaries
        this.player.x = Math.max(0, Math.min(this.worldWidth - this.player.width, this.player.x));
    }
    
    // Handle fireball shooting
    private handleFireball(): void {
        if (this.keys[' ']) {
            this.lastFireballTime = shootFireball(
                this.player, 
                GameController.projectiles, 
                this.lastDirection, 
                this.lastFireballTime, 
                this.fireballCooldown
            );
        }
    }
    
    // Apply gravity to player
    private applyGravity(): void {
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;
    }
    
    // Check collisions with platforms
    private checkPlatformCollisions(): void {
        this.player.isGrounded = false;
        this.platforms.forEach(platform => {
            if (collision(this.player, platform)) {
                if (this.player.velocityY > 0) {
                    this.player.isGrounded = true;
                    this.player.velocityY = 0;
                    this.player.y = platform.y - this.player.height;
                }
            }
        });
    }
    
    // Update camera position
    private updateCamera(canvasWidth: number): void {
        const cameraEdge = canvasWidth / 2;
        if (this.player.x > this.cameraOffset + cameraEdge) {
            this.cameraOffset = this.player.x - cameraEdge;
        }
        this.cameraOffset = Math.max(0, Math.min(this.worldWidth - canvasWidth, this.cameraOffset));
    }
    
    // Check win condition
    private checkWinCondition(): void {
        if (this.player.x >= this.worldWidth - this.player.width) {
            alert('Parabéns! Você completou a fase!');
            this.resetPlayerPosition();
        }
    }
    
    // Check collisions with enemies
    private checkEnemyCollisions(): void {
        for (const enemy of this.enemies) {
            if (enemy.alive && collision(this.player, enemy)) {
                // Check if player is jumping on enemy from above
                if (checkTopCollision(this.player, enemy)) {
                    enemy.alive = false; // Kill the enemy
                    this.player.velocityY = this.player.jumpForce * 0.7; // Bounce player up a bit
                } else {
                    // Player collided with enemy from side or below
                    this.resetPlayerPosition();
                }
            }
        }
    }
    
    // Reset player position (after death or win)
    private resetPlayerPosition(): void {
        this.player.x = 50;
        this.player.y = 100;
        this.cameraOffset = 0;
    }
    
    // Update all enemies
    private updateEnemies(): void {
        this.enemies.forEach(enemy => enemy.update(this.player));
    }
    
    // Update all projectiles
    private updateProjectiles(): void {
        updateProjectiles(
            GameController.projectiles,
            this.platforms,
            this.enemies,
            this.player,
            this.gravity,
            this.worldWidth,
            this.cameraOffset
        );
    }
    
    // Getter for camera offset
    public getCameraOffset(): number {
        return this.cameraOffset;
    }
}