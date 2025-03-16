# Coruja - Jogo de Plataforma Animal

Um jogo 2D desenvolvido em TypeScript onde uma coruja deve navegar por plataformas e enfrentar inimigos animais usando habilidades especiais.

## Visão Geral do Jogo

- **Personagem Principal**: Coruja com capacidade de voo controlável
- **Mecânicas Principais**:
  - Movimentação aérea e terrestre
  - Sistema de combate com fireballs
  - Inimigos com comportamentos únicos
  - Sistema de projéteis
  - Plataformas dinâmicas

## Tipos de Inimigos

### 🐾 Andarilho (Walker)
- **Comportamento**: Patrulha horizontal em plataformas
- **Sprite**: `assets/images/fox-svgrepo-com.svg`

### 🦎 Saltador (Jumper)
- **Comportamento**: Salta em direção ao jogador quando próximo
- **Sprite**: `assets/images/frog-svgrepo-com.svg`

### 🦜 Voador (Flyer)
- **Comportamento**: Movimento ondulatório vertical
- **Sprite**: `assets/images/parrot-svgrepo-com.svg`

### 🐻 Lançador (Thrower)
- **Comportamento**: Arremessa projéteis em arco
- **Sprite**: `assets/images/panda-bear-panda-svgrepo-com.svg`

## Como Jogar
- **Setas**: Movimento horizontal
- **Espaço**: Salto/Voo
- **Tecla F**: Lançar fireball
- **Mecânicas de Combate**:
  - Pise em inimigos para eliminá-los
  - Fireballs destroem inimigos à distância
  - Evite projéteis inimigos

## Configuração e Execução

```bash
npm install
npm run build
npm start
```

Acesse `http://localhost:3000` no seu navegador

## Créditos de Assets

- Todos os sprites animais obtidos do repositório público SVGRepo
- Sprites principais por contributors do SVGRepo:
  - Coruja: SVG Design
  - Raposa: Fox vector
  - Sapo: Frog vector
  - Papagaio: Parrot vector

## Issues Conhecidas

✅ Resolvido - Projéteis do lançador não causavam dano
⚠️ Limitação atual - Colisões aéreas ainda em ajustes
🔄 Em desenvolvimento - Sistema de pontuação e power-ups

## Estrutura de Arquivos

```
├── dist/               # Arquivos JavaScript compilados
│   ├── game.js         # Código do jogo compilado
│   └── game.js.map     # Mapa de origem para depuração
├── src/                # Código-fonte TypeScript
│   └── game.ts         # Código principal do jogo
├── index.html          # Página HTML principal
├── style.css           # Estilos CSS
├── owl.svg             # Sprite do jogador (coruja)
├── owl-back.svg        # Sprite dos inimigos
├── package.json        # Configuração do projeto Node.js
├── package-lock.json   # Versões exatas das dependências
└── tsconfig.json       # Configuração do TypeScript
```

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Compile o código TypeScript:
   ```
   npm run build
   ```
4. Para desenvolvimento com recompilação automática:
   ```
   npm run watch
   ```
5. Abra o arquivo `index.html` em um navegador ou use um servidor HTTP local

## Mecânicas de Jogo

### Jogador

- **Movimento**: O jogador controla uma coruja que pode se mover para a esquerda e direita usando as teclas de seta.
- **Pulo**: A coruja pode pular usando a tecla de seta para cima quando estiver no chão.
- **Ataque de Fogo**: A coruja pode lançar bolas de fogo pressionando a tecla de espaço. As bolas de fogo quicam nas plataformas e destroem inimigos ao tocá-los.
- **Física**: O jogo implementa gravidade e detecção de colisão com plataformas.
- **Câmera**: A câmera segue o jogador horizontalmente quando ele se move pelo mundo.

### Mundo

- O mundo do jogo tem uma largura total de 5000 pixels.
- Existem múltiplas plataformas distribuídas pelo mundo para o jogador navegar.
- O jogador vence ao chegar à extremidade direita do mundo.

### Inimigos

O jogo apresenta quatro tipos diferentes de inimigos, cada um com comportamento único:

1. **Caminhantes (Walkers)**
   - Movem-se horizontalmente em plataformas
   - Invertem a direção ao atingir as bordas da plataforma

