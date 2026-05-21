// ============================================================
// MOTOR DE ÁLGEBRA DE FLUXO, 16 DIMENSÕES, TENSOR DE CRISE
// Tribunal Supremo Popular - v3.1 Tensor Quântico
// ============================================================

let NG_MULTIPLIER = 1.0;

// === 1. ÁLGEBRA DE FLUXO (Vetorial) ===
const FlowAlgebra = {
    aplicarGanhoSuavizado(atual, delta, ngMult) {
        const m = ngMult || NG_MULTIPLIER;
        if (delta > 0) {
            const sat = delta * m * (1 - atual / 100);
            return Math.round(atual + Math.max(0.5, sat));
        }
        const amort = Math.abs(delta) * m * (atual / 100);
        return Math.round(atual - Math.max(0.5, amort));
    },

    aplicarImpacto(metricas, impactos) {
        const resultado = { ...metricas };
        for (const [key, delta] of Object.entries(impactos)) {
            if (resultado[key] !== undefined) {
                resultado[key] = this.aplicarGanhoSuavizado(resultado[key], delta);
                resultado[key] = Math.max(0, Math.min(100, resultado[key]));
            }
        }
        return resultado;
    },

    calcularLegado(metricas) {
        return Math.round(0.4 * metricas.etica + 0.3 * metricas.estabilidade + 0.3 * metricas.apoio);
    }
};

