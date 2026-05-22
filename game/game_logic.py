import random
import re
from typing import Dict, List, Optional

state = {
    'playerName': '', 'dificuldade': '', 'apoioPopular': 50,
    'respeitoInstitucional': 50, 'influenciaPolitica': 50,
    'relacaoImprensa': 50, 'relacaoGoverno': 50, 'relacaoONGs': 50,
    'casosJulgados': 0, 'currentCase': None, 'investigationsDone': 0,
    'maxInvestigations': 2, 'orcamento': 100, 'custoManutencao': 10,
    'career': None, 'profile': None, 'careerCharges': 0
}

eventos_aleatorios = [
    {
        'id': 'protestos', 'imagem': 'assets/images/protestos.jpg',
        'texto': "**Noite de Fúria e Cinzas: A Revolta que Paralisou a Capital**\n\nMilhares de pessoas tomaram as ruas, erguendo barricadas de pneus em chamas. Com a hashtag #ForaJuiz, manifestantes expressam indignação contra uma decisão judicial.",
        'efeitos': {'apoioPopular': -10, 'relacaoImprensa': -5},
        'condicao': lambda: state['relacaoImprensa'] < 25 or state['apoioPopular'] < 30
    },
    {
        'id': 'elogio_ong', 'imagem': 'assets/images/elogio_ong.jpg',
        'texto': "**Um Farol na Tempestade: ONG Reconhece a Coragem do Juiz**\n\nA ONG Justiça Sem Fronteiras exalta o juiz como exemplo de integridade, oferecendo esperança em meio à crise.",
        'efeitos': {'respeitoInstitucional': 10, 'relacaoONGs': 10},
        'condicao': lambda: state['relacaoONGs'] > 75
    },
    {
        'id': 'vazamento', 'imagem': 'assets/images/vazamento.jpg',
        'texto': "**Vazamento Explosivo: Áudios Revelam Conluio**\n\nÁudios sugerem uma aliança entre o juiz e o governo, abalando a confiança pública e desencadeando investigações.",
        'efeitos': {'influenciaPolitica': -15, 'relacaoImprensa': -10},
        'condicao': lambda: state['relacaoGoverno'] > 75 and state['relacaoImprensa'] < 50
    },
    {
        'id': 'aplausos_imprensa', 'imagem': 'assets/images/aplausos_imprensa.jpg',
        'texto': "**Luz na Escuridão: Imprensa Exalta Decisão do Tribunal**\n\nO Jornal do Povo publica editorial elogiando a imparcialidade do juiz, inspirando confiança na justiça.",
        'efeitos': {'relacaoImprensa': 10, 'apoioPopular': 5},
        'condicao': lambda: state['relacaoImprensa'] > 75
    },
    {
        'id': 'atentado', 'imagem': 'assets/images/atentado.jpg',
        'texto': "**Atentado ao Tribunal!**\n\nUma bomba de pequeno porte explode nos fundos do tribunal. Ninguém se feriu, mas o pânico toma conta.",
        'efeitos': {'apoioPopular': 5, 'respeitoInstitucional': -10},
        'condicao': lambda: state['influenciaPolitica'] < 30
    },
    {
        'id': 'denuncia_ouvidor', 'imagem': 'assets/images/denuncia.jpg',
        'texto': "**Ouvidoria Recebe Denúncia contra o Juiz**\n\nUm cidadão anônimo protocola denúncia de parcialidade contra o juiz. A Corregedoria abre sindicância.",
        'efeitos': {'respeitoInstitucional': -15, 'apoioPopular': -5},
        'condicao': lambda: state['respeitoInstitucional'] < 30 and state['apoioPopular'] < 40
    }
]

