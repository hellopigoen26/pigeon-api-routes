import Stripe from 'stripe';

const PRICE_IDS = {
  starter: 'price_1TaydhE0kKNqBE4hkLXwMfAl',
  growth: 'price_1TayecE0kKNqBE4h8XRG8r5T'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, email, userId } = req.body;
  if (!plan || !email || !userId) return res.status(400).json({ error: 'Missing required fields' });

  const priceId = PRICE_IDS[plan];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId, plan }
    },
    metadata: { userId, plan },
    success_url: 'https://sendpigeon.uk?payment=success&plan=' + plan,
    cancel_url: 'https://sendpigeon.uk?payment=cancelled',
  });

  res.status(200).json({ url: session.url });
}
