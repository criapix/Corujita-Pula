import Phaser from 'phaser';

// Cena base que todas as outras cenas do jogo herdarão
export class BaseScene extends Phaser.Scene {
    constructor(key: string) {
        super(key);
    }

    // Método para carregar assets comuns a todas as cenas
    preload(): void {
        // Carregar assets comuns aqui
        this.load.setPath('assets/');
        
        // Carregar imagens
        this.load.image('owl', 'images/owl.svg');
        this.load.image('owl-back', 'images/owl-back.svg');
        this.load.image('cloud', 'images/cloud-svgrepo-com.svg');
        
        // Carregar áudios
        this.load.audio('jump', ['audio/jump.mp3', 'audio/jump.flac']);
        this.load.audio('double-jump', ['audio/double-jump.flac']);
        this.load.audio('fireball', ['audio/fireball.mp3', 'audio/fireball.wav']);
        this.load.audio('enemy-death', ['audio/enemy-death.mp3', 'audio/enemy-death.ogg']);
        this.load.audio('player-death', ['audio/player-death.mp3', 'audio/player-death.wav']);
        this.load.audio('platform-land', ['audio/platform-land.mp3']);
        this.load.audio('win', ['audio/win.mp3', 'audio/win.ogg']);
        this.load.audio('background-music', ['audio/background-music.ogg']);
    }

    create(): void {
        // Configurações comuns a todas as cenas
    }

    update(time: number, delta: number): void {
        // Lógica de atualização comum
    }
}