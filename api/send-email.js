import { Resend } from 'resend';

function buildHtml(body, fromName, replyTo, updateId) {
  const formatted = body
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1A1916">$1</strong>')
    .replace(/\n/g, '<br>');

  const replyButton = replyTo ? `
        <tr><td style="padding:24px 40px 8px">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a href="mailto:${replyTo}" style="display:inline-block;background:#5B6E8F;color:#ffffff;text-decoration:none;padding:11px 24px;border-radius:9px;font-size:13.5px;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">&#9993;&nbsp;&nbsp;Reply to ${fromName.split(' ')[0]}</a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:6px">
                <span style="font-size:11.5px;color:#A09C96;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Replies go directly to ${replyTo}</span>
              </td>
            </tr>
          </table>
        </td></tr>` : '';

  const trackingPixel = updateId
    ? `<img src="https://pigeon-api-routes.vercel.app/api/track?id=${updateId}" width="1" height="1" style="display:block;width:1px;height:1px;border:0" alt="">`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F6F1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F1;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#FFFFFF;border-radius:16px 16px 0 0;padding:40px 40px 32px;border:1px solid #e8e4dc;border-bottom:none">
          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0">${formatted}</p>
          <div style="margin-top:32px;border-top:1px solid #F0EDE6"></div>
        </td></tr>
        ${replyButton}
        <tr><td style="background:#FFFFFF;border-radius:0 0 16px 16px;padding:20px 40px 28px;border:1px solid #e8e4dc;border-top:none">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto">
            <tr>
              <td style="vertical-align:middle">
                <span style="font-size:12px;color:#A09C96">Sent with </span><a href="https://sendpigeon.uk" style="font-size:12px;color:#5B6E8F;text-decoration:none;font-weight:500">Pigeon</a><span style="font-size:12px;color:#A09C96"> &mdash; investor updates, written and delivered.</span>
              </td>
            </tr>
          </table>
          ${trackingPixel}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { to, subject, body, fromName, replyTo, updateId } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const htmlBody = buildHtml(body, fromName, replyTo, updateId);
  const { data, error } = await resend.emails.send({
    from: `${fromName} via Pigeon <updates@mail.sendpigeon.uk>`,
    to: to,
    subject: subject,
    html: htmlBody,
    text: body,
  });
  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
