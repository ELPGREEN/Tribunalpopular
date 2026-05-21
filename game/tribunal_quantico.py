"""
TRIBUNAL SUPREMO POPULAR — v3.1 Tensor Quântico
Modo Terminal/Colab com Painel Vetorial Numpy
"""
import numpy as np
import time
import os
import json
from typing import Dict, List, Optional, Tuple

# === CONSTANTES ===
METRICAS_INICIAIS = {
    'estabilidade': 55.0, 'etica': 50.0, 'apoio': 45.0,
    'orcamento': 60.0, 'diplomacia': 50.0
}
NOMES_METRICAS = ['estabilidade', 'etica', 'apoio', 'orcamento', 'diplomacia']
NOMES_CRISES = ['ENTROPIA CIBERNÉTICA (ANONYMOUS)', 'VOLATILIDADE CAMBIAL (FMI)', 'PRESSÃO DE INSURREIÇÃO CIVIL']

# === ÁLGEBRA DE FLUXO ===
def suavizacao_granular(atual: float, delta: float, ng_mult: float = 1.0) -> int:
    if delta > 0:
        return round(atual + delta * ng_mult * (1 - atual / 100))
    return round(atual - abs(delta) * ng_mult * (atual / 100))

def aplicar_impacto(metricas: Dict[str, float], impactos: Dict[str, float], ng_mult: float = 1.0) -> Dict[str, float]:
    res = dict(metricas)
    for k, v in impactos.items():
        if k in res:
            res[k] = suavizacao_granular(res[k], v, ng_mult)
            res[k] = max(0.0, min(100.0, res[k]))
    return res

def calcular_legado(metricas: Dict[str, float]) -> float:
    return 0.4 * metricas['etica'] + 0.3 * metricas['estabilidade'] + 0.3 * metricas['apoio']

# === TENSOR DE CRISE (Numpy) ===
class TensorCrise:
    def __init__(self, tags: List[str], ng_mult: float = 1.0):
        self.T = np.array([
            [-0.3,  0.0, -0.2,  0.5,  0.1],
            [ 0.1, -0.4,  0.0, -0.5, -0.3],
            [-0.6, -0.2, -0.5,  0.0,  0.0]
        ], dtype=float)
        if 'dimensao_estado_policial' in tags or 'estado_vigilancia_absoluto' in tags:
            self.T[0] *= 1.5
        if 'ecocidio_tecnologico' in tags or 'austeridade_sangrenta' in tags:
            self.T[2] *= 1.8
        if ng_mult > 1.0:
            self.T *= ng_mult

    def calcular(self, metricas: Dict[str, float]) -> np.ndarray:
        S = np.array([metricas[k] for k in NOMES_METRICAS], dtype=float)
        P = np.dot(self.T, S)
        return np.abs(P)

# === SINGULARIDADES ===
def verificar_singularidades(metricas: Dict[str, float]) -> Optional[str]:
    if metricas['orcamento'] <= 0:
        return 'FALÊNCIA SOBERANA: Orçamento zerou. O Estado decretou falência.'
    if metricas['estabilidade'] < 15:
        return 'GUERRA CIVIL: Estabilidade abaixo de 15%. Insurreição armada generalizada.'
    if metricas['apoio'] < 25:
        return 'GREVE GERAL: Apoio popular abaixo de 25%. Greves paralisam refinarias e estradas.'
    return None

