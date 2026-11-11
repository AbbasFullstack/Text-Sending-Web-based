// API endpoint to clear the stored text.

import {
  KEY,
  upstashConfigured,
  notConfiguredResponse,
  redisCommand,
} from './_upstash.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!upstashConfigured()) {
    return notConfiguredResponse(res);
  }

  try {
    await redisCommand(`/del/${KEY}`);

    return res.status(200).json({ success: true, message: 'Text cleared!' });
  } catch (error) {
    console.error('Error clearing text:', error);
    return res.status(500).json({ error: 'Failed to clear text' });
  }
}
