// API endpoint to retrieve the stored text.
// Returns the text if it's less than 30 minutes old.

import {
  KEY,
  TTL_SECONDS,
  upstashConfigured,
  notConfiguredResponse,
  redisCommand,
} from './_upstash.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!upstashConfigured()) {
    return notConfiguredResponse(res);
  }

  try {
    const raw = await redisCommand(`/get/${KEY}`);

    if (raw == null) {
      return res.status(200).json({ text: '', exists: false });
    }

    const data = JSON.parse(raw);
    const ageSeconds = Math.floor((Date.now() - data.timestamp) / 1000);
    const expiresIn = TTL_SECONDS - ageSeconds;

    if (expiresIn <= 0) {
      return res.status(200).json({ text: '', exists: false });
    }

    return res.status(200).json({
      text: data.text || '',
      timestamp: data.timestamp,
      expiresIn,
    });
  } catch (error) {
    console.error('Error retrieving text:', error);
    return res.status(500).json({ error: 'Failed to retrieve text' });
  }
}