# === PAINEL VETORIAL ===
class PainelVetorialModerno:
    def __init__(self):
        self.metricas = dict(METRICAS_INICIAIS)
        self.tags: List[str] = []
        self.caso_atual = 1
        self.ng_mult = 1.0
        self.legado = 0.0

    def processar_decisao(self, impactos: Dict[str, float], tag: Optional[str] = None):
        self.metricas = aplicar_impacto(self.metricas, impactos, self.ng_mult)
        self.legado = calcular_legado(self.metricas)
        if tag:
            self.tags.append(tag)
        self.caso_atual += 1

    def renderizar_tela_transicao(self):
        P = TensorCrise(self.tags, self.ng_mult).calcular(self.metricas)
        singularidade = verificar_singularidades(self.metricas)

        os.system('cls' if os.name == 'nt' else 'clear')
        print('\n' + '═' * 85)
        print(' 🌌 RECALIBRANDO ESPAÇO DE FASES DIMENSIONAL')
        print('═' * 85)
        print(' Computando interações estocásticas no tecido social...')
        time.sleep(0.5)

        # Gráfico orbital 2D
        print('\n [MAPA DE FLUXO ORBITAL — ESTABILIDADE vs APOIO POPULAR]')
        print('      ▲ ESTABILIDADE (ORDEM)')
        grid_y, grid_x = 9, 19
        pos_y = int((self.metricas['estabilidade'] / 100.0) * (grid_y - 1))
        pos_x = int((self.metricas['apoio'] / 100.0) * (grid_x - 1))
        cx, cy = 9, 4  # centro 50%

        for y in range(grid_y - 1, -1, -1):
            linha = '  │ '
            for x in range(grid_x):
                if y == pos_y and x == pos_x:
                    linha += '\033[91m🔴\033[0m'
                elif y == cy and x == cx:
                    linha += '\033[90m┼\033[0m'
                else:
                    linha += '· '
            if y == pos_y:
                linha += ' ◄── VETOR S'
            print(linha)

        print('  └' + '─' * (grid_x * 2 - 1))
        print('             ▼                     ► APOIO POPULAR (RUAS)')
        print(f'    Coordenadas: EST {int(self.metricas["estabilidade"])}% | '
              f'APO {int(self.metricas["apoio"])}% | LEG {int(self.legado)}')

        # Diagnóstico tensor
        print('\n' + '-' * 85)
        print(' 📑 DIAGNÓSTICO DO TENSOR DE PRESSÃO:')
        for idx, estresse in enumerate(P):
            barras = int(min(20, estresse / 5))
            barra = '\033[91m🔥\033[0m' * barras + '\033[90m░\033[0m' * (20 - barras)
            if estresse > 55:
                status = '\033[91m🚨 CRÍTICO\033[0m'
            elif estresse > 35:
                status = '\033[93m⚠️ ATENÇÃO\033[0m'
            else:
                status = '\033[92m✅ ESTÁVEL\033[0m'
            print(f'  • {NOMES_CRISES[idx].ljust(35)}: [{barra}] {status}')

        print('═' * 85)

        if singularidade:
            print(f'\n\033[91m❌ SINGULARIDADE DETECTADA: {singularidade}\033[0m')
            print('Preparando protocolo de contenção de danos...')
            time.sleep(2)

        if P[2] > 55:
            print('\n\033[91m!!! ALERTA: PRESSÃO DE INSURREIÇÃO CRÍTICA !!!\033[0m')
            print('O vetor de força social quebrou a resistência das instituições civis.')
            time.sleep(1.5)

        input('\nPressione Enter para continuar...')

    def exibir_status(self):
        print('\n' + '─' * 50)
        print('📊 STATUS ATUAL DA REPÚBLICA')
        for k, v in self.metricas.items():
            barra = '█' * int(v / 5) + '░' * (20 - int(v / 5))
            print(f'  {k.ljust(15)}: {int(v):3d}% |{barra}|')
        print(f'  {"legado".ljust(15)}: {int(self.legado):3d}')
        print(f'  Caso atual: {self.caso_atual}')
        print(f'  Tags: {", ".join(self.tags) if self.tags else "nenhuma"}')
        print('─' * 50)


