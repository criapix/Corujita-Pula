import { EnemyObject } from './EnemyObject';
import { Player } from '../core/Player';
import { WalkerEnemy } from './WalkerEnemy';
import { EnemyType } from './EnemyType';

// Additional properties for jumper enemy type
export interface JumperEnemy extends EnemyObject {
    jumpForce: number;
    velocityY: number;
    isGrounded: boolean;
    detectionRange: number;
}

// Jumper enemy implementation
export const JumperEnemyImpl: JumperEnemy = {
    ...WalkerEnemy,
    type: EnemyType.JUMPER,
    spritePath: 'assets/images/frog-svgrepo-com.svg',
    jumpForce: -12,
    velocityY: 0,
    isGrounded: false,
    detectionRange: 300,
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
        
        // Basic movement like walker
        this.x += this.speed * this.direction;
        
        // Jump when player is nearby and enemy is on ground
        const distanceToPlayer = Math.abs(this.x - player.x);
        if (distanceToPlayer < this.detectionRange && this.isGrounded && Math.random() < 0.02) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }
    }
};