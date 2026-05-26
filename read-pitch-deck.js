import fetch from 'node-fetch';
import pdf from 'pdf-parse';

const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3VlZG9iaWlubnhjeHJtdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2MjcsImV4cCI6MjA5NDUyMDYyN30.uVS6GTada9hwazNs1RLpLPQ9rJHLXN4oeGqzhVsPtZI';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const fileName = `${userId}/pitch-deck.pdf`;
    const fileRes = await fetch(`${SB_URL}/storage/v1/object/pitch-decks/${fileName}`, {
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`
      }
    });

    if (!fileRes.ok) return res.status(404).json({ error: 'No pitch deck found' });

    const buffer = await fileRes.buffer();
    const data = await pdf(buffer);
    
    // Trim to first 3000 chars to keep prompt size manageable
    const text = data.text.trim().substring(0, 3000);
    
    res.status(200).json({ text });
  } catch (e) {
    console.error('PDF read error:', e);
    res.status(500).json({ error: 'Could not read pitch deck' });
  }
}
