import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPABASE_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;
  try {
    event = resend.webhooks.verify({
      payload: JSON.stringify(req.body),
      headers: {
        id: req.headers['svix-id'],
        timestamp: req.headers['svix-timestamp'],
        signature: req.headers['svix-signature'],
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
    });
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return res.status(401).json({ error: 'Invalid signature' });
  }

  if (event.type !== 'email.received') {
    return res.status(200).json({ ignored: true });
  }

  const emailId = event.data.email_id;
  const fromAddress = event.data.from;
  const toAddresses = event.data.to || event.data.received_for || [];

  let fullEmail;
  try {
    const { data, error } = await resend.emails.receiving.get(emailId);
    if (error) throw error;
    fullEmail = data;
  } catch (err) {
    console.error('Failed to fetch email content from Resend', err);
    return res.status(500).json({ error: 'Could not fetch email content' });
  }

  const toAddress = toAddresses[0] || '';
  const match = toAddress.match(/^u-([a-f0-9-]+)@/i);
  const updateId = match ? match[1] : null;

  if (!updateId) {
    console.warn('Could not extract updateId from reply address', toAddress);
    return res.status(200).json({ warning: 'No update id found in to address' });
  }

  const cleanedText = stripQuotedReply(fullEmail.text || '');

  try {
    const update = await fetchUpdate(updateId);
    if (!update)
