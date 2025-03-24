/**
 * AudioManager - Classe responsável por gerenciar todos os sons do jogo
 */
export class AudioManager {
    private static instance: AudioManager;
    private sounds: Map<string, HTMLAudioElement>;
    private musicPlaying: boolean = false;
    private soundEnabled: boolean = true;
    private musicEnabled: boolean = true;
    private musicVolume: number = 0.5;
    private soundVolume: number = 0.7;
    private audioInitialized: boolean = false;
    
    private constructor() {
        this.sounds = new Map<string, HTMLAudioElement>();
        this.loadSounds();
        
        // Adiciona listener para quando a aba ficar inativa/ativa
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
    
    /**
     * Gerencia a pausa/retomada da música quando a aba fica inativa/ativa
     */
    private handleVisibilityChange(): void {
        if (document.hidden) {
            // Aba está inativa, pausa a música
            this.pauseBackgroundMusic();
        } else {
            // Aba está ativa novamente, retoma a música se estiver habilitada
            if (this.musicEnabled) {
                this.playBackgroundMusic();
            }
        }
    }
    /**
     * Obtém a instância única do AudioManager (Singleton)
     */
    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    /**
     * Carrega todos os sons do jogo
     */
    private loadSounds(): void {
        // Efeitos sonoros
        this.loadSound('jump', 'assets/audio/jump.flac');
        this.loadSound('doubleJump', 'assets/audio/double-jump.flac');
        this.loadSound('fireball', 'assets/audio/fireball.wav');
        this.loadSound('enemyDeath', 'assets/audio/enemy-death.ogg');
        this.loadSound('playerDeath', 'assets/audio/player-death.wav');
        this.loadSound('platformLand', 'assets/audio/platform-land.mp3');
        this.loadSound('win', 'assets/audio/win.ogg');
        
        // Música de fundo
        this.loadSound('backgroundMusic', 'assets/audio/background-music.ogg', true);
    }
    
    /**
     * Carrega um som específico
     * @param id Identificador do som
     * @param path Caminho do arquivo de som
     * @param isMusic Indica se é música de fundo (para loop)
     */
    private loadSound(id: string, path: string, isMusic: boolean = false): void {
        const audio = new Audio();
        audio.src = path;
        
        if (isMusic) {
            audio.loop = true;
            audio.volume = this.musicVolume;
        } else {
            audio.volume = this.soundVolume;
        }
        
        this.sounds.set(id, audio);
        
        // Adiciona tratamento de erro para arquivos que não existem
        audio.onerror = () => {
            console.warn(`Não foi possível carregar o som: ${path}`);
        };
    }
    
    /**
     * Inicializa o sistema de áudio após interação do usuário
     * Deve ser chamado após um evento de interação (clique, tecla, etc.)
     */
    public initializeAudio(): void {
        if (this.audioInitialized) return;
        
        // Cria um contexto de áudio silencioso para desbloquear a API de áudio
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const silentBuffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = silentBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        
        // Tenta reproduzir e pausar todos os sons para desbloqueá-los
        this.sounds.forEach((sound) => {
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
            }).catch(() => {
                // Ignora erros durante a inicialização
            });
        });
        
        this.audioInitialized = true;
        console.log('Sistema de áudio inicializado com sucesso');
    }
    
    /**
     * Reproduz um som
     * @param id Identificador do som
     */
    public playSound(id: string): void {
        if (!this.soundEnabled && id !== 'backgroundMusic') return;
        if (!this.musicEnabled && id === 'backgroundMusic') return;
        
        const sound = this.sounds.get(id);
        if (sound) {
            // Reinicia o som se já estiver tocando
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.warn(`Erro ao reproduzir som ${id}: ${error.message}`);
                
                // Se o erro for por falta de interação do usuário, marca como não inicializado
                if (error.name === 'NotAllowedError') {
                    this.audioInitialized = false;
                }
            });
        }
    }
    
    /**
     * Reproduz a música de fundo
     */
    public playBackgroundMusic(): void {
        if (!this.musicEnabled) return;
        
        const music = this.sounds.get('backgroundMusic');
        if (music && !this.musicPlaying) {
            music.play().then(() => {
                this.musicPlaying = true;
            }).catch(error => {
                console.warn(`Erro ao reproduzir música de fundo: ${error.message}`);
                
                // Se o erro for por falta de interação do usuário, marca como não inicializado
                if (error.name === 'NotAllowedError') {
                    this.audioInitialized = false;
                }
            });
        }
    }
    
    /**
     * Pausa a música de fundo
     */
    public pauseBackgroundMusic(): void {
        const music = this.sounds.get('backgroundMusic');
        if (music && this.musicPlaying) {
            music.pause();
            this.musicPlaying = false;
        }
    }
    
    /**
     * Ativa/desativa os efeitos sonoros
     * @param enabled Estado dos efeitos sonoros
     */
    public setSoundEnabled(enabled: boolean): void {
        this.soundEnabled = enabled;
    }
    
    /**
     * Ativa/desativa a música de fundo
     * @param enabled Estado da música de fundo
     */
    public setMusicEnabled(enabled: boolean): void {
        this.musicEnabled = enabled;
        
        if (enabled) {
            this.playBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
    }
    
    /**
     * Define o volume dos efeitos sonoros
     * @param volume Volume (0.0 a 1.0)
     */
    public setSoundVolume(volume: number): void {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        
        // Atualiza o volume de todos os efeitos sonoros
        this.sounds.forEach((sound, id) => {
            if (id !== 'backgroundMusic') {
                sound.volume = this.soundVolume;
            }
        });
    }
    
    /**
     * Define o volume da música de fundo
     * @param volume Volume (0.0 a 1.0)
     */
    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        const music = this.sounds.get('backgroundMusic');
        if (music) {
            music.volume = this.musicVolume;
        }
    }
}