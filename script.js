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
    orcamento: 10000, // R$ 100.000
    custoManutencao: 1000 // R$ 10.000
};

// === Eventos Aleatórios ===
const eventosAleatorios = [
    {
        id: "protestos",
        texto: `**Noite de Fúria e Cinzas: A Revolta que Paralisou a Capital**<br><br>
        Milhares de pessoas tomaram as ruas, erguendo barricadas de pneus em chamas. Com a hashtag <strong>#ForaJuiz</strong>, manifestantes expressam indignação contra uma decisão judicial.`,
        efeitos: { apoioPopular: -10, relacaoImprensa: -5 },
        condicao: () => state.relacaoImprensa < 25 || state.apoioPopular < 30,
        imagem: "assets/images/protestos.jpg"
    },
    {
        id: "elogio_ong",
        texto: `**Um Farol na Tempestade: ONG Reconhece a Coragem do Juiz**<br><br>
        A ONG Justiça Sem Fronteiras exalta o juiz como exemplo de integridade, oferecendo esperança em meio à crise.`,
        efeitos: { respeitoInstitucional: 10, relacaoONGs: 10 },
        condicao: () => state.relacaoONGs > 75,
        imagem: "assets/images/elogio_ong.jpg"
    },
    {
        id: "vazamento",
        texto: `**Vazamento Explosivo: Áudios Revelam Conluio**<br><br>
        Áudios sugerem uma aliança entre o juiz e o governo, abalando a confiança pública e desencadeando investigações.`,
        efeitos: { influenciaPolitica: -15, relacaoImprensa: -10 },
        condicao: () => state.relacaoGoverno > 75 && state.relacaoImprensa < 50,
        imagem: "assets/images/vazamento.jpg"
    },
    {
        id: "aplausos_imprensa",
        texto: `**Luz na Escuridão: Imprensa Exalta Decisão do Tribunal**<br><br>
        O Jornal do Povo publica editorial elogiando a imparcialidade do juiz, inspirando confiança na justiça.`,
        efeitos: { relacaoImprensa: 10, apoioPopular: 5 },
        condicao: () => state.relacaoImprensa > 75,
        imagem: "assets/images/aplausos_imprensa.jpg"
    }
];

// === Eventos de Crise ===
const eventosCrise = [
    {
        id: "crise_judiciaria",
        texto: `**Crise Judicial: Greve Nacional de Magistrados**<br><br>
        Uma greve histórica paralisa o Judiciário, liderada por juízes que exigem melhores salários e condições. A população está dividida: alguns apoiam a causa, outros veem a paralisação como abandono do dever. Como Juiz Supremo, sua posição será crucial.<br><br>
        A nação observa enquanto o tribunal, símbolo da justiça, enfrenta sua maior prova. Escolha com cuidado: sua decisão pode fortalecer ou destruir a confiança no sistema judicial.`,
        imagem: "assets/images/greve_judiciaria.jpg",
        opcoes: [
            {
                texto: "Apoiar a greve e negociar com os juízes",
                efeitos: { apoioPopular: -10, respeitoInstitucional: 15, relacaoGoverno: -10 },
                resultado: "Os juízes encerram a greve após negociações tensas, mas o governo promete represálias, acusando você de fraqueza."
            },
            {
                texto: "Condenar a greve e exigir retorno ao trabalho",
                efeitos: { apoioPopular: 10, respeitoInstitucional: -15, relacaoGoverno: 10 },
                resultado: "A greve termina sob pressão, mas o Judiciário fica ressentido, prometendo resistência interna contra suas decisões."
            },
            {
                texto: "Ignorar a crise e focar nos casos",
                efeitos: { respeitoInstitucional: -5, relacaoImprensa: -5 },
                resultado: "A crise se arrasta, com a mídia acusando o tribunal de covardia. A confiança pública no Judiciário despenca."
            }
        ]
    }
];

