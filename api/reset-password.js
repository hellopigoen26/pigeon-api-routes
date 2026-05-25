import { Resend } from 'resend';
import crypto from 'crypto';

const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3VlZG9iaWlubnhjeHJtdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2MjcsImV4cCI6MjA5NDUyMDYyN30.uVS6GTada9hwazNs1RLpLPQ9rJHLXN4oeGqzhVsPtZI';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const userRes = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,first_name`, {
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  });
  const users = await userRes.json();
  if (!users || !users.length) return res.status(200).json({ ok: true });

  const user = users[0];
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await fetch(`${SB_URL}/rest/v1/password_resets`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ user_id: user.id, token, expires_at: expires })
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetUrl = `https://sendpigeon.uk?reset=${token}`;

  await resend.emails.send({
    from: 'Pigeon <updates@mail.sendpigeon.uk>',
    to: email,
    subject: 'Reset your Pigeon password',
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F8F6F1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F1;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#FFFFFF;border-radius:16px;padding:40px;border:1px solid #e8e4dc">
          <img src="https://sendpigeon.uk/pigeon-icon.png" width="32" height="32" style="display:block;margin-bottom:24px" alt="Pigeon">
          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 16px">Hi ${user.first_name},</p>
          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 32px">Someone requested a password reset for your Pigeon account. Click the button below to set a new password. This link expires in one hour.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#5B6E8F;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:15px;font-weight:500">Reset my password</a>
          <p style="font-size:13px;color:#A09C96;margin-top:32px">If you didn't request this, you can ignore this email. Your password won't change.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  });

  res.status(200).json({ ok: true });
}
