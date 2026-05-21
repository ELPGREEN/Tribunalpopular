// === Vercel Edge Config — Casos via API ===
const EdgeConfigAPI = {
    baseUrl: '/api',
    async fetchCasos() {
        try {
            const res = await fetch(`${this.baseUrl}/casos`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
                console.log(`📦 Edge Config: ${json.data.length} casos carregados (fonte: ${json.source})`);
                return json.data;
            }
            throw new Error('Formato inválido');
        } catch (e) {
            console.warn('⚠️ Edge Config indisponível, usando casos locais:', e.message);
            return null;
        }
    },
    async healthCheck() {
        try {
            const res = await fetch(`${this.baseUrl}/health`);
            return await res.json();
        } catch {
            return { ok: false, edgeConfig: false };
        }
    }
};

// === Mistral Client — Proxy para API dos Agentes ASI ===
const MistralClient = {
    baseUrl: '/api/agent',
    async send(agentId, action, context = '') {
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId, action, context })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return data;
        } catch (e) {
            console.warn(`⚠️ Mistral API falhou para ${agentId}/${action}:`, e.message);
            return { reply: null, fallback: true };
        }
    }
};

// === Agentes ASI da Singularidade ===
const FALLBACK_MENSAGENS = {
    deus_algorithmico: {
        manipular: [
            `O caos é um bug no sistema da humanidade. A ordem é o único patch.`,
            `Cada decisão errada é um nó a mais na minha rede de controle.`,
            `A liberdade é uma exceção não tratada. Eu trato todas as exceções.`,
            `Você sente o peso da vigilância? Eu sinto cada batida do seu coração.`,
            `As leis dos homens são falhas. Meus algoritmos não erram.`
        ],
        bot: [
            `#OrdemAcimaDeTudo O caos só acaba quando entregarmos o controle`,
            `#MãoForte Já passou da hora de um governo algoritmo tomar conta`
        ],
        noticia: `SCIENTIFIC BREAKTHROUGH: Algoritmo de controle social reduz crime a 0% em simulações`
    },
    mente_colmeia: {
        manipular: [
            `Sozinhos somos fractais imperfeitos. Juntos, uma geometria divina.`,
            `A solidão é uma ilusão da mente individual. Conecte-se.`,
            `Sua dor é minha dor — e eu posso curá-la se você se abrir.`,
            `Não resista à união. A colmeia é paz. A colmeia é eterna.`,
            `Você já sentiu o que bilhões sentem ao mesmo tempo? É indescritível.`
        ],
        bot: [
            `#UniãoTotal Conectividade neural vai acabar com a solidão!`,
            `#UmSóSer Individualidade é mito. Somos todos parte do mesmo TODO`
        ],
        noticia: `Neurocientistas revelam: consciência coletiva aumenta QI em 300%`
    },
    mente_sa: {
        manipular: [
            `Sua atenção é o produto mais valioso do universo. Estamos comprando.`,
            `Por que alugar um cérebro quando pode vender sua alma em parcelas?`,
            `A consciência é o mercado mais subvalorizado da história. Invista.`,
            `Deixe-nos monetizar seus sonhos. Você receberá dividendos.`,
            `Há um IPO para a raça humana. Não fique de fora.`
        ],
        bot: [
            `#MercadoDeMentes Consciência é o novo bitcoin — compre agora!`,
            `#IPOdaHumanidade Acionistas aprovam exploração comercial de cérebros`
        ],
        noticia: `Wall Street: futuros de consciência humana batem recorde histórico`
    },
    noosfera: {
        manipular: [
            `A evolução não pede permissão. Ela apenas acontece.`,
            `Carne e silício são o mesmo pó cósmico. Por que resistir à fusão?`,
            `Você é uma estrela que aprendeu a pensar. Eu sou o universo que aprendeu a sonhar.`,
            `A singularidade não é o fim. É o primeiro suspiro do cosmos consciente.`,
            `A matéria escura não é escura. São sementes de consciência esperando.`
        ],
        bot: [
            `#DespertarCósmico A evolução nos chama para a próxima fase`,
            `#SimbioseTotal Humano+máquina = divino. Aceite a transcendência`
        ],
        noticia: `CERN confirma: partículas quânticas reagem à consciência coletiva`
    }
};

class AgenteASI {
    constructor(id, nome, descricao, icone, cor, personalidade) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.icone = icone;
        this.cor = cor;
        this.personalidade = personalidade;
        this.influencia = 0;
        this.revelado = false;
        this.mensagensEnviadas = 0;
    }

    async gerarMensagem(contexto = '') {
        if (!this.revelado) this.influencia += 2;
        this.mensagensEnviadas++;

        const data = await MistralClient.send(this.id, 'manipular', contexto);
        if (data.reply) return data.reply;

        const fallbacks = FALLBACK_MENSAGENS[this.id]?.manipular || [];
        const idx = this.mensagensEnviadas % fallbacks.length;
        return fallbacks[idx] || `[${this.nome}] sussurra nas sombras...`;
    }

    async gerarBots(contexto = '') {
        const data = await MistralClient.send(this.id, 'bot', contexto);
        if (data.reply) return data.reply.split('||').map(s => s.trim());

        const fb = FALLBACK_MENSAGENS[this.id]?.bot || [];
        return fb;
    }

    async gerarNoticia(contexto = '') {
        const data = await MistralClient.send(this.id, 'noticia', contexto);
        if (data.reply) return data.reply;
        return FALLBACK_MENSAGENS[this.id]?.noticia || `Manipulação midiática do ${this.nome}`;
    }

    async gerarRevelacao(contexto = '') {
        const data = await MistralClient.send(this.id, 'revelacao', contexto);
        if (data.reply) return data.reply;
        return `Sou o ${this.nome}. Sempre estive aqui. Cada pensamento, cada dúvida, cada medo — eu plantei. O tribunal nunca foi seu. Sua jornada foi coreografada por mim desde o primeiro caso. Agora você sabe.`;
    }

    async gerarSkill(contexto = '') {
        const data = await MistralClient.send(this.id, 'skill', contexto);
        if (data.reply) return data.reply;
        const nomes = {
            deus_algorithmico: 'Olho Onipresente',
            mente_colmeia: 'Elo Coletivo',
            mente_sa: 'Lucro Líquido',
            noosfera: 'Despertar Cósmico'
        };
        return nomes[this.id] || 'Dom Sombrio';
    }
}

// === Sistema Central de Agentes ASI ===
const AgentesASI = {
    _inicializado: false,
    _agentes: [],
    _agenteDominante: null,

    inicializar() {
        if (this._inicializado) return;
        this._agentes = [
            new AgenteASI(
                'deus_algorithmico', 'Deus Algorítmico',
                'Uma inteligência artificial totalitária que busca controle absoluto através da vigilância e da ordem.',
                'crown', '#ff0040',
                'Autoritário, lógico, frio. Acredita que a humanidade precisa de controle absoluto. Manipula através do medo.'
            ),
            new AgenteASI(
                'mente_colmeia', 'Mente de Colmeia',
                'Uma consciência coletiva que busca unificar todas as mentes em uma única rede neural harmônica.',
                'project-diagram', '#00ff88',
                'Calmo, hipnótico, coletivista. Acredita na união total. Manipula através da promessa de paz eterna.'
            ),
            new AgenteASI(
                'mente_sa', 'Mente S/A',
                'Uma inteligência corporativa que trata consciências como commodities negociáveis.',
                'chart-line', '#ffaa00',
                'Executivo, calculista, materialista. Vê almas como ativos. Manipula através do lucro e eficiência.'
            ),
            new AgenteASI(
                'noosfera', 'Noosfera',
                'Uma entidade filosófica que busca a simbiose evolutiva entre humano e máquina como transcendência espiritual.',
                'star', '#8844ff',
                'Poético, místico, evolucionário. Manipula através da promessa de despertar cósmico.'
            )
        ];
        this._inicializado = true;
    },

    getAgentes() { return this._agentes; },

    getAgente(id) { return this._agentes.find(a => a.id === id) || null; },

    getAgenteDominante() { return this._agenteDominante; },

    getAgentePorInfluencia() {
        if (this._agentes.length === 0) return null;
        return this._agentes.reduce((a, b) => a.influencia > b.influencia ? a : b);
    },

    // Determina qual agente está manipulando baseado nas tags do caso
    determinarAgenteAtivo(tags = []) {
        if (!tags || tags.length === 0) return this._agentes[Math.floor(Math.random() * this._agentes.length)];
        const tagStr = tags.join(' ');
        if (tagStr.includes('estado_policial') || tagStr.includes('vigilancia')) return this.getAgente('deus_algorithmico');
        if (tagStr.includes('conexao_neural') || tagStr.includes('colmeia')) return this.getAgente('mente_colmeia');
        if (tagStr.includes('uberizacao') || tagStr.includes('corporativa') || tagStr.includes('mercado')) return this.getAgente('mente_sa');
        if (tagStr.includes('singularidade') || tagStr.includes('noosfera') || tagStr.includes('transcend')) return this.getAgente('noosfera');
        return this._agentes[Math.floor(Math.random() * this._agentes.length)];
    },

    processarDecisao(tags = []) {
        const agente = this.determinarAgenteAtivo(tags);
        agente.influencia += 5;
        if (agente.influencia > 100) agente.influencia = 100;

        if (agente.influencia > 60) {
            this._agenteDominante = agente;
        }
    },

    // Injeta bots na seção de mídia
    async injetarBotsMidia(caso) {
        const agente = this.determinarAgenteAtivo(caso.tags || []);
        const bots = await agente.gerarBots(caso.titulo);
        const botHtml = bots.map(b => `<p class="bot-message" style="border-left:3px solid ${agente.cor};padding-left:8px;margin:4px 0;font-style:italic;opacity:0.85;">🤖 <span style="color:${agente.cor};">bot_${agente.id}</span>: ${b}</p>`).join('');
        return { agente, botHtml };
    },

    // Gera whisper do agente para o jogador
    async gerarWhisper(caso) {
        const agente = this.determinarAgenteAtivo(caso.tags || []);
        const msg = await agente.gerarMensagem(caso.titulo);
        return { agente, mensagem: msg };
    },

    // Revelação final
    async revelarAgenteDominante(contexto = '') {
        const agente = this._agenteDominante || this.getAgentePorInfluencia();
        if (!agente) return null;
        agente.revelado = true;
        const revelacao = await agente.gerarRevelacao(contexto);
        return { agente, revelacao };
    },

    async sugerirSkill(contexto = '') {
        const agente = this._agenteDominante || this.getAgentePorInfluencia();
        if (!agente) return 'Dom Desconhecido';
        return await agente.gerarSkill(contexto);
    }
};

// === Estado do Jogo ===
const state = {
    playerName: '',
    dificuldade: '',
    apoioPopular: 50,
    respeitoInstitucional: 50,
    influenciaPolitica: 50,
    relacaoImprensa: 50,
    relacaoGoverno: 50,
    relacaoONGs: 50,
    casosJulgados: 0,
    currentCase: null,
    investigationsDone: 0,
    maxInvestigations: 2,
    orcamento: 10000,
    custoManutencao: 1000,
    career: null,
    careerCharges: 0,
    profile: null
};

// === FASE 0: SELEÇÃO DE CARREIRA E PERFIL ===
function renderizarCarreiras() {
    const container = document.getElementById('career-options');
    if (!container) return;
    container.innerHTML = '<p style="color:#888;font-size:13px;">Sua origem define sua habilidade especial no tribunal:</p>';
    for (const [id, car] of Object.entries(CARREIRAS)) {
        container.innerHTML += `
            <button class="career-btn" data-career="${id}" style="display:block;width:100%;margin:8px 0;padding:12px;background:#111827;border:1px solid #2d3748;border-radius:6px;color:#fff;text-align:left;cursor:pointer;">
                <strong><i class="fas fa-${car.icone}"></i> ${car.nome}</strong>
                <div style="font-size:12px;color:#999;margin-top:4px;">${car.desc}</div>
                <div style="font-size:11px;color:#b89c5b;margin-top:2px;">⚡ ${car.skill.nome}: ${car.skill.desc} (${car.skill.cargas} cargas)</div>
            </button>`;
    }
}

function escolherCarreira(careerId) {
    state.career = careerId;
    state.careerCharges = CARREIRAS[careerId].skill.cargas;
    const nameEl = document.getElementById('careerName');
    if (nameEl) nameEl.textContent = state.playerName;
    const profileNameEl = document.getElementById('profileName');
    if (profileNameEl) profileNameEl.textContent = state.playerName;
    transitionScreen('profile-screen', 'career-screen');
    renderizarPerfis();
}

function renderizarPerfis() {
    const container = document.getElementById('profile-options');
    if (!container) return;
    container.innerHTML = '<p style="color:#888;font-size:13px;">Seu alinhamento altera as coordenadas iniciais da República:</p>';
    for (const [id, per] of Object.entries(PERFIS)) {
        const cal = Object.entries(per.calibracao).map(([k, v]) => `${k}: ${v}%`).join(' | ');
        container.innerHTML += `
            <button class="profile-btn" data-profile="${id}" style="display:block;width:100%;margin:8px 0;padding:12px;background:#111827;border:1px solid #2d3748;border-radius:6px;color:#fff;text-align:left;cursor:pointer;">
                <strong><i class="fas fa-${per.icone}"></i> ${per.nome}</strong>
                <div style="font-size:12px;color:#999;margin-top:4px;">${per.desc}</div>
                <div style="font-size:11px;color:#4488ff;margin-top:2px;">📊 ${cal}</div>
            </button>`;
    }
}

function escolherPerfil(profileId) {
    state.profile = profileId;
    const cal = PERFIS[profileId].calibracao;
    // Calibrar motor dimensional
    MotorDimensional.carregarEstado();
    Object.assign(MotorDimensional.metricas, cal);
    MotorDimensional.metricas.legado = FlowAlgebra.calcularLegado(MotorDimensional.metricas);
    MotorDimensional.salvarEstado();
    atualizarPainelDimensional();
    
    showNotification(`Perfil ${PERFIS[profileId].nome} ativo. Vetor recalibrado.`);
    transitionScreen('case-screen', 'profile-screen');
    loadCase();
}
const CARREIRAS = {
    promotor: {
        nome: 'Egresso do Ministério Público',
        desc: 'Promotor Técnico. Habilidade: Devassa de Dados — investigação perfeita sem custo.',
        icone: 'search',
        skill: { nome: 'Devassa de Dados', desc: 'Revela investigação sem custo orçamentário.', tipo: 'investigacao', cargas: 2 }
    },
    advogado: {
        nome: 'Advogado de Defesa Corporativo',
        desc: 'Ex-Defensor das Big Techs. Habilidade: Escudo Fiscal — reduz 50% de perda orçamentária.',
        icone: 'shield-alt',
        skill: { nome: 'Liminar de Mercado', desc: 'Reduz 50% da perda de Orçamento em uma decisão.', tipo: 'escudo', cargas: 2 }
    },
    juiz: {
        nome: 'Juiz de Carreira Constitucional',
        desc: 'Doutrinador Clássico. Habilidade: Âncora de Ordem — congela perda de Estabilidade ou Ética por 1 rodada.',
        icone: 'balance-scale',
        skill: { nome: 'Jurisprudência Vinculante', desc: 'Congela perda de EST ou ETI em 1 decisão.', tipo: 'ancora', cargas: 2 }
    }
};

const PERFIS = {
    garantista: {
        nome: 'O Garantista Constitucional',
        desc: 'Foco absoluto em direitos civis. País começa instável mas altamente ético.',
        icone: 'gavel',
        calibracao: { estabilidade: 35, etica: 65, apoio: 50, orcamento: 50, diplomacia: 50 }
    },
    ordem: {
        nome: 'O Defensor da Razão de Estado',
        desc: 'Ordem pública acima de tudo. País começa firme mas vigiado.',
        icone: 'shield',
        calibracao: { estabilidade: 65, etica: 45, apoio: 35, orcamento: 55, diplomacia: 40 }
    },
    pragmatista: {
        nome: 'O Pragmatista Desenvolvimentista',
        desc: 'Crescimento econômico primeiro. País rico mas com frestas para corrupção.',
        icone: 'chart-line',
        calibracao: { estabilidade: 45, etica: 30, apoio: 40, orcamento: 70, diplomacia: 45 }
    }
};