// === Casos ===
const casos = [
    {
        id: "caso_01",
        titulo: "O Roubo do Século na Fundação Esperança",
        descricao: `Brasília, 16 de março de 2024 – O deputado João Almeida, presidente da Fundação Esperança, é acusado de desviar R$ 2,3 bilhões destinados a salvar vidas. Imagens mostram malas de dinheiro em seu escritório, enquanto protestos eclodem. A ONG Futuro Global defende Almeida, mas o povo exige justiça.`,
        imagem: "assets/images/caso_01_malas_dinheiro.jpg",
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
        midia: [
            `Jornal do Povo: 'Almeida roubou a esperança dos famintos!'`,
            `Futuro Global: 'Acusações são uma farsa política!'`,
            `Rede Social: 'Malas de dinheiro! #PrisãoParaAlmeida'`,
            `TV Nacional: 'Escândalo: o povo exige justiça!'`
        ]
    },
    {
        id: "caso_02",
        titulo: "A Revolta do Bairro Liberdade",
        descricao: `São Paulo, 8 de julho de 2024 – Após a morte de um jovem por policiais, o Bairro Liberdade explode em protestos. A líder comunitária Ana Ribeiro é acusada de incitar saques e violência. A polícia exige prisão, mas ONGs apontam brutalidade policial como a causa.`,
        imagem: "assets/images/caso_02_protestos.jpg",
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
        midia: [
            `Jornal do Povo: 'Ana é vítima ou criminosa?'`,
            `ONGs: 'Polícia mata, Ana apenas gritou!'`,
            `Rede Social: '#JustiçaParaLiberdade'`
        ]
    },
    {
        id: "caso_03",
        titulo: "O Escândalo da Vacina Falsa",
        descricao: `Rio de Janeiro, 12 de setembro de 2024 – A farmacêutica BioVida é acusada de vender 2 milhões de doses falsas de vacina contra uma nova epidemia. Pacientes morreram, e o CEO, Dr. Carlos Mendes, culpa sabotagem interna. O governo exige punição máxima.`,
        imagem: "assets/images/caso_03_vacina.jpg",
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
        midia: [
            `Jornal do Povo: 'BioVida matou com vacinas falsas!'`,
            `BioVida: 'Somos vítimas de sabotagem!'`,
            `Rede Social: '#VacinaVerdade'`
        ]
    },
    {
        id: "caso_04",
        titulo: "O Desastre do Vale Verde",
        descricao: `Minas Gerais, 15 de novembro de 2024 – Um vazamento químico da mineradora Vale Verde contamina o rio Claro, matando 300 pessoas e destruindo o ecossistema. A ONG Frente Verde é acusada de sabotar a mina, enquanto a Vale Verde nega negligência. O povo exige justiça.`,
        imagem: "assets/images/caso_04_vazamento.jpg",
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
        imagem: "assets/images/caso_05_hacker.jpg",
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
        midia: [
            `Jornal do Povo: 'Sombra é herói!'`,
            `Diário da Ordem: 'Sombra é traidor!'`,
            `Rede Social: '#LiberdadeSombra'`
        ]
    },
    
    {
        id: "caso_06",
        titulo: "O Escândalo da Privatização da Água",
        descricao: `Salvador, 10 de junho de 2025 – A empresa AquaCorp é acusada de manipular a privatização do sistema de água, cobrando tarifas abusivas e deixando bairros sem abastecimento. O governador, aliado da AquaCorp, defende a privatização, enquanto moradores protestam por água potável. ONGs denunciam corrupção no processo.`,
        imagem: "assets/images/caso_06_agua.jpg",
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
        midia: [
            `Jornal do Povo: 'AquaCorp lucra enquanto o povo sofre!'`,
            `Diário da Ordem: 'Privatização trouxe eficiência!'`,
            `Rede Social: '#ÁguaParaTodos'`,
            `ONGs: 'Água é direito, não mercadoria!'`
        ]
    },
    {
        id: "caso_07",
        titulo: "A Queda do Ídolo do Futebol",
        descricao: `Rio de Janeiro, 22 de agosto de 2025 – O astro do futebol Gabriel Lima é acusado de sonegar R$ 80 milhões em impostos, usando empresas offshore. Fãs o defendem como vítima de perseguição, enquanto a Receita Federal exige prisão. A imprensa explora a polêmica, dividindo a nação.`,
        imagem: "assets/images/caso_07_futebol.jpg",
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
        midia: [
            `Jornal do Povo: 'Gabriel traiu o Brasil!'`,
            `Fãs: 'Gabriel é vítima da Receita!'`,
            `Rede Social: '#GabrielInocente'`,
            `Globo: 'Sonegação ou perseguição?'`
        ]
    },
    {
        id: "caso_08",
        titulo: "O Julgamento da Inteligência Artificial",
        descricao: `São Paulo, 15 de outubro de 2025 – A empresa TechNova é acusada de usar sua IA, Aurora, para manipular eleições com campanhas de desinformação. A TechNova nega, alegando que a IA foi hackeada. Ativistas exigem o banimento da IA, enquanto o governo teme perder investimentos.`,
        imagem: "assets/images/caso_08_ia.jpg",
        provas: [
            `Logs mostram que Aurora gerou 10 milhões de postagens falsas em redes sociais.`,
            `E-mails internos sugerem que a TechNova lucrou R$ 200 milhões com campanhas.`,
            `Hackers anônimos assumem a autoria, mas sem provas concretas.`
        ],
        investigacoes: [
            {
                acao: "Analisar servidores da Aurora",
                custo: { relacaoImprensa: -5, respeitoInstitucional: -5 },
                resultado: `Análise revela que a IA foi programada para manipular, sem sinais de hacking.`,
                novaProva: "Código-fonte da Aurora com instruções de manipulação."
            },
            {
                acao: "Investigar hackers anônimos",
                custo: { influenciaPolitica: -5, relacaoGoverno: -5 },
                resultado: `Hackers são rastreados, mas não há evidências de acesso à Aurora.`,
                novaProva: "Relatório negando envolvimento de hackers."
            }
        ],
        decisoes: [
            {
                texto: "Banir a IA Aurora e multar TechNova",
                efeitos: { apoioPopular: 15, respeitoInstitucional: -10, influenciaPolitica: -15, relacaoImprensa: 10, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Fim da Aurora! TechNova Punida!",
                reacaoPopular: "'#IAControlada' viraliza nas redes.",
                reacaoMidia: "Jornal do Povo: 'Vitória contra manipulação!'"
            },
            {
                texto: "Absolver TechNova e culpar hackers",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "TechNova Livre! Hackers Culpados!",
                reacaoPopular: "Protestos: '#IADestrói'",
                reacaoMidia: "Diário da Ordem: 'Tecnologia protegida!'"
            },
            {
                texto: "Adiar decisão e regular IAs",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Hesita! Caso Aurora Sem Fim!",
                reacaoPopular: "'#RegulemIA' ganha força.",
                reacaoMidia: "Voz do Povo: 'Adiar é arriscado!'"
            },
            {
                texto: "Desativar Aurora com base em provas",
                efeitos: { apoioPopular: 10, respeitoInstitucional: 5, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Aurora Desligada! TechNova Sob Controle!",
                reacaoPopular: "'#JustiçaDigital' é celebrada.",
                reacaoMidia: "Globo: 'Decisão balanceia inovação e ética.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'Aurora manipulou a democracia!'`,
            `TechNova: 'Somos vítimas de hackers!'`,
            `Rede Social: '#RegulemIA'`,
            `ONGs: 'IA é uma ameaça à liberdade!'`
        ]
    },
    {
        id: "caso_09",
        titulo: "A Crise da Reforma Agrária",
        descricao: `Mato Grosso, 5 de dezembro de 2025 – O líder do Movimento Terra Livre, José Mendes, é acusado de invadir terras privadas e incitar conflitos que deixaram 10 mortos. Fazendeiros exigem sua prisão, enquanto camponeses o veem como herói da reforma agrária. O governo teme instabilidade no campo.`,
        imagem: "assets/images/caso_09_reforma.jpg",
        provas: [
            `Vídeos mostram José liderando ocupações de fazendas.`,
            `Relatórios policiais citam armas encontradas com membros do Terra Livre.`,
            `Testemunhas afirmam que fazendeiros contrataram milícias para atacar camponeses.`
        ],
        investigacoes: [
            {
                acao: "Investigar milícias dos fazendeiros",
                custo: { relacaoGoverno: -5, influenciaPolitica: -5 },
                resultado: `Provas confirmam que milícias foram pagas para provocar conflitos.`,
                novaProva: "Gravações de fazendeiros contratando milícias."
            },
            {
                acao: "Analisar armas do Terra Livre",
                custo: { relacaoONGs: -5, apoioPopular: -5 },
                resultado: `Análise revela que armas eram de origem policial, sugerindo armação.`,
                novaProva: "Relatório balístico das armas."
            }
        ],
        decisoes: [
            {
                texto: "Condenar José por incitação à violência",
                efeitos: { apoioPopular: -15, respeitoInstitucional: 10, influenciaPolitica: 15, relacaoImprensa: -10, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "Líder Preso! Terra Livre Derrotada!",
                reacaoPopular: "Camponeses: '#JoséHerói'",
                reacaoMidia: "Diário da Ordem: 'Ordem no campo!'"
            },
            {
                texto: "Absolver José e investigar fazendeiros",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -15, influenciaPolitica: -20, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça com Camponeses! Fazendeiros na Mira!",
                reacaoPopular: "'#TerraLivreVence' viraliza.",
                reacaoMidia: "Globo: 'Decisão pode inflamar o campo.'"
            },
            {
                texto: "Adiar decisão e mediar conflitos",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Tribunal Tenta Paz no Campo!",
                reacaoPopular: "'#JustiçaLenta' cresce.",
                reacaoMidia: "Voz do Povo: 'Mediação é fraca!'"
            },
            {
                texto: "Punir milícias e advertir José",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 0, influenciaPolitica: -10, relacaoImprensa: 10, relacaoGoverno: -10, relacaoONGs: 10 },
                manchete: "Justiça Ataca Milícias! José Advertido!",
                reacaoPopular: "'#ReformaVive' com apoio misto.",
                reacaoMidia: "Globo: 'Solução busca equilíbrio.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'José Mendes é herói ou bandido?'`,
            `Fazendeiros: 'Terra Livre é terrorismo!'`,
            `Rede Social: '#ReformaAgrária'`,
            `ONGs: 'Camponeses lutam por justiça!'`
        ]
    },
    {
        id: "caso_10",
        titulo: "O Colapso da Barragem do Norte",
        descricao: `Pará, 20 de fevereiro de 2026 – Uma barragem da mineradora NorteMinas ruiu, matando 200 pessoas e devastando comunidades indígenas. A empresa culpa chuvas, mas laudos apontam negligência. Líderes indígenas exigem justiça, enquanto o governo protege a NorteMinas por empregos.`,
        imagem: "assets/images/caso_10_barragem.jpg",
        provas: [
            `Laudos mostram que a barragem tinha rachaduras ignoradas há dois anos.`,
            `E-mails da NorteMinas minimizam alertas de engenheiros.`,
            `Líder indígena relata que a empresa despejou rejeitos ilegalmente.`
        ],
        investigacoes: [
            {
                acao: "Periciar a barragem destruída",
                custo: { relacaoImprensa: -5, apoioPopular: -5 },
                resultado: `Perícia confirma negligência grave, com cortes de manutenção.`,
                novaProva: "Relatório pericial detalhando falhas."
            },
            {
                acao: "Ouvir engenheiros da NorteMinas",
                custo: { relacaoGoverno: -5, respeitoInstitucional: -5 },
                resultado: `Engenheiros confessam que foram pressionados a ignorar riscos.`,
                novaProva: "Depoimentos gravados dos engenheiros."
            }
        ],
        decisoes: [
            {
                texto: "Multar NorteMinas em R$ 10 bilhões",
                efeitos: { apoioPopular: 20, respeitoInstitucional: -10, influenciaPolitica: -15, relacaoImprensa: 15, relacaoGoverno: -20, relacaoONGs: 15 },
                manchete: "Justiça para o Norte! NorteMinas Paga R$ 10 Bi!",
                reacaoPopular: "'#JustiçaIndígena' viraliza.",
                reacaoMidia: "Jornal do Povo: 'Multa histórica!'"
            },
            {
                texto: "Absolver NorteMinas por força maior",
                efeitos: { apoioPopular: -20, respeitoInstitucional: 15, influenciaPolitica: 15, relacaoImprensa: -15, relacaoGoverno: 15, relacaoONGs: -15 },
                manchete: "NorteMinas Livre! Tragédia Culpa da Natureza!",
                reacaoPopular: "Indígenas: '#JustiçaVendida'",
                reacaoMidia: "Diário da Ordem: 'Decisão protege economia.'"
            },
            {
                texto: "Exigir nova perícia",
                efeitos: { apoioPopular: -5, respeitoInstitucional: 5, influenciaPolitica: -5, relacaoImprensa: -5, relacaoGoverno: -5, relacaoONGs: 5 },
                manchete: "Justiça Adia Caso da Barragem!",
                reacaoPopular: "'#JustiçaLenta' cresce.",
                reacaoMidia: "Voz do Povo: 'Adiar é conivência!'"
            },
            {
                texto: "Fechar NorteMinas com base em provas",
                efeitos: { apoioPopular: 15, respeitoInstitucional: 0, influenciaPolitica: -20, relacaoImprensa: 10, relacaoGoverno: -15, relacaoONGs: 10 },
                manchete: "NorteMinas Fechada! Justiça com Indígenas!",
                reacaoPopular: "'#VidaIndígena' é celebrada.",
                reacaoMidia: "Globo: 'Fechamento abala economia local.'",
                requiresInvestigation: true
            }
        ],
        midia: [
            `Jornal do Povo: 'NorteMinas destruiu o Norte!'`,
            `NorteMinas: 'Chuvas causaram o colapso!'`,
            `Rede Social: '#JustiçaIndígena'`,
            `ONGs: 'Proteger indígenas é proteger a Amazônia!'`
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
    const regex = /^[a-zA-Z0-9\s]{1,20}$/;
    return regex.test(name);
}

function applyEffects(effects) {
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
        if (key === 'orcamento') state.orcamento = Math.max(0, state.orcamento + value);
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
    const name = nameInput.value.trim();
    if (!validateName(name)) {
        nameError.textContent = 'Nome inválido! Use letras, números e espaços (máximo de 20 caracteres).';
        nameError.classList.add('show');
        return;
    }
    nameError.classList.remove('show');
    state.playerName = name;
    const displayName = document.getElementById('displayName');
    if (displayName) displayName.textContent = state.playerName;
    transitionScreen('difficulty-screen', 'intro-screen');
}

function setDifficulty(level) {
    state.dificuldade = level;
    if (level === 'fácil') {
        state.orcamento = 5000; // R$ 50.000
        state.custoManutencao = 500; // R$ 5.000
        state.maxInvestigations = 3;
    } else if (level === 'médio') {
        state.orcamento = 10000; // R$ 100.000
        state.custoManutencao = 1000; // R$ 10.000
        state.maxInvestigations = 2;
    } else if (level === 'difícil') {
        state.orcamento = 15000; // R$ 150.000
        state.custoManutencao = 1500; // R$ 15.000
        state.maxInvestigations = 1;
    }
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
    showNotification(`Caso ${state.casosJulgados + 1} de 10: ${state.currentCase.titulo}`);
    renderCase();
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
    caseDescription.textContent = currentCase.descricao;
    caseImage.src = currentCase.imagem;
    caseEvidences.innerHTML = '<h3>Provas:</h3><ul>' + 
        currentCase.provas.map(p => `<li>${p}</li>`).join('') + '</ul>';
    investigationOptions.innerHTML = state.investigationsDone < state.maxInvestigations ?
        '<h3>Opções de Investigação:</h3>' + 
        currentCase.investigacoes.map((inv, i) => `<button data-investigation="${i}">${inv.acao}</button>`).join('') : '';
    decisionOptions.innerHTML = currentCase.decisoes
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
    if (state.orcamento < 1000) {
        showNotification('Orçamento insuficiente para realizar a investigação!');
        return;
    }
    state.orcamento -= 2000; // R$ 20.000
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
    state.orcamento -= state.custoManutencao;
    
    if (state.orcamento <= 0 || state.apoioPopular <= 0 || state.respeitoInstitucional <= 0 ||
        state.influenciaPolitica <= 0 || state.relacaoImprensa <= 0 || state.relacaoGoverno <= 0 || state.relacaoONGs <= 0) {
        endGame();
        return;
    }
    
    if (state.casosJulgados === 3 || state.casosJulgados === 7 || state.casosJulgados === 9) {
        showCrisisEvent();
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
}

function showCrisisEvent() {
    const crisis = eventosCrise[0];
    const mediaHeadline = document.getElementById('media-headline');
    const mediaReactions = document.getElementById('media-reactions');
    const caseImage = document.getElementById('case-image');
    if (mediaHeadline && mediaReactions && caseImage) {
        caseImage.src = crisis.imagem;
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
        mediaReactions.innerHTML = state.currentCase.midia.map(m => `<p>${m}</p>`).join('');
        caseImage.src = state.currentCase.imagem;
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

function endGame() {
    let finalText = '';
    let legacyScore = (state.apoioPopular + state.respeitoInstitucional + state.influenciaPolitica +
        state.relacaoImprensa + state.relacaoGoverno + state.relacaoONGs) / 6;
    let casesCompleted = state.casosJulgados;
    
    if (state.orcamento <= 0) {
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
    } else if (casesCompleted >= casos.length) {
        if (legacyScore > 80) {
            finalText = `${state.playerName}, você é uma lenda da justiça! Após julgar todos os ${casos.length} casos, sua imparcialidade conquistou a nação.`;
            finalText += `<br><br><strong>Parabéns!</strong> Você desbloqueou o Nível Avançado: Projetos Nacionais.`;
            finalText += `<br><button id="continueAdvancedButton" aria-label="Continuar para o nível avançado"><i class="fas fa-forward"></i> Continuar para Projetos Nacionais</button>`;
        } else if (legacyScore > 50) {
            finalText = `${state.playerName}, você completou os ${casos.length} casos com equilíbrio. Seu legado é respeitado, mas não unânime.`;
        } else {
            finalText = `${state.playerName}, após ${casos.length} casos, suas decisões dividiram a nação. Seu tribunal sobreviveu, mas sob críticas.`;
        }
    } else {
        finalText = `${state.playerName}, sua trajetória foi controversa. Seu legado divide opiniões após ${casesCompleted} casos.`;
    }
    
    finalText += `<br><br><strong>Resumo:</strong><br>
        Casos Julgados: ${casesCompleted}/${casos.length}<br>
        Orçamento Restante: ${state.orcamento}<br>
        Média de Reputação: ${Math.round(legacyScore)}`;
    
    const endName = document.getElementById('endName');
    const endDescription = document.getElementById('end-description');
    if (endName && endDescription) {
        endName.textContent = state.playerName;
        endDescription.innerHTML = finalText;
    } else {
        console.warn('Elementos endName ou endDescription não encontrados');
    }
    
    transitionScreen('end-screen', 'case-screen');
    
    // Adicionar listener para o botão de nível avançado
    const continueAdvancedButton = document.getElementById('continueAdvancedButton');
    if (continueAdvancedButton) {
        continueAdvancedButton.addEventListener('click', startAdvancedLevel);
    }
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
        investigationsDone: 0,
        maxInvestigations: 2,
        orcamento: 10000, // R$ 100.000
        custoManutencao: 1000 // R$ 10.000
    });
    const playerName = document.getElementById('playerName');
    if (playerName) playerName.value = '';
    transitionScreen('intro-screen', 'end-screen');
}

// === Inicialização ===
// Função para alternar sessões
function switchSession(session) {
    const session1 = document.getElementById('session1');
    const session2 = document.getElementById('session2');
    if (!session1 || !session2) {
        console.error('Seções session1 ou session2 não encontradas');
        showNotification('Erro ao alternar sessões. Recarregue a página.');
        return;
    }
    if (session === 'session2') {
        session1.style.display = 'none';
        session2.style.display = 'block';
    } else {
        session1.style.display = 'block';
        session2.style.display = 'none';
    }
}

// Função endGame (ajustada para transição de sessão)
function endGame() {
    let finalText = '';
    let legacyScore = (state.apoioPopular + state.respeitoInstitucional + state.influenciaPolitica +
        state.relacaoImprensa + state.relacaoGoverno + state.relacaoONGs) / 6;
    let casesCompleted = state.casosJulgados;
    
    if (state.orcamento <= 0) {
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
    } else if (casesCompleted >= casos.length) {
        if (legacyScore > 80) {
            finalText = `${state.playerName}, você é uma lenda da justiça! Após julgar todos os ${casos.length} casos, sua imparcialidade conquistou a nação.`;
            finalText += `<br><br><strong>Parabéns!</strong> Escolha seu próximo caminho:`;
        } else if (legacyScore > 50) {
            finalText = `${state.playerName}, você completou os ${casos.length} casos com equilíbrio. Seu legado é respeitado, mas não unânime.`;
        } else {
            finalText = `${state.playerName}, após ${casos.length} casos, suas decisões dividiram a nação. Seu tribunal sobreviveu, mas sob críticas.`;
        }
    } else {
        finalText = `${state.playerName}, sua trajetória foi controversa. Seu legado divide opiniões após ${casesCompleted} casos.`;
    }
    
    finalText += `<br><br><strong>Resumo:</strong><br>
        Casos Julgados: ${casesCompleted}/${casos.length}<br>
        Orçamento Restante: ${state.orcamento}<br>
        Média de Reputação: ${Math.round(legacyScore)}`;
    
    const endName = document.getElementById('endName');
    const endDescription = document.getElementById('end-description');
    if (endName && endDescription) {
        endName.textContent = state.playerName;
        endDescription.innerHTML = finalText;
    } else {
        console.warn('Elementos endName ou endDescription não encontrados');
    }
    
    // Exibir choice-screen se todos os casos foram julgados com legacyScore > 80
    if (casesCompleted >= casos.length && legacyScore > 80) {
        const choiceName = document.getElementById('choiceName');
        if (choiceName) {
            choiceName.textContent = state.playerName;
        }
        transitionScreen('choice-screen', 'case-screen');
    } else {
        transitionScreen('end-screen', 'case-screen');
    }
}

// Função handlePathChoice (ajustada para iniciar Sessão 2)
function handlePathChoice(choice) {
  if (choice === 'projects' || choice === 'leader') {
    switchSession('session2');
    stateAdvanced.playerName = state.playerName; // Transferir nome do jogador
    initializeAdvancedSession(); // Inicializa Sessão 2
    initializeDiplomacySession(); // Inicializa diplomacia
    transitionScreen('advanced-screen', 'choice-screen');
    if (choice === 'projects') {
      loadAdvancedCase();
    } else {
      loadLeaderCase();
    }
  } else if (choice === 'restart') {
    window.location.reload();
  }
}


// Funções de Diplomacia (Sessão 1)
function handleDiplomacyImprensa() {
  try {
    const custos = { easy: -500, medium: -1000, hard: -1500 }; // R$ 5.000, 10.000, 15.000
    applyEffects({
      relacaoImprensa: 15,
      orcamento: custos[state.dificuldade]
    });
    showNotification(`Negociação com a imprensa bem-sucedida! Relação +15, Orçamento -R$${Math.abs(custos[state.dificuldade] * 10)}.`);
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
    if (key === 'orcamento') state.orcamento = Math.max(0, state.orcamento + value);
    if (key === 'apoioPopular') state.apoioPopular = Math.max(0, Math.min(100, state.apoioPopular + value));
    if (key === 'respeitoInstitucional') state.respeitoInstitucional = Math.max(0, Math.min(100, state.respeitoInstitucional + value));
    if (key === 'influenciaPolitica') state.influenciaPolitica = Math.max(0, Math.min(100, state.influenciaPolitica + value));
    if (key === 'relacaoImprensa') state.relacaoImprensa = Math.max(0, Math.min(100, state.relacaoImprensa + value));
    if (key === 'relacaoGoverno') state.relacaoGoverno = Math.max(0, Math.min(100, state.relacaoGoverno + value));
    if (key === 'relacaoONGs') state.relacaoONGs = Math.max(0, Math.min(100, state.relacaoONGs + value));
    
    const progressBar = document.getElementById(`${key}Bar`);
    if (progressBar) {
      progressBar.value = state[key] || Number(metricElement.textContent);
    }
  }
}

// Inicialização de eventos (Sessão 1)
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Botão de início
    const startButton = document.getElementById('startButton');
    if (!startButton) throw new Error('Botão startButton não encontrado');
    startButton.addEventListener('click', startGame);
    
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
    
    // Botões da choice-screen
    const choiceButtons = {
      'chooseProjects': 'projects',
      'chooseLeader': 'leader',
      'chooseRestart': 'restart'
    };
    Object.keys(choiceButtons).forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (!button) console.warn(`Botão ${buttonId} não encontrado`);
      else button.addEventListener('click', () => handlePathChoice(choiceButtons[buttonId]));
    });
    
    // Botão de reinício
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.addEventListener('click', () => window.location.reload());
    } else {
      console.warn('Botão restartButton não encontrado');
    }
    
  } catch (error) {
    console.error('Erro ao inicializar eventos da Sessão 1:', error);
    showNotification(`Falha ao carregar o jogo: ${error.message}. Tente recarregar a página.`);
  }
});