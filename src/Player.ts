import { GameObject } from './GameObject.js';

// Player interface extending the base GameObject
export interface Player extends GameObject {
    speed: number;
    jumpForce: number;
    velocityY: number;
    isGrounded: boolean;
}