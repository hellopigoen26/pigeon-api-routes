import { Resend } from 'resend';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { to, subject, body, fromName } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: `${fromName} via Pigeon <updates@mail.sendpigeon.uk>`,
    to: to,
    subject: subject,
    text: body,
  });
  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
