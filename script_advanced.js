// === Estado Avançado ===
const stateAdvanced = {
    verba: 1000, // Verba para projetos nacionais
    armas: 100, // Arsenal militar
    soldados: 1000, // Número de tropas
    crescimento: 50, // Crescimento econômico (0-100)
    defesa: 50, // Defesa nacional (0-100)
    riqueza: 0, // Riqueza pessoal do jogador
    influenciaGlobal: 50, // Influência global (0-100)
    apoioPopular: 50, // Apoio popular (0-100)
    relacaoImprensa: 50, // Relação com a imprensa (0-100)
    relacaoONGs: 50, // Relação com ONGs (0-100)
    projetosJulgados: 0,
    currentAdvancedCase: null,
    modo: null // 'projects' ou 'leader'
};

// === Casos Estratégicos (Projetos Nacionais) ===
const casosEstrategicos = [
    {
        id: "estrategico_01",
        titulo: "Projeto Estrela: Satélite de Defesa",
        descricao: `Brasília, 1º de janeiro de 2026 – O Ministério da Defesa propõe o Projeto Estrela, um satélite de vigilância para monitorar ameaças externas. ONGs alertam sobre violações de privacidade, enquanto potências estrangeiras ameaçam sanções. Aprovar o projeto pode fortalecer a defesa, mas escalar tensões globais.`,
        imagem: "assets/images/estrategico_01_satelite.jpg",
        detalhes: [
            `Custo estimado: 500 unidades de verba.`,
            `Benefício: Aumenta defesa nacional em 20 pontos.`,
            `Risco: Sanções internacionais podem reduzir crescimento e influência global.`
        ],
        internacional: true,
        tipo: "militar",
        opcoes: [
            {
                texto: "Aprovar o Projeto Estrela",
                efeitos: { verba: -500, defesa: 20, crescimento: -15, apoioPopular: -10, relacaoONGs: -15, influenciaGlobal: -10 },
                resultado: "O satélite é lançado, fortalecendo a defesa, mas sanções reduzem o comércio. ONGs e países pacifistas protestam.",
                recompensa: { riqueza: 50000, verba: 200 }
            },
            {
                texto: "Rejeitar o projeto e priorizar diplomacia",
                efeitos: { crescimento: 10, relacaoONGs: 10, defesa: -10, influenciaGlobal: 5 },
                resultado: "A rejeição evita tensões, mas deixa o país vulnerável. Países ambientalistas elogiam.",
                recompensa: { riqueza: 20000 }
            },
            {
                texto: "Aprovar com restrições de privacidade",
                efeitos: { verba: -300, defesa: 10, relacaoONGs: 5, influenciaGlobal: 5 },
                resultado: "O projeto avança com limitações, equilibrando defesa e privacidade. A mídia global elogia o meio-termo.",
                recompensa: { riqueza: 30000, verba: 100, defesa: 5 }
            }
        ]
    },
    {
        id: "estrategico_02",
        titulo: "Expansão da Força Armada",
        descricao: `São Paulo, 15 de março de 2026 – O Exército propõe recrutar 5000 novos soldados e adquirir 100 tanques para modernizar as forças armadas. O custo é alto, e a imprensa questiona a necessidade em tempos de paz. Aprovar pode fortalecer a defesa, mas alarmar nações vizinhas.`,
        imagem: "assets/images/estrategico_02_tanques.jpg",
        detalhes: [
            `Custo: 600 unidades de verba.`,
            `Benefício: Aumenta soldados em 5000 e armas em 100.`,
            `Risco: Pode reduzir influência global e apoio popular.`
        ],
        internacional: true,
        tipo: "militar",
        opcoes: [
            {
                texto: "Aprovar a expansão total",
                efeitos: { verba: -600, soldados: 5000, armas: 100, apoioPopular: -15, relacaoImprensa: -10, influenciaGlobal: -15 },
                resultado: "A força armada cresce, mas protestos acusam militarização. Nações pacifistas condenam.",
                recompensa: { riqueza: 60000, armas: 50 }
            },
            {
                texto: "Rejeitar a expansão",
                efeitos: { verba: 200, apoioPopular: 10, relacaoImprensa: 10, defesa: -15, influenciaGlobal: 10 },
                resultado: "A rejeição economiza verba e acalma vizinhos, mas enfraquece a defesa. A imprensa elogia a paz.",
                recompensa: { riqueza: 25000 }
            },
            {
                texto: "Aprovar metade do projeto",
                efeitos: { verba: -300, soldados: 2500, armas: 50, apoioPopular: -5, influenciaGlobal: -5 },
                resultado: "A expansão parcial equilibra defesa e diplomacia, mas não satisfaz plenamente o Exército.",
                recompensa: { riqueza: 35000, soldados: 1000 }
            }
        ]
    },
    {
        id: "estrategico_03",
        titulo: "Revolução Verde: Energia Renovável",
        descricao: `Rio de Janeiro, 10 de junho de 2026 – Um consórcio propõe a construção de 50 usinas solares e eólicas para tornar o país líder em energia limpa. O custo é elevado, e fazendeiros temem perda de terras. Aprovar pode atrair apoio de nações ambientalistas.`,
        imagem: "assets/images/estrategico_03_solar.jpg",
        detalhes: [
            `Custo: 700 unidades de verba.`,
            `Benefício: Aumenta crescimento econômico em 25 pontos e influência global.`,
            `Risco: Conflitos com fazendeiros podem reduzir apoio popular.`
        ],
        internacional: true,
        tipo: "ambiental",
        opcoes: [
            {
                texto: "Aprovar o projeto integral",
                efeitos: { verba: -700, crescimento: 25, apoioPopular: -15, relacaoONGs: 20, influenciaGlobal: 15 },
                resultado: "As usinas transformam o país em líder verde, mas fazendeiros protestam. Países ambientalistas aplaudem.",
                recompensa: { riqueza: 70000, verba: 300 }
            },
            {
                texto: "Rejeitar o projeto",
                efeitos: { verba: 300, apoioPopular: 10, crescimento: -10, influenciaGlobal: -10 },
                resultado: "A rejeição agrada fazendeiros, mas prejudica o crescimento. Nações verdes criticam.",
                recompensa: { riqueza: 20000 }
            },
            {
                texto: "Aprovar com compensação aos fazendeiros",
                efeitos: { verba: -800, crescimento: 20, apoioPopular: 5, relacaoONGs: 10, influenciaGlobal: 10 },
                resultado: "O projeto avança com compensações, ganhando apoio global. O crescimento é sólido.",
                recompensa: { riqueza: 40000, verba: 200, crescimento: 5 }
            }
        ]
    },
    {
        id: "estrategico_04",
        titulo: "Aliança Global: Pacto de Defesa",
        descricao: `Brasília, 20 de setembro de 2026 – Uma aliança militar internacional oferece um pacto de defesa, exigindo envio de 2000 soldados e 50 armas. A imprensa alerta sobre perda de soberania, mas o pacto pode fortalecer a posição global do país.`,
        imagem: "assets/images/estrategico_04_alianca.jpg",
        detalhes: [
            `Custo: 2000 soldados e 50 armas.`,
            `Benefício: Aumenta defesa em 30 pontos e influência global em 15.`,
            `Risco: Pode desencadear tensões com nações rivais.`
        ],
        internacional: true,
        tipo: "militar",
        opcoes: [
            {
                texto: "Aderir ao pacto",
                efeitos: { soldados: -2000, armas: -50, defesa: 30, crescimento: 10, relacaoImprensa: -15, influenciaGlobal: 15 },
                resultado: "O pacto fortalece a defesa e a influência global, mas a mídia acusa perda de soberania.",
                recompensa: { riqueza: 80000, defesa: 10 }
            },
            {
                texto: "Rejeitar o pacto",
                efeitos: { relacaoImprensa: 15, apoioPopular: 10, defesa: -20, influenciaGlobal: -10 },
                resultado: "A rejeição preserva a soberania, mas enfraquece a defesa. Nações aliadas se decepcionam.",
                recompensa: { riqueza: 30000 }
            },
            {
                texto: "Negociar termos limitados",
                efeitos: { soldados: -1000, armas: -25, defesa: 15, relacaoImprensa: -5, influenciaGlobal: 5 },
                resultado: "O pacto limitado equilibra defesa e soberania, mas não agrada totalmente os aliados.",
                recompensa: { riqueza: 45000, defesa: 5 }
            }
        ]
    },
    {
        id: "estrategico_05",
        titulo: "Corrida Espacial: Base Lunar",
        descricao: `São José dos Campos, 15 de dezembro de 2026 – A Agência Espacial propõe uma base lunar para pesquisa e mineração, posicionando o país como potência tecnológica. O custo é astronômico, e ONGs temem impactos ambientais na Terra. Sucesso pode atrair aliados globais.`,
        imagem: "assets/images/estrategico_05_lunar.jpg",
        detalhes: [
            `Custo: 1000 unidades de verba.`,
            `Benefício: Aumenta crescimento em 30 pontos, defesa em 20 e influência global.`,
            `Risco: Falha pode desencadear crise econômica e tensões globais.`
        ],
        internacional: true,
        tipo: "economico",
        opcoes: [
            {
                texto: "Aprovar a base lunar",
                efeitos: { verba: -1000, crescimento: 30, defesa: 20, apoioPopular: -20, relacaoONGs: -20, influenciaGlobal: 20 },
                resultado: "A base lunar é um marco, mas protestos ambientais crescem. Potências tecnológicas celebram.",
                recompensa: { riqueza: 100000, verba: 500, crescimento: 10 }
            },
            {
                texto: "Rejeitar a base lunar",
                efeitos: { verba: 500, apoioPopular: 15, relacaoONGs: 15, crescimento: -15, influenciaGlobal: -15 },
                resultado: "A rejeição evita riscos, mas atrasa o progresso. Nações tecnológicas criticam.",
                recompensa: { riqueza: 35000 }
            },
            {
                texto: "Aprovar com foco em sustentabilidade",
                efeitos: { verba: -1200, crescimento: 25, defesa: 15, apoioPopular: -5, relacaoONGs: 5, influenciaGlobal: 10 },
                resultado: "A base avança com medidas verdes, ganhando apoio global, mas custa mais.",
                recompensa: { riqueza: 60000, verba: 300, defesa: 5 }
            }
        ]
    },
    {
        id: "estrategico_06",
        titulo: "Acordo Comercial Pan-Global",
        descricao: `Brasília, 1º de março de 2027 – Um bloco econômico global propõe um acordo comercial que abriria mercados, mas exige redução de tarifas protecionistas. Sindicatos locais temem perda de empregos, enquanto nações parceiras pressionam pela adesão.`,
        imagem: "assets/images/estrategico_06_comercio.jpg",
        detalhes: [
            `Custo: 400 unidades de verba para implementação.`,
            `Benefício: Aumenta crescimento em 25 pontos e influência global em 20.`,
            `Risco: Pode reduzir apoio popular devido a protestos trabalhistas.`
        ],
        internacional: true,
        tipo: "economico",
        opcoes: [
            {
                texto: "Aderir ao acordo",
                efeitos: { verba: -400, crescimento: 25, influenciaGlobal: 20, apoioPopular: -15, relacaoImprensa: 10 },
                resultado: "O acordo impulsiona a economia, mas sindicatos protestam. Parceiros comerciais celebram.",
                recompensa: { riqueza: 75000, verba: 300 }
            },
            {
                texto: "Rejeitar o acordo",
                efeitos: { apoioPopular: 15, crescimento: -15, influenciaGlobal: -15, relacaoImprensa: -10 },
                resultado: "A rejeição protege trabalhadores, mas isola o país economicamente. Parceiros se afastam.",
                recompensa: { riqueza: 25000 }
            },
            {
                texto: "Negociar termos protecionistas",
                efeitos: { verba: -200, crescimento: 15, influenciaGlobal: 10, apoioPopular: 5 },
                resultado: "O acordo limitado equilibra economia e proteção local, mas não maximiza ganhos globais.",
                recompensa: { riqueza: 40000, crescimento: 5 }
            }
        ]
    },
    {
        id: "estrategico_07",
        titulo: "Missão de Paz Internacional",
        descricao: `Nova York, 15 de julho de 2027 – A ONU solicita que o país lidere uma missão de paz em uma região em conflito, enviando 3000 soldados. A missão pode elevar a influência global, mas expõe tropas a riscos e custa verba.`,
        imagem: "assets/images/estrategico_07_paz.jpg",
        detalhes: [
            `Custo: 500 unidades de verba e 3000 soldados.`,
            `Benefício: Aumenta influência global em 25 e defesa em 10.`,
            `Risco: Perdas de soldados podem reduzir apoio popular.`
        ],
        internacional: true,
        tipo: "militar",
        opcoes: [
            {
                texto: "Liderar a missão",
                efeitos: { verba: -500, soldados: -3000, influenciaGlobal: 25, defesa: 10, apoioPopular: -15 },
                resultado: "A missão eleva o prestígio global, mas perdas geram luto nacional.",
                recompensa: { riqueza: 70000, influenciaGlobal: 10 }
            },
            {
                texto: "Recusar a missão",
                efeitos: { apoioPopular: 10, influenciaGlobal: -20, defesa: -10 },
                resultado: "A recusa evita perdas, mas prejudica a reputação global. A ONU critica.",
                recompensa: { riqueza: 30000 }
            },
            {
                texto: "Enviar apoio logístico",
                efeitos: { verba: -300, soldados: -1000, influenciaGlobal: 15, defesa: 5, apoioPopular: -5 },
                resultado: "O apoio limitado mantém prestígio com menos riscos, mas não lidera a missão.",
                recompensa: { riqueza: 45000, influenciaGlobal: 5 }
            }
        ]
    }
];

