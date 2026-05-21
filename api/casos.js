// GET /api/casos — Retorna casos.json armazenado no Vercel Edge Config
// Fallback: serve o arquivo local game/casos.json se Edge Config falhar
import { get } from '@vercel/edge-config';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Tenta ler do Edge Config primeiro
    const casos = await get('casos');
    if (casos) {
      return res.status(200).json({
        source: 'edge-config',
        data: casos
      });
    }
  } catch (e) {
    console.warn('Edge Config indisponível, usando fallback local:', e.message);
  }

  // Fallback: ler do arquivo local
  try {
    const filePath = path.join(process.cwd(), 'game', 'casos.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const casos = JSON.parse(raw);
    return res.status(200).json({
      source: 'local',
      data: casos
    });
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao carregar casos', details: e.message });
  }
}
