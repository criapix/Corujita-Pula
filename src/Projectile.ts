import { GameObject } from './GameObject';

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
  velocityX: number;
  velocityY: number;
  active: boolean;
  isFireball?: boolean;

  constructor(x: number, y: number, velocityX: number, velocityY: number, active: boolean, isFireball?: boolean) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.active = active;
    this.isFireball = isFireball;
  }
}