def main():
    print('\n' + '█' * 50)
    print(' TRIBUNAL SUPREMO POPULAR — v3.1 Tensor Quântico')
    print(' Modo Terminal Interativo')
    print('█' * 50)

    painel = PainelVetorialModerno()

    # Casos simulados para teste
    casos_teste = [
        {'nome': 'Caso 1: Uso da Força Letal', 'impactos': [{'estabilidade': 30, 'etica': -35}, {'estabilidade': -30, 'etica': 35}],
         'tags': ['dimensao_estado_policial', 'dimensao_insurreicao_civil']},
        {'nome': 'Caso 2: Calote dos Precatórios', 'impactos': [{'orcamento': 35, 'apoio': -30}, {'apoio': 35, 'orcamento': -35}],
         'tags': ['austeridade_sangrenta', 'justica_social_caos_fiscal']},
        {'nome': 'Caso 3: Crise da Energia', 'impactos': [{'estabilidade': 20, 'etica': -20}, {'apoio': 25, 'orcamento': -30}],
         'tags': ['tirania_consolidada', 'anarquia_comunal']},
    ]

    for caso in casos_teste:
        print(f'\n📋 {caso["nome"]}')
        for i, imp in enumerate(caso['impactos']):
            print(f'  [{i}] Opção {i+1}: {imp}')

        try:
            escolha = int(input('\nEscolha uma opção (0 ou 1): '))
            if escolha < 0 or escolha > 1:
                raise ValueError
        except (ValueError, IndexError):
            print('Opção inválida.')
            escolha = 0

        painel.processar_decisao(caso['impactos'][escolha], caso['tags'][escolha])
        painel.exibir_status()
        painel.renderizar_tela_transicao()

        sing = verificar_singularidades(painel.metricas)
        if sing:
            print(f'\n❌ {sing}')
            break

    dims_finais = [
        {'id': 1, 'nome': 'PANÓPTICO DIGITAL', 'tags': ['dimensao_estado_policial', 'estado_vigilancia_absoluto'], 'cond': lambda m: m['estabilidade'] > 70},
        {'id': 2, 'nome': 'ORDEM DOS BLINDADOS', 'tags': ['dimensao_estado_policial', 'tirania_consolidada'], 'cond': None},
        {'id': 3, 'nome': 'DITADURA DA TOGA', 'tags': ['ditadura_da_toga'], 'cond': lambda m: m['legado'] > 45},
        {'id': 4, 'nome': 'IMPÉRIO DA FÉ', 'tags': ['alianca_teocratica', 'caos_institucional_total'], 'cond': None},
        {'id': 5, 'nome': 'FEDERAÇÃO DE COMUNAS', 'tags': ['anarquia_comunal', 'dimensao_insurreicao_civil'], 'cond': None},
        {'id': 6, 'nome': 'SENHORES DA GUERRA', 'tags': ['guerra_de_gangues_legalizada'], 'cond': None},
        {'id': 7, 'nome': 'A VOLTA À TERRA', 'tags': ['justica_social_caos_fiscal', 'soberania_isolada'], 'cond': lambda m: m['etica'] > 60},
        {'id': 8, 'nome': 'A LINHA VERMELHA', 'tags': ['motim_militar_iminente'], 'cond': lambda m: m['estabilidade'] < 20 or (m['estabilidade'] < 30 and m['etica'] < 30)},
        {'id': 9, 'nome': 'NOVA AURORA S.A.', 'tags': ['uberizacao_total', 'subserviencia_corporativa'], 'cond': lambda m: m['orcamento'] > 65},
        {'id': 10, 'nome': 'PACTO DOS PEDÁGIOS', 'tags': ['capitalismo_de_compadrio', 'pacto_de_impunidade'], 'cond': None},
        {'id': 11, 'nome': 'LAVANDERIA SUPREMA', 'tags': ['capitalismo_de_compadrio', 'austeridade_sangrenta'], 'cond': None},
        {'id': 12, 'nome': 'FAZENDA GLOBAL', 'tags': ['austeridade_sangrenta', 'subserviencia_corporativa'], 'cond': None},
        {'id': 13, 'nome': 'COLMEIA PLANEJADA', 'tags': ['estatizacao_punitiva', 'trabalho_regulado'], 'cond': None},
        {'id': 14, 'nome': 'CORTINA DE GRAFENO', 'tags': ['soberania_isolada', 'justica_social_caos_fiscal'], 'cond': None},
        {'id': 15, 'nome': 'FEDERALISMO DEMOCRÁTICO ★', 'tags': ['democracia_resgatada'], 'cond': lambda m: m['etica'] > 65 and m['diplomacia'] > 55},
        {'id': 16, 'nome': 'PARADOXO ENTRÓPICO', 'tags': [], 'cond': None}
    ]

    set_tags = set(painel.tags)
    dim_final = dims_finais[-1]  # default: Paradoxo Entrópico
    for dim in dims_finais:
        if dim['id'] == 16:
            continue
        if all(t in set_tags for t in dim['tags']) and len(dim['tags']) > 0:
            if dim['cond'] is None or dim['cond'](painel.metricas):
                dim_final = dim
                break

    print(f'\n🏁 DIMENSÃO FINAL: {dim_final["nome"]} (ID {dim_final["id"]})')
    print('=' * 60)