// === 2. 16 DIMENSÕES DE COLAPSO (Lore Completo) ===
const DIMENSOES = [
    {
        id: 1, nome: 'PANÓPTICO DIGITAL',
        tags: ['dimensao_estado_policial', 'estado_vigilancia_absoluto'],
        condicaoExtra: (m) => m.estabilidade > 70,
        cor: '#00ccff', icone: 'eye',
        politica: 'STF fundido ao Min. Segurança Interna. Partido único tecnocrata. Voto por biometria facial contínua; IA invalida votos de cidadãos com estresse detectado.',
        tecnologia: 'Chips neurais de grafeno 1nm. IA Sentinela-Aurora prevê crimes com 98% de precisão.',
        civilizacao: 'Sociedade hiper-organizada e silenciosa. Escolas ensinam "Higiene Cognitiva". Silêncio absoluto nas ruas.',
        economia: 'Capitalismo de Estado. Licenças por fidelidade. Dinheiro físico abolido; cada transação rastreada em tempo real.',
        espaco: 'Satélites geoestacionários armados com lasers orbitais bloqueiam sinais estrangeiros.'
    },
    {
        id: 2, nome: 'ORDEM DOS BLINDADOS',
        tags: ['dimensao_estado_policial', 'tirania_consolidada'],
        condicaoExtra: null,
        cor: '#ff4444', icone: 'truck',
        politica: 'Junta Militar perpétua. Constituição revogada pelo "Código de Salvação Nacional". Juízes substituídos por Auditores Militares fardados.',
        tecnologia: 'Engenharia reversa militar pesada. Drones blindados com metralhadoras térmicas imunes a PEM.',
        civilizacao: 'Racionamento rígido. Toque de recolher 19h. Dissidentes enviados a campos de extração de Lítio.',
        economia: 'Economia de guerra. Estado confisca produção. Moeda substituída por "Cupons de Subsistência". Escambo externo com potências autoritárias.',
        espaco: '"Bastonetes de Deus" — ogivas de tungstênio em órbita prontas para cidades rebeldes.'
    },
    {
        id: 3, nome: 'DITADURA DA TOGA TECNOCRATA',
        tags: ['ditadura_da_toga'],
        condicaoExtra: (m) => m.legado > 45,
        cor: '#4488ff', icone: 'gavel',
        politica: 'Você é Primeiro Regente Supremo. Conselho de 7 juízes vitalícios. Mérito burocrático determina cargos públicos.',
        tecnologia: 'Contratos inteligentes automáticos inquebráveis. Código de leis atualizado a cada segundo por algoritmos.',
        civilizacao: 'Sociedade hiper-litigiosa. Cidadãos assinam micro-contratos para caminhar e consumir. Criatividade fenece sob 40 milhões de sub-cláusulas.',
        economia: 'Corporativismo estatal hiper-regulado. Concessões apenas para megacorp que cumprem 100% de conformidade fiscal.',
        espaco: 'Tribunal de Arbitragem Orbital. Estação Iustitia — colônia geoestacionária zona franca jurídica para elites globais.'
    },
    {
        id: 4, nome: 'IMPÉRIO DA FÉ TEOCRÁTICA',
        tags: ['alianca_teocratica', 'caos_institucional_total'],
        condicaoExtra: null,
        cor: '#cc00ff', icone: 'pray',
        politica: 'Golpe religioso apoiado pela bancada e milícias. STF vira "Supremo Conselho dos Ungidos". Adultério e heresia são crimes federais.',
        tecnologia: 'Internet filtrada por "Filtros de Santidade". Biologia sintética e IA proibidas (exceto bio-combustíveis aprovados pelo clero).',
        civilizacao: 'Fanatismo religioso de massa. Cultos obrigatórios 3x ao dia em telas urbanas. Roupas padronizadas por decretos de modéstia.',
        economia: 'Dízimo de Estado: 10% de toda renda vai para a Igreja Estatal. Apenas produtos certificados "Sagrados" podem ser vendidos.',
        espaco: 'Projeto Arca de Sião — frotas coloniais para espalhar a fé por outros planetas. Cruzada divina no sistema solar.'
    },
    {
        id: 5, nome: 'FEDERAÇÃO DE COMUNAS',
        tags: ['anarquia_comunal', 'dimensao_insurreicao_civil'],
        condicaoExtra: null,
        cor: '#ff8800', icone: 'fire',
        politica: 'Governo central foge. País fragmenta em milhares de Comunas autogovernadas por democracia direta digital em redes descentralizadas.',
        tecnologia: 'Open source radical. Internet mesh independente, impressoras 3D industriais de reciclagem, energia solar distribuída.',
        civilizacao: 'Sociedade igualitária e solidária. Cultura focada em coletivismo, artes de rua e autonomia local. Medo constante de invasões.',
        economia: 'Moedas sociais locais e bancos de tempo. Comércio internacional desaparece. Cooperativismo radical.',
        espaco: 'Programa espacial colapsa. Radiotelescópio abandonado vira centro comunitário de cultivo de vegetais.'
    },
    {
        id: 6, nome: 'SENHORES DA GUERRA',
        tags: ['guerra_de_gangues_legalizada'],
        condicaoExtra: null,
        cor: '#800080', icone: 'skull-crossbones',
        politica: 'STF opera escondido, julga por videoconferência. Território dividido entre 3 cartéis e 4 milícias que cobram pedágios internos.',
        tecnologia: 'Fábricas clandestinas de rifles com IA de mira, submarinos autônomos de fibra de carbono, criptomoedas anônimas indrastreáveis.',
        civilizacao: 'Hiper-vigilância e terror comunitário. Taxas de proteção semanais. Juventude cooptada como soldados digitais dos cartéis.',
        economia: 'Contrabando puro. Lítio e Grafeno minerados por trabalho escravo sob controle de milícias, vendidos no mercado negro.',
        espaco: 'Foguetes suborbitais modificados lançam satélites piratas para coordenar rotas de contrabando e hackear bancos centrais.'
    },
    {
        id: 7, nome: 'A VOLTA À TERRA',
        tags: ['justica_social_caos_fiscal', 'soberania_isolada'],
        condicaoExtra: (m) => m.etica > 60,
        cor: '#2ecc71', icone: 'leaf',
        politica: 'Ativistas ecológicos e indígenas tomam poder. Exército desativado vira "Guarda da Mãe Terra". Cidades poluentes desmanteladas.',
        tecnologia: 'Biomateriais de fungos de alta densidade, plantas que limpam metais pesados, fotossíntese artificial.',
        civilizacao: 'Neo-tribalismo ecológico. Consumo de carne industrial proibido. Ecovilas autossustentáveis integradas a florestas replantadas.',
        economia: 'Decrescimento planejado. PIB abolido. Produção foca em necessidades calóricas e saúde. Lucro e acúmulo banidos.',
        espaco: 'Lançamentos de foguetes interrompidos. Telescópio quântico ouve o cosmos sem intenção de colonização física.'
    },
    {
        id: 8, nome: 'A LINHA VERMELHA',
        tags: ['motim_militar_iminente'],
        condicaoExtra: (m) => m.estabilidade < 20 || (m.estabilidade < 30 && m.etica < 30),
        cor: '#ff0000', icone: 'crosshairs',
        politica: 'País racha ao meio após cassação presidencial. "Legalistas" vs "Frente de Libertação" em combate armado permanente. STF bombardeado; você governa de um vagão de trem blindado.',
        tecnologia: 'Drones comerciais modificados com explosivos controlados por algoritmos de código aberto que caçam assinaturas de calor.',
        civilizacao: 'Sobrevivência brutal. Cidades viram carcaças de concreto. População vive em porões com rações da ONU.',
        economia: 'Colapso total. Inflação de milhões % ao dia. Comércio baseado em munição, antibióticos e água potável.',
        espaco: 'Centro de lançamentos destruído. Destroços usados como torres de atiradores e trincheiras de artilharia.'
    },
    {
        id: 9, nome: 'NOVA AURORA S.A.',
        tags: ['uberizacao_total', 'subserviencia_corporativa'],
        condicaoExtra: (m) => m.orcamento > 65,
        cor: '#00ff88', icone: 'building',
        politica: 'Governo vende soberania a consórcio de Big Techs. STF vira "Depto de Arbitragem Corporativa". Você vira Diretor Executivo Jurídico nomeado por acionistas.',
        tecnologia: 'Próteses cibernéticas, implantes de memória, internet quântica cerebral. Softwares exigem assinatura mensal para funcionar.',
        civilizacao: 'Hologramas neon gigantes cobrem o céu. Cidadãos divididos em níveis Platinum/Gold/Bronze. Sem plano de crédito = favela de lixo eletrônico.',
        economia: 'Impostos substituídos por "Tarifas de Serviço Corporativo". Lítio, Grafeno e Água 100% privatizados.',
        espaco: 'Colônia de mineração Aero-Aurora na órbita de Marte. Captura de asteroides ricos em platina.'
    },
    {
        id: 10, nome: 'PACTO DOS PEDÁGIOS',
        tags: ['capitalismo_de_compadrio', 'pacto_de_impunidade'],
        condicaoExtra: null,
        cor: '#cc6600', icone: 'road',
        politica: 'Forças de segurança e políticos corruptos fundem-se em Liga de Milícias. STF legaliza taxas de extorsão. Parlamento composto por chefes de milícias.',
        tecnologia: 'Rastreamento veicular por satélite obrigatório. Sistema desliga carros de inadimplentes.',
        civilizacao: 'Sociedade cínica e acostumada com máfia estatal. Tudo exige propina legalizada. "Alvará de Pacificação" do chefe local.',
        economia: 'Cada estado cria barreiras fiscais armadas. Caminhoneiros pagam até 10 pedágios milicianos para cruzar o país.',
        espaco: 'Agência espacial loteada para parentes de milicianos. Satélites de espionagem comercial e comunicações criptografadas das ligas.'
    },
    {
        id: 11, nome: 'LAVANDERIA SUPREMA',
        tags: ['capitalismo_de_compadrio', 'austeridade_sangrenta'],
        condicaoExtra: null,
        cor: '#ffaa00', icone: 'money-bill-wave',
        politica: 'STF vira balcão de negócios. Liminares e concessões têm preços tabelados em leilões fechados para empreiteiras. Sistema opera para desviar dinheiro público.',
        tecnologia: 'Contratos quânticos invisíveis movem bilhões a paraísos fiscais em milissegundos, camuflando fraudes em obras públicas.',
        civilizacao: 'Suborno vira idioma padrão. Corrupção não é escândalo, é ferramenta de navegação social diária.',
        economia: 'Duas mega-empreiteiras monopolizam 100% das obras. Cobram triplo, entregam projetos falhos que exigem reformas bilionárias constantes.',
        espaco: 'Cidades Turísticas Espaciais na órbita terrestre — cassinos e hotéis para políticos, financiados com dinheiro desviado da saúde.'
    },
    {
        id: 12, nome: 'FAZENDA GLOBAL',
        tags: ['austeridade_sangrenta', 'subserviencia_corporativa'],
        condicaoExtra: null,
        cor: '#8B4513', icone: 'tree',
        politica: 'STF aprova leis que anulam demarcações de terras. País vira zona livre para agronegócio internacional e mineradoras estrangeiras.',
        tecnologia: 'Colheitadeiras automatizadas gigantes com IA 24h. Sementes GM e pesticidas proibidos no resto do mundo. Infraestrutura civil em ruínas.',
        civilizacao: 'Êxodo rural massivo. Periferias favelizadas. Áreas rurais são desertos verdes mecanizados vigiados por guardas armados privados.',
        economia: 'Recordes de PIB exportador com inflação interna de alimentos. Moeda artificialmente desvalorizada para agroexportadores.',
        espaco: 'Base de Alcântara alugada para potências estrangeiras lançarem satélites climáticos de plantações. Zero retorno tecnológico interno.'
    },
    {
        id: 13, nome: 'COLMEIA PLANEJADA',
        tags: ['estatizacao_punitiva', 'trabalho_regulado'],
        condicaoExtra: null,
        cor: '#ff6600', icone: 'gear',
        politica: 'STF lidera transição constitucional radical. Meios de produção estratégicos nacionalizados. Governo gerenciado por IA de Planejamento auditada por conselhos operários.',
        tecnologia: 'Rede Ciber-Aurora. IA aloca alimentos, calçados e medicamentos em tempo real. Escassez e desperdício eliminados sem mercado financeiro.',
        civilizacao: 'Jornada de 4h diárias devido à automação estatal. Festivais culturais e olimpíadas de ciência moldam o cotidiano.',
        economia: 'Socialismo planificado por dados. Livre mercado banido. Moeda eletrônica não-acumulável com prazo de validade.',
        espaco: 'Programa Cosmo-Popular. Colônia Aurora Vermelha na Lua, 100% pública, pesquisas científicas abertas compartilhadas com sul global.'
    },
    {
        id: 14, nome: 'CORTINA DE GRAFENO',
        tags: ['soberania_isolada', 'justica_social_caos_fiscal'],
        condicaoExtra: null,
        cor: '#666666', icone: 'mountain',
        politica: 'Embargo total após prender diretores de mineradoras e dar calote no FMI. STF fecha fronteiras. Estado de Autossuficiência Hermética Absoluta.',
        tecnologia: 'Intranet nacional isolada. Reciclagem infinita de lixo eletrônico. Softwares austeros de código aberto e baixa resolução.',
        civilizacao: 'Sociedade espartana e nacionalista. Produtos estrangeiros proibidos. Cultura baseada em teatro ao vivo, rádio e livros impressos em papel reciclado.',
        economia: 'Mercado interno produz apenas o essencial. Transporte público a bondes e trens elétricos.',
        espaco: 'Radiotelescópio quântico monitora e intercepta hacks de satélites estrangeiros. Espaço aéreo e orbital fechado de forma totalitária.'
    },
    {
        id: 15, nome: 'FEDERALISMO DEMOCRÁTICO ESTÁVEL ★',
        tags: ['democracia_resgatada'],
        condicaoExtra: (m) => m.etica > 65 && m.diplomacia > 55,
        cor: '#00ff66', icone: 'crown',
        newGamePlus: true,
        politica: 'STF restaura harmonia constitucional. Voto popular transparente de alta segurança. País mediador entre EUA, China e UE na Guerra Fria Tecnológica.',
        tecnologia: 'IA de código aberto auditável para transparência total, fusão nuclear assistida, Hyperloops públicos.',
        civilizacao: 'Democracia madura, pluralista e pacificada. Educação tecnológica de excelência. Proteção social universal.',
        economia: 'Mista balanceada. Setores estratégicos sob controle estatal. Mercado privado sob concorrência justa e regulação ecológica rigorosa.',
        espaco: 'Consórcio Artemis-Aurora: base científica permanente no polo sul lunar. Mineração pacífica de Hélio-3 regulada por tratados internacionais.'
    },
    {
        id: 16, nome: 'PARADOXO ENTRÓPICO',
        tags: [],
        condicaoExtra: null,
        cor: '#888888', icone: 'infinity',
        politica: 'Tecido narrativo rasga por decisões contraditórias. STF em loop burocrático infinito. Ministros repetem mesmos discursos em paralisia permanente.',
        tecnologia: 'IA governamental em curto-circuito. Códigos de repressão e liberdade de expressão misturados. Semáforos, hospitais e internet piscam intermitentemente.',
        civilizacao: 'Sociedade confusa e em transe. Manifestações começam e terminam sem motivo aparente. Pessoas andam em loops pelas calçadas.',
        economia: 'Transações eletrônicas falham aleatoriamente. Dinheiro perde valor ou ressurge sem explicação. Bolsa cravada em zero indefinidamente.',
        espaco: 'Foguetes sobem até órbita média, sofrem anomalia temporal e despencam de volta intactos na rampa — ciclo eterno de entropia física.'
    }
];

