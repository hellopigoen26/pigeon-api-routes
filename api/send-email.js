import { Resend } from 'resend';

function parseSection(body, heading) {
  const regex = new RegExp(`(?:^|\\n)${heading}[:\\s]*\\n([\\s\\S]*?)(?=\\n(?:Metrics|How you can help|Highlights|Lowlights|Focus for next month|Kind regards|Thanks|$))`, 'i');
  const match = body.match(regex);
  return match ? match[1].trim() : null;
}

function parseMetrics(metricsText) {
  if (!metricsText) return [];
  return metricsText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const parts = line.split(':');
      return parts.length >= 2
        ? { label: parts[0].trim(), value: parts.slice(1).join(':').trim() }
        : { label: line, value: '' };
    });
}

function parseGreetingAndIntro(body) {
  const lines = body.split('\n');
  let greeting = '';
  const introParts = [];
  let pastGreeting = false;
  for (const line of lines) {
    if (/^(Metrics|How you can help|Highlights|Lowlights|Focus for next month)/i.test(line.trim())) break;
    if (!pastGreeting && /^hi /i.test(line.trim())) {
      greeting = line.trim();
      pastGreeting = true;
    } else if (line.trim()) {
      introParts.push(line.trim());
    }
  }
  return { greeting, intro: introParts.join(' ') };
}

function parseSignoff(body) {
  const match = body.match(/(?:Kind regards|Thanks)[,\s]*\n+([\s\S]*?)$/i);
  if (!match) return null;
  const lines = match[1].trim().split('\n').map(l => l.trim()).filter(Boolean);
  return lines.length > 0 ? lines : null;
}

function metricRow(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0EDE6;font-size:14px;color:#524F4A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #F0EDE6;font-size:15px;font-weight:600;color:#1A1916;text-align:right;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${value}</td>
    </tr>`;
}

function sectionBlock(label, content) {
  const lines = content.split('\n').filter(l => l.trim());
  const html = lines.map(l => `<p style="margin:0 0 10px 0;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${l.trim()}</p>`).join('');
  return `
    <tr><td style="background:#FFFFFF;padding:24px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
      <p style="margin:0 0 10px 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888888;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${label}</p>
      ${html}
    </td></tr>`;
}

function buildHtml(body, fromName, company, logo, replyTo, updateId) {
  const { greeting, intro } = parseGreetingAndIntro(body);
  const metricsRaw = parseSection(body, 'Metrics');
  const ask = parseSection(body, 'How you can help');
  const highlights = parseSection(body, 'Highlights');
  const lowlights = parseSection(body, 'Lowlights');
  const focus = parseSection(body, 'Focus for next month');
  const signoff = parseSignoff(body);
  const metrics = parseMetrics(metricsRaw);

  const displayName = company || fromName;
  const logoUrl = logo && !logo.startsWith('data:') ? logo : null;

  const metricsBlock = metrics.length > 0 ? `
    <tr><td style="background:#FFFFFF;padding:24px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
      <p style="margin:0 0 12px 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888888;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Metrics</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${metrics.map(m => metricRow(m.label, m.value)).join('')}
      </table>
    </td></tr>` : '';

  const askBlock = ask ? sectionBlock('How you can help', ask) : '';
  const highlightsBlock = highlights ? sectionBlock('Highlights', highlights) : '';
  const lowlightsBlock = lowlights ? sectionBlock('Lowlights', lowlights) : '';
  const focusBlock = focus ? sectionBlock('Focus for next month', focus) : '';

  const signoffBlock = signoff ? `
    <tr><td style="background:#FFFFFF;padding:28px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
      <p style="margin:0;font-size:15px;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Kind regards,</p>
      ${signoff.map(l => `<p style="margin:6px 0 0;font-size:15px;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${l}</p>`).join('')}
    </td></tr>` : '';

  const replyButton = replyTo ? `
    <tr><td style="background:#FFFFFF;padding:28px 40px 8px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <a href="mailto:${replyTo}" style="display:inline-block;background:#1A1916;color:#ffffff;text-decoration:none;padding:11px 24px;border-radius:9px;font-size:13.5px;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">&#9993;&nbsp;&nbsp;Reply</a>
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
<body style="margin:0;padding:0;background:#F4F4F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F2;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr><td style="background:#FFFFFF;border-radius:16px 16px 0 0;padding:24px 40px;border:1px solid #e8e4dc;border-bottom:1px solid #F0EDE6">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:12px;color:#A09C96;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Investor update</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:600;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${displayName}</p>
              </td>
              ${logoUrl ? `<td align="right"><img src="${logoUrl}" width="40" height="40" alt="${displayName}" style="display:inline-block;border-radius:6px;object-fit:contain"></td>` : ''}
            </tr>
          </table>
        </td></tr>

        <!-- GREETING -->
        ${greeting ? `<tr><td style="background:#FFFFFF;padding:32px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <p style="margin:0;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${greeting}</p>
        </td></tr>` : ''}

        <!-- INTRO -->
        ${intro ? `<tr><td style="background:#FFFFFF;padding:16px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <p style="margin:0;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">${intro}</p>
        </td></tr>` : ''}

        <!-- METRICS -->
        ${metricsBlock}

        <!-- ASK -->
        ${askBlock}

        <!-- HIGHLIGHTS -->
        ${highlightsBlock}

        <!-- LOWLIGHTS -->
        ${lowlightsBlock}

        <!-- FOCUS -->
        ${focusBlock}

        <!-- SIGNOFF -->
        ${signoffBlock}

        <!-- REPLY BUTTON -->
        ${replyButton}

        <!-- FOOTER -->
        <tr><td style="background:#F4F4F2;border-radius:0 0 16px 16px;padding:20px 40px;border:1px solid #e8e4dc;border-top:none;text-align:center">
          <img src="https://sendpigeon.uk/pigeon-icon.png" width="20" height="20" alt="Pigeon" style="display:inline-block;margin-bottom:6px;opacity:0.5"><br>
          <span style="font-size:11px;color:#C0BBB5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Sent with <a href="https://sendpigeon.uk" style="font-size:11px;color:#A09C96;text-decoration:underline;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Pigeon</a></span>
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
  const { to, subject, body, fromName, company, logo, replyTo, updateId } = req.body;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const htmlBody = buildHtml(body, fromName, company, logo, replyTo, updateId);
  const { data, error } = await resend.emails.send({
    from: `${company || fromName} via Pigeon <updates@mail.sendpigeon.uk>`,
    to: to,
    subject: subject,
    html: htmlBody,
    text: body,
  });
  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
