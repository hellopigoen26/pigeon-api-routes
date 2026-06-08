import { Resend } from 'resend';

const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3VlZG9iaWlubnhjeHJtdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2MjcsImV4cCI6MjA5NDUyMDYyN30.uVS6GTada9hwazNs1RLpLPQ9rJHLXN4oeGqzhVsPtZI';

async function getHelenPhoto() {
  try {
    const res = await fetch(`${SB_URL}/storage/v1/object/public/pitch-decks/helen.jpg`, {
      headers: { 'apikey': SB_KEY }
    });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    return null;
  }
}

function buildWelcomeHtml(firstName, helenPhoto) {
  const helenSrc = helenPhoto || 'https://sendpigeon.uk/helen.jpg';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F6F1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F1;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#5B6E8F;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center">
          <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-.02em">Pigeon</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#FFFFFF;padding:40px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc">

          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 20px">Hi ${firstName},</p>

          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 28px">The founders raising faster are the ones their investors never stop hearing from. You&rsquo;re now one of them. Welcome to Pigeon.</p>

          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 24px">Get these three things done and you&rsquo;re ready to fly:</p>

          <!-- Three steps -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr><td style="background:#F8F6F1;border-radius:12px;padding:24px">

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px">
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px">
                    <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff">1</div>
                  </td>
                  <td style="padding-left:12px">
                    <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 3px">Upload your pitch deck</p>
                    <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0">Pigeon reads it every time you generate an update and uses it to write in your voice. Find it in the Pitch deck section. 30 seconds, makes a real difference.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px">
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px">
                    <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff">2</div>
                  </td>
                  <td style="padding-left:12px">
                    <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 3px">Add your investors</p>
                    <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0">Go to Investors and add anyone you want to keep in the loop. First name and email is all Pigeon needs.</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="32" style="vertical-align:top;padding-top:2px">
                    <div style="width:24px;height:24px;background:#5B6E8F;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:600;color:#fff">3</div>
                  </td>
                  <td style="padding-left:12px">
                    <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0 0 3px">Set your reminder day</p>
                    <p style="font-size:13px;color:#524F4A;line-height:1.6;margin:0">Go to Account and pick the day you want Pigeon to nudge you. That way you never go quiet without meaning to.</p>
                  </td>
                </tr>
              </table>

            </td></tr>
          </table>

          <!-- Closing line -->
          <p style="font-size:15px;line-height:1.8;color:#1A1916;margin:0 0 28px">Done? Head to New update. Your investors are waiting to hear from you.</p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
            <tr><td align="center">
              <a href="https://sendpigeon.uk" style="display:inline-block;background:#5B6E8F;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:500">Set up my account &rarr;</a>
            </td></tr>
          </table>

          <!-- Signature -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:14px;vertical-align:middle">
                <img src="${helenSrc}" width="52" height="52" style="border-radius:50%;display:block;object-fit:cover" alt="Helen">
              </td>
              <td style="vertical-align:middle">
                <p style="font-size:14px;font-weight:600;color:#1A1916;margin:0">Helen</p>
                <p style="font-size:13px;color:#A09C96;margin:2px 0 0">Founder, Pigeon</p>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FFFFFF;border-radius:0 0 16px 16px;padding:20px 40px 28px;border:1px solid #e8e4dc;border-top:1px solid #F0EDE6;text-align:center">
          <span style="font-size:12px;color:#A09C96">Sent with </span><a href="https://sendpigeon.uk" style="font-size:12px;color:#5B6E8F;text-decoration:none;font-weight:500">Pigeon</a><span style="font-size:12px;color:#A09C96"> &mdash; investor updates, written and delivered.</span>
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

  const helenPhoto = await getHelenPhoto();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'Helen at Pigeon <updates@mail.sendpigeon.uk>',
    to: email,
    subject: `Welcome to Pigeon, ${firstName}`,
    html: buildWelcomeHtml(firstName, helenPhoto),
  });

  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
