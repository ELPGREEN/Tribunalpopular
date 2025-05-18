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
    maxInvestigations: 2
};

// === Eventos Aleatórios ===
const eventosAleatorios = [
    {
        id: "protestos",
        texto: "Protestos violentos tomam as ruas da capital após sua decisão polêmica, com manifestantes queimando pneus e bloqueando vias. A hashtag #ForaJuiz viraliza nas redes!",
        efeitos: { apoioPopular: -10, relacaoImprensa: -5 },
        condicao: () => state.relacaoImprensa < 25 || state.apoioPopular < 30
    },
    {
        id: "elogio_ong",
        texto: "A ONG 'Justiça Sem Fronteiras' publica um relatório global elogiando sua imparcialidade, destacando você como 'um farol de esperança em tempos sombrios'.",
        efeitos: { respeitoInstitucional: 10, relacaoONGs: 10 },
        condicao: () => state.relacaoONGs > 75
    },
    {
        id: "vazamento",
        texto: "O tabloide 'Verdade Agora' vaza áudios sugerindo conluio entre você e o governo, abalando sua credibilidade. O escândalo domina as manchetes por dias!",
        efeitos: { influenciaPolitica: -15, relacaoImprensa: -10 },
        condicao: () => state.relacaoGoverno > 75 && state.relacaoImprensa < 50
    },
    {
        id: "apoio_popular",
        texto: `Redes sociais explodem com a campanha '#JustiçaCom${state.playerName}', iniciada por jovens ativistas que veem você como símbolo de renovação!`,
        efeitos: { apoioPopular: 10, relacaoImprensa: 10 },
        condicao: () => state.relacaoImprensa > 75
    },
    {
        id: "pressao_governo",
        texto: "O presidente faz um pronunciamento televisionado ameaçando dissolver o tribunal se você continuar desafiando o governo, causando pânico entre seus aliados.",
        efeitos: { influenciaPolitica: -10, relacaoGoverno: -10 },
        condicao: () => state.relacaoGoverno < 25
    },
    {
        id: "crise_economica",
        texto: "Uma crise econômica agrava a inflação em 12%, e manifestantes culpam suas decisões judiciais por desestabilizar o país. A bolsa despenca 5% em um dia.",
        efeitos: { apoioPopular: -10, influenciaPolitica: -5 },
        condicao: () => state.apoioPopular < 50
    },
    {
        id: "apoio_celebridade",
        texto: "A popstar Lívia Mendes grava um vídeo apoiando suas decisões, chamando você de 'voz da justiça'. O vídeo atinge 10 milhões de visualizações em 24 horas!",
        efeitos: { relacaoImprensa: 15, apoioPopular: 5 },
        condicao: () => state.relacaoImprensa > 50
    }
];

