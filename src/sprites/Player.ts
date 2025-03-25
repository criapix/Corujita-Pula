import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    // Propriedades do jogador
    private jumpForce: number;
    private canDoubleJump: boolean;
    private lastDirection: number;
    private lastFireballTime: number;
    private fireballCooldown: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Usar a imagem 'owl' como sprite do jogador
        super(scene, x, y, 'owl');
        
        // Adicionar o sprite à cena e à física
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Configurar propriedades físicas
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setSize(48, 48); // Ajustar o tamanho da hitbox
        
        // Configurar propriedades do jogador
        this.jumpForce = -400;
        this.canDoubleJump = false;
        this.lastDirection = 1; // 1 para direita, -1 para esquerda
        this.lastFireballTime = 0;
        this.fireballCooldown = 500; // em milissegundos
        
        // Configurar animações (serão implementadas posteriormente)
    }
    
    // Método para controlar o movimento horizontal
    moveHorizontal(direction: number): void {
        const speed = 200;
        this.setVelocityX(direction * speed);
        
        // Atualizar a direção do jogador
        if (direction !== 0) {
            this.lastDirection = direction;
            // Virar o sprite na direção correta
            this.setFlipX(direction < 0);
        }
    }
    
    // Método para fazer o jogador pular
    jump(): void {
        const touchingDown = this.body?.touching?.down || this.body?.blocked?.down;
        
        if (touchingDown) {
            // Pulo normal
            this.setVelocityY(this.jumpForce);
            this.canDoubleJump = true;
            this.scene.sound.play('jump');
        } else if (this.canDoubleJump) {
            // Pulo duplo
            this.setVelocityY(this.jumpForce * 0.8);
            this.canDoubleJump = false;
            this.scene.sound.play('double-jump');
        }
    }
    
    // Método para atirar bola de fogo
    shootFireball(time: number): void {
        // Verificar cooldown
        if (time - this.lastFireballTime < this.fireballCooldown) {
            return;
        }
        
        // Atualizar o tempo do último disparo
        this.lastFireballTime = time;
        
        // Reproduzir som
        this.scene.sound.play('fireball');
        
        // Emitir evento para criar a bola de fogo (será implementado na cena)
        this.scene.events.emit('player-shoot-fireball', {
            x: this.x + (this.lastDirection * 30),
            y: this.y,
            direction: this.lastDirection
        });
    }
    
    // Método para lidar com dano
    takeDamage(): void {
        // Reproduzir som de morte
        this.scene.sound.play('player-death');
        
        // Emitir evento de morte do jogador
        this.scene.events.emit('player-death');
    }
    
    // Método para atualizar o estado do jogador
    update(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        // Movimento horizontal
        if (cursors.left.isDown) {
            this.moveHorizontal(-1);
        } else if (cursors.right.isDown) {
            this.moveHorizontal(1);
        } else {
            // Parar o movimento horizontal quando nenhuma tecla está pressionada
            this.moveHorizontal(0);
        }
        
        // Pulo
        if (cursors.up.isDown && cursors.up.getDuration() < 100) {
            this.jump();
        }
        
        // Atirar
        if (cursors.space.isDown && cursors.space.getDuration() < 100) {
            this.shootFireball(time);
        }
    }
}