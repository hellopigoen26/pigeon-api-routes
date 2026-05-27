export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3VlZG9iaWlubnhjeHJtdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2MjcsImV4cCI6MjA5NDUyMDYyN30.uVS6GTada9hwazNs1RLpLPQ9rJHLXN4oeGqzhVsPtZI';

  try {
    const fileName = `${userId}/pitch-deck.pdf`;
    const fileRes = await fetch(`${SB_URL}/storage/v1/object/pitch-decks/${fileName}`, {
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`
      }
    });

    if (!fileRes.ok) return res.status(404).json({ error: 'No pitch deck found' });

    const arrayBuffer = await fileRes.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Extract readable text from PDF bytes
    // PDFs contain readable text between stream markers
    const decoder = new TextDecoder('latin1');
    const raw = decoder.decode(bytes);
    
    // Extract text between BT (begin text) and ET (end text) markers
    const textParts = [];
    const btEtRegex = /BT[\s\S]*?ET/g;
    const matches = raw.match(btEtRegex) || [];
    
    for (const block of matches) {
      // Extract strings in parentheses (PDF text operators)
      const strRegex = /\(([^)]{2,})\)/g;
      let m;
      while ((m = strRegex.exec(block)) !== null) {
        const str = m[1].replace(/\\n/g, ' ').replace(/\\r/g, ' ').replace(/\\/g, '').trim();
        if (str.length > 2 && /[a-zA-Z]/.test(str)) {
          textParts.push(str);
        }
      }
    }

    const text = textParts.join(' ').replace(/\s+/g, ' ').trim().substring(0, 3000);

    if (!text) return res.status(200).json({ text: '' });
    
    res.status(200).json({ text });
  } catch (e) {
    console.error('PDF read error:', e);
    res.status(500).json({ error: e.message });
  }
}
