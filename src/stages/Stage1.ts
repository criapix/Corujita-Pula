import { Stage } from './Stage';
import { WalkerEnemy } from '../enemies/WalkerEnemy';
import { JumperEnemyImpl } from '../enemies/JumperEnemy';
import { FlyerEnemyImpl } from '../enemies/FlyerEnemy';
import { ThrowerEnemyImpl } from '../enemies/ThrowerEnemy';

/**
 * First stage implementation with specific terrain and enemy placement
 */
export class Stage1 extends Stage {
    constructor() {
        // Initialize with the same dimensions as in game.ts
        super(5000, 800, 0.5);
    }

    /**
     * Creates the terrain for Stage 1 by adding platforms to the TileMap
     * using bottom-left corner coordinates and dimensions
     */
    protected createTerrain(): void {
        this.tileMap.addPlatformByCoordinates(0, 3, 5, 1);
    }

    /**
     * Creates and positions enemies for Stage 1
     */
    protected createEnemies(): void {
        const tileSize = this.tileMap.getTileSize();

        // Walkers (positioned on specific platforms)
        this.enemies.push(
            // Platform at row 16, col 25 (second platform)
            { ...WalkerEnemy, x: 26 * tileSize, y: (16 * tileSize) - 128, platform: this.platforms[20], alive: true },
            // Platform at row 15, col 93 (floating platform)
            { ...WalkerEnemy, x: 95 * tileSize, y: (15 * tileSize) - 128, platform: this.platforms[80], alive: true }
        );

        // Jumpers (positioned on specific platforms)
        this.enemies.push(
            // Platform at row 12, col 37 (floating platform)
            { ...JumperEnemyImpl, x: 39 * tileSize, y: (12 * tileSize) - 128, platform: this.platforms[40], alive: true },
            // Platform at row 10, col 84 (floating platform)
            { ...JumperEnemyImpl, x: 86 * tileSize, y: (10 * tileSize) - 128, platform: this.platforms[70], alive: true }
        );

        // Flyers (positioned in air above platforms)
        this.enemies.push(
            // Above platform at row 9, col 56 (floating platform)
            { ...FlyerEnemyImpl, x: 58 * tileSize, y: 7 * tileSize, initialY: 7 * tileSize, platform: null, alive: true },
            // Above platform at row 9, col 112 (floating platform)
            { ...FlyerEnemyImpl, x: 114 * tileSize, y: 7 * tileSize, initialY: 7 * tileSize, platform: null, alive: true }
        );

        // Throwers (positioned on specific platforms)
        this.enemies.push(
            // Platform at row 14, col 71 (floating platform)
            { ...ThrowerEnemyImpl, x: 73 * tileSize, y: (14 * tileSize) - 128, platform: this.platforms[60], alive: true },
            // Platform at row 10, col 125 (floating platform)
            { ...ThrowerEnemyImpl, x: 127 * tileSize, y: (10 * tileSize) - 128, platform: this.platforms[90], alive: true },
            // Platform at row 7, col 134 (floating platform)
            { ...ThrowerEnemyImpl, x: 136 * tileSize, y: (7 * tileSize) - 128, platform: this.platforms[100], alive: true }
        );
    }
}