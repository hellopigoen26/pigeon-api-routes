import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, token, newPassword } = req.body;

  // ---- BRANCH 1: request a reset link ----
  if (email) {
    const userRes = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,first_name`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const users = await userRes.json();
    if (!users || !users.length) return res.status(200).json({ ok: true });

    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await fetch(`${SB_URL}/rest/v1/password_resets`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ user_id: user.id, token: resetToken, expires_at: expires, used: false })
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetUrl = `https://sendpigeon.uk?reset=${resetToken}`;
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

    return res.status(200).json({ ok: true });
  }

  // ---- BRANCH 2: complete a reset with token + new password ----
  if (token && newPassword) {
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const resetRes = await fetch(`${SB_URL}/rest/v1/password_resets?token=eq.${encodeURIComponent(token)}&select=*`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const resets = await resetRes.json();

    if (!resets || !resets.length) {
      return res.status(400).json({ error: 'This reset link is invalid.' });
    }

    const resetRecord = resets[0];

    if (resetRecord.used) {
      return res.status(400).json({ error: 'This reset link has already been used.' });
    }

    if (new Date(resetRecord.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ error: 'This reset link has expired. Please request a new one.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    const updateRes = await fetch(`${SB_URL}/rest/v1/users?id=eq.${resetRecord.user_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password_hash: newHash })
    });

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Could not update password. Please try again.' });
    }

    await fetch(`${SB_URL}/rest/v1/password_resets?token=eq.${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ used: true })
    });

    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: 'Email required' });
}
