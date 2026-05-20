const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const CONTENT_OS_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    titleReason: { type: 'string' },
    opening: { type: 'string' },
    openingReason: { type: 'string' },
    body: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          why: { type: 'string' }
        },
        required: ['text', 'why']
      }
    },
    cta: { type: 'string' },
    ctaReason: { type: 'string' },
    hashtags: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: { type: 'string' }
    },
    copyVersion: { type: 'string' },
    visualSuggestions: {
      type: 'array',
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          text: { type: 'string' },
          sub: { type: 'string' }
        },
        required: ['label', 'text', 'sub']
      }
    }
  },
  required: [
    'title',
    'titleReason',
    'opening',
    'openingReason',
    'body',
    'cta',
    'ctaReason',
    'hashtags',
    'copyVersion',
    'visualSuggestions'
  ]
};

function getApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured.');
    error.code = 'GEMINI_API_KEY_MISSING';
    throw error;
  }
  return process.env.GEMINI_API_KEY;
}

async function generateJson(messages) {
  const model = process.env.GEMINI_CONTENT_MODEL || 'gemini-3.5-flash';
  const text = messages.map(message => `${message.role.toUpperCase()}:\n${message.content}`).join('\n\n');
  const response = await callGemini(model, {
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      temperature: 0.8,
      responseFormat: {
        text: {
          mimeType: 'application/json',
          schema: CONTENT_OS_SCHEMA
        }
      }
    }
  });

  const content = getText(response);
  if (!content) throw new Error('Gemini returned an empty JSON response.');

  return {
    model,
    data: JSON.parse(stripJsonFence(content))
  };
}

async function generateImageParts({ model, parts }) {
  return callGemini(model, {
    contents: [{ parts }]
  });
}

async function callGemini(model, body) {
  const apiKey = getApiKey();
  const response = await fetch(`${GEMINI_API_BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || `Gemini request failed with status ${response.status}.`);
    error.code = payload.error?.status || 'GEMINI_REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }
  return payload;
}

function getText(response) {
  return response.candidates?.[0]?.content?.parts
    ?.map(part => part.text || '')
    .join('')
    .trim();
}

function stripJsonFence(text) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

module.exports = {
  generateJson,
  generateImageParts
};
