# tribunal_supremo.py
import random
import time
import re
from typing import Dict, List, Optional

# === Estado do Jogo ===
state = {
    'playerName': '',
    'dificuldade': '',
    'apoioPopular': 50,
    'respeitoInstitucional': 50,
    'influenciaPolitica': 50,
    'relacaoImprensa': 50,
    'relacaoGoverno': 50,
    'relacaoONGs': 50,
    'casosJulgados': 0,
    'currentCase': None,
    'investigationsDone': 0,
    'maxInvestigations': 2,
    'orcamento': 10000,  # R$ 100.000
    'custoManutencao': 1000  # R$ 10.000
}

# === Eventos Aleatórios ===
eventos_aleatorios = [
    {
        'id': 'protestos',
        'texto': (
            "**Noite de Fúria e Cinzas: A Revolta que Paralisou a Capital**\n\n"
            "Milhares de pessoas tomaram as ruas, erguendo barricadas de pneus em chamas. "
            "Com a hashtag #ForaJuiz, manifestantes expressam indignação contra uma decisão judicial."
        ),
        'efeitos': {'apoioPopular': -10, 'relacaoImprensa': -5},
        'condicao': lambda: state['relacaoImprensa'] < 25 or state['apoioPopular'] < 30,
        'imagem': 'assets/images/protestos.jpg'
    },
    {
        'id': 'elogio_ong',
        'texto': (
            "**Um Farol na Tempestade: ONG Reconhece a Coragem do Juiz**\n\n"
            "A ONG Justiça Sem Fronteiras exalta o juiz como exemplo de integridade, "
            "oferecendo esperança em meio à crise."
        ),
        'efeitos': {'respeitoInstitucional': 10, 'relacaoONGs': 10},
        'condicao': lambda: state['relacaoONGs'] > 75,
        'imagem': 'assets/images/elogio_ong.jpg'
    },
    {
        'id': 'vazamento',
        'texto': (
            "**Vazamento Explosivo: Áudios Revelam Conluio**\n\n"
            "Áudios sugerem uma aliança entre o juiz e o governo, abalando a confiança pública "
            "e desencadeando investigações."
        ),
        'efeitos': {'influenciaPolitica': -15, 'relacaoImprensa': -10},
        'condicao': lambda: state['relacaoGoverno'] > 75 and state['relacaoImprensa'] < 50,
        'imagem': 'assets/images/vazamento.jpg'
    },
    {
        'id': 'aplausos_imprensa',
        'texto': (
            "**Luz na Escuridão: Imprensa Exalta Decisão do Tribunal**\n\n"
            "O Jornal do Povo publica editorial elogiando a imparcialidade do juiz, "
            "inspirando confiança na justiça."
        ),
        'efeitos': {'relacaoImprensa': 10, 'apoioPopular': 5},
        'condicao': lambda: state['relacaoImprensa'] > 75,
        'imagem': 'assets/images/aplausos_imprensa.jpg'
    }
]

# === Eventos de Crise ===
eventos_crise = [
    {
        'id': 'crise_judiciaria',
        'texto': (
            "**Crise Judicial: Greve Nacional de Magistrados**\n\n"
            "Uma greve histórica paralisa o Judiciário, liderada por juízes que exigem melhores salários e condições. "
            "A população está dividida: alguns apoiam a causa, outros veem a paralisação como abandono do dever. "
            "Como Juiz Supremo, sua posição será crucial.\n\n"
            "A nação observa enquanto o tribunal, símbolo da justiça, enfrenta sua maior prova. "
            "Escolha com cuidado: sua decisão pode fortalecer ou destruir a confiança no sistema judicial."
        ),
        'imagem': 'assets/images/greve_judiciaria.jpg',
        'opcoes': [
            {
                'texto': 'Apoiar a greve e negociar com os juízes',
                'efeitos': {'apoioPopular': -10, 'respeitoInstitucional': 15, 'relacaoGoverno': -10},
                'resultado': (
                    "Os juízes encerram a greve após negociações tensas, mas o governo promete represálias, "
                    "acusando você de fraqueza."
                )
            },
            {
                'texto': 'Condenar a greve e exigir retorno ao trabalho',
                'efeitos': {'apoioPopular': 10, 'respeitoInstitucional': -15, 'relacaoGoverno': 10},
                'resultado': (
                    "A greve termina sob pressão, mas o Judiciário fica ressentido, "
                    "prometendo resistência interna contra suas decisões."
                )
            },
            {
                'texto': 'Ignorar a crise e focar nos casos',
                'efeitos': {'respeitoInstitucional': -5, 'relacaoImprensa': -5},
                'resultado': (
                    "A crise se arrasta, com a mídia acusando o tribunal de covardia. "
                    "A confiança pública no Judiciário despenca."
                )
            }
        ]
    }
]

