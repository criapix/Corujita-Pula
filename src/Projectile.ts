import { GameObject } from './GameObject.js';

// Projectile interface for both player fireballs and enemy projectiles
export interface Projectile extends GameObject {
    velocityX: number;
    velocityY: number;
    active: boolean;
    isFireball?: boolean; // Property to identify player fireballs
}