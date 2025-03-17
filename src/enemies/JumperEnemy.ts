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

// Gravity constant needed for jumper physics
const gravity = 0.5;

// Jumper enemy implementation
export const JumperEnemyImpl: JumperEnemy = {
    ...WalkerEnemy,
    type: EnemyType.JUMPER,
    spritePath: 'assets/images/frog-svgrepo-com.svg',
    jumpForce: -12,
    velocityY: 0,
    isGrounded: false,
    detectionRange: 300,
    update: function(player: Player): void {
        // Skip update if enemy is dead
        if (!this.alive) return;
        
        // Apply gravity
        this.velocityY += gravity;
        this.y += this.velocityY;
        
        // Check if on ground
        if (this.platform && this.y + this.height > this.platform.y && 
            this.x + this.width > this.platform.x && 
            this.x < this.platform.x + this.platform.width) {
            this.isGrounded = true;
            this.velocityY = 0;
            this.y = this.platform.y - this.height;
        } else {
            this.isGrounded = false;
        }
        
        // Basic movement like walker
        this.x += this.speed * this.direction;
        
        // Reverse direction at platform edges
        if (this.platform && 
            (this.x <= this.platform.x || 
            this.x + this.width >= this.platform.x + this.platform.width)) {
            this.direction *= -1;
        }
        
        // Jump when player is nearby and enemy is on ground
        const distanceToPlayer = Math.abs(this.x - player.x);
        if (distanceToPlayer < this.detectionRange && this.isGrounded && Math.random() < 0.02) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }
    }
};