# === Casos ===
casos = [
    {
        'id': 'caso_01',
        'titulo': 'O Roubo do Século na Fundação Esperança',
        'descricao': (
            "Brasília, 16 de março de 2024 – O deputado João Almeida, presidente da Fundação Esperança, "
            "é acusado de desviar R$ 2,3 bilhões destinados a salvar vidas. "
            "Imagens mostram malas de dinheiro em seu escritório, enquanto protestos eclodem. "
            "A ONG Futuro Global defende Almeida, mas o povo exige justiça."
        ),
        'imagem': 'assets/images/caso_01_malas_dinheiro.jpg',
        'provas': [
            "Vídeo clandestino mostra 15 malas de dinheiro no escritório de Almeida, com ele murmurando: 'Isso é só o começo.'",
            "E-mails criptografados revelam transferências de R$ 500 milhões para empresas de fachada.",
            "Ex-contador Pedro Costa entrega dossiê com contratos falsos assinados por Almeida."
        ],
        'investigacoes': [
            {
                'acao': 'Contratar auditoria independente da PwC',
                'custo': {'apoioPopular': -5, 'relacaoImprensa': -5},
                'resultado': (
                    "A PwC revela: 62% dos fundos foram desviados para as Ilhas Cayman, "
                    "com Almeida assinando as transações."
                ),
                'novaProva': 'Relatório da PwC com extratos bancários.'
            },
            {
                'acao': 'Interrogar ex-contador sob juramento',
                'custo': {'respeitoInstitucional': -5, 'relacaoONGs': -5},
                'resultado': (
                    "Pedro Costa entrega vídeo de Almeida o ameaçando e contratos fraudulentos."
                ),
                'novaProva': 'Vídeo e arquivos com a trilha do dinheiro roubado.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar Almeida com pena máxima de 15 anos',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': -10
                },
                'manchete': 'Justiça Vinga o Povo! Almeida Apodrece na Cadeia!',
                'reacaoPopular': "Praças vibram: 'O ladrão caiu!' Fogos iluminam Brasília.",
                'reacaoMidia': "Globo Nacional: 'Um marco contra a impunidade!'"
            },
            {
                'texto': 'Absolver Almeida por insuficiência de provas',
                'efeitos': {
                    'apoioPopular': -20,
                    'respeitoInstitucional': 15,
                    'influenciaPolitica': 10,
                    'relacaoImprensa': -15,
                    'relacaoGoverno': 10,
                    'relacaoONGs': 10
                },
                'manchete': 'Vergonha Nacional! Tribunal Libera Almeida!',
                'reacaoPopular': "Caos: manifestantes gritam 'Justiça vendida!'",
                'reacaoMidia': "Jornal do Povo: 'O tribunal cuspiu no povo!'"
            },
            {
                'texto': 'Adiar decisão e exigir nova auditoria',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Enrola! Caso Fica no Limbo!',
                'reacaoPopular': "Memes: 'Tribunal joga para debaixo do tapete!'",
                'reacaoMidia': "Voz do Povo: 'Adiar é proteger os poderosos!'"
            },
            {
                'texto': 'Condenar Almeida com base nas novas provas',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -25,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 0
                },
                'manchete': 'Provas Esmagam Almeida! 12 Anos de Cadeia!',
                'reacaoPopular': "Brasil respira: 'Ninguém está acima da lei!'",
                'reacaoMidia': "Globo: 'Condenação pode causar crise política.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'Almeida roubou a esperança dos famintos!'",
            "Futuro Global: 'Acusações são uma farsa política!'",
            "Rede Social: 'Malas de dinheiro! #PrisãoParaAlmeida'",
            "TV Nacional: 'Escândalo: o povo exige justiça!'"
        ]
    },
    {
        'id': 'caso_02',
        'titulo': 'A Revolta do Bairro Liberdade',
        'descricao': (
            "São Paulo, 8 de julho de 2024 – Após a morte de um jovem por policiais, o Bairro Liberdade explode em protestos. "
            "A líder comunitária Ana Ribeiro é acusada de incitar saques e violência. "
            "A polícia exige prisão, mas ONGs apontam brutalidade policial como a causa."
        ),
        'imagem': 'assets/images/caso_02_protestos.jpg',
        'provas': [
            "Vídeo mostra Ana discursando: 'Não vamos nos calar!' antes dos saques.",
            "Relatório policial cita 20 lojas destruídas e R$ 1,5 milhão em prejuízos.",
            "Testemunhas afirmam que policiais atiraram sem motivo, matando o jovem."
        ],
        'investigacoes': [
            {
                'acao': 'Analisar câmeras de segurança',
                'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "Imagens mostram policiais atirando sem provocação, mas também Ana incentivando a multidão."
                ),
                'novaProva': 'Vídeo de câmeras mostrando o confronto.'
            },
            {
                'acao': 'Ouvir testemunhas anônimas',
                'custo': {'relacaoImprensa': -5, 'respeitoInstitucional': -5},
                'resultado': (
                    "Testemunhas confirmam abuso policial, mas também dizem que Ana organizou barricadas."
                ),
                'novaProva': 'Depoimentos gravados de testemunhas.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar Ana por incitação à violência',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 10,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -15
                },
                'manchete': 'Líder Presa! Bairro Liberdade Sob Controle!',
                'reacaoPopular': "Protestos: '#AnaInocente' viraliza.",
                'reacaoMidia': "Diário da Ordem: 'Justiça contra o caos!'"
            },
            {
                'texto': 'Absolver Ana e culpar a polícia',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -15,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 10
                },
                'manchete': 'Justiça com o Povo! Polícia Culpada no Liberdade!',
                'reacaoPopular': "Apoio massivo: '#JustiçaParaLiberdade'",
                'reacaoMidia': "Globo: 'Decisão pode inflamar tensões.'"
            },
            {
                'texto': 'Adiar decisão e investigar abusos',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Tribunal Hesita! Caso Liberdade Sem Resposta!',
                'reacaoPopular': "Frustração: '#JustiçaLenta'",
                'reacaoMidia': "Voz do Povo: 'Adiar é covardia!'"
            },
            {
                'texto': 'Punir policiais e advertir Ana',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': -5,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Divide Culpa! Policiais e Ana Punidos!',
                'reacaoPopular': "Apoio misto: '#LiberdadeVive'",
                'reacaoMidia': "Globo: 'Solução tenta apaziguar ânimos.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'Ana é vítima ou criminosa?'",
            "ONGs: 'Polícia mata, Ana apenas gritou!'",
            "Rede Social: '#JustiçaParaLiberdade'"
        ]
    },
    {
        'id': 'caso_03',
        'titulo': 'O Escândalo da Vacina Falsa',
        'descricao': (
            "Rio de Janeiro, 12 de setembro de 2024 – A farmacêutica BioVida é acusada de vender 2 milhões de doses falsas "
            "de vacina contra uma nova epidemia. Pacientes morreram, e o CEO, Dr. Carlos Mendes, culpa sabotagem interna. "
            "O governo exige punição máxima."
        ),
        'imagem': 'assets/images/caso_03_vacina.jpg',
        'provas': [
            "Laudos mostram que as vacinas eram solução salina, sem princípio ativo.",
            "E-mails internos da BioVida sugerem que Mendes sabia da fraude.",
            "Ex-funcionário acusa Mendes de ordenar a falsificação para lucrar."
        ],
        'investigacoes': [
            {
                'acao': 'Periciar lotes de vacinas',
                'custo': {'relacaoImprensa': -5, 'apoioPopular': -5},
                'resultado': (
                    "Perícia confirma: 90% das vacinas eram falsas, com custo de R$ 200 milhões."
                ),
                'novaProva': 'Relatório pericial detalhando a fraude.'
            },
            {
                'acao': 'Investigar denunciante anônimo',
                'custo': {'respeitoInstitucional': -5, 'relacaoGoverno': -5},
                'resultado': (
                    "Denunciante entrega gravações de Mendes discutindo lucros da fraude."
                ),
                'novaProva': 'Áudios comprometedores de Mendes.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar Mendes e multar BioVida',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Contra a Morte! BioVida e Mendes Punidos!',
                'reacaoPopular': "Apoio: '#VacinaVerdade'",
                'reacaoMidia': "Globo: 'Punição é vitória da saúde!'"
            },
            {
                'texto': 'Absolver Mendes por falta de provas',
                'efeitos': {
                    'apoioPopular': -20,
                    'respeitoInstitucional': 15,
                    'influenciaPolitica': 10,
                    'relacaoImprensa': -15,
                    'relacaoGoverno': 10,
                    'relacaoONGs': -10
                },
                'manchete': 'Escândalo! BioVida Livre, Povo Traído!',
                'reacaoPopular': "Fúria: '#JustiçaVendida'",
                'reacaoMidia': "Jornal do Povo: 'Tribunal protege assassinos!'"
            },
            {
                'texto': 'Exigir nova perícia',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Adia! Caso BioVida Sem Fim!',
                'reacaoPopular': "Frustração: '#VacinaLenta'",
                'reacaoMidia': "Voz do Povo: 'Adiar é conivência!'"
            },
            {
                'texto': 'Prender Mendes com base em novas provas',
                'efeitos': {
                    'apoioPopular': 25,
                    'respeitoInstitucional': 0,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': 0
                },
                'manchete': 'Mendes na Cadeia! BioVida Desmascarada!',
                'reacaoPopular': "Festas: '#JustiçaFeita'",
                'reacaoMidia': "Globo: 'Fim de um império criminoso.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'BioVida matou com vacinas falsas!'",
            "BioVida: 'Somos vítimas de sabotagem!'",
            "Rede Social: '#VacinaVerdade'"
        ]
    },
    {
        'id': 'caso_04',
        'titulo': 'O Desastre do Vale Verde',
        'descricao': (
            "Minas Gerais, 15 de novembro de 2024 – Um vazamento químico da mineradora Vale Verde contamina o rio Claro, "
            "matando 300 pessoas e destruindo o ecossistema. A ONG Frente Verde é acusada de sabotar a mina, "
            "enquanto a Vale Verde nega negligência. O povo exige justiça."
        ),
        'imagem': 'assets/images/caso_04_vazamento.jpg',
        'provas': [
            "Laudos mostram que o vazamento foi causado por falhas de segurança na mina.",
            "Vídeo da Frente Verde mostra ativistas invadindo a mina dias antes.",
            "Relatório interno da Vale Verde admite cortes de manutenção para reduzir custos."
        ],
        'investigacoes': [
            {
                'acao': 'Analisar sistemas de segurança',
                'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "Sistemas de segurança estavam desativados por ordem da diretoria."
                ),
                'novaProva': 'Documento interno ordenando corte de segurança.'
            },
            {
                'acao': 'Interrogar ativistas da Frente Verde',
                'custo': {'relacaoONGs': -5, 'respeitoInstitucional': -5},
                'resultado': (
                    "Ativistas confessam sabotagem, mas dizem que foi para expor negligência."
                ),
                'novaProva': 'Confissão gravada dos ativistas.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Multar Vale Verde em R$ 5 bilhões',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -5,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 15
                },
                'manchete': 'Justiça para o Vale! Vale Verde Paga R$ 5 Bi!',
                'reacaoPopular': "'#RioClaroVive' viraliza nas redes.",
                'reacaoMidia': "Terra Viva: 'Multa é o começo!'"
            },
            {
                'texto': 'Condenar Frente Verde por terrorismo',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': 15,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 10,
                    'relacaoONGs': -15
                },
                'manchete': 'Ativistas na Cadeia! Frente Verde Culpada!',
                'reacaoPopular': "ONGs: 'Culparam os heróis!'",
                'reacaoMidia': "Diário da Ordem: 'Radicalismo punido!'"
            },
            {
                'texto': 'Exigir investigação federal',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Hesita! Vale Verde no Limbo!',
                'reacaoPopular': "'#ValeVerdeMata' cresce.",
                'reacaoMidia': "Jornal Progressista: 'Adiar é perigoso.'"
            },
            {
                'texto': 'Multar Vale Verde e prender sabotadores',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': 0,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': 0,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Dura! Vale Verde Multada, Ativistas Presos!',
                'reacaoPopular': "'#RioClaroVive' com apoio misto.",
                'reacaoMidia': "Globo: 'Solução equilibrada.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Terra Viva: 'Vale Verde assassinou o rio Claro!'",
            "Diário da Ordem: 'Ativistas destruíram a Vale Verde!'",
            "Rede Social: '#JustiçaAmbiental'"
        ]
    },
    {
        'id': 'caso_05',
        'titulo': 'Sombra: Herói ou Traidor da Nação?',
        'descricao': (
            "1º de maio de 2025 – O hacker Sombra, revelado como Lucas Ferreira, ex-analista do Ministério da Defesa, "
            "expôs 50 mil documentos secretos que incriminam a elite do poder. "
            "Os arquivos mostram corrupção envolvendo deputados, juízes e o vice-presidente, além de vigilância ilegal "
            "contra jornalistas e ativistas. Para milhões, Sombra é um herói; para o governo, um traidor que ameaça "
            "a segurança nacional. Com protestos pró-Sombra e pressão internacional, o tribunal decidirá seu destino."
        ),
        'imagem': 'assets/images/caso_05_hacker.jpg',
        'provas': [
            "Documentos vazados em 30/04/2025 mostram propinas de R$ 50 milhões pagas a deputados por empreiteiras.",
            "Relatórios da inteligência confirmam que Sombra acessou servidores secretos às 3h de 28/04/2025.",
            "Testemunho de Ana Clara, jornalista vigiada, revela ameaças do governo após reportagens críticas."
        ],
        'investigacoes': [
            {
                'acao': 'Rastrear servidores usados por Sombra',
                'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "Os servidores revelam que Sombra agiu sozinho, sem laços com potências estrangeiras."
                ),
                'novaProva': 'Logs de acesso confirmando que Sombra agiu independentemente.'
            },
            {
                'acao': 'Ouvir delator anônimo do governo',
                'custo': {'relacaoGoverno': -10, 'respeitoInstitucional': -5},
                'resultado': (
                    "O delator confirma que o governo ordenou vigilância ilegal contra 200 cidadãos."
                ),
                'novaProva': 'Gravações do delator detalhando ordens de vigilância.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar Sombra por traição',
                'efeitos': {
                    'apoioPopular': -20,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 15,
                    'relacaoImprensa': -15,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -10
                },
                'manchete': 'Sombra Preso! Tribunal Pune Traidor da Nação!',
                'reacaoPopular': "Protestos explodem: '#LiberdadeSombra'",
                'reacaoMidia': "Diário da Ordem: 'Segurança nacional protegida!'"
            },
            {
                'texto': 'Absolver Sombra como denunciante',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -15,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 15
                },
                'manchete': 'Sombra Livre! Herói da Verdade Vence!',
                'reacaoPopular': "Multidões celebram: '#SombraVive'",
                'reacaoMidia': "Globo: 'Decisão abala o governo.'"
            },
            {
                'texto': 'Adiar decisão e investigar governo',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Hesita! Caso Sombra no Limbo!',
                'reacaoPopular': "'#JustiçaLenta' viraliza.",
                'reacaoMidia': "Jornal Progressista: 'Adiar é necessário.'"
            },
            {
                'texto': 'Proteger Sombra e condenar vigilância',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': 10
                },
                'manchete': 'Sombra Salvo! Vigilância Ilegal Condenada!',
                'reacaoPopular': "'#SombraHerói' ganha força.",
                'reacaoMidia': "Voz do Povo: 'Passo contra corrupção!'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'Sombra é herói!'",
            "Diário da Ordem: 'Sombra é traidor!'",
            "Rede Social: '#LiberdadeSombra'"
        ]
    },
    {
        'id': 'caso_06',
        'titulo': 'O Escândalo da Privatização da Água',
        'descricao': (
            "Salvador, 10 de junho de 2025 – A empresa AquaCorp é acusada de manipular a privatização do sistema de água, "
            "cobrando tarifas abusivas e deixando bairros sem abastecimento. O governador, aliado da AquaCorp, "
            "defende a privatização, enquanto moradores protestam por água potável. ONGs denunciam corrupção no processo."
        ),
        'imagem': 'assets/images/caso_06_agua.jpg',
        'provas': [
            "Contratos mostram que a AquaCorp pagou R$ 10 milhões a consultores ligados ao governador.",
            "Relatórios indicam que 40% dos bairros pobres estão sem água há meses.",
            "Vídeo viral mostra executivos da AquaCorp comemorando lucros recordes."
        ],
        'investigacoes': [
            {
                'acao': 'Auditar contratos da privatização',
                'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "A auditoria revela cláusulas secretas que favorecem a AquaCorp em detrimento do público."
                ),
                'novaProva': 'Documento com cláusulas secretas da privatização.'
            },
            {
                'acao': 'Entrevistar moradores afetados',
                'custo': {'relacaoImprensa': -5, 'apoioPopular': -5},
                'resultado': (
                    "Moradores relatam ameaças de milícias ligadas à AquaCorp para silenciar protestos."
                ),
                'novaProva': 'Depoimentos gravados de moradores.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Anular a privatização e estatizar a água',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 15
                },
                'manchete': 'Água é do Povo! Privatização Anulada!',
                'reacaoPopular': "Festas nas ruas: '#ÁguaParaTodos' viraliza.",
                'reacaoMidia': "Jornal do Povo: 'Vitória contra a ganância!'"
            },
            {
                'texto': 'Manter a privatização e multar a AquaCorp',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 10,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -10
                },
                'manchete': 'AquaCorp Multada, Mas Privatização Segue!',
                'reacaoPopular': "Protestos: '#ÁguaNãoÉMercadoria'",
                'reacaoMidia': "Diário da Ordem: 'Solução mantém estabilidade.'"
            },
            {
                'texto': 'Adiar decisão e formar comissão',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Empurra Caso da Água com a Barriga!',
                'reacaoPopular': "Frustração: '#JustiçaLenta'",
                'reacaoMidia': "Voz do Povo: 'Comissões são perda de tempo!'"
            },
            {
                'texto': 'Punir AquaCorp e rever contratos',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': 10
                },
                'manchete': 'AquaCorp Punida! Contratos Serão Revistos!',
                'reacaoPopular': "Apoio: '#JustiçaPelaÁgua'",
                'reacaoMidia': "Globo: 'Decisão tenta equilibrar tensões.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'AquaCorp lucra enquanto o povo sofre!'",
            "Diário da Ordem: 'Privatização trouxe eficiência!'",
            "Rede Social: '#ÁguaParaTodos'",
            "ONGs: 'Água é direito, não mercadoria!'"
        ]
    },
    {
        'id': 'caso_07',
        'titulo': 'A Queda do Ídolo do Futebol',
        'descricao': (
            "Rio de Janeiro, 22 de agosto de 2025 – O astro do futebol Gabriel Lima é acusado de sonegar R$ 80 milhões "
            "em impostos, usando empresas offshore. Fãs o defendem como vítima de perseguição, "
            "enquanto a Receita Federal exige prisão. A imprensa explora a polêmica, dividindo a nação."
        ),
        'imagem': 'assets/images/caso_07_futebol.jpg',
        'provas': [
            "Extratos mostram transferências de R$ 50 milhões para contas nas Ilhas Virgens.",
            "E-mails sugerem que Gabriel sabia das operações ilegais.",
            "Testemunha, um ex-contador, afirma que Gabriel ordenou a sonegação."
        ],
        'investigacoes': [
            {
                'acao': 'Rastrear contas offshore',
                'custo': {'relacaoImprensa': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "Rastreamento confirma que Gabriel controlava as contas diretamente."
                ),
                'novaProva': 'Registros bancários com assinatura de Gabriel.'
            },
            {
                'acao': 'Interrogar ex-contador sob proteção',
                'custo': {'respeitoInstitucional': -5, 'relacaoGoverno': -5},
                'resultado': (
                    "Contador entrega documentos que comprovam ordens de Gabriel."
                ),
                'novaProva': 'Documentos assinados por Gabriel.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar Gabriel a 5 anos de prisão',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': 15,
                    'influenciaPolitica': 10,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -5
                },
                'manchete': 'Ídolo na Cadeia! Gabriel Paga por Sonegação!',
                'reacaoPopular': "Fãs protestam: '#GabrielInocente'",
                'reacaoMidia': "Globo: 'Justiça contra privilégios!'"
            },
            {
                'texto': 'Absolver Gabriel por falta de provas',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -15,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': 5
                },
                'manchete': 'Gabriel Livre! Justiça Favorece o Ídolo!',
                'reacaoPopular': "Fãs comemoram: '#GabrielVence'",
                'reacaoMidia': "Jornal do Povo: 'Tribunal cede à pressão!'"
            },
            {
                'texto': 'Exigir nova investigação fiscal',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Caso Gabriel Adiado! Justiça Hesita!',
                'reacaoPopular': "Memes: '#JustiçaFutebol'",
                'reacaoMidia': "Voz do Povo: 'Mais atrasos no caso!'"
            },
            {
                'texto': 'Multar Gabriel com base em novas provas',
                'efeitos': {
                    'apoioPopular': 10,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 0,
                    'relacaoImprensa': 5,
                    'relacaoGoverno': 10,
                    'relacaoONGs': 0
                },
                'manchete': 'Gabriel Multado em R$ 100 Milhões!',
                'reacaoPopular': "Apoio misto: '#JustiçaFeita'",
                'reacaoMidia': "Globo: 'Solução evita crise com fãs.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'Gabriel traiu o Brasil!'",
            "Fãs: 'Gabriel é vítima da Receita!'",
            "Rede Social: '#GabrielInocente'",
            "Globo: 'Sonegação ou perseguição?'"
        ]
    },
    {
        'id': 'caso_08',
        'titulo': 'O Julgamento da Inteligência Artificial',
        'descricao': (
            "São Paulo, 15 de outubro de 2025 – A empresa TechNova é acusada de usar sua IA, Aurora, "
            "para manipular eleições com campanhas de desinformação. A TechNova nega, alegando que a IA foi hackeada. "
            "Ativistas exigem o banimento da IA, enquanto o governo teme perder investimentos."
        ),
        'imagem': 'assets/images/caso_08_ia.jpg',
        'provas': [
            "Logs mostram que Aurora gerou 10 milhões de postagens falsas em redes sociais.",
            "E-mails internos sugerem que a TechNova lucrou R$ 200 milhões com campanhas.",
            "Hackers anônimos assumem a autoria, mas sem provas concretas."
        ],
        'investigacoes': [
            {
                'acao': 'Analisar servidores da Aurora',
                'custo': {'relacaoImprensa': -5, 'respeitoInstitucional': -5},
                'resultado': (
                    "Análise revela que a IA foi programada para manipular, sem sinais de hacking."
                ),
                'novaProva': 'Código-fonte da Aurora com instruções de manipulação.'
            },
            {
                'acao': 'Investigar hackers anônimos',
                'custo': {'influenciaPolitica': -5, 'relacaoGoverno': -5},
                'resultado': (
                    "Hackers são rastreados, mas não há evidências de acesso à Aurora."
                ),
                'novaProva': 'Relatório negando envolvimento de hackers.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Banir a IA Aurora e multar TechNova',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 15
                },
                'manchete': 'Fim da Aurora! TechNova Punida!',
                'reacaoPopular': "'#IAControlada' viraliza nas redes.",
                'reacaoMidia': "Jornal do Povo: 'Vitória contra manipulação!'"
            },
            {
                'texto': 'Absolver TechNova e culpar hackers',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 15,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -15
                },
                'manchete': 'TechNova Livre! Hackers Culpados!',
                'reacaoPopular': "Protestos: '#IADestrói'",
                'reacaoMidia': "Diário da Ordem: 'Tecnologia protegida!'"
            },
            {
                'texto': 'Adiar decisão e regular IAs',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Hesita! Caso Aurora Sem Fim!',
                'reacaoPopular': "'#RegulemIA' ganha força.",
                'reacaoMidia': "Voz do Povo: 'Adiar é arriscado!'"
            },
            {
                'texto': 'Desativar Aurora com base em provas',
                'efeitos': {
                    'apoioPopular': 10,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 10
                },
                'manchete': 'Aurora Desligada! TechNova Sob Controle!',
                'reacaoPopular': "'#JustiçaDigital' é celebrada.",
                'reacaoMidia': "Globo: 'Decisão balanceia inovação e ética.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'Aurora manipulou a democracia!'",
            "TechNova: 'Somos vítimas de hackers!'",
            "Rede Social: '#RegulemIA'",
            "ONGs: 'IA é uma ameaça à liberdade!'"
        ]
    },
    {
        'id': 'caso_09',
        'titulo': 'A Crise da Reforma Agrária',
        'descricao': (
            "Mato Grosso, 5 de dezembro de 2025 – O líder do Movimento Terra Livre, José Mendes, "
            "é acusado de invadir terras privadas e incitar conflitos que deixaram 10 mortos. "
            "Fazendeiros exigem sua prisão, enquanto camponeses o veem como herói da reforma agrária. "
            "O governo teme instabilidade no campo."
        ),
        'imagem': 'assets/images/caso_09_reforma.jpg',
        'provas': [
            "Vídeos mostram José liderando ocupações de fazendas.",
            "Relatórios policiais citam armas encontradas com membros do Terra Livre.",
            "Testemunhas afirmam que fazendeiros contrataram milícias para atacar camponeses."
        ],
        'investigacoes': [
            {
                'acao': 'Investigar milícias dos fazendeiros',
                'custo': {'relacaoGoverno': -5, 'influenciaPolitica': -5},
                'resultado': (
                    "Provas confirmam que milícias foram pagas para provocar conflitos."
                ),
                'novaProva': 'Gravações de fazendeiros contratando milícias.'
            },
            {
                'acao': 'Analisar armas do Terra Livre',
                'custo': {'relacaoONGs': -5, 'apoioPopular': -5},
                'resultado': (
                    "Análise revela que armas eram de origem policial, sugerindo armação."
                ),
                'novaProva': 'Relatório balístico das armas.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Condenar José por incitação à violência',
                'efeitos': {
                    'apoioPopular': -15,
                    'respeitoInstitucional': 10,
                    'influenciaPolitica': 15,
                    'relacaoImprensa': -10,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -15
                },
                'manchete': 'Líder Preso! Terra Livre Derrotada!',
                'reacaoPopular': "Camponeses: '#JoséHerói'",
                'reacaoMidia': "Diário da Ordem: 'Ordem no campo!'"
            },
            {
                'texto': 'Absolver José e investigar fazendeiros',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -15,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 15
                },
                'manchete': 'Justiça com Camponeses! Fazendeiros na Mira!',
                'reacaoPopular': "'#TerraLivreVence' viraliza.",
                'reacaoMidia': "Globo: 'Decisão pode inflamar o campo.'"
            },
            {
                'texto': 'Adiar decisão e mediar conflitos',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Tribunal Tenta Paz no Campo!',
                'reacaoPopular': "'#JustiçaLenta' cresce.",
                'reacaoMidia': "Voz do Povo: 'Mediação é fraca!'"
            },
            {
                'texto': 'Punir milícias e advertir José',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': 0,
                    'influenciaPolitica': -10,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -10,
                    'relacaoONGs': 10
                },
                'manchete': 'Justiça Ataca Milícias! José Advertido!',
                'reacaoPopular': "'#ReformaVive' com apoio misto.",
                'reacaoMidia': "Globo: 'Solução busca equilíbrio.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'José Mendes é herói ou bandido?'",
            "Fazendeiros: 'Terra Livre é terrorismo!'",
            "Rede Social: '#ReformaAgrária'",
            "ONGs: 'Camponeses lutam por justiça!'"
        ]
    },
    {
        'id': 'caso_10',
        'titulo': 'O Colapso da Barragem do Norte',
        'descricao': (
            "Pará, 20 de fevereiro de 2026 – Uma barragem da mineradora NorteMinas ruiu, matando 200 pessoas "
            "e devastando comunidades indígenas. A empresa culpa chuvas, mas laudos apontam negligência. "
            "Líderes indígenas exigem justiça, enquanto o governo protege a NorteMinas por empregos."
        ),
        'imagem': 'assets/images/caso_10_barragem.jpg',
        'provas': [
            "Laudos mostram que a barragem tinha rachaduras ignoradas há dois anos.",
            "E-mails da NorteMinas minimizam alertas de engenheiros.",
            "Líder indígena relata que a empresa despejou rejeitos ilegalmente."
        ],
        'investigacoes': [
            {
                'acao': 'Periciar a barragem destruída',
                'custo': {'relacaoImprensa': -5, 'apoioPopular': -5},
                'resultado': (
                    "Perícia confirma negligência grave, com cortes de manutenção."
                ),
                'novaProva': 'Relatório pericial detalhando falhas.'
            },
            {
                'acao': 'Ouvir engenheiros da NorteMinas',
                'custo': {'relacaoGoverno': -5, 'respeitoInstitucional': -5},
                'resultado': (
                    "Engenheiros confessam que foram pressionados a ignorar riscos."
                ),
                'novaProva': 'Depoimentos gravados dos engenheiros.'
            }
        ],
        'decisoes': [
            {
                'texto': 'Multar NorteMinas em R$ 10 bilhões',
                'efeitos': {
                    'apoioPopular': 20,
                    'respeitoInstitucional': -10,
                    'influenciaPolitica': -15,
                    'relacaoImprensa': 15,
                    'relacaoGoverno': -20,
                    'relacaoONGs': 15
                },
                'manchete': 'Justiça para o Norte! NorteMinas Paga R$ 10 Bi!',
                'reacaoPopular': "'#JustiçaIndígena' viraliza.",
                'reacaoMidia': "Jornal do Povo: 'Multa histórica!'"
            },
            {
                'texto': 'Absolver NorteMinas por força maior',
                'efeitos': {
                    'apoioPopular': -20,
                    'respeitoInstitucional': 15,
                    'influenciaPolitica': 15,
                    'relacaoImprensa': -15,
                    'relacaoGoverno': 15,
                    'relacaoONGs': -15
                },
                'manchete': 'NorteMinas Livre! Tragédia Culpa da Natureza!',
                'reacaoPopular': "Indígenas: '#JustiçaVendida'",
                'reacaoMidia': "Diário da Ordem: 'Decisão protege economia.'"
            },
            {
                'texto': 'Exigir nova perícia',
                'efeitos': {
                    'apoioPopular': -5,
                    'respeitoInstitucional': 5,
                    'influenciaPolitica': -5,
                    'relacaoImprensa': -5,
                    'relacaoGoverno': -5,
                    'relacaoONGs': 5
                },
                'manchete': 'Justiça Adia Caso da Barragem!',
                'reacaoPopular': "'#JustiçaLenta' cresce.",
                'reacaoMidia': "Voz do Povo: 'Adiar é conivência!'"
            },
            {
                'texto': 'Fechar NorteMinas com base em provas',
                'efeitos': {
                    'apoioPopular': 15,
                    'respeitoInstitucional': 0,
                    'influenciaPolitica': -20,
                    'relacaoImprensa': 10,
                    'relacaoGoverno': -15,
                    'relacaoONGs': 10
                },
                'manchete': 'NorteMinas Fechada! Justiça com Indígenas!',
                'reacaoPopular': "'#VidaIndígena' é celebrada.",
                'reacaoMidia': "Globo: 'Fechamento abala economia local.'",
                'requiresInvestigation': True
            }
        ],
        'midia': [
            "Jornal do Povo: 'NorteMinas destruiu o Norte!'",
            "NorteMinas: 'Chuvas causaram o colapso!'",
            "Rede Social: '#JustiçaIndígena'",
            "ONGs: 'Proteger indígenas é proteger a Amazônia!'"
        ]
    }
]