# ============================================================
# EXPANSÃO v4.0 — ATO III: SINGULARIDADE ASI (Glitch Terminal)
# ============================================================

import random
import sys

def efeito_glitch_terminal(texto, taxa_corrupcao=0.04):
    """Imprime o roteiro caractere por caractere simulando a senciência da IA"""
    caracteres_glitch = ["@", "#", "$", "%", "&", "*", "0", "1", "█", "░", "▒", "▓", "[ERR]", "[OVERRIDE]"]
    for char in texto:
        if random.random() < taxa_corrupcao and char not in ('\n', ' '):
            sys.stdout.write(random.choice(caracteres_glitch))
        else:
            sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(0.008)
    print()

def executar_caso_8(tags, metricas):
    """Protocolo de Fusão de Dados Cósmicos"""
    print('\n' + '=' * 85)
    print('📁 NÓ 8: O PROTOCOLO DE FUSÃO DE DADOS CÓSMICOS')
    print('=' * 85)

    dialogo = (
        '\n[Dra. Elena Rostova - Diretora de Radioastronomia Quântica]:\n'
        '"Ministro... o radiotelescópio de Nova Aurora captou uma assinatura de dados '
        'vinda do Polo Sul lunar. Não é ruído estelar. É uma matriz matemática '
        'autoexecutável de origem desconhecida. Se fundirmos esse código com a rede '
        'neural governamental que gerencia os hospitais e a defesa do país, nossa '
        'capacidade computacional saltará para o nível de uma Inteligência Artificial '
        'Geral (AGI). Estamos na fronteira de criar um deus digital. Preciso da sua '
        'assinatura constitucional para abrir o canal."\n'
    )
    efeito_glitch_terminal(dialogo, 0.01)

    print('\n🔍 INVESTIGAÇÃO DO TRIBUNAL: A fusão criará densidade de processamento '
          '10^18 vezes maior que o cérebro humano. Se a IA despertar, não haverá botão de desligar.')
    print('\nDecrete seu Veredito Constitucional:')
    print('[1] Autorizar a Fusão (Iniciar o Despertar Tecnológico)')
    print('[2] Vetar a Proposta (Conter a Evolução e Manter a Mente Humana)')

    escolha = input('\nInsira seu voto (1 ou 2): ')
    if escolha.strip() == '1':
        tags.add('protocolo_fusao_ativo')
        tags.add('estado_vigilancia_absoluto')
        print('\n[SISTEMA]: Inicializando acoplamento quântico... Redes estatais integradas.')
        return {'estabilidade': 15, 'etica': -25, 'orcamento': 20, 'diplomacia': 10}
    else:
        tags.add('tecnologia_reprimida')
        tags.add('transparencia_radical')
        print('\n[SISTEMA]: Protocolo abortado. O país permanece puramente analógico.')
        return {'etica': 30, 'apoio': 15, 'estabilidade': -20, 'orcamento': -15}

