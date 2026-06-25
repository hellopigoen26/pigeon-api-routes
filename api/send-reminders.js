const { Resend } = require('resend');
const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const today = new Date();
  const dayOfMonth = today.getDate();
  const usersRes = await fetch(
    `${SB_URL}/rest/v1/users?reminder_day=eq.${dayOfMonth}&onboarded=eq.true&select=id,first_name,email,company`,
    { headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` } }
  );
  const users = await usersRes.json();
  if (!users || !Array.isArray(users) || users.length === 0) {
    return res.status(200).json({ sent: 0, message: 'No reminders to send today' });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  let failed = 0;
  for (const user of users) {
    const firstName = user.first_name || 'there';
    const company = user.company || 'your company';
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#F8F6F1;font-family:Helvetica Neue,Helvetica,Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F1;padding:40px 20px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%"><tr><td style="background:#FFFFFF;border-radius:16px;padding:40px;border:1px solid #e8e4dc"><img src="https://sendpigeon.uk/pigeon-icon.png" width="32" height="32" style="display:block;margin-bottom:24px" alt="Pigeon"><p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 16px">Hi ' + firstName + ',</p><p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 24px">The founders closing rounds fastest send consistent updates. You\'re two minutes away from staying in that group.</p><p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 32px">Drop in your numbers and a few notes. Pigeon takes care of the rest.</p><a href="https://sendpigeon.uk" style="display:inline-block;background:#5B6E8F;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-size:15px;font-weight:500">Send this Pigeon &rarr;</a><p style="font-size:15px;line-height:1.8;color:#1A1916;margin:32px 0 4px">Good luck this month,</p><p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 32px"><strong>The Pigeon team</strong></p><hr style="border:none;border-top:1px solid #eceae4;margin:0 0 20px"><p style="font-size:12px;color:#A09C96;margin:0 0 8px">You\'re receiving this because you set up a reminder in Pigeon for ' + company + '.</p><p style="font-size:12px;color:#A09C96;margin:0">To change your reminder day, log in to <a href="https://sendpigeon.uk" style="color:#5B6E8F;text-decoration:none">sendpigeon.uk</a> and go to Account settings.</p></td></tr></table></td></tr></table></body></html>';
    try {
