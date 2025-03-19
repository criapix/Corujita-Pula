import { EnemyObject } from './EnemyObject';
import { EnemyType } from './EnemyType';
import { Platform } from '../Platform';
import { Player } from '../core/Player';

// Base walker enemy template
export const WalkerEnemy: EnemyObject = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    speed: 2,
    direction: 1,
    type: EnemyType.WALKER,
    alive: true,
    spritePath: 'assets/images/fox-svgrepo-com.svg',
    velocityY: 0,
    isGrounded: false,
    update: function(player: Player, gravity: number): void {
        // Skip update if enemy is dead
        if (!this.alive) return;

        // Apply gravity
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
            
            // Separate check for platform edges
            if (this.isGrounded && 
                Math.abs(this.y + this.height - platform.y) < 2) { // Use a small tolerance
                // Check if enemy is about to walk off the platform
                const nextX = this.x + (this.speed * this.direction);
                // Add a small margin (2px) to detect edges earlier
                if (nextX <= platform.x + 2 || 
                    nextX + this.width >= platform.x + platform.width - 2) {
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

        // Move in current direction
        this.x += this.speed * this.direction;
    }
};