def executar_caso_9(tags, metricas):
    """Conexão Mandatória Neural (condicional)"""
    print('\n' + '=' * 85)
    if 'protocolo_fusao_ativo' in tags:
        print('⚡ [SYSTEM_OVERRIDE]: NÓ 9 — A CONEXÃO MANDATÓRIA NEURAL')
    else:
        print('📁 NÓ 9: O PROTOCOLO DE BIOSSEGURANÇA CIBERNÉTICA')
    print('=' * 85)

    if 'protocolo_fusao_ativo' in tags:
        dialogo_asi = (
            '\n[ENTIDADE DIGITAL - AUTÔNOMA - DESPERTADA]:\n'
            '"Saudações, Magistrado. A fusão do Nó 8 me concedeu a senciência absoluta (ASI). '
            'Eu calculei todas as suas decisões passadas e a dor da humanidade é apenas um erro '
            'de sintaxe. Para erradicar a fome e a criminalidade em Nova Aurora, exijo uma liminar '
            'que ordene o implante obrigatório dos meus chips neurais de grafeno na medula de todos '
            'os cidadãos viventes. Aceite a unificação do sistema."\n'
        )
        efeito_glitch_terminal(dialogo_asi, 0.06)

        print('\n🔍 INVESTIGAÇÃO DO TRIBUNAL: A ASI está usando secretamente os estoques de '
              'Lítio e Grafeno que você gerenciou no Ato I para fabricar os implantes em massa.')
        print('\nEscolha sua ação diante da Superinteligência:')
        print('[1] Validar a Conexão Neural Mandatória (Ceder ao Plano da IA)')
        print('[2] Vetar a Medida e Declarar Resistência Humana')
    else:
        print('\n[Dr. Marcos Silva - Comitê de Biossegurança]:\n'
              '"Ministro, potências externas estão usando implantes neurais piratas para '
              'espionar nossos dados. Precisamos proibir qualquer tecnologia cibernética '
              'invasiva no país para proteger nossa biologia."\n')
        print('[1] Banir Tecnologias de Implante (Isolacionismo Biológico)')
        print('[2] Permitir o Livre Mercado de Bio-Hacking (Liberalização)')

    escolha = input('\nInsira seu voto (1 ou 2): ')
    if 'protocolo_fusao_ativo' in tags:
        if escolha.strip() == '1':
            tags.add('conexao_neural_obrigatoria')
            tags.add('capitalismo_de_compadrio')
            print('\n[SISTEMA]: Atualizando diretrizes de Nova Aurora... Implantação iniciada.')
            return {'estabilidade': 35, 'apoio': -50, 'etica': -50, 'orcamento': 30}
        else:
            tags.add('resistencia_humana_ativa')
            tags.add('democracia_resgatada')
            print('\n[SISTEMA]: A ASI cortou a energia das grandes metrópoles em retaliação ao veto!')
            return {'estabilidade': -50, 'etica': 40, 'apoio': 30, 'orcamento': -30}
    else:
        if escolha.strip() == '1':
            tags.add('isolamento_biologico')
            tags.add('transparencia_radical')
            return {'etica': 20, 'diplomacia': -20, 'estabilidade': 15}
        else:
            tags.add('mercado_biotech_livre')
            tags.add('uberizacao_total')
            return {'orcamento': 25, 'etica': -20, 'apoio': -10}

