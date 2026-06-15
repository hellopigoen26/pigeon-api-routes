import { Resend } from 'resend';

function buildWelcomeHtml(firstName) {
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
                <p style="margin:0;font-size:12px;color:#A09C96;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Welcome to</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:600;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Pigeon</p>
              </td>
              <td align="right">
                <img src="https://sendpigeon.uk/pigeon-icon.png" width="36" height="36" alt="Pigeon" style="display:inline-block">
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- INTRO -->
        <tr><td style="background:#FFFFFF;padding:32px 40px 0;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Hi ${firstName},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">The founders raising faster are the ones their investors never stop hearing from. You&rsquo;re now one of them.</p>
          <p style="margin:0 0 20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#888888;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Get started</p>
        </td></tr>

        <!-- STEPS -->
        <tr><td style="background:#FFFFFF;padding:0 40px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="32" style="vertical-align:top;padding-top:2px">
                <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">1</div>
              </td>
              <td style="padding-left:12px;padding-bottom:20px;border-bottom:1px solid #F0EDE6">
                <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Upload your pitch deck</p>
                <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Pigeon reads it every time you generate an update and uses it to write in your voice. Find it in the Pitch deck section. 30 seconds, makes a real difference.</p>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
            <tr>
              <td width="32" style="vertical-align:top;padding-top:2px">
                <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">2</div>
              </td>
              <td style="padding-left:12px;padding-bottom:20px;border-bottom:1px solid #F0EDE6">
                <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Add your investors</p>
                <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Go to Investors and add anyone you want to keep in the loop. First name and email is all Pigeon needs.</p>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
            <tr>
              <td width="32" style="vertical-align:top;padding-top:2px">
                <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">3</div>
              </td>
              <td style="padding-left:12px">
                <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Set your reminder day</p>
                <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Go to Account and pick the day you want Pigeon to nudge you. That way you never go quiet without meaning to.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#FFFFFF;padding:28px 40px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <p style="margin:0 0 8px;font-size:15px;line-height:1.8;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Done? Head to New update. Your investors are waiting to hear from you.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#524F4A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">And as you grow, we will suggest investors matched to your stage and occasionally make introductions where we can.</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td>
              <a href="https://sendpigeon.uk" style="display:inline-block;background:#5B6E8F;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9px;font-size:14px;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Set up my account &rarr;</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- SIGNOFF -->
        <tr><td style="background:#FFFFFF;padding:0 40px 32px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">
          <p style="margin:0 0 12px;font-size:15px;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Kind regards,</p>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:12px;vertical-align:middle">
                <img src="https://sendpigeon.uk/helen.jpg" width="44" height="44" style="border-radius:50%;display:block;object-fit:cover" alt="Helen">
              </td>
              <td style="vertical-align:middle">
                <p style="margin:0;font-size:15px;font-weight:600;color:#1A1916;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Helen Mason</p>
                <p style="margin:2px 0 0;font-size:13px;color:#524F4A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Founder, Pigeon</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#F4F4F2;border-radius:0 0 16px 16px;padding:20px 40px;border:1px solid #e8e4dc;border-top:none;text-align:center">
          <img src="https://sendpigeon.uk/pigeon-icon.png" width="20" height="20" alt="Pigeon" style="display:inline-block;margin-bottom:6px;opacity:0.5"><br>
          <span style="font-size:11px;color:#C0BBB5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Sent with <a href="https://sendpigeon.uk" style="font-size:11px;color:#A09C96;text-decoration:underline;font-weight:500;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">Pigeon</a></span>
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

  const { email, firstName } = req.body;
  if (!email || !firstName) return res.status(400).json({ error: 'Email and firstName required' });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'Helen at Pigeon <updates@mail.sendpigeon.uk>',
    to: email,
    subject: `Welcome to Pigeon, ${firstName}`,
    html: buildWelcomeHtml(firstName),
  });

  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
