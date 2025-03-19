import { GameObject } from './GameObject';
import { Platform } from '../Platform';
import { EnemyObject } from '../enemies/EnemyObject';

// Player interface extending the base GameObject
export interface Player extends GameObject {
    speed: number;
    jumpForce: number;
    velocityY: number;
    isGrounded: boolean;
    platforms?: Platform[];
    enemies?: EnemyObject[];
}