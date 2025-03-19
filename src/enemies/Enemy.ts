import { Platform } from '../Platform';
import { collision } from '../utils/CollisionUtils';

export abstract class Enemy {
    protected x: number = 0;
    protected y: number = 0;
    protected width: number = 64;
    protected height: number = 64;
    protected velocityY: number = 0;
    protected isGrounded: boolean = false;

    constructor() {}

    abstract update(): void;

    // Apply gravity to the enemy
    protected applyGravity(gravity: number): void {
        this.velocityY += gravity;
        this.y += this.velocityY;
    }

    // Check collisions with platforms
    protected checkPlatformCollisions(platforms: Platform[]): void {
        this.isGrounded = false;
        platforms.forEach(platform => {
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y < platform.y + platform.height) {
                if (this.velocityY > 0) {
                    this.isGrounded = true;
                    this.velocityY = 0;
                    this.y = platform.y - this.height;
                }
            }
        });
    }
}