// === Casos Líder Nacional ===
const casosLider = [
    {
        id: "lider_01",
        titulo: "Reforma Educacional Nacional",
        descricao: `Brasília, 1º de fevereiro de 2026 – Como Líder Nacional, você propõe uma reforma educacional para universalizar o ensino de qualidade. Professores exigem mais verbas, enquanto o setor privado teme aumento de impostos. Aprovar pode atrair apoio de nações educacionais.`,
        imagem: "assets/images/lider_01_educacao.jpg",
        detalhes: [
            `Custo estimado: 600 unidades de verba.`,
            `Benefício: Aumenta crescimento econômico em 20 pontos e influência global.`,
            `Risco: Impostos podem reduzir apoio popular.`
        ],
        internacional: true,
        tipo: "economico",
        opcoes: [
            {
                texto: "Aprovar a reforma com investimento total",
                efeitos: { verba: -600, crescimento: 20, apoioPopular: -10, relacaoImprensa: 10, influenciaGlobal: 15 },
                resultado: "A reforma eleva a educação, mas impostos geram protestos. Nações educacionais elogiam.",
                recompensa: { riqueza: 50000, verba: 200 }
            },
            {
                texto: "Rejeitar a reforma",
                efeitos: { verba: 200, apoioPopular: 10, crescimento: -15, influenciaGlobal: -10 },
                resultado: "A rejeição evita impostos, mas prejudica a educação. Nações criticam.",
                recompensa: { riqueza: 20000 }
            },
            {
                texto: "Aprovar com parcerias privadas",
                efeitos: { verba: -400, crescimento: 15, relacaoImprensa: -5, influenciaGlobal: 5 },
                resultado: "A reforma avança com apoio privado, mas a imprensa questiona a privatização.",
                recompensa: { riqueza: 35000, crescimento: 5 }
            }
        ]
    },
    {
        id: "lider_02",
        titulo: "Megaprojeto de Infraestrutura",
        descricao: `São Paulo, 15 de maio de 2026 – Um plano para construir rodovias e ferrovias promete conectar o país, mas o custo é elevado e ONGs alertam sobre desmatamento. Aprovar pode atrair investimentos estrangeiros, mas tensionar relações ambientais.`,
        imagem: "assets/images/lider_02_infraestrutura.jpg",
        detalhes: [
            `Custo: 700 unidades de verba.`,
            `Benefício: Aumenta crescimento em 25 pontos e influência global.`,
            `Risco: Impactos ambientais podem reduzir apoio de ONGs e nações verdes.`
        ],
        internacional: true,
        tipo: "economico",
        opcoes: [
            {
                texto: "Aprovar o megaprojeto",
                efeitos: { verba: -700, crescimento: 25, relacaoONGs: -20, apoioPopular: 10, influenciaGlobal: 15 },
                resultado: "As obras transformam o país, mas ONGs denunciam desmatamento. Investidores globais celebram.",
                recompensa: { riqueza: 60000, verba: 300 }
            },
            {
                texto: "Rejeitar o projeto",
                efeitos: { verba: 300, relacaoONGs: 15, crescimento: -10, influenciaGlobal: -10 },
                resultado: "A rejeição protege o meio ambiente, mas atrasa o desenvolvimento. Nações verdes aplaudem.",
                recompensa: { riqueza: 25000 }
            },
            {
                texto: "Aprovar com medidas ambientais",
                efeitos: { verba: -800, crescimento: 20, relacaoONGs: 5, apoioPopular: 5, influenciaGlobal: 10 },
                resultado: "O projeto avança com sustentabilidade, ganhando apoio global, mas custa mais.",
                recompensa: { riqueza: 40000, verba: 200, crescimento: 5 }
            }
        ]
    },
    {
        id: "lider_03",
        titulo: "Cúpula Diplomática Global",
        descricao: `Rio de Janeiro, 10 de agosto de 2026 – Você organiza uma cúpula para negociar acordos comerciais e de paz. Potências exigem concessões militares, enquanto a imprensa teme perda de soberania. Sucesso pode elevar defesa e influência global.`,
        imagem: "assets/images/lider_03_diplomacia.jpg",
        detalhes: [
            `Custo: 500 unidades de verba e 1000 soldados.`,
            `Benefício: Aumenta crescimento em 20, defesa em 15 e influência global.`,
            `Risco: Concessões podem reduzir apoio popular.`
        ],
        internacional: true,
        tipo: "militar",
        opcoes: [
            {
                texto: "Assinar os acordos",
                efeitos: { verba: -500, soldados: -1000, crescimento: 20, defesa: 15, apoioPopular: -15, influenciaGlobal: 20 },
                resultado: "Os acordos fortalecem o país, mas protestos acusam perda de soberania. Aliados celebram.",
                recompensa: { riqueza: 70000, defesa: 10 }
            },
            {
                texto: "Rejeitar os acordos",
                efeitos: { apoioPopular: 15, relacaoImprensa: 10, crescimento: -15, defesa: -10, influenciaGlobal: -15 },
                resultado: "A rejeição preserva a soberania, mas isola o país. A imprensa elogia a independência.",
                recompensa: { riqueza: 30000 }
            },
            {
                texto: "Negociar termos equilibrados",
                efeitos: { verba: -300, soldados: -500, crescimento: 15, defesa: 10, apoioPopular: -5, influenciaGlobal: 10 },
                resultado: "Acordos limitados equilibram ganhos e soberania, mas não agradam todos.",
                recompensa: { riqueza: 45000, crescimento: 5 }
            }
        ]
    }
];

