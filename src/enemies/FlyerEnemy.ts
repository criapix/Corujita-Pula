import { EnemyObject } from './EnemyObject';
import { Player } from '../core/Player';
import { WalkerEnemy } from './WalkerEnemy';
import { EnemyType } from './EnemyType';

// Additional properties for flyer enemy type
export interface FlyerEnemy extends EnemyObject {
    amplitude: number;
    frequency: number;
    initialY: number;
    time: number;
}

// Flyer enemy implementation
export const FlyerEnemyImpl: FlyerEnemy = {
    ...WalkerEnemy,
    type: EnemyType.FLYER,
    spritePath: 'assets/images/butterfly-insect-svgrepo-com.svg',
    amplitude: 100,  // Vertical movement range
    frequency: 0.02, // Speed of oscillation
    initialY: 0,     // Starting Y position
    time: 0,         // Time counter for oscillation
    update: function(player: Player, gravity: number): void {
        // Skip update if enemy is dead
        if (!this.alive) return;
        
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
        
        // Move horizontally like walker
        this.x += this.speed * this.direction;
        
        // Reverse direction at walls or platform edges
        if (this.x <= 0 || this.x + this.width >= 5000) { // Using worldWidth value
            this.direction *= -1;
        }
        
        // Oscillate vertically using sine wave
        this.time += this.frequency;
        this.y = this.initialY + Math.sin(this.time) * this.amplitude;
    }
};