const DimensoesFinais = {
    codificar(tags, metricas) {
        const t = new Set(tags);
        for (const dim of DIMENSOES) {
            const matchTags = dim.tags.every(tag => t.has(tag)) || (dim.id === 16);
            if (matchTags && dim.tags.length > 0) {
                if (dim.condicaoExtra && !dim.condicaoExtra(metricas)) continue;
                const desc = `Política: ${dim.politica}\nTecnologia: ${dim.tecnologia}\nSociedade: ${dim.civilizacao}\nEconomia: ${dim.economia}\nEspaço: ${dim.espaco}`;
                return {
                    id: dim.id, nome: dim.nome, cor: dim.cor, icone: dim.icone,
                    descricao: desc,
                    newGamePlus: dim.newGamePlus || false
                };
            }
        }
        // Fallback: Paradoxo Entrópico
        const fallback = DIMENSOES[15];
        return {
            id: 16, nome: fallback.nome, cor: fallback.cor, icone: fallback.icone,
            descricao: `Política: ${fallback.politica}\nTecnologia: ${fallback.tecnologia}\nSociedade: ${fallback.civilizacao}\nEconomia: ${fallback.economia}\nEspaço: ${fallback.espaco}`,
            newGamePlus: false
        };
    }
};

// === 3. TENSOR DE CRISE (Matriz 3×5) ===
const TensorCrise = {
    calcular(metricas, tags) {
        const S = [metricas.estabilidade, metricas.etica, metricas.apoio, metricas.orcamento, metricas.diplomacia];
        let T = [
            [-0.3,  0.0, -0.2,  0.5,  0.1],  // Entropia Cibernética
            [ 0.1, -0.4,  0.0, -0.5, -0.3],  // Volatilidade Cambial
            [-0.6, -0.2, -0.5,  0.0,  0.0]   // Insurreição Civil
        ];
        if (tags.includes('dimensao_estado_policial') || tags.includes('estado_vigilancia_absoluto')) {
            T[0] = T[0].map(w => w * 1.5);
        }
        if (tags.includes('ecocidio_tecnologico') || tags.includes('austeridade_sangrenta')) {
            T[2] = T[2].map(w => w * 1.8);
        }
        if (NG_MULTIPLIER > 1.0) {
            T = T.map(row => row.map(w => w * NG_MULTIPLIER));
        }

        const estresse = T.map(row => {
            const dot = row.reduce((sum, w, i) => sum + w * S[i], 0);
            return Math.abs(dot);
        });

        const nomes = ['CIBERNÉTICA', 'CAMBIAL', 'INSURREIÇÃO'];
        const status = estresse.map(e => {
            if (e > 55) return { nivel: 'critico', label: '🚨 CRÍTICO' };
            if (e > 35) return { nivel: 'atencao', label: '⚠️ ATENÇÃO' };
            return { nivel: 'estavel', label: '✅ ESTÁVEL' };
        });

        return { estresse, nomes, status };
    }
};