# === Funções Auxiliares ===
def show_notification(message: str, duration: float = 3.0) -> None:
    """Exibe uma mensagem temporária no console."""
    print(f"\n[NOTIFICAÇÃO] {message}")
    time.sleep(duration)

def validate_name(name: str) -> bool:
    """Valida o nome do jogador usando regex."""
    pattern = r'^[a-zA-Z0-9\s]{1,20}$'
    return bool(re.match(pattern, name))

def apply_effects(effects: Dict[str, int]) -> None:
    """Aplica os efeitos às métricas do estado."""
    for key, value in effects.items():
        if key == 'orcamento':
            state['orcamento'] = max(0, state['orcamento'] + value)
        elif key in ('apoioPopular', 'respeitoInstitucional', 'influenciaPolitica',
                     'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs'):
            state[key] = max(0, min(100, state[key] + value))
        print(f"{key}: {'+' if value >= 0 else ''}{value}")

def update_reputation() -> None:
    """Exibe as métricas atuais no console."""
    print("\n=== Reputação Atual ===")
    print(f"Orçamento: R${state['orcamento']}")
    print(f"Apoio Popular: {state['apoioPopular']}/100")
    print(f"Respeito Institucional: {state['respeitoInstitucional']}/100")
    print(f"Influência Política: {state['influenciaPolitica']}/100")
    print(f"Relação com a Imprensa: {state['relacaoImprensa']}/100")
    print(f"Relação com o Governo: {state['relacaoGoverno']}/100")
    print(f"Relação com ONGs: {state['relacaoONGs']}/100")

