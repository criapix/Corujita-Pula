import { GameObject } from './GameObject.js';
import { Platform } from './Platform.js';
import { Player } from './Player.js';
import { EnemyType } from './EnemyType.js';

// Base enemy interface
export interface EnemyObject extends GameObject {
    speed: number;
    direction: number;
    platform: Platform | null;
    type: EnemyType;
    update: (player: Player) => void;
    alive: boolean;
    spritePath: string;
}