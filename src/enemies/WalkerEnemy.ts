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
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                if (this.velocityY > 0) {
                    this.isGrounded = true;
                    this.velocityY = 0;
                    this.y = platform.y - this.height;
                    
                    // Reverse direction at platform edges
                    if (this.x <= platform.x || 
                        this.x + this.width >= platform.x + platform.width) {
                        this.direction *= -1;
                    }
                }
            }
        }

        // Move in current direction
        this.x += this.speed * this.direction;
    }
};