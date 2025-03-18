import { Platform } from '../Platform';
import { TileMap } from '../TileMap';
import { EnemyObject } from '../enemies/EnemyObject';
import { JumperEnemy } from '../enemies/JumperEnemy';
import { FlyerEnemy } from '../enemies/FlyerEnemy';
import { ThrowerEnemy } from '../enemies/ThrowerEnemy';

/**
 * Abstract class that defines the structure for game stages.
 * Each stage implementation will define its own terrain, platforms, and enemy positions.
 */
export abstract class Stage {
    protected worldWidth: number;
    protected worldHeight: number;
    protected gravity: number;
    protected tileMap: TileMap;
    protected platforms: Platform[] = [];
    protected enemies: (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[] = [];
    
    /**
     * Creates a new stage with the specified dimensions
     * @param worldWidth The width of the stage in pixels
     * @param worldHeight The height of the stage in pixels
     * @param gravity The gravity value for the stage
     */
    constructor(worldWidth: number, worldHeight: number, gravity: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.gravity = gravity;
        this.tileMap = new TileMap(worldWidth, worldHeight);
        
        // Initialize the stage
        this.createTerrain();
        this.createEnemies();
        
        // Get all platforms as a flat array
        this.platforms = this.tileMap.getAllTiles();
    }
    
    /**
     * Creates the terrain for the stage by adding platforms to the TileMap
     */
    protected abstract createTerrain(): void;
    
    /**
     * Creates and positions enemies for the stage
     */
    protected abstract createEnemies(): void;
    
    /**
     * Gets the world width of the stage
     */
    public getWorldWidth(): number {
        return this.worldWidth;
    }
    
    /**
     * Gets the world height of the stage
     */
    public getWorldHeight(): number {
        return this.worldHeight;
    }
    
    /**
     * Gets the gravity value for the stage
     */
    public getGravity(): number {
        return this.gravity;
    }
    
    /**
     * Gets all platforms in the stage
     */
    public getPlatforms(): Platform[] {
        return this.platforms;
    }
    
    /**
     * Gets all enemies in the stage
     */
    public getEnemies(): (EnemyObject | JumperEnemy | FlyerEnemy | ThrowerEnemy)[] {
        return this.enemies;
    }
    
    /**
     * Gets the TileMap instance for this stage
     */
    public getTileMap(): TileMap {
        return this.tileMap;
    }
}