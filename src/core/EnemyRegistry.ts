import { EnemyType } from '../enemies/EnemyType';
import { WalkerEnemy } from '../enemies/WalkerEnemy';
import { JumperEnemyImpl } from '../enemies/JumperEnemy';
import { FlyerEnemyImpl } from '../enemies/FlyerEnemy';
import { ThrowerEnemyImpl } from '../enemies/ThrowerEnemy';

// Interface for enemy sprite registry entry
export interface EnemyRegistryEntry {
    type: EnemyType;
    spritePath: string;
    image?: HTMLImageElement;
}

// Class to manage enemy types and their sprites
export class EnemyRegistry {
    private static instance: EnemyRegistry;
    private registry: Map<EnemyType, EnemyRegistryEntry> = new Map();
    private loadedCount: number = 0;
    private totalCount: number = 0;
    private onAllLoaded: (() => void) | null = null;
    
    // Private constructor for singleton pattern
    private constructor() {
        this.registerEnemyType(WalkerEnemy.type, WalkerEnemy.spritePath);
        this.registerEnemyType(JumperEnemyImpl.type, JumperEnemyImpl.spritePath);
        this.registerEnemyType(FlyerEnemyImpl.type, FlyerEnemyImpl.spritePath);
        this.registerEnemyType(ThrowerEnemyImpl.type, ThrowerEnemyImpl.spritePath);
    }
    
    // Get singleton instance
    public static getInstance(): EnemyRegistry {
        if (!EnemyRegistry.instance) {
            EnemyRegistry.instance = new EnemyRegistry();
        }
        return EnemyRegistry.instance;
    }
    
    // Register a new enemy type
    private registerEnemyType(type: EnemyType, spritePath: string): void {
        this.registry.set(type, { type, spritePath });
        this.totalCount++;
    }
    
    // Load all enemy sprites
    public loadAllSprites(onAllLoaded: () => void): void {
        this.onAllLoaded = onAllLoaded;
        
        // If no sprites to load, call callback immediately
        if (this.totalCount === 0) {
            this.onAllLoaded();
            return;
        }
        
        // Load each sprite
        this.registry.forEach((entry) => {
            const image = new Image();
            
            image.onload = () => {
                this.loadedCount++;
                if (this.loadedCount === this.totalCount && this.onAllLoaded) {
                    this.onAllLoaded();
                }
            };
            
            image.onerror = () => {
                console.error(`Error loading enemy sprite: ${entry.spritePath}`);
                // Still count as loaded to prevent blocking the game
                this.loadedCount++;
                if (this.loadedCount === this.totalCount && this.onAllLoaded) {
                    this.onAllLoaded();
                }
            };
            
            image.src = entry.spritePath;
            entry.image = image;
        });
    }
    
    // Get the total number of enemy types
    public getTotalCount(): number {
        return this.totalCount;
    }
    
    // Get all enemy sprites as a map
    public getEnemySprites(): Map<string, HTMLImageElement> {
        const spritesMap = new Map<string, HTMLImageElement>();
        
        this.registry.forEach((entry) => {
            if (entry.image) {
                spritesMap.set(entry.spritePath, entry.image);
            }
        });
        
        return spritesMap;
    }
}