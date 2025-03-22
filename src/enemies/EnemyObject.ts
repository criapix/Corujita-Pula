import { GameObject } from '../core/GameObject';
import { Platform } from '../Platform';
import { Player } from '../core/Player';
import { EnemyType } from './EnemyType';

// Base enemy interface
export interface EnemyObject extends GameObject {
    speed: number;
    direction: number;
    type: EnemyType;
    update: (player: Player, gravity: number, deltaTime?: number) => void;
    alive: boolean;
    spritePath: string;
    velocityY: number;
    isGrounded: boolean;
    detectionRange: number;
}