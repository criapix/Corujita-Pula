// Class to manage sky background with moving clouds
export class Sky {
    private ctx: CanvasRenderingContext2D;
    private worldWidth: number;
    private clouds: Cloud[];
    private maxClouds: number;
    
    constructor(ctx: CanvasRenderingContext2D, worldWidth: number, maxClouds: number = 10) {
        this.ctx = ctx;
        this.worldWidth = worldWidth;
        this.maxClouds = maxClouds;
        this.clouds = [];
        
        // Initialize clouds
        this.generateClouds();
    }
    
    // Generate initial set of clouds distributed across the entire level
    private generateClouds(): void {
        // Distribute clouds evenly across the entire world width
        const cloudSpacing = this.worldWidth / this.maxClouds;
        
        for (let i = 0; i < this.maxClouds; i++) {
            // Position clouds at regular intervals across the world width
            const xPosition = i * cloudSpacing;
            this.clouds.push(this.createCloud(true, xPosition));
        }
    }
    
    // Create a new cloud object
    private createCloud(randomizeX: boolean = false, specificX?: number): Cloud {
        const width = Math.random() * 100 + 50; // Random width between 50-150
        const height = width * 0.6; // Height proportional to width
        
        // If specificX is provided, use it; otherwise use randomization logic
        let x;
        if (specificX !== undefined) {
            // Add some randomness to the specific position for natural look
            x = specificX + (Math.random() * 100 - 50);
        } else {
            x = randomizeX ? Math.random() * this.worldWidth : this.worldWidth;
        }
        
        const y = Math.random() * 200; // Random y position in top 200px
        const speed = Math.random() * 0.5 + 0.1; // Random speed between 0.1-0.6
        const opacity = Math.random() * 0.4 + 0.3; // Random opacity between 0.3-0.7
        
        return {
            x,
            y,
            width,
            height,
            speed,
            opacity
        };
    }
    
    // Update cloud positions
    public update(cameraOffset: number): void {
        // Move clouds from right to left
        for (let i = 0; i < this.clouds.length; i++) {
            const cloud = this.clouds[i];
            cloud.x -= cloud.speed;
            
            // If cloud moves off-screen to the left, reset it to the right of the entire world
            if (cloud.x + cloud.width < 0) {
                // Place the cloud at the right edge of the world
                const newCloud = this.createCloud(false);
                // Ensure the cloud is positioned relative to the world width, not just the screen
                newCloud.x = this.worldWidth + Math.random() * 100;
                this.clouds[i] = newCloud;
            }
        }
    }
    
    // Draw sky and clouds
    public draw(cameraOffset: number): void {
        // Draw sky background
        this.ctx.save();
        
        // Create gradient for sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.ctx.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue at top
        gradient.addColorStop(1, '#B0E2FF'); // Lighter blue at bottom
        
        // Fill background with gradient, extending beyond visible area
        this.ctx.fillStyle = gradient;
        // Draw background starting from the leftmost point of the world
        this.ctx.fillRect(-this.worldWidth, 0, this.worldWidth * 3, this.ctx.canvas.height);
        
        // Apply camera offset for parallax effect
        this.ctx.translate(cameraOffset * 0.5, 0); // Clouds move at half the speed of foreground
        
        // Draw clouds
        this.clouds.forEach(cloud => {
            // Calculate the adjusted cloud position with parallax effect
            const cameraOffsetParallax = cameraOffset * 0.5;
            
            // Expanded visibility check to ensure clouds are visible across the entire stage
            // Add extra buffer to prevent any gaps
            const screenWidth = this.ctx.canvas.width;
            
            if (cloud.x + cloud.width  > cameraOffsetParallax && cloud.x < cameraOffsetParallax + screenWidth) {
                this.drawCloud(cloud);
            }            
            //console.log("cameraOffset: " + cameraOffset);
        });

        
        this.ctx.restore();
    }
    
    // Draw a single cloud
    private drawCloud(cloud: Cloud): void {
        this.ctx.save();
        this.ctx.globalAlpha = cloud.opacity;
        
        // Draw cloud shape using multiple circles
        this.ctx.fillStyle = '#FFFFFF';
        
        // Main cloud body
        const centerX = cloud.x + cloud.width / 2;
        const centerY = cloud.y + cloud.height / 2;
        const radiusX = cloud.width / 2;
        const radiusY = cloud.height / 2;
        
        // Draw cloud using overlapping circles
        this.ctx.beginPath();
        this.ctx.arc(centerX - radiusX * 0.5, centerY, radiusY * 0.8, 0, Math.PI * 2);
        this.ctx.arc(centerX + radiusX * 0.5, centerY, radiusY * 0.8, 0, Math.PI * 2);
        this.ctx.arc(centerX, centerY - radiusY * 0.3, radiusY * 0.8, 0, Math.PI * 2);
        this.ctx.arc(centerX, centerY + radiusY * 0.3, radiusY * 0.6, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
}

// Cloud interface
interface Cloud {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    opacity: number;
}