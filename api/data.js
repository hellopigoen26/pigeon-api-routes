const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
function sbH() {
  return {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation'
  };
}
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { action, table, data, userId, id, stage } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    if (action === 'get') {
      const r = await fetch(`${SB_URL}/rest/v1/${table}?user_id=eq.${userId}&select=*&order=created_at.asc`, { headers: sbH() });
      const j = await r.json();
      return res.status(200).json(j);
    }
    if (action === 'insert') {
      const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: sbH(),
        body: JSON.stringify({ ...data, user_id: userId })
      });
      const j = await r.json();
      if (!r.ok) return res.status(400).json({ error: j });
      return res.status(200).json(Array.isArray(j) ? j[0] : j);
    }
    if (action === 'update') {
      const r = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}&user_id=eq.${userId}`, {
        method: 'PATCH',
        headers: sbH(),
        body: JSON.stringify(data)
      });
      const j = await r.json();
      return res.status(200).json(Array.isArray(j) ? j[0] : j);
    }
    if (action === 'delete') {
      const r = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}&user_id=eq.${userId}`, {
        method: 'DELETE',
        headers: sbH()
      });
      return res.status(200).json({ ok: r.ok });
    }
    if (action === 'updateUser') {
      const r = await fetch(`${SB_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: sbH(),
        body: JSON.stringify(data)
      });
      const j = await r.json();
      return res.status(200).json(Array.isArray(j) ? j[0] : j);
    }
    if (action === 'getMatchedInvestor') {
      const stageKeywords = stage ? stage.split(' ').filter(w => w.length > 3) : [];
      let url = `${SB_URL}/rest/v1/investors_directory?select=*&limit=10`;
      if (stageKeywords.length > 0) {
        const filter = stageKeywords.map(k => `stage.ilike.*${k}*`).join(',');
        url += `&or=(${filter})`;
      }
      const r = await fetch(url, { headers: sbH() });
      const j = await r.json();
      if (!r.ok) return res.status(500).json({ error: j });
      const result = j && j.length > 0 ? j[Math.floor(Math.random() * j.length)] : null;
      return res.status(200).json({ investor: result });
    }
    return res.status(400).json({ error: 'Invalid action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
