// linkedin-agent.js
// Pigeon LinkedIn Agent
// Deploys to: /api/linkedin-agent on Vercel
// Trigger: Vercel cron job — every Monday at 8am UK time
// Cron schedule: 0 8 * * 1
//
// Add to vercel.json:
// {
//   "crons": [
//     { "path": "/api/linkedin-agent", "schedule": "0 8 * * 1" }
//   ]
// }

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

// Campaign start date — weeks 1 and 2 already done
// Agent starts delivering from week 3
const CAMPAIGN_START = new Date('2026-06-22'); // Monday of week 3

// Full 12-week campaign content
// Weeks 1-2 included for completeness but agent starts at week 3
const CAMPAIGN = [
  {
    week: 1,
    done: true,
    title: 'The fear of getting it wrong is why your investors aren\'t hearing from you',
    post: null, // already published
  },
  {
    week: 2,
    done: true,
    title: 'The YC investor update framework explained',
    post: null, // already published
  },
  {
    week: 3,
    phase: 'Foundation',
    title: 'What to include in a pre-seed investor update',
    blogUrl: 'sendpigeon.uk/blog/pre-seed-investor-update',
    post: `Pre-seed founders often think investor updates are for later.

They are not.

Your first investors took a bet on you before you had proof. They deserve to know how it is going. And they are the most likely people to back your next round.

Here is exactly what to include in a pre-seed investor update — and what to leave out.

[link: sendpigeon.uk/blog/pre-seed-investor-update]

Not sure how your investor communication stacks up? Take our 60-second quiz.

sendpigeon.uk/investor-quiz`,
    hashtags: '#PreSeed #StartupFounders #Fundraising #UKStartups #InvestorRelations',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Ink headline: What goes in a pre-seed investor update? Blue-grey subline: Less than you think. Pigeon logo bottom.',
  },
  {
    week: 4,
    phase: 'Foundation',
    title: 'How often should founders send investor updates?',
    blogUrl: 'sendpigeon.uk/blog/how-often-investor-updates',
    post: `Everyone has an opinion on how often you should send investor updates.

Monthly. Quarterly. After every milestone. Only when you have good news.

Here is the honest answer: the cadence matters less than the consistency.

The founders who raise faster are not necessarily the ones sending the most updates. They are the ones whose investors always know what is happening.

We wrote about what actually works — and what the data says.

[link: sendpigeon.uk/blog/how-often-investor-updates]

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #InvestorRelations #UKStartups',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Blue-grey background. Large white text: Consistency beats cadence. Warm off-white subline: What the data actually says. Pigeon logo bottom.',
  },
  {
    week: 5,
    phase: 'Differentiation',
    title: 'How AI writes your investor update for you',
    blogUrl: 'sendpigeon.uk/blog/ai-investor-update-writer',
    post: `Templates give you a structure. You still have to write it yourself.

Pigeon is different.

You fill in your numbers and bullet points. Pigeon reads your pitch deck, learns your voice, and writes a proper investor update for you — built on the YC framework. Approve and send to your whole investor list in one click.

This is not a template. This is the update, written.

From founder notes to investor inboxes. In minutes.

sendpigeon.uk/investor-quiz`,
    hashtags: '#AI #StartupFounders #Fundraising #UKStartups #InvestorUpdates',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Two columns. Left: Template (sad face). Right: Pigeon (happy face). Simple illustration style. Pigeon logo bottom.',
  },
  {
    week: 6,
    phase: 'Differentiation',
    title: 'Investor update generator vs template — what\'s the difference?',
    blogUrl: 'sendpigeon.uk/blog/investor-update-generator-vs-template',
    post: `An investor update template tells you what to write.

An investor update generator writes it for you.

The difference sounds small. It is not.

A template still requires you to sit down, find the words, and hope it lands right. A generator takes your notes and does the work.

We wrote about the difference — and why it matters for founders who are raising.

[link: sendpigeon.uk/blog/investor-update-generator-vs-template]

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #AI #UKStartups #InvestorRelations',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Ink text: Template = still your problem. Blue-grey text: Generator = done. Pigeon logo bottom.',
  },
  {
    week: 7,
    phase: 'Differentiation',
    title: 'Partnership week — Ollie Chipp / LBS',
    blogUrl: null,
    post: null,
    hashtags: null,
    cta: null,
    imageNote: null,
    specialNote: 'This is a partnership week, not a content week. Meeting with Ollie Chipp (Mill Capital / LBS). Partner page should be live at sendpigeon.uk/pigeon-partners.html. Leave quiz link as takeaway. No LinkedIn post this week — focus is on the meeting.',
  },
  {
    week: 8,
    phase: 'Differentiation',
    title: 'How to write an investor update in two minutes',
    blogUrl: 'sendpigeon.uk/blog/investor-update-two-minutes',
    post: `Most founders think writing an investor update takes hours.

It does not have to.

Here is the exact process that gets founders from blank page to sent update in under two minutes — and why the founders who raise fastest have made it a habit.

[link: sendpigeon.uk/blog/investor-update-two-minutes]

Try it yourself free at sendpigeon.uk

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorUpdates #AI',
    cta: 'sendpigeon.uk',
    imageNote: 'Blue-grey background. Large white text: Two minutes. Warm off-white subline: From founder notes to investor inboxes. Pigeon logo bottom.',
    specialNote: 'LinkedIn ads go live this week. First paid push pointing to quiz.',
  },
  {
    week: 9,
    phase: 'Authority',
    title: 'What investors actually want to see in your update',
    blogUrl: 'sendpigeon.uk/blog/what-investors-want',
    post: `Founders spend a lot of time worrying about what to include in an investor update.

The honest answer is simpler than you think.

Investors want to know three things. How are the numbers. What went well. What did not. And they want a specific ask so they can actually help you.

That is it. We spoke to investors and founders and wrote up exactly what lands and what does not.

[link: sendpigeon.uk/blog/what-investors-want]

sendpigeon.uk/investor-quiz`,
    hashtags: '#Investors #StartupFounders #Fundraising #UKStartups #InvestorRelations',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Ink text: What investors actually want. Three blue-grey bullet lines below: Numbers. Honesty. An ask. Pigeon logo bottom.',
  },
  {
    week: 10,
    phase: 'Authority',
    title: 'Best investor update tools for UK founders 2026',
    blogUrl: 'sendpigeon.uk/blog/best-investor-update-tools-uk',
    post: `There are a handful of tools that claim to help founders send better investor updates.

We looked at all of them — what they do well and where they fall short.

Visible. Paperstreet. Foundersuite. And Pigeon.

The honest comparison founders actually need.

[link: sendpigeon.uk/blog/best-investor-update-tools-uk]

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorUpdates #SaaS',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Comparison grid. Four tools listed. Pigeon column highlighted in blue-grey. Pigeon logo bottom.',
  },
  {
    week: 11,
    phase: 'Authority',
    title: 'Investor update mistakes that cost founders their round',
    blogUrl: 'sendpigeon.uk/blog/investor-update-mistakes',
    post: `Some investor update mistakes are obvious. Sending nothing. Going dark for months.

But some are subtler. Burying the ask. Leading with good news and hiding the bad. Writing for an audience of one.

We pulled together the mistakes that actually cost founders their rounds — from Helen's own experience and from talking to investors.

[link: sendpigeon.uk/blog/investor-update-mistakes]

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorRelations',
    cta: 'sendpigeon.uk/investor-quiz',
    imageNote: 'Warm off-white background. Ink headline: The mistakes that cost founders their round. Blue-grey subline: Are you making them? Pigeon logo bottom.',
  },
  {
    week: 12,
    phase: 'Authority',
    title: 'Final post — celebrate the journey',
    blogUrl: 'sendpigeon.uk',
    post: `The founders raising faster are the ones keeping investors close.

Pigeon has helped [X] founders send updates their investors actually read.

Free to start. No card needed.

sendpigeon.uk`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorRelations #AI',
    cta: 'sendpigeon.uk',
    imageNote: 'Warm off-white background. Ink text: From founder notes to investor inboxes. In minutes. Pigeon logo centre. sendpigeon.uk bottom.',
    specialNote: 'Update the [X] figure with real user count before publishing. Also: Jan McGinley outreach and WhatsApp broadcast this week.',
  },
];

function getCurrentWeek() {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor((now - CAMPAIGN_START) / msPerWeek);
  // Campaign starts at week 3 (index 2)
  const campaignWeek = weeksSinceStart + 3;
  return Math.min(Math.max(campaignWeek, 3), 12);
}

function buildEmailHtml(weekData, weekNumber) {
  const isSpecialWeek = !weekData.post;

  if (isSpecialWeek) {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1916; padding: 32px 24px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F;">Pigeon LinkedIn Agent</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">Week ${weekNumber} — ${weekData.title}</h1>
        <p style="font-size: 14px; color: #5B6E8F; margin: 0 0 32px 0;">Phase: ${weekData.phase}</p>
        <div style="background: #F8F6F1; border-left: 3px solid #5B6E8F; padding: 20px 24px; margin-bottom: 32px; border-radius: 2px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6;">${weekData.specialNote}</p>
        </div>
        <p style="font-size: 13px; color: #5B6E8F; border-top: 1px solid #E8E4DC; padding-top: 16px; margin: 0;">
          Pigeon LinkedIn Agent · sendpigeon.uk
        </p>
      </div>
    `;
  }

  const postHtml = weekData.post
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.7;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1916; padding: 32px 24px;">
      
      <div style="margin-bottom: 24px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F;">Pigeon LinkedIn Agent · Week ${weekNumber} of 12</span>
      </div>

      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">Your LinkedIn post is ready.</h1>
      <p style="font-size: 15px; color: #5B6E8F; margin: 0 0 32px 0;">Copy, paste, publish. You're done.</p>

      <div style="background: #F8F6F1; border: 1px solid #E8E4DC; border-radius: 4px; padding: 28px; margin-bottom: 32px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 16px 0;">LinkedIn post — copy everything below</p>
        <div style="border-top: 1px solid #E8E4DC; padding-top: 16px;">
          ${postHtml}
          <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #5B6E8F;">${weekData.hashtags}</p>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #1A1916; margin: 0 0 12px 0;">This week's checklist</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px;">📋 Post copied to LinkedIn</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: right; color: #5B6E8F;">linkedin.com/company/sendpigeonuk</td>
          </tr>
          ${weekData.blogUrl ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px;">✍️ Blog post live</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: right; color: #5B6E8F;">${weekData.blogUrl}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px 0; font-size: 14px;">🖼️ Image created</td>
            <td style="padding: 10px 0; font-size: 14px; text-align: right; color: #5B6E8F;">See brief below</td>
          </tr>
        </table>
      </div>

      ${weekData.imageNote ? `
      <div style="background: #F8F6F1; border-radius: 4px; padding: 20px 24px; margin-bottom: 32px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 8px 0;">Image brief</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1A1916;">${weekData.imageNote}</p>
      </div>
      ` : ''}

      ${weekData.specialNote ? `
      <div style="border-left: 3px solid #5B6E8F; padding-left: 16px; margin-bottom: 32px;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 8px 0;">Note for this week</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${weekData.specialNote}</p>
      </div>
      ` : ''}

      <p style="font-size: 13px; color: #5B6E8F; border-top: 1px solid #E8E4DC; padding-top: 16px; margin: 0;">
        Pigeon LinkedIn Agent · <a href="https://sendpigeon.uk" style="color: #5B6E8F;">sendpigeon.uk</a>
      </p>

    </div>
  `;
}

export default async function handler(req, res) {
  // Security check — only allow cron or manual trigger with secret
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const weekNumber = getCurrentWeek();

    // Campaign finished
    if (weekNumber > 12) {
      return res.status(200).json({ message: '12-week campaign complete. No post to send.' });
    }

    const weekData = CAMPAIGN[weekNumber - 1];

    const emailHtml = buildEmailHtml(weekData, weekNumber);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pigeon Agent <hello@mail.sendpigeon.uk>',
        to: 'hellosendpigeon@gmail.com',
        subject: `Week ${weekNumber} LinkedIn post ready — ${weekData.title}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend error: ${error}`);
    }

    return res.status(200).json({
      success: true,
      week: weekNumber,
      title: weekData.title,
    });

  } catch (err) {
    console.error('LinkedIn agent error:', err);
    return res.status(500).json({ error: err.message });
  }
}