# === Gestão do Jogo ===
def start_game(player_name: str) -> bool:
    """Inicia o jogo com o nome do jogador."""
    if not validate_name(player_name):
        show_notification("Nome inválido! Use letras, números e espaços (máximo de 20 caracteres).")
        return False
    state['playerName'] = player_name
    print(f"\nBem-vindo, {player_name}, ao Tribunal Supremo Popular!")
    return True

def set_difficulty(level: str) -> None:
    """Define a dificuldade do jogo."""
    state['dificuldade'] = level
    if level == 'fácil':
        state['orcamento'] = 5000
        state['custoManutencao'] = 500
        state['maxInvestigations'] = 3
    elif level == 'médio':
        state['orcamento'] = 10000
        state['custoManutencao'] = 1000
        state['maxInvestigations'] = 2
    else:  # difícil
        state['orcamento'] = 15000
        state['custoManutencao'] = 1500
        state['maxInvestigations'] = 1
    print(f"\nDificuldade definida: {level.capitalize()}")
    load_case()

def load_case() -> None:
    """Carrega o próximo caso ou encerra o jogo."""
    if state['casosJulgados'] >= len(casos):
        end_game()
        return
    state['currentCase'] = casos[state['casosJulgados']]
    state['investigationsDone'] = 0
    show_notification(f"Caso {state['casosJulgados'] + 1} de {len(casos)}: {state['currentCase']['titulo']}")
    render_case()