// === Casos ===
const casos = [
    {
        id: "caso_01",
        titulo: "Desvio Bilionário na Fundação Esperança",
        descricao: "Em meio à recessão que deixou 20% da população desempregada, o deputado João Almeida, carismático líder da Fundação Esperança e aliado próximo do presidente, é acusado de desviar R$ 2,3 bilhões de programas sociais contra a fome. Imagens vazadas por um ex-assessor, datadas de 12/03/2024, mostram 15 malas de dinheiro empilhadas em seu escritório em Brasília, com notas de R$ 100 visíveis. A ONG suíça 'Futuro Global', principal financiadora, alega que os fundos foram usados em 'projetos humanitários legítimos na África', mas protestos em 15 cidades exigem justiça. O 'Jornal do Povo' chama Almeida de 'ladrão dos pobres', enquanto o 'Globo Nacional' insinua uma conspiração da oposição para desestabilizar o governo. Você decidirá o destino de um dos homens mais influentes do país.",
        provas: [
            "Imagens de 12/03/2024 mostrando 15 malas de dinheiro no escritório de Almeida, com carimbo do Banco Central.",
            "E-mail hackeado de Almeida para seu assessor, datado de 15/02/2024, mencionando 'pagamentos urgentes a parceiros estratégicos'.",
            "Depoimento de um ex-contador da fundação, demitido em 2023, que afirma ter alertado Almeida sobre transferências suspeitas para contas offshore."
        ],
        investigacoes: [
            {
                acao: "Solicitar auditoria independente da PwC",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "A auditoria, concluída em 45 dias, revela que 62% dos fundos foram transferidos para contas nas Ilhas Cayman entre 2022 e 2023. A ONG alega que eram 'doações legais' para projetos na África, mas documentos mostram assinaturas de Almeida em 80% das transações.",
                novaProva: "Relatório da PwC com extratos de contas offshore ligadas a primos de Almeida."
            },
            {
                acao: "Interrogar ex-contador sob juramento",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "O ex-contador, visivelmente nervoso, confessa ter recebido ordens diretas de Almeida para falsificar relatórios financeiros entre 2022 e 2023, sob ameaça de demissão. Ele entrega um pen drive com cópias dos documentos adulterados.",
                novaProva: "Confissão gravada e pen drive com relatórios falsificados."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Almeida com pena máxima de 15 anos",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -10, influenciaPolitica: -20, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: -10 },
                manchete: "Justiça Implacável! Deputado Almeida Preso por Desvio de Bilhões!",
                reacaoPopular: "O povo celebra nas ruas com bandeiras: 'Finalmente um poderoso paga pelos crimes!'",
                reacaoMidia: "Futuro Global: 'Julgamento apressado viola padrões internacionais de devido processo.'"
            },
            {
                texto: "Absolver Almeida por insuficiência de provas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 15, influenciaPolitica: 10, relacaoImprensa: -15, relacaoGoverno: 10, relacaoONGs: 10 },
                manchete: "Escândalo sem Provas? Deputado Almeida Sai Livre!",
                reacaoPopular: "Multidões protestam em Brasília: 'Mais um corrupto solto! O tribunal é uma farsa!'",
                reacaoMidia: "Globo Nacional: 'Tribunal Supremo demonstra rigor técnico e imparcialidade.'"
            },
            {
                texto: "Adiar decisão e exigir nova auditoria",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Posterga Julgamento: Caso Esperança em Suspenso!",
                reacaoPopular: "Frustração nas redes: 'Por que tanta demora? Estão protegendo Almeida! #JustiçaAgora'",
                reacaoMidia: "Jornal do Povo: 'Justiça ou enrolação? O povo quer respostas imediatas!'"
            },
            {
                texto: "Condenar Almeida com base nas novas provas",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -25, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 0 },
                manchete: "Provas Incontestáveis! Almeida Condenado a 12 Anos de Prisão!",
                reacaoPopular: "Jubilo nas praças: 'Justiça feita! O povo venceu a corrupção!'",
                reacaoMidia: "Globo Nacional: 'Decisão pode desencadear crise no governo e no Congresso.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal do Povo: 'Almeida roubou dos famintos! Prisão já ou o povo vai às ruas!'",
            "Futuro Global: 'As provas são frágeis e motivadas politicamente. Exigimos transparência!'",
            "Rede Social: 'Se o tribunal soltar esse ladrão, é o fim da justiça! #PrisãoParaAlmeida'"
        ]
    },
    {
        id: "caso_02",
        titulo: "Protestos Violentos na Capital",
        descricao: "A capital está em chamas após semanas de protestos contra uma reforma tributária que dobrou impostos sobre a classe média, enquanto isentou grandes corporações. Liderados pelo ativista Rafael Torres, um ex-professor universitário de 42 anos conhecido por seus discursos inflamados, os manifestantes ocuparam a Praça da Liberdade, mas o protesto escalou em 05/04/2025, quando um incêndio destruiu o prédio da Receita Nacional, causando R$ 50 milhões em danos. A polícia acusa Torres de incitar a violência, apresentando vídeos de manifestantes com coquetéis molotov. O movimento 'Voz do Povo' denuncia repressão brutal, com relatos de 30 espancamentos e 120 prisões arbitrárias. A nação está dividida: metade exige ordem, a outra clama por justiça social. Sua decisão moldará o futuro das liberdades civis.",
        provas: [
            "Vídeo de 05/04/2025, às 22h, mostrando 20 manifestantes lançando coquetéis molotov contra a Receita Nacional, com Torres ao fundo.",
            "Depoimento de um sargento da PM, ferido por uma pedra, afirmando que Torres gritou 'Queimem tudo!' às 21h50.",
            "Relatório da ONG 'Liberdade Agora' com 12 testemunhas descrevendo uso de balas de borracha e gás lacrimogêneo contra manifestantes pacíficos às 21h."
        ],
        investigacoes: [
            {
                acao: "Analisar câmeras de segurança da praça",
                custo: { respeitoInstitucional: -5, relacaoGoverno: -5 },
                resultado: "Imagens de 10 câmeras mostram confrontos iniciados por policiais às 21h, com gás lacrimogêneo disparado contra a multidão. Às 22h15, um grupo radical ateia fogo ao prédio. Torres aparece às 21h30 pedindo calma, mas é ignorado por 50 manifestantes.",
                novaProva: "Vídeo de 21h03 mostrando policiais disparando gás sem provocação."
            },
            {
                acao: "Ouvir testemunhas independentes",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Seis testemunhas, incluindo um comerciante local e uma jornalista freelance, confirmam que Torres orientou protestos pacíficos em discursos às 20h. Um subgrupo radical, autointitulado 'Fúria Popular', ignorou suas ordens e iniciou o incêndio às 22h.",
                novaProva: "Declarações juramentadas de testemunhas."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Torres por incitação à violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Ordem Restaurada! Ativista Torres Preso por Protestos Violentos!",
                reacaoPopular: "Milhares protestam em universidades: 'Estão criminalizando nossa luta! Torres é inocente!'",
                reacaoMidia: "Diário da Ordem: 'Tribunal protege a segurança pública contra anarquistas.'"
            },
            {
                texto: "Absolver Torres e investigar a polícia",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Tribunal Apoia Protestos: Polícia Será Investigada por Repressão!",
                reacaoPopular: "O povo celebra nas ruas: 'Torres é herói! Chega de violência policial!'",
                reacaoMidia: "Globo Nacional: 'Decisão arriscada pode inflamar tensões políticas.'"
            },
            {
                texto: "Adiar decisão e pedir diálogo nacional",
                efeitos: { apoioPopular: -10, respeitoInstitucional: 5, influenciaPolitica: 0, relacaoImprensa: -5, relacaoGoverno: 0, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Pede Paz: Julgamento de Torres Adiado!",
                reacaoPopular: "Frustração nas redes: 'Mais espera? O tribunal está com medo! #LiberdadeParaTorres'",
                reacaoMidia: "Jornal Progressista: 'Cautela é bem-vinda, mas o povo quer justiça agora.'"
            },
            {
                texto: "Condenar radicais, absolver Torres",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 10, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Equilibrada: Radicais Presos, Torres Liberado!",
                reacaoPopular: "Aplausos moderados: 'Um passo justo, mas queremos reformas tributárias!'",
                reacaoMidia: "Voz do Povo: 'Torres livre é vitória, mas a luta contra impostos continua!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Voz do Povo: 'Torres é a voz da resistência! A repressão deve ser punida!'",
            "Diário da Ordem: 'Protestos são caos! Torres deve responder pelos crimes!'",
            "Rede Social: 'Se condenarem Torres, a revolta será maior! #LiberdadeParaTorres'"
        ]
    },
    {
        id: "caso_03",
        titulo: "Escândalo na PetroNação",
        descricao: "A estatal PetroNação, responsável por 40% do PIB, está no centro de um escândalo histórico. Seu CEO, Carlos Mendes, ex-ministro da Energia e figura carismática que prometeu 'modernizar o setor', é acusado de superfaturar contratos de exploração no Campo Azul em R$ 580 milhões. Documentos vazados por um whistleblower mostram pagamentos a empresas fantasmas registradas em paraísos fiscais. Mendes, em um pronunciamento emocionado em 10/04/2025, alega ser vítima de uma 'caça às bruxas' da oposição para enfraquecer o governo. Com os preços dos combustíveis em alta e filas nos postos, a população exige punição, mas aliados de Mendes no Congresso alertam que sua queda pode causar uma crise energética. Sua decisão testará justiça versus estabilidade.",
        provas: [
            "Contratos de 2023-2024 com valores 30% acima do mercado, assinados por Mendes e aprovados pela diretoria.",
            "Depoimento de um ex-gerente da PetroNação, demitido em 2024, acusando Mendes de receber propinas em contas no Panamá.",
            "E-mails interceptados entre Mendes e o senador Roberto Lima, datados de 01/03/2024, mencionando 'acordos estratégicos' com empreiteiras."
        ],
        investigacoes: [
            {
                acao: "Contratar peritos contábeis da Deloitte",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Peritos confirmam superfaturamento em 12 contratos, totalizando R$ 420 milhões, mas não encontram ordens diretas de Mendes. Um consultor externo, ligado a uma empreiteira, é apontado como elo principal.",
                novaProva: "Relatório da Deloitte com organograma das empresas fantasmas."
            },
            {
                acao: "Rastrear contas internacionais",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: "Contas no Panamá recebem R$ 15 milhões de empreiteiras entre 2023 e 2024, registradas em nome de um laranja, João Pereira, ex-assessor da PetroNação demitido em 2022.",
                novaProva: "Extratos bancários do Panamá."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Mendes por corrupção ativa",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: -5 },
                manchete: "Fim da Impunidade! CEO da PetroNação Preso por Corrupção!",
                reacaoPopular: "Festas nos postos de gasolina: 'Mendes caiu! A justiça venceu a ganância!'",
                reacaoMidia: "Jornal do Povo: 'Vitória contra os corruptos da PetroNação!'"
            },
            {
                texto: "Absolver Mendes por falta de provas diretas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: 10 },
                manchete: "PetroNação: Mendes Absolvido em Meio à Polêmica!",
                reacaoPopular: "Protestos em refinarias: 'O tribunal protege os ricos! Vergonha!'",
                reacaoMidia: "Globo Nacional: 'Decisão técnica evita crise no setor energético.'"
            },
            {
                texto: "Investigar toda a rede de contratos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Amplia Investigação na PetroNação!",
                reacaoPopular: "Ceticismo nas redes: 'Mais investigação? Estão enrolando! #PetroNação'",
                reacaoMidia: "Jornal Progressista: 'Passo certo, mas queremos resultados rápidos.'"
            },
            {
                texto: "Condenar assessores, absolver Mendes",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 5, relacaoGoverno: 5, relacaoONGs: 5 },
                manchete: "Justiça Parcial: Assessores da PetroNação Presos, Mendes Livre!",
                reacaoPopular: "Mistos sentimentos: 'Pequenos pagam, mas Mendes escapou!'",
                reacaoMidia: "Voz do Povo: 'Decisão tímida. Queremos os grandes corruptos!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal do Povo: 'Mendes roubou nosso petróleo! Prisão já!'",
            "Globo Nacional: 'Acusações contra Mendes são especulações políticas!'",
            "Rede Social: 'PetroNação é a cara da corrupção! #ForaMendes'"
        ]
    },
    {
        id: "caso_04",
        titulo: "Tragédia no Vale Verde",
        descricao: "Uma catástrofe ambiental devastou o interior do país: a barragem da mineradora Vale Verde, no coração do Vale do Rio Claro, rompeu em 20/04/2025, liberando 10 milhões de metros cúbicos de rejeitos tóxicos. Três vilarejos foram destruídos, 28 pessoas morreram, incluindo 10 crianças, e o rio Claro, vital para 200 mil agricultores, está contaminado por mercúrio. A Vale Verde, dirigida pelo magnata Otávio Reis, culpa um 'ataque terrorista' de ambientalistas radicais da 'Frente Verde', apontando vídeos de protestos em 15/04/2025. ONGs como 'Terra Viva' acusam a empresa de negligência, citando alertas ignorados desde 2022. Com famílias desabrigadas e a imprensa internacional cobrando respostas, sua decisão pode redefinir a responsabilidade corporativa.",
        provas: [
            "Relatório interno da Vale Verde de 15/10/2022 alertando sobre rachaduras na barragem, assinado pelo engenheiro-chefe, mas ignorado pela diretoria.",
            "Vídeo de 15/04/2025 mostrando 30 ativistas da Frente Verde invadindo o terreno da mineradora com faixas e megafones, gritando 'Parem a destruição!'",
            "Laudo preliminar de engenheiros independentes, datado de 22/04/2025, indicando falha estrutural devido a 3 anos sem manutenção."
        ],
        investigacoes: [
            {
                acao: "Enviar equipe técnica da USP ao local",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Engenheiros da USP confirmam negligência na manutenção, com reformas adiadas por cortes de R$ 20 milhões em 2023. Curiosamente, traços de explosivos caseiros são encontrados nos escombros, sugerindo sabotagem parcial por um grupo pequeno.",
                novaProva: "Relatório técnico com fotos de explosivos e rachaduras."
            },
            {
                acao: "Investigar a Frente Verde",
                custo: { respeitoInstitucional: -5, relacaoONGs: -10 },
                resultado: "A líder da Frente Verde, Clara Souza, nega sabotagem, mas um ex-membro confessa ter planejado um 'ato simbólico' com explosivos para chamar atenção, sem intenção de romper a barragem.",
                novaProva: "Confissão por escrito do ex-membro."
            }
        ],
        decisoes: [
         
