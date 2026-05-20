const OpenAI = require('openai');

const CONTENT_OS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
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
  ],
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
        additionalProperties: false,
        required: ['text', 'why'],
        properties: {
          text: { type: 'string' },
          why: { type: 'string' }
        }
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
        additionalProperties: false,
        required: ['label', 'text', 'sub'],
        properties: {
          label: { type: 'string' },
          text: { type: 'string' },
          sub: { type: 'string' }
        }
      }
    }
  }
};

function createClient() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is not configured.');
    error.code = 'OPENAI_API_KEY_MISSING';
    throw error;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function generateJson(messages) {
  const client = createClient();
  const model = process.env.OPENAI_CONTENT_MODEL || 'gpt-5.5';

  const response = await client.chat.completions.create({
    model,
    temperature: 0.8,
    messages,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'content_os_output',
        strict: true,
        schema: CONTENT_OS_SCHEMA
      }
    }
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  return {
    model,
    data: JSON.parse(content)
  };
}

module.exports = {
  createClient,
  generateJson
};
