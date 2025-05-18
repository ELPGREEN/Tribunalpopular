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
            {
                texto: "Multar a Vale Verde em R$ 5 bilhões por negligência",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -10, relacaoONGs: 15 },
                manchete: "Vale Verde Paga Caro! Multa Bilionária por Desastre Ambiental!",
                reacaoPopular: "Aplausos nas redes: 'Empresas não podem destruir nossas vidas! #JustiçaAmbiental'",
                reacaoMidia: "Terra Viva: 'Primeiro passo, mas queremos reparação total para as vítimas!'"
            },
            {
                texto: "Condenar a Frente Verde por terrorismo",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 10, relacaoONGs: -15 },
                manchete: "Ativistas Presos! Frente Verde Culpada por Tragédia no Vale!",
                reacaoPopular: "Indignação em ONGs: 'Estão culpando os defensores da natureza!'",
                reacaoMidia: "Diário da Ordem: 'Radicalismo ambiental punido com rigor.'"
            },
            {
                texto: "Exigir investigação federal completa",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Adia Punição: Vale Verde Sob Escrutínio!",
                reacaoPopular: "Frustração nas comunidades: 'As vítimas merecem justiça agora! #RioClaroVive'",
                reacaoMidia: "Jornal Progressista: 'Cautela é necessária, mas a demora preocupa.'"
            },
            {
                texto: "Multar Vale Verde e prender sabotadores",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 0, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: 0, relacaoONGs: 5 },
                manchete: "Justiça Dupla: Vale Verde Multada, Ativistas Presos!",
                reacaoPopular: "Apoio misto: 'Todos os culpados pagaram, mas queremos o rio limpo!'",
                reacaoMidia: "Globo Nacional: 'Decisão equilibrada em caso complexo.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Terra Viva: 'Vale Verde destruiu o Vale do Rio Claro! Exigimos justiça!'",
            "Diário da Ordem: 'Ativistas são terroristas! A Vale Verde é vítima!'",
            "Rede Social: 'O rio Claro morreu! Quem paga por isso? #JustiçaAmbiental'"
        ]
    },
    {
        id: "caso_05",
        titulo: "Vazamento de Dados Nacionais",
        descricao: "Um terremoto político abala a nação: o hacker conhecido como 'Sombra', identificado como Lucas Ferreira, um ex-analista de sistemas de 32 anos do Ministério da Defesa, vazou 50 mil documentos secretos em 01/05/2025. Os arquivos, publicados em um site criptografado, revelam esquemas de corrupção envolvendo 12 deputados, 3 juízes e o vice-presidente, além de um programa de vigilância ilegal contra 200 jornalistas e ativistas. Para muitos, Sombra é um herói da transparência; para o governo, um traidor que expôs segredos militares e comprometeu a segurança nacional. Com protestos pró e contra Sombra em 10 cidades e a imprensa internacional cobrando explicações, sua decisão definirá os limites da liberdade de expressão e da soberania do Estado.",
        provas: [
            "Documentos vazados de 2019-2024, incluindo recibos de propinas de R$ 200 milhões pagas a 12 deputados.",
            "Metadados confirmando que Sombra agiu sozinho, usando um laptop em um café em São Paulo em 28/04/2025.",
            "Pronunciamento do ministro da Defesa em 02/05/2025: 'O vazamento expôs coordenadas de bases militares e põe o país em risco.'"
        ],
        investigacoes: [
            {
                acao: "Validar autenticidade dos documentos",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: "Peritos da Unicamp confirmam que 95% dos documentos são autênticos, detalhando propinas de R$ 200 milhões. No entanto, 5% dos arquivos contêm coordenadas de bases militares, o que alarma o Exército.",
                novaProva: "Relatório da Unicamp validando os documentos."
            },
            {
                acao: "Rastrear identidade de Sombra",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "Sombra é Lucas Ferreira, demitido do Ministério em 2023 por denunciar irregularidades. Ele tem apoio de ciberativistas internacionais, como o grupo 'Transparência Global'.",
                novaProva: "Dossiê do serviço de inteligência sobre Ferreira."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Sombra por traição",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 20, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Sombra Preso! Hacker Condenado por Ameaçar Segurança Nacional!",
                reacaoPopular: "Protestos em universidades: 'Estão silenciando a verdade! Sombra é herói!'",
                reacaoMidia: "Diário da Ordem: 'Justiça protege o país de traidores como Sombra.'"
            },
            {
                texto: "Absolver Sombra como denunciante",
                efeitos: { apoioPopular: 25, respeitoInstitucional: -15, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Sombra Livre! Tribunal Reconhece Denunciante como Herói!",
                reacaoPopular: "Festas nas ruas: 'Sombra expôs a podridão! Viva a transparência!'",
                reacaoMidia: "Globo Nacional: 'Decisão perigosa pode desestabilizar o governo.'"
            },
            {
                texto: "Investigar corrupção nos documentos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Prioriza Corrupção: Sombra em Suspenso!",
                reacaoPopular: "Ceticismo nas redes: 'Mais investigação? Vão esconder tudo! #VazaTudo'",
                reacaoMidia: "Jornal Progressista: 'Foco na corrupção é correto, mas Sombra merece proteção.'"
            },
            {
                texto: "Proteger Sombra e investigar corrupção",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -10, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -25, relacaoONGs: 10 },
                manchete: "Sombra Protegido! Tribunal Abre Mega-Investigação de Corrupção!",
                reacaoPopular: "Euforia nas praças: 'Sombra é nosso herói! Fora corruptos!'",
                reacaoMidia: "Diário da Ordem: 'Decisão irresponsável ameaça a segurança nacional.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal Progressista: 'Sombra revelou a verdade! Ele é um herói da transparência!'",
            "Diário da Ordem: 'Sombra é traidor! Prisão máxima para proteger o país!'",
            "Rede Social: 'Sombra contra a corrupção! Quem está com ele? #VazaTudo'"
        ]
    },
    {
        id: "caso_06",
        titulo: "A Queda do Magnata Digital",
        descricao: "Eduardo Viana, o bilionário de 38 anos por trás da rede social Conexão Global, usada por 70% da população e avaliada em R$ 10 bilhões, enfrenta acusações graves de manipular algoritmos para favorecer candidatos governistas nas eleições de 2024. Relatórios vazados por uma ex-engenheira mostram que conteúdos críticos ao governo foram suprimidos, enquanto postagens pró-governo alcançaram 500 milhões de visualizações. Viana, em uma coletiva em 10/05/2025, nega tudo, chamando as acusações de 'ataque à liberdade de expressão' por rivais estrangeiros. Com a privacidade dos usuários e a democracia em jogo, sua decisão pode redefinir o papel das big techs no país.",
        provas: [
            "Relatório de analistas da USP, datado de 01/04/2025, mostrando que algoritmos da Conexão Global priorizaram conteúdos governistas em 2024.",
            "Depoimento de uma ex-engenheira, demitida em 2023, acusando Viana de ordenar manipulações em reuniões secretas em 2022.",
            "Entrevista de Viana à TV Nacional em 10/05/2025: 'Isso é perseguição política contra a inovação brasileira!'"
        ],
        investigacoes: [
            {
                acao: "Analisar servidores da Conexão Global",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "Peritos encontram logs de 2024 confirmando manipulação de algoritmos, mas sem e-mails diretos de Viana. Um gerente sênior, Ricardo Lopes, é identificado como responsável pelas mudanças.",
                novaProva: "Logs de servidores com alterações datadas de 15/09/2024."
            },
            {
                acao: "Interrogar ex-funcionários sob sigilo",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Três ex-funcionários revelam que Viana pressionava a equipe para 'otimizar' conteúdos favoráveis ao governo, ameaçando cortes de bônus. Uma gravação de uma reunião confirma suas ordens.",
                novaProva: "Gravação de reunião de 01/08/2024."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Viana por manipulação eleitoral",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Magnata Digital Cai! Viana Preso por Manipular Eleições!",
                reacaoPopular: "Festas nas redes: 'Justiça contra os manipuladores da internet!'",
                reacaoMidia: "Jornal Progressista: 'Vitória histórica pela democracia digital!'"
            },
            {
                texto: "Absolver Viana por falta de provas diretas",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Conexão Global Livre! Viana Absolvido em Polêmica!",
                reacaoPopular: "Indignação nas redes: 'O tribunal protege os bilionários! Vergonha!'",
                reacaoMidia: "Diário da Ordem: 'Liberdade de expressão garantida contra ataques.'"
            },
            {
                texto: "Regular a Conexão Global com novas leis",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -10, relacaoImprensa: 5, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Tribunal Supremo Impõe Regras à Conexão Global!",
                reacaoPopular: "Apoio moderado: 'Um passo contra a manipulação, mas queremos mais!'",
                reacaoMidia: "Globo Nacional: 'Regulação é necessária, mas levanta debate sobre censura.'"
            },
            {
                texto: "Condenar Viana e banir Conexão Global",
                efeitos: { apoioPopular: 25, respeitoInstitucional: -10, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -25, relacaoONGs: 5 },
                manchete: "Fim da Conexão Global! Viana Preso e Plataforma Banida!",
                reacaoPopular: "Euforia nas redes: 'Chega de manipulação! A internet é do povo!'",
                reacaoMidia: "Jornal do Povo: 'Decisão radical, mas necessária!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal do Povo: 'Viana manipulou nossas eleições! Prisão e banimento já!'",
            "Tech News: 'Conexão Global é vítima de perseguição política!'",
            "Rede Social: 'Viana controla o que vemos! #DesligaConexão'"
        ]
    },
    {
        id: "caso_07",
        titulo: "Tumulto na Fronteira",
        descricao: "A crise migratória na fronteira norte do país atingiu um ponto crítico em 25/04/2025. Milhares de refugiados, fugindo de uma guerra civil em um país vizinho que matou 50 mil pessoas, tentaram cruzar o rio Amazonas em busca de asilo. Um confronto com a Guarda Nacional, sob comando do General Vargas, deixou 15 mortos, incluindo 3 crianças, e 80 feridos. O governo acusa os migrantes de iniciar a violência, apontando pedras e paus como armas. ONGs como 'Fronteiras Abertas' denunciam abusos, com vídeos mostrando soldados disparando gás lacrimogêneo contra famílias às 16h. A opinião pública está dividida: alguns exigem deportação, outros clamam por humanidade. Sua decisão será julgada pela comunidade internacional.",
        provas: [
            "Vídeo de 25/04/2025, às 16h10, mostrando migrantes jogando pedras contra barricadas da Guarda Nacional.",
            "Relatório da ONG Fronteiras Abertas, datado de 26/04/2025, com imagens de crianças atingidas por gás lacrimogêneo às 16h.",
            "Depoimento de um fazendeiro local: 'Os migrantes invadiram minha terra às 15h, mas os soldados atiraram primeiro.'"
        ],
        investigacoes: [
            {
                acao: "Coletar depoimentos de migrantes sobreviventes",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Dez migrantes, incluindo uma mãe de dois filhos, relatam que a Guarda Nacional disparou gás e balas de borracha às 15h45, sem aviso, forçando uma reação desesperada. Eles negam intenções violentas.",
                novaProva: "Depoimentos gravados de migrantes."
            },
            {
                acao: "Analisar vídeos de drones independentes",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "Imagens de um drone civil mostram soldados disparando gás às 15h45, antes de qualquer pedra ser jogada. Às 16h10, migrantes retaliaram com objetos improvisados.",
                novaProva: "Vídeo de drone confirmando agressão inicial."
            }
        ],
        decisoes: [
            {
                texto: "Condenar líderes migrantes por violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Migrantes Culpados! Líderes Presos por Tumulto na Fronteira!",
                reacaoPopular: "Protestos em ONGs: 'Estão criminalizando vítimas da guerra!'",
                reacaoMidia: "Diário da Ordem: 'Fronteiras protegidas contra invasores!'"
            },
            {
                texto: "Punir oficiais da Guarda por abuso",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça na Fronteira! Guardas Punidos por Massacre de Migrantes!",
                reacaoPopular: "Aplausos nas redes: 'Justiça para os refugiados! Chega de violência!'",
                reacaoMidia: "Fronteiras Abertas: 'Decisão histórica pelos direitos humanos!'"
            },
            {
                texto: "Mediar acordo humanitário com a ONU",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Tribunal Supremo Propõe Paz: ONU Mediará Crise na Fronteira!",
                reacaoPopular: "Esperança cautelosa: 'Bom começo, mas queremos ações concretas!'",
                reacaoMidia: "Globo Nacional: 'Mediação pode evitar nova tragédia.'"
            },
            {
                texto: "Punir soldados e líderes, propor reformas",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Justiça na Fronteira: Culpados Punidos, Reformas Anunciadas!",
                reacaoPopular: "Apoio nas redes: 'Justiça para todos, mas a crise migratória continua!'",
                reacaoMidia: "Jornal Progressista: 'Decisão corajosa para um problema humano.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Fronteiras Abertas: 'Migrantes são vítimas! Punam a Guarda Nacional!'",
            "Diário da Ordem: 'Fronteira é soberania! Migrantes devem ser deportados!'",
            "Rede Social: 'Crianças mortas na fronteira! Quem responde? #JustiçaMigrante'"
        ]
    },
    {
        id: "caso_08",
        titulo: "O Escândalo da Vacina",
        descricao: "Uma tragédia de saúde pública chocou o país em 01/05/2025: a farmacêutica BioVida, maior produtora de medicamentos do continente, é acusada de vender 2 milhões de doses falsificadas de uma vacina contra a febre do Delta, uma epidemia que matou 3 mil pessoas, incluindo 500 crianças. Pacientes vacinados morreram, e laudos mostram que as doses eram apenas solução salina. A BioVida, liderada pela CEO Dra. Helena Costa, culpa fornecedores terceirizados na China, alegando sabotagem. O governo, que aprovou a vacina em 15 dias, minimiza o caso para evitar pânico, mas famílias em luto marcham em 20 cidades. Com a OMS cobrando respostas, sua decisão pode reformar o sistema de saúde ou abalar a confiança pública.",
        provas: [
            "Laudo do Instituto Nacional de Saúde de 01/05/2025 confirmando que 30% das vacinas eram placebos, sem princípio ativo.",
            "E-mails internos da BioVida, datados de 10/12/2023, discutindo redução de custos na produção de vacinas para 'maximizar lucros'.",
            "Depoimento de uma enfermeira, Maria Silva, que perdeu o filho de 8 anos após tomar a vacina: 'Eu confiava na BioVida!'"
        ],
        investigacoes: [
            {
                acao: "Testar amostras em laboratórios da Fiocruz",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "A Fiocruz analisa 500 amostras e confirma que 35% eram ineficazes, com lotes produzidos em uma fábrica terceirizada na China. Rastros de negligência interna na BioVida são encontrados, incluindo ordens para ignorar testes de qualidade.",
                novaProva: "Relatório da Fiocruz com análise química."
            },
            {
                acao: "Investigar fornecedores chineses",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "A fábrica chinesa admite erros na produção, mas revela que a BioVida exigiu cortes de 40% nos custos, comprometendo a qualidade. Contratos assinados por Costa em 2023 são descobertos.",
                novaProva: "Contratos com cláusulas de redução de custo."
            }
        ],
        decisoes: [
            {
                texto: "Condenar BioVida por fraude e negligência",
                efeitos: { apoioPopular: 25, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 20, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "BioVida Condenada! Farmacêutica Paga por Vacinas Falsas!",
                reacaoPopular: "Luto e alívio nas ruas: 'Justiça para as vítimas! Nunca mais BioVida!'",
                reacaoMidia: "Jornal do Povo: 'Vitória contra a ganância que matou inocentes!'"
            },
            {
                texto: "Absolver BioVida, culpar fornecedores",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "BioVida Inocente! Fornecedores Chineses Culpados por Vacinas!",
                reacaoPopular: "Fúria nas ruas: 'Protegeram a BioVida! O povo morre e ninguém paga!'",
                reacaoMidia: "Globo Nacional: 'Decisão evita crise na indústria farmacêutica.'"
            },
            {
                texto: "Ordenar recall imediato das vacinas",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: 5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Exige Recall das Vacinas da BioVida!",
                reacaoPopular: "Apoio cauteloso: 'Bom, mas queremos punição para os culpados!'",
                reacaoMidia: "OMS: 'Recall é urgente, mas investigação deve continuar.'"
            },
            {
                texto: "Condenar BioVida e reformar regulação",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 10, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -15, relacaoONGs: 15 },
                manchete: "BioVida Punida! Tribunal Propõe Novas Leis para Saúde Pública!",
                reacaoPopular: "Esperança nas redes: 'Justiça e proteção para o futuro!'",
                reacaoMidia: "Jornal Progressista: 'Decisão histórica para salvar vidas!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal do Povo: 'BioVida matou nossos filhos! Prisão para Helena Costa!'",
            "Globo Nacional: 'Cautela! Não há provas diretas contra a BioVida.'",
            "Rede Social: 'Vacinas falsas mataram milhares! #ForaBioVida'"
        ]
    },
    {
        id: "caso_09",
        titulo: "Rebelião nas Prisões",
        descricao: "A Penitenciária de Segurança Máxima São Marcos, superlotada com 3.200 presos em celas projetadas para 1.500, foi palco de uma rebelião sangrenta em 30/04/2025. Liderados por Antônio 'Lobo' Silva, um ex-líder comunitário de 45 anos preso por tráfico em 2020, os detentos tomaram o controle do bloco C, fazendo 10 guardas reféns e exigindo fim da superlotação, acesso a saúde e investigação de torturas. O motim deixou 5 mortos e 20 feridos. O governo, via ministro da Justiça, classifica os rebeldes como 'terroristas organizados'. ONGs como 'Direitos Já' denunciam abusos sistêmicos, incluindo espancamentos semanais. Com a nação assistindo, sua decisão pode reformar o sistema prisional ou endurecer a repressão.",
        provas: [
            "Vídeo de 30/04/2025, às 14h, mostrando presos armados com facas improvisadas e reféns amarrados no bloco C.",
            "Relatório da Defensoria Pública de 2024 detalhando superlotação, falta de água potável e surtos de tuberculose na prisão.",
            "Declaração do ministro da Justiça em 01/05/2025: 'Lobo e seus seguidores são uma ameaça ao Estado e à ordem pública!'"
        ],
        investigacoes: [
            {
                acao: "Inspecionar a penitenciária com peritos",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: "Peritos confirmam condições desumanas: celas com 10 presos cada, esgoto a céu aberto e falta de medicamentos. Armas improvisadas foram contrabandeadas via guardas corruptos, que recebiam propinas de R$ 5 mil por mês.",
                novaProva: "Relatório de inspeção com fotos das celas e armas."
            },
            {
                acao: "Interrogar Lobo e líderes rebeldes",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "Lobo admite o motim, mas alega que foi uma resposta a espancamentos semanais por guardas. Ele entrega nomes de 3 guardas envolvidos em torturas, confirmados por outros presos.",
                novaProva: "Depoimento gravado de Lobo e testemunhos de presos."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Lobo por terrorismo",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Rebelião Esmagada! Lobo Preso por Terrorismo em São Marcos!",
                reacaoPopular: "Protestos em ONGs: 'Estão ignorando as condições desumanas!'",
                reacaoMidia: "Diário da Ordem: 'Justiça contra criminosos que desafiam o Estado!'"
            },
            {
                texto: "Investigar abusos e absolver Lobo",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça nas Prisões! Tribunal Investiga Torturas em São Marcos!",
                reacaoPopular: "Aplausos nas redes: 'Justiça para os presos! Chega de abusos!'",
                reacaoMidia: "Direitos Já: 'Decisão corajosa expõe a crise prisional!'"
            },
            {
                texto: "Propor reformas no sistema prisional",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Tribunal Supremo Propõe Reforma nas Prisões!",
                reacaoPopular: "Esperança cautelosa: 'Bom começo, mas queremos ações reais!'",
                reacaoMidia: "Globo Nacional: 'Reformas são urgentes, mas custarão caro.'"
            },
            {
                texto: "Punir guardas corruptos, absolver Lobo",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Justiça em São Marcos: Guardas Punidos, Lobo Liberado!",
                reacaoPopular: "Apoio nas redes: 'Justiça contra a corrupção nas prisões!'",
                reacaoMidia: "Jornal Progressista: 'Passo importante para humanizar o sistema.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Direitos Já: 'São Marcos é um campo de tortura! Lobo luta por justiça!'",
            "Diário da Ordem: 'Lobo é terrorista! Prisão máxima para rebeldes!'",
            "Rede Social: 'Presos vivem em inferno! Quem pune os guardas? #ReformaPrisional'"
        ]
    },
    {
        id: "caso_10",
        titulo: "O Julgamento do Presidente",
        descricao: "Um escândalo sem precedentes abala a nação: o presidente Miguel Santana, eleito com 55% dos votos em 2022, é acusado de abuso de poder por autorizar grampos ilegais contra opositores, incluindo senadores, jornalistas e até aliados. Documentos vazados por um ex-agente da Agência Nacional de Inteligência (ANI) mostram que Santana aprovou a operação 'Olho de Águia' em 2023, que espionou 500 pessoas sem mandato judicial. Santana, em um discurso em 15/05/2025, chama as acusações de 'golpe da oposição' e promete renunciar se condenado. Com o Congresso em crise e protestos diários, sua decisão pode derrubar o governo ou preservar a estabilidade política.",
        provas: [
            "Documentos da ANI, datados de 10/01/2023, com ordens assinadas por Santana para iniciar a operação 'Olho de Águia'.",
            "Gravações de 2024, vazadas por um ex-agente, onde Santana discute 'neutralizar ameaças políticas' com o chefe da ANI.",
            "Depoimento de um senador opositor: 'Descobri microfones em meu gabinete em 2023!'"
        ],
        investigacoes: [
            {
                acao: "Analisar legalidade da operação",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: "Juristas confirmam que a operação violou a Constituição, carecendo de mandatos judiciais. No entanto, a ANI alega que Santana agiu sob 'estado de emergência' para combater uma suposta conspiração.",
                novaProva: "Parecer jurídico confirmando ilegalidade."
            },
            {
                acao: "Interrogar ex-agentes da ANI",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: "Dois ex-agentes confirmam que Santana ordenou os grampos pessoalmente em reuniões secretas, mas alegam que ele acreditava estar protegendo a nação de um golpe iminente.",
                novaProva: "Depoimentos gravados dos ex-agentes."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Santana por abuso de poder",
                efeitos: { apoioPopular: 25, respeitoInstitucional: 10, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -25, relacaoONGs: 15 },
                manchete: "Presidente Cai! Santana Condenado por Espionagem Ilegal!",
                reacaoPopular: "Festas nas ruas: 'A justiça venceu! Fora tiranos!'",
                reacaoMidia: "Jornal do Povo: 'Vitória histórica contra a ditadura!'"
            },
            {
                texto: "Absolver Santana por motivos de segurança",
                efeitos: { apoioPopular: -20, respeitoInstitucional: -10, influenciaPolitica: 20, relacaoImprensa: -15, relacaoGoverno: 20, relacaoONGs: -15 },
                manchete: "Santana Absolvido! Tribunal Prioriza Segurança Nacional!",
                reacaoPopular: "Protestos no Congresso: 'O tribunal protegeu um ditador!'",
                reacaoMidia: "Diário da Ordem: 'Decisão sábia evita o caos político.'"
            },
            {
                texto: "Exigir investigação completa da ANI",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Tribunal Supremo Adia Julgamento: ANI Sob Investigação!",
                reacaoPopular: "Frustração nas redes: 'Mais espera? Estão protegendo Santana!'",
                reacaoMidia: "Globo Nacional: 'Cautela é necessária, mas o povo quer justiça.'"
            },
            {
                texto: "Condenar Santana e reformar a ANI",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 10, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Justiça e Reforma! Santana Condenado, ANI Será Reformulada!",
                reacaoPopular: "Apoio nas praças: 'Justiça e transparência para o futuro!'",
                reacaoMidia: "Jornal Progressista: 'Decisão corajosa restaura a democracia!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            "Jornal do Povo: 'Santana espionou o povo! Prisão ou renúncia já!'",
            "Diário da Ordem: 'Acusações são golpe! Santana protegeu a nação!'",
            "Rede Social: 'Presidente espião! Quem defende a democracia? #ForaSantana'"
        ]
    }
];

// === Funções Auxiliares ===
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function validateName(name) {
    const regex = /^[a-zA-Z0-9\s]{1,20}$/;
    return regex.test(name);
}

function applyEffects(effects) {
    for (const [key, value] of Object.entries(effects)) {
        if (key === 'apoioPopular') state.apoioPopular = Math.max(0, Math.min(100, state.apoioPopular + value));
        if (key === 'respeitoInstitucional') state.respeitoInstitucional = Math.max(0, Math.min(100, state.respeitoInstitucional + value));
        if (key === 'influenciaPolitica') state.influenciaPolitica = Math.max(0, Math.min(100, state.influenciaPolitica + value));
        if (key === 'relacaoImprensa') state.relacaoImprensa = Math.max(0, Math.min(100, state.relacaoImprensa + value));
        if (key === 'relacaoGoverno') state.relacaoGoverno = Math.max(0, Math.min(100, state.relacaoGoverno + value));
        if (key === 'relacaoONGs') state.relacaoONGs = Math.max(0, Math.min(100, state.relacaoONGs + value));
    }
}

function updateReputation() {
    const metrics = [
        { id: 'apoioPopular', bar: 'apoioPopularBar' },
        { id: 'respeitoInstitucional', bar: 'respeitoInstitucionalBar' },
        { id: 'influenciaPolitica', bar: 'influenciaPoliticaBar' },
        { id: 'relacaoImprensa', bar: 'relacaoImprensaBar' },
        { id: 'relacaoGoverno', bar: 'relacaoGovernoBar' },
        { id: 'relacaoONGs', bar: 'relacaoONGsBar' }
    ];
    metrics.forEach(metric => {
        document.getElementById(metric.id).textContent = state[metric.id];
        document.getElementById(metric.bar).value = state[metric.id];
    });
}

function transitionScreen(showId, hideId) {
    const showScreen = document.getElementById(showId);
    const hideScreen = document.getElementById(hideId);
    if (hideScreen) {
        hideScreen.classList.add('hidden');
    }
    if (showScreen) {
        showScreen.classList.remove('hidden');
        showScreen.classList.add('fade-in');
        setTimeout(() => showScreen.classList.remove('fade-in'), 500);
    }
}

// === Gestão de Telas ===
function startGame() {
    const nameInput = document.getElementById('playerName').value.trim();
    const nameError = document.getElementById('nameError');
    if (!validateName(nameInput)) {
        nameError.textContent = 'Nome inválido! Use apenas letras, números e espaços (máx. 20 caracteres).';
        nameError.classList.add('show');
        return;
    }
    nameError.classList.remove('show');
    state.playerName = nameInput;
    document.getElementById('displayName').textContent = state.playerName;
    transitionScreen('difficulty-screen', 'intro-screen');
}

function setDifficulty(level) {
    state.dificuldade = level;
    transitionScreen('case-screen', 'difficulty-screen');
    loadCase();
}

function loadCase() {
    if (state.casosJulgados >= casos.length) {
        endGame();
        return;
    }
    state.currentCase = casos[state.casosJulgados];
    state.investigationsDone = 0;
    renderCase();
}

function renderCase() {
    const { currentCase } = state;
    document.getElementById('case-title').textContent = currentCase.titulo;
    document.getElementById('case-description').textContent = currentCase.descricao;
    document.getElementById('case-evidences').innerHTML = '<h3>Provas:</h3><ul>' + currentCase.provas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    const investigationDiv = document.getElementById('investigation-options');
    investigationDiv.innerHTML = state.investigationsDone < state.maxInvestigations ?
        '<h3>Opções de Investigação:</h3>' + currentCase.investigacoes.map((inv, i) => `<button data-investigation="${i}">${inv.acao}</button>`).join('') : '';
    const optionsDiv = document.getElementById('decision-options');
    optionsDiv.innerHTML = currentCase.decisoes
        .filter(d => !d.requiresInvestigation || state.investigationsDone > 0)
        .map((d, i) => `<button data-decision="${i}">${d.texto}</button>`).join('');
    updateReputation();
    transitionScreen('case-screen', null);
}

// === Lógica de Jogo ===
function investigate(index) {
    if (state.investigationsDone >= state.maxInvestigations) {
        showNotification('Você atingiu o limite de investigações para este caso.');
        return;
    }
    const inv = state.currentCase.investigacoes[index];
    state.investigationsDone++;
    applyEffects(inv.custo);
    state.currentCase.provas.push(inv.novaProva);
    showNotification(`Resultado da investigação: ${inv.resultado}`);
    renderCase();
}

function makeDecision(index) {
    const decision = state.currentCase.decisoes.filter(d => !d.requiresInvestigation || state.investigationsDone > 0)[index];
    applyEffects(decision.efeitos);
    state.casosJulgados++;

    if (state.apoioPopular <= 0 || state.respeitoInstitucional <= 0 || state.influenciaPolitica <= 0 || 
        state.relacaoImprensa <= 0 || state.relacaoGoverno <= 0 || state.relacaoONGs <= 0) {
        endGame();
        return;
    }

    // Evento Aleatório (35% de chance)
    const randomEventChance = Math.random();
    let eventMessage = '';
    if (randomEventChance < 0.35) {
        const possibleEvents = eventosAleatorios.filter(e => !e.condicao || e.condicao());
        if (possibleEvents.length > 0) {
            const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
            eventMessage = `<p><strong>Evento Inesperado:</strong> ${event.texto}</p>`;
            applyEffects(event.efeitos);
        }
    }

    document.getElementById('media-headline').textContent = decision.manchete;
    document.getElementById('media-reactions').innerHTML = `
        ${eventMessage}
        <p><strong>Reação Popular:</strong> ${decision.reacaoPopular}</p>
        <p><strong>Reação da Mídia:</strong> ${decision.reacaoMidia}</p>
    `;
    transitionScreen('media-screen', 'case-screen');
}

function viewMedia() {
    document.getElementById('media-headline').textContent = "O que estão dizendo sobre o caso...";
    document.getElementById('media-reactions').innerHTML = state.currentCase.midia.map(m => `<p>${m}</p>`).join('');
    transitionScreen('media-screen', 'case-screen');
}

function showDiplomacyScreen() {
    document.getElementById('diplomacyName').textContent = state.playerName;
    transitionScreen('diplomacy-screen', 'media-screen');
}

function diplomacyAction(faction) {
    let message = '';
    if (faction === 'imprensa') {
        applyEffects({ relacaoImprensa: 15, relacaoGoverno: -5 });
        message = 'Entrevista à Imprensa Livre fortalece sua relação com a mídia, mas irrita o governo.';
    } else if (faction === 'governo') {
        applyEffects({ relacaoGoverno: 15, relacaoImprensa: -5 });
        message = 'Negociações com o governo melhoram sua posição política, mas a imprensa desconfia.';
    } else if (faction === 'ongs') {
        applyEffects({ relacaoONGs: 15, relacaoGoverno: -5 });
        message = 'Reunião com ONGs reforça sua imparcialidade, mas desagrada o governo.';
    }
    showNotification(message);
    transitionScreen('case-screen', 'diplomacy-screen');
    loadCase();
}

function skipDiplomacy() {
    transitionScreen('case-screen', 'diplomacy-screen');
    loadCase();
}

function endGame() {
    let finalText = '';
    if (state.apoioPopular <= 0) {
        finalText = `${state.playerName}, você foi deposto pela pressão pública. O povo perdeu toda a confiança em suas decisões, e multidões invadiram o tribunal.`;
    } else if (state.respeitoInstitucional <= 0) {
        finalText = `${state.playerName}, as instituições revogaram seu poder. Sua falta de imparcialidade acabou com sua carreira, e o Supremo foi dissolvido.`;
    } else if (state.influenciaPolitica <= 0) {
        finalText = `${state.playerName}, você foi silenciado pelas elites. Sem apoio político, seu tribunal foi dissolvido por decreto presidencial.`;
    } else if (state.relacaoImprensa <= 0) {
        finalText = `${state.playerName}, a imprensa destruiu sua reputação. Acusado de corrupção, você foi afastado em desgraça.`;
    } else if (state.relacaoGoverno <= 0) {
        finalText = `${state.playerName}, o governo conspirou contra você. Seu tribunal foi dissolvido por uma votação emergencial no Congresso.`;
    } else if (state.relacaoONGs <= 0) {
        finalText = `${state.playerName}, ONGs internacionais denunciaram suas decisões. Você perdeu a legitimidade global e foi forçado a renunciar.`;
    } else if (state.apoioPopular > 80 && state.respeitoInstitucional > 80 && state.influenciaPolitica > 80) {
        finalText = `${state.playerName}, você se tornou um ícone de justiça. O povo, as instituições e as elites respeitam sua imparcialidade. Parabéns, Juiz Supremo!`;
    } else {
        finalText = `${state.playerName}, sua carreira foi marcada por controvérsias. Você sobreviveu aos 10 casos, mas seu legado é incerto.`;
    }
    document.getElementById('endName').textContent = state.playerName;
    document.getElementById('end-description').textContent = finalText;
    transitionScreen('end-screen', 'case-screen');
}

function restartGame() {
    Object.assign(state, {
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
        investigationsDone: 0
    });
    document.getElementById('playerName').value = '';
    transitionScreen('intro-screen', 'end-screen');
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Botão Iniciar
    document.getElementById('startButton').addEventListener('click', startGame);
    
    // Dificuldades
    document.getElementById('difficultyEasy').addEventListener('click', () => setDifficulty('fácil'));
    document.getElementById('difficultyMedium').addEventListener('click', () => setDifficulty('médio'));
    document.getElementById('difficultyHard').addEventListener('click', () => setDifficulty('difícil'));
    
    // Investigações
    document.getElementById('investigation-options').addEventListener('click', (e) => {
      const index = e.target.dataset.investigation;
      if (index !== undefined) {
        investigate(Number(index));
      }
    });
    
    // Decisões
    document.getElementById('decision-options').addEventListener('click', (e) => {
      const index = e.target.dataset.decision;
      if (index !== undefined) {
        makeDecision(Number(index));
      }
    });
    
    // Botão de Mídia
    document.getElementById('viewMediaButton').addEventListener('click', viewMedia);
    
    // Ações Diplomáticas
    document.getElementById('diplomacy-imprensa').addEventListener('click', () => diplomacyAction('imprensa'));
    document.getElementById('diplomacy-governo').addEventListener('click', () => diplomacyAction('governo'));
    document.getElementById('diplomacy-ongs').addEventListener('click', () => diplomacyAction('ongs'));
    document.getElementById('skip-diplomacy').addEventListener('click', skipDiplomacy);
    
    // Reiniciar Jogo
    document.getElementById('restartButton').addEventListener('click', restartGame);
  } catch (error) {
    console.error('Erro ao inicializar eventos:', error);
    showNotification('Erro ao carregar o jogo. Tente novamente.');
  }
});
