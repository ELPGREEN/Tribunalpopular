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
        texto: `**Noite de Fúria e Cinzas: A Revolta que Paralisou a Capital**<br><br>
        Quando as luzes da cidade começaram a se apagar e o crepitar do fogo tomou conta das ruas, ninguém podia prever a dimensão da revolta que estava prestes a explodir. Milhares de pessoas, cansadas de esperar por justiça, tomaram as avenidas principais, erguendo barricadas feitas de pneus em chamas, enquanto o céu se tornava uma cortina escura de fumaça e desespero.<br><br>
        O som das sirenes e os gritos de ordem ecoavam pelo ar pesado, carregado de revolta e esperança. Os manifestantes, usando a hashtag <strong>#ForaJuiz</strong>, expressavam sua indignação contra uma decisão judicial que, para muitos, simbolizava o retrocesso de seus direitos.<br><br>
        Era mais do que um protesto – era um clamor profundo por mudanças, pela voz do povo que se recusava a ser silenciada. Em cada esquina, lágrimas, faíscas e coragem se misturavam numa noite que ficará gravada na memória da cidade.`,
        efeitos: { apoioPopular: -10, relacaoImprensa: -5 },
        condicao: () => state.relacaoImprensa < 25 || state.apoioPopular < 30,
        imagem: "/imagens/protestos.jpg"
    },
    {
        id: "elogio_ong",
        texto: `**Um Farol na Tempestade: ONG Internacional Reconhece a Coragem do Juiz**<br><br>
        Em meio a ventos turbulentos que sacodem a estrutura do sistema judiciário, surge uma luz que atravessa as nuvens densas da crise: um relatório da ONG “Justiça Sem Fronteiras” que exalta o juiz como um exemplo de integridade e coragem.<br><br>
        O documento, celebrado internacionalmente, destaca a incansável luta do magistrado pela verdade e pela equidade, lembrando a todos que, mesmo nos momentos mais sombrios, há aqueles que resistem firmes contra as adversidades.<br><br>
        Este reconhecimento transcende fronteiras, oferecendo esperança e inspiração para uma sociedade que busca justiça real e renovada. É um testemunho do poder da ética e da perseverança contra as tempestades políticas que ameaçam abalar os alicerces da democracia.`,
        efeitos: { respeitoInstitucional: 10, relacaoONGs: 10 },
        condicao: () => state.relacaoONGs > 75,
        imagem: "/imagens/elogio_ong.jpg"
    },
    {
        id: "vazamento",
        texto: `**Vazamento Explosivo Abala Confiança: Áudios Revelam Conluio Polêmico**<br><br>
        Em um golpe que abalou os pilares da confiança pública, o tabloide “Verdade Agora” lançou ao vento áudios que sugerem uma aliança controversa entre o juiz e membros do governo. As gravações, que se espalharam como um incêndio nas redes sociais, lançaram dúvidas profundas sobre a integridade do magistrado.<br><br>
        Investigações urgentes foram iniciadas, enquanto o país mergulha numa tempestade de desconfiança e acusações cruzadas. Em meio a esse turbilhão, o povo se divide entre a dúvida e a necessidade de respostas, numa crise que pode redefinir os rumos da justiça.<br><br>
        O cenário político, já tenso, agora enfrenta um teste decisivo para sua sobrevivência, e a verdade parece escapar entre sombras e segredos revelados.`,
        efeitos: { influenciaPolitica: -15, relacaoImprensa: -10 },
        condicao: () => state.relacaoGoverno > 75 && state.relacaoImprensa < 50,
        imagem: "/imagens/vazamento.jpg"
    },
    {
        id: "apoio_popular",
        texto: `**Nasce uma Esperança: A Juventude se Une em Torno da Justiça com #JustiçaCom${state.playerName}**<br><br>
        Quando o silêncio parecia dominar, uma onda de esperança tomou conta das redes sociais. A hashtag <strong>#JustiçaCom${state.playerName}</strong> viralizou, unindo jovens de todas as regiões numa poderosa corrente de apoio e renovação.<br><br>
        Vídeos emocionantes, depoimentos sinceros e milhares de mensagens de incentivo se espalharam rapidamente, transformando o juiz em um símbolo vivo de coragem e compromisso com a verdade.<br><br>
        Essa mobilização digital transcende o virtual e ganha as ruas, acendendo uma chama de esperança para um futuro onde a justiça é para todos, sem exceções. É a voz da nova geração, exigindo transparência, ética e mudanças reais para o país.`,
        efeitos: { apoioPopular: 10, relacaoImprensa: 10 },
        condicao: () => state.relacaoImprensa > 75,
        imagem: "/imagens/apoio_popular.jpg"
    },
    {
        id: "pressao_governo",
        texto: `**Ameaça à Democracia: Presidente Pressiona por Dissolução do Tribunal**<br><br>
        Em um discurso carregado de tensão e determinação, o presidente do país lançou uma ameaça que reverberou por todo o país: caso o juiz continue a desafiar o governo, a dissolução do tribunal será inevitável.<br><br>
        Palavras duras que refletem uma crise institucional profunda, abalando os fundamentos da separação dos poderes e colocando em xeque a independência do Judiciário.<br><br>
        A população, atenta e apreensiva, observa um momento delicado onde o equilíbrio da democracia parece pender numa corda bamba. Entre aliados e opositores, cresce a incerteza sobre os próximos capítulos desta saga política que pode mudar para sempre o destino da nação.`,
        efeitos: { influenciaPolitica: -10, relacaoGoverno: -10 },
        condicao: () => state.relacaoGoverno < 25,
        imagem: "/imagens/pressao_governo.jpg"
    },
    {
        id: "crise_economica",
        texto: `**Economia em Queda Livre: Juiz se Torna Bode Expiatório da Instabilidade**<br><br>
        Com a inflação atingindo níveis alarmantes, disparando para 12%, o país vive um período de agitação e incertezas. Nas ruas, o descontentamento cresce, e o juiz, figura central das decisões que dividem opiniões, é apontado como responsável pela desestabilização econômica.<br><br>
        A bolsa de valores despencou 5% num único dia, enquanto protestos tomam conta das praças, com manifestantes clamando por mudanças e responsabilizando o magistrado pelos efeitos da crise.<br><br>
        Em meio a essa tempestade econômica e social, o cenário se complica, e a tensão entre o poder judiciário e a população alcança níveis inéditos, testando a resistência de todos os envolvidos.`,
        efeitos: { apoioPopular: -10, influenciaPolitica: -5 },
        condicao: () => state.apoioPopular < 50,
        imagem: "/imagens/crise_economica.jpg"
    },
    {
        id: "apoio_celebridade",
        texto: `**Quando a Cultura se Une à Justiça: Lívia Mendes Impulsiona Apoio Popular**<br><br>
        Em uma demonstração poderosa do poder da cultura pop, a renomada cantora Lívia Mendes lançou um vídeo em apoio ao juiz que ultrapassou a marca de 10 milhões de visualizações em menos de 24 horas.<br><br>
        Em suas palavras, o magistrado é a “voz da justiça” num momento em que o país mais precisa ouvir a verdade. A repercussão do vídeo não só mobilizou fãs, mas também reacendeu a chama da esperança em milhões de cidadãos que buscam uma transformação real.<br><br>
        Essa união entre arte e política mostra como a influência dos ícones culturais pode ser decisiva para fortalecer causas justas e mobilizar a sociedade em torno de valores essenciais.`,
        efeitos: { relacaoImprensa: 15, apoioPopular: 5 },
        condicao: () => state.relacaoImprensa > 50,
        imagem: "/imagens/apoio_celebridade.jpg"
    }
];