// === Funções Auxiliares ===
function applyAdvancedEffects(effects) {
    for (const [key, value] of Object.entries(effects)) {
        const metricElement = document.getElementById(key);
        if (metricElement) {
            if (value > 0) {
                metricElement.classList.add('metric-increase');
                setTimeout(() => metricElement.classList.remove('metric-increase'), 1000);
            } else if (value < 0) {
                metricElement.classList.add('metric-decrease');
                setTimeout(() => metricElement.classList.remove('metric-decrease'), 1000);
            }
            metricElement.textContent = Math.max(0, Number(metricElement.textContent) + value);
        }
        if (key === 'verba') stateAdvanced.verba = Math.max(0, stateAdvanced.verba + value);
        if (key === 'armas') stateAdvanced.armas = Math.max(0, stateAdvanced.armas + value);
        if (key === 'soldados') stateAdvanced.soldados = Math.max(0, stateAdvanced.soldados + value);
        if (key === 'crescimento') stateAdvanced.crescimento = Math.max(0, Math.min(100, stateAdvanced.crescimento + value));
        if (key === 'defesa') stateAdvanced.defesa = Math.max(0, Math.min(100, stateAdvanced.defesa + value));
        if (key === 'riqueza') stateAdvanced.riqueza = Math.max(0, stateAdvanced.riqueza + value);
        if (key === 'influenciaGlobal') stateAdvanced.influenciaGlobal = Math.max(0, Math.min(100, stateAdvanced.influenciaGlobal + value));
        if (key === 'apoioPopular') stateAdvanced.apoioPopular = Math.max(0, Math.min(100, stateAdvanced.apoioPopular + value));
        if (key === 'relacaoImprensa') stateAdvanced.relacaoImprensa = Math.max(0, Math.min(100, stateAdvanced.relacaoImprensa + value));
        if (key === 'relacaoONGs') stateAdvanced.relacaoONGs = Math.max(0, Math.min(100, stateAdvanced.relacaoONGs + value));
        
        // Atualizar barras de progresso
        const progressBar = document.getElementById(`${key}Bar`);
        if (progressBar) {
            progressBar.value = stateAdvanced[key] || Number(metricElement.textContent);
        }
    }
}

