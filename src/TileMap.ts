import { GameObject } from './core/GameObject';
import { Platform, BlockType } from './Platform';

// Class to manage a grid of 32x32 tiles
export class TileMap {
    private tileSize: number = 64;
    private tiles: (Platform | undefined)[][] = [];
    private worldWidth: number;
    private worldHeight: number;
    private columns: number;
    private rows: number;

    constructor(worldWidth: number, worldHeight: number) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        // Calculate tiles vertical

        // Calculate grid dimensions
        this.columns = Math.ceil(worldWidth / this.tileSize);
        this.rows = Math.ceil(worldHeight / this.tileSize);

        // Initialize empty tile grid
        this.initializeEmptyGrid();
    }

    // Initialize an empty grid
    private initializeEmptyGrid(): void {
        this.tiles = [];
        for (let row = 0; row < this.rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.columns; col++) {
                this.tiles[row][col] = undefined;
            }
        }
    }

    // Add a tile at the specified grid position
    public addTile(row: number, col: number, blockType: BlockType = BlockType.GRASS): Platform | undefined {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.columns) {
            console.error(`Tile position out of bounds: (${row}, ${col})`);
            return undefined;
        }

        const x = col * this.tileSize;
        // Invert y-coordinate so that y=0 is at the bottom of the screen
        const y = (this.rows - 1 - row) * this.tileSize;

        const tile = new Platform(x, y, this.tileSize, this.tileSize, blockType);
        this.tiles[row][col] = tile;

        return tile;
    }

    // Add a horizontal platform starting at the specified grid position with given length
    public addPlatform(row: number, startCol: number, length: number, blockType: BlockType = BlockType.GRASS): Platform[] {
        const platform: Platform[] = [];

        for (let col = startCol; col < startCol + length; col++) {
            if (col < this.columns) {
                const tile = this.addTile(row, col, blockType);
                if (tile) {
                    platform.push(tile);
                }
            }
        }

        return platform;
    }

    /**
     * Add a platform defined by bottom-left corner coordinates and dimensions
     * @param x The x-coordinate of the bottom-left corner of the platform
     * @param y The y-coordinate of the bottom-left corner of the platform (where y=0 is at the bottom)
     * @param width The width of the platform
     * @param height The height of the platform
     * @param blockType The type of block to use for the platform
     * @returns Array of Platform objects created
     */
    public addPlatformByCoordinates(x: number, y: number, width: number, height: number, blockType: BlockType = BlockType.GRASS): Platform[] {
        // Calculate the corresponding grid positions
        // Convert from bottom-left corner coordinates and dimensions to grid positions
        const startCol = x;
        const endCol = x + width;
        // Convert y from bottom-origin to grid row (inverted)
        const startRow = y + 2;
        const endRow = y + height + 1;

        const platform: Platform[] = [];

        // Create tiles for each grid position within the specified boundaries
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
                    const tile = this.addTile(row, col, blockType);
                    if (tile) {
                        platform.push(tile);
                    }
                }
            }
        }

        return platform;
    }

    // Get all tiles as a flat array of platforms
    public getAllTiles(): Platform[] {
        const allTiles: Platform[] = [];

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const tile = this.tiles[row][col];
                if (tile) {
                    allTiles.push(tile);
                }
            }
        }

        return allTiles;
    }

    // Get tile at specific world coordinates
    public getTileAtPosition(x: number, y: number): Platform | undefined {
        const col = Math.floor(x / this.tileSize);
        // Convert y from world coordinates to grid row (inverted)
        const row = this.rows - 1 - Math.floor(y / this.tileSize);

        if (row >= 0 && row < this.rows && col >= 0 && col < this.columns) {
            return this.tiles[row][col];
        }

        return undefined;
    }

    // Get tile size
    public getTileSize(): number {
        return this.tileSize;
    }

    // Get grid dimensions
    public getGridDimensions(): { rows: number, columns: number } {
        return { rows: this.rows, columns: this.columns };
    }
}