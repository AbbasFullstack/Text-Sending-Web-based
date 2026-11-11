// Shared Upstash Redis helpers.
// Uses the Upstash REST API with plain fetch, so no dependencies are needed.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Key under which the shared text is stored.
export const KEY = 'shared-text';

// Text expires automatically after 30 minutes.
export const TTL_SECONDS = 1800;

// Maximum accepted text length (characters).
export const MAX_TEXT_LENGTH = 100000;

export function upstashConfigured() {
  return (
    typeof REDIS_URL === 'string' &&
    REDIS_URL.length > 0 &&
    typeof REDIS_TOKEN === 'string' &&
    REDIS_TOKEN.length > 0
  );
}

export function notConfiguredResponse(res) {
  return res.status(500).json({
    error:
      'Upstash Redis is not configured. Add UPSTASH_REDIS_REST_URL and ' +
      'UPSTASH_REDIS_REST_TOKEN as environment variables in your Vercel project settings, then redeploy.',
  });
}

export async function redisCommand(path, init) {
  const response = await fetch(`${REDIS_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstash Redis error: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}