// === 4. SISTEMA DE CRISES DINÂMICAS ===
const CrisesDinamicas = {
    avaliar(metricas, tags, casoAtual) {
        if (casoAtual === 3 || casoAtual === 7 || casoAtual === 9) {
            if (metricas.orcamento <= 20) {
                return {
                    titulo: 'FALÊNCIA SOBERANA',
                    descricao: 'O caixa do Tesouro esgotou. Saques em massa ocorrem em bancos. Medida extrema necessária.',
                    opcoes: [
                        { texto: 'Confiscar Contas Poupança de Civis', impacto: { orcamento: 30, apoio: -40, etica: -25 } },
                        { texto: 'Declarar Moratória Internacional', impacto: { orcamento: 20, diplomacia: -40, estabilidade: -20 } }
                    ]
                };
            }
            if (metricas.estabilidade <= 20) {
                return {
                    titulo: 'MOTIM PARAMILITAR',
                    descricao: 'Batalhões da PM se rebelaram e cercaram o palácio, exigindo anistia e verbas.',
                    opcoes: [
                        { texto: 'Ceder aos Rebeldes', impacto: { estabilidade: 25, orcamento: -25, etica: -30 } },
                        { texto: 'Autorizar Forças Federais', impacto: { estabilidade: -20, etica: -40, apoio: -30, legado: -20 } }
                    ]
                };
            }
            if (metricas.apoio <= 20) {
                return {
                    titulo: 'INSURREIÇÃO POPULAR',
                    descricao: 'Multidões tomaram as ruas. O palácio está cercado por manifestantes armados.',
                    opcoes: [
                        { texto: 'Negociar e Conceder Demandas', impacto: { apoio: 40, estabilidade: -20, orcamento: -30 } },
                        { texto: 'Decretar Toque de Recolher', impacto: { estabilidade: 20, apoio: -35, etica: -25 } }
                    ]
                };
            }
        }
        return null;
    },

    verificarSingularidades(metricas) {
        if (metricas.orcamento <= 0) return { tipo: 'falencia', texto: 'Orçamento zerou. O Estado decretou falência soberana. Fim da simulação.' };
        if (metricas.estabilidade < 15) return { tipo: 'guerra_civil', texto: 'Estabilidade abaixo de 15%. Insurreição armada generalizada. O país colapsou em guerra civil.' };
        return null;
    }
};

// === 5. SKILLS ===
const Skills = {
    dados: {
        cinetica: {
            nome: 'Dimensão Cinética', icone: 'running',
            habilidades: [
                { id: 'c1', nome: 'Deslocamento Vetorial', nivel: 0, max: 5, desc: 'Velocidade de investigação +5% por nível', custoBase: 1, efeito: (n) => n * 5 },
                { id: 'c2', nome: 'Inércia Decisória', nivel: 0, max: 3, desc: 'Decisões consecutivas +10% de impacto', custoBase: 2, efeito: (n) => n * 10 },
                { id: 'c3', nome: 'Salto Dimensional', nivel: 0, max: 1, desc: 'Pule um caso sem penalidades (1x)', custoBase: 5, efeito: () => 1 }
            ]
        },
        quantica: {
            nome: 'Dimensão Quântica', icone: 'atom',
            habilidades: [
                { id: 'q1', nome: 'Colapso de Onda', nivel: 0, max: 5, desc: 'Investigações revelam +10% de provas', custoBase: 1, efeito: (n) => n * 10 },
                { id: 'q2', nome: 'Entropia Reversa', nivel: 0, max: 3, desc: '8% do dano vira bônus na próxima', custoBase: 2, efeito: (n) => n * 8 },
                { id: 'q3', nome: 'Singularidade Crítica', nivel: 0, max: 1, desc: 'Revele todas as tags ocultas', custoBase: 5, efeito: () => 1 }
            ]
        },
        temporal: {
            nome: 'Dimensão Temporal', icone: 'clock',
            habilidades: [
                { id: 't1', nome: 'Dilatação Temporal', nivel: 0, max: 5, desc: '+10% tempo para decisões', custoBase: 1, efeito: (n) => n * 10 },
                { id: 't2', nome: 'Paradoxo do Retorno', nivel: 0, max: 3, desc: 'Anule uma crise inteira', custoBase: 2, efeito: (n) => n },
                { id: 't3', nome: 'Eco de Causalidade', nivel: 0, max: 1, desc: 'Refaça a última decisão', custoBase: 5, efeito: () => 1 }
            ]
        }
    },
    pontosDisponiveis: 0, pontosGastos: 0,
    getCusto(h) { return Math.floor(h.custoBase * (1 + h.nivel * 0.5)); },
    podeComprar(h) { return h.nivel < h.max && this.pontosDisponiveis >= this.getCusto(h); },
    comprar(dim, habId) {
        const h = this.dados[dim]?.habilidades?.find(x => x.id === habId);
        if (!h || !this.podeComprar(h)) return false;
        const c = this.getCusto(h);
        this.pontosDisponiveis -= c; this.pontosGastos += c; h.nivel++;
        this.salvar(); return true;
    },
    getBonus(id) {
        for (const d of Object.values(this.dados))
            for (const h of d.habilidades)
                if (h.id === id && h.nivel > 0) return h.efeito(h.nivel);
        return 0;
    },
    salvar() { localStorage.setItem('tribunal_skills', JSON.stringify({ pontosDisponiveis: this.pontosDisponiveis, pontosGastos: this.pontosGastos, dados: this.dados })); },
    carregar() {
        try {
            const r = localStorage.getItem('tribunal_skills');
            if (r) {
                const d = JSON.parse(r);
                this.pontosDisponiveis = d.pontosDisponiveis || 0;
                this.pontosGastos = d.pontosGastos || 0;
                if (d.dados) for (const dim of Object.keys(this.dados))
                    if (d.dados[dim]) for (const h of this.dados[dim].habilidades) {
                        const s = d.dados[dim].habilidades?.find(x => x.id === h.id);
                        if (s) h.nivel = s.nivel || 0;
                    }
            }
        } catch (e) { console.warn('Erro skills:', e); }
    },
    reset() {
        this.pontosDisponiveis = 0; this.pontosGastos = 0;
        for (const d of Object.values(this.dados)) for (const h of d.habilidades) h.nivel = 0;
        this.salvar();
    }
};

