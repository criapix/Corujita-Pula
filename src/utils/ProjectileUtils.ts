import { Projectile } from '../Projectile';
import { Platform } from '../Platform';
import { Player } from '../core/Player';
import { EnemyObject } from '../enemies/EnemyObject';
import { collision } from './CollisionUtils';

// Function to shoot fireball
export function shootFireball(player: Player, projectiles: Projectile[], lastDirection: number, lastFireballTime: number, fireballCooldown: number): number {
    const currentTime = Date.now();
    
    // Check cooldown
    if (currentTime - lastFireballTime < fireballCooldown) {
        return lastFireballTime;
    }
    
    // Create new fireball projectile
    const fireball: Projectile = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 20,
        height: 20,
        velocityX: lastDirection * 8, // Use lastDirection to determine fireball direction
        velocityY: -5, // Initial upward velocity
        active: true,
        isFireball: true // Mark as player's fireball
    };
    
    projectiles.push(fireball);
    return currentTime;
}

// Update projectiles function
export function updateProjectiles(projectiles: Projectile[], platforms: Platform[], enemies: EnemyObject[], player: Player, gravity: number, worldWidth: number, cameraOffset: number): void {
    // Apply gravity and movement to projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        
        projectile.x += projectile.velocityX;
        projectile.velocityY += gravity * 0.5; // Less gravity than player
        projectile.y += projectile.velocityY;
        
        // Check for collisions with platforms
        for (const platform of platforms) {
            if (collision(projectile, platform)) {
                if (projectile.isFireball) {
                    // Bounce fireballs off platforms
                    projectile.velocityY = -projectile.velocityY * 0.7;
                    // Ensure fireball doesn't get stuck in platform
                    projectile.y = platform.y - projectile.height;
                    // Reduce horizontal velocity slightly on bounce
                    projectile.velocityX *= 0.9;
                    // Remove fireball if it's moving too slowly
                    if (Math.abs(projectile.velocityX) < 1 && Math.abs(projectile.velocityY) < 1) {
                        projectiles.splice(i, 1);
                    }
                } else {
                    // Regular enemy projectiles are removed on collision
                    projectiles.splice(i, 1);
                }
                break;
            }
        }
        
        // Check for collision with enemies (only for fireballs)
        if (projectile.isFireball) {
            for (const enemy of enemies) {
                if (enemy.alive && collision(projectile, enemy)) {
                    enemy.alive = false; // Kill the enemy
                    projectiles.splice(i, 1); // Remove the fireball
                    break;
                }
            }
        }
        
        // Check for collision with player (only for enemy projectiles)
        if (!projectile.isFireball && projectile.active && collision(projectile, player)) {
            // Signal that player was hit by projectile
            document.dispatchEvent(new CustomEvent('playerHit'));
            projectiles.splice(i, 1); // Remove projectile
            break;
        }
        
        // Remove projectiles that go off-screen
        if (projectile.y > 600 || // Using canvas.height value 
            projectile.x < 0 || 
            projectile.x > worldWidth) {
            projectiles.splice(i, 1);
        }
    }
}