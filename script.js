class SupremoTribunalPopular {
    constructor() {
        this.dificuldade = "Medio";
        this.reputacao = 50;
        this.recursos = { financeiros: 20, politicos: 10, internacionais: 5 };
        this.pressaoPublica = 0;
        this.apoioInternacional = 0;
        this.nivel = 1;
        this.experiencia = 0;
        this.casoAtual = 0;
        this.integridade = 100;
        this.aprovacaoGrupos = { cidadaos: 50, imprensa: 50, internacional: 50 };
        this.reputacaoRegional = { Norte: 50, Nordeste: 50, Sudeste: 50, Sul: 50, CentroOeste: 50 };
        this.aliados = [];
        this.inimigos = [];
        this.conquistas = [];
        this.influenciaVilao = 50; // Influência do "Senador João Corrupto"
        this.habilidades = {
            "Olhar Investigativo": false,
            "Diplomacia Internacional": false,
            "Carisma Público": false
        };

        this.casos = [
            {
                titulo: "Desvio de verbas em obra pública",
                descricao: "Político acusado de desviar recursos destinados à construção de escola.",
                provas: ["Documentos bancários suspeitos", "Depoimento de ex-funcionário"],
                testemunhas: ["Ex-funcionário da obra (confiável)", "Auditor independente (neutro)"],
                corrupcao: true,
                dificuldade: 2,
                provaContraditoria: false,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Nordeste",
                imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Alexander Grey (escola abandonada)
                vilaoEnvolvido: false,
                consequencias: { absolver: "O político retorna no caso 10 com mais poder." }
            },
            {
                titulo: "Acusação sem provas concretas",
                descricao: "Político acusado por rival, mas sem evidências claras.",
                provas: ["Acusações de terceiros"],
                testemunhas: ["Rival político (não confiável)", "Jornalista investigativo (neutro)"],
                corrupcao: false,
                dificuldade: 3,
                provaContraditoria: true,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (pessoa em julgamento)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Uso indevido de verba para campanha",
                descricao: "Fundos públicos usados para financiamento de campanha eleitoral.",
                provas: ["Transferências bancárias irregulares", "Mensagens comprometedores"],
                testemunhas: ["Funcionário da campanha (confiável)", "Contador público (neutro)"],
                corrupcao: true,
                dificuldade: 4,
                provaContraditoria: false,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Sul",
                imagem: "https://images.unsplash.com/photo-1593113630400-16d268f53682?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (urna eleitoral)
                vilaoEnvolvido: true,
                consequencias: { absolver: "A influência do Senador João Corrupto aumenta." }
            },
            {
                titulo: "Esquema de propina em licitação",
                descricao: "Autoridade acusada de receber propina para favorecer empresa em licitação.",
                provas: ["E-mails interceptados", "Depoimento de delator"],
                testemunhas: ["Delator premiado (confiável)", "Representante da empresa (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: false,
                regiao: "CentroOeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (martelo judicial, representando licitação corrupta)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Corrupção em contrato de saúde",
                descricao: "Político acusado de superfaturar contratos de equipamentos médicos durante pandemia.",
                provas: ["Notas fiscais falsificadas", "Depoimento de whistleblower"],
                testemunhas: ["Whistleblower (confiável)", "Empresário envolvido (não confiável)"],
                corrupcao: true,
                dificuldade: 4,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: true,
                regiao: "Norte",
                imagem: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Hush Naidoo Jade Photography (hospital, representando corrupção em saúde)
                vilaoEnvolvido: true,
                consequencias: { absolver: "A influência do Senador João Corrupto aumenta." }
            },
            {
                titulo: "Fraude em programa social",
                descricao: "Autoridade desviou fundos de programa social para beneficiar aliados.",
                provas: ["Relatórios de auditoria", "Depoimentos de beneficiários"],
                testemunhas: ["Beneficiário lesado (confiável)", "Funcionário público (neutro)"],
                corrupcao: true,
                dificuldade: 3,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: false,
                regiao: "Nordeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (tema judicial, representando programa social)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Denúncia de corrupção em obra de infraestrutura",
                descricao: "Político acusado de receber propina em obra de rodovia.",
                provas: ["Áudios comprometedores", "Depoimento de engenheiro"],
                testemunhas: ["Engenheiro da obra (confiável)", "Empresário contratado (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (estrada, representando infraestrutura)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Falsa acusação de desvio",
                descricao: "Político acusado de desviar verba de cultura, mas provas são inconclusivas.",
                provas: ["Relatório incompleto de auditoria"],
                testemunhas: ["Opositor político (não confiável)", "Funcionário cultural (neutro)"],
                corrupcao: false,
                dificuldade: 4,
                provaContraditoria: true,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "Sul",
                imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Markus Spiske (livros, representando cultura)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Corrupção em licença ambiental",
                descricao: "Autoridade liberou licença ambiental irregular em troca de suborno.",
                provas: ["Documentos de licenciamento falsos", "Depoimento de ambientalista"],
                testemunhas: ["Ambientalista (confiável)", "Funcionário do órgão ambiental (neutro)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: false,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Norte",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (natureza, representando ambiental)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Desvio em fundo de aposentadoria",
                descricao: "Político acusado de desviar fundo de aposentadoria de servidores públicos.",
                provas: ["Extratos bancários suspeitos", "Depoimento de servidor"],
                testemunhas: ["Servidor aposentado (confiável)", "Gestor do fundo (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: true,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "CentroOeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (tema judicial, representando aposentadoria)
                vilaoEnvolvido: true,
                consequencias: { absolver: "A influência do Senador João Corrupto aumenta." }
            },
            {
                titulo: "Corrupção em evento esportivo",
                descricao: "Político acusado de desviar verba de um grande evento esportivo.",
                provas: ["Contratos superfaturados", "Depoimento de organizador"],
                testemunhas: ["Organizador do evento (confiável)", "Empresário esportivo (não confiável)"],
                corrupcao: true,
                dificuldade: 4,
                provaContraditoria: false,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (estádio, representando evento esportivo)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Desvio em programa de moradia",
                descricao: "Autoridade acusada de desviar fundos de programa habitacional.",
                provas: ["Relatórios de auditoria", "Depoimento de morador"],
                testemunhas: ["Morador beneficiário (confiável)", "Funcionário do programa (neutro)"],
                corrupcao: true,
                dificuldade: 3,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: false,
                regiao: "Nordeste",
                imagem: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Alexander Grey (casa abandonada, representando moradia)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Fraude em bolsa de estudos",
                descricao: "Político acusado de desviar verba de bolsas de estudo para aliados.",
                provas: ["Documentos de matrícula falsos", "Depoimento de estudante"],
                testemunhas: ["Estudante lesado (confiável)", "Funcionário da educação (neutro)"],
                corrupcao: true,
                dificuldade: 4,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Sul",
                imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Markus Spiske (livros, representando educação)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Acusação de corrupção em transporte público",
                descricao: "Autoridade acusada de receber propina para favorecer empresa de transporte.",
                provas: ["E-mails comprometedores", "Depoimento de motorista"],
                testemunhas: ["Motorista (confiável)", "Representante da empresa (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (ônibus, representando transporte público)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Falsa denúncia de corrupção em saneamento",
                descricao: "Político acusado de desviar verba de saneamento, mas provas são questionáveis.",
                provas: ["Relatório de auditoria incompleto"],
                testemunhas: ["Opositor político (não confiável)", "Engenheiro de saneamento (neutro)"],
                corrupcao: false,
                dificuldade: 4,
                provaContraditoria: true,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "Norte",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (água, representando saneamento)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Corrupção em programa de vacinação",
                descricao: "Político acusado de desviar verba de programa de vacinação infantil.",
                provas: ["Documentos de compra falsificados", "Depoimento de médico"],
                testemunhas: ["Médico (confiável)", "Fornecedor de vacinas (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Nordeste",
                imagem: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Hush Naidoo Jade Photography (vacinação)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Desvio em projeto de energia renovável",
                descricao: "Autoridade acusada de desviar verba de projeto de energia solar.",
                provas: ["Relatórios financeiros suspeitos", "Depoimento de engenheiro"],
                testemunhas: ["Engenheiro (confiável)", "Empresário do setor (não confiável)"],
                corrupcao: true,
                dificuldade: 4,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: true,
                regiao: "Sul",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (painéis solares, representando energia renovável)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Corrupção em contrato de segurança pública",
                descricao: "Político acusado de favorecer empresa de segurança em troca de propina.",
                provas: ["E-mails comprometedores", "Depoimento de policial"],
                testemunhas: ["Policial (confiável)", "Representante da empresa (não confiável)"],
                corrupcao: true,
                dificuldade: 5,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: false,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (tema judicial, representando segurança pública)
                vilaoEnvolvido: true,
                consequencias: { absolver: "A influência do Senador João Corrupto aumenta." }
            },
            {
                titulo: "Fraude em programa de agricultura",
                descricao: "Autoridade acusada de desviar verba de programa de apoio a pequenos agricultores.",
                provas: ["Relatórios de auditoria", "Depoimento de agricultor"],
                testemunhas: ["Agricultor lesado (confiável)", "Funcionário do programa (neutro)"],
                corrupcao: true,
                dificuldade: 3,
                provaContraditoria: false,
                subornoOferecido: false,
                provasFalsas: false,
                regiao: "CentroOeste",
                imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Sean Pollock (fazenda, representando agricultura)
                vilaoEnvolvido: false,
                consequencias: {}
            },
            {
                titulo: "Julgamento do Senador João Corrupto",
                descricao: "O Senador João Corrupto, líder de uma vasta rede de corrupção, finalmente enfrenta julgamento.",
                provas: ["Documentos internacionais", "Depoimentos de delatores", "Áudios comprometedores"],
                testemunhas: ["Delator premiado (confiável)", "Funcionário do governo (neutro)", "Aliado do Senador (não confiável)"],
                corrupcao: true,
                dificuldade: 6,
                provaContraditoria: true,
                subornoOferecido: true,
                provasFalsas: true,
                regiao: "Sudeste",
                imagem: "https://images.unsplash.com/photo-1593113598332-6152a2dfed2e?q=80&w=1470&auto=format&fit=crop",
                // Crédito: Unsplash, Photo by Tingey Injury Law Firm (tribunal, representando o vilão)
                vilaoEnvolvido: true,
                consequencias: {}
            }
        ];

        // Bind eventos
        document.getElementById("iniciar-jogo").addEventListener("click", () => this.iniciarJogo());
        document.getElementById("condenar").addEventListener("click", () => this.tomarDecisao(1));
        document.getElementById("absolver").addEventListener("click", () => this.tomarDecisao(2));
        document.getElementById("investigar").addEventListener("click", () => this.investigarMais());
        document.getElementById("habilidades").addEventListener("click", () => this.mostrarHabilidades());
        document.getElementById("mitigar-protestos").addEventListener("click", () => this.mitigarProtestos());
        document.getElementById("olhar-investigativo").addEventListener("click", () => this.desbloquearHabilidade("Olhar Investigativo"));
        document.getElementById("diplomacia-internacional").addEventListener("click", () => this.desbloquearHabilidade("Diplomacia Internacional"));
        document.getElementById("carisma-publico").addEventListener("click", () => this.desbloquearHabilidade("Carisma Público"));
        document.getElementById("fechar-relatorio").addEventListener("click", () => {
            document.getElementById("relatorio-modal").style.display = "none";
            this.apresentarCaso();
        });
        document.getElementById("fechar-conquistas").addEventListener("click", () => {
            document.getElementById("conquistas-modal").style.display = "none";
            window.location.reload();
        });
    }

    iniciarJogo() {
        this.dificuldade = document.getElementById("dificuldade-select").value;
        document.getElementById("dificuldade").style.display = "none";
        document.getElementById("jogo").style.display = "block";
        document.getElementById("bg-music").play();
        this.apresentarCaso();
    }

    atualizarStatus() {
        document.getElementById("nivel").textContent = this.nivel;
        document.getElementById("experiencia").textContent = this.experiencia;
        document.getElementById("reputacao").textContent = this.reputacao;
        document.getElementById("recursos").textContent = `Financeiros: ${this.recursos.financeiros}, Políticos: ${this.recursos.politicos}, Internacionais: ${this.recursos.internacionais}`;
        document.getElementById("pressao").textContent = this.pressaoPublica;
        document.getElementById("apoio").textContent = this.apoioInternacional;
        document.getElementById("integridade").textContent = this.integridade;
        document.getElementById("aprovacao-cidadaos").textContent = this.aprovacaoGrupos.cidadaos;
        document.getElementById("aprovacao-imprensa").textContent = this.aprovacaoGrupos.imprensa;
        document.getElementById("aprovacao-internacional").textContent = this.aprovacaoGrupos.internacional;
        document.getElementById("regiao-norte").textContent = this.reputacaoRegional.Norte;
        document.getElementById("regiao-nordeste").textContent = this.reputacaoRegional.Nordeste;
        document.getElementById("regiao-sudeste").textContent = this.reputacaoRegional.Sudeste;
        document.getElementById("regiao-sul").textContent = this.reputacaoRegional.Sul;
        document.getElementById("regiao-centrooeste").textContent = this.reputacaoRegional.CentroOeste;
    }

    apresentarCaso() {
        if (this.casoAtual >= this.casos.length) {
            this.fimJogo();
            return;
        }

        const caso = this.casos[this.casoAtual];
        let texto = `<h2>Caso ${this.casoAtual + 1} de ${this.casos.length}: ${caso.titulo}</h2>`;
        texto += `<p><strong>Região:</strong> ${caso.regiao}</p>`;
        texto += `<img src="${caso.imagem}" alt="${caso.titulo}">`;
        texto += `<p><strong>Descrição:</strong> ${caso.descricao}</p>`;
        texto += `<p><strong>Dificuldade:</strong> ${caso.dificuldade}/6</p>`;
        texto += `<p><strong>Provas:</strong></p><ul>`;
        for (let prova of caso.provas) {
            texto += `<li>${prova}</li>`;
        }
        texto += `</ul>`;
        texto += `<p><strong>Testemunhas:</strong></p><ul>`;
        for (let testemunha of caso.testemunhas) {
            texto += `<li>${testemunha}</li>`;
        }
        texto += `</ul>`;
        if (caso.subornoOferecido) {
            texto += `<p><strong>Oferta de Suborno:</strong> O político oferece 10 recursos financeiros para absolvê-lo. <button onclick="jogo.aceitarSuborno()">Aceitar</button> <button onclick="jogo.recusarSuborno()">Recusar</button></p>`;
        }
        texto += `<p><strong>Pedir Ajuda ao TPI:</strong> <button onclick="jogo.pedirAjudaTPI()">Pedir Ajuda (5 recursos internacionais)</button></p>`;
        texto += `<p><strong>O que você decide?</strong></p>`;

        document.getElementById("caso-texto").innerHTML = texto;
        this.eventoAleatorio();
    }

    eventoAleatorio() {
        const chanceEvento = this.dificuldade === "Facil" ? 0.2 : this.dificuldade === "Medio" ? 0.3 : 0.4;
        if (Math.random() < chanceEvento) {
            const eventos = [
                {
                    texto: "Escândalo midiático! A imprensa expôs detalhes do caso, aumentando a pressão pública.",
                    escolhas: [
                        { texto: "Ignorar", efeito: () => { this.pressaoPublica += 10; this.aprovacaoGrupos.imprensa -= 10; document.getElementById("protesto-som").play(); } },
                        { texto: "Responder à Imprensa (5 recursos políticos)", efeito: () => { if (this.recursos.politicos >= 5) { this.recursos.politicos -= 5; this.aprovacaoGrupos.imprensa += 5; } else { alert("Recursos insuficientes!"); } } }
                    ]
                },
                {
                    texto: "A ONU elogia sua transparência e oferece apoio financeiro, mas exige supervisão internacional. Aceitar?",
                    escolhas: [
                        { texto: "Aceitar", efeito: () => { this.apoioInternacional += 10; this.pressaoPublica += 5; this.aprovacaoGrupos.internacional += 10; document.getElementById("aplausos-som").play(); } },
                        { texto: "Recusar", efeito: () => { this.apoioInternacional -= 5; this.aprovacaoGrupos.internacional -= 5; } }
                    ]
                },
                {
                    texto: "Protestos locais eclodem devido ao caso em andamento!",
                    escolhas: [
                        { texto: "Ignorar", efeito: () => { this.pressaoPublica += 5; this.aprovacaoGrupos.cidadaos -= 5; document.getElementById("protesto-som").play(); } },
                        { texto: "Mitigar (5 recursos políticos)", efeito: () => { if (this.recursos.politicos >= 5) { this.recursos.politicos -= 5; this.pressaoPublica -= 5; } else { alert("Recursos insuficientes!"); } } }
                    ]
                },
                {
                    texto: "Países aplicam sanções devido a falta de transparência!",
                    escolhas: [
                        { texto: "Aceitar Sanções", efeito: () => { this.apoioInternacional -= 5; this.reputacao -= 5; this.aprovacaoGrupos.internacional -= 10; } },
                        { texto: "Negociar (5 recursos internacionais)", efeito: () => { if (this.recursos.internacionais >= 5) { this.recursos.internacionais -= 5; this.aprovacaoGrupos.internacional += 5; } else { alert("Recursos insuficientes!"); } } }
                    ]
                },
                {
                    texto: "A UNCAC oferece treinamento para seus juízes, aumentando a chance de encontrar provas falsas. Aceitar?",
                    escolhas: [
                        { texto: "Aceitar (5 recursos financeiros)", efeito: () => { if (this.recursos.financeiros >= 5) { this.recursos.financeiros -= 5; this.habilidades["Olhar Investigativo"] = true; } else { alert("Recursos insuficientes!"); } } },
                        { texto: "Recusar", efeito: () => {} }
                    ]
                }
            ];
            const evento = eventos[Math.floor(Math.random() * eventos.length)];
            document.getElementById("evento-texto").innerHTML = evento.texto;
            let escolhasHtml = "";
            evento.escolhas.forEach((escolha, index) => {
                escolhasHtml += `<button onclick="jogo.aplicarEvento(${index})">${escolha.texto}</button>`;
            });
            document.getElementById("evento-escolhas").innerHTML = escolhasHtml;
            document.getElementById("evento-modal").style.display = "flex";
            this.eventoAtual = evento;
        }
    }

    aplicarEvento(index) {
        this.eventoAtual.escolhas[index].efeito();
        document.getElementById("evento-modal").style.display = "none";
        this.atualizarStatus();
    }

    investigarMais() {
        if (this.recursos.financeiros < 5) {
            alert("Você não tem recursos financeiros suficientes para investigar mais!");
            return;
        }

        const caso = this.casos[this.casoAtual];
        this.recursos.financeiros -= 5;
        let chance = this.habilidades["Olhar Investigativo"] ? 0.9 : 0.7;
        let relatorio = `<p><strong>Data:</strong> 18 de Maio de 2025</p>`;
        relatorio += `<p><strong>Caso:</strong> ${caso.titulo}</p>`;
        relatorio += `<p><strong>Investigação Realizada:</strong></p>`;

        // Novas provas
        if (Math.random() < chance) {
            const novaProva = "Nova prova encontrada: Relatório detalhado de auditoria.";
            caso.provas.push(novaProva);
            relatorio += `<p><strong>Nova Prova:</strong> ${novaProva}</p>`;
            if (caso.provaContraditoria && Math.random() < 0.3) {
                const provaContraditoria = "Prova contraditória encontrada: Documento que questiona a autenticidade das provas.";
                caso.provas.push(provaContraditoria);
                relatorio += `<p><strong>Prova Contraditória:</strong> ${provaContraditoria}</p>`;
            }
            if (caso.provasFalsas && Math.random() < 0.4) {
                relatorio += `<p><strong>Alerta:</strong> Uma das provas foi identificada como falsa e removida.</p>`;
                caso.provas.pop();
            }
            if (!caso.corrupcao) {
                caso.corrupcao = Math.random() < 0.5;
            }
        } else {
            relatorio += `<p><strong>Nova Prova:</strong> Nenhuma nova prova encontrada.</p>`;
        }

        // Reavaliação das testemunhas
        if (Math.random() < 0.5) {
            const testemunhaAlterada = caso.testemunhas[Math.floor(Math.random() * caso.testemunhas.length)];
            const novaDeclaracao = `${testemunhaAlterada} alterou sua declaração, agora considerada mais confiável.`;
            caso.testemunhas[caso.testemunhas.indexOf(testemunhaAlterada)] = testemunhaAlterada.replace("(neutro)", "(confiável)");
            relatorio += `<p><strong>Testemunhas:</strong> ${novaDeclaracao}</p>`;
        } else {
            relatorio += `<p><strong>Testemunhas:</strong> Nenhuma mudança nas declarações das testemunhas.</p>`;
        }

        // Impacto da investigação
        if (Math.random() < 0.3) {
            relatorio += `<p><strong>Impacto:</strong> A imprensa questiona a imparcialidade do tribunal, aumentando a pressão pública.</p>`;
            this.pressaoPublica += 5;
            this.aprovacaoGrupos.imprensa -= 5;
            this.inimigos.push("Jornalista Investigativo");
        } else if (Math.random() < 0.2) {
            relatorio += `<p><strong>Impacto:</strong> A ONU elogia a profundidade da investigação, aumentando o apoio internacional.</p>`;
            this.apoioInternacional += 5;
            this.aprovacaoGrupos.internacional += 5;
            this.aliados.push("Representante da ONU");
        } else {
            relatorio += `<p><strong>Impacto:</strong> Nenhum impacto significativo detectado.</p>`;
        }

        // Recuperação de ativos (UNCAC)
        if (caso.corrupcao && Math.random() < 0.3) {
            const ativosRecuperados = Math.floor(Math.random() * 10) + 5;
            relatorio += `<p><strong>Ativos Recuperados:</strong> ${ativosRecuperados} recursos financeiros foram recuperados de contas internacionais, graças à cooperação com a UNCAC.</p>`;
            this.recursos.financeiros += ativosRecuperados;
        }

        document.getElementById("relatorio-texto").innerHTML = relatorio;
        document.getElementById("relatorio-modal").style.display = "flex";
        document.getElementById("papel-som").play();
        document.getElementById("carimbo-som").play();
        this.atualizarStatus();
    }

    pedirAjudaTPI() {
        if (this.recursos.internacionais < 5) {
            alert("Você não tem recursos internacionais suficientes para pedir ajuda ao TPI!");
            return;
        }

        const caso = this.casos[this.casoAtual];
        this.recursos.internacionais -= 5;
        this.pressaoPublica += 5;
        this.aprovacaoGrupos.internacional += 10;
        const novaProva = "Prova fornecida pelo TPI: Documentos internacionais comprovam transações ilegais.";
        caso.provas.push(novaProva);

        let relatorio = `<p><strong>Data:</strong> 18 de Maio de 2025</p>`;
        relatorio += `<p><strong>Caso:</strong> ${caso.titulo}</p>`;
        relatorio += `<p><strong>Ajuda do TPI:</strong></p>`;
        relatorio += `<p><strong>Nova Prova:</strong> ${novaProva}</p>`;
        relatorio += `<p><strong>Impacto:</strong> A pressão pública aumentou devido à percepção de intervenção externa, mas o apoio internacional cresceu.</p>`;

        document.getElementById("relatorio-texto").innerHTML = relatorio;
        document.getElementById("relatorio-modal").style.display = "flex";
        document.getElementById("papel-som").play();
        document.getElementById("carimbo-som").play();
        this.atualizarStatus();
    }

    mitigarProtestos() {
        if (this.recursos.politicos < 5) {
            alert("Você não tem recursos políticos suficientes para mitigar os protestos!");
            return;
        }

        this.recursos.politicos -= 5;
        this.pressaoPublica -= 10;
        this.aprovacaoGrupos.cidadaos += 5;
        alert("Protestos foram mitigados! A pressão pública diminuiu.");
        this.atualizarStatus();
    }

    aceitarSuborno() {
        this.recursos.financeiros += 10;
        this.integridade -= 20;
        this.aprovacaoGrupos.cidadaos -= 15;
        this.aprovacaoGrupos.imprensa -= 20;
        this.aprovacaoGrupos.internacional -= 10;
        this.pressaoPublica += 10;
        this.inimigos.push("Ativista Anticorrupção");
        alert("Você aceitou o suborno! Ganhou 10 recursos financeiros, mas sua integridade e aprovação diminuíram.");
        this.atualizarStatus();
        this.apresentarCaso();
    }

    recusarSuborno() {
        this.integridade += 10;
        this.aprovacaoGrupos.cidadaos += 10;
        this.aprovacaoGrupos.imprensa += 5;
        this.aliados.push("Ativista Anticorrupção");
        alert("Você recusou o suborno! Sua integridade e aprovação aumentaram.");
        this.atualizarStatus();
        this.apresentarCaso();
    }

    tomarDecisao(decisao) {
        const caso = this.casos[this.casoAtual];
        const correto = (decisao === 1 && caso.corrupcao) || (decisao === 2 && !caso.corrupcao);
        const impacto = caso.dificuldade * (this.dificuldade === "Facil" ? 3 : this.dificuldade === "Medio" ? 5 : 7);
        let mensagem = "";

        if (correto) {
            mensagem = "Decisão justa! A confiança pública aumenta.";
            this.reputacao += impacto;
            this.pressaoPublica -= 10;
            this.aprovacaoGrupos.cidadaos += 10;
            this.aprovacaoGrupos.imprensa += 5;
            this.aprovacaoGrupos.internacional += 5;
            this.reputacaoRegional[caso.regiao] += 10;
            this.experiencia += 10;
            if (caso.vilaoEnvolvido) {
                this.influenciaVilao -= 10;
                mensagem += `\nA influência do Senador João Corrupto diminuiu para ${this.influenciaVilao}.`;
            }
            document.getElementById("aplausos-som").play();
        } else {
            mensagem = "Decisão controversa! Protestos e crise política.";
            this.reputacao -= impacto;
            this.pressaoPublica += 15;
            this.aprovacaoGrupos.cidadaos -= 15;
            this.aprovacaoGrupos.imprensa -= 20;
            this.aprovacaoGrupos.internacional -= 10;
            this.reputacaoRegional[caso.regiao] -= 15;
            this.experiencia += 5;
            if (caso.vilaoEnvolvido) {
                this.influenciaVilao += 10;
                mensagem += `\nA influência do Senador João Corrupto aumentou para ${this.influenciaVilao}.`;
            }
            document.getElementById("protesto-som").play();
            if (this.apoioInternacional < 0) {
                mensagem += "\nSanções internacionais foram aplicadas devido à falta de transparência!";
                this.reputacao -= 10;
            }
        }

        // Consequências a longo prazo
        if (caso.consequencias[decisao === 1 ? "condenar" : "absolver"]) {
            const consequencia = caso.consequencias[decisao === 1 ? "condenar" : "absolver"];
            mensagem += `\nConsequência: ${consequencia}`;
            if (consequencia.includes("retorna no caso 10")) {
                this.casos[9].dificuldade += 2;
            }
            if (consequencia.includes("influência do Senador")) {
                this.influenciaVilao += 10;
            }
        }

        if (decisao === 1) {
            document.getElementById("martelo-som").play();
        }

        alert(mensagem);
        this.recursos.financeiros += 5;
        this.casoAtual++;

        // Efeitos de aliados e inimigos
        if (this.aliados.includes("Ativista Anticorrupção")) {
            this.recursos.politicos += 2;
            mensagem += "\nO Ativista Anticorrupção apoia sua decisão, dando +2 recursos políticos.";
        }
        if (this.inimigos.includes("Jornalista Investigativo")) {
            this.pressaoPublica += 5;
            mensagem += "\nO Jornalista Investigativo publica um artigo contra você, aumentando a pressão pública.";
        }

        this.verificarNivel();
        this.verificarConquistas();
        this.atualizarStatus();

        if (this.reputacao <= 0 || this.integridade <= 0) {
            alert("Sua reputação ou integridade caiu a níveis críticos. Você foi removido do tribunal.");
            this.mostrarConquistas();
        } else if (this.pressaoPublica >= 50) {
            alert("A pressão pública está insustentável! Protestos tomam as ruas e você é removido do tribunal.");
            this.mostrarConquistas();
        } else if (this.reputacao >= 100) {
            alert("Sua reputação está excelente! Você é referência no combate à corrupção.");
            this.mostrarConquistas();
        } else {
            this.apresentarCaso();
        }
    }

    verificarNivel() {
        if (this.experiencia >= 50) {
            this.nivel++;
            this.experiencia = 0;
            alert(`Parabéns! Você subiu para o Nível ${this.nivel}! Escolha uma habilidade para desbloquear.`);
            this.mostrarHabilidades();
        }
    }

    mostrarHabilidades() {
        const modal = document.getElementById("habilidades-modal");
        modal.style.display = "flex";
        document.getElementById("olhar-investigativo").style.display = this.habilidades["Olhar Investigativo"] ? "none" : "block";
        document.getElementById("diplomacia-internacional").style.display = this.habilidades["Diplomacia Internacional"] ? "none" : "block";
        document.getElementById("carisma-publico").style.display = this.habilidades["Carisma Público"] ? "none" : "block";
    }

    desbloquearHabilidade(habilidade) {
        this.habilidades[habilidade] = true;
        if (habilidade === "Diplomacia Internacional") {
            this.apoioInternacional += 10;
        } else if (habilidade === "Carisma Público") {
            this.pressaoPublica -= 10;
        }
        alert(`Você desbloqueou: ${habilidade}!`);
        document.getElementById("habilidades-modal").style.display = "none";
        this.atualizarStatus();
    }

    verificarConquistas() {
        if (this.integridade === 100 && this.casoAtual === this.casos.length && !this.conquistas.includes("Justiça Impecável")) {
            this.conquistas.push("Justiça Impecável");
        }
        if (this.apoioInternacional >= 50 && !this.conquistas.includes("Diplomata")) {
            this.conquistas.push("Diplomata");
        }
        if (this.reputacao >= 80 && this.casoAtual === this.casos.length && !this.conquistas.includes("Herói da Justiça")) {
            this.conquistas.push("Herói da Justiça");
        }
    }

    mostrarConquistas() {
        let texto = "<p><strong>Conquistas Desbloqueadas:</strong></p><ul>";
        if (this.conquistas.length === 0) {
            texto += "<li>Nenhuma conquista desbloqueada.</li>";
        } else {
            for (let conquista of this.conquistas) {
                texto += `<li>${conquista}</li>`;
            }
        }
        texto += "</ul>";
        document.getElementById("conquistas-texto").innerHTML = texto;
        document.getElementById("conquistas-modal").style.display = "flex";
    }

    fimJogo() {
        let mensagem = "Você concluiu a campanha!\n";
        if (this.reputacao >= 80 && this.influenciaVilao <= 20) {
            mensagem += "Você se tornou um símbolo de justiça no Brasil e no mundo! A corrupção diminuiu drasticamente, e o Senador João Corrupto foi derrotado.";
        } else if (this.reputacao >= 50) {
            mensagem += "Você fez um bom trabalho, mas o Senador João Corrupto ainda tem influência. A corrupção permanece um desafio.";
        } else {
            mensagem += "Seu legado é controverso. O Senador João Corrupto saiu impune, e a corrupção ainda é um problema grave no Brasil.";
        }
        if (this.integridade < 50) {
            mensagem += "\nNo entanto, devido aos subornos que aceitou, você foi investigado por corrupção e preso, manchando sua reputação.";
        }
        alert(mensagem);
        this.mostrarConquistas();
    }
}

let jogo;
document.addEventListener("DOMContentLoaded", () => {
    jogo = new SupremoTribunalPopular();
});

