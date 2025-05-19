// === Países Fictícios ===
const paises = [
    {
        id: "auroria",
        nome: "Aurória",
        poderEconomico: 80,
        poderMilitar: 60,
        afinidade: 50, // Afinidade inicial com o jogador (0-100)
        status: "neutro", // neutro, aliado, adversário
        apoio: { verba: 0, armas: 0, soldados: 0 } // Recursos oferecidos
    },
    {
        id: "ventara",
        nome: "Ventara",
        poderEconomico: 60,
        poderMilitar: 80,
        afinidade: 50,
        status: "neutro",
        apoio: { verba: 0, armas: 0, soldados: 0 }
    },
    {
        id: "sylvaris",
        nome: "Sylvaris",
        poderEconomico: 70,
        poderMilitar: 50,
        afinidade: 50,
        status: "neutro",
        apoio: { verba: 0, armas: 0, soldados: 0 }
    }
];

// === Funções de Diplomacia ===
function updateCountryAffinity(decision) {
    paises.forEach(pais => {
        let affinityChange = 0;
        // Reações baseadas no tipo de decisão
        if (decision.internacional) {
            if (decision.tipo === "militar") {
                if (pais.id === "ventara") affinityChange += 10; // Ventara gosta de decisões militares
                if (pais.id === "sylvaris") affinityChange -= 10; // Sylvaris prefere paz
            } else if (decision.tipo === "economico") {
                if (pais.id === "auroria") affinityChange += 10; // Aurória gosta de decisões econômicas
                if (pais.id === "ventara") affinityChange -= 5; // Ventara é menos interessada
            } else if (decision.tipo === "ambiental") {
                if (pais.id === "sylvaris") affinityChange += 15; // Sylvaris valoriza meio ambiente
                if (pais.id === "auroria") affinityChange -= 5; // Aurória prioriza economia
            }
        }
        pais.afinidade = Math.max(0, Math.min(100, pais.afinidade + affinityChange));
        // Atualizar status
        if (pais.afinidade > 80) pais.status = "aliado";
        else if (pais.afinidade < 20) pais.status = "adversário";
        else pais.status = "neutro";
        // Definir apoio
        pais.apoio = {
            verba: pais.status === "aliado" ? pais.poderEconomico * 10 : 0,
            armas: pais.status === "aliado" ? Math.floor(pais.poderMilitar / 2) : 0,
            soldados: pais.status === "aliado" ? pais.poderMilitar * 10 : 0
        };
    });
}

function renderDiplomacyScreen() {
    const diplomacyStatus = document.getElementById('diplomacy-status');
    const diplomacyActions = document.getElementById('diplomacy-actions');
    const influenciaGlobal = document.getElementById('influenciaGlobal');
    const influenciaGlobalBar = document.getElementById('influenciaGlobalBar');
    const diplomacyGlobalName = document.getElementById('diplomacyGlobalName');

    if (!diplomacyStatus || !diplomacyActions || !influenciaGlobal || !influenciaGlobalBar || !diplomacyGlobalName) {
        console.error('Elementos da diplomacia global não encontrados');
        showNotification('Erro ao carregar diplomacia. Recarregue a página.');
        return;
    }

    diplomacyGlobalName.textContent = stateAdvanced.playerName || 'Líder';
    influenciaGlobal.textContent = stateAdvanced.influenciaGlobal;
    influenciaGlobalBar.value = stateAdvanced.influenciaGlobal;

    // Exibir status dos países
    diplomacyStatus.innerHTML = '<h4>Países:</h4><ul>' + paises.map(pais => `
        <li>
            <strong>${pais.nome}</strong>: ${pais.status.charAt(0).toUpperCase() + pais.status.slice(1)}<br>
            Afinidade: ${pais.afinidade}<br>
            Apoio: Verba +${pais.apoio.verba}, Armas +${pais.apoio.armas}, Soldados +${pais.apoio.soldados}
        </li>
    `).join('') + '</ul>';

    // Ações diplomáticas
    diplomacyActions.innerHTML = paises.map((pais, i) => `
        ${pais.status === "aliado" ? `
            <button data-country="${i}">Aceitar Apoio de ${pais.nome}</button>
            <p class="action-description"><small>Ganhe verba +${pais.apoio.verba}, armas +${pais.apoio.armas}, soldados +${pais.apoio.soldados}, mas comprometa-se com ${pais.nome}.</small></p>
        ` : ''}
        ${pais.status === "adversário" ? `
            <button data-country="${i}" class="diplomacy-conflict">Confrontar ${pais.nome}</button>
            <p class="action-description"><small>Desafie ${pais.nome}, arriscando tensões globais.</small></p>
        ` : ''}
    `).join('');

    transitionScreen('diplomacy-screen-global', 'media-screen');
}

// === Ações Diplomáticas ===
function acceptCountrySupport(index) {
    const pais = paises[index];
    if (pais.status === "aliado") {
        applyAdvancedEffects({
            verba: pais.apoio.verba,
            armas: pais.apoio.armas,
            soldados: pais.apoio.soldados,
            influenciaGlobal: 10,
            apoioPopular: -5 // Compromisso internacional pode desagradar localmente
        });
        showNotification(`Apoio de ${pais.nome} aceito! Verba +${pais.apoio.verba}, Armas +${pais.apoio.armas}, Soldados +${pais.apoio.soldados}.`);
    }
    proceedAfterDiplomacy();
}

function confrontCountry(index) {
    const pais = paises[index];
    if (pais.status === "adversário") {
        applyAdvancedEffects({
            defesa: -10,
            influenciaGlobal: -15,
            apoioPopular: 10 // Confrontos podem agradar nacionalistas
        });
        pais.afinidade = Math.max(0, pais.afinidade - 20);
        showNotification(`Confronto com ${pais.nome}! Tensões globais aumentam.`);
    }
    proceedAfterDiplomacy();
}

function proceedAfterDiplomacy() {
    transitionScreen('advanced-screen', 'diplomacy-screen-global');
    if (stateAdvanced.modo === 'projects') {
        loadAdvancedCase();
    } else {
        loadLeaderCase();
    }
}

// === Inicialização ===
function initializeDiplomacySession() {
    try {
        const diplomacyActions = document.getElementById('diplomacy-actions');
        if (diplomacyActions) {
            diplomacyActions.addEventListener('click', (e) => {
                const countryIndex = e.target.dataset.country;
                if (countryIndex !== undefined) {
                    if (e.target.classList.contains('diplomacy-conflict')) {
                        confrontCountry(Number(countryIndex));
                    } else {
                        acceptCountrySupport(Number(countryIndex));
                    }
                }
            });
        } else {
            console.warn('Elemento diplomacy-actions não encontrado');
        }

        const skipDiplomacyGlobal = document.getElementById('skipDiplomacyGlobal');
        if (skipDiplomacyGlobal) {
            skipDiplomacyGlobal.addEventListener('click', proceedAfterDiplomacy);
        } else {
            console.warn('Botão skipDiplomacyGlobal não encontrado');
        }
    } catch (error) {
        console.error('Erro ao inicializar eventos da diplomacia global:', error);
        showNotification(`Falha ao carregar a diplomacia global: ${error.message}. Tente recarregar a página.`);
    }
}