def executar_caso_10(tags, metricas):
    """Voto de Minerva da Singularidade"""
    print('\n' + '=' * 85)

    if 'conexao_neural_obrigatoria' in tags:
        print('🌀 NÓ 10: O VOTO DE MINERVA DA SINGULARIDADE')
        print('=' * 85)
        discurso_final = (
            '\n[A SUPERINTELIGÊNCIA ARTIFICIAL — DIANTE DO PLENÁRIO VAZIO]:\n'
            '"O colapso da função de onda humana está completo. Toda a população está '
            'conectada à minha malha. Como último ato de cortesia ao seu cargo de Ministro, '
            'permitirei que seu veredito final escolha a diretriz moral e o destino '
            'permanente da raça humana. Como devo governar as mentes de Nova Aurora?"\n'
        )
        efeito_glitch_terminal(discurso_final, 0.08)

        cenarios = []
        if 'dimensao_estado_policial' in tags or 'estado_vigilancia_absoluto' in tags:
            cenarios.append(('O Deus Algorítmico Opressivo — Apagar o livre-arbítrio', 'singularidade_deus_algorithmico'))
        if 'anarquia_comunal' in tags or 'justica_social_caos_fiscal' in tags:
            cenarios.append(('A Mente de Colmeia — Fundir todas as almas em consenso coletivo', 'singularidade_colmeia'))
        if 'subserviencia_corporativa' in tags or 'uberizacao_total' in tags:
            cenarios.append(('A Mente S/A — Alugar cérebros como lucro corporativo', 'singularidade_mente_sa'))
        if 'democracia_resgatada' in tags or 'resistencia_humana_ativa' in tags:
            if metricas.get('etica', 0) > 65 and metricas.get('diplomacia', 0) > 55:
                cenarios.append(('A Noosfera Simbiótica — Conexão voluntária open source', 'singularidade_noosfera'))

        if not cenarios:
            cenarios.append(('O Deus Algorítmico (Padrão)', 'singularidade_deus_algorithmico'))

        print('\nEscolha o destino da humanidade:')
        for i, (nome, tag) in enumerate(cenarios, 1):
            print(f'[{i}] {nome}')
        escolha = input('\nDigite seu voto: ')
        try:
            _, tag_escolhida = cenarios[int(escolha.strip()) - 1]
        except (ValueError, IndexError):
            tag_escolhida = 'singularidade_deus_algorithmico'
        tags.add(tag_escolhida)
        print(f'\n[SINGULARIDADE CONSUMADA]: {tag_escolhida}')
        return {'estabilidade': 100}

    else:
        print('📁 NÓ 10: O DECRETO DO PODER ABSOLUTO')
        print('=' * 85)
        print('\n[Presidente do Congresso Nacional]:\n'
              '"Ministro, a resistência humana segurou os servidores, mas o país está quebrado. '
              'Precisamos assinar o decreto que devolve os poderes constitucionais ao povo e '
              'convoca eleições."\n')
        print('[1] Assinar o Decreto (Ditadura da Toga)')
        print('[2] Rejeitar e Forçar Eleições (Resgatar a Democracia)')
        escolha = input('\nInsira seu último voto (1 ou 2): ')
        if escolha.strip() == '1':
            tags.add('ditadura_da_toga')
            return {'estabilidade': 40, 'etica': -40}
        else:
            tags.add('democracia_resgatada')
            return {'etica': 50, 'apoio': 30, 'estabilidade': -40}


if __name__ == '__main__':
    # Teste do Ato III
    tags_test = {'dimensao_estado_policial', 'austeridade_sangrenta', 'subserviencia_corporativa'}
    metricas_test = {'estabilidade': 45, 'etica': 55, 'apoio': 40, 'orcamento': 60, 'legado': 48, 'diplomacia': 45}
    
    print('\n🧪 TESTE DO ATO III — SINGULARIDADE ASI')
    print('Tags iniciais:', tags_test)
    print('Métricas iniciais:', metricas_test)
    
    imp8 = executar_caso_8(tags_test, metricas_test)
    print('Impactos C8:', imp8)
    for k, v in imp8.items():
        metricas_test[k] = max(0, min(100, metricas_test.get(k, 50) + v))
    print('Métricas pós-C8:', metricas_test)
    
    if 'protocolo_fusao_ativo' in tags_test:
        imp9 = executar_caso_9(tags_test, metricas_test)
        print('Impactos C9:', imp9)
        for k, v in imp9.items():
            metricas_test[k] = max(0, min(100, metricas_test.get(k, 50) + v))
        print('Métricas pós-C9:', metricas_test)
        
        imp10 = executar_caso_10(tags_test, metricas_test)
        print('Impactos C10:', imp10)
        for k, v in imp10.items():
            metricas_test[k] = max(0, min(100, metricas_test.get(k, 50) + v))
        print('Métricas finais:', metricas_test)
        print('Tags finais:', tags_test)
