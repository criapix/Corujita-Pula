import { GameObject } from './GameObject';

// Player interface extending the base GameObject
export interface Player extends GameObject {
    speed: number;
    jumpForce: number;
    velocityY: number;
    isGrounded: boolean;
}