import { EnemyObject } from './EnemyObject';
import { GameController } from '../core/GameController';
import { Projectile } from '../Projectile';
import { Player } from '../core/Player';
import { WalkerEnemy } from './WalkerEnemy';
import { EnemyType } from './EnemyType';

// Additional properties for thrower enemy type
export interface ThrowerEnemy extends EnemyObject {
    throwCooldown: number;
    lastThrowTime: number;
    throwRange: number;
    velocityY: number;
    isGrounded: boolean;
}

// Thrower enemy implementation
export const ThrowerEnemyImpl: ThrowerEnemy = {
    ...WalkerEnemy,
    type: EnemyType.THROWER,
    spritePath: 'assets/images/spider-svgrepo-com.svg',
    
    throwCooldown: 2000, // ms between throws
    lastThrowTime: 0,
    throwRange: 400,    // Detection range for throwing
    velocityY: 0,
    isGrounded: false,
    update: function(player: Player, gravity: number): void {
        // Skip all updates if enemy is dead
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
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
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
                this.y + this.height == platform.y) {
                // Check if enemy is about to walk off the platform
                const nextX = this.x + (this.speed * this.direction);
                if (nextX <= platform.x || 
                    nextX + this.width >= platform.x + platform.width) {
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
        
        // Basic movement like walker
        this.x += this.speed * this.direction;
        
        // Throw projectile when player is in range
        const distanceToPlayer = Math.abs(this.x - player.x);
        const currentTime = Date.now();
        
        if (distanceToPlayer < this.throwRange && 
            currentTime - this.lastThrowTime > this.throwCooldown) {
            
            // Create new projectile
            const projectile = new Projectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                (player.x > this.x) ? 7 : -7,
                Math.sin(-45 * Math.PI/180) * 10,
                true,
                false
            );
            
            // Set width and height for the projectile
            projectile.width = 15;
            projectile.height = 15;
            
            GameController.projectiles.push(projectile);
            this.lastThrowTime = currentTime;
        }
    }
};