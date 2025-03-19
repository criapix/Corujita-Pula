# Coruja - Jogo de Plataforma Animal

Um jogo onde uma coruja deve navegar por plataformas e enfrentar inimigos animais usando habilidades especiais.

## Visão Geral do Jogo

- **Personagem Principal**:
  - Coruja com capacidade de disparar bolas de fogo
- **Mecânicas Principais**:
  - Movimentação aérea e terrestre
  - Sistema de combate com fireballs
  - 4 inimigos com comportamentos distintos
  - Sistema de projéteis
- **Elementos Visuais**:
  - Céu azul com nuvens em movimento
  - Efeito de parallax para profundidade visual
  - 4 inimigos com sprites distintos

## Tipos de Inimigos

### Andarilho (Walker)
- **Comportamento**: Patrulha horizontal nas plataformas
- **Sprite**: `assets/images/fox-svgrepo-com.svg`

### Saltador (Jumper)
- **Comportamento**: Salta em direção ao jogador quando próximo
- **Sprite**: `assets/images/frog-svgrepo-com.svg`

### Voador (Flyer)
- **Comportamento**: Movimento de voo ondulatório vertical
- **Sprite**: `assets/images/parrot-svgrepo-com.svg`

### Lançador (Thrower)
- **Comportamento**: Arremessa projéteis em arco
- **Sprite**: `assets/images/panda-bear-panda-svgrepo-com.svg`

## Como Jogar
- **Setas**: Movimento horizontal e salto
- **Espaço**: Lançar fireball
- **Mecânicas de Combate**:
  - Pise em inimigos para eliminá-los
  - Fireballs destroem inimigos à distância
  - Evite projéteis inimigos

## Créditos de Assets

- Todos os sprites animais obtidos do repositório público SVGRepo
- Sprites principais por contributors do SVGRepo:
  - Coruja: SVG Design
  - Raposa: Fox vector
  - Sapo: Frog vector
  - Papagaio: Parrot vector

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
- O céu apresenta nuvens em movimento com efeito de parallax.
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
   - Movem-se como os caminhantes
   - Lançam projéteis na direção do jogador quando está dentro do alcance
   - Os projéteis são afetados pela gravidade

### Combate e Derrotar Inimigos

O jogador pode derrotar inimigos de duas maneiras:

1. **Pular em cima**: Ao cair sobre um inimigo vindo de cima, o jogador o derrota e recebe um pequeno impulso para cima.
2. **Bolas de Fogo**: Ao pressionar a tecla F, o jogador lança uma bola de fogo que quica nas plataformas. Se a bola de fogo atingir um inimigo, ele é derrotado.

### Colisões e Consequências

- Colidir com qualquer inimigo pelos lados ou por baixo faz o jogador retornar à posição inicial.
- Os projéteis inimigos são destruídos ao colidir com plataformas ou com o jogador.
- As bolas de fogo do jogador são destruídas ao colidir com inimigos, mas quicam nas plataformas.

## Controles

- **Seta Esquerda**: Move o jogador para a esquerda
- **Seta Direita**: Move o jogador para a direita
- **Seta Cima**: Faz o jogador pular (quando estiver no chão)
- **Tecla F**: Lança uma bola de fogo

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

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias ou correções.