function applyAdvancedRewards(recompensa) {
    for (const [key, value] of Object.entries(recompensa)) {
        const metricElement = document.getElementById(key);
        if (metricElement) {
            metricElement.classList.add('metric-increase');
            setTimeout(() => metricElement.classList.remove('metric-increase'), 1000);
            metricElement.textContent = Math.max(0, Number(metricElement.textContent) + value);
        }
        if (key === 'verba') stateAdvanced.verba = Math.max(0, stateAdvanced.verba + value);
        if (key === 'armas') stateAdvanced.armas = Math.max(0, stateAdvanced.armas + value);
        if (key === 'soldados') stateAdvanced.soldados = Math.max(0, stateAdvanced.soldados + value);
        if (key === 'crescimento') stateAdvanced.crescimento = Math.max(0, Math.min(100, stateAdvanced.crescimento + value));
        if (key === 'defesa') stateAdvanced.defesa = Math.max(0, Math.min(100, stateAdvanced.defesa + value));
        if (key === 'riqueza') stateAdvanced.riqueza = Math.max(0, stateAdvanced.riqueza + value);
        if (key === 'influenciaGlobal') stateAdvanced.influenciaGlobal = Math.max(0, Math.min(100, stateAdvanced.influenciaGlobal + value));
        if (key === 'apoioPopular') stateAdvanced.apoioPopular = Math.max(0, Math.min(100, stateAdvanced.apoioPopular + value));
        if (key === 'relacaoImprensa') stateAdvanced.relacaoImprensa = Math.max(0, Math.min(100, stateAdvanced.relacaoImprensa + value));
        if (key === 'relacaoONGs') stateAdvanced.relacaoONGs = Math.max(0, Math.min(100, stateAdvanced.relacaoONGs + value));
        
        // Atualizar barras de progresso
        const progressBar = document.getElementById(`${key}Bar`);
        if (progressBar) {
            progressBar.value = stateAdvanced[key] || Number(metricElement.textContent);
        }
    }
}

