// investor-sourcing-agent.js
// Pigeon Investor Sourcing Agent
// Deploys to: /api/investor-sourcing-agent on Vercel
// Trigger: Vercel cron job — every Sunday at 6am UTC
// Cron schedule: 0 6 * * 0
//
// Add to vercel.json crons:
// { "path": "/api/investor-sourcing-agent", "schedule": "0 6 * * 0" }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Sources to scrape
const SOURCES = [
  {
    name: 'British Business Bank',
    url: 'https://www.british-business-bank.co.uk/finance-hub/business-guidance/seeking-business-finance/equity-finance/find-an-investor/',
    description: 'UK government backed investor directory',
  },
  {
    name: 'OpenVC',
    url: 'https://openvc.app/investors?country=United+Kingdom',
    description: 'Open source VC directory filtered to UK',
  },
  {
    name: 'UKBAA',
    url: 'https://www.ukbaa.org.uk/find-an-angel-investor/',
    description: 'UK Business Angels Association member directory',
  },
];

const EXTRACT_SYSTEM_PROMPT = `You are a data extraction assistant. You will be given raw HTML or text content from an investor directory page. 

Extract all UK investors you can find and return them as a JSON array. Each investor should have:
- name (string) — investor full name
- fund (string) — fund or organisation name, empty string if unknown
- stage (string) — pre-seed, seed, Series A, Series B, or multiple if they invest across stages
- sector_tags (string) — comma separated sectors e.g. "fintech, SaaS, healthtech"
- region (string) — London, North, Midlands, Scotland, Wales, or UK-wide
- linkedin_url (string) — LinkedIn URL if found, empty string if not
- contact_url (string) — website or contact page URL if found, empty string if not

Only include investors who are based in or actively invest in the UK.
Return ONLY a valid JSON array, no other text, no markdown, no explanation.
If no investors can be extracted, return an empty array [].`;

async function fetchPageContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PigeonBot/1.0; +https://sendpigeon.uk)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Strip script/style tags and excessive whitespace to reduce tokens
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 15000); // limit to 15k chars to stay within token limits

    return cleaned;
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err.message);
    return null;
  }
}

async function extractInvestors(pageContent, sourceName) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: EXTRACT_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Extract UK investors from this ${sourceName} page content:\n\n${pageContent}`,
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    // Parse JSON response
    const cleaned = text.replace(/```json|```/g, '').trim();
    const investors = JSON.parse(cleaned);

    return Array.isArray(investors) ? investors : [];
  } catch (err) {
    console.error(`Failed to extract investors from ${sourceName}:`, err.message);
    return [];
  }
}

async function upsertInvestors(investors, source) {
  if (!investors.length) return { upserted: 0, errors: 0 };

  const rows = investors.map(inv => ({
    name: inv.name || '',
    fund: inv.fund || '',
    stage: inv.stage || '',
    sector_tags: inv.sector_tags || '',
    region: inv.region || 'UK-wide',
    linkedin_url: inv.linkedin_url || '',
    contact_url: inv.contact_url || '',
    source: source,
    updated_at: new Date().toISOString(),
  })).filter(row => row.name.length > 1); // filter out empty names

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/investors_directory`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(rows),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Supabase upsert error:`, error);
      return { upserted: 0, errors: rows.length };
    }

    return { upserted: rows.length, errors: 0 };
  } catch (err) {
    console.error(`Supabase upsert failed:`, err.message);
    return { upserted: 0, errors: investors.length };
  }
}

async function sendSummaryEmail(results) {
  const totalFound = results.reduce((s, r) => s + r.found, 0);
  const totalUpserted = results.reduce((s, r) => s + r.upserted, 0);

  const rowsHtml = results.map(r => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px;">${r.source}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: center;">${r.found}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: center;">${r.upserted}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: center; color: ${r.errors > 0 ? '#c0392b' : '#27ae60'};">${r.errors > 0 ? r.errors + ' errors' : '✓'}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1916; padding: 32px 24px;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F;">Pigeon Investor Sourcing Agent</span>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">Weekly investor sync complete.</h1>
      <p style="font-size: 15px; color: #5B6E8F; margin: 0 0 32px 0;">${totalUpserted} investors added or updated across ${results.length} sources.</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
        <tr>
          <th style="text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6E8F; padding-bottom: 8px; border-bottom: 1px solid #E8E4DC;">Source</th>
          <th style="text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6E8F; padding-bottom: 8px; border-bottom: 1px solid #E8E4DC;">Found</th>
          <th style="text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6E8F; padding-bottom: 8px; border-bottom: 1px solid #E8E4DC;">Saved</th>
          <th style="text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #5B6E8F; padding-bottom: 8px; border-bottom: 1px solid #E8E4DC;">Status</th>
        </tr>
        ${rowsHtml}
      </table>

      <div style="background: #F8F6F1; border-radius: 4px; padding: 20px 24px; margin-bottom: 32px;">
        <p style="margin: 0; font-size: 14px; color: #1A1916;">Total investors in directory: growing weekly. The CTO matching feature will use this data to suggest relevant investors to free plan founders.</p>
      </div>

      <p style="font-size: 13px; color: #5B6E8F; border-top: 1px solid #E8E4DC; padding-top: 16px; margin: 0;">
        Pigeon Investor Sourcing Agent · <a href="https://sendpigeon.uk" style="color: #5B6E8F;">sendpigeon.uk</a>
      </p>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Pigeon Agent <hello@mail.sendpigeon.uk>',
      to: 'hellosendpigeon@gmail.com',
      subject: `Investor directory updated — ${totalUpserted} investors synced`,
      html,
    }),
  });
}

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const results = [];

  for (const source of SOURCES) {
    console.log(`Processing ${source.name}...`);

    const pageContent = await fetchPageContent(source.url);

    if (!pageContent) {
      results.push({ source: source.name, found: 0, upserted: 0, errors: 1 });
      continue;
    }

    const investors = await extractInvestors(pageContent, source.name);
    console.log(`Found ${investors.length} investors from ${source.name}`);

    const { upserted, errors } = await upsertInvestors(investors, source.name);

    results.push({
      source: source.name,
      found: investors.length,
      upserted,
      errors,
    });
  }

  await sendSummaryEmail(results);

  return res.status(200).json({
    success: true,
    results,
    totalFound: results.reduce((s, r) => s + r.found, 0),
    totalUpserted: results.reduce((s, r) => s + r.upserted, 0),
  });
}
