import { GameObject } from './core/GameObject';

// Simple platform interface
export interface Platform extends GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Platform implements Platform {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}