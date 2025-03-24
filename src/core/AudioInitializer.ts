/**
 * AudioInitializer - Componente responsável por inicializar o sistema de áudio após interação do usuário
 */
import { AudioManager } from './AudioManager';

export class AudioInitializer {
    private static instance: AudioInitializer;
    private initialized: boolean = false;
    private overlayElement: HTMLDivElement | null = null;
    
    private constructor() {
        this.createOverlay();
    }
    
    /**
     * Obtém a instância única do AudioInitializer (Singleton)
     */
    public static getInstance(): AudioInitializer {
        if (!AudioInitializer.instance) {
            AudioInitializer.instance = new AudioInitializer();
        }
        return AudioInitializer.instance;
    }
    
    /**
     * Cria o overlay de inicialização de áudio
     */
    private createOverlay(): void {
        // Cria o elemento de overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'audioOverlay';
        this.overlayElement.style.position = 'fixed';
        this.overlayElement.style.top = '0';
        this.overlayElement.style.left = '0';
        this.overlayElement.style.width = '100%';
        this.overlayElement.style.height = '100%';
        this.overlayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.overlayElement.style.display = 'flex';
        this.overlayElement.style.justifyContent = 'center';
        this.overlayElement.style.alignItems = 'center';
        this.overlayElement.style.zIndex = '1000';
        this.overlayElement.style.cursor = 'pointer';
        
        // Cria o botão de inicialização
        const startButton = document.createElement('button');
        startButton.textContent = 'Clique para iniciar o jogo';
        startButton.style.padding = '15px 30px';
        startButton.style.fontSize = '18px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        
        // Adiciona efeito de hover
        startButton.onmouseover = () => {
            startButton.style.backgroundColor = '#45a049';
        };
        startButton.onmouseout = () => {
            startButton.style.backgroundColor = '#4CAF50';
        };
        
        this.overlayElement.appendChild(startButton);
        
        // Adiciona o overlay ao corpo do documento
        document.body.appendChild(this.overlayElement);
        
        // Adiciona evento de clique para inicializar o áudio
        this.overlayElement.addEventListener('click', this.initializeAudio.bind(this));
    }
    
    /**
     * Inicializa o sistema de áudio e remove o overlay
     */
    private initializeAudio(): void {
        if (this.initialized) return;
        
        // Inicializa o sistema de áudio
        AudioManager.getInstance().initializeAudio();
        
        // Remove o overlay
        if (this.overlayElement) {
            document.body.removeChild(this.overlayElement);
            this.overlayElement = null;
        }
        
        this.initialized = true;
        
        // Não inicia a música de fundo automaticamente
        // Será iniciada após a primeira interação real com o jogo
    }
    
    /**
     * Verifica se o áudio já foi inicializado
     */
    public isInitialized(): boolean {
        return this.initialized;
    }
    
    /**
     * Inicia a música de fundo após a primeira interação real com o jogo
     * Este método deve ser chamado após o jogador pressionar uma tecla ou clicar na tela
     */
    public startBackgroundMusic(): void {
        if (this.initialized) {
            AudioManager.getInstance().playBackgroundMusic();
        }
    }
}