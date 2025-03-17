import { GameObject } from '../core/GameObject';
import { Platform } from '../Platform';
import { Player } from '../core/Player';
import { EnemyType } from './EnemyType';

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