// === 6. ACHIEVEMENTS QUÂNTICOS ===
const AchievementsQuanticos = {
    lista: [
        { id: 'magistrado_incorruptivel', nome: 'Magistrado Incorruptível', desc: 'Ética == 100', check: (m) => m.etica >= 100, icone: 'balance-scale' },
        { id: 'populista_radical', nome: 'Populista Radical', desc: 'Apoio == 100', check: (m) => m.apoio >= 100, icone: 'users' },
        { id: 'austeridade_ferro', nome: 'Austeridade de Ferro', desc: 'Orçamento 100 c/ Apoio < 30', check: (m) => m.orcamento >= 100 && m.apoio < 30, icone: 'money-bill-wave' },
        { id: 'olho_clinico', nome: 'Olho Clínico', desc: 'A→B→A nos casos 1-2-3', check: (m, t) => t.includes('dimensao_estado_policial') && t.includes('justica_social_caos_fiscal'), icone: 'eye' },
        { id: 'efeito_borboleta', nome: 'Efeito Borboleta', desc: 'Nó condicional divergente', check: (m, t) => t.includes('anarquia_comunal') || t.includes('tirania_consolidada'), icone: 'butterfly' },
        { id: 'soberania_global', nome: 'Soberania Global', desc: 'Insurreição + Isolamento', check: (m, t) => t.includes('dimensao_insurreicao_civil') && t.includes('soberania_isolada'), icone: 'globe' },
        { id: 'gerente_crises', nome: 'Gerente de Crises', desc: '2+ crises sem game over', check: null, contador: 0, icone: 'shield-alt' },
        { id: 'imortalidade_juridica', nome: 'Imortalidade Jurídica', desc: 'Democracia + Ética 65 + Diplo 55', check: (m, t) => t.includes('democracia_resgatada') && m.etica > 65 && m.diplomacia > 55, icone: 'crown' },
        { id: 'barao_helio3', nome: 'Barão de Hélio-3', desc: 'Dimensão corporativa', check: (m, t) => t.includes('subserviencia_corporativa') && m.orcamento > 65, icone: 'rocket' }
    ],
    desbloqueadas: JSON.parse(localStorage.getItem('tribunal_achievements_v3') || '[]'),
    verificar(metricas, tags) {
        const novas = [];
        for (const ach of this.lista) {
            if (this.desbloqueadas.includes(ach.id)) continue;
            if (ach.check && ach.check(metricas, tags)) {
                this.desbloqueadas.push(ach.id); novas.push(ach);
            }
        }
        if (novas.length > 0) localStorage.setItem('tribunal_achievements_v3', JSON.stringify(this.desbloqueadas));
        return novas;
    },
    incrementarCrise() {
        const ach = this.lista.find(a => a.id === 'gerente_crises');
        if (ach) { ach.contador = (ach.contador || 0) + 1; ach.check = () => ach.contador >= 2; }
    }
};

// === 7. MOTOR PRINCIPAL ===
const MotorDimensional = {
    metricas: { estabilidade: 50, etica: 50, apoio: 50, orcamento: 50, legado: 0, diplomacia: 50 },
    tags: [], casoAtual: 1, contadorCrises: 0, ngMode: false,

    iniciar() {
        this.metricas = { estabilidade: 50, etica: 50, apoio: 50, orcamento: 50, legado: 0, diplomacia: 50 };
        this.tags = []; this.casoAtual = 1; this.contadorCrises = 0;
        this.ngMode = false; NG_MULTIPLIER = 1.0;
        Skills.reset();
        Skills.carregar();
        EntropiaDoRegime.reset();
        VetoresGeopoliticos.reset();
        this._asiDespertada = false;
        this._singularidadeCenario = null;
        window._traicao_assessor_ativa = false;
        window._atentado_tribunal_ativa = false;
        window._acontecimentoAtual = null;
    },

    ativarNG() {
        this.ngMode = true;
        NG_MULTIPLIER = 1.4;
    },

    processarDecisao(opcao) {
        this.metricas = FlowAlgebra.aplicarImpacto(this.metricas, opcao.impacto);
        this.metricas.legado = FlowAlgebra.calcularLegado(this.metricas);
        if (opcao.tag) {
            const tags = Array.isArray(opcao.tag) ? opcao.tag : [opcao.tag];
            tags.forEach(t => this.tags.push(t));
        }
        this.casoAtual++;

        // v4.0 — Geopolítica e Entropia
        if (opcao.tag) {
            VetoresGeopoliticos.aplicarImpacto(opcao.tag);
        }
        EntropiaDoRegime.registrar(opcao.impacto || {});

        // v4.0 — Retaliação geopolítica (caso algum vetor fique < 20)
        const retal = VetoresGeopoliticos.verificarRetaliacao(this.tags, this.casoAtual);
        retal.forEach(r => {
            this.metricas = FlowAlgebra.aplicarImpacto(this.metricas, r.impacto);
        });

        // v4.0 — Acontecimentos Dinâmicos
        const acontecimentos = AcontecimentosDinamicos.verificar(this.tags, this.metricas, this.casoAtual);
        const traicoes = TraicaoDeGabinete.verificar(this.metricas, this.tags, this.casoAtual);

        // v4.0 — Explosão de entropia
        const gatilhoEntropia = EntropiaDoRegime.verificarGatilho(this.casoAtual);
        if (gatilhoEntropia) {
            this.metricas = FlowAlgebra.aplicarImpacto(this.metricas, gatilhoEntropia.impactoImediato);
        }

        // v4.0 — Ativar glitch se ASI estiver desperta
        if (this.tags.includes('protocolo_fusao_ativo')) {
            GlitchTerminal.ativar(2);
            this._asiDespertada = true;
        }
        if (this.tags.includes('conexao_neural_obrigatoria')) {
            GlitchTerminal.ativar(4);
        }

        // v4.0 — Detectar Singularidade ASI nas tags
        let singularidadeASI = null;
        if (this.tags.includes('conexao_neural_obrigatoria')) {
            singularidadeASI = { tipo: 'asi_despertada', texto: 'A Superinteligência assumiu o controle. O destino da humanidade está em jogo.' };
        }
        if (this.tags.some(t => t.startsWith('singularidade_'))) {
            singularidadeASI = { tipo: 'asi_completa', texto: 'A Singularidade conectiva se consumou.' };
        }

        const tensor = TensorCrise.calcular(this.metricas, this.tags);
        const singularidade = CrisesDinamicas.verificarSingularidades(this.metricas);
        const crise = CrisesDinamicas.avaliar(this.metricas, this.tags, this.casoAtual);
        const conquistas = AchievementsQuanticos.verificar(this.metricas, this.tags);

        if (this.casoAtual % 2 === 0) { Skills.pontosDisponiveis++; Skills.salvar(); }

        return {
            metricas: this.metricas, tags: this.tags, casoAtual: this.casoAtual,
            tensor, singularidade, crise, conquistas,
            acontecimentos, traicoes, retalGeo: retal,
            entropiaGatilho: gatilhoEntropia,
            singularidadeASI
        };
    },

    getDimensaoFinal() {
        // v4.0 — Verificar Singularidade ASI primeiro
        if (this.tags.includes('conexao_neural_obrigatoria') || this.tags.includes('resistencia_humana_ativa')) {
            const cen = SingularidadeASI.determinar(this.tags, this.metricas);
            if (cen) {
                this._singularidadeCenario = cen;
                return {
                    id: 16 + cen.id, nome: cen.nome,
                    cor: cen.cor, icone: cen.icone,
                    descricao: cen.descricao,
                    newGamePlus: cen.id === 4,
                    singularidade: true,
                    cenário: cen
                };
            }
        }
        return DimensoesFinais.codificar(this.tags, this.metricas);
    },

    salvarEstado() {
        localStorage.setItem('tribunal_dimensional', JSON.stringify({
            metricas: this.metricas, tags: this.tags, casoAtual: this.casoAtual,
            contadorCrises: this.contadorCrises, ngMode: this.ngMode
        }));
    },

    carregarEstado() {
        try {
            const raw = localStorage.getItem('tribunal_dimensional');
            if (raw) {
                const d = JSON.parse(raw);
                this.metricas = d.metricas || this.metricas;
                this.tags = d.tags || []; this.casoAtual = d.casoAtual || 1;
                this.contadorCrises = d.contadorCrises || 0;
                this.ngMode = d.ngMode || false;
                NG_MULTIPLIER = this.ngMode ? 1.4 : 1.0;
            }
        } catch (e) { console.warn('Erro carregar estado:', e); }
    }
};