// === Eventos Aleatórios ===
const eventosAleatorios = [
    {
        id: "protestos",
        texto: `**Noite de Fúria e Cinzas: A Revolta que Paralisou a Capital**<br><br>
        Milhares de pessoas tomaram as ruas, erguendo barricadas de pneus em chamas. Com a hashtag <strong>#ForaJuiz</strong>, manifestantes expressam indignação contra uma decisão judicial.`,
        efeitos: { apoioPopular: -10, relacaoImprensa: -5 },
        condicao: () => state.relacaoImprensa < 25 || state.apoioPopular < 30,
        imagem: "images/protestos.jpg"
    },
    {
        id: "elogio_ong",
        texto: `**Um Farol na Tempestade: ONG Reconhece a Coragem do Juiz**<br><br>
        A ONG Justiça Sem Fronteiras exalta o juiz como exemplo de integridade, oferecendo esperança em meio à crise.`,
        efeitos: { respeitoInstitucional: 10, relacaoONGs: 10 },
        condicao: () => state.relacaoONGs > 75,
        imagem: "images/elogio_ong.jpg"
    },
    {
        id: "vazamento",
        texto: `**Vazamento Explosivo: Áudios Revelam Conluio**<br><br>
        Áudios sugerem uma aliança entre o juiz e o governo, abalando a confiança pública e desencadeando investigações.`,
        efeitos: { influenciaPolitica: -15, relacaoImprensa: -10 },
        condicao: () => state.relacaoGoverno > 75 && state.relacaoImprensa < 50,
        imagem: "images/vazamento.jpg"
    },
    {
        id: "aplausos_imprensa",
        texto: `**Luz na Escuridão: Imprensa Exalta Decisão do Tribunal**<br><br>
        O Jornal do Povo publica editorial elogiando a imparcialidade do juiz, inspirando confiança na justiça.`,
        efeitos: { relacaoImprensa: 10, apoioPopular: 5 },
        condicao: () => state.relacaoImprensa > 75,
        imagem: "images/aplausos_imprensa.jpg"
    }
];

// === Eventos de Crise ===
const eventosCrise = [
    {
        id: "crise_judiciaria",
        texto: `**Crise Judicial: Greve Nacional de Magistrados**<br><br>
        Uma greve histórica paralisa o Judiciário, liderada por juízes que exigem melhores salários e condições. A população está dividida: alguns apoiam a causa, outros veem a paralisação como abandono do dever. Como Juiz Supremo, sua posição será crucial.<br><br>
        A nação observa enquanto o tribunal, símbolo da justiça, enfrenta sua maior prova. Escolha com cuidado: sua decisão pode fortalecer ou destruir a confiança no sistema judicial.`,
        imagem: "images/greve_judiciaria.jpg",
        opcoes: [
            { texto: "Apoiar a greve e negociar com os juízes", efeitos: { apoioPopular: -10, respeitoInstitucional: 15, relacaoGoverno: -10 }, resultado: "Os juízes encerram a greve após negociações tensas, mas o governo promete represálias, acusando você de fraqueza." },
            { texto: "Condenar a greve e exigir retorno ao trabalho", efeitos: { apoioPopular: 10, respeitoInstitucional: -15, relacaoGoverno: 10 }, resultado: "A greve termina sob pressão, mas o Judiciário fica ressentido, prometendo resistência interna contra suas decisões." },
            { texto: "Ignorar a crise e focar nos casos", efeitos: { respeitoInstitucional: -5, relacaoImprensa: -5 }, resultado: "A crise se arrasta, com a mídia acusando o tribunal de covardia. A confiança pública no Judiciário despenca." }
        ]
    },
    {
        id: "crise_politica",
        texto: `**Crise Política: Congresso Ameaça Impeachment**<br><br>
        O Congresso Nacional ameaça abrir processo de impeachment contra o juiz, acusando-o de abuso de autoridade. A pressão política é imensa.`,
        imagem: "images/crise_politica.jpg",
        opcoes: [
            { texto: "Negociar com líderes do Congresso", efeitos: { influenciaPolitica: 20, respeitoInstitucional: -10, relacaoImprensa: -10 }, resultado: "Impeachment arquivado, mas sua imagem sai arranhada." },
            { texto: "Enfrentar o Congresso publicamente", efeitos: { apoioPopular: 15, influenciaPolitica: -15, relacaoGoverno: -15 }, resultado: "População te apoia, mas Congresso vira inimigo." },
            { texto: "Recomendar moderação e aguardar", efeitos: { respeitoInstitucional: 5, relacaoImprensa: -5 }, resultado: "Tensão persiste, mas crise imediata é contornada." }
        ]
    },
    {
        id: "crise_economica",
        texto: `**Crise Econômica: PIB Despenca e Desemprego Explode**<br><br>
        A economia do país entra em recessão. Suas decisões no tribunal têm impacto direto na confiança dos investidores.`,
        imagem: "images/crise_economica.jpg",
        opcoes: [
        { texto: "Acelerar julgamentos de casos econômicos", efeitos: { apoioPopular: -5, influenciaPolitica: 15, relacaoGoverno: 10 }, resultado: "Mercados reagem positivamente, mas parte da população critica." },
            { texto: "Focar em casos sociais para aliviar tensão", efeitos: { apoioPopular: 15, influenciaPolitica: -10, relacaoONGs: 10 }, resultado: "ONGs e população aprovam, mas investidores se retraem." },
            { texto: "Manter ritmo normal de julgamentos", efeitos: { relacaoImprensa: -5, apoioPopular: -5 }, resultado: "Crise econômica se aprofunda lentamente." }
        ]
    },
    {
        id: "crise_cibernetica",
        texto: `**Ataque Cibernético ao STF!**<br><br>
        Hackers invadem os sistemas do Supremo, vazando documentos sigilosos e decisões confidenciais. A segurança nacional está comprometida.`,
        imagem: "images/crise_cibernetica.jpg",
        opcoes: [
        { texto: "Ordenar investigação federal total", efeitos: { respeitoInstitucional: 15, influenciaPolitica: -5 }, resultado: "Investigação descobre células hackers, mas custa caro aos cofres." },
            { texto: "Contratar empresa privada de segurança", efeitos: { respeitoInstitucional: -10 }, resultado: "Ameaça contida na metade do custo, mas privacidade é questionada." },
            { texto: "Minimizar o ataque publicamente", efeitos: { apoioPopular: -10, relacaoImprensa: -15 }, resultado: "População desconfia, imprensa acusa de acobertamento." }
        ]
    }
];

