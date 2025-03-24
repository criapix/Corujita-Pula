import { GameObject } from './core/GameObject';

// Projectile interface for both player fireballs and enemy projectiles
export interface Projectile extends GameObject {
    velocityX: number;
    velocityY: number;
    active: boolean;
    isFireball?: boolean; // Property to identify player fireballs
}

export class Projectile implements Projectile {
  x: number;
  y: number;
  width: number = 20; // Default width for projectiles
  height: number = 20; // Default height for projectiles
  velocityX: number;
  velocityY: number;
  active: boolean;
  isFireball?: boolean;

  constructor(x: number, y: number, velocityX: number, velocityY: number, active: boolean, isFireball?: boolean, width: number = 20, height: number = 20) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.active = active;
    this.isFireball = isFireball;
  }
}