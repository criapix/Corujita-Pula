import { KeyState } from '../KeyState';

export class TouchControls {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private keys: KeyState;
    private buttonSize: number = 64;
    private margin: number = 20;
    private isTouch: boolean;

    // Botões virtuais
    private leftButton: { x: number; y: number; width: number; height: number };
    private rightButton: { x: number; y: number; width: number; height: number };
    private jumpButton: { x: number; y: number; width: number; height: number };
    private fireButton: { x: number; y: number; width: number; height: number };

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, keys: KeyState) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Inicializa os botões com posições temporárias
        this.leftButton = { x: 0, y: 0, width: this.buttonSize, height: this.buttonSize };
        this.rightButton = { x: 0, y: 0, width: this.buttonSize, height: this.buttonSize };
        this.jumpButton = { x: 0, y: 0, width: this.buttonSize, height: this.buttonSize };
        this.fireButton = { x: 0, y: 0, width: this.buttonSize, height: this.buttonSize };

        // Atualiza as posições dos botões
        this.updateButtonPositions();

        this.setupTouchEvents();
        this.setupMouseEvents();
    }

    private updateButtonPositions(): void {
        const bottomMargin = this.margin;
        const y = this.canvas.height - this.buttonSize - bottomMargin;

        // Posiciona os botões de movimento na esquerda
        this.leftButton.x = this.margin;
        this.leftButton.y = y;
        this.rightButton.x = this.margin + this.buttonSize + 10;
        this.rightButton.y = y;

        // Posiciona os botões de ação na direita
        this.fireButton.x = this.canvas.width - this.buttonSize - this.margin;
        this.fireButton.y = y;
        this.jumpButton.x = this.canvas.width - (this.buttonSize * 2) - this.margin - 10;
        this.jumpButton.y = y;
        this.fireButton.y = y;
    }

    private setupMouseEvents(): void {
        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const pixelRatio = window.devicePixelRatio || 1;
            const scaleX = rect.width / this.canvas.width;
            const scaleY = rect.height / this.canvas.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            if (this.isPointInButton(x, y, this.leftButton)) {
                this.keys['ArrowLeft'] = true;
            }
            if (this.isPointInButton(x, y, this.rightButton)) {
                this.keys['ArrowRight'] = true;
            }
            if (this.isPointInButton(x, y, this.jumpButton)) {
                this.keys['ArrowUp'] = true;
            }
            if (this.isPointInButton(x, y, this.fireButton)) {
                this.keys[' '] = true;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
            this.keys['ArrowUp'] = false;
            this.keys[' '] = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
            this.keys['ArrowUp'] = false;
            this.keys[' '] = false;
        });
    }

    private setupTouchEvents(): void {
        this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
            e.preventDefault();
            this.handleTouchEvent(e, true);
        });

        this.canvas.addEventListener('touchend', (e: TouchEvent) => {
            e.preventDefault();
            this.handleTouchEvent(e, false);
        });

        this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
            e.preventDefault();
            this.handleTouchEvent(e, true);
        });
    }

    private handleTouchEvent(e: TouchEvent, isPressed: boolean): void {
        const touches = isPressed ? e.touches : e.changedTouches;
        const rect = this.canvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Ajusta o fator de escala considerando o devicePixelRatio
        const scaleX = rect.width / this.canvas.width;
        const scaleY = rect.height / this.canvas.height;
        
        // Reseta as teclas se não houver toques ou se o evento é touchend
        if (!isPressed || touches.length === 0) {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
            this.keys['ArrowUp'] = false;
            this.keys[' '] = false;
            return;
        }

        // Reseta o estado antes de verificar os novos toques
        this.keys['ArrowLeft'] = false;
        this.keys['ArrowRight'] = false;
        this.keys['ArrowUp'] = false;
        this.keys[' '] = false;

        // Verifica cada toque
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const x = (touch.clientX - rect.left) / scaleX;
            const y = (touch.clientY - rect.top) / scaleY;

            // Verifica colisão com cada botão
            if (this.isPointInButton(x, y, this.leftButton)) {
                this.keys['ArrowLeft'] = true;
            }
            if (this.isPointInButton(x, y, this.rightButton)) {
                this.keys['ArrowRight'] = true;
            }
            if (this.isPointInButton(x, y, this.jumpButton)) {
                this.keys['ArrowUp'] = true;
            }
            if (this.isPointInButton(x, y, this.fireButton)) {
                this.keys[' '] = true;
            }
        }
    }

    private isPointInButton(x: number, y: number, button: { x: number; y: number; width: number; height: number }): boolean {
        // Usando uma área retangular para detecção mais precisa
        return x >= button.x && x <= button.x + button.width &&
               y >= button.y && y <= button.y + button.height;
    }

    public draw(): void {
        if (!this.isTouch) return;

        // Atualiza as posições dos botões caso o tamanho da tela tenha mudado
        this.updateButtonPositions();

        this.ctx.save();
        // Reseta a transformação para desenhar na posição correta na tela
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Desenha os botões
        this.drawButton(this.leftButton, '←', this.keys['ArrowLeft']);
        this.drawButton(this.rightButton, '→', this.keys['ArrowRight']);
        this.drawButton(this.jumpButton, '↑', this.keys['ArrowUp']);
        this.drawButton(this.fireButton, '🔥', this.keys[' ']);

        this.ctx.restore();
    }

    private drawButton(button: { x: number; y: number; width: number; height: number }, symbol: string, isPressed: boolean = false): void {
        // Configura o estilo dos botões baseado no estado (pressionado ou não)
        if (isPressed) {
            // Botão pressionado: mais opaco e brilhante
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        } else {
            // Botão normal: mais transparente
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        }
        this.ctx.lineWidth = 2;
        
        // Desenha o círculo do botão
        this.ctx.beginPath();
        this.ctx.arc(
            button.x + button.width / 2,
            button.y + button.height / 2,
            button.width / 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();

        // Desenha o símbolo
        this.ctx.fillStyle = isPressed ? '#FFFFFF' : 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            symbol,
            button.x + button.width / 2,
            button.y + button.height / 2
        );
    }
}