const { buildContentPrompt } = require('./prompt.service');
const { generateJson } = require('./gemini.service');

async function generateContent(input) {
  const prompt = buildContentPrompt(input);
  const result = await generateJson(prompt.messages);

  return {
    source: 'gemini',
    model: result.model,
    input: prompt.input,
    output: result.data
  };
}

module.exports = {
  generateContent
};
