import { Player } from './Player.js';
import { Platform } from './Platform.js';
import { EnemyObject } from './EnemyObject.js';
import { Projectile } from './Projectile.js';
import { GameController } from './GameController.js';


// Class to handle all game rendering
export class GameRenderer {
    private ctx: CanvasRenderingContext2D;
    private playerImage: HTMLImageElement;
    private enemyImages: Map<string, HTMLImageElement>;
    private worldWidth: number;
    
    constructor(
        ctx: CanvasRenderingContext2D, 
        playerImage: HTMLImageElement, 
        enemyImages: Map<string, HTMLImageElement>,
        worldWidth: number
    ) {
        this.ctx = ctx;
        this.playerImage = playerImage;
        this.enemyImages = enemyImages;
        this.worldWidth = worldWidth;
    }
    
    // Main draw function
    public draw(player: Player, platforms: Platform[], enemies: EnemyObject[], cameraOffset: number): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        this.ctx.translate(-cameraOffset, 0);
        
        // Draw world background
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 0, this.worldWidth, this.ctx.canvas.height);
        
        // Draw player
        this.ctx.drawImage(this.playerImage, player.x, player.y, player.width, player.height);
        
        // Draw platforms
        this.drawPlatforms(platforms);
        
        // Draw enemies
        this.drawEnemies(enemies);
        
        // Draw projectiles
        this.drawProjectiles(GameController.projectiles);
        
        this.ctx.restore();
    }
    
    // Draw all platforms
    private drawPlatforms(platforms: Platform[]): void {
        this.ctx.fillStyle = '#2ecc71';
        platforms.forEach(platform => {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }
    
    // Draw all enemies (only if alive)
    private drawEnemies(enemies: EnemyObject[]): void {
        enemies.forEach(enemy => {
            if (enemy.alive) {
                // Get the appropriate image based on sprite path
                const enemyImage = this.enemyImages.get(enemy.spritePath);
                if (enemyImage) {
                    this.ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
                }
            }
        });
    }
    
    // Draw all projectiles
    private drawProjectiles(projectiles: Projectile[]): void {
        projectiles.forEach(projectile => {
            if (projectile.isFireball) {
                // Draw player fireballs as orange circles
                this.ctx.fillStyle = '#ff9500';
                this.ctx.beginPath();
                this.ctx.arc(
                    projectile.x + projectile.width/2, 
                    projectile.y + projectile.height/2, 
                    projectile.width/2, 0, Math.PI * 2
                );
                this.ctx.fill();
                
                // Add glow effect
                this.ctx.shadowColor = '#ff5e00';
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(
                    projectile.x + projectile.width/2, 
                    projectile.y + projectile.height/2, 
                    projectile.width/2 - 2, 0, Math.PI * 2
                );
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            } else {
                // Draw enemy projectiles as red circles
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.beginPath();
                this.ctx.arc(
                    projectile.x + projectile.width/2, 
                    projectile.y + projectile.height/2, 
                    projectile.width/2, 0, Math.PI * 2
                );
                this.ctx.fill();
            }
        });
    }
}