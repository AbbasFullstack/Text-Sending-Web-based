// API endpoint to store text.
// Saves the text with a 30-minute expiry in Upstash Redis.

import {
  KEY,
  TTL_SECONDS,
  MAX_TEXT_LENGTH,
  upstashConfigured,
  notConfiguredResponse,
  redisCommand,
} from './_upstash.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!upstashConfigured()) {
    return notConfiguredResponse(res);
  }

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: 'Text is too long (max 100,000 characters)',
      });
    }

    const payload = JSON.stringify({ text, timestamp: Date.now() });

    // EX makes Redis delete the key automatically after the TTL,
    // so the text disappears even if nobody visits the site again.
    await redisCommand(`/set/${KEY}?EX=${TTL_SECONDS}`, {
      method: 'POST',
      body: payload,
    });

    return res.status(200).json({
      success: true,
      message: 'Text saved successfully!',
      expiresIn: TTL_SECONDS,
    });
  } catch (error) {
    console.error('Error saving text:', error);
    return res.status(500).json({ error: 'Failed to save text' });
  }
}
