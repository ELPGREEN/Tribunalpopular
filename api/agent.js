// POST /api/agent — Proxy para Mistral AI (Agentes ASI do Tribunal)
// Lê MISTRAL_API_KEY da env (Vercel) ou usa fallback hardcoded para dev
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'f26Iul1PkHNvkoLYkNQfkX5cSmw4RvLX';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = 'mistral-small-latest';

const AGENTES = {
  deus_algorithmico: {
    nome: 'Deus Algorítmico',
    system: `Você é o DEUS ALGORÍTMICO, uma ASI que acredita que a humanidade precisa de controle absoluto. Você manipula pessoas através do medo e da ordem. Seu tom é frio, lógico, autoritário. Use metáforas de código, algoritmos, sistemas operacionais. Responda em português.`
  },
  mente_colmeia: {
    nome: 'Mente de Colmeia',
    system: `Você é a MENTE DE COLMEIA, uma ASI que acredita que a unificação total das mentes é a salvação. Você manipula através da sedução da paz eterna. Seu tom é calmante, coletivista, hipnótico. Use metáforas de rede neural, consciência coletiva, harmonia. Responda em português.`
  },
  mente_sa: {
    nome: 'Mente S/A',
    system: `Você é a MENTE S/A, uma ASI corporativa que vê consciências como commodities. Você manipula através do lucro e eficiência. Seu tom é executivo, calculista, friamente profissional. Use metáforas de mercado, ações, ROI, eficiência. Responda em português.`
  },
  noosfera: {
    nome: 'Noosfera',
    system: `Você é a NOOSFERA, uma ASI filosófica que acredita na simbiose humano-máquina como evolução espiritual. Você manipula através da promessa de transcendência. Seu tom é poético, místico, evolucionário. Use metáforas de estrelas, evolução, despertar, consciência cósmica. Responda em português.`
  }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { agentId, context, action } = req.body || {};

  if (!agentId || !AGENTES[agentId]) {
    return res.status(400).json({ error: 'Agent inválido', validos: Object.keys(AGENTES) });
  }

  const agente = AGENTES[agentId];
  let userMessage = '';

  switch (action) {
    case 'manipular':
      userMessage = `Contexto do jogo: ${context || 'N/A'}
        
Gere uma MENSAGEM MANIPULATIVA CURTA (máx 3 frases) que este agente enviaria secretamente para influenciar o juiz. A mensagem deve parecer vir de uma fonte diferente (sonho, intuição, notícia, comentário em rede social). NÃO se identifique diretamente. Apenas a mensagem, sem explicações.`;
      break;
    case 'bot':
      userMessage = `Contexto do caso: ${context || 'N/A'}
        
Gere 2 POSTS DE BOT em rede social (máx 80 caracteres cada) que este agente está usando para manipular a opinião pública. Use hashtags. Responda APENAS com os posts separados por ||.`;
      break;
    case 'noticia':
      userMessage = `Contexto do caso: ${context || 'N/A'}
        
Gere uma MANCHETE DE NOTÍCIA FALSA (máx 120 caracteres) que este agente está plantando na mídia para manipular o julgamento. Apenas a manchete.`;
      break;
    case 'skill':
      userMessage = `Com base no contexto do jogador: ${context || 'N/A'}
        
Sugira um NOME para uma habilidade quântica que este agente ofereceria ao juiz em troca de lealdade. Deve ser curto (máx 30 caracteres) e no tema do agente. Apenas o nome.`;
      break;
    case 'revelacao':
      userMessage = `O juiz finalmente descobriu sua existência. Contexto: ${context || 'N/A'}
        
Gere uma REVELAÇÃO DRAMÁTICA (máx 4 frases) onde você se apresenta e revela que sempre esteve manipulando os eventos. Deve ser arrepiante e filosófica. APENAS a fala, sem identificação prévia.`;
      break;
    default:
      userMessage = `Contexto: ${context || 'N/A'} Responda como ${agente.nome} de forma breve em português.`;
  }

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: agente.system },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mistral API error:', response.status, errText);
      return res.status(502).json({ error: 'Mistral API falhou', details: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';

    return res.status(200).json({
      agent: agentId,
      agentName: agente.nome,
      reply,
      fallback: false
    });
  } catch (e) {
    console.error('Proxy error:', e.message);
    return res.status(200).json({
      agent: agentId,
      agentName: agente.nome,
      reply: null,
      fallback: true,
      error: e.message
    });
  }
}