2. **Saltadores (Jumpers)**
   - Movem-se como os caminhantes, mas podem pular
   - Detectam o jogador quando está próximo e saltam aleatoriamente
   - Afetados pela gravidade como o jogador

3. **Voadores (Flyers)**
   - Movem-se horizontalmente pelo ar
   - Oscilam verticalmente usando uma função senoidal
   - Não são limitados por plataformas

4. **Atiradores (Throwers)**
   - (param de atacar quando derrotadas)
   - Movem-se como os caminhantes
   - Lançam projéteis na direção do jogador quando está dentro do alcance
   - Os projéteis são afetados pela gravidade

### Combate e Derrotar Inimigos

O jogador pode derrotar inimigos de duas maneiras:

1. **Pular em cima**: Ao cair sobre um inimigo vindo de cima, o jogador o derrota e recebe um pequeno impulso para cima.
2. **Bolas de Fogo**: Ao pressionar a tecla de espaço, o jogador lança uma bola de fogo que quica nas plataformas. Se a bola de fogo atingir um inimigo, ele é derrotado.
   - As bolas de fogo são lançadas inicialmente para a direita, e depois na direção do último movimento do jogador (esquerda ou direita).

### Colisões e Consequências

- Colidir com qualquer inimigo pelos lados ou por baixo faz o jogador retornar à posição inicial.
- Os projéteis inimigos são destruídos ao colidir com plataformas ou com o jogador.
- As bolas de fogo do jogador são destruídas ao colidir com inimigos, mas quicam nas plataformas.

## Controles

- **Seta Esquerda**: Move o jogador para a esquerda
- **Seta Direita**: Move o jogador para a direita
- **Seta Cima**: Faz o jogador pular (quando estiver no chão)
- **Barra de Espaço**: Lança uma bola de fogo

## Implementação Técnica

### Canvas e Renderização

O jogo utiliza o elemento HTML5 Canvas para renderização. O contexto de renderização 2D é usado para desenhar todos os elementos do jogo, incluindo o jogador, inimigos, plataformas e projéteis.

### Sistema de Tipos TypeScript

O código utiliza TypeScript para fornecer tipagem estática, melhorando a manutenibilidade e prevenindo erros. As principais interfaces incluem:

- `GameObject`: Interface base para todos os objetos do jogo
- `Player`: Estende GameObject com propriedades específicas do jogador
- `Platform`: Define as plataformas do mundo
- `EnemyObject`: Interface base para todos os inimigos
- Interfaces específicas para cada tipo de inimigo (JumperEnemy, FlyerEnemy, ThrowerEnemy)
- `Projectile`: Define os projéteis lançados pelos inimigos atiradores e as bolas de fogo do jogador

### Loop de Jogo

O jogo utiliza `requestAnimationFrame` para criar um loop de jogo suave que atualiza a lógica e renderiza os gráficos a cada quadro.

### Física

- **Gravidade**: Uma constante de gravidade é aplicada a objetos que são afetados pela física (jogador, saltadores, projéteis)
- **Colisão**: Função de detecção de colisão baseada em caixas delimitadoras (bounding boxes)
- **Quicar**: As bolas de fogo do jogador quicam nas plataformas com física realista

### Câmera

A câmera segue o jogador horizontalmente, mantendo-o visível na tela enquanto ele se move pelo mundo. A implementação usa uma técnica de deslocamento de câmera (camera offset) que é aplicada durante a renderização.

## Personalização

O jogo pode ser facilmente personalizado modificando os seguintes aspectos:

- **Plataformas**: Adicione ou modifique plataformas no array `platforms`
- **Inimigos**: Adicione novos inimigos ou modifique os existentes no array `enemies`
- **Física**: Ajuste constantes como `gravity`, `jumpForce` e `speed`
- **Mundo**: Modifique `worldWidth` para alterar o tamanho do mundo
- **Visuais**: Substitua os arquivos SVG por seus próprios sprites

## Atualizações Recentes

- Corrigido: Inimigos arremessadores agora param de atirar projéteis quando derrotados

## Créditos

- Sprite da coruja: SVG Repo (www.svgrepo.com)