eventos_crise = [
    {
        'id': 'crise_judiciaria', 'imagem': 'assets/images/greve_judiciaria.jpg',
        'texto': "**Crise Judicial: Greve Nacional de Magistrados**\n\nUma greve histórica paralisa o Judiciário, liderada por juízes que exigem melhores salários e condições.",
        'opcoes': [
            {'texto': 'Apoiar a greve e negociar', 'efeitos': {'apoioPopular': -10, 'respeitoInstitucional': 15, 'relacaoGoverno': -10}, 'resultado': 'Juízes encerram greve, mas governo promete represálias.'},
            {'texto': 'Condenar a greve e exigir retorno', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': -15, 'relacaoGoverno': 10}, 'resultado': 'Greve termina sob pressão, Judiciário fica ressentido.'},
            {'texto': 'Ignorar a crise', 'efeitos': {'respeitoInstitucional': -5, 'relacaoImprensa': -5}, 'resultado': 'Crise se arrasta, confiança pública despenca.'}
        ]
    },
    {
        'id': 'crise_politica', 'imagem': 'assets/images/crise_politica.jpg',
        'texto': "**Crise Política: Congresso Ameaça Impeachment**\n\nO Congresso Nacional ameaça abrir processo de impeachment contra o juiz, acusando-o de abuso de autoridade.",
        'opcoes': [
            {'texto': 'Negociar com líderes do Congresso', 'efeitos': {'influenciaPolitica': 20, 'respeitoInstitucional': -10, 'relacaoImprensa': -10}, 'resultado': 'Impeachment arquivado, mas sua imagem sai arranhada.'},
            {'texto': 'Enfrentar o Congresso publicamente', 'efeitos': {'apoioPopular': 15, 'influenciaPolitica': -15, 'relacaoGoverno': -15}, 'resultado': 'População te apoia, mas Congresso vira inimigo.'},
            {'texto': 'Recomendar moderação e aguardar', 'efeitos': {'respeitoInstitucional': 5, 'relacaoImprensa': -5}, 'resultado': 'Tensão persiste, mas crise imediata é contornada.'}
        ]
    },
    {
        'id': 'crise_economica', 'imagem': 'assets/images/crise_economica.jpg',
        'texto': "**Crise Econômica: PIB Despenca e Desemprego Explode**\n\nA economia do país entra em recessão. Suas decisões no tribunal têm impacto direto na confiança dos investidores.",
        'opcoes': [
            {'texto': 'Acelerar julgamentos de casos econômicos', 'efeitos': {'apoioPopular': -5, 'influenciaPolitica': 15, 'relacaoGoverno': 10}, 'resultado': 'Mercados reagem positivamente, mas parte da população critica.'},
            {'texto': 'Focar em casos sociais para aliviar tensão', 'efeitos': {'apoioPopular': 15, 'influenciaPolitica': -10, 'relacaoONGs': 10}, 'resultado': 'ONGs e população aprovam, mas investidores se retraem.'},
            {'texto': 'Manter ritmo normal de julgamentos', 'efeitos': {'relacaoImprensa': -5, 'apoioPopular': -5}, 'resultado': 'Crise econômica se aprofunda lentamente.'}
        ]
    },
    {
        'id': 'crise_cibernetica', 'imagem': 'assets/images/crise_cibernetica.jpg',
        'texto': "**Ataque Cibernético ao STF!**\n\nHackers invadem os sistemas do Supremo, vazando documentos sigilosos e decisões confidenciais. A segurança nacional está comprometida.",
        'opcoes': [
            {'texto': 'Ordenar investigação federal total', 'efeitos': {'respeitoInstitucional': 15, 'influenciaPolitica': -5, 'orcamento': -50}, 'resultado': 'Investigação descobre células hackers, mas custa caro aos cofres.'},
            {'texto': 'Contratar empresa privada de segurança', 'efeitos': {'respeitoInstitucional': -10, 'orcamento': -20}, 'resultado': 'Ameaça contida na metade do custo, mas privacidade é questionada.'},
            {'texto': 'Minimizar o ataque publicamente', 'efeitos': {'apoioPopular': -10, 'relacaoImprensa': -15}, 'resultado': 'População desconfia, imprensa acusa de acobertamento.'}
        ]
    }
]

casos = [
    {
        'id': 'caso_01', 'titulo': 'O Roubo do Século na Fundação Esperança',
        'descricao': "Brasília, 16 de março de 2024 – O deputado João Almeida, presidente da Fundação Esperança, é acusado de desviar R$ 2,3 bilhões destinados a salvar vidas. Imagens mostram malas de dinheiro em seu escritório, enquanto protestos eclodem. A ONG Futuro Global defende Almeida, mas o povo exige justiça.",
        'imagem': 'assets/images/caso_01_malas_dinheiro.jpg',
        'provas': ["Vídeo clandestino mostra 15 malas de dinheiro.", "E-mails criptografados revelam transferências de R$ 500 milhões.", "Ex-contador Pedro Costa entrega dossiê com contratos falsos."],
        'investigacoes': [
            {'acao': 'Contratar auditoria independente da PwC', 'custo': {'apoioPopular': -5, 'relacaoImprensa': -5}, 'resultado': "PwC revela: 62% dos fundos desviados para Ilhas Cayman.", 'novaProva': 'Relatório da PwC com extratos bancários.'},
            {'acao': 'Interrogar ex-contador sob juramento', 'custo': {'respeitoInstitucional': -5, 'relacaoONGs': -5}, 'resultado': "Pedro Costa entrega vídeo de Almeida o ameaçando.", 'novaProva': 'Vídeo e arquivos com a trilha do dinheiro roubado.'}
        ],
        'decisoes': [
            {'texto': 'Condenar Almeida com pena máxima de 15 anos', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': -10, 'influenciaPolitica': -20, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': -10}, 'manchete': 'Justiça Vinga o Povo! Almeida Apodrece na Cadeia!', 'reacaoPopular': "Praças vibram: 'O ladrão caiu!'", 'reacaoMidia': "Globo Nacional: 'Um marco contra a impunidade!'"},
            {'texto': 'Absolver Almeida por insuficiência de provas', 'efeitos': {'apoioPopular': -20, 'respeitoInstitucional': 15, 'influenciaPolitica': 10, 'relacaoImprensa': -15, 'relacaoGoverno': 10, 'relacaoONGs': 10}, 'manchete': 'Vergonha Nacional! Tribunal Libera Almeida!', 'reacaoPopular': "Caos: manifestantes gritam 'Justiça vendida!'", 'reacaoMidia': "Jornal do Povo: 'O tribunal cuspiu no povo!'"},
            {'texto': 'Adiar decisão e exigir nova auditoria', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Justiça Enrola! Caso Fica no Limbo!', 'reacaoPopular': "Memes: 'Tribunal joga para debaixo do tapete!'", 'reacaoMidia': "Voz do Povo: 'Adiar é proteger os poderosos!'"},
            {'texto': 'Condenar Almeida com base nas novas provas', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': 5, 'influenciaPolitica': -25, 'relacaoImprensa': 15, 'relacaoGoverno': -20, 'relacaoONGs': 0}, 'manchete': 'Provas Esmagam Almeida! 12 Anos de Cadeia!', 'reacaoPopular': "Brasil respira: 'Ninguém está acima da lei!'", 'reacaoMidia': "Globo: 'Condenação pode causar crise política.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Almeida roubou a esperança dos famintos!'", "Futuro Global: 'Acusações são uma farsa política!'", "Rede Social: 'Malas de dinheiro! #PrisãoParaAlmeida'", "TV Nacional: 'Escândalo: o povo exige justiça!'"]
    },
    {
        'id': 'caso_02', 'titulo': 'A Revolta do Bairro Liberdade',
        'descricao': "São Paulo, 8 de julho de 2024 – Após a morte de um jovem por policiais, o Bairro Liberdade explode em protestos. A líder comunitária Ana Ribeiro é acusada de incitar saques e violência.",
        'imagem': 'assets/images/caso_02_protestos.jpg',
        'provas': ["Vídeo mostra Ana discursando antes dos saques.", "Relatório policial cita 20 lojas destruídas.", "Testemunhas afirmam que policiais atiraram sem motivo."],
        'investigacoes': [
            {'acao': 'Analisar câmeras de segurança', 'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5}, 'resultado': "Imagens mostram policiais atirando sem provocação.", 'novaProva': 'Vídeo de câmeras mostrando o confronto.'},
            {'acao': 'Ouvir testemunhas anônimas', 'custo': {'relacaoImprensa': -5, 'respeitoInstitucional': -5}, 'resultado': "Testemunhas confirmam abuso policial, mas Ana organizou barricadas.", 'novaProva': 'Depoimentos gravados de testemunhas.'}
        ],
        'decisoes': [
            {'texto': 'Condenar Ana por incitação à violência', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': 10, 'influenciaPolitica': 10, 'relacaoImprensa': -10, 'relacaoGoverno': 15, 'relacaoONGs': -15}, 'manchete': 'Líder Presa! Bairro Liberdade Sob Controle!', 'reacaoPopular': "Protestos: '#AnaInocente' viraliza.", 'reacaoMidia': "Diário da Ordem: 'Justiça contra o caos!'"},
            {'texto': 'Absolver Ana e culpar a polícia', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -15, 'influenciaPolitica': -20, 'relacaoImprensa': 15, 'relacaoGoverno': -20, 'relacaoONGs': 10}, 'manchete': 'Justiça com o Povo! Polícia Culpada!', 'reacaoPopular': "Apoio massivo: '#JustiçaParaLiberdade'", 'reacaoMidia': "Globo: 'Decisão pode inflamar tensões.'"},
            {'texto': 'Adiar decisão e investigar abusos', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Tribunal Hesita! Caso Liberdade Sem Resposta!', 'reacaoPopular': "Frustração: '#JustiçaLenta'", 'reacaoMidia': "Voz do Povo: 'Adiar é covardia!'"},
            {'texto': 'Punir policiais e advertir Ana', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': -5, 'influenciaPolitica': -15, 'relacaoImprensa': 10, 'relacaoGoverno': -10, 'relacaoONGs': 5}, 'manchete': 'Justiça Divide Culpa! Policiais e Ana Punidos!', 'reacaoPopular': "Apoio misto: '#LiberdadeVive'", 'reacaoMidia': "Globo: 'Solução tenta apaziguar ânimos.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Ana é vítima ou criminosa?'", "ONGs: 'Polícia mata, Ana apenas gritou!'", "Rede Social: '#JustiçaParaLiberdade'"]
    },
    {
        'id': 'caso_03', 'titulo': 'O Escândalo da Vacina Falsa',
        'descricao': "Rio de Janeiro, 12 de setembro de 2024 – A farmacêutica BioVida é acusada de vender 2 milhões de doses falsas de vacina contra uma nova epidemia.",
        'imagem': 'assets/images/caso_03_vacina.jpg',
        'provas': ["Laudos mostram que as vacinas eram solução salina.", "E-mails sugerem que o CEO sabia da fraude.", "Ex-funcionário acusa CEO de ordenar falsificação."],
        'investigacoes': [
            {'acao': 'Periciar lotes de vacinas', 'custo': {'relacaoImprensa': -5, 'apoioPopular': -5}, 'resultado': "Perícia confirma: 90% das vacinas eram falsas.", 'novaProva': 'Relatório pericial detalhando a fraude.'},
            {'acao': 'Investigar denunciante anônimo', 'custo': {'respeitoInstitucional': -5, 'relacaoGoverno': -5}, 'resultado': "Denunciante entrega gravações do CEO discutindo lucros da fraude.", 'novaProva': 'Áudios comprometedores do CEO.'}
        ],
        'decisoes': [
            {'texto': 'Condenar CEO e multar BioVida', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -10, 'influenciaPolitica': -15, 'relacaoImprensa': 15, 'relacaoGoverno': -10, 'relacaoONGs': 5}, 'manchete': 'Justiça Contra a Morte! BioVida Punida!', 'reacaoPopular': "Apoio: '#VacinaVerdade'", 'reacaoMidia': "Globo: 'Punição é vitória da saúde!'"},
            {'texto': 'Absolver CEO por falta de provas', 'efeitos': {'apoioPopular': -20, 'respeitoInstitucional': 15, 'influenciaPolitica': 10, 'relacaoImprensa': -15, 'relacaoGoverno': 10, 'relacaoONGs': -10}, 'manchete': 'Escândalo! BioVida Livre, Povo Traído!', 'reacaoPopular': "Fúria: '#JustiçaVendida'", 'reacaoMidia': "Jornal do Povo: 'Tribunal protege assassinos!'"},
            {'texto': 'Exigir nova perícia', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Justiça Adia! Caso BioVida Sem Fim!', 'reacaoPopular': "Frustração: '#VacinaLenta'", 'reacaoMidia': "Voz do Povo: 'Adiar é conivência!'"},
            {'texto': 'Prender CEO com base em novas provas', 'efeitos': {'apoioPopular': 25, 'respeitoInstitucional': 0, 'influenciaPolitica': -20, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': 0}, 'manchete': 'CEO na Cadeia! BioVida Desmascarada!', 'reacaoPopular': "Festas: '#JustiçaFeita'", 'reacaoMidia': "Globo: 'Fim de um império criminoso.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'BioVida matou com vacinas falsas!'", "BioVida: 'Somos vítimas de sabotagem!'", "Rede Social: '#VacinaVerdade'"]
    },
    {
        'id': 'caso_04', 'titulo': 'O Desastre do Vale Verde',
        'descricao': "Minas Gerais, 15 de novembro de 2024 – Vazamento químico da mineradora Vale Verde contamina o rio Claro, matando 300 pessoas.",
        'imagem': 'assets/images/caso_04_vazamento.jpg',
        'provas': ["Laudos mostram falhas de segurança na mina.", "Vídeo de ativistas invadindo a mina dias antes.", "Relatório interno admite cortes de manutenção."],
        'investigacoes': [
            {'acao': 'Analisar sistemas de segurança', 'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5}, 'resultado': "Sistemas de segurança estavam desativados por ordem da diretoria.", 'novaProva': 'Documento ordenando corte de segurança.'},
            {'acao': 'Interrogar ativistas', 'custo': {'relacaoONGs': -5, 'respeitoInstitucional': -5}, 'resultado': "Ativistas confessam sabotagem para expor negligência.", 'novaProva': 'Confissão gravada dos ativistas.'}
        ],
        'decisoes': [
            {'texto': 'Multar Vale Verde em R$ 5 bilhões', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -5, 'influenciaPolitica': -15, 'relacaoImprensa': 10, 'relacaoGoverno': -10, 'relacaoONGs': 15}, 'manchete': 'Justiça para o Vale! Vale Verde Paga R$ 5 Bi!', 'reacaoPopular': "'#RioClaroVive' viraliza.", 'reacaoMidia': "Terra Viva: 'Multa é o começo!'"},
            {'texto': 'Condenar ativistas por terrorismo', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': -10, 'influenciaPolitica': 15, 'relacaoImprensa': -10, 'relacaoGoverno': 10, 'relacaoONGs': -15}, 'manchete': 'Ativistas na Cadeia!', 'reacaoPopular': "ONGs: 'Culparam os heróis!'", 'reacaoMidia': "Diário da Ordem: 'Radicalismo punido!'"},
            {'texto': 'Exigir investigação federal', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Justiça Hesita! Vale Verde no Limbo!', 'reacaoPopular': "'#ValeVerdeMata' cresce.", 'reacaoMidia': "Jornal Progressista: 'Adiar é perigoso.'"},
            {'texto': 'Multar Vale Verde e prender sabotadores', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': 0, 'influenciaPolitica': -10, 'relacaoImprensa': 10, 'relacaoGoverno': 0, 'relacaoONGs': 5}, 'manchete': 'Justiça Dura! Multa e Prisão!', 'reacaoPopular': "'#RioClaroVive' com apoio misto.", 'reacaoMidia': "Globo: 'Solução equilibrada.'", 'requiresInvestigation': True}
        ],
        'midia': ["Terra Viva: 'Vale Verde assassinou o rio Claro!'", "Diário da Ordem: 'Ativistas destruíram a Vale Verde!'", "Rede Social: '#JustiçaAmbiental'"]
    },
    {
        'id': 'caso_05', 'titulo': 'Sombra: Herói ou Traidor da Nação?',
        'descricao': "1º de maio de 2025 – O hacker Sombra expôs 50 mil documentos secretos que incriminam a elite do poder. Para milhões, Sombra é herói; para o governo, um traidor.",
        'imagem': 'assets/images/caso_05_hacker.jpg',
        'provas': ["Documentos vazados mostram propinas de R$ 50 milhões.", "Relatórios confirmam acesso a servidores secretos.", "Jornalista vigiada revela ameaças do governo."],
        'investigacoes': [
            {'acao': 'Rastrear servidores usados por Sombra', 'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5}, 'resultado': "Sombra agiu sozinho, sem laços estrangeiros.", 'novaProva': 'Logs de acesso confirmando independência.'},
            {'acao': 'Ouvir delator anônimo do governo', 'custo': {'relacaoGoverno': -10, 'respeitoInstitucional': -5}, 'resultado': "Governo ordenou vigilância ilegal contra 200 cidadãos.", 'novaProva': 'Gravações detalhando ordens de vigilância.'}
        ],
        'decisoes': [
            {'texto': 'Condenar Sombra por traição', 'efeitos': {'apoioPopular': -20, 'respeitoInstitucional': 10, 'influenciaPolitica': 15, 'relacaoImprensa': -15, 'relacaoGoverno': 15, 'relacaoONGs': -10}, 'manchete': 'Sombra Preso! Tribunal Pune Traidor!', 'reacaoPopular': "Protestos: '#LiberdadeSombra'", 'reacaoMidia': "Diário da Ordem: 'Segurança nacional protegida!'"},
            {'texto': 'Absolver Sombra como denunciante', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -15, 'influenciaPolitica': -20, 'relacaoImprensa': 15, 'relacaoGoverno': -20, 'relacaoONGs': 15}, 'manchete': 'Sombra Livre! Herói da Verdade Vence!', 'reacaoPopular': "Multidões celebram: '#SombraVive'", 'reacaoMidia': "Globo: 'Decisão abala o governo.'"},
            {'texto': 'Adiar decisão e investigar governo', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -10, 'relacaoImprensa': -5, 'relacaoGoverno': -10, 'relacaoONGs': 5}, 'manchete': 'Justiça Hesita! Caso Sombra no Limbo!', 'reacaoPopular': "'#JustiçaLenta' viraliza.", 'reacaoMidia': "Jornal Progressista: 'Adiar é necessário.'"},
            {'texto': 'Proteger Sombra e condenar vigilância', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': -10, 'influenciaPolitica': -15, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': 10}, 'manchete': 'Sombra Salvo! Vigilância Condenada!', 'reacaoPopular': "'#SombraHerói' ganha força.", 'reacaoMidia': "Voz do Povo: 'Passo contra corrupção!'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Sombra é herói!'", "Diário da Ordem: 'Sombra é traidor!'", "Rede Social: '#LiberdadeSombra'"]
    },
    {
        'id': 'caso_06', 'titulo': 'O Escândalo da Privatização da Água',
        'descricao': "Salvador, 10 de junho de 2025 – AquaCorp é acusada de manipular privatização do sistema de água, cobrando tarifas abusivas.",
        'imagem': 'assets/images/caso_06_agua.jpg',
        'provas': ["Contratos mostram pagamento de R$ 10 milhões a consultores.", "40% dos bairros pobres sem água há meses.", "Executivos comemoram lucros recordes em vídeo."],
        'investigacoes': [
            {'acao': 'Auditar contratos da privatização', 'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5}, 'resultado': "Cláusulas secretas favorecem AquaCorp.", 'novaProva': 'Documento com cláusulas secretas.'},
            {'acao': 'Entrevistar moradores', 'custo': {'relacaoImprensa': -5, 'apoioPopular': -5}, 'resultado': "Milícias ligadas à AquaCorp ameaçam moradores.", 'novaProva': 'Depoimentos gravados.'}
        ],
        'decisoes': [
            {'texto': 'Anular privatização e estatizar', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -10, 'influenciaPolitica': -15, 'relacaoImprensa': 10, 'relacaoGoverno': -20, 'relacaoONGs': 15}, 'manchete': 'Água é do Povo! Privatização Anulada!', 'reacaoPopular': "'#ÁguaParaTodos' viraliza.", 'reacaoMidia': "Jornal do Povo: 'Vitória contra a ganância!'"},
            {'texto': 'Manter privatização e multar', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': 10, 'influenciaPolitica': 10, 'relacaoImprensa': -10, 'relacaoGoverno': 15, 'relacaoONGs': -10}, 'manchete': 'AquaCorp Multada, Privatização Segue!', 'reacaoPopular': "Protestos: '#ÁguaNãoÉMercadoria'", 'reacaoMidia': "Diário da Ordem: 'Solução mantém estabilidade.'"},
            {'texto': 'Adiar e formar comissão', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Justiça Empurra Caso!', 'reacaoPopular': "Frustração: '#JustiçaLenta'", 'reacaoMidia': "Voz do Povo: 'Comissões são perda de tempo!'"},
            {'texto': 'Punir AquaCorp e rever contratos', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': 5, 'influenciaPolitica': -10, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': 10}, 'manchete': 'AquaCorp Punida! Contratos Revistos!', 'reacaoPopular': "Apoio: '#JustiçaPelaÁgua'", 'reacaoMidia': "Globo: 'Decisão tenta equilibrar tensões.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'AquaCorp lucra enquanto povo sofre!'", "Diário da Ordem: 'Privatização trouxe eficiência!'", "Rede Social: '#ÁguaParaTodos'"]
    },
    {
        'id': 'caso_07', 'titulo': 'A Queda do Ídolo do Futebol',
        'descricao': "Rio de Janeiro, 22 de agosto de 2025 – Astro do futebol Gabriel Lima é acusado de sonegar R$ 80 milhões em impostos usando offshores.",
        'imagem': 'assets/images/caso_07_futebol.jpg',
        'provas': ["Extratos mostram transferências para Ilhas Virgens.", "E-mails sugerem que Gabriel sabia das operações.", "Ex-contador afirma que Gabriel ordenou sonegação."],
        'investigacoes': [
            {'acao': 'Rastrear contas offshore', 'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5}, 'resultado': "Gabriel controlava contas diretamente.", 'novaProva': 'Registros bancários com assinatura.'},
            {'acao': 'Interrogar ex-contador', 'custo': {'respeitoInstitucional': -5, 'relacaoGoverno': -5}, 'resultado': "Documentos comprovam ordens de Gabriel.", 'novaProva': 'Documentos assinados.'}
        ],
        'decisoes': [
            {'texto': 'Condenar Gabriel a 5 anos', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': 15, 'influenciaPolitica': 10, 'relacaoImprensa': -10, 'relacaoGoverno': 15, 'relacaoONGs': -5}, 'manchete': 'Ídolo na Cadeia!', 'reacaoPopular': "Fãs: '#GabrielInocente'", 'reacaoMidia': "Globo: 'Justiça contra privilégios!'"},
            {'texto': 'Absolver Gabriel', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -15, 'influenciaPolitica': -10, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': 5}, 'manchete': 'Gabriel Livre!', 'reacaoPopular': "Fãs: '#GabrielVence'", 'reacaoMidia': "Jornal do Povo: 'Tribunal cede à pressão!'"},
            {'texto': 'Exigir nova investigação', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Caso Adiado!', 'reacaoPopular': "Memes: '#JustiçaFutebol'", 'reacaoMidia': "Voz do Povo: 'Mais atrasos!'"},
            {'texto': 'Multar Gabriel com base em provas', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': 10, 'influenciaPolitica': 0, 'relacaoImprensa': 5, 'relacaoGoverno': 10, 'relacaoONGs': 0}, 'manchete': 'Gabriel Multado em R$ 100 Milhões!', 'reacaoPopular': "Apoio misto: '#JustiçaFeita'", 'reacaoMidia': "Globo: 'Solução evita crise.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Gabriel traiu o Brasil!'", "Fãs: 'Gabriel é vítima!'", "Rede Social: '#GabrielInocente'"]
    },
    {
        'id': 'caso_08', 'titulo': 'O Julgamento da Inteligência Artificial',
        'descricao': "São Paulo, 15 de outubro de 2025 – TechNova é acusada de usar sua IA Aurora para manipular eleições com desinformação.",
        'imagem': 'assets/images/caso_08_ia.jpg',
        'provas': ["Logs mostram Aurora gerou 10 milhões de postagens falsas.", "E-mails sugerem lucro de R$ 200 milhões.", "Hackers assumem autoria, sem provas."],
        'investigacoes': [
            {'acao': 'Analisar servidores da Aurora', 'custo': {'relacaoImprensa': -5, 'respeitoInstitucional': -5}, 'resultado': "IA foi programada para manipular.", 'novaProva': 'Código-fonte com instruções de manipulação.'},
            {'acao': 'Investigar hackers', 'custo': {'influenciaPolitica': -5, 'relacaoGoverno': -5}, 'resultado': "Sem evidências de acesso externo à Aurora.", 'novaProva': 'Relatório negando hackers.'}
        ],
        'decisoes': [
            {'texto': 'Banir Aurora e multar TechNova', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': -10, 'influenciaPolitica': -15, 'relacaoImprensa': 10, 'relacaoGoverno': -20, 'relacaoONGs': 15}, 'manchete': 'Fim da Aurora!', 'reacaoPopular': "'#IAControlada' viraliza.", 'reacaoMidia': "Jornal do Povo: 'Vitória contra manipulação!'"},
            {'texto': 'Absolver TechNova', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': 10, 'influenciaPolitica': 15, 'relacaoImprensa': -10, 'relacaoGoverno': 15, 'relacaoONGs': -15}, 'manchete': 'TechNova Livre!', 'reacaoPopular': "Protestos: '#IADestrói'", 'reacaoMidia': "Diário da Ordem: 'Tecnologia protegida!'"},
            {'texto': 'Adiar e regular IAs', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Justiça Hesita!', 'reacaoPopular': "'#RegulemIA' ganha força.", 'reacaoMidia': "Voz do Povo: 'Adiar é arriscado!'"},
            {'texto': 'Desativar Aurora com provas', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': 5, 'influenciaPolitica': -10, 'relacaoImprensa': 10, 'relacaoGoverno': -10, 'relacaoONGs': 10}, 'manchete': 'Aurora Desligada!', 'reacaoPopular': "'#JustiçaDigital' celebrada.", 'reacaoMidia': "Globo: 'Decisão balanceia inovação e ética.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Aurora manipulou a democracia!'", "TechNova: 'Somos vítimas!'", "Rede Social: '#RegulemIA'"]
    },
    {
        'id': 'caso_09', 'titulo': 'A Crise da Reforma Agrária',
        'descricao': "Mato Grosso, 5 de dezembro de 2025 – Líder do Movimento Terra Livre é acusado de invasão de terras e incitar conflitos com 10 mortos.",
        'imagem': 'assets/images/caso_09_reforma.jpg',
        'provas': ["Vídeos mostram José liderando ocupações.", "Relatórios citam armas com membros do movimento.", "Testemunhas afirmam que fazendeiros contrataram milícias."],
        'investigacoes': [
            {'acao': 'Investigar milícias', 'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5}, 'resultado': "Milícias foram pagas para provocar conflitos.", 'novaProva': 'Gravações contratando milícias.'},
            {'acao': 'Analisar armas apreendidas', 'custo': {'relacaoONGs': -5, 'apoioPopular': -5}, 'resultado': "Armas são de origem policial, sugerindo armação.", 'novaProva': 'Relatório balístico.'}
        ],
        'decisoes': [
            {'texto': 'Condenar líder do movimento', 'efeitos': {'apoioPopular': -15, 'respeitoInstitucional': 10, 'influenciaPolitica': 15, 'relacaoImprensa': -10, 'relacaoGoverno': 15, 'relacaoONGs': -15}, 'manchete': 'Líder Preso!', 'reacaoPopular': "Camponeses: '#JoséHerói'", 'reacaoMidia': "Diário da Ordem: 'Ordem no campo!'"},
            {'texto': 'Absolver e investigar fazendeiros', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -15, 'influenciaPolitica': -20, 'relacaoImprensa': 15, 'relacaoGoverno': -20, 'relacaoONGs': 15}, 'manchete': 'Fazendeiros na Mira!', 'reacaoPopular': "'#TerraLivreVence'", 'reacaoMidia': "Globo: 'Decisão pode inflamar o campo.'"},
            {'texto': 'Adiar e mediar conflitos', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Tribunal Tenta Paz!', 'reacaoPopular': "'#JustiçaLenta'", 'reacaoMidia': "Voz do Povo: 'Mediação é fraca!'"},
            {'texto': 'Punir milícias e advertir líder', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': 0, 'influenciaPolitica': -10, 'relacaoImprensa': 10, 'relacaoGoverno': -10, 'relacaoONGs': 10}, 'manchete': 'Milícias Punidas! Líder Advertido!', 'reacaoPopular': "'#ReformaVive'", 'reacaoMidia': "Globo: 'Solução busca equilíbrio.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'Herói ou bandido?'", "Fazendeiros: 'Terrorismo!'", "Rede Social: '#ReformaAgrária'"]
    },
    {
        'id': 'caso_10', 'titulo': 'O Colapso da Barragem do Norte',
        'descricao': "Pará, 20 de fevereiro de 2026 – Barragem da mineradora NorteMinas ruiu, matando 200 pessoas e devastando comunidades indígenas.",
        'imagem': 'assets/images/caso_10_barragem.avif',
        'provas': ["Laudos mostram rachaduras ignoradas por 2 anos.", "E-mails minimizam alertas de engenheiros.", "Líder indígena relata despejo ilegal de rejeitos."],
        'investigacoes': [
            {'acao': 'Periciar barragem', 'custo': {'relacaoImprensa': -5, 'apoioPopular': -5}, 'resultado': "Negligência grave com cortes de manutenção.", 'novaProva': 'Relatório pericial detalhado.'},
            {'acao': 'Ouvir engenheiros', 'custo': {'relacaoGoverno': -5, 'respeitoInstitucional': -5}, 'resultado': "Engenheiros foram pressionados a ignorar riscos.", 'novaProva': 'Depoimentos gravados.'}
        ],
        'decisoes': [
            {'texto': 'Multar em R$ 10 bilhões', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': -10, 'influenciaPolitica': -15, 'relacaoImprensa': 15, 'relacaoGoverno': -20, 'relacaoONGs': 15}, 'manchete': 'NorteMinas Paga R$ 10 Bi!', 'reacaoPopular': "'#JustiçaIndígena' viraliza.", 'reacaoMidia': "Jornal do Povo: 'Multa histórica!'"},
            {'texto': 'Absolver por força maior', 'efeitos': {'apoioPopular': -20, 'respeitoInstitucional': 15, 'influenciaPolitica': 15, 'relacaoImprensa': -15, 'relacaoGoverno': 15, 'relacaoONGs': -15}, 'manchete': 'NorteMinas Livre!', 'reacaoPopular': "Indígenas: '#JustiçaVendida'", 'reacaoMidia': "Diário da Ordem: 'Decisão protege economia.'"},
            {'texto': 'Exigir nova perícia', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 5, 'influenciaPolitica': -5, 'relacaoImprensa': -5, 'relacaoGoverno': -5, 'relacaoONGs': 5}, 'manchete': 'Caso Adiado!', 'reacaoPopular': "'#JustiçaLenta'", 'reacaoMidia': "Voz do Povo: 'Adiar é conivência!'"},
            {'texto': 'Fechar NorteMinas com provas', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': 0, 'influenciaPolitica': -20, 'relacaoImprensa': 10, 'relacaoGoverno': -15, 'relacaoONGs': 10}, 'manchete': 'NorteMinas Fechada!', 'reacaoPopular': "'#VidaIndígena' celebrada.", 'reacaoMidia': "Globo: 'Fechamento abala economia local.'", 'requiresInvestigation': True}
        ],
        'midia': ["Jornal do Povo: 'NorteMinas destruiu o Norte!'", "NorteMinas: 'Chuva causou o colapso!'", "Rede Social: '#JustiçaIndígena'"]
    },
    {   'id': 'caso_11', 'titulo': 'Nó 11: O Tratado de Artemis vs. O Acordo da Lua de Pequim (NG+)',
        'descricao': "Expandindo além da atmosfera. Nova Aurora pousou com sucesso no Polo Sul lunar. Os EUA exigem que o país assine os Acordos de Artemis (permitindo posse privada de terrenos lunares para mineradoras ocidentais). A China ameaça abater foguetes na rampa se não assinarmos o pacto de exploração coletiva estatal do bloco oriental.",
        'imagem': 'https://placehold.co/800x200/0a0a1a/ff0040?text=NG%2B+-+Fantasma',
        'provas': ["O Conselho de Segurança Nacional confirma que ambas as potências têm capacidade de interditar nosso programa espacial.", "O Lítio lunar é o prêmio final da Guerra Fria Tecnológica."],
        'investigacoes': [],
        'decisoes': [
            {'texto': 'Assinar os Acordos de Artemis (Aliança Ocidental)', 'efeitos': {'apoioPopular': -10, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora assina com o Ocidente!', 'reacaoPopular': 'População dividida.', 'reacaoMidia': 'Jornal do Povo: Aliança histórica!'},
            {'texto': 'Assinar o Pacto Lunar de Pequim (Bloco Oriental)', 'efeitos': {'apoioPopular': -5, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora alinha-se ao Leste!', 'reacaoPopular': 'Apoio moderado.', 'reacaoMidia': 'Mídia internacional reage.'},
            {'texto': 'Recusar Ambos (Soberania Lunar Total)', 'efeitos': {'apoioPopular': 30, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora declara independência lunar!', 'reacaoPopular': 'Nacionalistas celebram!', 'reacaoMidia': 'Imprensa global: Soberania ou loucura?'}
        ],
        'midia': ["Cidade do Cabo: 'Nova Aurora desafia superpotências!'", "Washington Post: 'Um novo ator no espaço.'"]
    },
    {   'id': 'caso_12', 'titulo': 'Nó 12: A Privatização da Gravidade (NG+)',
        'descricao': "Uma corporação aeroespacial construiu anéis habitacionais na órbita baixa da Terra. Eles oferecem asilo e cidadania orbital para a elite financeira de Nova Aurora em troca de isenção total de impostos territoriais terrestres. O país corre o risco de sofrer evasão total de cérebros e capital para o espaço.",
        'imagem': 'https://placehold.co/800x200/0a0a1a/ffaa00?text=NG%2B+-+Revolta',
        'provas': ["A corporação já tem uma lista de 300 famílias bilionárias prontas para migrar.", "40% do PIB nacional pode evaporar para o vácuo."],
        'investigacoes': [],
        'decisoes': [
            {'texto': 'Aceitar o Acordo Orbital (Capital no Espaço)', 'efeitos': {'apoioPopular': -25, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Elite migra para os anéis!', 'reacaoPopular': 'Protestos contra o êxodo!', 'reacaoMidia': 'Polêmica nacional.'},
            {'texto': 'Nacionalizar os Anéis (Soberania Estatal)', 'efeitos': {'apoioPopular': 25, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Governo toma controle dos anéis!', 'reacaoPopular': 'População aprova!', 'reacaoMidia': 'Parceiros internacionais preocupados.'},
            {'texto': 'Tributar e Regular (Meio Termo)', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Regulação orbital aprovada!', 'reacaoPopular': 'Solução de compromisso.', 'reacaoMidia': 'Analistas elogiam moderação.'}
        ],
        'midia': ["Financial Times: 'Nova Aurora enfrenta fuga de capitais.'", "TechNova: 'O futuro é orbital.'"]
    },
    {   'id': 'caso_13', 'titulo': 'Nó 13: O Primeiro Crime em Solo Lunar (NG+)',
        'descricao': "Um cientista militar de Nova Aurora assassinou o CEO de uma mineradora estrangeira dentro da base lunar estatal, sob acusação de espionagem tecnológica. A potência estrangeira exige extradição imediata.",
        'imagem': 'https://placehold.co/800x200/0a0a1a/00ff88?text=NG%2B+-+Algoritmo',
        'provas': ["O cientista descobriu que a mineradora estava contrabandeando Hélio-3.", "O assassinato foi um ato de sabotagem preventiva."],
        'investigacoes': [],
        'decisoes': [
            {'texto': 'Extraditar o Cientista (Direito Internacional)', 'efeitos': {'apoioPopular': -20, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Cientista extraditado!', 'reacaoPopular': 'Militares indignados.', 'reacaoMidia': 'Pressão internacional aliviada.'},
            {'texto': 'Julgá-lo em Nova Aurora (Soberania Legal)', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora assume jurisdição lunar!', 'reacaoPopular': 'Nacionalistas aprovam!', 'reacaoMidia': 'Comunidade internacional preocupada.'},
            {'texto': 'Condecorá-lo como Herói de Guerra', 'efeitos': {'apoioPopular': 25, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Cientista vira herói nacional!', 'reacaoPopular': 'Ovação nas ruas!', 'reacaoMidia': 'Diplomacia em crise.'}
        ],
        'midia': ["BBC: 'Nova Aurora desafia normas internacionais.'", "Al Jazeera: 'O primeiro crime da Lua.'"]
    },
    {   'id': 'caso_14', 'titulo': 'Nó 14: O Protocolo de Contenção de Singularidade (NG+)',
        'descricao': "Cientistas de todo o mundo confirmam: a humanidade está a 5 anos da Singularidade inevitável. O governo de Nova Aurora propõe sediar o Conselho Global de Contenção de IA.",
        'imagem': 'https://placehold.co/800x200/0a0a1a/8844ff?text=NG%2B+-+Legado',
        'provas': ["O Firewall Ético daria a Nova Aurora controle geopolítico sem precedentes.", "Desenvolver ASI própria nos tornaria alvo de sanções."],
        'investigacoes': [],
        'decisoes': [
            {'texto': 'Sediar o Conselho de Firewall Ético (Liderança Global)', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora lidera contenção de IA!', 'reacaoPopular': 'Esperança global.', 'reacaoMidia': 'Aplauso internacional.'},
            {'texto': 'Desenvolver ASI Nacional Soberana', 'efeitos': {'apoioPopular': -10, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora constrói sua própria ASI!', 'reacaoPopular': 'Medo e orgulho nacional.', 'reacaoMidia': 'Sanções iminentes.'},
            {'texto': 'Banir Pesquisa de IA (Reserva Humana)', 'efeitos': {'apoioPopular': 15, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Nova Aurora se torna reserva analógica!', 'reacaoPopular': 'Ultra-ricos migram para o país.', 'reacaoMidia': 'Comunidade científica critica.'}
        ],
        'midia': ["Nature: 'Nova Aurora no centro do debate sobre IA.'", "TechCrunch: 'O país que pode salvar a humanidade.'"]
    },
    {   'id': 'caso_15', 'titulo': 'Nó 15: O Legado Além da Atmosfera (NG+)',
        'descricao': "O programa espacial de Nova Aurora está completo. Uma nave interestelar está sendo construída no estaleiro orbital. O Conselho da Humanidade vota se a primeira missão além do sistema solar levará o DNA, a cultura ou a consciência digital da humanidade.",
        'imagem': 'https://placehold.co/800x200/0a0a1a/b89c5b?text=NG%2B+-+Final',
        'provas': ["Cada opção tem riscos existenciais.", "A humanidade precisa escolher seu legado cósmico."],
        'investigacoes': [],
        'decisoes': [
            {'texto': 'Enviar o DNA de Todas as Espécies (Arca de Noé Cósmica)', 'efeitos': {'apoioPopular': 20, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Arca de Noé Cósmica lançada!', 'reacaoPopular': 'Humanidade plantada no cosmos.', 'reacaoMidia': 'Cobertura global emocionada.'},
            {'texto': 'Transmitir a Cultura e o Conhecimento (Sinal Aurora)', 'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Sinal Aurora transmitido!', 'reacaoPopular': 'Nossa cultura ecoa no espaço.', 'reacaoMidia': 'Cientistas celebram marco histórico.'},
            {'texto': 'Digitalizar a Consciência em Matéria Quântica (Salto Pós-Humano)', 'efeitos': {'apoioPopular': 0, 'respeitoInstitucional': 0, 'influenciaPolitica': 0, 'relacaoImprensa': 0, 'relacaoGoverno': 0, 'relacaoONGs': 0}, 'manchete': 'Salto Pós-Humano iniciado!', 'reacaoPopular': 'Humanidade digitalizada.', 'reacaoMidia': 'O fim da humanidade como conhecemos.'}
        ],
        'midia': ["O Estado de SP: 'Nova Aurora escreve o futuro da humanidade.'", "BBC: 'O legado interestelar do Supremo.'"]
    }
]

def validate_name(name: str) -> bool:
    return bool(re.match(r'^[a-zA-Z0-9\s]{1,20}$', name))

def apply_effects(effects: Dict[str, int]) -> Dict[str, int]:
    changes = {}
    for key, value in effects.items():
        if key == 'orcamento':
            state['orcamento'] = max(0, min(100, state['orcamento'] + value))
        elif key in ('apoioPopular', 'respeitoInstitucional', 'influenciaPolitica',
                     'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs'):
            state[key] = max(0, min(100, state[key] + value))
        changes[key] = value
    return changes

def get_reputation() -> Dict[str, int]:
    return {k: state[k] for k in ('orcamento', 'apoioPopular', 'respeitoInstitucional',
                                   'influenciaPolitica', 'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs')}

def start_game(player_name: str) -> Dict[str, str]:
    if not validate_name(player_name):
        return {'status': 'error', 'message': 'Nome inválido! Use letras, números e espaços (máx. 20 caracteres).'}
    for k in list(state.keys()):
        if k in ('playerName', 'dificuldade'): continue
        if k == 'orcamento': state[k] = 100
        elif k == 'custoManutencao': state[k] = 10
        elif k == 'maxInvestigations': state[k] = 2
        elif k == 'casosJulgados': state[k] = 0
        elif k == 'investigationsDone': state[k] = 0
        elif k == 'currentCase': state[k] = None
        elif k in ('career', 'profile'): state[k] = None
        elif k == 'careerCharges': state[k] = 0
        else: state[k] = 50
    state['playerName'] = player_name
    return {'status': 'success', 'message': f'Bem-vindo, {player_name}, ao Tribunal Supremo Popular!'}

def set_difficulty(level: str) -> Dict[str, str]:
    if level not in ('fácil', 'médio', 'difícil'):
        return {'status': 'error', 'message': 'Dificuldade inválida.'}
    state['dificuldade'] = level
    if level == 'fácil':
        state['orcamento'] = 50; state['custoManutencao'] = 5; state['maxInvestigations'] = 3
    elif level == 'médio':
        state['orcamento'] = 100; state['custoManutencao'] = 10; state['maxInvestigations'] = 2
    else:
        state['orcamento'] = 150; state['custoManutencao'] = 15; state['maxInvestigations'] = 1
    load_case()
    return {'status': 'success', 'message': f'Dificuldade: {level}'}

def load_case() -> None:
    if state['casosJulgados'] >= len(casos):
        state['currentCase'] = None; return
    state['currentCase'] = casos[state['casosJulgados']]
    state['investigationsDone'] = 0

def get_current_case() -> Optional[Dict]:
    if not state['currentCase']: return None
    caso = state['currentCase']
    valid = [d for d in caso['decisoes'] if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    return {
        'titulo': caso['titulo'], 'descricao': caso['descricao'], 'imagem': caso['imagem'],
        'provas': caso['provas'],
        'investigacoes': caso['investigacoes'] if state['investigationsDone'] < state['maxInvestigations'] else [],
        'decisoes': valid, 'midia': caso['midia']
    }

def investigate(index: int) -> Dict[str, any]:
    if state['investigationsDone'] >= state['maxInvestigations']:
        return {'status': 'error', 'message': 'Limite de investigações atingido.'}
    if index < 0 or index >= len(state['currentCase']['investigacoes']):
        return {'status': 'error', 'message': 'Investigação inválida.'}
    if state['orcamento'] < 20:
        return {'status': 'error', 'message': 'Orçamento insuficiente!'}
    inv = state['currentCase']['investigacoes'][index]
    state['orcamento'] -= 20
    state['investigationsDone'] += 1
    changes = apply_effects(inv['custo'])
    state['currentCase']['provas'].append(inv['novaProva'])
    return {'status': 'success', 'message': inv['resultado'], 'changes': changes, 'newProva': inv['novaProva']}

def handle_crisis_choice(index: int) -> Dict[str, any]:
    if not eventos_crise: return {'status': 'error', 'message': 'Nenhuma crise ativa.'}
    crisis_idx = state.get('activeCrisis', 0)
    if crisis_idx < 0 or crisis_idx >= len(eventos_crise):
        crisis_idx = 0
    crisis = eventos_crise[crisis_idx]
    if index < 0 or index >= len(crisis['opcoes']):
        return {'status': 'error', 'message': 'Escolha inválida.'}
    opcao = crisis['opcoes'][index]
    changes = apply_effects(opcao['efeitos'])
    return {'status': 'success', 'message': opcao['resultado'], 'changes': changes}

def handle_difficulty_diplomacy(choice: str) -> Dict[str, any]:
    changes = {}
    if choice == 'imprensa':
        custos = {'fácil': -5, 'médio': -10, 'difícil': -15}
        changes = apply_effects({'relacaoImprensa': 15, 'orcamento': custos[state['dificuldade']]})
    elif choice == 'governo':
        changes = apply_effects({'relacaoGoverno': 10, 'relacaoImprensa': -5, 'orcamento': -1})
    elif choice == 'ongs':
        changes = apply_effects({'relacaoONGs': 10, 'relacaoGoverno': -5, 'orcamento': -1})
    elif choice == 'skip':
        load_case()
        return {'status': 'success', 'message': 'Diplomacia pulada.', 'nextScreen': 'case'}
    else:
        return {'status': 'error', 'message': 'Ação inválida.'}
    load_case()
    return {'status': 'success', 'message': 'Diplomacia concluída.', 'changes': changes, 'nextScreen': 'case'}

def make_decision(index: int) -> Dict[str, any]:
    valid = [d for d in state['currentCase']['decisoes']
             if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    if index < 0 or index >= len(valid):
        return {'status': 'error', 'message': 'Decisão inválida.'}
    decision = valid[index]
    changes = apply_effects(decision['efeitos'])
    state['casosJulgados'] += 1
    state['orcamento'] = max(0, state['orcamento'] - state['custoManutencao'])

    if (state['orcamento'] <= 0 or state['apoioPopular'] <= 0 or
        state['respeitoInstitucional'] <= 0 or state['influenciaPolitica'] <= 0 or
        state['relacaoImprensa'] <= 0 or state['relacaoGoverno'] <= 0 or state['relacaoONGs'] <= 0):
        return end_game()

    is_crisis_case = state['casosJulgados'] in (3, 7, 9)
    event = None
    if random.random() < 0.35:
        possible = [e for e in eventos_aleatorios if not e.get('condicao') or e['condicao']()]
        if possible:
            event = random.choice(possible)
            event_changes = apply_effects(event['efeitos'])
            changes.update(event_changes)

    result = {
        'status': 'crisis' if is_crisis_case else 'success',
        'manchete': decision['manchete'],
        'reacaoPopular': decision['reacaoPopular'],
        'reacaoMidia': decision['reacaoMidia'],
        'event': event, 'changes': changes,
        'nextScreen': 'diplomacy'
    }
    if is_crisis_case:
        crisis_idx = 0 if state['casosJulgados'] == 3 else 1 if state['casosJulgados'] == 7 else 2
        crisis_idx = min(crisis_idx, len(eventos_crise) - 1)
        state['activeCrisis'] = crisis_idx
        result['crisis'] = eventos_crise[crisis_idx]
    return result

def end_game() -> Dict[str, str]:
    final_text = ""
    legacy_score = sum(state[k] for k in ('apoioPopular', 'respeitoInstitucional', 'influenciaPolitica',
                                           'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs')) / 6
    cases = state['casosJulgados']
    if state['orcamento'] <= 0:
        final_text = f"{state['playerName']}, o tribunal faliu! Sem recursos, você foi destituído."
    elif state['apoioPopular'] <= 0:
        final_text = f"{state['playerName']}, a fúria do povo selou seu destino. Multidões invadiram o tribunal."
    elif state['respeitoInstitucional'] <= 0:
        final_text = f"{state['playerName']}, as instituições voltaram-se contra você. O Supremo foi dissolvido."
    elif state['influenciaPolitica'] <= 0:
        final_text = f"{state['playerName']}, as elites isolaram você. Seu tribunal foi extinto."
    elif state['relacaoImprensa'] <= 0:
        final_text = f"{state['playerName']}, a imprensa destruiu sua reputação. Escândalos forçaram seu afastamento."
    elif state['relacaoGoverno'] <= 0:
        final_text = f"{state['playerName']}, o governo conspirou contra você. O Congresso dissolveu seu tribunal."
    elif state['relacaoONGs'] <= 0:
        final_text = f"{state['playerName']}, ONGs denunciaram suas decisões. Você renunciou."
    elif cases >= len(casos):
        alinhamento = ('Justiça Implacável' if legacy_score > 70 and state['apoioPopular'] > state['influenciaPolitica']
                       else 'Ponte de Consenso' if legacy_score > 50
                       else 'Mão de Ferro' if state['influenciaPolitica'] > 70
                       else 'Legado Controverso')
        if legacy_score > 80:
            final_text = f"{state['playerName']}, você é uma lenda! Após {len(casos)} casos, sua imparcialidade conquistou a nação.\n\nAlinhamento: {alinhamento}\nParabéns! Nível Avançado desbloqueado!"
        elif legacy_score > 50:
            final_text = f"{state['playerName']}, você completou {len(casos)} casos com equilíbrio. Alinhamento: {alinhamento}"
        else:
            final_text = f"{state['playerName']}, após {len(casos)} casos, suas decisões dividiram a nação. Alinhamento: {alinhamento}"
    else:
        final_text = f"{state['playerName']}, trajetória controversa após {cases} casos."
    final_text += f"\n\nCasos: {cases}/{len(casos)} | Orçamento: R${state['orcamento']} | Reputação: {round(legacy_score)}"
    return {'status': 'game_over', 'message': final_text}