def render_case() -> None:
    """Exibe o caso atual no console."""
    caso = state['currentCase']
    print(f"\n=== {caso['titulo']} ===")
    print(caso['descricao'])
    print("\nProvas:")
    for i, prova in enumerate(caso['provas'], 1):
        print(f"{i}. {prova}")
    
    if state['investigationsDone'] < state['maxInvestigations']:
        print("\nOpções de Investigação:")
        for i, inv in enumerate(caso['investigacoes'], 1):
            print(f"{i}. {inv['acao']}")
    
    print("\nOpções de Decisão:")
    valid_decisions = [d for d in caso['decisoes'] if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    for i, decisao in enumerate(valid_decisions, 1):
        print(f"{i}. {decisao['texto']}")

def investigate(index: int) -> None:
    """Realiza uma investigação no caso atual."""
    if state['investigationsDone'] >= state['maxInvestigations']:
        show_notification("Limite de investigações atingido para este caso.")
        return
    if index < 0 or index >= len(state['currentCase']['investigacoes']):
        show_notification("Investigação inválida.")
        return
    inv = state['currentCase']['investigacoes'][index]
    if state['orcamento'] < 2000:
        show_notification("Orçamento insuficiente para realizar a investigação!")
        return
    state['orcamento'] -= 2000
    state['investigationsDone'] += 1
    apply_effects(inv['custo'])
    state['currentCase']['provas'].append(inv['novaProva'])
    show_notification(f"Investigação concluída: {inv['resultado']}")
    update_reputation()
    render_case()

def make_decision(index: int) -> None:
    """Toma uma decisão no caso atual."""
    valid_decisions = [d for d in state['currentCase']['decisoes']
                      if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    if index < 0 or index >= len(valid_decisions):
        show_notification("Decisão inválida.")
        return
    decision = valid_decisions[index]
    apply_effects(decision['efeitos'])
    state['casosJulgados'] += 1
    state['orcamento'] -= state['custoManutencao']

    # Verificar condições de fim de jogo
    if (state['orcamento'] <= 0 or state['apoioPopular'] <= 0 or
        state['respeitoInstitucional'] <= 0 or state['influenciaPolitica'] <= 0 or
        state['relacaoImprensa'] <= 0 or state['relacaoGoverno'] <= 0 or
        state['relacaoONGs'] <= 0):
        end_game()
        return

    # Verificar eventos de crise
    if state['casosJulgados'] in (3, 7, 9):
        show_crisis_event()
        return

    # Verificar eventos aleatórios
    event_message = ""
    if random.random() < 0.35:
        possible_events = [e for e in eventos_aleatorios if not e.get('condicao') or e['condicao']()]
        if possible_events:
            event = random.choice(possible_events)
            event_message = f"\nEvento Inesperado: {event['texto']}\n"
            apply_effects(event['efeitos'])

    # Exibir reações da mídia
    print(f"\n=== Manchete: {decision['manchete']} ===")
    if event_message:
        print(event_message)
    print(f"Reação Popular: {decision['reacaoPopular']}")
    print(f"Reação da Mídia: {decision['reacaoMidia']}")
    update_reputation()
    show_diplomacy_screen()

def show_crisis_event() -> None:
    """Exibe um evento de crise."""
    crisis = eventos_crise[0]
    print(f"\n=== Crise Nacional! ===")
    print(crisis['texto'])
    print("\nEscolha sua ação:")
    for i, opcao in enumerate(crisis['opcoes'], 1):
        print(f"{i}. {opcao['texto']}")
    
    while True:
        try:
            choice = input("\nDigite o número da sua escolha: ")
            if choice.lower() == 'sair':
                print("Jogo encerrado.")
                exit()
            choice = int(choice) - 1
            if 0 <= choice < len(crisis['opcoes']):
                opcao = crisis['opcoes'][choice]
                apply_effects(opcao['efeitos'])
                print(f"\nResultado: {opcao['resultado']}")
                update_reputation()
                show_diplomacy_screen()
                break
            else:
                show_notification("Escolha inválida. Tente novamente.")
        except ValueError:
            show_notification("Digite um número válido ou 'sair' para encerrar.")

def view_media() -> None:
    """Exibe as reações da mídia sobre o caso atual."""
    print(f"\n=== O que dizem sobre o caso... ===")
    for midia in state['currentCase']['midia']:
        print(f"- {midia}")
    input("\nPressione Enter para continuar...")

def show_diplomacy_screen() -> None:
    """Exibe a tela de diplomacia."""
    print(f"\n=== Diplomacia, {state['playerName']} ===")
    print("Negocie com setores-chave para fortalecer sua posição. Cada ação consome recursos.")
    print("1. Negociar com a Imprensa (+15 Relação Imprensa, custo varia por dificuldade)")
    print("2. Negociar com o Governo (+10 Relação Governo, -5 Imprensa, -R$100)")
    print("3. Negociar com ONGs (+10 Relação ONGs, -5 Governo, -R$50)")
    print("4. Pular diplomacia")
    
    while True:
        try:
            choice = input("\nDigite o número da sua escolha: ")
            if choice.lower() == 'sair':
                print("Jogo encerrado.")
                exit()
            choice = int(choice)
            if choice == 1:
                handle_diplomacy_imprensa()
            elif choice == 2:
                handle_diplomacy_governo()
            elif choice == 3:
                handle_diplomacy_ongs()
            elif choice == 4:
                skip_diplomacy()
            else:
                show_notification("Escolha inválida. Tente novamente.")
                continue
            break
        except ValueError:
            show_notification("Digite um número válido ou 'sair' para encerrar.")

def handle_diplomacy_imprensa() -> None:
    """Gerencia a ação de diplomacia com a imprensa."""
    custos = {'fácil': -500, 'médio': -1000, 'difícil': -1500}
    apply_effects({
        'relacaoImprensa': 15,
        'orcamento': custos[state['dificuldade']]
    })
    show_notification(
        f"Negociação com a imprensa bem-sucedida! Relação +15, Orçamento -R${abs(custos[state['dificuldade']] * 10)}."
    )
    proceed_after_local_diplomacy()

def handle_diplomacy_governo() -> None:
    """Gerencia a ação de diplomacia com o governo."""
    apply_effects({
        'relacaoGoverno': 10,
        'relacaoImprensa': -5,
        'orcamento': -10
    })
    show_notification("Negociação com o governo concluída! Relação +10, Orçamento -R$100.")
    proceed_after_local_diplomacy()

def handle_diplomacy_ongs() -> None:
    """Gerencia a ação de diplomacia com ONGs."""
    apply_effects({
        'relacaoONGs': 10,
        'relacaoGoverno': -5,
        'orcamento': -5
    })
    show_notification("Apoio das ONGs garantido! Relação +10, Orçamento -R$50.")
    proceed_after_local_diplomacy()

def proceed_after_local_diplomacy() -> None:
    """Prossegue após a diplomacia."""
    load_case()

def skip_diplomacy() -> None:
    """Pula a fase de diplomacia."""
    load_case()

def end_game() -> None:
    """Encerra o jogo e exibe o resultado final."""
    final_text = ""
    legacy_score = (
        state['apoioPopular'] + state['respeitoInstitucional'] + state['influenciaPolitica'] +
        state['relacaoImprensa'] + state['relacaoGoverno'] + state['relacaoONGs']
    ) / 6
    cases_completed = state['casosJulgados']

    if state['orcamento'] <= 0:
        final_text = f"{state['playerName']}, o tribunal faliu! Sem recursos, você foi destituído do cargo."
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
    elif cases_completed >= len(casos):
        if legacy_score > 80:
            final_text = (
                f"{state['playerName']}, você é uma lenda da justiça! "
                f"Após julgar todos os {len(casos)} casos, sua imparcialidade conquistou a nação.\n\n"
                "Parabéns! Você desbloqueou o Nível Avançado: Projetos Nacionais."
            )
        elif legacy_score > 50:
            final_text = (
                f"{state['playerName']}, você completou os {len(casos)} casos com equilíbrio. "
                "Seu legado é respeitado, mas não unânime."
            )
        else:
            final_text = (
                f"{state['playerName']}, após {len(casos)} casos, suas decisões dividiram a nação. "
                "Seu tribunal sobreviveu, mas sob críticas."
            )
    else:
        final_text = (
            f"{state['playerName']}, sua trajetória foi controversa. "
            f"Seu legado divide opiniões após {cases_completed} casos."
        )

    final_text += (
        f"\n\nResumo:\n"
        f"Casos Julgados: {cases_completed}/{len(casos)}\n"
        f"Orçamento Restante: R${state['orcamento']}\n"
        f"Média de Reputação: {round(legacy_score)}"
    )

    print(f"\n=== Fim de Jogo, {state['playerName']} ===\n")
    print(final_text)
    print("\nObrigado por jogar Tribunal Supremo Popular!")

def main() -> None:
    """Função principal para executar o jogo."""
    print("Bem-vindo ao Tribunal Supremo Popular!")
    while True:
        player_name = input("\nDigite seu nome (ou 'sair' para encerrar): ").strip()
        if player_name.lower() == 'sair':
            print("Jogo encerrado.")
            break
        if start_game(player_name):
            break
    
    if state['playerName']:
        print("\nEscolha a dificuldade:")
        print("1. Fácil")
        print("2. Médio")
        print("3. Difícil")
        while True:
            try:
                choice = input("\nDigite o número da sua escolha: ")
                if choice.lower() == 'sair':
                    print("Jogo encerrado.")
                    exit()
                choice = int(choice)
                if choice == 1:
                    set_difficulty('fácil')
                elif choice == 2:
                    set_difficulty('médio')
                elif choice == 3:
                    set_difficulty('difícil')
                else:
                    show_notification("Escolha inválida. Tente novamente.")
                    continue
                break
            except ValueError:
                show_notification("Digite um número válido ou 'sair' para encerrar.")

        # Loop principal do jogo
        while state['casosJulgados'] < len(casos) and state['orcamento'] > 0 and all(
            state[key] > 0 for key in (
                'apoioPopular', 'respeitoInstitucional', 'influenciaPolitica',
                'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs'
            )
        ):
            print("\nO que deseja fazer?")
            if state['investigationsDone'] < state['maxInvestigations']:
                print("1. Realizar investigação")
            print("2. Tomar decisão")
            print("3. Ver reações da mídia")
            print("4. Sair do jogo")
            
            try:
                choice = input("\nDigite o número da sua escolha: ")
                if choice.lower() == 'sair':
                    print("Jogo encerrado.")
                    break
                choice = int(choice)
                if choice == 1 and state['investigationsDone'] < state['maxInvestigations']:
                    print("\nEscolha uma investigação:")
                    for i, inv in enumerate(state['currentCase']['investigacoes'], 1):
                        print(f"{i}. {inv['acao']}")
                    inv_choice = input("\nDigite o número da investigação: ")
                    if inv_choice.lower() == 'sair':
                        print("Jogo encerrado.")
                        break
                    investigate(int(inv_choice) - 1)
                elif choice == 2:
                    print("\nEscolha uma decisão:")
                    valid_decisions = [d for d in state['currentCase']['decisoes']
                                     if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
                    for i, decisao in enumerate(valid_decisions, 1):
                        print(f"{i}. {decisao['texto']}")
                    dec_choice = input("\nDigite o número da decisão: ")
                    if dec_choice.lower() == 'sair':
                        print("Jogo encerrado.")
                        break
                    make_decision(int(dec_choice) - 1)
                elif choice == 3:
                    view_media()
                elif choice == 4:
                    print("Jogo encerrado.")
                    break
                else:
                    show_notification("Escolha inválida. Tente novamente.")
            except ValueError:
                show_notification("Digite um número válido ou 'sair' para encerrar.")

if __name__ == '__main__':
    main()