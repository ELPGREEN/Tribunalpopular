import json
import os
import random
import re
from typing import Dict, List, Optional

# Load cases from JSON
CASOS_PATH = os.path.join(os.path.dirname(__file__), "casos.json")
with open(CASOS_PATH, "r", encoding="utf-8") as f:
    casos = json.load(f)

# State management
state = {
    "playerName": None,
    "dificuldade": "médio",
    "orcamento": 50,
    "estabilidade": 50,
    "etica": 50,
    "apoio": 50,
    "diplomacia": 50,
    "legado": 0,
    "casosJulgados": 0,
    "investigationsDone": 0,
    "currentCase": None,
    "tags": []
}

eventos_aleatorios = []
eventos_crise = []

def suavizacao_exponencial(atual, delta):
    if delta > 0:
        return round(atual + max(0.5, delta * (1 - atual / 100)))
    return round(atual - max(0.5, abs(delta) * (atual / 100)))

def apply_effects(effects: Dict[str, int]) -> Dict[str, int]:
    changes = {}
    mapping = {
        "apoioPopular": "apoio",
        "respeitoInstitucional": "estabilidade",
        "relacaoONGs": "etica",
        "relacaoImprensa": "diplomacia",
        "relacaoGoverno": "diplomacia",
        "influenciaPolitica": "legado"
    }
    for key, value in effects.items():
        target_key = mapping.get(key, key)
        if target_key in state:
            state[target_key] = suavizacao_exponencial(state[target_key], value)
            state[target_key] = max(0, min(100, state[target_key]))
            changes[target_key] = value

    state["legado"] = round(0.4 * state["etica"] + 0.3 * state["estabilidade"] + 0.3 * state["apoio"])
    return changes

def start_game(player_name: str) -> Dict[str, str]:
    if not player_name: return {"status": "error", "message": "Nome vazio"}
    state["playerName"] = player_name
    state["casosJulgados"] = 0
    state["tags"] = []
    for k in ["estabilidade", "etica", "apoio", "orcamento", "diplomacia"]:
        state[k] = 50
    state["legado"] = 0
    load_case()
    return {"status": "success", "message": f"Bem-vindo, {player_name}!"}

def set_difficulty(level: str):
    state["dificuldade"] = level

def load_case() -> None:
    # Filter by condition
    available = [c for c in casos if not c.get("condicao") or c["condicao"] in state["tags"]]
    # Next sequential ID
    current_id = state["casosJulgados"] + 1
    possible = [c for c in available if c["id"] == current_id]

    if not possible:
        state["currentCase"] = None
    else:
        # Prioritize conditioned cases (branches)
        with_cond = [c for c in possible if "condicao" in c]
        state["currentCase"] = with_cond[0] if with_cond else possible[0]

    state["investigationsDone"] = 0

def get_current_case():
    return state["currentCase"]

def get_reputation():
    return state

def investigate(index: int):
    if state["orcamento"] < 10:
        return {"status": "error", "message": "Orçamento insuficiente"}
    state["orcamento"] = suavizacao_exponencial(state["orcamento"], -10)
    state["investigationsDone"] += 1
    return {"status": "success", "message": "Investigação concluída."}

def make_decision(index: int):
    caso = state["currentCase"]
    if not caso or index >= len(caso["opcoes"]):
        return {"status": "error", "message": "Invalido"}

    opcao = caso["opcoes"][index]
    apply_effects(opcao["impacto"])
    tag = opcao.get("tag")
    if tag:
        if isinstance(tag, list): state["tags"].extend(tag)
        else: state["tags"].append(tag)

    state["casosJulgados"] += 1
    load_case()

    # Check if mandante ends (Case 10 or 15)
    if state["currentCase"] is None:
        return {"status": "game_over", "message": "Sua jornada terminou."}

    return {"status": "success", "next": state["currentCase"]}

def handle_difficulty_diplomacy(choice: str):
    return {"status": "success"}
