const bcrypt = require('bcryptjs');

const SB_URL = 'https://vpguedobiinnxcxrmugq.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ3VlZG9iaWlubnhjeHJtdWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDQ2MjcsImV4cCI6MjA5NDUyMDYyN30.uVS6GTada9hwazNs1RLpLPQ9rJHLXN4oeGqzhVsPtZI';

const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts[ip];
  if (!entry) return { blocked: false };
  if (entry.lockedUntil && now < entry.lockedUntil) {
    const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
    return { blocked: true, minutesLeft };
  }
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    delete loginAttempts[ip];
  }
  return { blocked: false };
}

function recordFailure(ip) {
  const now = Date.now();
  if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0 };
  loginAttempts[ip].count += 1;
  if (loginAttempts[ip].count >= MAX_ATTEMPTS) {
    loginAttempts[ip].lockedUntil = now + LOCKOUT_MS;
  }
}

function clearFailures(ip) {
  delete loginAttempts[ip];
}

async function sbGet(table, col, val) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${col}=eq.${encodeURIComponent(val)}&select=*`, {
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  });
  return res.json();
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.ok;
}

async function sbInsert(table, data) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) return { error: json };
  return Array.isArray(json) ? json[0] : json;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, password, firstName, lastName, company } = req.body;

  if (action === 'login') {
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const ip = getIp(req);
    const { blocked, minutesLeft } = checkRateLimit(ip);
    if (blocked) {
      return res.status(429).json({
        error: `Too many failed attempts. Please try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`
      });
    }

    const users = await sbGet('users', 'email', email);
    if (!users || users.error || !users.length) {
      recordFailure(ip);
      return res.status(401).json({ error: 'No account found. Sign up instead?' });
    }

    const user = users[0];
    let valid = false;
    const isBcrypt = user.password_hash && user.password_hash.startsWith('$2');

    if (isBcrypt) {
      valid = await bcrypt.compare(password, user.password_hash);
    } else {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'pigeon_s2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      valid = sha256Hash === user.password_hash;
      if (valid) {
        const newHash = await bcrypt.hash(password, 10);
        await sbUpdate('users', user.id, { password_hash: newHash });
      }
    }

    if (!valid) {
      recordFailure(ip);
      const remaining = MAX_ATTEMPTS - (loginAttempts[ip]?.count || 0);
      const warningMsg = remaining <= 2 && remaining > 0
        ? ` ${remaining} attempt${remaining === 1 ? '' : 's'} left before your account is temporarily locked.`
        : '';
      return res.status(401).json({ error: `Incorrect password. Please try again.${warningMsg}` });
    }

    clearFailures(ip);
    delete user.password_hash;
    return res.status(200).json({ user });
  }

  if (action === 'signup') {
    if (!email || !password || !firstName || !lastName) return res.status(400).json({ error: 'All fields required' });
    const existing = await sbGet('users', 'email', email);
    if (existing && existing.length) return res.status(409).json({ error: 'Account already exists. Log in instead?' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await sbInsert('users', {
      first_name: firstName, last_name: lastName, email,
      password_hash: passwordHash, company: company || null,
      plan: 'free', onboarded: false, tone: 'confident', reminder_day: 1
    });
    if (newUser.error) return res.status(400).json({ error: newUser.error.message || 'Could not create account' });
    delete newUser.password_hash;
    return res.status(200).json({ user: newUser });
  }

  return res.status(400).json({ error: 'Invalid action' });
};
