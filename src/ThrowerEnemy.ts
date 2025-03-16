import { EnemyObject } from './EnemyObject.js';
import { GameController } from './GameController.js';
import { Projectile } from './Projectile.js';
import { Player } from './Player.js';
import { WalkerEnemy } from './WalkerEnemy.js';
import { EnemyType } from './EnemyType.js';

// Additional properties for thrower enemy type
export interface ThrowerEnemy extends EnemyObject {
    throwCooldown: number;
    lastThrowTime: number;
    throwRange: number;
}

// Thrower enemy implementation
export const ThrowerEnemyImpl: ThrowerEnemy = {
    ...WalkerEnemy,
    type: EnemyType.THROWER,
    spritePath: 'assets/images/panda-bear-panda-svgrepo-com.svg',
    
    throwCooldown: 2000, // ms between throws
    lastThrowTime: 0,
    throwRange: 400,    // Detection range for throwing
    update: function(player: Player): void {
        // Skip all updates if enemy is dead
        if (!this.alive) return;
        
        // Basic movement like walker
        this.x += this.speed * this.direction;
        
        // Reverse direction at platform edges
        if (this.platform && 
            (this.x <= this.platform.x || 
            this.x + this.width >= this.platform.x + this.platform.width)) {
            this.direction *= -1;
        }
        
        // Throw projectile when player is in range
        const distanceToPlayer = Math.abs(this.x - player.x);
        const currentTime = Date.now();
        
        if (distanceToPlayer < this.throwRange && 
            currentTime - this.lastThrowTime > this.throwCooldown) {
            
            // Create new projectile
            const projectile: Projectile = {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                width: 16,
                height: 16,
                velocityX: (player.x > this.x) ? 7 : -7,
                velocityY: Math.sin(-45 * Math.PI/180) * 10, // 45 degree angle upwards
                isFireball: false,
                active: true
            };
            
            GameController.projectiles.push(projectile);
            this.lastThrowTime = currentTime;
        }
    }
};