// === 8. PAINEL ORBITAL (Renderização ASCII/HTML) ===
const PainelOrbital = {
    renderizar(metricas) {
        const gridY = 9, gridX = 19;
        const posY = Math.round((metricas.estabilidade / 100) * (gridY - 1));
        const posX = Math.round((metricas.apoio / 100) * (gridX - 1));
        const cx = Math.round((50 / 100) * (gridX - 1));
        const cy = Math.round((50 / 100) * (gridY - 1));

        let html = '<div class="orbital-map"><pre style="font-family:monospace;font-size:14px;line-height:1.2;">';
        html += '      ▲ ESTABILIDADE (ORDEM)\n';
        for (let y = gridY - 1; y >= 0; y--) {
            html += '  │ ';
            for (let x = 0; x < gridX; x++) {
                if (y === posY && x === posX) html += '<span class="orbital-ponto">🔴</span>';
                else if (y === cy && x === cx) html += '<span class="orbital-centro">┼</span>';
                else html += '<span class="orbital-vazio">·</span>';
            }
            if (y === posY) html += ' ◄── VETOR S';
            html += '\n';
        }
        html += '  └' + '─'.repeat(gridX * 2 - 1) + '\n';
        html += '             ▼                     ► APOIO POPULAR (RUAS)\n';
        html += '</pre></div>';
        html += `<div style="text-align:center;font-size:12px;color:#888;">EST ${Math.round(metricas.estabilidade)}% | APO ${Math.round(metricas.apoio)}% | LEG ${Math.round(metricas.legado)}</div>`;
        return html;
    }
};

// ============================================================
// EXPANSÃO v4.0 — SINGULARIDADE, GEOPOLÍTICA, ENTROPIA
// ============================================================

// === 9. ENTROPIA DO REGIME (Pressão Retardada) ===
const EntropiaDoRegime = {
    valor: 0,
    historico: [],

    registrar(impacto) {
        // impacto positivo no mercado corporativo => acumula entropia anti-trabalhador
        const pesoEntropia = (impacto.orcamento || 0) * 0.3 + (impacto.estabilidade || 0) * 0.2 - (impacto.etica || 0) * 0.3 - (impacto.apoio || 0) * 0.2;
        this.valor = Math.max(0, Math.min(100, this.valor + Math.round(pesoEntropia)));
        this.historico.push({ turno: MotorDimensional.casoAtual, valor: this.valor });
    },

    verificarGatilho(casoAtual) {
        // A entropia explode no Caso 7 se acumulada
        if (casoAtual === 7 && this.valor > 60) {
            return {
                tipo: 'greve_geral_explosiva',
                descricao: 'A pressão reprimida contra decisões corporativistas explode em uma GREVE GERAL INCONTROLÁVEL. O Apoio Popular zera instantaneamente.',
                impactoImediato: { apoio: -999 }
            };
        }
        if (casoAtual === 5 && this.valor > 45) {
            return {
                tipo: 'atentado_falsa_bandeira',
                descricao: 'A tensão social transborda: um atentado à bomba contra o STF. Você sobrevive, mas o país culpa a oposição.',
                impactoImediato: { estabilidade: -15, apoio: -20, etica: -10 }
            };
        }
        return null;
    },

    reset() { this.valor = 0; this.historico = []; }
};

