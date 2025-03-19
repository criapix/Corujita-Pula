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
        // Main ground platforms with gaps
        this.tileMap.addPlatformByCoordinates(0, 0, 20, 3);  // Starting platform
        this.tileMap.addPlatformByCoordinates(25, 0, 15, 3); // Platform after first gap
        this.tileMap.addPlatformByCoordinates(45, 0, 20, 3); // Platform after second gap
        this.tileMap.addPlatformByCoordinates(70, 0, 25, 3); // Platform after third gap
        
        // Elevated platforms
        this.tileMap.addPlatformByCoordinates(10, 5, 5, 1);  // Small elevated platform
        this.tileMap.addPlatformByCoordinates(22, 7, 3, 1);  // Small floating platform
        this.tileMap.addPlatformByCoordinates(30, 4, 8, 1);  // Medium elevated platform
        this.tileMap.addPlatformByCoordinates(42, 6, 4, 1);  // Small floating platform
        
        // Middle section platforms
        this.tileMap.addPlatformByCoordinates(50, 3, 6, 1);  // Low platform
        this.tileMap.addPlatformByCoordinates(60, 5, 7, 1);  // Medium platform
        this.tileMap.addPlatformByCoordinates(55, 8, 4, 1);  // High platform
        
        // Final section platforms
        this.tileMap.addPlatformByCoordinates(75, 4, 10, 1); // Long elevated platform
        this.tileMap.addPlatformByCoordinates(90, 7, 5, 1);  // High platform
        this.tileMap.addPlatformByCoordinates(100, 5, 3, 1); // Small platform
        this.tileMap.addPlatformByCoordinates(105, 3, 15, 1); // Final platform
    }

    /**
     * Creates and positions enemies for Stage 1
     * Enemies are positioned using X and Y coordinates only
     * Gravity and collision will make them settle on platforms
     */
    protected createEnemies(): void {
        const tileSize = this.tileMap.getTileSize();

        // Walkers (positioned directly on ground platforms)
        this.enemies.push(
            // Near starting platform
            { ...WalkerEnemy, x: 5 * tileSize, y: 0, alive: true },
            // Near second platform
            { ...WalkerEnemy, x: 26 * tileSize, y: 0, alive: true },
            // Near third platform
            { ...WalkerEnemy, x: 50 * tileSize, y: 0, alive: true },
            // Near final platform
            { ...WalkerEnemy, x: 95 * tileSize, y: 0, alive: true }
        );

        // Jumpers (positioned directly on elevated platforms)
        this.enemies.push(
            // Above elevated platform
            { ...JumperEnemyImpl, x: 12 * tileSize, y: 5 * tileSize - 64, alive: true },
            // Above middle section
            { ...JumperEnemyImpl, x: 39 * tileSize, y: 4 * tileSize - 64, alive: true },
            // Above high platform
            { ...JumperEnemyImpl, x: 56 * tileSize, y: 8 * tileSize - 64, alive: true },
            // Above final section
            { ...JumperEnemyImpl, x: 86 * tileSize, y: 7 * tileSize - 64, alive: true }
        );

        // Flyers (positioned in air)
        this.enemies.push(
            // First section
            { ...FlyerEnemyImpl, x: 15 * tileSize, y: 7 * tileSize, initialY: 7 * tileSize, alive: true },
            // Middle section
            { ...FlyerEnemyImpl, x: 58 * tileSize, y: 7 * tileSize, initialY: 7 * tileSize, alive: true },
            // Final section
            { ...FlyerEnemyImpl, x: 114 * tileSize, y: 7 * tileSize, initialY: 7 * tileSize, alive: true }
        );

        // Throwers (positioned directly on platforms)
        this.enemies.push(
            // First section
            { ...ThrowerEnemyImpl, x: 30 * tileSize, y: 4 * tileSize - 64, alive: true },
            // Middle section
            { ...ThrowerEnemyImpl, x: 73 * tileSize, y: 4 * tileSize - 64, alive: true },
            // Final section high platform
            { ...ThrowerEnemyImpl, x: 92 * tileSize, y: 7 * tileSize - 64, alive: true },
            // Final section
            { ...ThrowerEnemyImpl, x: 127 * tileSize, y: 3 * tileSize - 64, alive: true }
        );
    }
}