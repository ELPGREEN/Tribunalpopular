# Tribunal Supremo Popular

Gênero: Simulador político / Jogo de escolhas narrativas
Plataforma: Navegador (HTML/CSS/JS) + Terminal (Python)
Público-alvo: Cidadãos interessados em justiça, política, ética e participação democrática

## Como jogar

### Versão Web (recomendada)
Abra o arquivo `index.html` em qualquer navegador moderno.

### Versão Terminal
```bash
python game/tribunal_supremo.py
```

### Versão Flask
```bash
pip install flask
python app.py
```

## Funcionalidades

- 10 casos jurídicos inspirados em temas reais (corrupção, violência policial, crise ambiental, etc.)
- 6 métricas de reputação que reagem às suas decisões
- Sistema de investigação para descobrir provas ocultas
- Eventos aleatórios e crises nacionais
- Fase de diplomacia entre os casos
- **Branching narrativo** com consequências entre casos
- **Sistema de achievements** (9 conquistas desbloqueáveis)
- **Save/Load** automático via navegador
- **New Game+** ao completar os 10 casos com legado > 80
- Nível Avançado com projetos nacionais e diplomacia global

## Mudanças Recentes (v2.0)

- Corrigidos bugs críticos: orçamento inconsistente, funções duplicadas, dificuldade com chave errada
- Adicionado sistema de branching: decisões em casos anteriores afetam casos futuros
- Adicionado save/load com localStorage
- Adicionado sistema de achievements (9 conquistas)
- Adicionado relatório pós-julgamento
- Adicionadas 3 novas crises (política, econômica, cibernética)
- Adicionada tela de escolha de caminho no final (New Game+)
- Corrigida duplicação de código entre app.py, game_logic.py e tribunal_supremo.py
- Corrigido handler de botões de crise que não funcionavam
- CSS limpo (duplicatas removidas)

## v3.0 Quântico (Novo)

- **Motor de Álgebra de Fluxo**: suavização exponencial para ganhos/penalidades (evita inflação e punições irrecuperáveis)
- **Matriz de 10 Casos**: arquivo `game/casos.json` com 10 casos jurídicos + variações condicionais baseadas em tags dimensionais
- **Sistema de 16 Dimensões Finais**: cada combinação de tags gera um final único (Totalitarismo, Anarquia, Distopia Corporativa, Teocracia, Democracia Estável ★, etc.)
- **Ramo Condicional**: Nó 3 bifurca para *Tirânico* ou *Libertário* dependendo da escolha do Nó 1
- **Crises Dinâmicas**: emergências de Falência, Motim ou Insurreição disparam quando métricas ≤ 25 nos nós 3 e 7
- **Sistema de Skills (3 Dimensões)**:
  - *Cinética*: Deslocamento Vetorial, Inércia Decisória, Salto Dimensional
  - *Quântica*: Colapso de Onda, Entropia Reversa, Singularidade Crítica
  - *Temporal*: Dilatação Temporal, Paradoxo do Retorno, Eco de Causalidade
- **9 Achievements Quânticos**: incluindo Efeito Borboleta, Soberania Global, Imortalidade Jurídica
- **Painel Dimensional**: 6 novas métricas (Estabilidade, Ética, Apoio, Orçamento, Diplomacia, Legado) com barras coloridas
- **Engine separada**: `engine.js` contém MotorDimensional, FlowAlgebra, DimensoesFinais, Skills, CrisesDinamicas, AchievementsQuanticos
- **Novas rotas Flask**: `/api/casos`, `/api/proximo`, `/api/dimensao`, `/api/reiniciar` para version servidor