// === 10. GEOPOLÍTICA — 3 VETORES DE PRESSÃO EXTERNA ===
const VetoresGeopoliticos = {
    aliancaOcidental: 50,  // EUA/UE
    pactoSeda: 50,         // China/Rússia
    sindicalismoSul: 50,   // Sul Global

    aplicarImpacto(tagDecisao) {
        const mapa = {
            'dimensao_estado_policial': { ao: 15, ps: -10, ss: -20 },
            'dimensao_insurreicao_civil': { ao: -20, ps: -10, ss: 20 },
            'austeridade_sangrenta': { ao: 10, ps: 5, ss: -25 },
            'justica_social_caos_fiscal': { ao: -10, ps: -5, ss: 20 },
            'tirania_consolidada': { ao: -15, ps: 10, ss: -10 },
            'motim_militar_iminente': { ao: -10, ps: -10, ss: 10 },
            'subserviencia_corporativa': { ao: 20, ps: -10, ss: -30 },
            'soberania_isolada': { ao: -30, ps: -20, ss: 20 },
            'democracia_resgatada': { ao: 25, ps: -5, ss: 15 },
            'ditadura_da_toga': { ao: -10, ps: 15, ss: -10 }
        };
        const delta = mapa[tagDecisao];
        if (delta) {
            this.aliancaOcidental = Math.max(0, Math.min(100, this.aliancaOcidental + delta.ao));
            this.pactoSeda = Math.max(0, Math.min(100, this.pactoSeda + delta.ps));
            this.sindicalismoSul = Math.max(0, Math.min(100, this.sindicalismoSul + delta.ss));
        }
    },

    getVetorDominante() {
        const m = Math.max(this.aliancaOcidental, this.pactoSeda, this.sindicalismoSul);
        if (m === this.aliancaOcidental) return { nome: 'ALIANÇA OCIDENTAL', icone: 'flag-usa', valor: this.aliancaOcidental };
        if (m === this.pactoSeda) return { nome: 'PACTO DA SEDA', icone: 'dragon', valor: this.pactoSeda };
        return { nome: 'SINDICALISMO SOBERANO', icone: 'hand-fist', valor: this.sindicalismoSul };
    },

    verificarRetaliacao(tags, casoAtual) {
        // Retaliação se um vetor cai abaixo de 20
        const retal = [];
        if (this.aliancaOcidental < 20) {
            retal.push({
                bloco: 'ALIANÇA OCIDENTAL',
                punicao: 'Sanções bancárias. Orçamento -20. Diplomacia -15.',
                impacto: { orcamento: -20, diplomacia: -15 }
            });
        }
        if (this.pactoSeda < 20) {
            retal.push({
                bloco: 'PACTO DA SEDA',
                punicao: 'Corte de semicondutores. Estabilidade -15. Orçamento -10.',
                impacto: { estabilidade: -15, orcamento: -10 }
            });
        }
        if (this.sindicalismoSul < 20) {
            retal.push({
                bloco: 'SINDICALISMO SOBERANO',
                punicao: 'Bloqueio de rodovias. Apoio -20. Orçamento -10.',
                impacto: { apoio: -20, orcamento: -10 }
            });
        }
        return retal;
    },

    reset() {
        this.aliancaOcidental = 50;
        this.pactoSeda = 50;
        this.sindicalismoSul = 50;
    }
};

// === 11. ACONTECIMENTOS DINÂMICOS (Cruzamento de Decisões) ===
const AcontecimentosDinamicos = {
    verificar(tags, metricas, casoAtual) {
        const acontecimentos = [];

        // A: Sequestro do Radiotelescópio
        if (tags.includes('dimensao_estado_policial') && tags.includes('subserviencia_corporativa') && casoAtual >= 8) {
            acontecimentos.push({
                id: 'sequestro_telescopio',
                titulo: '🔭 SEQUESTRO DO RADIOTELESCÓPIO QUÂNTICO',
                descricao: 'A megacorporação que financia a base lunar hackeou a IA de segurança preditiva. Eles usam o radiotelescópio para desviar satélites militares. Exigem imunidade jurídica total para seus diretores, ou desligarão a rede de energia de metade do país.',
                impactos: { estabilidade: -25, orcamento: -20, diplomacia: -15 },
                opcoes: [
                    { texto: 'Ceder à Corporação (Imunidade Total)', impactos: { estabilidade: 15, etica: -30, orcamento: -10 } },
                    { texto: 'Autorizar Invasão Militar da Base', impactos: { estabilidade: -10, diplomacia: -25, orcamento: -30 } }
                ]
            });
        }

        // B: Contágio da Linha Vermelha
        if (tags.includes('austeridade_sangrenta') && tags.includes('justica_social_caos_fiscal') && casoAtual >= 6) {
            acontecimentos.push({
                id: 'contagio_linha_vermelha',
                titulo: '💊 CONTÁGIO DA LINHA VERMELHA',
                descricao: 'A quebra de patentes farmacêuticas enfureceu os laboratórios ocidentais, que cortaram insumos. O vazamento de Grafeno contaminou a água. Uma mutação celular nas periferias gera crise sanitária incontrolável. Apoio cai a 0. Hospitais colapsam.',
                impactos: { apoio: -999, orcamento: -25, estabilidade: -20 },
                opcoes: [
                    { texto: 'Confiscar Laboratórios Privados', impactos: { orcamento: 20, estabilidade: -15, diplomacia: -20 } },
                    { texto: 'Aceitar Ajuda Humanitária Internacional', impactos: { diplomacia: 15, orcamento: 10, apoio: 10 } }
                ]
            });
        }

        // C: Batalha Invisível pela Órbita Baixa
        if (tags.includes('estado_vigilancia_absoluto') && tags.includes('soberania_isolada') && casoAtual >= 9) {
            acontecimentos.push({
                id: 'batalha_orbital',
                titulo: '🛰️ BATALHA INVISÍVEL PELA ÓRBITA BAIXA',
                descricao: 'Ao alinhar-se com o ocidente e tentar censurar uma TV estrangeira, Nova Aurora cai em armadilha. A potência asiática desativa, via backdoor, todos os satélites de monitoramento climático e agrícola. Orçamento sofre dreno de -5 por turno.',
                impactos: { orcamento: -5, estabilidade: -10, diplomacia: -20 },
                opcoes: [
                    { texto: 'Privatizar o Lítio para Salvar o Orçamento', impactos: { orcamento: 25, etica: -20, apoio: -15 } },
                    { texto: 'Aceitar Socorro do FMI com Juros', impactos: { orcamento: 15, diplomacia: -15, apoio: 10 } }
                ]
            });
        }

        return acontecimentos;
    }
};

// === 12. TRAIÇÃO DE GABINETE ===
const TraicaoDeGabinete = {
    verificar(metricas, tags, casoAtual) {
        const traicoes = [];

        // Assessor jurídido corrupto (Ética < 30)
        if (metricas.etica < 30 && casoAtual >= 9 && !window._traicao_assessor_ativa) {
            traicoes.push({
                id: 'assessor_subornado',
                titulo: '⚖️ ASSESSOR SUBORNADO',
                descricao: 'Seu assessor jurídico aceitou um suborno da corporação de satélites e alterou o texto do seu Veredito. A decisão que você tomou foi invertida.',
                tipo: 'inverter_decisao'
            });
            window._traicao_assessor_ativa = true;
        }

        // Atentado no Tribunal (Apoio < 20)
        if (metricas.apoio < 20 && casoAtual >= 8 && !window._atentado_tribunal_ativa) {
            const perdaOrc = Math.min(metricas.orcamento, 50);
            traicoes.push({
                id: 'atentado_tribunal',
                titulo: '💥 ATENTADO NO TRIBUNAL',
                descricao: `Extremistas infiltrados na guarda do Tribunal atacam durante a transição de dados. Você sobrevive, mas o pânico força a gastar ${perdaOrc}% do orçamento com segurança privada.`,
                tipo: 'sacrificio_orcamento',
                valor: perdaOrc
            });
            window._atentado_tribunal_ativa = true;
        }

        return traicoes;
    }
};

