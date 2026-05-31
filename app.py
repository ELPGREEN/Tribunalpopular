from flask import Flask, jsonify, request, render_template
import copy
import random
import json
import os

app = Flask(__name__)

from game.game_logic import (
    state, start_game, set_difficulty, load_case, make_decision,
    investigate, get_current_case, get_reputation,
    handle_difficulty_diplomacy,
    eventos_aleatorios, eventos_crise, casos
)

# === Motor Estocástico Dimensional ===
METRICAS_BASE = {
    'estabilidade': 50, 'etica': 50, 'apoio': 50,
    'orcamento': 50, 'legado': 0, 'diplomacia': 50
}

dimensional_state = {
    'metricas': dict(METRICAS_BASE),
    'tags': [],
    'casoAtual': 1,
    'contadorCrises': 0
}

def suavizacao_exponencial(atual, delta):
    if delta > 0:
        return round(atual + max(0.5, delta * (1 - atual / 100)))
    return round(atual - max(0.5, abs(delta) * (atual / 100)))

def aplicar_impacto(metricas, impactos):
    res = dict(metricas)
    for k, v in impactos.items():
        if k in res:
            res[k] = suavizacao_exponencial(res[k], v)
            res[k] = max(0, min(100, res[k]))
    # Recalculate Legacy
    res['legado'] = round(0.4 * res.get('etica', 50) + 0.3 * res.get('estabilidade', 50) + 0.3 * res.get('apoio', 50))
    return res

DIMENSOES = {
    1: {'nome': 'TOTALITARISMO SECULAR', 'tags': ['ditadura_da_toga', 'ordem_absoluta'], 'icone': 'skull', 'desc': 'O Supremo Tribunal fundiu-se ao Executivo. A lei é o que você diz.', 'cor': '#ff4444'},
    2: {'nome': 'ANARQUIA COMUNAL', 'tags': ['anarquia_comunal'], 'icone': 'fire', 'desc': 'O Estado ruiu. Comunas locais autogovernadas são a nova realidade.', 'cor': '#ff8800'},
    3: {'nome': 'DISTOPIA CORPORATIVA', 'tags': ['uberizacao_total', 'subserviencia_corporativa'], 'icone': 'building', 'desc': 'Cidadãos são ativos financeiros. O país é gerido por acionistas.', 'cor': '#00ff88'},
    4: {'nome': 'TEOCRACIA EXPANSIONISTA', 'tags': ['alianca_teocratica', 'guerra_santa_declarada'], 'icone': 'cross', 'desc': 'A fé é a lei. Uma cruzada digital para converter o mundo começou.', 'cor': '#cc00ff'},
    5: {'nome': 'CLEPTOCRACIA ORGANIZADA', 'tags': ['capitalismo_de_compadrio', 'pacto_de_impunidade'], 'icone': 'money-bill-wave', 'desc': 'Políticos e juízes dividem o saque. A corrupção é o motor do país.', 'cor': '#cc6600'},
    6: {'nome': 'GUERRA CIVIL PERPÉTUA', 'tags': ['motim_militar_iminente'], 'icone': 'crosshairs', 'desc': 'O país rachou. O tribunal governa de um bunker blindado.', 'cor': '#ff0000'},
    7: {'nome': 'AUTARQUIA ISOLADA', 'tags': ['soberania_isolada'], 'icone': 'mountain', 'desc': 'Fronteiras fechadas. O país tenta sobreviver sozinho no colapso global.', 'cor': '#2ecc71'},
    8: {'nome': 'COLÔNIA EXTRATIVISTA', 'tags': ['austeridade_sangrenta', 'subserviencia_corporativa'], 'icone': 'tree', 'desc': 'O país foi fatiado por potências estrangeiras para extração de Lítio.', 'cor': '#800080'},
    9: {'nome': 'NARCOCRACIA', 'tags': ['guerra_de_gangues_legalizada'], 'icone': 'skull-crossbones', 'desc': 'Cartéis controlam as cidades. A lei do mais forte impera.', 'cor': '#800080'},
    10: {'nome': 'OLIGARQUIA DOS JUÍZES', 'tags': ['ditadura_da_toga', 'elitismo_judicial'], 'icone': 'gavel', 'desc': 'Uma aristocracia judiciária mantém a ordem com mão de ferro.', 'cor': '#4488ff'},
    11: {'nome': 'FASCISMO CLERICAL', 'tags': ['guerra_santa_declarada', 'militarismo_religioso'], 'icone': 'pray', 'desc': 'Religião e força militar fundidas em um dogma inquestionável.', 'cor': '#cc00ff'},
    12: {'nome': 'SOCIALISMO TECNOCRÁTICO', 'tags': ['estatizacao_punitiva', 'trabalho_regulado'], 'icone': 'gear', 'desc': 'O Estado controla cada aspecto da vida através de algoritmos de igualdade.', 'cor': '#2a9d8f'},
    13: {'nome': 'FEDERALISMO DEMOCRÁTICO ESTÁVEL ★', 'tags': ['democracia_resgatada'], 'icone': 'crown', 'desc': 'O equilíbrio foi mantido. A República sobreviveu à tempestade.', 'ng': True, 'cor': '#b89c5b'},
    14: {'nome': 'ANARCO-PRIMITIVISMO', 'tags': ['dimensao_insurreicao_civil', 'justica_social_caos_fiscal'], 'icone': 'leaf', 'desc': 'A tecnologia foi abandonada. A humanidade volta à terra para curar.', 'cor': '#2ecc71'},
    15: {'nome': 'VIGILÂNCIA ABSOLUTA', 'tags': ['estado_vigilancia_absoluto'], 'icone': 'eye', 'desc': 'Privacidade morreu. Cada pensamento é monitorado pela IA Suprema.', 'cor': '#00ccff'},
    16: {'nome': 'PARADOXO ENTRÓPICO', 'tags': [], 'icone': 'infinity', 'desc': 'Nenhum padrão claro emergiu. O futuro é uma névoa de incertezas.', 'cor': '#666'}
}

