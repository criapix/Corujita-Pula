import { Player } from './core/Player';
import { Platform } from './Platform';
import { EnemyObject } from './enemies/EnemyObject';
import { Projectile } from './Projectile';
import { GameController } from './core/GameController';
import { Sky } from './core/Sky';
import { TouchControls } from './core/TouchControls';


// Class to handle all game rendering
export class GameRenderer {
    private ctx: CanvasRenderingContext2D;
    private playerImage: HTMLImageElement;
    private enemyImages: Map<string, HTMLImageElement>;
    private worldWidth: number;
    private sky: Sky;
    private scaleX: number = 1;
    private scaleY: number = 1;
    private touchControls: TouchControls;
    
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
        this.sky = new Sky(ctx, worldWidth, 15);
        // Importar o objeto keys do game.ts
        const keys = (window as any).gameKeys || {};
        this.touchControls = new TouchControls(ctx.canvas, ctx, keys);
        
        // Calculate initial scale factors
        this.updateScaleFactors();
    }
    
    // Update scale factors based on current canvas size and orientation
    public updateScaleFactors(): void {
        const isPortrait = window.innerHeight > window.innerWidth;
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        // Base scale calculation
        let baseScale = Math.min(
            window.innerWidth / this.ctx.canvas.width,
            window.innerHeight / this.ctx.canvas.height
        );
        
        // Apply reduction factor for portrait mode
        if (isPortrait) {
            // Reduce scale more aggressively in portrait mode
            baseScale *= Math.min(1, aspectRatio + 0.3);
        }
        
        this.scaleX = baseScale;
        this.scaleY = baseScale;
    }
    
    // Main draw function
    public draw(player: Player, platforms: Platform[], enemies: EnemyObject[], cameraOffset: number): void {
        // Update scale factors in case canvas size has changed
        this.updateScaleFactors();
        
        this.ctx.save();
        
        // Reset transformations and clear canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Set up the camera and scaling in the correct order
        this.ctx.setTransform(
            this.scaleX, 0,
            0, this.scaleY,
            -cameraOffset * this.scaleX, 0
        );
        
        // Draw sky and clouds with parallax effect
        this.sky.update(cameraOffset);
        this.sky.draw(cameraOffset);
        
        // Draw player
        this.ctx.drawImage(this.playerImage, player.x, player.y, player.width, player.height);
        
        // Draw platforms
        this.drawPlatforms(platforms);
        
        // Draw enemies
        this.drawEnemies(enemies);
        
        // Draw projectiles
        this.drawProjectiles(GameController.projectiles);
        
        this.ctx.restore();
        
        // Draw touch controls
        this.touchControls.draw();
        
        // Debug information
        //console.log(`Drawing at scale: ${this.scaleX}x${this.scaleY}, Camera offset: ${cameraOffset}`);
    }
    
    // Draw all platforms
    private drawPlatforms(platforms: Platform[]): void {
        // Check if platforms array is empty
        if (platforms.length === 0) {
            console.warn('No platforms to draw!');
            return;
        }
        
        //console.log(`Drawing ${platforms.length} platforms`);
        
        // Draw each platform with a border to make them more visible
        platforms.forEach(platform => {
            // Fill platform
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Add border
            this.ctx.strokeStyle = '#27ae60';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // Log the first few platforms for debugging
        //if (platforms.length > 0) {
        //    console.log('First platform:', platforms[0]);
        //}
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