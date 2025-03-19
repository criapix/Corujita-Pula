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
        
        // Move horizontally like walker
        this.x += this.speed * this.direction;
        
        // Reverse direction at walls
        if (this.x <= 0 || this.x + this.width >= 5000) { // Using worldWidth value
            this.direction *= -1;
        }
        
        // Oscillate vertically using sine wave
        this.time += this.frequency;
        this.y = this.initialY + Math.sin(this.time) * this.amplitude;
    }
};