// linkedin-agent.js
// Pigeon Content Agent — Blog + LinkedIn
// Deploys to: /api/linkedin-agent on Vercel
// Trigger: Vercel cron job — every Monday at 8am UK time
// Cron schedule: 0 8 * * 1

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

// Campaign start date — weeks 1 and 2 already done
// Week 3 starts 23 June 2026
const CAMPAIGN_START = new Date('2026-06-15');

const CAMPAIGN = [
  {
    week: 1,
    done: true,
    title: 'The fear of getting it wrong is why your investors aren\'t hearing from you',
  },
  {
    week: 2,
    done: true,
    title: 'The YC investor update framework explained',
  },
  {
    week: 3,
    phase: 'Foundation',
    title: 'What to include in a pre-seed investor update',
    keyword: 'pre-seed investor update what to include',
    blogUrl: 'sendpigeon.uk/blog/pre-seed-investor-update',
    blogAngle: 'Pre-seed founders think investor updates are for later. They are not. Their first investors took a bet before there was proof. Cover exactly what to include (and what to leave out) in a pre-seed update — metrics, highlight, lowlight, ask — and why starting now protects the next round.',
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
    keyword: 'how often send investor updates',
    blogUrl: 'sendpigeon.uk/blog/how-often-investor-updates',
    blogAngle: 'Everyone has an opinion — monthly, quarterly, after milestones. The honest answer: cadence matters less than consistency. The founders who raise faster are the ones whose investors always know what is happening. Cover what the data actually says and why consistency beats frequency.',
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
    keyword: 'AI investor update writer tool',
    blogUrl: 'sendpigeon.uk/blog/ai-investor-update-writer',
    blogAngle: 'Templates give you structure. You still have to write it. Pigeon is different — you fill in numbers and bullet points, Pigeon reads your deck, learns your voice, and writes the update. Cover why AI writing tools fail founders (generic output) vs what Pigeon actually does (learns voice, uses YC framework). This is the AI differentiation post nobody else is owning.',
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
    keyword: 'investor update generator founders',
    blogUrl: 'sendpigeon.uk/blog/investor-update-generator-vs-template',
    blogAngle: 'A template tells you what to write. A generator writes it for you. The difference sounds small — it is not. Cover the real gap: templates still require founders to find the words and hope it lands. A generator takes notes and does the work. Target founders already aware of templates who are looking for something better.',
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
    imageNote: null,
    specialNote: 'This is a partnership week, not a content week. Meeting with Ollie Chipp (Mill Capital / LBS). Partner page should be live at sendpigeon.uk/pigeon-partners.html. Leave quiz link as takeaway. No blog post or LinkedIn post this week — focus is on the meeting.',
  },
  {
    week: 8,
    phase: 'Differentiation',
    title: 'How to write an investor update in two minutes',
    keyword: 'investor update two minutes fast',
    blogUrl: 'sendpigeon.uk/blog/investor-update-two-minutes',
    blogAngle: 'Most founders think investor updates take hours. They do not have to. Cover the exact process — fill in four fields, approve, send — and why the founders who raise fastest have made it a habit. This is Pigeon\'s core two-minute promise. LinkedIn ads go live this week so the post should mirror the ad copy.',
    post: `Most founders think writing an investor update takes hours.

It does not have to.

Here is the exact process that gets founders from blank page to sent update in under two minutes — and why the founders who raise fastest have made it a habit.

[link: sendpigeon.uk/blog/investor-update-two-minutes]

Try it yourself free at sendpigeon.uk

sendpigeon.uk/investor-quiz`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorUpdates #AI',
    cta: 'sendpigeon.uk',
    imageNote: 'Blue-grey background. Large white text: Two minutes. Warm off-white subline: From founder notes to investor inboxes. Pigeon logo bottom.',
    specialNote: 'LinkedIn ads go live this week. First paid push pointing to quiz. Ad copy should mirror this post.',
  },
  {
    week: 9,
    phase: 'Authority',
    title: 'What investors actually want to see in your update',
    keyword: 'what investors want investor update',
    blogUrl: 'sendpigeon.uk/blog/what-investors-want',
    blogAngle: 'Founders overthink this. Investors want three things: how are the numbers, what went well, what did not — and a specific ask so they can help. Cover the investor perspective directly, what actually lands vs what founders think investors want to see. Authority-building post — investor voice adds credibility.',
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
    keyword: 'best investor update tools UK founders',
    blogUrl: 'sendpigeon.uk/blog/best-investor-update-tools-uk',
    blogAngle: 'Honest comparison of the main tools: Visible, Paperstreet, Foundersuite, and Pigeon. Cover what each does well and where each falls short. Pigeon wins on the writing angle — the others make you write it yourself. High intent post — targets founders already aware of competitors who are looking for the best option.',
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
    keyword: 'investor update mistakes founders',
    blogUrl: 'sendpigeon.uk/blog/investor-update-mistakes',
    blogAngle: 'Some mistakes are obvious — sending nothing, going dark. But the subtler ones cost more: burying the ask, leading with good news and hiding the bad, writing for an audience of one. Pull from Helen\'s personal experience as a founder and from talking to investors. Most authentic post of the series.',
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
    keyword: null,
    blogUrl: 'sendpigeon.uk',
    blogAngle: null,
    post: `The founders raising faster are the ones keeping investors close.

Pigeon has helped [X] founders send updates their investors actually read.

Free to start. No card needed.

sendpigeon.uk`,
    hashtags: '#StartupFounders #Fundraising #UKStartups #InvestorRelations #AI',
    cta: 'sendpigeon.uk',
    imageNote: 'Warm off-white background. Ink text: From founder notes to investor inboxes. In minutes. Pigeon logo centre. sendpigeon.uk bottom.',
    specialNote: 'Update the [X] figure with your real user count before publishing. Also: Jan McGinley outreach and WhatsApp broadcast to founder groups this week.',
  },
];

