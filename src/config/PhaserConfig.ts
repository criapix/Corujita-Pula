import Phaser from 'phaser';

// Configuração básica do Phaser para o jogo Corujita-Pula
export const PhaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600, x: 0 },
            debug: false
        }
    },
    // As cenas serão adicionadas posteriormente
    scene: [],
    // Configurações responsivas
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    // Configurações de renderização
    render: {
        pixelArt: false,
        antialias: true
    },
    // Configurações de áudio
    audio: {
        disableWebAudio: false
    }
};