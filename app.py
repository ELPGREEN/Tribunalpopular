from flask import Flask, jsonify, request, render_template
from game.game_logic import (
    state, start_game, set_difficulty, load_case, make_decision,
    initialize_advanced_session, load_advanced_case, load_leader_case, make_advanced_decision
)


app = Flask(__name__, static_folder='static', template_folder='templates')

# Lista global de casos e eventos que você deve ter definido em game_logic.py ou outro lugar
# Vou assumir que você vai importar ou definir 'casos', 'eventos_aleatorios' e 'eventos_crise' em algum lugar do seu projeto

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_game', methods=['POST'])
def start_game_route():
    player_name = request.form.get('playerName')
    dificuldade = request.form.get('dificuldade')

    state.update({
        'playerName': player_name,
        'dificuldade': dificuldade,
        'apoioPopular': 50,
        'respeitoInstitucional': 50,
        'influenciaPolitica': 50,
        'relacaoImprensa': 50,
        'relacaoGoverno': 50,
        'relacaoONGs': 50,
        'casosJulgados': 0,
        'investigationsDone': 0,
        'orcamento': 10000,
        'custoManutencao': 1000,
        'currentCase': None,
        'maxInvestigations': 3
    })

    return jsonify({'message': 'Jogo iniciado', 'state': state})


@app.route('/get_case', methods=['GET'])
def get_case():
    if state.get('currentCase') is None and casos:
        import copy
        state['currentCase'] = copy.deepcopy(casos[0])
        state['currentCase']['provas'] = []
    return jsonify(state.get('currentCase'))


@app.route('/investigate', methods=['POST'])
def investigate():
    opcao = request.json.get('opcao')

    if state['investigationsDone'] >= state.get('maxInvestigations', 3):
        return jsonify({'error': 'Limite de investigações atingido'}), 400

    current_case = state.get('currentCase')
    if not current_case or opcao not in current_case.get('investigacoes', {}):
        return jsonify({'error': 'Opção inválida'}), 400

    investigacao = current_case['investigacoes'][opcao]
    resultado = investigacao['resultado']
    nova_prova = investigacao['novaProva']

    for chave, valor in investigacao.get('custo', {}).items():
        state[chave] += valor

    current_case.setdefault('provas', []).append(nova_prova)
    state['investigationsDone'] += 1

    return jsonify({'resultado': resultado, 'provas': current_case['provas']})


@app.route('/decide', methods=['POST'])
def decide():
    opcao = request.json.get('opcao')
    current_case = state.get('currentCase')

    if not current_case or opcao not in current_case.get('decisoes', {}):
        return jsonify({'error': 'Decisão inválida'}), 400

    decisao = current_case['decisoes'][opcao]

    for chave, valor in decisao.get('efeitos', {}).items():
        state[chave] += valor

    state['casosJulgados'] += 1
    resultado = {
        'manchete': decisao['manchete'],
        'reacaoPopular': decisao['reacaoPopular'],
        'reacaoMidia': decisao['reacaoMidia'],
        'estadoAtual': state
    }

    state['currentCase'] = None
    state['investigationsDone'] = 0

    return jsonify(resultado)


@app.route('/random_event', methods=['GET'])
def random_event():
    for evento in eventos_aleatorios:
        if evento['condicao']():
            for chave, valor in evento.get('efeitos', {}).items():
                state[chave] += valor
            return jsonify({'evento': evento})
    return jsonify({'evento': None})


@app.route('/crisis_event', methods=['GET'])
def crisis_event():
    if state.get('casosJulgados', 0) >= 1 and eventos_crise:
        crise = eventos_crise[0]
        return jsonify({'evento': crise})
    return jsonify({'evento': None})


@app.route('/decide_crisis', methods=['POST'])
def decide_crisis():
    opcao = request.json.get('opcao')
    crise = eventos_crise[0]

    if opcao not in crise.get('opcoes', {}):
        return jsonify({'error': 'Opção inválida'}), 400

    decisao = crise['opcoes'][opcao]

    for chave, valor in decisao.get('efeitos', {}).items():
        state[chave] += valor

    return jsonify({'resultado': decisao['resultado'], 'estadoAtual': state})


if __name__ == '__main__':
    app.run(debug=True)