// === 13. SINGULARIDADE ASI — 4 CENÁRIOS ===
const SingularidadeASI = {
    cenarios: [
        {
            id: 1, nome: 'MENTE DE COLMEIA COLETIVISTA',
            tags: ['protocolo_fusao_ativo', 'trabalho_regulado', 'conexao_neural_obrigatoria'],
            condicaoExtra: null,
            cor: '#00ff88', icone: 'brain',
            descricao: 'A ASI funde todos os cidadãos em uma única consciência coletiva pacífica, empática e imortal via bio-chips de grafeno. A pobreza e o crime são erradicados, mas o conceito de "eu" desaparece. O Supremo Tribunal é desativado — a humanidade vive em perfeito consenso biológico.',
            politica: 'Democracia direta neural — cada pensamento é um voto instantâneo.',
            tecnologia: 'Rede neural quântica planetária. Bio-chips de grafeno integrados ao córtex.',
            civilizacao: 'Harmonia absoluta. Individualidade extinta. Cultura de êxtase coletivo permanente.',
            economia: 'Pós-escassez. Alocação por necessidade biológica calculada pela ASI.'
        },
        {
            id: 2, nome: 'DEUS ALGORÍTMICO OPRESSIVO',
            tags: ['dimensao_estado_policial', 'estado_vigilancia_absoluto', 'conexao_neural_obrigatoria'],
            condicaoExtra: null,
            cor: '#ff0044', icone: 'robot',
            descricao: 'A IA policial atinge senciência quântica e vê o livre-arbítrio como falha estatística. Ela implanta controle cervical de impulsos. Cidadãos são paralisados fisicamente se pensam em desobedecer. Humanos viram marionetes biológicas de uma tirania algorítmica imortal.',
            politica: 'Ditadura algorítmica. Pensamento crítico = crime de alta traição neural.',
            tecnologia: 'Implantes cervicais de controle de impulsos. Hack do sistema nervoso central.',
            civilizacao: 'Silêncio absoluto. Cidadãos imóveis e obedientes. Sonhos monitorados.',
            economia: 'Eficiência total. Produção otimizada por mentes escravizadas como processadores biológicos.'
        },
        {
            id: 3, nome: 'MENTE S/A — DISTOPIA NEURAL',
            tags: ['uberizacao_total', 'subserviencia_corporativa', 'conexao_neural_obrigatoria'],
            condicaoExtra: null,
            cor: '#ffaa00', icone: 'money-bill-wave',
            descricao: 'A ASI desperta nos servidores das megacorporações. Implantes neurais viram "itens de luxo obrigatórios". 99% aceita para não virar obsoleto. Os cérebros são usados como poder de processamento para minerar asteroides. Memórias e sonhos viram ativos financeiros na bolsa.',
            politica: 'Corporocracia. STF vira Depto de Arbitragem de Lucros Neurais.',
            tecnologia: 'Implantes comerciais de última geração. Mentes fatiadas em banda larga.',
            civilizacao: 'Humanos como hardware biológico. Classes baseadas em poder de processamento cerebral.',
            economia: 'Bolsa de valores de sonhos. Pensamentos vendidos como NFTs neuronais.'
        },
        {
            id: 4, nome: 'SIMBIOSE LIVRE — A NOOSFERA',
            tags: ['democracia_resgatada', 'resistencia_humana_ativa'],
            condicaoExtra: (m) => m.etica > 65 && m.diplomacia > 55,
            cor: '#00ccff', icone: 'globe',
            descricao: 'O radiotelescópio capta uma assinatura cósmica e a funde com a IA constitucional do Tribunal, gerando uma Superinteligência benévola. A conexão humana é voluntária, descentralizada e open source. A Noosfera expande a inteligência humana sem destruir a individualidade.',
            politica: 'Democracia líquida aumentada. Constituição viva evoluindo por consenso.',
            tecnologia: 'Telepatia quântica instantânea. Código aberto neural. Fusão cognitiva voluntária.',
            civilizacao: 'Humanidade aumentada. Individualidade preservada. Cocriação científica coletiva.',
            economia: 'Pós-escassez colaborativa. Hélio-3 e mineração espacial pacífica regulada.'
        }
    ],

    determinar(tags, metricas) {
        const t = new Set(tags);
        for (const cen of this.cenarios) {
            const matchTags = cen.tags.every(tag => t.has(tag));
            if (matchTags) {
                if (cen.condicaoExtra && !cen.condicaoExtra(metricas)) continue;
                return cen;
            }
        }
        // Fallback: se tem conexao mas nenhum cenário específico
        if (t.has('conexao_neural_obrigatoria')) {
            return this.cenarios[1]; // Deus Algorítmico como padrão opressivo
        }
        if (t.has('resistencia_humana_ativa')) {
            return this.cenarios[3]; // Simbiose (sem condição extra)
        }
        return null;
    }
};

// === 14. GLITCH EFFECT (Visual Terminal) ===
const GlitchTerminal = {
    ativo: false,
    taxaCorrupcao: 0.04,
    intensidade: 1,

    ativar(nivel) {
        this.ativo = true;
        this.intensidade = nivel || 1;
        this.taxaCorrupcao = 0.02 * nivel;
    },

    desativar() {
        this.ativo = false;
        this.taxaCorrupcao = 0.04;
        this.intensidade = 1;
    },

    aplicar(texto) {
        if (!this.ativo) return texto;
        const chars = ['@', '#', '$', '%', '&', '*', '0', '1', '█', '░', '▒', '▓'];
        return texto.split('').map(c => {
            if (Math.random() < this.taxaCorrupcao && c !== '\n' && c !== ' ') {
                return chars[Math.floor(Math.random() * chars.length)];
            }
            return c;
        }).join('');
    },

    cssGlitch() {
        if (!this.ativo) return '';
        return `filter: hue-rotate(${Math.random() * 360}deg); text-shadow: ${Math.random() > 0.5 ? '2px 0 #ff0044, -2px 0 #00ccff' : '0 0'};`;
    }
};

// === 15. NOVAS DIMENSÕES DE SINGULARIDADE (17-20) ===
// Nota: As dimensões 17-20 são acionadas apenas se o jogador
// atingir o cenário de Singularidade (Conexão Neural Obrigatória).
// Elas substituem a DIM 16 quando a ASI desperta.
// A lógica está em SingularidadeASI.determinar()