const BLOG_SYSTEM_PROMPT = `You write blog posts for Pigeon, an investor update service for founders at sendpigeon.uk.

Pigeon's voice: Direct, warm, slightly knowing. Like a founder friend who has been there.

Words never used: Easy, Beautiful, Powerful, Seamless, Streamlined, Engage, Stakeholders, Done-for-you, monthly, drafts, generates, writes (never position as AI writing tool).

Style guide — follow this exactly:
- 500-600 words
- Short punchy paragraphs, 1-3 sentences each
- No bullet points or numbered lists — everything in prose
- No fluff or filler phrases
- Start with a short punchy statement that names the problem
- Use subheadings (H2) to break the post into 3-4 sections
- End with a clear CTA to try Pigeon free at sendpigeon.uk
- Write in third person ("founders", "your investors") not "we"
- Optimise naturally for the target keyword — use it in the title, first paragraph, and once or twice in the body
- Do not mention AI writing unless the brief specifically asks for it

Return only the blog post content. No preamble, no explanation. Start with the title as an H1.`;

async function generateBlogPost(weekData) {
  const prompt = `Write a blog post for Pigeon with these details:

Title: ${weekData.title}
Target keyword: ${weekData.keyword}
Blog URL it will live at: ${weekData.blogUrl}
Angle and key points to cover: ${weekData.blogAngle}

The post should link to sendpigeon.uk/investor-quiz as the CTA.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: BLOG_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function blogToHtml(blogText) {
  return blogText
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('# ')) {
        return `<h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px 0; color: #1A1916;">${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 style="font-size: 17px; font-weight: 700; margin: 24px 0 8px 0; color: #1A1916;">${trimmed.slice(3)}</h2>`;
      }
      return `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.7; color: #1A1916;">${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('');
}

function getCurrentWeek() {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor((now - CAMPAIGN_START) / msPerWeek);
  const campaignWeek = weeksSinceStart + 3;
  return Math.min(Math.max(campaignWeek, 3), 12);
}

function buildEmailHtml(weekData, weekNumber, blogPost) {
  const isSpecialWeek = !weekData.post;

  if (isSpecialWeek) {
    return `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1A1916; padding: 32px 24px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F;">Pigeon Content Agent · Week ${weekNumber} of 12</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">${weekData.title}</h1>
        <p style="font-size: 14px; color: #5B6E8F; margin: 0 0 32px 0;">Phase: ${weekData.phase}</p>
        <div style="background: #F8F6F1; border-left: 3px solid #5B6E8F; padding: 20px 24px; margin-bottom: 32px; border-radius: 2px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6;">${weekData.specialNote}</p>
        </div>
        <p style="font-size: 13px; color: #5B6E8F; border-top: 1px solid #E8E4DC; padding-top: 16px; margin: 0;">
          Pigeon Content Agent · sendpigeon.uk
        </p>
      </div>
    `;
  }

  const postHtml = weekData.post
    .split('\n\n')
    .map(p => `<p style="margin: 0 0 14px 0; font-size: 15px; line-height: 1.7;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  const blogHtml = blogPost ? blogToHtml(blogPost) : '<p style="color:#5B6E8F;">Blog post unavailable this week.</p>';

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1A1916; padding: 32px 24px;">

      <div style="margin-bottom: 24px;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F;">Pigeon Content Agent · Week ${weekNumber} of 12</span>
      </div>

      <h1 style="font-size: 26px; font-weight: 700; margin: 0 0 4px 0;">This week's content is ready.</h1>
      <p style="font-size: 15px; color: #5B6E8F; margin: 0 0 32px 0;">Blog post + LinkedIn. Review, publish, done.</p>

      <!-- CHECKLIST -->
      <div style="margin-bottom: 40px;">
        <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #1A1916; margin: 0 0 12px 0;">This week's checklist</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px;">✍️ Publish blog post</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: right; color: #5B6E8F;">${weekData.blogUrl}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px;">📋 Post on LinkedIn</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E8E4DC; font-size: 14px; text-align: right; color: #5B6E8F;">linkedin.com/company/sendpigeonuk</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 14px;">🖼️ Create image</td>
            <td style="padding: 10px 0; font-size: 14px; text-align: right; color: #5B6E8F;">Brief below</td>
          </tr>
        </table>
      </div>

      <!-- BLOG POST -->
      <div style="margin-bottom: 40px;">
        <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 16px 0;">Blog post — copy into your site</p>
        <div style="background: #F8F6F1; border: 1px solid #E8E4DC; border-radius: 4px; padding: 28px;">
          ${blogHtml}
        </div>
      </div>

      <!-- LINKEDIN POST -->
      <div style="margin-bottom: 40px;">
        <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 16px 0;">LinkedIn post — copy everything below</p>
        <div style="background: #F8F6F1; border: 1px solid #E8E4DC; border-radius: 4px; padding: 28px;">
          ${postHtml}
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #5B6E8F;">${weekData.hashtags}</p>
        </div>
      </div>

      <!-- IMAGE BRIEF -->
      ${weekData.imageNote ? `
      <div style="margin-bottom: 40px;">
        <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 12px 0;">Image brief</p>
        <div style="background: #F8F6F1; border-radius: 4px; padding: 20px 24px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6;">${weekData.imageNote}</p>
        </div>
      </div>
      ` : ''}

      <!-- SPECIAL NOTE -->
      ${weekData.specialNote ? `
      <div style="border-left: 3px solid #5B6E8F; padding-left: 16px; margin-bottom: 40px;">
        <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #5B6E8F; margin: 0 0 8px 0;">Note for this week</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${weekData.specialNote}</p>
      </div>
      ` : ''}

      <p style="font-size: 13px; color: #5B6E8F; border-top: 1px solid #E8E4DC; padding-top: 16px; margin: 0;">
        Pigeon Content Agent · <a href="https://sendpigeon.uk" style="color: #5B6E8F;">sendpigeon.uk</a>
      </p>

    </div>
  `;
}

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    const weekNumber = getCurrentWeek();

    if (weekNumber > 12) {
      return res.status(200).json({ message: '12-week campaign complete. No content to send.' });
    }

    const weekData = CAMPAIGN[weekNumber - 1];

    // Generate blog post via Anthropic (skip for special weeks and week 12)
    let blogPost = null;
    if (weekData.blogAngle) {
      blogPost = await generateBlogPost(weekData);
    }

    const emailHtml = buildEmailHtml(weekData, weekNumber, blogPost);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pigeon Agent <hello@mail.sendpigeon.uk>',
        to: 'hellosendpigeon@gmail.com',
        subject: `Week ${weekNumber} content ready — ${weekData.title}`,
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
      blogGenerated: !!blogPost,
    });

  } catch (err) {
    console.error('Content agent error:', err);
    return res.status(500).json({ error: err.message });
  }
}
