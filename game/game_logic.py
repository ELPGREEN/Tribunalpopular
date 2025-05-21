# game_logic.py
import random
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
        'imagem': 'static/assets/images/protestos.jpg'
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
        'imagem': 'static/assets/images/elogio_ong.jpg'
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
        'imagem': 'static/assets/images/vazamento.jpg'
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
        'imagem': 'static/assets/images/aplausos_imprensa.jpg'
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
        'imagem': 'static/assets/images/greve_judiciaria.jpg',
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
        'imagem': 'static/assets/images/caso_01_malas_dinheiro.jpg',
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
    # Inclua os outros casos (caso_02 a caso_10) aqui, idênticos ao tribunal_supremo.py
    # Para evitar repetição, presumo que você pode copiar os casos de tribunal_supremo.py
    # Se precisar, posso fornecer os casos completos novamente
]

# === Funções Auxiliares ===
def validate_name(name: str) -> bool:
    """Valida o nome do jogador usando regex."""
    pattern = r'^[a-zA-Z0-9\s]{1,20}$'
    return bool(re.match(pattern, name))

def apply_effects(effects: Dict[str, int]) -> Dict[str, int]:
    """Aplica os efeitos às métricas do estado e retorna mudanças."""
    changes = {}
    for key, value in effects.items():
        if key == 'orcamento':
            state['orcamento'] = max(0, state['orcamento'] + value)
        elif key in ('apoioPopular', 'respeitoInstitucional', 'influenciaPolitica',
                     'relacaoImprensa', 'relacaoGoverno', 'relacaoONGs'):
            state[key] = max(0, min(100, state[key] + value))
        changes[key] = value
    return changes

def get_reputation() -> Dict[str, int]:
    """Retorna as métricas atuais do estado."""
    return {
        'orcamento': state['orcamento'],
        'apoioPopular': state['apoioPopular'],
        'respeitoInstitucional': state['respeitoInstitucional'],
        'influenciaPolitica': state['influenciaPolitica'],
        'relacaoImprensa': state['relacaoImprensa'],
        'relacaoGoverno': state['relacaoGoverno'],
        'relacaoONGs': state['relacaoONGs']
    }

# === Gestão do Jogo ===
def start_game(player_name: str) -> Dict[str, str]:
    """Inicia o jogo com o nome do jogador."""
    if not validate_name(player_name):
        return {'status': 'error', 'message': 'Nome inválido! Use letras, números e espaços (máximo de 20 caracteres).'}
    state['playerName'] = player_name
    return {'status': 'success', 'message': f'Bem-vindo, {player_name}, ao Tribunal Supremo Popular!'}

def set_difficulty(level: str) -> Dict[str, str]:
    """Define a dificuldade do jogo."""
    if level not in ('fácil', 'médio', 'difícil'):
        return {'status': 'error', 'message': 'Dificuldade inválida.'}
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
    load_case()
    return {'status': 'success', 'message': f'Dificuldade definida: {level.capitalize()}'}

def load_case() -> None:
    """Carrega o próximo caso."""
    if state['casosJulgados'] >= len(casos):
        state['currentCase'] = None
        return
    state['currentCase'] = casos[state['casosJulgados']]
    state['investigationsDone'] = 0

