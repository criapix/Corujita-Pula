import { Projectile } from '../Projectile';
import { Platform } from '../Platform';
import { Player } from '../core/Player';
import { EnemyObject } from '../enemies/EnemyObject';
import { collision } from './CollisionUtils';
import { AudioManager } from '../core/AudioManager';

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
export function updateProjectiles(projectiles: Projectile[], platforms: Platform[], enemies: EnemyObject[], player: Player, gravity: number, worldWidth: number, cameraOffset: number, deltaTime: number = 1/60): void {
    // Apply gravity and movement to projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        
        projectile.x += projectile.velocityX * 60 * deltaTime; // Normalizar com deltaTime
        projectile.velocityY += gravity * 0.5; // Less gravity than player
        projectile.y += projectile.velocityY * 60 * deltaTime; // Normalizar com deltaTime
        
        // Check for collisions with platforms
        for (const platform of platforms) {
            if (collision(projectile, platform)) {
                // For fireballs, check if collision is on top of platform
                if (projectile.isFireball) {
                    // Check if fireball is hitting the top of the platform
                    if (projectile.velocityY > 0 && // Fireball is falling
                        projectile.x + projectile.width > platform.x &&
                        projectile.x < platform.x + platform.width &&
                        projectile.y + projectile.height >= platform.y &&
                        projectile.y + projectile.height <= platform.y + platform.height/2) {
                        
                        // Bounce the fireball
                        projectile.velocityY = -projectile.velocityY * 0.7; // Reduce bounce height by 30%
                        projectile.y = platform.y - projectile.height - 1; // Position above platform with small gap
                        
                        // Play bounce sound
                        AudioManager.getInstance().playSound('platformLand');
                    } 
                    // Check if fireball is hitting the bottom of the platform
                    else if (projectile.velocityY < 0 && // Fireball is moving upward
                        projectile.x + projectile.width > platform.x &&
                        projectile.x < platform.x + platform.width &&
                        projectile.y <= platform.y + platform.height &&
                        projectile.y >= platform.y + platform.height/2) {
                        
                        // Bounce the fireball downward
                        projectile.velocityY = -projectile.velocityY * 0.7; // Reverse and reduce velocity
                        projectile.y = platform.y + platform.height + 1; // Position below platform with small gap
                        
                        // Play bounce sound
                        AudioManager.getInstance().playSound('platformLand');
                    } else {
                        // Side collision - remove the fireball
                        projectiles.splice(i, 1);
                    }
                } else {
                    // For enemy projectiles, always remove on collision
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
                    
                    // Reproduz som de inimigo eliminado
                    AudioManager.getInstance().playSound('enemyDeath');
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