const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';

module.exports = async function handler(req, res) {
  const { id } = req.query;

  if (id) {
    try {
      // Get current open count
      const r = await fetch(`${SB_URL}/rest/v1/updates?id=eq.${id}&select=open_count,opened_at`, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
        }
      });
      const rows = await r.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      const newCount = row ? (row.open_count || 0) + 1 : 1;
      const openedAt = row && row.opened_at ? row.opened_at : new Date().toISOString();

      // Update the record
      await fetch(`${SB_URL}/rest/v1/updates?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ open_count: newCount, opened_at: openedAt })
      });
    } catch (e) {
      // Silently fail — never block the pixel
    }
  }

  // Return a 1x1 transparent PNG
  const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.status(200).send(pixel);
};