def get_current_case() -> Optional[Dict]:
    """Retorna o caso atual."""
    if not state['currentCase']:
        return None
    caso = state['currentCase']
    valid_decisions = [d for d in caso['decisoes'] if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    return {
        'titulo': caso['titulo'],
        'descricao': caso['descricao'],
        'imagem': caso['imagem'],
        'provas': caso['provas'],
        'investigacoes': caso['investigacoes'] if state['investigationsDone'] < state['maxInvestigations'] else [],
        'decisoes': valid_decisions,
        'midia': caso['midia']
    }

def investigate(index: int) -> Dict[str, str]:
    """Realiza uma investigação no caso atual."""
    if state['investigationsDone'] >= state['maxInvestigations']:
        return {'status': 'error', 'message': 'Limite de investigações atingido para este caso.'}
    if index < 0 or index >= len(state['currentCase']['investigacoes']):
        return {'status': 'error', 'message': 'Investigação inválida.'}
    if state['orcamento'] < 2000:
        return {'status': 'error', 'message': 'Orçamento insuficiente para realizar a investigação!'}
    inv = state['currentCase']['investigacoes'][index]
    state['orcamento'] -= 2000
    state['investigationsDone'] += 1
    changes = apply_effects(inv['custo'])
    state['currentCase']['provas'].append(inv['novaProva'])
    return {
        'status': 'success',
        'message': f'Investigação concluída: {inv["resultado"]}',
        'changes': changes,
        'newProva': inv['novaProva']
    }

def make_decision(index: int) -> Dict[str, any]:
    """Toma uma decisão no caso atual."""
    valid_decisions = [d for d in state['currentCase']['decisoes']
                      if not d.get('requiresInvestigation') or state['investigationsDone'] > 0]
    if index < 0 or index >= len(valid_decisions):
        return {'status': 'error', 'message': 'Decisão inválida.'}
    decision = valid_decisions[index]
    changes = apply_effects(decision['efeitos'])
    state['casosJulgados'] += 1
    state['orcamento'] -= state['custoManutencao']

    # Verificar condições de fim de jogo
    if (state['orcamento'] <= 0 or state['apoioPopular'] <= 0 or
        state['respeitoInstitucional'] <= 0 or state['influenciaPolitica'] <= 0 or
        state['relacaoImprensa'] <= 0 or state['relacaoGoverno'] <= 0 or
        state['relacaoONGs'] <= 0):
        return end_game()

    # Verificar eventos de crise
    if state['casosJulgados'] in (3, 7, 9):
        return {
            'status': 'crisis',
            'crisis': eventos_crise[0]
        }

    # Verificar eventos aleatórios
    event = None
    if random.random() < 0.35:
        possible_events = [e for e in eventos_aleatorios if not e.get('condicao') or e['condicao']()]
        if possible_events:
            event = random.choice(possible_events)
            event_changes = apply_effects(event['efeitos'])
            changes.update(event_changes)

    return {
        'status': 'success',
        'manchete': decision['manchete'],
        'reacaoPopular': decision['reacaoPopular'],
        'reacaoMidia': decision['reacaoMidia'],
        'event': event,
        'changes': changes,
        'nextScreen': 'diplomacy'
    }

def handle_crisis_choice(index: int) -> Dict[str, any]:
    """Processa a escolha em um evento de crise."""
    crisis = eventos_crise[0]
    if index < 0 or index >= len(crisis['opcoes']):
        return {'status': 'error', 'message': 'Escolha inválida.'}
    opcao = crisis['opcoes'][index]
    changes = apply_effects(opcao['efeitos'])
    return {
        'status': 'success',
        'message': f'Resultado: {opcao["resultado"]}',
        'changes': changes,
        'nextScreen': 'diplomacy'
    }

def handle_diplomacy(choice: str) -> Dict[str, any]:
    """Gerencia ações de diplomacia."""
    changes = {}
    message = ""
    if choice == 'imprensa':
        custos = {'fácil': -500, 'médio': -1000, 'difícil': -1500}
        changes = apply_effects({
            'relacaoImprensa': 15,
            'orcamento': custos[state['dificuldade']]
        })
        message = f"Negociação com a imprensa bem-sucedida! Relação +15, Orçamento -R${abs(custos[state['dificuldade']] * 10)}."
    elif choice == 'governo':
        changes = apply_effects({
            'relacaoGoverno': 10,
            'relacaoImprensa': -5,
            'orcamento': -10
        })
        message = "Negociação com o governo concluída! Relação +10, Orçamento -R$100."
    elif choice == 'ongs':
        changes = apply_effects({
            'relacaoONGs': 10,
            'relacaoGoverno': -5,
            'orcamento': -5
        })
        message = "Apoio das ONGs garantido! Relação +10, Orçamento -R$50."
    elif choice == 'skip':
        load_case()
        return {'status': 'success', 'message': 'Diplomacia pulada.', 'nextScreen': 'case'}
    else:
        return {'status': 'error', 'message': 'Ação de diplomacia inválida.'}
    
    load_case()
    return {
        'status': 'success',
        'message': message,
        'changes': changes,
        'nextScreen': 'case'
    }

def end_game() -> Dict[str, str]:
    """Encerra o jogo e retorna o resultado final."""
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

    return {
        'status': 'game_over',
        'message': final_text
    }