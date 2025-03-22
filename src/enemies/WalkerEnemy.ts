import { EnemyObject } from './EnemyObject';
import { EnemyType } from './EnemyType';
import { Platform } from '../Platform';
import { Player } from '../core/Player';

// Base walker enemy template with AI behavior
export const WalkerEnemy: EnemyObject = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    speed: 2,
    direction: 1,
    detectionRange: 250, // Range at which enemy detects player
    type: EnemyType.WALKER,
    alive: true,
    spritePath: 'assets/images/fox-svgrepo-com.svg',
    velocityY: 0,
    isGrounded: false,
    update: function(player: Player, gravity: number, deltaTime: number = 1/60): void {
        // Skip update if enemy is dead
        if (!this.alive) return;

        // Apply gravity with deltaTime normalization
        this.velocityY += gravity;
        this.y += this.velocityY;

        // Get all platforms from the game controller
        const platforms = player.platforms || [];
        
        // Check collisions with all platforms
        this.isGrounded = false;
        for (const platform of platforms) {
            // Vertical collision check (landing on platform)
            // Add a small margin (1px) to avoid precision issues
            if (this.x + this.width - 1 > platform.x &&
                this.x + 1 < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                if (this.velocityY > 0) {
                    this.isGrounded = true;
                    this.velocityY = 0;
                    this.y = platform.y - this.height;
                }
            }
        }
        
        // AI BEHAVIOR: Check if player is within detection range
        const distanceToPlayer = Math.abs(this.x - player.x);
        const verticalDistance = Math.abs(this.y - player.y);
        // Only consider player nearby if they are within horizontal range AND at similar height
        const playerIsNearby = distanceToPlayer < this.detectionRange && verticalDistance < this.height;
        
        // Determine direction based on player position when in range
        if (playerIsNearby && this.isGrounded) {
            // Set direction toward player
            const directionToPlayer = player.x < this.x ? -1 : 1;
            this.direction = directionToPlayer;
            
            // Check if moving toward player would make us fall off platform
            let wouldFallOffPlatform = true;
            const nextX = this.x + (this.speed * this.direction);
            
            // Check if there's ground beneath our next position
            for (const platform of platforms) {
                if (nextX + this.width > platform.x && 
                    nextX < platform.x + platform.width &&
                    Math.abs(this.y + this.height - platform.y) < 2) {
                    wouldFallOffPlatform = false;
                    break;
                }
            }
            
            // Don't walk off platforms even when chasing player
            if (wouldFallOffPlatform) {
                this.direction *= -1;
            }
        } else {
            // Standard platform edge detection when player is not nearby
            if (this.isGrounded) {
                // Check if enemy is about to walk off the platform
                const nextX = this.x + (this.speed * this.direction);
                let onPlatformEdge = true;
                
                // Check if there's ground beneath our next position
                for (const platform of platforms) {
                    if (nextX + this.width > platform.x && 
                        nextX < platform.x + platform.width &&
                        Math.abs(this.y + this.height - platform.y) < 2) {
                        onPlatformEdge = false;
                        break;
                    }
                }
                
                if (onPlatformEdge) {
                    this.direction *= -1;
                }
            }
        }
        
        // Check collisions with other enemies before moving
        const nextX = this.x + (this.speed * this.direction);
        let shouldChangeDirection = false;
        
        // Get all enemies from the game
        if (player && Array.isArray(player.enemies)) {
            for (const otherEnemy of player.enemies) {
                // Skip self and dead enemies
                if (otherEnemy === this || !otherEnemy.alive) continue;
                
                // Check if we would collide with this enemy after moving
                if (nextX + this.width > otherEnemy.x && 
                    nextX < otherEnemy.x + otherEnemy.width &&
                    this.y + this.height > otherEnemy.y &&
                    this.y < otherEnemy.y + otherEnemy.height) {
                    shouldChangeDirection = true;
                    break;
                }
            }
        }
        
        // Change direction if we would collide with another enemy
        if (shouldChangeDirection) {
            this.direction *= -1;
        }

        // Move in current direction with deltaTime normalization
        this.x += this.speed * this.direction;
    }
};