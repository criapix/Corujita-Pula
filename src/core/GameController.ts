import { Player } from './Player';
import { Platform } from '../Platform';
import { EnemyObject } from '../enemies/EnemyObject';
import { Projectile } from '../Projectile';
import { KeyState } from '../KeyState';
import { collision, checkTopCollision } from '../utils/CollisionUtils';
import { updateProjectiles, shootFireball } from '../utils/ProjectileUtils';

// Class to handle game logic and updates
export class GameController {
    static projectiles: Projectile[] = [];
    private player: Player;
    private platforms: Platform[];
    private enemies: EnemyObject[];
    private keys: KeyState;
    private gravity: number;
    private worldWidth: number;
    private worldHeight: number;
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
        worldHeight: number,
        fireballCooldown: number
    ) {
        this.player = player;
        this.platforms = platforms;
        this.enemies = enemies;
        this.keys = keys;
        this.gravity = gravity;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight; // Use the value passed from game.ts
        this.fireballCooldown = fireballCooldown;
        
        // Set platforms on player for enemy collision detection
        this.player.platforms = platforms;
        
        // Listen for playerHit event from projectiles
        document.addEventListener('playerHit', () => this.resetGame());
    }
    
    // Main update function
    public update(canvasWidth: number, deltaTime: number = 1/60): void {
        this.handlePlayerMovement(deltaTime);
        this.handleFireball();
        this.applyGravity(deltaTime);
        this.checkPlatformCollisions();
        this.updateCamera(canvasWidth);
        this.checkWinCondition();
        this.checkEnemyCollisions();
        this.checkFallDeath();
        this.updateEnemies(deltaTime);
        this.updateProjectiles(deltaTime);
    }
    
    // Variável para rastrear o estado anterior da tecla de pulo
    private jumpKeyPressed: boolean = false;
    
    // Handle player horizontal movement
    private handlePlayerMovement(deltaTime: number = 1/60): void {
        // Horizontal movement with deltaTime normalization
        if (this.keys.ArrowLeft) {
            this.player.x -= this.player.speed * 60 * deltaTime;
            this.lastDirection = -1; // Update last direction when moving left
        }
        if (this.keys.ArrowRight) {
            this.player.x += this.player.speed * 60 * deltaTime;
            this.lastDirection = 1; // Update last direction when moving right
        }

        // Check for platform collisions
        for (const platform of this.platforms) {
            if (this.player.x + this.player.width > platform.x &&
                this.player.x < platform.x + platform.width &&
                this.player.y + this.player.height > platform.y &&
                this.player.y < platform.y + platform.height) {
                // Prevent player from passing through platforms
                this.player.y = platform.y - this.player.height;
                this.player.velocityY = 0;
                this.player.isGrounded = true;
            }
        }

        // Handle jump with key press/release detection
        if (this.keys.ArrowUp && !this.jumpKeyPressed) {
            // Tecla acabou de ser pressionada
            this.jumpKeyPressed = true;
            
            // Pulo normal quando estiver no chão
            if (this.player.isGrounded) {
                this.player.velocityY = this.player.jumpForce;
                this.player.isGrounded = false;
                this.player.canDoubleJump = true; // Habilita o pulo duplo quando sai do chão
            }
            // Pulo duplo quando estiver no ar e ainda não tiver usado o pulo duplo
            else if (this.player.canDoubleJump) {
                this.player.velocityY = this.player.jumpForce * 0.8; // Força reduzida para o pulo duplo
                this.player.canDoubleJump = false; // Desabilita o pulo duplo até tocar o chão novamente
            }
        } else if (!this.keys.ArrowUp) {
            // Tecla foi solta
            this.jumpKeyPressed = false;
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
    private applyGravity(deltaTime: number = 1/60): void {
        this.player.velocityY += this.gravity * 60 * deltaTime;
        this.player.y += this.player.velocityY * 60 * deltaTime;
    }
    
    // Check collisions with platforms
    private checkPlatformCollisions(): void {
        this.player.isGrounded = false;
        this.platforms.forEach(platform => {
            if (collision(this.player, platform)) {
                if (this.player.velocityY > 0) {
                    // Player is falling and collides with platform from above
                    this.player.isGrounded = true;
                    this.player.velocityY = 0;
                    this.player.y = platform.y - this.player.height;
                    this.player.canDoubleJump = false; // Reseta o pulo duplo quando tocar o chão
                } else if (this.player.velocityY < 0) {
                    // Player is jumping and collides with platform from below
                    this.player.velocityY = 0;
                    this.player.y = platform.y + platform.height;
                }
            }
        });
    }
    
    // Update camera position
    private updateCamera(canvasWidth: number): void {
        // Calculate the visible width of the game world based on the canvas width
        // This ensures we're using the logical width, not the stretched width
        const visibleWidth = canvasWidth;
        const cameraEdge = visibleWidth / 2;
        
        // Camera follows player when they move beyond the center point
        if (this.player.x > this.cameraOffset + cameraEdge) {
            this.cameraOffset = this.player.x - cameraEdge;
        }
        
        // Ensure camera stays within world boundaries
        this.cameraOffset = Math.max(0, Math.min(this.worldWidth - visibleWidth, this.cameraOffset));
    }
    
    // Get camera offset
    public getCameraOffset(): number {
        return this.cameraOffset;
    }
    
    // Check win condition
    private checkWinCondition(): void {
        if (this.player.x >= this.worldWidth - this.player.width) {
            alert('Parabéns! Você completou a fase!');
            this.resetPlayerPosition();
            
            // Reset all key states to prevent keys from remaining pressed
            Object.keys(this.keys).forEach(key => {
                this.keys[key] = false;
            });
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
                    this.resetGame(); // Reset the entire game state
                }
            }
        }
    }
    
    // Reset player position (after death or win)
    private resetPlayerPosition(): void {
        this.player.x = 50;
        this.player.y = 100;
        this.player.canDoubleJump = false; // Reseta o pulo duplo
        this.cameraOffset = 0;
    }
    
    // Reset the entire game state
    private resetGame(): void {
        // Reset player position
        this.resetPlayerPosition();
        
        // Clear all projectiles
        GameController.projectiles.length = 0;
        
        // Reset all enemies to their initial state
        this.enemies.forEach(enemy => {
            enemy.alive = true;
            
            // Reset enemy-specific properties
            if ('velocityY' in enemy) {
                (enemy as any).velocityY = 0;
            }
            
            if ('lastThrowTime' in enemy) {
                (enemy as any).lastThrowTime = 0;
            }
            
            if ('time' in enemy) {
                (enemy as any).time = 0;
            }
        });
    }
    
    // Update all enemies
    private updateEnemies(deltaTime: number = 1/60): void {
        for (const enemy of this.enemies) {
            enemy.update(this.player, this.gravity * 60 * deltaTime);
        }
    }
    
    // Update all projectiles
    private updateProjectiles(deltaTime: number = 1/60): void {
        updateProjectiles(
            GameController.projectiles,
            this.platforms,
            this.enemies,
            this.player,
            this.gravity * 60 * deltaTime,
            this.worldWidth,
            this.cameraOffset,
            deltaTime
        );
    }
    
    // Getter for camera offset já está implementado acima
    
    // Check if player has fallen into a gap/pit
    private checkFallDeath(): void {
        // If player falls below the bottom of the screen, consider it a death
        const deathY = this.worldHeight - 100; // Allow some buffer before triggering death
        
        if (this.player.y > deathY) {
            // Player has fallen into a gap
            this.resetGame();
        }
    }
}