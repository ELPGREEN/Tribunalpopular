from flask import Flask, jsonify, request, render_template
import copy
import random
import json
import os

app = Flask(__name__)

from game.game_logic import (
    state, start_game, set_difficulty, load_case, make_decision,
    investigate, get_current_case, get_reputation,
    handle_crisis_choice, handle_difficulty_diplomacy,
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
        return round(atual + delta * (1 - atual / 100))
    return round(atual - abs(delta) * (atual / 100))

def aplicar_impacto(metricas, impactos):
    res = dict(metricas)
    for k, v in impactos.items():
        if k in res:
            res[k] = suavizacao_exponencial(res[k], v)
            res[k] = max(0, min(100, res[k]))
    return res

DIMENSOES = {
    1: {'nome': 'TOTALITARISMO SECULAR', 'tags': ['ditadura_da_toga'], 'icone': 'skull'},
    2: {'nome': 'ANARQUIA COMUNAL', 'tags': ['anarquia_comunal'], 'icone': 'fire'},
    3: {'nome': 'DISTOPIA CORPORATIVA', 'tags': ['uberizacao_total', 'subserviencia_corporativa'], 'icone': 'building'},
    4: {'nome': 'TEOCRACIA EXPANSIONISTA', 'tags': ['alianca_teocratica', 'guerra_santa_declarada'], 'icone': 'cross'},
    5: {'nome': 'CLEPTOCRACIA ORGANIZADA', 'tags': ['capitalismo_de_compadrio', 'pacto_de_impunidade'], 'icone': 'money-bill-wave'},
    6: {'nome': 'GUERRA CIVIL PERPÉTUA', 'tags': ['motim_militar_iminente'], 'icone': 'crosshairs'},
    7: {'nome': 'AUTARQUIA ISOLADA', 'tags': ['soberania_isolada'], 'icone': 'mountain'},
    8: {'nome': 'COLÔNIA EXTRATIVISTA', 'tags': ['austeridade_sangrenta', 'subserviencia_corporativa'], 'icone': 'tree'},
    9: {'nome': 'NARCOCRACIA', 'tags': ['guerra_de_gangues_legalizada'], 'icone': 'skull-crossbones'},
    10: {'nome': 'OLIGARQUIA DOS JUÍZES', 'tags': ['ditadura_da_toga'], 'icone': 'gavel'},
    11: {'nome': 'FASCISMO CLERICAL', 'tags': ['guerra_santa_declarada', 'alianca_teocratica'], 'icone': 'pray'},
    12: {'nome': 'SOCIALISMO TECNOCRÁTICO', 'tags': ['estatizacao_punitiva', 'trabalho_regulado'], 'icone': 'gear'},
    13: {'nome': 'FEDERALISMO DEMOCRÁTICO ESTÁVEL ★', 'tags': ['democracia_resgatada'], 'icone': 'crown', 'ng': True},
    14: {'nome': 'ANARCO-PRIMITIVISMO', 'tags': ['dimensao_insurreicao_civil', 'justica_social_caos_fiscal'], 'icone': 'leaf'},
    15: {'nome': 'VIGILÂNCIA ABSOLUTA', 'tags': ['estado_vigilancia_absoluto'], 'icone': 'eye'},
    16: {'nome': 'PARADOXO ENTRÓPICO', 'tags': [], 'icone': 'infinity'}
}

def decodificar_dimensao(tags, metricas):
    t = set(tags)
    for did, dim in DIMENSOES.items():
        if all(tag in t for tag in dim['tags']):
            if did == 1:
                if metricas.get('estabilidade', 0) > 70:
                    return dim
                continue
            if did == 10:
                if metricas.get('legado', 0) > 60:
                    return dim
                continue
            if did == 13:
                if metricas.get('etica', 0) > 65 and metricas.get('diplomacia', 0) > 55:
                    return dim
                continue
            return dim
    if metricas.get('estabilidade', 0) < 20:
        return DIMENSOES[2]
    return DIMENSOES[16]

# === Rotas Originais ===

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game_route():
    player_name = request.form.get('playerName')
    result = start_game(player_name)
    if result['status'] == 'error':
        return jsonify(result), 400
    dificuldade = request.form.get('dificuldade', 'médio')
    set_difficulty(dificuldade)
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
    result = make_decision(index)
    return jsonify(result)

@app.route('/crisis_choice', methods=['POST'])
def crisis_choice():
    data = request.get_json()
    index = data.get('index', 0)
    result = handle_crisis_choice(index)
    return jsonify(result)

@app.route('/diplomacy', methods=['POST'])
def diplomacy():
    data = request.get_json()
    choice = data.get('choice', 'skip')
    result = handle_difficulty_diplomacy(choice)
    return jsonify(result)

@app.route('/random_event', methods=['GET'])
def random_event():
    possible = [e for e in eventos_aleatorios if not e.get('condicao') or e['condicao']()]
    if possible:
        event = random.choice(possible)
        for k, v in event.get('efeitos', {}).items():
            if k == 'orcamento':
                state['orcamento'] = max(0, state['orcamento'] + v)
            elif k in state:
                state[k] = max(0, min(100, state[k] + v))
        return jsonify({'evento': event})
    return jsonify({'evento': None})

@app.route('/reputation', methods=['GET'])
def reputation():
    return jsonify(get_reputation())

# === Novas Rotas Dimensionais ===

@app.route('/api/casos', methods=['GET'])
def api_casos():
    path = os.path.join(os.path.dirname(__file__), 'game', 'casos.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({'erro': 'casos.json nao encontrado'}), 404

@app.route('/api/proximo', methods=['POST'])
def api_proximo():
    data = request.get_json() or {}
    opcao = data.get('opcao', 0)
    dimensionais = data.get('dimensionais')
    
    if dimensionais:
        global dimensional_state
        impacto = dimensionais.get('impacto', {})
        tag = dimensionais.get('tag')
        dimensional_state['metricas'] = aplicar_impacto(dimensional_state['metricas'], impacto)
        if tag:
            dimensional_state['tags'].append(tag)
        dimensional_state['casoAtual'] += 1
    
    return jsonify({
        'metricas': dimensional_state['metricas'],
        'tags': dimensional_state['tags'],
        'casoAtual': dimensional_state['casoAtual'],
        'dimensaoFinal': decodificar_dimensao(dimensional_state['tags'], dimensional_state['metricas'])
    })

@app.route('/api/dimensao', methods=['GET'])
def api_dimensao():
    return jsonify({
        'metricas': dimensional_state['metricas'],
        'tags': dimensional_state['tags'],
        'dimensaoFinal': decodificar_dimensao(dimensional_state['tags'], dimensional_state['metricas'])
    })

@app.route('/api/reiniciar', methods=['POST'])
def api_reiniciar():
    dimensional_state['metricas'] = dict(METRICAS_BASE)
    dimensional_state['tags'] = []
    dimensional_state['casoAtual'] = 1
    dimensional_state['contadorCrises'] = 0
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
