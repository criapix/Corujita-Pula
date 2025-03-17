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
    spritePath: 'assets/images/fox-svgrepo-com.svg', // Initialize as alive
    update: function(player: Player): void {
        if (!this.alive) return; // Skip update if enemy is dead
        
        this.x += this.speed * this.direction;
        
        // Reverse direction at platform edges
        if (this.platform && 
            (this.x <= this.platform.x || 
            this.x + this.width >= this.platform.x + this.platform.width)) {
            this.direction *= -1;
        }
    }
};