const casos = [
    {
        id: "caso_01",
        titulo: "O Roubo do Século na Fundação Esperança",
        descricao: `Brasília, 16 de março de 2024 – Em meio à maior crise humanitária do país, com milhões enfrentando a fome e o desemprego em alta, uma traição abala a nação. O carismático deputado João Almeida, presidente da Fundação Esperança, é acusado de desviar R$ 2,3 bilhões destinados a salvar vidas. Imagens explosivas, vazadas por um denunciante anônimo, mostram 15 malas abarrotadas de notas carimbadas pelo Banco Central em seu luxuoso escritório, enquanto gritos de revolta ecoam em protestos em 15 capitais. A ONG suíça Futuro Global, aliada de Almeida, tenta abafar o caso, alegando que o dinheiro financiou "projetos humanitários na África". Mas o povo, indignado, exige justiça. O destino de Almeida está nas mãos do tribunal, sob a pressão de uma nação traída.`,
        imagem: "/imagens/caso_01_malas_dinheiro.jpg",
        provas: [
            `Um vídeo clandestino, gravado às 2h17 de 10/03/2024 por um funcionário traído da Fundação, expõe o impensável: 15 malas de couro preto, abarrotadas de cédulas de R$ 100 carimbadas pelo Banco Central, empilhadas no escritório de João Almeida. A gravação captura o deputado contando o dinheiro com um sorriso cínico, enquanto murmura: "Isso é só o começo."`,
            `E-mails criptografados, interceptados de servidores da Fundação em 12/02/2024, revelam Almeida como o maestro de uma rede de corrupção. Sob o codinome "Líder", ele ordena transferências de R$ 500 milhões para empresas de fachada nas Ilhas Virgens, enquanto famílias famintas aguardavam ajuda que nunca chegou.`,
            `O testemunho devastador do ex-contador Pedro Costa, dado sob proteção policial em 15/03/2024, é um golpe mortal. Ameaçado de morte, ele confessa ter forjado relatórios financeiros para encobrir o desvio. Costa entrega um dossiê com 200 páginas de contratos falsos, todos assinados por Almeida, selando a traição contra o povo.`
        ],
        investigacoes: [
            {
                acao: "Contratar auditoria independente da PwC",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `Após 45 dias de uma investigação implacável, a PwC desnuda o esquema: 62% dos fundos da Fundação foram desviados para contas nas Ilhas Cayman, com Almeida assinando 90% das transações. Documentos revelam até laços com a máfia internacional, abalando as defesas da Futuro Global.`,
                novaProva: "Relatório devastador da PwC, com extratos bancários e mensagens criptografadas de Almeida."
            },
            {
                acao: "Interrogar ex-contador sob juramento",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Em um depoimento que parou o país, Pedro Costa, o ex-contador, chora ao revelar como Almeida o ameaçou para falsificar números. Ele entrega um vídeo secreto e um pen drive com contratos fraudulentos, provas que incendeiam a opinião pública.`,
                novaProva: "Vídeo de Almeida intimidando Costa e arquivos digitais com a trilha do dinheiro roubado."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Almeida com pena máxima de 15 anos",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -10, influenciaPolitica: -20, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: -10 },
                manchete: "Justiça Vinga o Povo! Almeida Apodrece na Cadeia por Roubo Bilionário!",
                reacaoPopular: "Praças lotadas vibram: 'O ladrão caiu! O Brasil não perdoa corruptos!' Fogos de artifício iluminam o céu em Brasília.",
                reacaoMidia: "Futuro Global clama por 'julgamento injusto', mas a Globo Nacional celebra: 'Um marco contra a impunidade!'"
            },
            {
                texto: "Absolver Almeida por insuficiência de provas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 15, influenciaPolitica: 10, relacaoImprensa: -15, relacaoGoverno: 10, relacaoONGs: 10 },
                manchete: "Vergonha Nacional! Tribunal Libera Almeida, o Ladrão dos Pobres!",
                reacaoPopular: "Caos em Brasília: manifestantes incendeiam pneus e gritam 'Justiça vendida!' nas redes com #AlmeidaLivre.",
                reacaoMidia: "Jornal do Povo detona: 'O tribunal cuspiu na cara do povo!'"
            },
            {
                texto: "Adiar decisão e exigir nova auditoria",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Enrola! Caso Esperança Fica no Limbo com Nova Auditoria!",
                reacaoPopular: "Redes sociais explodem em memes: 'O tribunal joga para debaixo do tapete! #JustiçaLenta'",
                reacaoMidia: "Voz do Povo critica: 'Adiar é proteger os poderosos. Queremos Almeida na cadeia!'"
            },
            {
                texto: "Condenar Almeida com base nas novas provas",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -25, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 0 },
                manchete: "Provas Esmagam Almeida! 12 Anos de Cadeia pelo Roubo do Século!",
                reacaoPopular: "O Brasil respira aliviado: 'Ninguém está acima da lei!' Multidões dançam nas ruas com bandeiras.",
                reacaoMidia: "Globo Nacional alerta: 'A condenação pode desencadear uma crise política sem precedentes.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'Almeida é o ladrão do século! Ele roubou a esperança dos famintos!'`,
            `Futuro Global: 'As acusações são uma farsa política para difamar um líder humanitário!'`,
            `Rede Social: 'Malas de dinheiro no escritório do Almeida! É o fim da linha! #PrisãoParaAlmeida'`,
            `TV Nacional: 'Escândalo da Fundação Esperança: o povo exige justiça ou revolta!'`
        ]
    },
    {
        id: "caso_02",
        titulo: "Capital em Chamas: A Revolta do Povo",
        descricao: `5 de abril de 2025 – A capital do país é um campo de batalha. Uma reforma tributária cruel, que esmagou a classe média com impostos dobrados enquanto protegia megacorporações, incendiou a ira popular. Liderados pelo carismático Rafael Torres, um ex-professor de 42 anos, milhares tomaram a Praça da Liberdade em um grito por justiça. Mas a noite virou tragédia: um incêndio devastador consumiu a Receita Nacional, com prejuízos de R$ 50 milhões. Vídeos acusam Torres de incitar a violência, enquanto seu movimento, Voz do Povo, aponta a brutalidade policial como estopim, com dezenas de feridos e prisões. Com a nação dividida entre ordem e revolução, o tribunal decidirá o destino de Torres e da liberdade de protestar.`,
        imagem: "/imagens/caso_02_incendio_praca.jpg",
        provas: [
            `Imagens exclusivas de um drone, capturadas às 22h03 de 05/04/2025, mostram o caos na Praça da Liberdade: 20 manifestantes, envoltos em fumaça preta, arremessam coquetéis molotov contra a Receita Nacional, enquanto chamas alaranjadas consomem o prédio. Ao fundo, Rafael Torres ergue um megafone, gritando palavras de ordem que ecoam na multidão enfurecida.`,
            `O depoimento do sargento Carlos Mendes, ferido na confusão, é um soco no estômago. Em 06/04/2025, com o braço imobilizado, ele acusa Torres de incitar o ataque: "Às 21h50, ouvi ele gritar 'Queimem tudo!' A multidão avançou como uma onda, e eu quase morri pisoteado."`,
            `Um relatório da ONG Liberdade Agora, publicado em 07/04/2025, contra-ataca com força: 12 testemunhas, incluindo uma mãe que perdeu seu filho de 15 anos no tumulto, relatam policiais disparando gás lacrimogêneo e balas de borracha contra famílias às 21h, antes de qualquer ato violento. As imagens anexadas mostram crianças sufocando em meio ao pânico.`
        ],
        investigacoes: [
            {
                acao: "Analisar câmeras de segurança da praça",
                custo: { respeitoInstitucional: -5, relacaoGoverno: -5 },
                resultado: `Dez câmeras revelam a verdade oculta: às 21h, policiais atiram gás lacrimogêneo sem provocação, desencadeando pânico. Às 22h15, um grupo radical incendeia o prédio. Torres aparece às 21h30, implorando por calma, mas é ignorado por uma facção enfurecida.`,
                novaProva: "Vídeo cristalino às 21h03 mostra policiais iniciando a repressão sem motivo."
            },
            {
                acao: "Ouvir testemunhas independentes",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `Comerciantes e uma jornalista freelance revelam que Torres pregava resistência pacífica às 20h. Um grupo dissidente, a Fúria Popular, ignorou suas ordens e iniciou o incêndio às 22h, expondo rachas no movimento e mudando a narrativa do caso.`,
                novaProva: "Declarações juramentadas de testemunhas que podem salvar Torres."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Torres por incitação à violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Torres na Cadeia! Justiça Esmaga Ativista por Caos na Capital!",
                reacaoPopular: "Jovens tomam universidades, gritando: 'Torres é inocente! Criminalizam nossa luta!' Barricadas ardem em protesto.",
                reacaoMidia: "Diário da Ordem aplaude: 'O tribunal salvou a ordem contra vândalos!'"
            },
            {
                texto: "Absolver Torres e investigar a polícia",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Revolta Vitoriosa! Torres Livre, Polícia Sob o Foco da Justiça!",
                reacaoPopular: "Milhares dançam na Praça da Liberdade: 'Torres é nosso herói! Chega de repressão!'",
                reacaoMidia: "Globo Nacional alerta: 'Decisão acende tensões e pode dividir o país.'"
            },
            {
                texto: "Adiar decisão e pedir diálogo nacional",
                efeitos: { apoioPopular: -10, respeitoInstitucional: 5, influenciaPolitica: 0, relacaoImprensa: -5, relacaoGoverno: 0, relacaoONGs: 5 },
                manchete: "Justiça Treme! Tribunal Adia Caso Torres e Clama por Paz!",
                reacaoPopular: "Redes fervem com #JustiçaCovarde: 'Adiar é fugir da verdade! Torres merece liberdade!'",
                reacaoMidia: "Jornal Progressista cobra: 'O povo quer justiça, não promessas vagas!'"
            },
            {
                texto: "Condenar radicais, absolver Torres",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 10, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Divide Culpa! Radicais Presos, Torres Livre para Lutar!",
                reacaoPopular: "Aplausos contidos: 'Torres salvo, mas a luta contra impostos injustos não para!'",
                reacaoMidia: "Voz do Povo exulta: 'Torres é a voz do povo! A batalha continua!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Voz do Povo: 'Torres é nosso líder! A repressão policial deve acabar ou o povo queimará tudo!'`,
            `Diário da Ordem: 'Torres é um incendiário! Sua prisão é a salvação da ordem pública!'`,
            `Rede Social: 'Torres preso é o fim da liberdade! Vamos às ruas! #LiberdadeParaTorres'`,
            `TV Nacional: 'Capital em chamas: Torres é herói ou vilão? O tribunal decide!'`
        ]
    },
    {
        id: "caso_03",
        titulo: "O Saque da PetroNação: Corrupção no Coração do País",
        descricao: `10 de abril de 2025 – A PetroNação, joia econômica que sustenta 40% do PIB, está manchada por um escândalo épico. Seu CEO, Carlos Mendes, ex-ministro e ícone da modernização, é acusado de orquestrar um esquema que superfaturou contratos no Campo Azul em R$ 580 milhões. Documentos vazados por um whistleblower heroico revelam uma teia de empresas fantasmas em paraísos fiscais, enquanto filas nos postos e preços de combustíveis sufocam o povo. Mendes, em lágrimas na TV, jura ser vítima de uma "conspiração política". Mas aliados no Congresso temem que sua queda desencadeie um colapso energético. O tribunal enfrenta um dilema: justiça ou estabilidade?`,
        imagem: "/imagens/caso_03_documentos_fantasmas.jpg",
        provas: [
            `Um dossiê de 150 páginas, vazado por um whistleblower em 08/04/2025, expõe contratos assinados por Carlos Mendes entre 2023 e 2024. Os documentos mostram preços inflados em 30% para sondas no Campo Azul, com R$ 200 milhões desviados para empresas sem endereço físico, registradas em paraísos fiscais.`,
            `O testemunho de Paulo Ribeiro, ex-gerente da PetroNação demitido em 2023, é uma bomba. Em 09/04/2025, ele revela reuniões secretas em hotéis de luxo no Rio, onde Mendes negociava propinas de R$ 10 milhões em contas no Panamá, rindo enquanto brindava com champanhe.`,
            `E-mails interceptados pela Polícia Federal, datados de 01/03/2024, mostram Mendes e o senador Roberto Lima tramando "acordos estratégicos". As mensagens detalham a divisão de lucros entre empreiteiras e cargos prometidos no governo, em troca de apoio ao esquema do Campo Azul.`
        ],
        investigacoes: [
            {
                acao: "Contratar peritos contábeis da Deloitte",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `A Deloitte destrói as defesas de Mendes: 12 contratos superfaturados drenaram R$ 420 milhões, com rastros levando a empresas de fachada. Um consultor misterioso, ligado a empreiteiras, emerge como peça-chave do esquema.`,
                novaProva: "Relatório da Deloitte com mapas financeiros e organogramas das empresas fantasmas."
            },
            {
                acao: "Rastrear contas internacionais",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: `Uma trilha de dinheiro leva ao Panamá, onde R$ 15 milhões foram depositados em nome de João Pereira, um ex-assessor da PetroNação. Extratos mostram transferências suspeitas dias após reuniões com Mendes.`,
                novaProva: "Extratos bancários do Panamá com datas e valores incriminadores."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Mendes por corrupção ativa",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: -5 },
                manchete: "Mendes na Cadeia! PetroNação Livre do Rei da Corrupção!",
                reacaoPopular: "Motoristas celebram nos postos: 'Mendes caiu! O petróleo é nosso!' Bandeiras do Brasil tremulam em protestos.",
                reacaoMidia: "Jornal do Povo exulta: 'Justiça contra os ladrões do nosso ouro negro!'"
            },
            {
                texto: "Absolver Mendes por falta de provas diretas",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: 10 },
                manchete: "Escárnio Nacional! Mendes Escapa Livre do Escândalo PetroNação!",
                reacaoPopular: "Refinarias viram palco de revolta: 'O tribunal vendeu nossa justiça!' #ForaMendes domina as redes.",
                reacaoMidia: "Globo Nacional defende: 'Sem provas diretas, a absolvição evita uma crise energética.'"
            },
            {
                texto: "Investigar toda a rede de contratos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "PetroNação Sob Cerco! Tribunal Exige Verdade na Corrupção!",
                reacaoPopular: "Ceticismo reina: 'Mais investigação? Vão enterrar o caso!' #PetroNaçãoLivre nas redes.",
                reacaoMidia: "Jornal Progressista pondera: 'Passo certo, mas o povo clama por punição já.'"
            },
            {
                texto: "Condenar assessores, absolver Mendes",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 5, relacaoGoverno: 5, relacaoONGs: 5 },
                manchete: "Justiça Tímida! Assessores Pagam, Mendes Foge do Julgamento!",
                reacaoPopular: "Frustração mista: 'Pegaram os peixes pequenos, mas o tubarão Mendes nada livre!'",
                reacaoMidia: "Voz do Povo critica: 'Queremos o chefão da corrupção, não os capangas!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'Mendes saqueou nosso petróleo! Cadeia nele agora!'`,
            `Globo Nacional: 'Acusações contra Mendes podem ser armação para desestabilizar o governo!'`,
            `Rede Social: 'PetroNação é um ninho de ladrões! Mendes tem que cair! #ForaMendes'`,
            `TV Nacional: 'Escândalo da PetroNação: corrupção ou conspiração? O povo quer respostas!'`
        ]
    },
    {
        id: "caso_04",
        titulo: "Lágrimas no Vale Verde: A Tragédia Ambiental do Século",
        descricao: `20 de abril de 2025 – O Vale do Rio Claro, um paraíso verde, virou um deserto tóxico. A barragem da mineradora Vale Verde, sob comando do magnata Otávio Reis, colapsou, liberando 10 milhões de metros cúbicos de lama envenenada. Três vilarejos foram apagados do mapa, 28 vidas perdidas – incluindo 10 crianças – e o rio Claro, sustento de 200 mil agricultores, agora é um túmulo de mercúrio. A Vale Verde aponta o dedo para a Frente Verde, acusando um "ataque terrorista" baseado em protestos dias antes. Mas ONGs como Terra Viva exibem relatórios de negligência desde 2022. Com famílias chorando seus mortos e o mundo assistindo, o tribunal decidirá quem paga por essa catástrofe.`,
        imagem: "/imagens/caso_04_barragem_destruida.jpg",
        provas: [
            `Um relatório interno da Vale Verde, datado de 15/10/2022 e vazado por um engenheiro anônimo, é uma confissão de culpa. O documento detalha rachaduras de 30 cm na barragem, alertando para um "colapso iminente", mas Otávio Reis ordenou ignorar os reparos, priorizando lucros de R$ 50 milhões.`,
            `Vídeos gravados às 14h de 15/04/2025 mostram 30 ativistas da Frente Verde invadindo a sede da mineradora, carregando faixas com "Parem o crime ambiental!" e derrubando cercas. A Vale Verde usa as imagens para acusar sabotagem, alegando que explosivos foram plantados durante a invasão.`,
            `Um laudo independente, apresentado por engenheiros da USP em 22/04/2025, é devastador: a barragem colapsou devido à corrosão de pilares, sem manutenção desde 2022. Fotos anexas mostram rachaduras visíveis a olho nu, ignoradas pela Vale Verde enquanto o rio Claro agonizava.`
        ],
        investigacoes: [
            {
                acao: "Enviar equipe técnica da USP ao local",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `A USP expõe a negligência criminosa: reformas foram cortadas em R$ 20 milhões, deixando a barragem à beira do colapso. Mas traços de explosivos caseiros nos escombros sugerem um ato isolado de sabotagem, complicando o caso.`,
                novaProva: "Relatório técnico com fotos de rachaduras e resíduos de explosivos."
            },
            {
                acao: "Investigar a Frente Verde",
                custo: { respeitoInstitucional: -5, relacaoONGs: -10 },
                resultado: `Clara Souza, líder da Frente Verde, nega qualquer ataque, mas um ex-membro confessa um "ato simbólico" com explosivos para chamar atenção. Ele jura que não planejava o colapso, mas sua confissão incendeia o debate.`,
                novaProva: "Confissão escrita do ex-ativista, detalhando o plano."
            }
        ],
        decisoes: [
            {
                texto: "Multar a Vale Verde em R$ 5 bilhões por negligência",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -10, relacaoONGs: 15 },
                manchete: "Vale Verde Sangra! Multa Bilionária por Matar o Rio Claro!",
                reacaoPopular: "Agricultores celebram: 'Justiça para o Vale! As empresas pagarão!' #RioClaroVive nas redes.",
                reacaoMidia: "Terra Viva aplaude: 'Multa é só o começo! Queremos o rio limpo!'"
            },
            {
                texto: "Condenar a Frente Verde por terrorismo",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 10, relacaoONGs: -15 },
                manchete: "Ativistas na Cadeia! Frente Verde Culpada pela Tragédia do Vale!",
                reacaoPopular: "ONGs protestam: 'Culparam os heróis do meio ambiente! Vergonha!'",
                reacaoMidia: "Diário da Ordem celebra: 'Radicalismo ambiental foi punido!'"
            },
            {
                texto: "Exigir investigação federal completa",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Hesita! Vale Verde Escapa com Nova Investigação!",
                reacaoPopular: "Famílias choram: 'Nossos mortos merecem justiça agora! #ValeVerdeMata'",
                reacaoMidia: "Jornal Progressista alerta: 'Adiar é perigoso. O povo clama por ação.'"
            },
            {
                texto: "Multar Vale Verde e prender sabotadores",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 0, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: 0, relacaoONGs: 5 },
                manchete: "Justiça Dura! Vale Verde Multada, Ativistas Radicais Presos!",
                reacaoPopular: "Apoio misto: 'Os culpados pagaram, mas o rio Claro precisa renascer!'",
                reacaoMidia: "Globo Nacional pondera: 'Solução equilibrada para um desastre complexo.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Terra Viva: 'Vale Verde assassinou o Vale do Rio Claro! Justiça ou revolta!'`,
            `Diário da Ordem: 'Ativistas terroristas destruíram a Vale Verde! Cadeia neles!'`,
            `Rede Social: 'O rio Claro virou veneno! Quem paga pelas crianças mortas? #JustiçaAmbiental'`,
            `TV Nacional: 'Tragédia no Vale Verde: negligência ou terrorismo? O tribunal decide!'`
        ]
    },
    {
        id: "caso_05",
        titulo: "Sombra: Herói ou Traidor da Nação?",
        descricao: `1º de maio de 2025 – Um terremoto político sacode o país. O hacker Sombra, revelado como Lucas Ferreira, um ex-analista de 32 anos do Ministério da Defesa, expôs 50 mil documentos secretos que incriminam a elite do poder. Os arquivos, divulgados em um site criptografado, mostram corrupção envolvendo 12 deputados, 3 juízes e até o vice-presidente, além de um esquema de vigilância ilegal contra 200 jornalistas e ativistas. Para milhões, Sombra é um herói da verdade; para o governo, um traidor que expôs bases militares e ameaça a segurança nacional. Com protestos pró e contra Sombra em 10 cidades e a ONU observando, o tribunal decidirá o futuro da transparência e da soberania.`,
        imagem: "/imagens/caso_05_hacker_sombra.jpg",
        provas: [
            `Um pacote de 50 mil documentos, vazado por Sombra em 30/04/2025, detalha um esquema de corrupção avassalador: planilhas mostram propinas de R$ 200 milhões pagas a 12 deputados, com recibos assinados em hotéis de Dubai, enquanto o vice-presidente recebia depósitos em contas secretas.`,
            `Análise forense, conduzida pela Polícia Federal em 01/05/2025, confirma a identidade de Sombra como Lucas Ferreira. Metadados revelam que ele usou um laptop em um café de São Paulo às 23h de 28/04/2025, enviando os arquivos de um servidor criptografado na Islândia, desafiando a segurança nacional.`,
            `Um alerta do ministro da Defesa, em pronunciamento às 10h de 02/05/2025, expõe o perigo: entre os arquivos vazados, estão coordenadas de 5 bases militares estratégicas no Amazonas, com detalhes de defesas antimísseis, potencialmente comprometendo a soberania do país.`
        ],
        investigacoes: [
            {
                acao: "Validar autenticidade dos documentos",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: `Peritos da Unicamp confirmam: 95% dos documentos são autênticos, expondo um esquema de corrupção de R$ 200 milhões. Mas 5% contêm dados militares sensíveis, causando pânico no Exército e complicando a defesa de Sombra.`,
                novaProva: "Relatório da Unicamp com validação dos arquivos e alertas sobre os dados militares."
            },
            {
                acao: "Rastrear identidade de Sombra",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Sombra é Lucas Ferreira, demitido em 2023 por denunciar irregularidades. Ele é apoiado pelo grupo Transparência Global, que o chama de 'mártir da verdade'. Um dossiê da inteligência revela suas motivações pessoais contra o governo.`,
                novaProva: "Dossiê secreto sobre Ferreira, com mensagens trocadas com ciberativistas."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Sombra por traição",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 20, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Sombra Silenciado! Hacker Preso por Trair o Brasil!",
                reacaoPopular: "Universidades pegam fogo: 'Sombra é nosso herói! Liberdade para a verdade!' #VazaTudo",
                reacaoMidia: "Diário da Ordem celebra: 'Traidores como Sombra merecem a cadeia!'"
            },
            {
                texto: "Absolver Sombra como denunciante",
                efeitos: { apoioPopular: 25, respeitoInstitucional: -15, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Sombra Coroado! Tribunal Declara Hacker Herói da Transparência!",
                reacaoPopular: "Praças explodem em festa: 'Sombra venceu a corrupção! Viva a verdade!'",
                reacaoMidia: "Globo Nacional alerta: 'Decisão pode derrubar o governo e abrir crise.'"
            },
            {
                texto: "Investigar corrupção nos documentos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Justiça Foca na Corrupção! Sombra Aguarda em Suspenso!",
                reacaoPopular: "Redes desconfiam: 'Vão esconder tudo! Sombra precisa de proteção!' #VazaTudo",
                reacaoMidia: "Jornal Progressista apoia: 'Corrupção em foco, mas Sombra é o herói.'"
            },
            {
                texto: "Proteger Sombra e investigar corrupção",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -10, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -25, relacaoONGs: 10 },
                manchete: "Sombra Salvo! Tribunal Lança Caça aos Corruptos Expostos!",
                reacaoPopular: "Euforia nacional: 'Sombra é nosso guardião! Fora corruptos!'",
                reacaoMidia: "Diário da Ordem ataca: 'Proteger Sombra é um tapa na segurança nacional!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal Progressista: 'Sombra é o herói que revelou a podridão do poder!'`,
            `Diário da Ordem: 'Sombra traiu o Brasil! Cadeia para o hacker criminoso!'`,
            `Rede Social: 'Sombra contra a corrupção! Quem está com ele? #VazaTudo'`,
            `TV Nacional: 'Sombra: herói ou vilão? O vazamento que abalou a nação!'`
        ]
    },
    {
        id: "caso_06",
        titulo: "A Queda do Império Digital: Conexão Global Manipulada",
        descricao: `10 de maio de 2025 – Eduardo Viana, o gênio de 38 anos por trás da Conexão Global, a rede social de R$ 10 bilhões usada por 70% dos brasileiros, está no centro de um furacão. Relatórios vazados por uma ex-engenheira traída acusam Viana de manipular algoritmos para favorecer candidatos governistas nas eleições de 2024, suprimindo críticas e amplificando propaganda em 500 milhões de visualizações. Em uma coletiva dramática, Viana nega tudo, acusando "inimigos estrangeiros" de atacar a inovação brasileira. Com a democracia e a privacidade em xeque, o tribunal decidirá se Viana é um manipulador ou vítima de uma conspiração global.`,
        imagem: "/imagens/caso_06_conexao_global.jpg",
        provas: [
            `Um relatório técnico da USP, publicado em 08/05/2025, destrói a Conexão Global: entre julho e outubro de 2024, algoritmos foram ajustados para promover posts pró-governo em 80% dos feeds, enquanto críticas ao governo eram suprimidas, afetando 50 milhões de usuários diariamente.`,
            `O depoimento de Ana Clara Mendes, ex-engenheira demitida em 2023, é um golpe fatal. Em 09/05/2025, ela entrega e-mails de Viana ordenando manipulações em reuniões secretas às 23h, com ameaças de demissão: "Se não ajustarem os feeds, ninguém aqui terá emprego amanhã."`,
            `Em uma entrevista à TV Nacional às 20h de 10/05/2025, Viana chora diante das câmeras, jurando inocência: "Isso é uma caçada política contra a tecnologia brasileira!" Seus aliados compartilham a hashtag #VianaInocente, mas mensagens de apoio são abafadas por críticas nas redes.`
        ],
        investigacoes: [
            {
                acao: "Analisar servidores da Conexão Global",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Peritos invadem os servidores e encontram logs de 2024 confirmando manipulação de algoritmos. Ricardo Lopes, gerente sênior, é apontado como executor, mas mensagens sugerem que Viana sabia de tudo.`,
                novaProva: "Logs de servidores com alterações datadas de 15/09/2024 e ordens indiretas de Viana."
            },
            {
                acao: "Interrogar ex-funcionários sob sigilo",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `Três ex-funcionários entregam uma gravação explosiva: Viana, em 01/08/2024, pressiona a equipe a "otimizar" conteúdos pró-governo, ameaçando cortes salariais. A prova pode selar seu destino.`,
                novaProva: "Gravação de reunião com Viana dando ordens claras."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Viana por manipulação eleitoral",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Viana Desmascarado! Magnata Digital Preso por Roubar Eleições!",
                reacaoPopular: "Redes vibram: 'A internet é nossa! Justiça contra manipuladores!' #DesligaConexão",
                reacaoMidia: "Jornal Progressista celebra: 'Um marco pela democracia digital!'"
            },
            {
                texto: "Absolver Viana por falta de provas diretas",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Vergonha Digital! Viana Escapa Livre do Escândalo Eleitoral!",
                reacaoPopular: "Fúria online: 'O tribunal protege bilionários! Nossa voz foi roubada!'",
                reacaoMidia: "Diário da Ordem defende: 'Sem provas, a absolvição protege a liberdade.'"
            },
            {
                texto: "Regular a Conexão Global com novas leis",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -10, relacaoImprensa: 5, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Conexão Global na Mira! Tribunal Impõe Regras contra Manipulação!",
                reacaoPopular: "Apoio morno: 'Bom, mas queremos Viana na cadeia!'",
                reacaoMidia: "Globo Nacional debate: 'Regulação é essencial, mas pode virar censura.'"
            },
            {
                texto: "Condenar Viana e banir Conexão Global",
                efeitos: { apoioPopular: 25, respeitoInstitucional: -10, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -25, relacaoONGs: 5 },
                manchete: "Fim do Império! Viana Preso, Conexão Global Banida do Brasil!",
                reacaoPopular: "Euforia digital: 'Chega de manipulação! A internet voltou ao povo!'",
                reacaoMidia: "Jornal do Povo exulta: 'Decisão radical contra os tiranos digitais!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'Viana roubou nossa democracia! Prisão e banimento já!'`,
            `Tech News: 'Conexão Global é vítima de uma cruzada política internacional!'`,
            `Rede Social: 'Viana controla o que você vê! Desliguem a Conexão Global! #DesligaConexão'`,
            `TV Nacional: 'Conexão Global: inovação brasileira ou arma política? O tribunal responde!'`
        ]
    },
    {
        id: "caso_07",
        titulo: "Massacre na Fronteira: O Grito dos Refugiados",
        descricao: `25 de abril de 2025 – A fronteira norte do Brasil é um cenário de guerra. Milhares de refugiados, fugindo de uma guerra civil que devastou 50 mil vidas no país vizinho, enfrentaram a Guarda Nacional no rio Amazonas. Sob o comando do implacável General Vargas, a repressão terminou em tragédia: 15 mortos, incluindo 3 crianças, e 80 feridos. O governo acusa os migrantes de atacar com pedras e paus, mas vídeos da ONG Fronteiras Abertas mostram soldados disparando gás lacrimogêneo contra famílias indefesas às 16h. Com o mundo horrorizado e protestos em 20 cidades, o tribunal decidirá entre soberania e humanidade.`,
        imagem: "/imagens/caso_07_fronteira_massacre.jpg",
        provas: [
            `Um vídeo angustiante, gravado às 16h10 de 25/04/2025 por um drone humanitário, mostra o desespero na margem do rio Amazonas: centenas de migrantes, incluindo idosos e crianças, jogam pedras contra barricadas da Guarda Nacional, enquanto soldados avançam com escudos e cassetetes em uma nuvem de gás lacrimogêneo.`,
            `Imagens da ONG Fronteiras Abertas, publicadas às 8h de 26/04/2025, são um grito de horror: às 16h, crianças de 5 a 10 anos sufocam com gás lacrimogêneo, enquanto mães imploram por ajuda em meio a uma multidão em pânico, fugindo de disparos de balas de borracha.`,
            `O testemunho de José Lima, um fazendeiro local, dado em 27/04/2025, abala a narrativa oficial: "Às 15h, vi os migrantes cruzarem minha terra, famintos e exaustos. Os soldados atiraram gás lacrimogêneo antes de qualquer pedra, como se quisessem provocar o caos."`
        ],
        investigacoes: [
            {
                acao: "Coletar depoimentos de migrantes sobreviventes",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `Dez migrantes, incluindo uma mãe que perdeu seu filho, relatam horror: às 15h45, soldados dispararam gás e balas de borracha sem aviso, provocando pânico. Eles juram que só queriam asilo, não violência.`,
                novaProva: "Depoimentos gravados de migrantes, com lágrimas e detalhes do massacre."
            },
            {
                acao: "Analisar vídeos de drones independentes",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Imagens de um drone civil são um divisor de águas: às 15h45, soldados iniciam o ataque com gás, antes de qualquer pedra ser jogada. Às 16h10, migrantes retaliaram em desespero, mudando a narrativa oficial.`,
                novaProva: "Vídeo de drone mostrando a agressão inicial dos soldados."
            }
        ],
        decisoes: [
            {
                texto: "Condenar líderes migrantes por violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Migrantes na Cadeia! Tribunal Pune Invasores da Fronteira!",
                reacaoPopular: "ONGs se revoltam: 'Culparam as vítimas! Crianças morreram!' #JustiçaMigrante",
                reacaoMidia: "Diário da Ordem aplaude: 'Fronteiras seguras contra o caos!'"
            },
            {
                texto: "Punir oficiais da Guarda por abuso",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça para os Fracos! Guardas Punidos por Massacre na Fronteira!",
                reacaoPopular: "Redes celebram: 'Humanidade venceu! Chega de matar refugiados!'",
                reacaoMidia: "Fronteiras Abertas exulta: 'Um passo histórico pelos direitos humanos!'"
            },
            {
                texto: "Mediar acordo humanitário com a ONU",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Paz na Fronteira! Tribunal Chama ONU para Salvar Refugiados!",
                reacaoPopular: "Esperança tímida: 'Queremos ações, não só palavras!'",
                reacaoMidia: "Globo Nacional apoia: 'Mediação pode evitar mais sangue.'"
            },
            {
                texto: "Punir soldados e líderes, propor reformas",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Justiça e Esperança! Culpados Punidos, Fronteira Será Reformada!",
                reacaoPopular: "Apoio nas ruas: 'Justiça para os mortos, futuro para os vivos!'",
                reacaoMidia: "Jornal Progressista celebra: 'Solução corajosa para uma tragédia humana.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Fronteiras Abertas: 'Guardas massacraram inocentes! Justiça para os refugiados!'`,
            `Diário da Ordem: 'Migrantes são invasores! Deportação já!'`,
            `Rede Social: 'Crianças assassinadas na fronteira! Quem paga por isso? #JustiçaMigrante'`,
            `TV Nacional: 'Fronteira em crise: soberania ou humanidade? O tribunal decide!'`
        ]
    },
    {
        id: "caso_08",
        titulo: "O Veneno da BioVida: A Tragédia das Vacinas Falsas",
        descricao: `1º de maio de 2025 – Uma traição mortal abala o país. A BioVida, gigante farmacêutica, é acusada de vender 2 milhões de doses falsas da vacina contra a febre do Delta, uma epidemia que matou 3 mil pessoas, incluindo 500 crianças. Laudos revelam que as doses eram apenas água salgada, enquanto famílias confiavam na cura. A CEO Helena Costa culpa fornecedores chineses por "sabotagem", mas e-mails internos mostram sua obsessão por lucros. O governo, que aprovou a vacina em tempo recorde, tenta abafar o caso, mas marchas de luto em 20 cidades exigem justiça. Com a OMS em alerta, o tribunal decidirá o destino da saúde pública.`,
        imagem: "/imagens/caso_08_vacinas_falsas.jpg",
        provas: [
            `Um laudo do Instituto Nacional de Saúde, publicado às 9h de 01/05/2025, é uma sentença de morte para a BioVida: 30% das vacinas contra a febre do Delta, distribuídas em 2024, eram apenas água salgada. Testes em 500 amostras mostram zero traços de imunizantes, deixando milhares à mercê da epidemia.`,
            `E-mails internos da BioVida, vazados em 29/04/2025, revelam a ganância de Helena Costa. Em 10/12/2023, ela ordena cortar testes de qualidade para "maximizar lucros", escrevendo: "Se atrasarmos a entrega, perdemos o contrato. A segurança vem depois."`,
            `O depoimento de Maria Silva, enfermeira e mãe que perdeu seu filho de 8 anos em 2024, é de partir o coração. Em 30/04/2025, ela chora diante de câmeras: "Apliquei a vacina no meu menino, confiando na BioVida. Eles o mataram com uma seringa cheia de nada!"`
        ],
        investigacoes: [
            {
                acao: "Testar amostras em laboratórios da Fiocruz",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `A Fiocruz confirma o horror: 35% das vacinas eram ineficazes, produzidas em uma fábrica chinesa sob ordens da BioVida para ignorar protocolos. Documentos internos mostram que Costa sabia dos riscos.`,
                novaProva: "Relatório químico da Fiocruz com provas de negligência."
            },
            {
                acao: "Investigar fornecedores chineses",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `A fábrica chinesa admite falhas, mas aponta o dedo para a BioVida: contratos assinados por Costa em 2023 exigiam cortes de 40% nos custos, comprometendo a segurança. A revelação choca o mundo.`,
                novaProva: "Contratos assinados com cláusulas criminosas."
            }
        ],
        decisoes: [
            {
                texto: "Condenar BioVida por fraude e negligência",
                efeitos: { apoioPopular: 25, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 20, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "BioVida na Cadeia! Justiça Pune Assassinos das Vacinas Falsas!",
                reacaoPopular: "Famílias choram de alívio: 'Nossos mortos foram vingados! Fora BioVida!'",
                reacaoMidia: "Jornal do Povo celebra: 'Justiça contra a ganância que matou inocentes!'"
            },
            {
                texto: "Absolver BioVida, culpar fornecedores",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -10 },
                manchete: "Escárnio Mortal! BioVida Livre, China Leva Culpa pelas Vacinas!",
                reacaoPopular: "Revolta nacional: 'Protegeram assassinos! Nossos filhos morreram!' #ForaBioVida",
                reacaoMidia: "Globo Nacional defende: 'Absolvição evita crise na saúde.'"
            },
            {
                texto: "Ordenar recall imediato das vacinas",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: 5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "BioVida na Corda! Tribunal Exige Recall das Vacinas Falsas!",
                reacaoPopular: "Apoio tímido: 'Recall é pouco! Queremos Helena Costa na cadeia!'",
                reacaoMidia: "OMS alerta: 'Recall é crucial, mas punição é essencial.'"
            },
            {
                texto: "Condenar BioVida e reformar regulação",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 10, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -15, relacaoONGs: 15 },
                manchete: "Justiça e Futuro! BioVida Punida, Saúde Pública Será Reformada!",
                reacaoPopular: "Esperança nas ruas: 'Justiça para os mortos, segurança para todos!'",
                reacaoMidia: "Jornal Progressista exulta: 'Um marco para salvar vidas!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'BioVida matou nossos filhos! Helena Costa deve apodrecer na cadeia!'`,
            `Globo Nacional: 'Cuidado! Acusações contra BioVida podem ser exagero político.'`,
            `Rede Social: 'Vacinas falsas mataram milhares! BioVida é assassina! #ForaBioVida'`,
            `TV Nacional: 'Escândalo da BioVida: negligência ou conspiração? O povo exige justiça!'`
        ]
    },
    {
        id: "caso_09",
        titulo: "Inferno em São Marcos: A Revolta dos Condenados",
        descricao: `30 de abril de 2025 – A Penitenciária São Marcos, um caldeirão de superlotação e sofrimento, explodiu em uma rebelião sangrenta. Antônio 'Lobo' Silva, ex-líder comunitário preso por tráfico, liderou 3.200 detentos em uma revolta desesperada, tomando o bloco C e fazendo 10 guardas reféns. Eles exigem fim da superlotação, saúde básica e investigação de torturas brutais. O motim deixou 5 mortos e 20 feridos, com cenas de horror transmitidas ao vivo. O governo chama Lobo de "terrorista", mas ONGs como Direitos Já denunciam espancamentos semanais e condições desumanas. Com a nação em choque, o tribunal decidirá entre repressão ou reforma.`,
        imagem: "/imagens/caso_09_rebeliao_prisao.jpg",
        provas: [
            `Imagens ao vivo, transmitidas às 14h de 30/04/2025 por um canal de notícias, mostram o terror em São Marcos: presos armados com facas improvisadas ocupam o bloco C, gritando "Justiça ou morte!" enquanto 10 guardas, amarrados e ensanguentados, são exibidos como troféus.`,
            `Um relatório da Defensoria Pública, de 15/12/2024, expõe o inferno carcerário: celas com 10 presos em 4 metros quadrados, esgoto transborda, e surtos de tuberculose matam 5 detentos por mês. A falta de água potável força presos a beberem de canos contaminados.`,
            `O pronunciamento do ministro da Justiça às 9h de 01/05/2025 é implacável: "Antônio 'Lobo' Silva é um terrorista que planejou o motim para desestabilizar o sistema. Ele e seus seguidores são uma ameaça à sociedade!" O discurso é apoiado por imagens de armas apreendidas.`
        ],
        investigacoes: [
            {
                acao: "Inspecionar a penitenciária com peritos",
                custo: { apoioPopular: -5, relacaoImprensa: -5 },
                resultado: `Peritos revelam um pesadelo: celas superlotadas, esgoto transborda e medicamentos são inexistentes. Armas improvisadas entravam via guardas corruptos, que lucravam R$ 5 mil por mês em propinas.`,
                novaProva: "Relatório com fotos do inferno em São Marcos e armas contrabandeadas."
            },
            {
                acao: "Interrogar Lobo e líderes rebeldes",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Lobo confessa o motim, mas aponta torturas brutais como estopim. Ele entrega nomes de 3 guardas sádicos, confirmados por outros presos, que espancavam detentos semanalmente.`,
                novaProva: "Depoimento gravado de Lobo e testemunhos de vítimas de tortura."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Lobo por terrorismo",
                efeitos: { apoioPopular: -15, respeitoInstitucional: -10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Lobo Esmagado! Rebelde Preso por Terrorismo em São Marcos!",
                reacaoPopular: "ONGs protestam: 'Ignoraram o inferno da prisão! Lobo é vítima!'",
                reacaoMidia: "Diário da Ordem celebra: 'Criminosos como Lobo nunca vencerão!'"
            },
            {
                texto: "Investigar abusos e absolver Lobo",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 5, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça no Cárcere! Lobo Livre, Torturas em São Marcos Expostas!",
                reacaoPopular: "Redes vibram: 'Chega de abusos! Prisões precisam de humanidade!'",
                reacaoMidia: "Direitos Já exulta: 'Um grito de esperança contra a barbárie!'"
            },
            {
                texto: "Propor reformas no sistema prisional",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 10, influenciaPolitica: -5, relacaoImprensa: 10, relacaoGoverno: -5, relacaoONGs: 10 },
                manchete: "Prisões no Divã! Tribunal Propõe Revolução em São Marcos!",
                reacaoPopular: "Esperança cautelosa: 'Reformas são boas, mas queremos ação já!'",
                reacaoMidia: "Globo Nacional alerta: 'Reformas custarão caro, mas são urgentes.'"
            },
            {
                texto: "Punir guardas corruptos, absolver Lobo",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Justiça no Cárcere! Guardas Sádicos Presos, Lobo Livre!",
                reacaoPopular: "Apoio nas ruas: 'Fim da corrupção nas prisões! Lobo é herói!'",
                reacaoMidia: "Jornal Progressista aplaude: 'Um passo para humanizar o inferno.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Direitos Já: 'São Marcos é uma masmorra! Lobo luta pela dignidade humana!'`,
            `Diário da Ordem: 'Lobo é terrorista! Cadeia máxima para rebeldes!'`,
            `Rede Social: 'Presos vivem em um inferno! Quem pune os torturadores? #ReformaPrisional'`,
            `TV Nacional: 'Rebelião em São Marcos: justiça ou repressão? O tribunal decide!'`
        ]
    },
    {
        id: "caso_10",
        titulo: "O Julgamento do Presidente: A Queda de Santana",
        descricao: `15 de maio de 2025 – A nação está à beira do colapso. O presidente Miguel Santana, eleito com 55% dos votos, enfrenta acusações de abuso de poder por ordenar grampos ilegais contra 500 pessoas, incluindo senadores, jornalistas e aliados, na operação secreta 'Olho de Águia'. Documentos vazados por um ex-agente da ANI mostram Santana assinando ordens em 2023, enquanto gravações o capturam planejando "neutralizar inimigos". Em um discurso emocionado, ele jura ser vítima de um "golpe da oposição" e promete renunciar se condenado. Com protestos diários e o Congresso em chamas, o tribunal decidirá se Santana é um tirano ou um líder acuado.`,
        imagem: "/imagens/caso_10_grampos_santana.jpg",
        provas: [
            `Um dossiê secreto da ANI, vazado em 13/05/2025 por um ex-agente, expõe a operação 'Olho de Águia': documentos assinados por Santana em 10/01/2023 autorizam grampos ilegais contra 500 alvos, incluindo 20 senadores e 50 jornalistas, sem qualquer mandado judicial.`,
            `Gravações clandestinas, obtidas em 2024 e divulgadas em 14/05/2025, capturam Santana em uma reunião às 22h no Palácio do Planalto: "Neutralizem quem ameaça nosso projeto. Não me importo como!" Sua voz fria ecoa enquanto o chefe da ANI anota ordens.`,
            `O senador Eduardo Gomes, líder da oposição, denuncia em 12/05/2025: "Em 2023, encontrei microfones escondidos em meu gabinete, instalados pela ANI. Santana queria me calar porque revelei seus esquemas!" Fotos dos dispositivos acompanham a acusação.`
        ],
        investigacoes: [
            {
                acao: "Analisar legalidade da operação",
                custo: { influenciaPolitica: -10, relacaoGoverno: -10 },
                resultado: `Juristas confirmam: 'Olho de Águia' violou a Constituição, com grampos ilegais em massa. A ANI alega que Santana agiu em "emergência" para evitar um suposto golpe, mas não apresenta provas.`,
                novaProva: "Parecer jurídico detalhando as violações constitucionais."
            },
            {
                acao: "Interrogar ex-agentes da ANI",
                custo: { respeitoInstitucional: -5, relacaoONGs: -5 },
                resultado: `Dois ex-agentes entregam Santana: ele ordenou os grampos em reuniões às portas fechadas, mas acreditava estar salvando o país de uma conspiração. Suas confissões abalam o Palácio do Planalto.`,
                novaProva: "Depoimentos gravados dos ex-agentes, com detalhes das ordens de Santana."
            }
        ],
        decisoes: [
            {
                texto: "Condenar Santana por abuso de poder",
                efeitos: { apoioPopular: 25, respeitoInstitucional: 10, influenciaPolitica: -25, relacaoImprensa: 20, relacaoGoverno: -25, relacaoONGs: 15 },
                manchete: "Santana Derrubado! Presidente Preso por Espionagem Tirânica!",
                reacaoPopular: "Festas no Planalto: 'A democracia venceu! Fora espião!' Bandeiras tremulam em celebração.",
                reacaoMidia: "Jornal do Povo exulta: 'Fim de um ditador disfarçado!'"
            },
            {
                texto: "Absolver Santana por motivos de segurança",
                efeitos: { apoioPopular: -20, respeitoInstitucional: -10, influenciaPolitica: 20, relacaoImprensa: -15, relacaoGoverno: 20, relacaoONGs: -15 },
                manchete: "Vergonha Nacional! Santana Livre Após Espionar o Povo!",
                reacaoPopular: "Caos no Congresso: 'O tribunal coroou um ditador!' #ForaSantana domina as redes.",
                reacaoMidia: "Diário da Ordem defende: 'Absolvição evita o colapso político.'"
            },
            {
                texto: "Exigir investigação completa da ANI",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: -5, relacaoGoverno: -10, relacaoONGs: 5 },
                manchete: "Justiça Hesita! Tribunal Adia Caso Santana e Mira ANI!",
                reacaoPopular: "Frustração explode: 'Estão protegendo Santana! Queremos justiça!'",
                reacaoMidia: "Globo Nacional pondera: 'Cautela é necessária, mas o povo exige respostas.'"
            },
            {
                texto: "Condenar Santana e reformar a ANI",
                efeitos: { apoioPopular: 20, respeitoInstitucional: 10, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 10 },
                manchete: "Justiça e Renovação! Santana Preso, ANI Será Transformada!",
                reacaoPopular: "Apoio nacional: 'Santana caiu, e a democracia renasce!'",
                reacaoMidia: "Jornal Progressista celebra: 'Um marco para a liberdade!'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'Santana espionou o Brasil! Cadeia ou renúncia já!'`,
            `Diário da Ordem: 'Acusações são um golpe sujo! Santana salvou a nação!'`,
            `Rede Social: 'Presidente espião! Quem defende nossa liberdade? #ForaSantana'`,
            `TV Nacional: 'Santana no banco dos réus: tirano ou patriota? O tribunal decide!'`
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
    // Aplica os efeitos às métricas do estado, garantindo que fiquem entre 0 e 100
    for (const [key, value] of Object.entries(effects)) {
        if (key === 'apoioPopular') {
            state.apoioPopular = Math.max(0, Math.min(100, state.apoioPopular + value));
        }
        if (key === 'respeitoInstitucional') {
            state.respeitoInstitucional = Math.max(0, Math.min(100, state.respeitoInstitucional + value));
        }
        if (key === 'influenciaPolitica') {
            state.influenciaPolitica = Math.max(0, Math.min(100, state.influenciaPolitica + value));
        }
        if (key === 'relacaoImprensa') {
            state.relacaoImprensa = Math.max(0, Math.min(100, state.relacaoImprensa + value));
        }
        if (key === 'relacaoGoverno') {
            state.relacaoGoverno = Math.max(0, Math.min(100, state.relacaoGoverno + value));
        }
        if (key === 'relacaoONGs') {
            state.relacaoONGs = Math.max(0, Math.min(100, state.relacaoONGs + value));
        }
    }
}

function updateReputation() {
    // Atualiza a interface com os valores das métricas de reputação
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
        nameError.textContent = 'Nome inválido! Use letras, números e espaços (máximo de 20 caracteres).';
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
    document.getElementById('case-evidences').innerHTML = '<h3>Provas:</h3><ul>' + 
        currentCase.provas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    const investigationDiv = document.getElementById('investigation-options');
    investigationDiv.innerHTML = state.investigationsDone < state.maxInvestigations ?
        '<h3>Opções de Investigação:</h3>' + 
        currentCase.investigacoes.map((inv, i) => `<button data-investigation="${i}">${inv.acao}</button>`).join('') : '';
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
        showNotification('Limite de investigações atingido para este caso.');
        return;
    }
    const inv = state.currentCase.investigacoes[index];
    state.investigationsDone++;
    applyEffects(inv.custo);
    state.currentCase.provas.push(inv.novaProva);
    showNotification(`Investigação concluída: ${inv.resultado}`);
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
    document.getElementById('media-headline').textContent = "O que dizem sobre o caso...";
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
        message = 'Sua entrevista à Imprensa Livre conquistou a mídia, mas gerou desconfiança no governo.';
    } else if (faction === 'governo') {
        applyEffects({ relacaoGoverno: 15, relacaoImprensa: -5 });
        message = 'Acordos com o governo reforçam sua influência política, mas a imprensa questiona sua imparcialidade.';
    } else if (faction === 'ongs') {
        applyEffects({ relacaoONGs: 15, relacaoGoverno: -5 });
        message = 'Diálogos com ONGs fortalecem sua imagem de justiça, mas irritam o governo.';
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
        finalText = `${state.playerName}, a fúria do povo selou seu destino. Multidões invadiram o tribunal, exigindo sua destituição por decisões impopulares.`;
    } else if (state.respeitoInstitucional <= 0) {
        finalText = `${state.playerName}, as instituições voltaram-se contra você. Sua imparcialidade foi questionada, e o Supremo foi dissolvido em desgraça.`;
    } else if (state.influenciaPolitica <= 0) {
        finalText = `${state.playerName}, as elites políticas isolaram você. Sem aliados, seu tribunal foi extinto por ordem presidencial.`;
    } else if (state.relacaoImprensa <= 0) {
        finalText = `${state.playerName}, a imprensa destruiu sua reputação. Acusações de corrupção forçaram seu afastamento em meio a escândalos.`;
    } else if (state.relacaoGoverno <= 0) {
        finalText = `${state.playerName}, o governo conspirou contra você. Uma votação relâmpago no Congresso dissolveu seu tribunal.`;
    } else if (state.relacaoONGs <= 0) {
        finalText = `${state.playerName}, ONGs globais denunciaram suas decisões. Sem legitimidade internacional, você foi obrigado a renunciar.`;
    } else if (state.apoioPopular > 80 && state.respeitoInstitucional > 80 && state.influenciaPolitica > 80) {
        finalText = `${state.playerName}, você é um ícone da justiça! Sua imparcialidade conquistou o povo, as instituições e as elites. Parabéns, Juiz Supremo!`;
    } else {
        finalText = `${state.playerName}, sua trajetória foi marcada por decisões controversas. Você julgou todos os casos, mas seu legado divide opiniões.`;
    }
    document.getElementById('endName').textContent = state.playerName;
    document.getElementById('end-description').textContent = finalText;
    transitionScreen('end-screen', 'case-screen');
}

function restartGame() {
    // Reinicia o estado do jogo
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
        
        // Seleção de Dificuldade
        document.getElementById('difficultyEasy').addEventListener('click', () => setDifficulty('fácil'));
        document.getElementById('difficultyMedium').addEventListener('click', () => setDifficulty('médio'));
        document.getElementById('difficultyHard').addEventListener('click', () => setDifficulty('difícil'));
        
        // Ações de Investigação
        document.getElementById('investigation-options').addEventListener('click', (e) => {
            const index = e.target.dataset.investigation;
            if (index !== undefined) {
                investigate(Number(index));
            }
        });
        
        // Tomada de Decisões
        document.getElementById('decision-options').addEventListener('click', (e) => {
            const index = e.target.dataset.decision;
            if (index !== undefined) {
                makeDecision(Number(index));
            }
        });
        
        // Visualização de Mídia
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
        showNotification('Falha ao carregar o jogo. Por favor, tente novamente.');
    }
});