// Carrega um caso estratégico (Projetos Nacionais)
function loadAdvancedCase() {
    if (stateAdvanced.projetosJulgados >= casosEstrategicos.length) {
        endAdvancedGame();
        return;
    }
    stateAdvanced.modo = 'projects';
    stateAdvanced.currentAdvancedCase = casosEstrategicos[stateAdvanced.projetosJulgados];
    renderAdvancedCase();
}

// Carrega um caso de liderança (Líder Nacional)
function loadLeaderCase() {
    if (stateAdvanced.projetosJulgados >= casosLider.length) {
        endAdvancedGame();
        return;
    }
    stateAdvanced.modo = 'leader';
    stateAdvanced.currentAdvancedCase = casosLider[stateAdvanced.projetosJulgados];
    renderAdvancedCase();
}

// Renderiza o caso atual na advanced-screen
function renderAdvancedCase() {
    const caso = stateAdvanced.currentAdvancedCase;
    if (!caso) {
        showNotification('Nenhum caso disponível.');
        return;
    }

    const advancedImage = document.getElementById('advanced-image');
    const advancedTitle = document.getElementById('advanced-title');
    const advancedDescription = document.getElementById('advanced-description');
    const advancedDetails = document.getElementById('advanced-details');
    const advancedOptions = document.getElementById('advanced-options');

    if (advancedImage) advancedImage.src = caso.imagem || 'assets/images/estrategico_default.jpg';
    if (advancedTitle) advancedTitle.innerHTML = `<i class="fas fa-chess"></i> ${caso.titulo}`;
    if (advancedDescription) advancedDescription.textContent = caso.descricao;
    if (advancedDetails) {
        advancedDetails.innerHTML = caso.detalhes.map(detalhe => `<p>${detalhe}</p>`).join('');
    }
    if (advancedOptions) {
        advancedOptions.innerHTML = caso.opcoes.map((opcao, index) => `
            <button data-option="${index}" aria-label="${opcao.texto}">${opcao.texto}</button>
            <p class="action-description"><small>${opcao.resultado}</small></p>
        `).join('');
    }

    transitionScreen('advanced-screen', 'media-screen');
}

