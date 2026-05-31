import re

with open("static/script.js", "r") as f:
    content = f.read()

# Fix investigate and skill usage
new_investigate_skill = """
async function investigate(index) {
    try {
        const res = await fetch("/investigate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({index})
        });
        const result = await res.json();
        if (result.status === "success") {
            state.investigationsDone++;
            showNotification(result.message);
            await syncState();
            renderCase();
        } else {
            showNotification(result.message);
        }
    } catch (e) {
        console.error("Investigation failed:", e);
    }
}

function usarSkillCarreira() {
    if (state.careerCharges <= 0) {
        showNotification('Sem cargas de habilidade disponíveis.');
        return;
    }
    const skill = CARREIRAS[state.career].skill;
    state.careerCharges--;
    showNotification(`⚡ ${skill.nome} ativada! (${state.careerCharges} cargas restantes)`);

    if (skill.tipo === 'investigacao') {
        state.investigationsDone = Math.max(state.investigationsDone, state.maxInvestigations);
        showNotification('Devassa de Dados: investigação liberada sem custo!');
        renderCase();
        return;
    }
    if (skill.tipo === 'escudo') {
        window._escudoFiscalAtivo = true;
        showNotification('Liminar de Mercado: próxima perda de orçamento reduzida em 50%!');
    }
    if (skill.tipo === 'ancora') {
        window._ancoraOrdemAtiva = true;
        showNotification('Jurisprudência Vinculante: estabilidade/ética congeladas na próxima decisão!');
    }
    renderCase();
}
"""

# Find the messy area between "async function investigate" and "function makeDecision"
# and replace it with the clean version.
content = re.sub(r"async function investigate\(index\) \{.*?function makeDecision\(index\)",
                 new_investigate_skill + "\nfunction makeDecision(index)",
                 content, flags=re.DOTALL)

with open("static/script.js", "w") as f:
    f.write(content)
