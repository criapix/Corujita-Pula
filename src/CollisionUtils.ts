import { GameObject } from './GameObject.js';
import { Player } from './Player.js';
import { EnemyObject } from './EnemyObject.js';

// Collision detection between two game objects
export function collision(rect1: GameObject, rect2: GameObject): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check if player is jumping on enemy from above
export function checkTopCollision(player: Player, enemy: EnemyObject): boolean {
    return player.x + player.width > enemy.x &&
           player.x < enemy.x + enemy.width &&
           player.y + player.height >= enemy.y &&
           player.y + player.height <= enemy.y + enemy.height/2 &&
           player.velocityY > 0;
}