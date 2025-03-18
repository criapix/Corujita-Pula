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
    platform: null,
    type: EnemyType.WALKER,
    alive: true,
    spritePath: 'assets/images/fox-svgrepo-com.svg',
    update: function(player: Player): void {
        if (!this.alive) return; // Skip update if enemy is dead
        
        // Move in current direction
        this.x += this.speed * this.direction;
        
        // Reverse direction at platform edges
        if (this.platform && 
            (this.x <= this.platform.x || 
            this.x + this.width >= this.platform.x + this.platform.width)) {
            this.direction *= -1;
            
            // Move slightly away from the edge to prevent getting stuck
            if (this.direction === 1) {
                this.x = this.platform.x + 1; // Move right from left edge
            } else {
                this.x = this.platform.x + this.platform.width - this.width - 1; // Move left from right edge
            }
        }
    }
};