// Tomar uma decisão avançada
function makeAdvancedDecision(index) {
  const caso = stateAdvanced.currentAdvancedCase;
  if (!caso || index < 0 || index >= caso.opcoes.length) {
    showNotification('Decisão inválida.');
    return;
  }
  
  const opcao = caso.opcoes[index];
  applyAdvancedEffects(opcao.efeitos);
  applyAdvancedRewards(opcao.recompensa);
  updateCountryAffinity(caso); // Chama updateCountryAffinity com o caso atual
  stateAdvanced.projetosJulgados++;
  
  // Exibir resultado na media-screen
  const mediaHeadline = document.getElementById('media-headline');
  const mediaReactions = document.getElementById('media-reactions');
  if (mediaHeadline) mediaHeadline.textContent = opcao.resultado;
  if (mediaReactions) mediaReactions.innerHTML = `<p>${opcao.resultado}</p>`;
  
  transitionScreen('media-screen', 'advanced-screen');
}

// Finalizar o jogo avançado
function endAdvancedGame() {
    let finalText = '';
    let legacyScore = (stateAdvanced.crescimento + stateAdvanced.defesa + stateAdvanced.influenciaGlobal +
        stateAdvanced.apoioPopular + stateAdvanced.relacaoImprensa + stateAdvanced.relacaoONGs) / 6;

    if (stateAdvanced.verba <= 0) {
        finalText = `A nação entrou em colapso econômico! Sem verba, seus projetos fracassaram.`;
    } else if (stateAdvanced.apoioPopular <= 0) {
        finalText = `O povo se revoltou contra suas decisões! Protestos derrubaram seu governo.`;
    } else if (stateAdvanced.defesa <= 0) {
        finalText = `A nação ficou vulnerável! Invasões externas selaram seu destino.`;
    } else if (stateAdvanced.influenciaGlobal <= 0) {
        finalText = `O país foi isolado globalmente! Sua liderança perdeu toda a relevância.`;
    } else if (stateAdvanced.relacaoImprensa <= 0) {
        finalText = `A imprensa destruiu sua reputação! Escândalos forçaram sua renúncia.`;
    } else if (stateAdvanced.relacaoONGs <= 0) {
        finalText = `ONGs denunciaram suas políticas! Você foi afastado por pressão global.`;
    } else if (stateAdvanced.projetosJulgados >= (stateAdvanced.modo === 'projects' ? casosEstrategicos.length : casosLider.length)) {
        if (legacyScore > 80) {
            finalText = `Você levou a nação à glória! Como ${stateAdvanced.modo === 'projects' ? 'Juiz Supremo' : 'Líder Nacional'}, o país é uma potência de primeiro mundo.`;
        } else if (legacyScore > 50) {
            finalText = `Seu legado é sólido. A nação cresceu, mas enfrenta desafios.`;
        } else {
            finalText = `Suas decisões dividiram a nação. O país sobrevive, mas está instável.`;
        }
    } else {
        finalText = `Sua trajetória foi controversa. O país enfrenta incertezas após ${stateAdvanced.projetosJulgados} decisões.`;
    }

    finalText += `<br><br><strong>Resumo:</strong><br>
        Projetos Julgados: ${stateAdvanced.projetosJulgados}/${stateAdvanced.modo === 'projects' ? casosEstrategicos.length : casosLider.length}<br>
        Verba Restante: ${stateAdvanced.verba}<br>
        Influência Global: ${Math.round(stateAdvanced.influenciaGlobal)}<br>
        Riqueza Pessoal: ${stateAdvanced.riqueza}`;

    const endName = document.getElementById('endName');
    const endDescription = document.getElementById('end-description');
    if (endName && endDescription) {
        endName.textContent = state.playerName || 'Líder';
        endDescription.innerHTML = finalText;
    }

    transitionScreen('end-screen', 'advanced-screen');
}

// === Inicialização do Nível Avançado ===
function initializeAdvancedSession() {
    try {
        const advancedOptions = document.getElementById('advanced-options');
        if (advancedOptions) {
            advancedOptions.addEventListener('click', (e) => {
                const index = e.target.dataset.option;
                if (index !== undefined) makeAdvancedDecision(Number(index));
            });
        } else {
            console.warn('Elemento advanced-options não encontrado');
        }

        const continueButton = document.getElementById('continueButton');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                if (stateAdvanced.currentAdvancedCase && stateAdvanced.currentAdvancedCase.internacional) {
                    renderDiplomacyScreen(); // Definido em script_diplomacy.js
                } else {
                    transitionScreen('advanced-screen', 'media-screen');
                    if (stateAdvanced.modo === 'projects') {
                        loadAdvancedCase();
                    } else {
                        loadLeaderCase();
                    }
                }
            });
        } else {
            console.warn('Botão continueButton não encontrado');
        }
    } catch (error) {
        console.error('Erro ao inicializar eventos da Sessão 2:', error);
        showNotification(`Falha ao carregar o nível avançado: ${error.message}. Tente recarregar a página.`);
    }
}