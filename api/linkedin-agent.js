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
