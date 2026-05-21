// GET /api/health — Verifica conectividade com Edge Config e retorna status
import { get } from '@vercel/edge-config';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const status = { ok: true, edgeConfig: false, timestamp: Date.now() };

  try {
    const test = await get('casos');
    status.edgeConfig = Array.isArray(test);
    status.casosCount = Array.isArray(test) ? test.length : 0;
  } catch (e) {
    status.ok = false;
    status.edgeConfig = false;
    status.error = e.message;
  }

  res.status(status.ok ? 200 : 503).json(status);
}