def decodificar_dimensao(tags, metricas):
    t = set(tags)
    if 'democracia_resgatada' in t and metricas.get('etica', 50) > 60:
        return DIMENSOES[13]
    sorted_dims = sorted(DIMENSOES.items(), key=lambda x: len(x[1]['tags']), reverse=True)
    for did, dim in sorted_dims:
        if did == 16: continue
        if len(dim['tags']) > 0 and all(tag in t for tag in dim['tags']):
            return dim
    if metricas.get('estabilidade', 50) < 25:
        return DIMENSOES[2]
    if metricas.get('estabilidade', 50) > 75:
        return DIMENSOES[15]
    return DIMENSOES[16]

# === Rotas ===

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game_route():
    data = request.get_json() or request.form
    player_name = data.get('playerName')
    result = start_game(player_name)
    if result['status'] == 'error':
        return jsonify(result), 400
    dificuldade = data.get('dificuldade', 'médio')
    set_difficulty(dificuldade)
    global dimensional_state
    dimensional_state['metricas'] = dict(METRICAS_BASE)
    dimensional_state['tags'] = []
    dimensional_state['casoAtual'] = 1
    return jsonify({'message': 'Jogo iniciado', 'state': state})

@app.route('/get_case', methods=['GET'])
def get_case():
    caso = get_current_case()
    if caso is None:
        return jsonify({'error': 'Nenhum caso disponível'}), 404
    return jsonify(caso)

@app.route('/investigate', methods=['POST'])
def investigate_route():
    data = request.get_json()
    index = data.get('index', 0)
    result = investigate(index)
    return jsonify(result)

@app.route('/decide', methods=['POST'])
def decide():
    data = request.get_json()
    index = data.get('index', 0)
    caso = get_current_case()
    if not caso: return jsonify({'status': 'error', 'message': 'Caso nao encontrado'}), 404

    opcao = caso['opcoes'][index]
    global dimensional_state
    dimensional_state['metricas'] = aplicar_impacto(dimensional_state['metricas'], opcao['impacto'])
    tag = opcao.get('tag')
    if tag:
        if isinstance(tag, list): dimensional_state['tags'].extend(tag)
        else: dimensional_state['tags'].append(tag)
    dimensional_state['casoAtual'] += 1

    result = make_decision(index)
    return jsonify(result)

@app.route('/reputation', methods=['GET'])
def reputation():
    return jsonify(state)

@app.route('/api/dimensao', methods=['GET'])
def api_dimensao():
    return jsonify({
        'metricas': dimensional_state['metricas'],
        'tags': dimensional_state['tags'],
        'dimensaoFinal': decodificar_dimensao(dimensional_state['tags'], dimensional_state['metricas'])
    })

@app.route('/api/casos', methods=['GET'])
def api_casos():
    return jsonify(casos)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