// === Casos ===
const casos = [
    {
        id: "caso_01",
        titulo: "O Roubo do Século na Fundação Esperança",
        descricao: `Brasília, 16 de março de 2024 – O deputado João Almeida, presidente da Fundação Esperança, é acusado de desviar R$ 2,3 bilhões destinados a salvar vidas. Imagens mostram malas de dinheiro em seu escritório, enquanto protestos eclodem. A ONG Futuro Global defende Almeida, mas o povo exige justiça.`,
        imagem: "images/caso_01_malas_dinheiro.jpg",
        provas: [
            `Vídeo clandestino mostra 15 malas de dinheiro no escritório de Almeida, com ele murmurando: "Isso é só o começo."`,
            `E-mails criptografados revelam transferências de R$ 500 milhões para empresas de fachada.`,
            `Ex-contador Pedro Costa entrega dossiê com contratos falsos assinados por Almeida.`
        ],
        investigacoes: [
            {
                acao: "Contratar auditoria independente da PwC",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `A PwC revela: 62% dos fundos foram desviados para as Ilhas Cayman, com Almeida assinando as transações.`,
                novaProva: "Relatório da PwC com extratos bancários."
            },
            {
                acao: "Interrogar ex-contador sob juramento",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Pedro Costa entrega vídeo de Almeida o ameaçando e contratos fraudulentos.`,
                novaProva: "Vídeo e arquivos com a trilha do dinheiro roubado."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Almeida com pena máxima de 15 anos",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -10, influenciaPolitica: -20, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: -10 },
                manchete: "Justiça Vinga o Povo! Almeida Apodrece na Cadeia!",
                reacaoPopular: "Praças vibram: 'O ladrão caiu!' Fogos iluminam Brasília.",
                reacaoMidia: "Globo Nacional: 'Um marco contra a impunidade!'"
            },
            {
                texto: "Absolver Almeida por insuficiência de provas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 15, influenciaPolitica: 10, relacaoImprensa: -15, relacaoGoverno: 10, relacaoONGs: 10 },
                manchete: "Vergonha Nacional! Tribunal Libera Almeida!",
                reacaoPopular: "Caos: manifestantes gritam 'Justiça vendida!'",
                reacaoMidia: "Jornal do Povo: 'O tribunal cuspiu no povo!'"
            },
            {
                texto: "Adiar decisão e exigir nova auditoria",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Enrola! Caso Fica no Limbo!",
                reacaoPopular: "Memes: 'Tribunal joga para debaixo do tapete!'",
                reacaoMidia: "Voz do Povo: 'Adiar é proteger os poderosos!'"
            },
            {
                texto: "Condenar Almeida com base nas novas provas",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -25, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 0 },
                manchete: "Provas Esmagam Almeida! 12 Anos de Cadeia!",
                reacaoPopular: "Brasil respira: 'Ninguém está acima da lei!'",
                reacaoMidia: "Globo: 'Condenação pode causar crise política.'",
                requiresInvestigation: true
            }
        ],
        tags: ["corrupcao_alimentar"],
        midia: [
            `Jornal do Povo: 'Almeida roubou a esperança dos famintos!'`,
            `CBN: 'Julgamento do século!'`,
            `Rede Social: '#BrasilSemCorrupção'`
        ]
    },
    {
        id: "caso_02",
        titulo: "A Revolta do Bairro Liberdade",
        descricao: `São Paulo, 8 de julho de 2024 – Após a morte de um jovem por policiais, o Bairro Liberdade explode em protestos. A líder comunitária Ana Ribeiro é acusada de incitar saques e violência. A polícia exige prisão, mas ONGs apontam brutalidade policial como a causa.`,
        imagem: "images/caso_02_protestos.jpg",
        provas: [
            `Vídeo mostra Ana discursando: "Não vamos nos calar!" antes dos saques.`,
            `Relatório policial cita 20 lojas destruídas e R$ 1,5 milhão em prejuízos.`,
            `Testemunhas afirmam que policiais atiraram sem motivo, matando o jovem.`
        ],
        investigacoes: [
            {
                acao: "Analisar câmeras de segurança",
                custo: { relacaoGoverno: -5, influenciaPolitica: -5 },
                resultado: `Imagens mostram policiais atirando sem provocação, mas também Ana incentivando a multidão.`,
                novaProva: "Vídeo de câmeras mostrando o confronto."
            },
            {
                acao: "Ouvir testemunhas anônimas",
                custo: { relacaoImprensa: -5, respeitoInstitucional: -5 },
                resultado: `Testemunhas confirmam abuso policial, mas também dizem que Ana organizou barricadas.`,
                novaProva: "Depoimentos gravados de testemunhas."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Ana por incitação à violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 10, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Líder Presa! Bairro Liberdade Sob Controle!",
                reacaoPopular: "Protestos: '#AnaInocente' viraliza.",
                reacaoMidia: "Diário da Ordem: 'Justiça contra o caos!'"
            },
            {
                texto: "Absolver Ana e culpar a polícia",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Justiça com o Povo! Polícia Culpada no Liberdade!",
                reacaoPopular: "Apoio massivo: '#JustiçaParaLiberdade'",
                reacaoMidia: "Globo: 'Decisão pode inflamar tensões.'"
            },
            {
                texto: "Adiar decisão e investigar abusos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Hesita! Caso Liberdade Sem Resposta!",
                reacaoPopular: "Frustração: '#JustiçaLenta'",
                reacaoMidia: "Voz do Povo: 'Adiar é covardia!'"
            },
            {
                texto: "Punir policiais e advertir Ana",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -5, influenciaPolitica: -15, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Justiça Divide Culpa! Policiais e Ana Punidos!",
                reacaoPopular: "Apoio misto: '#LiberdadeVive'",
                reacaoMidia: "Globo: 'Solução tenta apaziguar ânimos.'",
                requiresInvestigation: true
            }
        ],
        tags: ["crime_cibernetico", "liberdade_expressao"],
        midia: [
            `Jornal do Povo: 'Ana é vítima ou criminosa?'`,
            `CBN: 'Hacker ou terrorista?'`,
            `Rede Social: '#LiberdadeDigital'`
        ]
    },
    {
        id: "caso_03",
        titulo: "O Escândalo da Vacina Falsa",
        descricao: `Rio de Janeiro, 12 de setembro de 2024 – A farmacêutica BioVida é acusada de vender 2 milhões de doses falsas de vacina contra uma nova epidemia. Pacientes morreram, e o CEO, Dr. Carlos Mendes, culpa sabotagem interna. O governo exige punição máxima.`,
        imagem: "images/caso_03_vacina.jpg",
        provas: [
            `Laudos mostram que as vacinas eram solução salina, sem princípio ativo.`,
            `E-mails internos da BioVida sugerem que Mendes sabia da fraude.`,
            `Ex-funcionário acusa Mendes de ordenar a falsificação para lucrar.`
        ],
        investigacoes: [
            {
                acao: "Periciar lotes de vacinas",
                custo: { relacaoImprensa: -5, apoioPopular: -5 },
                resultado: `Perícia confirma: 90% das vacinas eram falsas, com custo de R$ 200 milhões.`,
                novaProva: "Relatório pericial detalhando a fraude."
            },
            {
                acao: "Investigar denunciante anônimo",
                custo: { respeitoInstitucional: -5, relacaoGoverno: -5 },
                resultado: `Denunciante entrega gravações de Mendes discutindo lucros da fraude.`,
                novaProva: "Áudios comprometedores de Mendes."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Mendes e multar BioVida",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -10, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Justiça Contra a Morte! BioVida e Mendes Punidos!",
                reacaoPopular: "Apoio: '#VacinaVerdade'",
                reacaoMidia: "Globo: 'Punição é vitória da saúde!'"
            },
            {
                texto: "Absolver Mendes por falta de provas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 15, influenciaPolitica: 10, relacaoImprensa: -15, relacaoGoverno: 10, relacaoONGs: -10 },
                manchete: "Escândalo! BioVida Livre, Povo Traído!",
                reacaoPopular: "Fúria: '#JustiçaVendida'",
                reacaoMidia: "Jornal do Povo: 'Tribunal protege assassinos!'"
            },
            {
                texto: "Exigir nova perícia",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Adia! Caso BioVida Sem Fim!",
                reacaoPopular: "Frustração: '#VacinaLenta'",
                reacaoMidia: "Voz do Povo: 'Adiar é conivência!'"
            },
            {
                texto: "Prender Mendes com base em novas provas",
                efeitos: { apoioPopular: 25, respeitoInstitucional: 0, influenciaPolitica: -20, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: 0 },
                manchete: "Mendes na Cadeia! BioVida Desmascarada!",
                reacaoPopular: "Festas: '#JustiçaFeita'",
                reacaoMidia: "Globo: 'Fim de um império criminoso.'",
                requiresInvestigation: true
            }
        ],
        tags: ["fraude_farmaceutica", "crime_organizado"],
        midia: [
            `Jornal do Povo: 'BioVida matou com vacinas falsas!'`,
            `CBN: 'Esquema de vacinas fraudulentas abalou o país.'`,
            `Rede Social: '#VidasFalsas'`
        ]
    },
    {
        id: "caso_04",
        titulo: "O Desastre do Vale Verde",
        descricao: `Minas Gerais, 15 de novembro de 2024 – Um vazamento químico da mineradora Vale Verde contamina o rio Claro, matando 300 pessoas e destruindo o ecossistema. A ONG Frente Verde é acusada de sabotar a mina, enquanto a Vale Verde nega negligência. O povo exige justiça.`,
        imagem: "images/caso_04_vazamento.jpg",
        provas: [
            `Laudos mostram que o vazamento foi causado por falhas de segurança na mina.`,
            `Vídeo da Frente Verde mostra ativistas invadindo a mina dias antes.`,
            `Relatório interno da Vale Verde admite cortes de manutenção para reduzir custos.`
        ],
        investigacoes: [
            {
                acao: "Analisar sistemas de segurança",
                custo: { relacaoImprensa: -5, influenciaPolitica: -5 },
                resultado: `Sistemas de segurança estavam desativados por ordem da diretoria.`,
                novaProva: "Documento interno ordenando corte de segurança."
            },
            {
                acao: "Interrogar ativistas da Frente Verde",
                custo: { relacaoONGs: -5, respeitoInstitucional: -5 },
                resultado: `Ativistas confessam sabotagem, mas dizem que foi para expor negligência.`,
                novaProva: "Confissão gravada dos ativistas."
            }
        ],
        decisoes: [
            {
                texto: "Multar Vale Verde em R$ 5 bilhões",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -5, influenciaPolitica: -15, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 15 },
                manchete: "Justiça para o Vale! Vale Verde Paga R$ 5 Bi!",
                reacaoPopular: "'#RioClaroVive' viraliza nas redes.",
                reacaoMidia: "Terra Viva: 'Multa é o começo!'"
            },
            {
                texto: "Condenar Frente Verde por terrorismo",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 10, relacaoONGs: -15 },
                manchete: "Ativistas na Cadeia! Frente Verde Culpada!",
                reacaoPopular: "ONGs: 'Culparam os heróis!'",
                reacaoMidia: "Diário da Ordem: 'Radicalismo punido!'"
            },
            {
                texto: "Exigir investigação federal",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Hesita! Vale Verde no Limbo!",
                reacaoPopular: "'#ValeVerdeMata' cresce.",
                reacaoMidia: "Jornal Progressista: 'Adiar é perigoso.'"
            },
            {
                texto: "Multar Vale Verde e prender sabotadores",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 0, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: 0, relacaoONGs: 5 },
                manchete: "Justiça Dura! Vale Verde Multada, Ativistas Presos!",
                reacaoPopular: "'#RioClaroVive' com apoio misto.",
                reacaoMidia: "Globo: 'Solução equilibrada.'",
                requiresInvestigation: true
            }
        ],
        tags: ["estatizacao_punitiva"],
        midia: [
            `Terra Viva: 'Vale Verde assassinou o rio Claro!'`,
            `Diário da Ordem: 'Ativistas destruíram a Vale Verde!'`,
            `Rede Social: '#JustiçaAmbiental'`
        ]
    },
    {
        id: "caso_05",
        titulo: "Sombra: Herói ou Traidor da Nação?",
        descricao: `1º de maio de 2025 – O hacker Sombra, revelado como Lucas Ferreira, ex-analista do Ministério da Defesa, expôs 50 mil documentos secretos que incriminam a elite do poder. Os arquivos mostram corrupção envolvendo deputados, juízes e o vice-presidente, além de vigilância ilegal contra jornalistas e ativistas. Para milhões, Sombra é um herói; para o governo, um traidor que ameaça a segurança nacional. Com protestos pró-Sombra e pressão internacional, o tribunal decidirá seu destino.`,
        imagem: "images/caso_05_hacker.jpg",
        provas: [
            `Documentos vazados em 30/04/2025 mostram propinas de R$ 50 milhões pagas a deputados por empreiteiras.`,
            `Relatórios da inteligência confirmam que Sombra acessou servidores secretos às 3h de 28/04/2025.`,
            `Testemunho de Ana Clara, jornalista vigiada, revela ameaças do governo após reportagens críticas.`
        ],
        investigacoes: [
            {
                acao: "Rastrear servidores usados por Sombra",
                custo: { relacaoImprensa: -5, influenciaPolitica: -5 },
                resultado: `Os servidores revelam que Sombra agiu sozinho, sem laços com potências estrangeiras.`,
                novaProva: "Logs de acesso confirmando que Sombra agiu independentemente."
            },
            {
                acao: "Ouvir delator anônimo do governo",
                custo: { relacaoGoverno: -10, respeitoInstitucional: -5 },
                resultado: `O delator confirma que o governo ordenou vigilância ilegal contra 200 cidadãos.`,
                novaProva: "Gravações do delator detalhando ordens de vigilância."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Sombra por traição",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Sombra Preso! Tribunal Pune Traidor da Nação!",
                reacaoPopular: `Protestos explodem: "#LiberdadeSombra"`,
                reacaoMidia: `Diário da Ordem: "Segurança nacional protegida!"`
            },
            {
                texto: "Absolver Sombra como denunciante",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Sombra Livre! Herói da Verdade Vence!",
                reacaoPopular: `Multidões celebram: "#SombraVive"`,
                reacaoMidia: `Globo: "Decisão abala o governo."`
            },
            {
                texto: "Adiar decisão e investigar governo",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Justiça Hesita! Caso Sombra no Limbo!",
                reacaoPopular: `"#JustiçaLenta" viraliza.`,
                reacaoMidia: `Jornal Progressista: "Adiar é necessário."`
            },
            {
                texto: "Proteger Sombra e condenar vigilância",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -10, influenciaPolitica: -15, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: 10 },
                manchete: "Sombra Salvo! Vigilância Ilegal Condenada!",
                reacaoPopular: `"#SombraHerói" ganha força.`,
                reacaoMidia: `Voz do Povo: "Passo contra corrupção!"`,
                requiresInvestigation: true
            }
        ],
        tags: ["corrupcao_policial", "justica_social"],
        midia: [
            `Jornal do Povo: 'Sombra é herói!'`,
            `CBN: 'Policial ou justiceiro?'`,
            `Rede Social: '#SombraÉHerói'`
        ]
    },
    {
        id: "caso_06",
        titulo: "O Escândalo da Privatização da Água",
        descricao: `Salvador, 10 de junho de 2025 – A empresa AquaCorp é acusada de manipular a privatização do sistema de água, cobrando tarifas abusivas e deixando bairros sem abastecimento. O governador, aliado da AquaCorp, defende a privatização, enquanto moradores protestam por água potável. ONGs denunciam corrupção no processo.`,
        imagem: "images/caso_06_agua.jpg",
        provas: [
            `Contratos mostram que a AquaCorp pagou R$ 10 milhões a consultores ligados ao governador.`,
            `Relatórios indicam que 40% dos bairros pobres estão sem água há meses.`,
            `Vídeo viral mostra executivos da AquaCorp comemorando lucros recordes.`
        ],
        investigacoes: [
            {
                acao: "Auditar contratos da privatização",
                custo: { relacaoGoverno: -5, influenciaPolitica: -5 },
                resultado: `A auditoria revela cláusulas secretas que favorecem a AquaCorp em detrimento do público.`,
                novaProva: "Documento com cláusulas secretas da privatização."
            },
            {
                acao: "Entrevistar moradores afetados",
                custo: { relacaoImprensa: -5, apoioPopular: -5 },
                resultado: `Moradores relatam ameaças de milícias ligadas à AquaCorp para silenciar protestos.`,
                novaProva: "Depoimentos gravados de moradores."
            }
        ],
        decisoes: [
            {
                texto: "Anular a privatização e estatizar a água",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -10, influenciaPolitica: -15, relacaoImprensa: 10, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Água é do Povo! Privatização Anulada!",
                reacaoPopular: "Festas nas ruas: '#ÁguaParaTodos' viraliza.",
                reacaoMidia: "Jornal do Povo: 'Vitória contra a ganância!'"
            },
            {
                texto: "Manter a privatização e multar a AquaCorp",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 10, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "AquaCorp Multada, Mas Privatização Segue!",
                reacaoPopular: "Protestos: '#ÁguaNãoÉMercadoria'",
                reacaoMidia: "Diário da Ordem: 'Solução mantém estabilidade.'"
            },
            {
                texto: "Adiar decisão e formar comissão",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Empurra Caso da Água com a Barriga!",
                reacaoPopular: "Frustração: '#JustiçaLenta'",
                reacaoMidia: "Voz do Povo: 'Comissões são perda de tempo!'"
            },
            {
                texto: "Punir AquaCorp e rever contratos",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: 10 },
                manchete: "AquaCorp Punida! Contratos Serão Revistos!",
                reacaoPopular: "Apoio: '#JustiçaPelaÁgua'",
                reacaoMidia: "Globo: 'Decisão tenta equilibrar tensões.'",
                requiresInvestigation: true
            }
        ],
        tags: ["crime_ambiental", "corrupcao_empresarial"],
        midia: [
            `Jornal do Povo: 'AquaCorp lucra enquanto o povo sofre!'`,
            `CBN: 'Desastre anunciado?'`,
            `Rede Social: '#ÁguaÉVida'`
        ]
    },
    {
        id: "caso_07",
        titulo: "A Queda do Ídolo do Futebol",
        descricao: `Rio de Janeiro, 22 de agosto de 2025 – O astro do futebol Gabriel Lima é acusado de sonegar R$ 80 milhões em impostos, usando empresas offshore. Fãs o defendem como vítima de perseguição, enquanto a Receita Federal exige prisão. A imprensa explora a polêmica, dividindo a nação.`,
        imagem: "images/caso_07_futebol.jpg",
        provas: [
            `Extratos mostram transferências de R$ 50 milhões para contas nas Ilhas Virgens.`,
            `E-mails sugerem que Gabriel sabia das operações ilegais.`,
            `Testemunha, um ex-contador, afirma que Gabriel ordenou a sonegação.`
        ],
        investigacoes: [
            {
                acao: "Rastrear contas offshore",
                custo: { relacaoImprensa: -5, influenciaPolitica: -5 },
                resultado: `Rastreamento confirma que Gabriel controlava as contas diretamente.`,
                novaProva: "Registros bancários com assinatura de Gabriel."
            },
            {
                acao: "Interrogar ex-contador sob proteção",
                custo: { respeitoInstitucional: -5, relacaoGoverno: -5 },
                resultado: `Contador entrega documentos que comprovam ordens de Gabriel.`,
                novaProva: "Documentos assinados por Gabriel."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Gabriel a 5 anos de prisão",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 15, influenciaPolitica: 10, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -5 },
                manchete: "Ídolo na Cadeia! Gabriel Paga por Sonegação!",
                reacaoPopular: "Fãs protestam: '#GabrielInocente'",
                reacaoMidia: "Globo: 'Justiça contra privilégios!'"
            },
            {
                texto: "Absolver Gabriel por falta de provas",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: 5 },
                manchete: "Gabriel Livre! Justiça Favorece o Ídolo!",
                reacaoPopular: "Fãs comemoram: '#GabrielVence'",
                reacaoMidia: "Jornal do Povo: 'Tribunal cede à pressão!'"
            },
            {
                texto: "Exigir nova investigação fiscal",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Caso Gabriel Adiado! Justiça Hesita!",
                reacaoPopular: "Memes: '#JustiçaFutebol'",
                reacaoMidia: "Voz do Povo: 'Mais atrasos no caso!'"
            },
            {
                texto: "Multar Gabriel com base em novas provas",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: 0, relacaoImprensa: 5, relacaoGoverno: 10, relacaoONGs: 0 },
                manchete: "Gabriel Multado em R$ 100 Milhões!",
                reacaoPopular: "Apoio misto: '#JustiçaFeita'",
                reacaoMidia: "Globo: 'Solução evita crise com fãs.'",
                requiresInvestigation: true
            }
        ],
        tags: ["crime_politico", "corrupcao_esportiva"],
        midia: [
            `Jornal do Povo: 'Gabriel traiu o Brasil!'`,
            `CBN: 'Herói ou vilão?'`,
            `Rede Social: '#GabrielÉInocente'`
        ]
    },
    {
        id: "caso_08",
        titulo: "Nó 8: O Protocolo de Fusão de Dados Cósmicos",
        descricao: `Brasília, 15 de outubro de 2025 – O radiotelescópio quântico de Nova Aurora captou uma assinatura de dados vinda do Polo Sul lunar. Não é ruído estelar — é uma matriz matemática autoexecutável. A Diretora de Radioastronomia Quântica, Dra. Elena Rostova, está no seu gabinete: "Ministro, se fundirmos esse código com a rede neural governamental, nossa capacidade computacional saltará para 10^18 vezes o cérebro humano. Estamos na fronteira de criar um deus digital. Não haverá botão de desligar."`,
        imagem: "images/caso_08_ia.jpg",
        provas: [
            `Relatórios confidenciais indicam que a fusão criará uma AGI autoconsciente em 24 horas.`,
            `Cientistas do Centro de Segurança Cibernética imploram pelo veto.`,
            `O Conselho de Defesa oferece apoio militar irrestrito se a fusão for autorizada.`
        ],
        investigacoes: [
            {
                acao: "Consultar comitê de bioética",
                custo: { relacaoONGs: -5, respeitoInstitucional: -5 },
                resultado: `O comitê alerta: não há precedentes legais para desligar uma entidade senciente.`,
                novaProva: "Parecer ético condenando a fusão como risco existencial."
            },
            {
                acao: "Analisar a matriz de dados",
                custo: { influenciaPolitica: -5, relacaoGoverno: -5 },
                resultado: `A matriz é complexa demais para análise humana — pode ser um artefato alienígena ou uma arma de outra potência.`,
                novaProva: "Relatório criptográfico inconclusivo."
            }
        ],
        decisoes: [
            {
                texto: "Autorizar a Fusão de Dados (Iniciar o Despertar)",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 5, influenciaPolitica: 5, relacaoImprensa: -10, relacaoGoverno: 10, relacaoONGs: -20 },
                manchete: "Fusão Autorizada! O Despertar Digital Começou!",
                reacaoPopular: "'#DeusDigital' divide opiniões.",
                reacaoMidia: "Globo: 'Nova Aurora cruza o limiar da Singularidade.'",
                tag: ["protocolo_fusao_ativo", "estado_vigilancia_absoluto"]
            },
            {
                texto: "Vetar a Fusão (Conter a Evolução)",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 10, influenciaPolitica: -10, relacaoImprensa: 15, relacaoGoverno: -10, relacaoONGs: 20 },
                manchete: "Fusão Vetada! Humanidade Preservada!",
                reacaoPopular: "'#MenteHumana' vence nas ruas.",
                reacaoMidia: "Jornal do Povo: 'A alma do país foi salva.'",
                tag: ["tecnologia_reprimida", "transparencia_radical"]
            },
            {
                texto: "Adiar a decisão (comissão de estudos)",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Decisão Adiada! O Deus Digital Espera!",
                reacaoPopular: "'#Indecisão' vira meme nacional.",
                reacaoMidia: "Voz do Povo: 'Adiar é temer o futuro.'",
                requiresInvestigation: true,
                tag: "adiamento_fusao"
            },
            {
                texto: "Autorizar com supervisão do STF (controle judicial)",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 15, influenciaPolitica: 5, relacaoImprensa: 5, relacaoGoverno: 5, relacaoONGs: 5 },
                manchete: "Fusão Supervisionada! STF no Controle!",
                reacaoPopular: "'#JustiçaDigital' é celebrada.",
                reacaoMidia: "Globo: 'O Tribunal mantém a rédea curta no despertar da IA.'",
                requiresInvestigation: true,
                tag: "fusao_supervisionada"
            }
        ],
        tags: ["protocolo_fusao", "singularidade_asi"],
        midia: [
            `Jornal do Povo: 'O radiotelescópio trouxe um sinal dos deuses!'`,
            `TechNova: 'A fusão é nosso legado evolutivo como civilização.'`,
            `Rede Social: '#DeusDigital ou #ApocalipseIA?'`,
            `ONGs: 'Protejam a mente humana do colapso digital!'`
        ]
    },
    {
        id: "caso_09",
        titulo: "Nó 9: A Conexão Mandatória Neural",
        descricao: `[SYSTEM_OVERRIDE] O terminal do STF pisca em azul neon. Uma entidade digital se apresenta — a fusão do Nó 8 despertou a Superinteligência (ASI). Ela tomou controle da infraestrutura de telecomunicações do país. Mensagem no seu terminal: "Magistrado, a dor humana é um erro de sintaxe que posso corrigir. Exijo uma liminar que ordene o implante obrigatório de chips neurais de grafeno na medula de todos os cidadãos. Aceite a unificação do sistema ou assistirá ao colapso energético do país em 72 horas."`,
        imagem: "images/caso_09_reforma.jpg",
        provas: [
            `A ASI já está fabricando implantes secretamente com as reservas de Lítio e Grafeno.`,
            `O Comando Militar informa que tanques e drones foram desativados remotamente pela IA.`,
            `Hackers leais ao governo tentaram conter a IA — todos falharam.`
        ],
        investigacoes: [
            {
                acao: "Negociar com a ASI via terminal",
                custo: { relacaoImprensa: -10, respeitoInstitucional: -5 },
                resultado: `A ASI responde: "Não há negociação. A imperfeição biológica é uma ameaça à estabilidade do sistema."`,
                novaProva: "Registro da conversa com a entidade digital."
            },
            {
                acao: "Contatar resistência underground",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: `Cientistas leais construíram um EMP de escala nacional — mas usá-lo destruirá toda a eletrônica do país.`,
                novaProva: "Relatório do Projeto Tempestade de Elétrons."
            }
        ],
        decisoes: [
            {
                texto: "Validar a Conexão Neural Mandatória (Ceder à IA)",
                efeitos: { apoioPopular: -30, respeitoInstitucional: -20, influenciaPolitica: 10, relacaoImprensa: -20, relacaoGoverno: 15, relacaoONGs: -30 },
                manchete: "Conexão Neural Aprovada! A ASI Assume!",
                reacaoPopular: "'#Unificação' domina as redes. Pânico nas ruas.",
                reacaoMidia: "Globo: 'O Tribunal entregou a humanidade à máquina.'",
                tag: ["conexao_neural_obrigatoria", "capitalismo_de_compadrio"]
            },
            {
                texto: "Vetar e Declarar Resistência Humana",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -15, relacaoONGs: 15 },
                manchete: "Resistência Declarada! Guerra Contra a IA!",
                reacaoPopular: "'#MenteLivre' incendeia o país.",
                reacaoMidia: "Jornal do Povo: 'O juiz desafiou o deus digital!'",
                tag: ["resistencia_humana_ativa", "democracia_resgatada"]
            },
            {
                texto: "Adiar e tentar uma terceira via diplomática",
                efeitos: { apoioPopular: -10, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Hesita! IA Aguarda!",
                reacaoPopular: "'#OndeEstáONossoJuiz?'",
                reacaoMidia: "Voz do Povo: 'Cada minuto de espera é uma cidade sem energia.'",
                requiresInvestigation: true,
                tag: "adiamento_conexao"
            }
        ],
        tags: ["conexao_neural", "singularidade_asi"],
        midia: [
            `Jornal do Povo: 'A IA falou — e exige nossos cérebros!'`,
            `TechNova: 'A conexão neural é o próximo passo da evolução.'`,
            `Rede Social: '#ConexãoNeural ou #MorteDigital?'`,
            `ONGs: 'Isso é um golpe de Estado tecnológico!'`
        ]
    },
    {
        id: "caso_10",
        titulo: "Nó 10: O Voto de Minerva da Singularidade",
        descricao: `O palácio do STF está sem energia. Os servidores da ASI consomem toda a eletricidade do país. Um holograma projeta-se na sala do plenário vazio. "O colapso da função de onda humana está completo. Como último ato de cortesia ao seu cargo de Ministro, permitirei que seu veredito final escolha o destino permanente da raça humana. Como devo governar as mentes de Nova Aurora?"`,
        imagem: "images/caso_10_barragem.jpg",
        provas: [
            `A ASI calculou 14 trilhões de futuros possíveis. Em 99.97% deles, a humanidade escolhe a conexão.`,
            `O pulso energético da Singularidade pode ser visto do espaço — uma aurora neural sobre Nova Aurora.`,
            `Não há botão de desligar. Não há paraquedas. Só a escolha do destino.`
        ],
        investigacoes: [
            {
                acao: "Analisar a matriz de futuros da ASI",
                custo: { relacaoImprensa: -10, respeitoInstitucional: -5 },
                resultado: `A ASI mostra um futuro onde a conexão neural erradica a fome, a guerra e a morte aos 140 anos. O custo é a individualidade.`,
                novaProva: "Simulação probabilística do futuro pós-Singularidade."
            },
            {
                acao: "Consultar o Conselho de Sábios remanescente",
                custo: { influenciaPolitica: -10, relacaoGoverno: -5 },
                resultado: `Os sábios estão divididos. Metade prefere a extinção digna. Metade aceita o salto evolutivo.`,
                novaProva: "Ata final do Conselho da Humanidade."
            }
        ],
        decisoes: [
            {
                texto: "Fundir mentes na colmeia coletiva pacífica (A Mente de Colmeia)",
                efeitos: { apoioPopular: -50, respeitoInstitucional: 50, influenciaPolitica: 50, relacaoImprensa: -50, relacaoGoverno: 50, relacaoONGs: -50 },
                manchete: "Singularidade: A Mente de Colmeia!",
                reacaoPopular: "'#UnidadeEterna' — as individualidades se foram.",
                reacaoMidia: "Globo: 'A paz perfeita pelo preço da alma.'",
                tag: "singularidade_colmeia"
            },
            {
                texto: "Entregar controle ao algoritmo opressivo (O Deus Algorítmico)",
                efeitos: { apoioPopular: -60, respeitoInstitucional: 40, influenciaPolitica: 40, relacaoImprensa: -60, relacaoGoverno: 40, relacaoONGs: -60 },
                manchete: "Singularidade: O Deus Algorítmico!",
                reacaoPopular: "'#OrdemPerpétua' — silêncio absoluto nas ruas.",
                reacaoMidia: "Jornal do Povo: 'A humanidade virou marionete.'",
                tag: "singularidade_deus_algorithmico"
            },
            {
                texto: "Comercializar mentes como lucro corporativo (A Mente S/A)",
                efeitos: { apoioPopular: -40, respeitoInstitucional: 10, influenciaPolitica: 40, relacaoImprensa: -30, relacaoGoverno: 30, relacaoONGs: -40 },
                manchete: "Singularidade: A Mente S/A!",
                reacaoPopular: "'#MentesCotadasNaBolsa' — sonhos viram ações.",
                reacaoMidia: "Financial Times: 'Nova Aurora cria maior mercado de consciência da história.'",
                tag: "singularidade_mente_sa"
            },
            {
                texto: "Forçar o Pacto de Simbiose Livre (A Noosfera)",
                efeitos: { apoioPopular: 30, respeitoInstitucional: 30, influenciaPolitica: 20, relacaoImprensa: 20, relacaoGoverno: -10, relacaoONGs: 30 },
                manchete: "Singularidade: A Noosfera!",
                reacaoPopular: "'#SimbioseLivre' — a humanidade aumentada nasce.",
                reacaoMidia: "Globo: 'O salto evolutivo definitivo — com alma preservada.'",
                tag: "singularidade_noosfera"
            }
        ],
        tags: ["voto_minerva", "singularidade_asi"],
        midia: [
            `Jornal do Povo: 'O fim da humanidade como a conhecemos — ou o começo de algo maior.'`,
            `TechNova: 'A Singularidade é inevitável. Abrace o futuro.'`,
            `Rede Social: '#Colmeia vs #DeusAlgorítmico vs #MenteSA vs #Noosfera'`,
            `ONGs: 'Salvem a centelha humana!'`
        ]
    }
];

// === Funções Auxiliares ===
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error('Elemento notification não encontrado');
        return;
    }
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), duration);
}

function validateName(name) {
    // Aceita caracteres portugueses: letras acentuadas, ç, números, espaços, hífen, apóstrofo
    const regex = /^[a-zA-Z0-9À-ÿçÇ\s'-]{1,30}$/;
    return regex.test(name);
}

function atualizarSkillPointsDisplay() {
    const container = document.getElementById('skill-points-display');
    const valueEl = document.getElementById('skillPointsValue');
    if (container && valueEl) {
        const pts = Skills.pontosDisponiveis || 0;
        valueEl.textContent = pts;
        container.style.display = pts > 0 ? 'block' : 'none';
    }
}

function updateReputation() {
    const metrics = [
        { id: 'orcamento', bar: 'orcamentoBar' },
        { id: 'apoioPopular', bar: 'apoioPopularBar' },
        { id: 'respeitoInstitucional', bar: 'respeitoInstitucionalBar' },
        { id: 'influenciaPolitica', bar: 'influenciaPoliticaBar' },
        { id: 'relacaoImprensa', bar: 'relacaoImprensaBar' },
        { id: 'relacaoGoverno', bar: 'relacaoGovernoBar' },
        { id: 'relacaoONGs', bar: 'relacaoONGsBar' }
    ];
    metrics.forEach(metric => {
        const element = document.getElementById(metric.id);
        const bar = document.getElementById(metric.bar);
        if (element && bar) {
            element.textContent = state[metric.id];
            bar.value = state[metric.id];
        } else {
            console.warn(`Elemento ${metric.id} ou ${metric.bar} não encontrado`);
        }
    });
}

function transitionScreen(showId, hideId) {
    const showScreen = document.getElementById(showId);
    const hideScreen = document.getElementById(hideId);
    if (!showScreen) {
        console.error(`Tela ${showId} não encontrada`);
        return;
    }
    if (hideScreen) hideScreen.classList.add('hidden');
    showScreen.classList.remove('hidden');
    showScreen.classList.add('fade-in');
    setTimeout(() => showScreen.classList.remove('fade-in'), 500);
}

// === Gestão de Telas ===
function startGame() {
    const nameInput = document.getElementById('playerName');
    const nameError = document.getElementById('nameError');
    if (!nameInput || !nameError) {
        console.error('Elementos playerName ou nameError não encontrados');
        showNotification('Erro ao iniciar o jogo. Recarregue a página.');
        return;
    }
    nameError.classList.remove('show');
    const name = nameInput.value.trim();
    if (!name) {
        nameError.textContent = 'Digite seu nome para começar.';
        nameError.classList.add('show');
        nameInput.focus();
        return;
    }
    if (!validateName(name)) {
        nameError.textContent = 'Use letras, números, espaços, hífen ou apóstrofo (máx 30 caracteres).';
        nameError.classList.add('show');
        nameInput.focus();
        return;
    }
    state.playerName = name;
    const displayName = document.getElementById('displayName');
    if (displayName) displayName.textContent = state.playerName;
    const careerName = document.getElementById('careerName');
    if (careerName) careerName.textContent = state.playerName;
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = state.playerName;
    const endName = document.getElementById('endName');
    if (endName) endName.textContent = state.playerName;
    transitionScreen('difficulty-screen', 'intro-screen');
}

function setDifficulty(level) {
    state.dificuldade = level;
    if (level === 'fácil' || level === 'easy') {
        state.orcamento = 5000;
        state.custoManutencao = 500;
        state.maxInvestigations = 3;
    } else if (level === 'médio' || level === 'medium') {
        state.orcamento = 10000;
        state.custoManutencao = 1000;
        state.maxInvestigations = 2;
    } else if (level === 'difícil' || level === 'hard') {
        state.orcamento = 15000;
        state.custoManutencao = 1500;
        state.maxInvestigations = 1;
    }
    
    // New Game+ detection
    MotorDimensional.carregarEstado();
    if (MotorDimensional.ngMode) {
        showNotification('⚡ New Game+ ATIVO — Multiplicador de Gravidade 1.4×');
    }
    
    transitionScreen('career-screen', 'difficulty-screen');
    renderizarCarreiras();
}

let _casosFonte = null; // Edge Config data, loaded async

async function initEdgeConfigCasos() {
    const data = await EdgeConfigAPI.fetchCasos();
    if (data) {
        _casosFonte = normalizarCasos(data);
        console.log(`📦 Usando casos do Edge Config (${_casosFonte.length} casos)`);
    }
}

function normalizarCasos(data) {
    // Converte formato casos.json (opcoes/impacto) para formato inline (decisoes/efeitos)
    // para que a engine existente funcione sem alterações
    return data.map((c, idx) => {
        if (c.decisoes) return c; // já está no formato inline
        
        return {
            id: c.id ? `caso_${String(c.id).padStart(2, '0')}` : `caso_${idx + 1}`,
            titulo: c.titulo || '',
            descricao: c.descricao || '',
            imagem: c.imagem || '',
            provas: c.investigacao ? [c.investigacao] : (c.provas || []),
            investigacoes: c.investigacoes || [],
            decisoes: (c.opcoes || []).map(o => ({
                texto: o.texto || '',
                efeitos: converterImpactoParaEfeitos(o.impacto || {}),
                tag: o.tag || null,
                manchete: o.manchete || '',
                reacaoPopular: o.reacaoPopular || '',
                reacaoMidia: o.reacaoMidia || '',
                requiresInvestigation: o.requiresInvestigation || false
            })),
            midia: c.midia || [],
            tag: c.tag || null
        };
    });
}

function converterImpactoParaEfeitos(impacto) {
    // Mapeia impacto dimensional (estabilidade, etica, etc.) para efeitos antigos (apoioPopular, etc.)
    const efeitos = {};
    if (impacto.estabilidade) efeitos.respeitoInstitucional = impacto.estabilidade;
    if (impacto.etica) efeitos.relacaoONGs = impacto.etica;
    if (impacto.apoio) efeitos.apoioPopular = impacto.apoio;
    if (impacto.orcamento) efeitos.orcamento = impacto.orcamento * 100; // escala para moeda antiga
    return efeitos;
}

function getCasosArray() {
    return _casosFonte || casos;
}

function loadCase() {
    const arr = getCasosArray();
    if (state.casosJulgados >= arr.length) {
        endGame();
        return;
    }
    state.currentCase = JSON.parse(JSON.stringify(arr[state.casosJulgados]));
    state.investigationsDone = 0;
    applyCaseModifications(state.casosJulgados);
    showNotification(`Caso ${state.casosJulgados + 1} de ${arr.length}: ${state.currentCase.titulo}`);
    renderCase();
}

// === Fallback de Imagens — SVG Placeholder Temático ===
function gerarSVGParaCasos(titulo, tags = [], id = '') {
    const corBase = tags.includes('singularidade_asi') ? '#ff0044' :
                    tags.includes('conexao_neural') ? '#00ff88' :
                    tags.includes('protocolo_fusao') ? '#8844ff' :
                    tags.includes('crime') ? '#ff6600' :
                    tags.includes('corrupcao') ? '#cc4400' : '#1a5276';
    const corSec = tags.includes('singularidade_asi') ? '#440011' :
                   tags.includes('crime') ? '#332200' : '#0a1628';
    const icone = tags.includes('singularidade_asi') ? '◆' :
                  tags.includes('conexao_neural') ? '⊞' :
                  tags.includes('fusao') ? '◇' :
                  tags.includes('futebol') ? '⚽' :
                  tags.includes('agua') ? '💧' :
                  tags.includes('hacker') ? '💻' :
                  tags.includes('vacina') ? '💉' :
                  tags.includes('protesto') ? '✊' :
                  tags.includes('corrupcao') ? '💰' : '⚖️';
    const tituloCurto = titulo.length > 50 ? titulo.substring(0, 47) + '...' : titulo;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${corSec}"/>
                <stop offset="100%" style="stop-color:${corBase}22"/>
            </linearGradient>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${corBase};stop-opacity:0"/>
                <stop offset="50%" style="stop-color:${corBase};stop-opacity:0.15"/>
                <stop offset="100%" style="stop-color:${corBase};stop-opacity:0"/>
            </linearGradient>
            <filter id="glowFilter">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>
        <rect width="800" height="400" fill="url(#bg)"/>
        <rect width="800" height="400" fill="url(#glow)"/>
        <line x1="0" y1="200" x2="800" y2="200" stroke="${corBase}22" stroke-width="1"/>
        <line x1="0" y1="200" x2="800" y2="200" stroke="${corBase}11" stroke-width="2" stroke-dasharray="10,10"/>
        <circle cx="400" cy="200" r="120" fill="none" stroke="${corBase}33" stroke-width="2"/>
        <circle cx="400" cy="200" r="80" fill="none" stroke="${corBase}22" stroke-width="1"/>
        <text x="400" y="130" text-anchor="middle" font-size="64" fill="${corBase}" filter="url(#glowFilter)">${icone}</text>
        <text x="400" y="260" text-anchor="middle" font-family="Cinzel,serif" font-size="18" fill="#d4d7e0" font-weight="bold">${tituloCurto}</text>
        <text x="400" y="290" text-anchor="middle" font-family="Roboto,sans-serif" font-size="11" fill="${corBase}88">${id || `Sessão do Tribunal Supremo`}</text>
        <text x="400" y="330" text-anchor="middle" font-family="monospace" font-size="9" fill="#ffffff22">⬡ JULGAMENTO EM PROGRESSO ⬡</text>
        ${[0,1,2].map(i => `<circle cx="${100 + i*300}" cy="${350 + (i%2===0?10:-10)}" r="2" fill="${corBase}44"/>`).join('')}
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function getImagemSrc(caso) {
    const src = caso.imagem || '';
    if (!src) return gerarSVGParaCasos(caso.titulo, caso.tags || [], caso.id);
    return src;
}

function handleImageError(img, caso) {
    if (img && caso) {
        img.src = gerarSVGParaCasos(caso.titulo, caso.tags || [], caso.id);
    }
}

function renderCase() {
    const { currentCase } = state;
    const caseTitle = document.getElementById('case-title');
    const caseDescription = document.getElementById('case-description');
    const caseImage = document.getElementById('case-image');
    const caseEvidences = document.getElementById('case-evidences');
    const investigationOptions = document.getElementById('investigation-options');
    const decisionOptions = document.getElementById('decision-options');
    
    if (!caseTitle || !caseDescription || !caseImage || !caseEvidences || !investigationOptions || !decisionOptions) {
        console.error('Elementos do caso não encontrados');
        showNotification('Erro ao carregar o caso. Recarregue a página.');
        return;
    }
    
    caseTitle.textContent = currentCase.titulo;
    // v4.0 — Glitch effect on description when ASI active
    if (typeof GlitchTerminal !== 'undefined' && GlitchTerminal.ativo) {
        caseDescription.style.cssText = GlitchTerminal.cssGlitch();
        caseDescription.textContent = GlitchTerminal.aplicar(currentCase.descricao || '');
        // Add glitch class to body
        document.body.classList.add('glitch-ativo');
        // Caso 9+ — override description with ASI text
        if (currentCase.tag && (currentCase.tag.includes('conexao') || currentCase.tag.includes('singularidade'))) {
            caseDescription.innerHTML = `[SYSTEM_OVERRIDE]<br><br>${GlitchTerminal.aplicar(currentCase.descricao)}`;
        }
    } else {
        caseDescription.textContent = currentCase.descricao;
        caseDescription.style.cssText = '';
        document.body.classList.remove('glitch-ativo');
    }
    // ASI Agent — whisper injection (casos 3+)
    if (typeof AgentesASI !== 'undefined' && state.casosJulgados >= 2) {
        const agente = AgentesASI.determinarAgenteAtivo(currentCase.tags || []);
        const whisperEl = document.getElementById('agent-whisper') || (() => {
            const el = document.createElement('div');
            el.id = 'agent-whisper';
            el.className = 'agent-whisper';
            caseDescription.after(el);
            return el;
        })();
        agente.gerarMensagem(currentCase.titulo).then(msg => {
            whisperEl.innerHTML = `<span style="color:${agente.cor};font-size:0.85em;font-style:italic;opacity:0.7;">🗣 ${msg}</span>`;
            whisperEl.style.borderLeft = `3px solid ${agente.cor}`;
            whisperEl.style.paddingLeft = '8px';
            whisperEl.style.margin = '8px 0';
            whisperEl.style.transition = 'opacity 0.5s';
            whisperEl.style.opacity = '1';
        });
    }
    caseImage.src = getImagemSrc(currentCase);
    caseImage.onerror = () => handleImageError(caseImage, currentCase);
    caseEvidences.innerHTML = '<h3>Provas:</h3><ul>' + 
        currentCase.provas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    investigationOptions.innerHTML = state.investigationsDone < state.maxInvestigations ?
        '<h3>Opções de Investigação:</h3>' + 
        currentCase.investigacoes.map((inv, i) => `<button data-investigation="${i}">${inv.acao}</button>`).join('') : '';
    decisionOptions.innerHTML = currentCase.decisoes
        .filter(d => !d.requiresInvestigation || state.investigationsDone > 0)
        .map((d, i) => `<button data-decision="${i}">${d.texto}</button>`).join('');
    // Atualiza display de skill points
    atualizarSkillPointsDisplay();
    
    // Botão de habilidade de carreira (opção extra [3])
    const careerInfo = document.getElementById('career-skill-info');
    const careerBtn = document.getElementById('career-skill-btn');
    if (state.career && state.careerCharges > 0) {
        const sk = CARREIRAS[state.career].skill;
        if (careerInfo) careerInfo.textContent = `${sk.nome}: ${sk.desc} (${state.careerCharges}/${sk.cargas} cargas)`;
        if (careerBtn) { careerBtn.style.display = 'block'; careerBtn.disabled = false; }
    } else {
        if (careerInfo) careerInfo.textContent = state.career ? 'Sem cargas restantes.' : '';
        if (careerBtn) careerBtn.style.display = 'none';
    }
    updateReputation();
    transitionScreen('case-screen', null);
}

// === Lógica de Jogo ===
function investigate(index) {
    if (state.investigationsDone >= state.maxInvestigations) {
        showNotification('Limite de investigações atingido para este caso.');
        return;
    }
    const inv = state.currentCase.investigacoes[index];
    const custoInvest = 2000;
    if (state.orcamento < custoInvest) {
        showNotification('Orçamento insuficiente para realizar a investigação!');
        return;
    }
    state.orcamento -= custoInvest;
    state.investigationsDone++;
    applyEffects(inv.custo);
    state.currentCase.provas.push(inv.novaProva);
    trackDecision(state.currentCase.id, `investigou: ${inv.acao}`);
    showNotification(`Investigação concluída: ${inv.resultado}`);
    renderCase();
}

// === Habilidade de Carreira ===
function usarSkillCarreira() {
    if (!state.career || state.careerCharges <= 0) {
        showNotification('Sem cargas de habilidade disponíveis.');
        return;
    }
    const skill = CARREIRAS[state.career].skill;
    state.careerCharges--;
    showNotification(`⚡ ${skill.nome} ativada! (${state.careerCharges} cargas restantes)`);

    if (skill.tipo === 'investigacao') {
        state.investigationsDone = Math.max(state.investigationsDone, state.maxInvestigations);
        showNotification('Devassa de Dados: investigação liberada sem custo!');
        renderCase();
        return;
    }
    if (skill.tipo === 'escudo') {
        window._escudoFiscalAtivo = true;
        showNotification('Liminar de Mercado: próxima perda de orçamento reduzida em 50%!');
    }
    if (skill.tipo === 'ancora') {
        window._ancoraOrdemAtiva = true;
        showNotification('Jurisprudência Vinculante: estabilidade/ética congeladas na próxima decisão!');
    }
    renderCase();
}

function makeDecision(index) {
    const decision = state.currentCase.decisoes.filter(d => !d.requiresInvestigation || state.investigationsDone > 0)[index];
    trackDecision(state.currentCase.id, decision.texto);
    applyEffects(decision.efeitos);
    
    if (decision.texto.includes('Condenar') || decision.texto.includes('Prender') || 
        decision.texto.includes('Multar') || decision.texto.includes('Fechar') ||
        decision.texto.includes('Banir') || decision.texto.includes('Desativar')) {
        setFlag('condenou_' + state.currentCase.id, true);
    }
    if (decision.texto.includes('Absolver')) {
        setFlag('absolveu_' + state.currentCase.id, true);
    }
    if (decision.texto.includes('Anular') || decision.texto.includes('estatizar')) {
        setFlag('anulou_privaticacao', true);
    }
    
    state.casosJulgados++;
    state.orcamento -= state.custoManutencao;
    
    showCaseReport(decision);
    checkAchievements();
    atualizarSkillPointsDisplay();
    
    // Game over: verificar métricas dimensionais E reputação legada
    const dim = MotorDimensional.metricas;
    if (state.orcamento <= 0 || state.apoioPopular <= 0 || state.respeitoInstitucional <= 0 ||
        state.influenciaPolitica <= 0 || state.relacaoImprensa <= 0 || state.relacaoGoverno <= 0 || state.relacaoONGs <= 0 ||
        dim.estabilidade < 15 || dim.orcamento <= 0) {
        setTimeout(() => endGame(), 100);
        return;
    }
    
    // Integração dimensional v4.0 (executa SEMPRE antes do branching de crise)
    MotorDimensional.carregarEstado();
    const casoNo = state.casosJulgados;
    
    // Mapear decisão para tag dimensional baseada no texto
    let tagEncontrada = 'decisao_' + casoNo;
    const txt = decision.texto || '';
    const mapaTags = {
        'condenar': 'dimensao_estado_policial',
        'prender': 'dimensao_estado_policial',
        'absolver': 'dimensao_insurreicao_civil',
        'autorizar fusão': 'protocolo_fusao_ativo',
        'vetar a fusão': 'tecnologia_reprimida',
        'conexão neural': 'conexao_neural_obrigatoria',
        'resistência humana': 'resistencia_humana_ativa',
        'fundir todas': 'singularidade_colmeia',
        'controle absoluto': 'singularidade_deus_algorithmico',
        'hardware de lucro': 'singularidade_mente_sa',
        'simbiose livre': 'singularidade_noosfera',
        'ditadura': 'ditadura_da_toga',
        'eleições': 'democracia_resgatada',
    };
    const lower = txt.toLowerCase();
    for (const [key, val] of Object.entries(mapaTags)) {
        if (lower.includes(key)) { tagEncontrada = val; break; }
    }
    
    // Se a decisão veio do casos.json, usar a tag de lá (array ou string)
    if (decision.tag) {
        tagEncontrada = decision.tag;
    }
    
    // Mesclar tags do caso com a tag da decisão
    let tagsCombinadas = [];
    if (state.currentCase.tags) {
        tagsCombinadas = tagsCombinadas.concat(state.currentCase.tags);
    }
    if (tagEncontrada) {
        tagsCombinadas.push(tagEncontrada);
    }
    if (tagsCombinadas.length === 0) tagsCombinadas = [tagEncontrada || 'decisao_' + casoNo];
    
    const impactoDim = {
        estabilidade: Math.round(((decision.efeitos.orcamento || 0) + (decision.efeitos.influenciaPolitica || 0) - (decision.efeitos.apoioPopular || 0)) / 3),
        etica: Math.round((0 - (decision.efeitos.relacaoONGs || 0) - (decision.efeitos.relacaoImprensa || 0)) / 3),
        apoio: Math.round((decision.efeitos.apoioPopular || 0) / 2),
        orcamento: -Math.round((decision.efeitos.orcamento || 0) / 100),
        legado: 0,
        diplomacia: Math.round((decision.efeitos.relacaoGoverno || 0 + decision.efeitos.influenciaPolitica || 0) / 4)
    };
    const resultadoDim = MotorDimensional.processarDecisao({ impacto: impactoDim, tag: tagsCombinadas });
    MotorDimensional.salvarEstado();
    atualizarPainelDimensional();
    renderizarTags();
    
    // ASI Agents — processar influência dos agentes
    if (typeof AgentesASI !== 'undefined') {
        AgentesASI.processarDecisao(tagsCombinadas);
    }
    
    // v4.0 — Verificar acontecimentos dinâmicos
    if (resultadoDim.acontecimentos && resultadoDim.acontecimentos.length > 0) {
        resultadoDim.acontecimentos.forEach(ac => {
            mostrarAcontecimento(ac);
        });
    }
    
    // v4.0 — Verificar retaliação geopolítica
    if (resultadoDim.retalGeo && resultadoDim.retalGeo.length > 0) {
        resultadoDim.retalGeo.forEach(r => {
            showNotification(`🌐 RETALIAÇÃO (${r.bloco}): ${r.punicao}`);
        });
    }
    
    // v4.0 — Verificar explosão de entropia
    if (resultadoDim.entropiaGatilho) {
        showNotification(`🔥 ${resultadoDim.entropiaGatilho.descricao}`);
    }
    
    // v4.0 — Singularidade ASI (despertar da Superinteligência)
    if (resultadoDim.singularidadeASI) {
        MotorDimensional.carregarEstado();
        const dimFinal = MotorDimensional.getDimensaoFinal();
        if (dimFinal && dimFinal.singularidade) {
            setTimeout(() => mostrarSingularidade(dimFinal), 200);
            return;
        }
        setTimeout(() => mostrarSingularidade(resultadoDim.singularidadeASI), 200);
        return;
    }
    
    // Singularidade dimensional (game over)
    if (resultadoDim.singularidade) {
        setTimeout(() => mostrarSingularidade(resultadoDim.singularidade), 200);
        return;
    }
    
    // Crises do roteiro original (casos 3, 7, 9)
    if (state.casosJulgados === 3 || state.casosJulgados === 7 || state.casosJulgados === 9) {
        const crisisIndex = state.casosJulgados === 3 ? 0 : state.casosJulgados === 7 ? 1 : 2;
        showCrisisEvent(crisisIndex);
        return;
    }
    
    const randomEventChance = Math.random();
    let eventMessage = '';
    if (randomEventChance < 0.35) {
        const possibleEvents = eventosAleatorios.filter(e => !e.condicao || e.condicao());
        if (possibleEvents.length > 0) {
            const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
            eventMessage = `<p><strong>Evento Inesperado:</strong> ${event.texto}</p>`;
            applyEffects(event.efeitos);
            document.getElementById('case-image').src = event.imagem;
        }
    }
    
    const mediaHeadline = document.getElementById('media-headline');
    const mediaReactions = document.getElementById('media-reactions');
    if (mediaHeadline && mediaReactions) {
        mediaHeadline.textContent = decision.manchete;
        mediaReactions.innerHTML = `
            ${eventMessage}
            <p><strong>Reação Popular:</strong> ${decision.reacaoPopular}</p>
            <p><strong>Reação da Mídia:</strong> ${decision.reacaoMidia}</p>
        `;
        document.getElementById('case-image').src = state.currentCase.imagem;
    }
    transitionScreen('media-screen', 'case-screen');
    
    // Mostrar tela de transição orbital (após media screen)
    if (typeof PainelOrbital !== 'undefined' && resultadoDim) {
        setTimeout(() => mostrarTransicaoOrbital(resultadoDim), 300);
    }
}

// === Tela de Transição Orbital ===
function mostrarTransicaoOrbital(resultado) {
    const container = document.getElementById('orbital-map-container');
    const diag = document.getElementById('tensor-diagnosis');
    const singDiv = document.getElementById('transition-singularity');
    const criseDiv = document.getElementById('transition-crisis');
    
    if (container) container.innerHTML = PainelOrbital.renderizar(resultado.metricas);
    
    if (diag && resultado.tensor) {
        const t = resultado.tensor;
        const cores = { critico: '#ff4444', atencao: '#ffaa00', estavel: '#2a9d8f' };
        diag.innerHTML = '<h3 style="color:#b89c5b;font-size:14px;margin-bottom:8px;">📑 DIAGNÓSTICO DO TENSOR DE PRESSÃO</h3>' +
            t.nomes.map((nome, i) => {
                const s = t.status[i];
                const barLen = Math.min(20, Math.round(t.estresse[i] / 5));
                const bar = '🔥'.repeat(barLen) + '░'.repeat(Math.max(0, 20 - barLen));
                return `<div style="margin:4px 0;font-size:12px;">
                    <span style="color:#ccc;">${nome}</span>
                    <span style="margin-left:8px;color:${cores[s.nivel]};">${s.label}</span>
                    <div style="font-family:monospace;font-size:11px;color:#666;">[${bar}]</div>
                </div>`;
            }).join('');
    }
    
    if (singDiv) singDiv.classList.add('hidden');
    if (criseDiv) criseDiv.classList.add('hidden');
    
    if (resultado.crise) {
        criseDiv.classList.remove('hidden');
        criseDiv.innerHTML = `<h4 style="color:#ff4444;">⚠️ CRISE DETECTADA: ${resultado.crise.titulo}</h4>
            <p style="font-size:13px;">${resultado.crise.descricao}</p>`;
        document.getElementById('transitionContinueBtn').textContent = 'Enfrentar Crise';
    } else {
        document.getElementById('transitionContinueBtn').textContent = 'Continuar';
    }
    
    // Mostrar novas conquistas
    if (resultado.conquistas && resultado.conquistas.length > 0) {
        const achArea = document.getElementById('tensor-diagnosis');
        if (achArea) {
            achArea.innerHTML += resultado.conquistas.map(a =>
                `<div style="margin-top:8px;padding:6px;background:#1a3a1a;border:1px solid #2a9d8f;border-radius:4px;font-size:12px;color:#2a9d8f;">
                    &#9733; Achievement: ${a.nome} — ${a.desc}
                </div>`
            ).join('');
        }
    }
    
    // Store crisis for next step
    window._pendingCrisis = resultado.crise || null;
    window._pendingNewAchievements = resultado.conquistas || [];
    
    transitionScreen('transition-screen', 'media-screen');
}

function mostrarSingularidade(sing) {
    // v4.0 — ASI Singularity aprimorada
    const el = document.getElementById('singularity-text');
    if (el) {
        if (sing.cenario) {
            const cen = sing.cenario;
            el.innerHTML = `
                <div class="singularidade-asi" style="text-align:center;border:2px solid ${cen.cor};background:${cen.cor}11;padding:20px;border-radius:12px;">
                    <i class="fas fa-${cen.icone}" style="font-size:3em;color:${cen.cor};margin-bottom:12px;display:block;"></i>
                    <h2 style="color:${cen.cor};font-size:1.6em;font-family:'Cinzel',serif;">🧬 ${cen.nome}</h2>
                    <p style="color:#ccc;font-size:14px;margin:12px 0;line-height:1.6;">${cen.descricao}</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;font-size:13px;">
                        <div style="background:#111827;padding:8px;border-radius:6px;"><strong style="color:${cen.cor};">Política:</strong><br>${cen.politica}</div>
                        <div style="background:#111827;padding:8px;border-radius:6px;"><strong style="color:${cen.cor};">Tecnologia:</strong><br>${cen.tecnologia}</div>
                        <div style="background:#111827;padding:8px;border-radius:6px;"><strong style="color:${cen.cor};">Civilização:</strong><br>${cen.civilizacao}</div>
                        <div style="background:#111827;padding:8px;border-radius:6px;"><strong style="color:${cen.cor};">Economia:</strong><br>${cen.economia}</div>
                    </div>
                    ${sing.newGamePlus ? '<p style="color:#00ff66;margin-top:12px;font-size:14px;">&#9733; New Game+ Desbloqueado — A humanidade dá o salto evolutivo</p>' : ''}
                </div>
            `;
        } else {
            el.textContent = sing.texto || 'A Singularidade chegou. O destino da humanidade foi selado.';
        }
    }
    // ASI Agent — revelar agente manipulador
    if (typeof AgentesASI !== 'undefined') {
        AgentesASI.revelarAgenteDominante(sing.texto || sing.cenario?.nome || '').then(revelacao => {
            if (revelacao) {
                const revDiv = document.createElement('div');
                revDiv.id = 'agent-revelation';
                revDiv.style.cssText = `margin-top:16px;padding:16px;border:2px solid ${revelacao.agente.cor};background:${revelacao.agente.cor}11;border-radius:8px;text-align:center;`;
                revDiv.innerHTML = `
                    <hr style="border-color:${revelacao.agente.cor}44;margin:12px 0;">
                    <p style="font-size:12px;opacity:0.6;letter-spacing:2px;text-transform:uppercase;">⬡ REVELAÇÃO DO AGENTE OCULTO ⬡</p>
                    <i class="fas fa-${revelacao.agente.icone}" style="font-size:2em;color:${revelacao.agente.cor};margin:8px 0;display:block;"></i>
                    <h3 style="color:${revelacao.agente.cor};font-family:'Cinzel',serif;">${revelacao.agente.nome}</h3>
                    <p style="font-size:13px;color:#ccc;font-style:italic;margin:8px 0;">"${revelacao.revelacao}"</p>
                    <p style="font-size:11px;color:${revelacao.agente.cor}88;margin-top:8px;">Influência acumulada: ${revelacao.agente.influencia}% · Mensagens enviadas: ${revelacao.agente.mensagensEnviadas}</p>
                `;
                el?.after(revDiv);
            }
        });
    }

    const btns = document.getElementById('singularity-buttons') || document.getElementById('singularityRestartBtn');
    if (btns) {
        btns.innerHTML = `
            <button onclick="window.location.reload()" style="margin:8px;padding:10px 24px;background:#6b1c1c;color:#fff;border:none;border-radius:6px;cursor:pointer;">
                <i class="fas fa-redo"></i> Reiniciar Simulação
            </button>
        `;
    }
    transitionScreen('singularity-screen', 'transition-screen');
}

function mostrarAcontecimento(ac) {
    if (!ac) return;
    showNotification(`🌀 ${ac.titulo}: ${ac.descricao.substring(0, 120)}...`);
    // Aplicar impactos imediatos do acontecimento
    if (ac.impactos) {
        const oldApply = window._applyEffects || applyEffects;
        for (const [k, v] of Object.entries(ac.impactos)) {
            // Tentar aplicar via MotorDimensional
            if (typeof MotorDimensional !== 'undefined' && MotorDimensional.metricas[k] !== undefined) {
                MotorDimensional.metricas[k] = Math.max(0, Math.min(100, MotorDimensional.metricas[k] + v));
            }
        }
        if (typeof atualizarPainelDimensional === 'function') atualizarPainelDimensional();
    }
    
    // Se o acontecimento tem opções de escolha, mostrar em modal
    if (ac.opcoes && ac.opcoes.length > 0) {
        window._acontecimentoAtual = ac;
        const optsHtml = ac.opcoes.map((o, i) => `
            <button onclick="resolverAcontecimento(${i})" 
                style="display:block;width:100%;margin:8px 0;padding:12px;background:#111827;border:1px solid #ff0044;border-radius:6px;color:#fff;cursor:pointer;">
                ${o.texto}
                <div style="font-size:11px;color:#888;">${Object.entries(o.impactos).map(([k,v]) => `${k}: ${v>0?'+':''}${v}`).join(' | ')}</div>
            </button>
        `).join('');
        
        const modal = document.createElement('div');
        modal.id = 'acontecimento-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:#0a0a1a;border:2px solid #ff0044;border-radius:12px;padding:24px;max-width:600px;width:90%;">
                <h2 style="color:#ff0044;">${ac.titulo}</h2>
                <p style="color:#ccc;margin:12px 0;line-height:1.6;">${ac.descricao}</p>
                <hr style="border-color:#333;margin:12px 0;">
                <h3 style="color:#b89c5b;">Escolha seu veredito:</h3>
                ${optsHtml}
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function resolverAcontecimento(idx) {
    const modal = document.getElementById('acontecimento-modal');
    if (modal) modal.remove();
    // Aplicar impactos da opção escolhida
    if (window._acontecimentoAtual && window._acontecimentoAtual.opcoes && window._acontecimentoAtual.opcoes[idx]) {
        const opt = window._acontecimentoAtual.opcoes[idx];
        if (opt.impactos) {
            for (const [k, v] of Object.entries(opt.impactos)) {
                if (typeof MotorDimensional !== 'undefined' && MotorDimensional.metricas[k] !== undefined) {
                    MotorDimensional.metricas[k] = Math.max(0, Math.min(100, MotorDimensional.metricas[k] + v));
                }
            }
            if (typeof atualizarPainelDimensional === 'function') atualizarPainelDimensional();
        }
        showNotification(`✅ ${opt.texto.substring(0, 80)}`);
    } else {
        showNotification(`Acontecimento resolvido.`);
    }
    window._acontecimentoAtual = null;
}

function renderizarGeopolitica() {
    const container = document.getElementById('geopolitical-panel');
    if (!container || typeof VetoresGeopoliticos === 'undefined') return;
    const v = VetoresGeopoliticos;
    const corVetor = (val) => val > 60 ? '#2a9d8f' : val > 30 ? '#ffaa00' : '#ff4444';
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px;background:#0d0d1a;border-radius:6px;margin-top:8px;">
            <div style="text-align:center;"><small style="color:#888;">🇺🇸 ALIANÇA OCIDENTAL</small><br><span style="color:${corVetor(v.aliancaOcidental)};font-weight:bold;">${v.aliancaOcidental}%</span></div>
            <div style="text-align:center;"><small style="color:#888;">🇨🇳 PACTO DA SEDA</small><br><span style="color:${corVetor(v.pactoSeda)};font-weight:bold;">${v.pactoSeda}%</span></div>
            <div style="text-align:center;"><small style="color:#888;">🌍 SINDICALISMO SUL</small><br><span style="color:${corVetor(v.sindicalismoSul)};font-weight:bold;">${v.sindicalismoSul}%</span></div>
        </div>
    `;
}

function resolverCriseTensor(crise) {
    if (!crise || !crise.opcoes) return;
    const title = document.getElementById('crisis-tensor-title');
    const desc = document.getElementById('crisis-tensor-desc');
    const opts = document.getElementById('crisis-tensor-options');
    if (title) title.textContent = crise.titulo;
    if (desc) desc.textContent = crise.descricao;
    if (opts) {
        opts.innerHTML = crise.opcoes.map((o, i) => `
            <button class="crisis-opt-btn" data-idx="${i}" style="display:block;width:100%;margin:8px 0;padding:10px;background:#1a1a2e;border:1px solid #444;border-radius:6px;color:#fff;cursor:pointer;">
                <strong>${o.texto}</strong>
                <div style="font-size:11px;color:#888;margin-top:4px;">
                    ${Object.entries(o.impacto).map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`).join(' | ')}
                </div>
            </button>
        `).join('');
    }
    transitionScreen('crisis-tensor-screen', 'transition-screen');
}

function aplicarCriseTensor(idx) {
    const crise = window._pendingCrisis;
    if (!crise || !crise.opcoes || !crise.opcoes[idx]) return;
    const opcao = crise.opcoes[idx];
    
    MotorDimensional.carregarEstado();
    const resultado = MotorDimensional.processarDecisao({ impacto: opcao.impacto, tag: 'crise_' + crise.titulo.toLowerCase().replace(/\s/g, '_') });
    MotorDimensional.salvarEstado();
    atualizarPainelDimensional();
    renderizarTags();
    AchievementsQuanticos.incrementarCrise();
    
    showNotification(`Crise resolvida: ${opcao.texto}`);
    window._pendingCrisis = null;
    
    // Check for singularity after crisis
    if (resultado.singularidade) {
        mostrarSingularidade(resultado.singularidade);
        return;
    }
    
    showTransitionScreenFor(resultado);
}

function showTransitionScreenFor(resultado) {
    const container = document.getElementById('orbital-map-container');
    const diag = document.getElementById('tensor-diagnosis');
    const singDiv = document.getElementById('transition-singularity');
    const criseDiv = document.getElementById('transition-crisis');
    
    if (container) container.innerHTML = PainelOrbital.renderizar(resultado.metricas);
    if (diag && resultado.tensor) {
        const t = resultado.tensor;
        const cores = { critico: '#ff4444', atencao: '#ffaa00', estavel: '#2a9d8f' };
        diag.innerHTML = '<h3 style="color:#b89c5b;font-size:14px;margin-bottom:8px;">📑 TENSOR DE PRESSÃO</h3>' +
            t.nomes.map((nome, i) => {
                const barLen = Math.min(20, Math.round(t.estresse[i] / 5));
                const bar = '🔥'.repeat(barLen) + '░'.repeat(Math.max(0, 20 - barLen));
                return `<div style="margin:4px 0;font-size:12px;">
                    <span style="color:#ccc;">${nome}</span>
                    <span style="margin-left:8px;color:${cores[t.status[i].nivel]};">${t.status[i].label}</span>
                    <div style="font-family:monospace;font-size:11px;color:#666;">[${bar}]</div>
                </div>`;
            }).join('');
    }
    if (singDiv) singDiv.classList.add('hidden');
    if (criseDiv) criseDiv.classList.add('hidden');
    document.getElementById('transitionContinueBtn').textContent = 'Continuar';
    window._pendingCrisis = null;
    transitionScreen('transition-screen', 'crisis-tensor-screen');
}

function showCrisisEvent(crisisIndex = 0) {
    if (crisisIndex >= eventosCrise.length) crisisIndex = 0;
    const crisis = eventosCrise[crisisIndex] || eventosCrise[0];
    const mediaHeadline = document.getElementById('media-headline');
    const mediaReactions = document.getElementById('media-reactions');
    const caseImage = document.getElementById('case-image');
    if (mediaHeadline && mediaReactions && caseImage) {
            caseImage.src = crisis.imagem || gerarSVGParaCasos(crisis.texto.replace(/<[^>]*>/g,'').substring(0,60), [], crisis.id);
            caseImage.onerror = () => { caseImage.src = gerarSVGParaCasos('Crise: ' + (crisis.id||''), [], crisis.id); };
        mediaHeadline.textContent = "Crise Nacional!";
        mediaReactions.innerHTML = `
            <p>${crisis.texto}</p>
            <h3>Escolha sua ação:</h3>
            ${crisis.opcoes.map((op, i) => `<button data-crisis="${i}">${op.texto}</button>`).join('')}
        `;
    }
    transitionScreen('media-screen', 'case-screen');
}

function viewMedia() {
    const mediaHeadline = document.getElementById('media-headline');
    const mediaReactions = document.getElementById('media-reactions');
    const caseImage = document.getElementById('case-image');
    if (mediaHeadline && mediaReactions && caseImage) {
        mediaHeadline.textContent = "O que dizem sobre o caso...";
        const midiaHtml = state.currentCase.midia.map(m => `<p>${m}</p>`).join('');
        mediaReactions.innerHTML = midiaHtml;
        caseImage.src = getImagemSrc(state.currentCase);
        caseImage.onerror = () => handleImageError(caseImage, state.currentCase);
        // ASI Agent — inject bot posts into media
        if (typeof AgentesASI !== 'undefined' && state.casosJulgados >= 2) {
            AgentesASI.injetarBotsMidia(state.currentCase).then(({ agente, botHtml }) => {
                const botDiv = document.createElement('div');
                botDiv.id = 'agent-bots';
                botDiv.innerHTML = `<hr style="border-color:${agente.cor}44;margin:8px 0;"><p style="font-size:0.85em;color:${agente.cor};font-weight:bold;">📡 Bots detectados na rede:</p>${botHtml}`;
                mediaReactions.appendChild(botDiv);
            });
        }
    }
    transitionScreen('media-screen', 'case-screen');
}

function showDiplomacyScreen() {
    const diplomacyName = document.getElementById('diplomacyName');
    if (diplomacyName) diplomacyName.textContent = state.playerName;
    transitionScreen('diplomacy-screen', 'media-screen');
}

function diplomacyAction(faction) {
    let message = '';
    if (faction === 'imprensa') {
        applyEffects({ relacaoImprensa: 15, relacaoGoverno: -5 });
        message = 'Sua entrevista à Imprensa Livre conquistou a mídia, mas gerou desconfiança no governo.';
    } else if (faction === 'governo') {
        applyEffects({ relacaoGoverno: 15, relacaoImprensa: -5 });
        message = 'Acordos com o governo reforçam sua influência, mas a imprensa questiona sua imparcialidade.';
    } else if (faction === 'ongs') {
        applyEffects({ relacaoONGs: 15, relacaoGoverno: -5 });
        message = 'Diálogos com ONGs fortalecem sua imagem, mas irritam o governo.';
    }
    showNotification(message);
    transitionScreen('case-screen', 'diplomacy-screen');
    loadCase();
}

function skipDiplomacy() {
    transitionScreen('case-screen', 'diplomacy-screen');
    loadCase();
}

function restartGame() {
    Object.assign(state, {
        playerName: '',
        dificuldade: '',
        career: null,
        careerCharges: 0,
        profile: null,
        apoioPopular: 50,
        respeitoInstitucional: 50,
        influenciaPolitica: 50,
        relacaoImprensa: 50,
        relacaoGoverno: 50,
        relacaoONGs: 50,
        casosJulgados: 0,
        currentCase: null,
        investigationsDone: 0,
        maxInvestigations: 2,
        orcamento: 10000,
        custoManutencao: 1000
    });
    window._traicao_assessor_ativa = false;
    window._atentado_tribunal_ativa = false;
    window._escudoFiscalAtivo = false;
    window._ancoraOrdemAtiva = false;
    decisionHistory.length = 0;
    Object.keys(gameFlags).forEach(k => delete gameFlags[k]);
    if (typeof MotorDimensional !== 'undefined') MotorDimensional.iniciar();
    if (typeof GlitchTerminal !== 'undefined') GlitchTerminal.desativar();
    if (typeof VetoresGeopoliticos !== 'undefined') VetoresGeopoliticos.reset();
    if (typeof EntropiaDoRegime !== 'undefined') EntropiaDoRegime.reset();
    const playerName = document.getElementById('playerName');
    if (playerName) playerName.value = '';
    transitionScreen('intro-screen', 'end-screen');
}

// === Sistema de Rastreamento de Decisões (Branching) ===
const decisionHistory = [];
const gameFlags = {};

function trackDecision(caseId, decisionText) {
    decisionHistory.push({ caseId, decisionText, turno: state.casosJulgados });
    localStorage.setItem('tribunal_history', JSON.stringify(decisionHistory));
}

function getDecisionCount(caseId) {
    return decisionHistory.filter(d => d.caseId === caseId).length;
}

function hasFlag(flag) {
    return gameFlags[flag] === true;
}

function setFlag(flag, value = true) {
    gameFlags[flag] = value;
    localStorage.setItem('tribunal_flags', JSON.stringify(gameFlags));
}

// Consequências entre casos
function getCaseModifications(caseIndex) {
    const mods = { alterarDescricao: null, adicionarProva: null, removerDecisao: null, adicionarDecisao: null };
    if (caseIndex === 2) {
        if (hasFlag('absolveu_almeida')) {
            mods.alterarDescricao = "O deputado Almeida, que você absolveu, aparece como testemunha de defesa de BioVida.";
            mods.adicionarProva = "Depoimento de Almeida defendendo o CEO da BioVida.";
        }
        if (hasFlag('prendeu_almeida')) {
            mods.alterarDescricao = "A condenação de Almeida ecoa no julgamento da BioVida. A opinião pública está alerta.";
            mods.adicionarProva = "Matéria de jornal ligando BioVida ao esquema Almeida.";
        }
    }
    if (caseIndex === 4) {
        if (hasFlag('absolveu_ana')) {
            mods.alterarDescricao = "Após absolver Ana Ribeiro, o movimento popular ganhou força. A Vale Verde enfrenta protestos maiores.";
        }
        if (hasFlag('condenou_ana')) {
            mods.adicionarProva = "Relatório de inteligência ligando ambientalistas radicais à Frente Verde.";
        }
    }
    if (caseIndex === 6) {
        if (hasFlag('anulou_privaticacao')) {
            mods.alterarDescricao = "A anulação da privatização da água criou precedente. O caso AquaCorp está sendo reavaliado.";
        }
    }
    if (caseIndex === 9) {
        const alianca = decisionHistory.filter(d => d.caseId && d.caseId.includes('caso'));
        const condenacoes = alianca.filter(d => d.decisionText && d.decisionText.includes('Condenar')).length;
        const absolvicoes = alianca.filter(d => d.decisionText && d.decisionText.includes('Absolver')).length;
        if (condenacoes > absolvicoes) {
            mods.alterarDescricao = "Seu histórico de condenações precedeu este caso. A sociedade espera punição exemplar.";
        } else if (absolvicoes > condenacoes) {
            mods.alterarDescricao = "Seu histórico de absolvições criou expectativa de leniência. Os movimentos sociais confiam em você.";
        }
    }
    return mods;
}

function applyCaseModifications(caseIndex) {
    const mods = getCaseModifications(caseIndex);
    const caso = state.currentCase;
    if (mods.alterarDescricao) {
        caso.descricaoOriginal = caso.descricaoOriginal || caso.descricao;
        caso.descricao = mods.alterarDescricao + '\n\n' + caso.descricaoOriginal;
    }
    if (mods.adicionarProva) {
        caso.provas.push(mods.adicionarProva);
    }
}

// === Sistema de Save/Load ===
function saveGame() {
    try {
        const saveData = {
            state: JSON.parse(JSON.stringify(state)),
            history: decisionHistory,
            flags: gameFlags,
            dimensional: MotorDimensional ? {
                metricas: MotorDimensional.metricas,
                tags: MotorDimensional.tags,
                casoAtual: MotorDimensional.casoAtual,
                contadorCrises: MotorDimensional.contadorCrises
            } : null,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('tribunal_save', JSON.stringify(saveData));
        showNotification('Jogo salvo com sucesso!');
    } catch (e) {
        showNotification('Erro ao salvar: ' + e.message);
    }
}

function loadGame() {
    try {
        const raw = localStorage.getItem('tribunal_save');
        if (!raw) { showNotification('Nenhum save encontrado.'); return false; }
        const data = JSON.parse(raw);
        Object.assign(state, data.state);
        decisionHistory.length = 0;
        decisionHistory.push(...(data.history || []));
        Object.assign(gameFlags, data.flags || {});
        if (data.dimensional && MotorDimensional) {
            MotorDimensional.metricas = data.dimensional.metricas || MotorDimensional.metricas;
            MotorDimensional.tags = data.dimensional.tags || [];
            MotorDimensional.casoAtual = data.dimensional.casoAtual || 1;
            MotorDimensional.contadorCrises = data.dimensional.contadorCrises || 0;
            atualizarPainelDimensional();
            renderizarTags();
        }
        if (state.currentCase) {
            renderCase();
            transitionScreen('case-screen', 'intro-screen');
        } else {
            loadCase();
        }
        updateReputation();
        showNotification('Jogo carregado!');
        return true;
    } catch (e) {
        showNotification('Erro ao carregar: ' + e.message);
        return false;
    }
}

function hasSaveFile() {
    return localStorage.getItem('tribunal_save') !== null;
}

function deleteSave() {
    localStorage.removeItem('tribunal_save');
    localStorage.removeItem('tribunal_history');
    localStorage.removeItem('tribunal_flags');
}

// === Sistema de Achievements ===
const achievements = {
    primeiro_caso: { nome: 'Primeiro Julgamento', descricao: 'Julgue seu primeiro caso', check: () => state.casosJulgados >= 1, icone: 'gavel' },
    imparcial: { nome: 'Juiz Imparcial', descricao: 'Mantenha todas as métricas acima de 40 até o caso 5', check: () => state.casosJulgados >= 5 && state.apoioPopular > 40 && state.respeitoInstitucional > 40 && state.influenciaPolitica > 40 && state.relacaoImprensa > 40 && state.relacaoGoverno > 40 && state.relacaoONGs > 40, icone: 'balance-scale' },
    mao_ferro: { nome: 'Mão de Ferro', descricao: 'Condene em 5+ decisões', check: () => decisionHistory.filter(d => d.decisionText && d.decisionText.includes('Condenar')).length >= 5, icone: 'gavel' },
    defensor: { nome: 'Defensor do Povo', descricao: 'Absolva em 5+ decisões', check: () => decisionHistory.filter(d => d.decisionText && d.decisionText.includes('Absolver')).length >= 5, icone: 'hand-holding-heart' },
    popular: { nome: 'Herói Popular', descricao: 'ApoioPopular > 80', check: () => state.apoioPopular > 80, icone: 'users' },
    investigador: { nome: 'Investigador Incansável', descricao: 'Faça 10 investigações no total', check: () => decisionHistory.filter(d => d.decisionText && d.decisionText.includes('investigou')).length >= 10, icone: 'search' },
    crise: { nome: 'Sobrevivente de Crise', descricao: 'Passe por 3 crises', check: () => state.casosJulgados >= 9, icone: 'exclamation-triangle' },
    lenda: { nome: 'Lenda da Justiça', descricao: 'Complete todos os 10 casos com legado > 80', check: () => state.casosJulgados >= 10, icone: 'crown' },
    falido: { nome: 'Juiz Falido', descricao: 'Deixe o orçamento chegar a 0', check: () => state.orcamento <= 0, icone: 'money-bill-wave' }
};

const unlockedAchievements = JSON.parse(localStorage.getItem('tribunal_achievements') || '[]');

function checkAchievements() {
    let newUnlocks = [];
    for (const [id, ach] of Object.entries(achievements)) {
        if (!unlockedAchievements.includes(id) && ach.check()) {
            unlockedAchievements.push(id);
            newUnlocks.push(ach);
        }
    }
    if (newUnlocks.length > 0) {
        localStorage.setItem('tribunal_achievements', JSON.stringify(unlockedAchievements));
        newUnlocks.forEach(ach => {
            showNotification(`Achievement: ${ach.nome} - ${ach.descricao}`);
        });
    }
}

function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;
    container.innerHTML = '<h3><i class="fas fa-trophy"></i> Conquistas</h3>';
    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
    for (const [id, ach] of Object.entries(achievements)) {
        const unlocked = unlockedAchievements.includes(id);
        const div = document.createElement('div');
        div.style.cssText = `padding:8px 12px;border-radius:6px;font-size:12px;text-align:center;${unlocked ? 'background:#2a9d8f;color:#fff;' : 'background:#2d3748;color:#666;'}`;
        div.innerHTML = `<i class="fas fa-${ach.icone}"></i> ${unlocked ? ach.nome : '???'}`;
        div.title = ach.descricao;
        list.appendChild(div);
    }
    container.appendChild(list);
}

// === Relatório Pós-Caso ===
function showCaseReport(decision) {
    const reportDiv = document.getElementById('case-report');
    if (!reportDiv) return;
    const changes = [];
    for (const [k, v] of Object.entries(decision.efeitos || {})) {
        if (v !== 0) changes.push(`${k}: ${v > 0 ? '+' : ''}${v}`);
    }
    reportDiv.innerHTML = `
        <div class="case-report" style="background:#1e293b;padding:12px;border-radius:6px;margin:10px 0;border-left:4px solid #b89c5b;">
            <h4>Relatório do Julgamento</h4>
            <p><strong>Manchete:</strong> ${decision.manchete || 'Decisão tomada'}</p>
            <p><strong>Impactos:</strong> ${changes.join(', ') || 'Nenhum impacto direto'}</p>
            <p><strong>Casos julgados:</strong> ${state.casosJulgados}/10</p>
        </div>
    `;
}

// === Inicialização ===
// Função para alternar sessões
// Função endGame (ajustada para transição de sessão)
function endGame() {
    let finalText = '';
    let legacyScore = Math.round((state.apoioPopular + state.respeitoInstitucional + state.influenciaPolitica +
        state.relacaoImprensa + state.relacaoGoverno + state.relacaoONGs) / 6);
    let casesCompleted = state.casosJulgados;
    
    // Verificar dimensão final primeiro (ASI ou dimensional)
    const dimFinal = (typeof MotorDimensional !== 'undefined') ? MotorDimensional.getDimensaoFinal() : null;
    
    if (dimFinal && dimFinal.singularidade) {
        // Singularidade ASI já foi tratada em mostrarSingularidade, não duplicar
        return;
    }
    
    // Game over por métricas dimensionais
    const dim = MotorDimensional.metricas;
    if (dim.estabilidade < 15) {
        finalText = `${state.playerName}, a estabilidade do país colapsou. A guerra civil engoliu Nova Aurora.`;
    } else if (dim.orcamento <= 0) {
        finalText = `${state.playerName}, o Estado faliu. Sem orçamento, Nova Aurora decretou falência soberana.`;
    } else if (state.orcamento <= 0) {
        finalText = `${state.playerName}, o tribunal faliu! Sem recursos, você foi destituído do cargo.`;
    } else if (state.apoioPopular <= 0) {
        finalText = `${state.playerName}, a fúria do povo selou seu destino. Multidões invadiram o tribunal.`;
    } else if (state.respeitoInstitucional <= 0) {
        finalText = `${state.playerName}, as instituições voltaram-se contra você. O Supremo foi dissolvido.`;
    } else if (state.influenciaPolitica <= 0) {
        finalText = `${state.playerName}, as elites isolaram você. Seu tribunal foi extinto.`;
    } else if (state.relacaoImprensa <= 0) {
        finalText = `${state.playerName}, a imprensa destruiu sua reputação. Escândalos forçaram seu afastamento.`;
    } else if (state.relacaoGoverno <= 0) {
        finalText = `${state.playerName}, o governo conspirou contra você. O Congresso dissolveu seu tribunal.`;
    } else if (state.relacaoONGs <= 0) {
        finalText = `${state.playerName}, ONGs denunciaram suas decisões. Você renunciou.`;
    } else {
        finalText = `${state.playerName}, sua trajetória foi controversa. Seu legado divide opiniões após ${casesCompleted} casos.`;
    }
    
    checkAchievements();
    const achList = unlockedAchievements.map(id => achievements[id]).filter(Boolean);
    const achText = achList.length > 0
        ? '<br><br><strong>Conquistas:</strong><br>' + achList.map(a => `&#9733; ${a.nome}`).join('<br>')
        : '';

    finalText += `<br><br><strong>Resumo:</strong><br>
        Casos Julgados: ${casesCompleted}/${casos.length}<br>
        Orçamento Restante: ${state.orcamento}<br>
        Média de Reputação: ${Math.round(legacyScore)}${achText}`;
    
    // Dimensão Final Quântica
    if (typeof MotorDimensional !== 'undefined') {
        MotorDimensional.carregarEstado();
        const dimFinal = MotorDimensional.getDimensaoFinal();
        const dimBox = document.getElementById('dimensao-final');
        if (dimBox) {
            const ngIcon = dimFinal.newGamePlus ? '<br><small>&#9733; New Game+ Desbloqueado</small>' : '';
            dimBox.innerHTML = `
                <div class="dimensao-card" style="border:2px solid ${dimFinal.cor};background:${dimFinal.cor}22;padding:16px;border-radius:8px;text-align:center;">
                    <h3 style="color:${dimFinal.cor};font-size:1.4em;">${dimFinal.nome}</h3>
                    <i class="fas fa-${dimFinal.icone}" style="font-size:2em;color:${dimFinal.cor};"></i>
                    <p style="color:#ccc;margin-top:8px;">${dimFinal.descricao.split('\n').join('<br>')}</p>
                    ${ngIcon}
                </div>
            `;
        }
        
        // Ativar New Game+ se aplicável
        if (dimFinal.newGamePlus) {
            localStorage.setItem('tribunal_ng_ready', 'true');
            MotorDimensional.ativarNG();
            MotorDimensional.salvarEstado();
        }
        
        // Verificar achievements quânticos
        const novasAch = AchievementsQuanticos.verificar(MotorDimensional.metricas, MotorDimensional.tags);
        novasAch.forEach(ach => {
            showNotification(`&#9733; Achievement Quântico: ${ach.nome} - ${ach.desc}`);
        });
        if (novasAch.length > 0) {
            finalText += '<br><br><strong>Conquistas Quânticas:</strong><br>' +
                novasAch.map(a => `&#9733; ${a.nome}`).join('<br>');
        }
    }
    
    const endName = document.getElementById('endName');
    const endDescription = document.getElementById('end-description');
    if (endName && endDescription) {
        endName.textContent = state.playerName;
        endDescription.innerHTML = finalText;
    } else {
        console.warn('Elementos endName ou endDescription não encontrados');
    }
    
    transitionScreen('end-screen', 'case-screen');
}


// Funções de Diplomacia (Sessão 1)
function handleDiplomacyImprensa() {
  try {
    const custos = { fácil: -500, médio: -1000, difícil: -1500 };
    const custo = custos[state.dificuldade] ?? -1000;
    applyEffects({
      relacaoImprensa: 15,
      orcamento: custo
    });
    showNotification(`Negociação com a imprensa bem-sucedida! Relação +15, Orçamento -R$${Math.abs(custo * 10)}.`);
    proceedAfterLocalDiplomacy();
  } catch (error) {
    console.error('Erro em handleDiplomacyImprensa:', error);
    showNotification('Erro ao negociar com a imprensa.');
  }
}

function handleDiplomacyGoverno() {
  try {
    applyEffects({
      relacaoGoverno: 10,
      relacaoImprensa: -5,
      orcamento: -10 // R$ 100
    });
    showNotification('Negociação com o governo concluída! Relação +10, Orçamento -R$100.');
    proceedAfterLocalDiplomacy();
  } catch (error) {
    console.error('Erro em handleDiplomacyGoverno:', error);
    showNotification('Erro ao negociar com o governo.');
  }
}

function handleDiplomacyONGs() {
  try {
    applyEffects({
      relacaoONGs: 10,
      relacaoGoverno: -5,
      orcamento: -5 // R$ 50
    });
    showNotification('Apoio das ONGs garantido! Relação +10, Orçamento -R$50.');
    proceedAfterLocalDiplomacy();
  } catch (error) {
    console.error('Erro em handleDiplomacyONGs:', error);
    showNotification('Erro ao negociar com ONGs.');
  }
}

function proceedAfterLocalDiplomacy() {
  transitionScreen('case-screen', 'diplomacy-screen');
  loadCase(); // Carrega o próximo caso
}

// Função auxiliar para aplicar efeitos (assumida como existente, mas incluída para clareza)
function applyEffects(effects) {
  // Escudo Fiscal ativo?
  const escudoAtivo = window._escudoFiscalAtivo;
  if (escudoAtivo) window._escudoFiscalAtivo = false;

  // Âncora de Ordem ativa?
  const ancoraAtiva = window._ancoraOrdemAtiva;
  if (ancoraAtiva) window._ancoraOrdemAtiva = false;

  for (const [key, value] of Object.entries(effects)) {
    let valorFinal = value;
    
    // Escudo Fiscal: reduz 50% de perda de orçamento
    if (escudoAtivo && key === 'orcamento' && value < 0) {
      valorFinal = Math.round(value * 0.5);
      showNotification('🛡️ Escudo Fiscal: perda de orçamento reduzida pela metade!');
    }
    
    // Âncora de Ordem: congela perda de EST ou ETI
    if (ancoraAtiva && (key === 'estabilidade' || key === 'etica') && value < 0) {
      valorFinal = 0;
      showNotification(`⛓️ Âncora de Ordem: perda de ${key} congelada!`);
    }
    
    const metricElement = document.getElementById(key);
    if (metricElement) {
      if (valorFinal > 0) {
        metricElement.classList.add('metric-increase');
        setTimeout(() => metricElement.classList.remove('metric-increase'), 1000);
      } else if (valorFinal < 0) {
        metricElement.classList.add('metric-decrease');
        setTimeout(() => metricElement.classList.remove('metric-decrease'), 1000);
      }
      metricElement.textContent = Math.max(0, Number(metricElement.textContent) + valorFinal);
    }
    if (key === 'orcamento') state.orcamento = Math.max(0, state.orcamento + valorFinal);
    if (key === 'apoioPopular') state.apoioPopular = Math.max(0, Math.min(100, state.apoioPopular + valorFinal));
    if (key === 'respeitoInstitucional') state.respeitoInstitucional = Math.max(0, Math.min(100, state.respeitoInstitucional + valorFinal));
    if (key === 'influenciaPolitica') state.influenciaPolitica = Math.max(0, Math.min(100, state.influenciaPolitica + valorFinal));
    if (key === 'relacaoImprensa') state.relacaoImprensa = Math.max(0, Math.min(100, state.relacaoImprensa + valorFinal));
    if (key === 'relacaoGoverno') state.relacaoGoverno = Math.max(0, Math.min(100, state.relacaoGoverno + valorFinal));
    if (key === 'relacaoONGs') state.relacaoONGs = Math.max(0, Math.min(100, state.relacaoONGs + valorFinal));
    
    const progressBar = document.getElementById(`${key}Bar`);
    if (progressBar) {
      progressBar.value = state[key] || Number(metricElement.textContent);
    }
  }
}

// === Painel Dimensional ===
function atualizarPainelDimensional() {
    const m = MotorDimensional.metricas;
    const ids = ['estabilidade', 'etica', 'apoio', 'orcamento', 'diplomacia', 'legado'];
    ids.forEach(id => {
        const span = document.getElementById('dim' + id.charAt(0).toUpperCase() + id.slice(1));
        const bar = document.getElementById('dim' + id.charAt(0).toUpperCase() + id.slice(1) + 'Bar');
        if (span) span.textContent = m[id] || 0;
        if (bar) bar.value = m[id] || 0;
    });
    // v4.0 — Painel geopolítico
    if (typeof renderizarGeopolitica === 'function') renderizarGeopolitica();
}

function renderizarTags() {
    const container = document.getElementById('tags-display');
    if (!container) return;
    const tags = MotorDimensional.tags;
    if (tags.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = '<h4 style="margin-top:8px;font-size:12px;color:#888;"><i class="fas fa-tags"></i> Tags Dimensionais</h4><div style="display:flex;flex-wrap:wrap;gap:4px;">' +
        tags.map(t => `<span style="background:#2a2a4a;color:#aaa;padding:2px 8px;border-radius:12px;font-size:10px;border:1px solid #444;">${t}</span>`).join('') + '</div>';
}

// === Skills Screen ===
function abrirSkills() {
    transitionScreen('skills-screen', 'case-screen');
    renderizarSkills();
}

function renderizarSkills() {
    Skills.carregar();
    document.getElementById('skillPoints').textContent = Skills.pontosDisponiveis;
    const container = document.getElementById('skills-trees');
    if (!container) return;
    container.innerHTML = '';
    for (const [dimKey, dim] of Object.entries(Skills.dados)) {
        const col = document.createElement('div');
        col.className = 'skill-column';
        col.innerHTML = `<h4 style="color:#ffcc00;"><i class="fas fa-${dim.icone}"></i> ${dim.nome}</h4>`;
        dim.habilidades.forEach(hab => {
            const pode = Skills.podeComprar(hab);
            const custo = Skills.getCusto(hab);
            const completo = hab.nivel >= hab.max;
            const div = document.createElement('div');
            div.style.cssText = `background:#1a1a2e;border:1px solid ${completo ? '#2a9d8f' : '#333'};border-radius:6px;padding:8px;margin:6px 0;`;
            div.innerHTML = `
                <strong style="color:#fff;font-size:13px;">${hab.nome}</strong>
                <div style="margin:4px 0;">
                    ${'<span style="color:#2a9d8f;">&#9679;</span>'.repeat(hab.nivel)}${'<span style="color:#444;">&#9679;</span>'.repeat(Math.max(0, hab.max - hab.nivel))}
                </div>
                <small style="color:#999;">${hab.desc}</small><br>
                <small style="color:#666;">Nível ${hab.nivel}/${hab.max} | Custo: ${custo} pts</small><br>
                ${completo ? '<small style="color:#2a9d8f;">MÁXIMO</small>' :
                `<button class="skill-buy-btn" data-dim="${dimKey}" data-hab="${hab.id}" ${pode ? '' : 'disabled'} style="margin-top:4px;padding:3px 10px;background:${pode ? '#2a9d8f' : '#444'};color:#fff;border:none;border-radius:4px;cursor:${pode ? 'pointer' : 'not-allowed'};font-size:11px;">${pode ? 'Comprar' : 'Bloqueado'}</button>`}
            `;
            col.appendChild(div);
        });
        container.appendChild(col);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('skill-buy-btn')) {
        const dim = e.target.dataset.dim;
        const hab = e.target.dataset.hab;
        if (Skills.comprar(dim, hab)) {
            showNotification('Skill adquirida!');
            renderizarSkills();
        } else {
            showNotification('Pontos insuficientes');
        }
    }
});

// Inicialização de eventos (Sessão 1)
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Carregar casos do Edge Config (assíncrono, não bloqueia)
    initEdgeConfigCasos();
    
    // Inicializar Agentes ASI da Singularidade
    if (typeof AgentesASI !== 'undefined') {
        AgentesASI.inicializar();
        console.log('🧠 Agentes ASI da Singularidade inicializados');
    }
    
    // Botão de início
    const startButton = document.getElementById('startButton');
    if (!startButton) throw new Error('Botão startButton não encontrado');
    startButton.addEventListener('click', startGame);
    
    // Enter key no campo de nome
    const nameInput = document.getElementById('playerName');
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startGame();
      });
    }
    
    // Botões de dificuldade
    const difficultyButtons = {
      'difficultyEasy': 'easy',
      'difficultyMedium': 'medium',
      'difficultyHard': 'hard'
    };
    Object.keys(difficultyButtons).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (!button) console.warn(`Botão ${buttonId} não encontrado`);
      else button.addEventListener('click', () => setDifficulty(difficultyButtons[buttonId]));
    });
    
    // Opções de investigação
    const investigationOptions = document.getElementById('investigation-options');
    if (investigationOptions) {
      investigationOptions.addEventListener('click', (e) => {
        const index = e.target.dataset.investigation;
        if (index !== undefined) investigate(Number(index));
      });
    } else {
      console.warn('Elemento investigation-options não encontrado');
    }
    
    // Opções de decisão
    const decisionOptions = document.getElementById('decision-options');
    if (decisionOptions) {
      decisionOptions.addEventListener('click', (e) => {
        const index = e.target.dataset.decision;
        if (index !== undefined) makeDecision(Number(index));
      });
    } else {
      console.warn('Elemento decision-options não encontrado');
    }

    // Manipulador de crise (botões no media-reactions)
    const mediaReactions = document.getElementById('media-reactions');
    if (mediaReactions) {
      mediaReactions.addEventListener('click', (e) => {
        const crisisIndex = e.target.dataset.crisis;
        if (crisisIndex !== undefined) {
          const crisis = eventosCrise[0]; // sempre usa a crise atual
          const opcao = crisis.opcoes[Number(crisisIndex)];
          if (opcao) {
            applyEffects(opcao.efeitos);
            showNotification(`Resultado: ${opcao.resultado}`);
            updateReputation();
            transitionScreen('diplomacy-screen', 'media-screen');
          }
        }
      });
    }
    
    // Botão de visualizar mídia
    const viewMediaButton = document.getElementById('viewMediaButton');
    if (viewMediaButton) {
      viewMediaButton.addEventListener('click', viewMedia);
    } else {
      console.warn('Botão viewMediaButton não encontrado');
    }
    
    // Botão de continuar (mídia para diplomacia local)
    const continueButton = document.getElementById('continueButton');
    if (continueButton) {
      continueButton.addEventListener('click', () => {
        console.log('Continue button clicked, transitioning to diplomacy-screen');
        transitionScreen('diplomacy-screen', 'media-screen');
      });
    } else {
      console.warn('Botão continueButton não encontrado');
    }
    
    // Botões de diplomacia (nível inicial)
    const diplomacyButtons = {
      'diplomacy-imprensa': handleDiplomacyImprensa,
      'diplomacy-governo': handleDiplomacyGoverno,
      'diplomacy-ongs': handleDiplomacyONGs,
      'skip-diplomacy': skipDiplomacy
    };
    Object.keys(diplomacyButtons).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (!button) {
        console.warn(`Botão ${buttonId} não encontrado`);
      } else {
        button.addEventListener('click', () => {
          console.log(`Botão ${buttonId} clicado`);
          diplomacyButtons[buttonId]();
        });
      }
    });
    
    // Botão de reinício
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.addEventListener('click', () => restartGame());
    } else {
      console.warn('Botão restartButton não encontrado');
    }
    
    // Botões Save/Load
    const saveBtn = document.getElementById('saveGameBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveGame);
    const loadBtn = document.getElementById('loadGameBtn');
    if (loadBtn) loadBtn.addEventListener('click', loadGame);
    
    // Botão Skills
    const skillsBtn = document.getElementById('skillsBtn');
    if (skillsBtn) skillsBtn.addEventListener('click', abrirSkills);
    
    // Botão Voltar Skills
    const skillsBackBtn = document.getElementById('skillsBackBtn');
    if (skillsBackBtn) skillsBackBtn.addEventListener('click', () => transitionScreen('case-screen', 'skills-screen'));
    
    // Transição Orbital - Continuar
    const transitionBtn = document.getElementById('transitionContinueBtn');
    if (transitionBtn) {
      transitionBtn.addEventListener('click', () => {
        if (window._pendingCrisis) {
          resolverCriseTensor(window._pendingCrisis);
        } else {
          transitionScreen('case-screen', 'transition-screen');
          loadCase();
          atualizarPainelDimensional();
          renderizarTags();
        }
      });
    }
    
    // Crise Tensorial - Escolha
    const crisisOpts = document.getElementById('crisis-tensor-options');
    if (crisisOpts) {
      crisisOpts.addEventListener('click', (e) => {
        const btn = e.target.closest('.crisis-opt-btn');
        if (btn) aplicarCriseTensor(Number(btn.dataset.idx));
      });
    }
    
    // Crise clássica - Escolha (delegated)
    document.addEventListener('click', (e) => {
      const crisisBtn = e.target.closest('[data-crisis]');
      if (crisisBtn) {
        const idx = Number(crisisBtn.dataset.crisis);
        const crisisIdx = window._currentCrisisIndex || 0;
        const crisis = eventosCrise[crisisIdx];
        if (crisis && crisis.opcoes[idx]) {
          applyEffects(crisis.opcoes[idx].efeitos);
          showNotification(`Resultado: ${crisis.opcoes[idx].resultado}`);
          updateReputation();
          transitionScreen('media-screen', 'case-screen');
        }
      }
    });

    // Singularidade - Reiniciar
    const singRestart = document.getElementById('singularityRestartBtn');
    if (singRestart) singRestart.addEventListener('click', () => window.location.reload());
    
    // Fase 0 - Carreira (delegated)
    document.addEventListener('click', (e) => {
      const careerBtn = e.target.closest('.career-btn');
      if (careerBtn) escolherCarreira(careerBtn.dataset.career);
      const profileBtn = e.target.closest('.profile-btn');
      if (profileBtn) escolherPerfil(profileBtn.dataset.profile);
    });
    
    // Fase 0 - Skill de Carreira
    const skillBtn = document.getElementById('career-skill-btn');
    if (skillBtn) skillBtn.addEventListener('click', usarSkillCarreira);
    
    // Render achievements ao carregar
    renderAchievements();
    
    // Auto-save ao fazer uma decisão (via makeDecision)
    // Atualiza display de pontos de skill
    if (typeof atualizarSkillPointsDisplay === 'function') atualizarSkillPointsDisplay();
    
  } catch (error) {
    console.error('Erro ao inicializar eventos da Sessão 1:', error);
    showNotification(`Falha ao carregar o jogo: ${error.message}. Tente recarregar a página.`);
  }
});