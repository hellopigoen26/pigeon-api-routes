import { Resend } from 'resend';

function buildHtml(body, fromName, company, logo) {
  // Convert markdown bold to HTML and newlines to <br>
  const formatted = body
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#1A1916">$1</strong>')
    .replace(/\n/g, '<br>');

  const logoHtml = logo
    ? `<img src="${logo}" style="max-height:36px;max-width:120px;object-fit:contain;display:block;margin-bottom:4px">`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F6F1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F1;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Body -->
        <tr><td style="background:#FFFFFF;border-radius:16px;padding:40px;border:1px solid #e8e4dc">
          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0">${formatted}</p>

          <!-- Signature -->
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0EDE6">
            ${logoHtml}
            <p style="font-size:13.5px;color:#524F4A;margin:0;line-height:1.6">${fromName}<br>
            <span style="color:#A09C96">${company}</span></p>
          </div>
        </td></tr>

        <!-- Pigeon footer -->
        <tr><td style="padding:24px 0 8px;text-align:center">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto">
            <tr>
              <td style="padding-right:8px;vertical-align:middle">
                <img src="https://sendpigeon.uk/pigeon-icon.png" width="18" height="18" style="display:block;opacity:0.6" alt="Pigeon">
              </td>
              <td style="vertical-align:middle">
                <span style="font-size:12px;color:#A09C96">Sent with </span><a href="https://sendpigeon.uk" style="font-size:12px;color:#5B6E8F;text-decoration:none;font-weight:500">Pigeon</a><span style="font-size:12px;color:#A09C96"> &mdash; investor updates, written and delivered.</span>
              </td>
            </tr>
          </table>
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
  const { to, subject, body, fromName, company, logo } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const htmlBody = buildHtml(body, fromName, company, logo);
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
