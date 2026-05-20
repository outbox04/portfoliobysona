const { toFile } = require('openai');
const { createClient } = require('./openai.service');

const SIZE_MAP = {
  '1:1': '1024x1024',
  '4:5': '1024x1280',
  '9:16': '1024x1792',
  carousel: '1024x1024'
};

async function generateImages({ input = {}, output = {} }) {
  const client = createClient();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const visuals = getVisuals(input, output);
  const size = SIZE_MAP[input.exportSize] || SIZE_MAP['1:1'];

  const images = [];
  for (let index = 0; index < visuals.length; index++) {
    const visual = visuals[index];
    const prompt = buildImagePrompt({ input, visual, index, total: visuals.length });
    const response = await client.images.generate({
      model,
      prompt,
      size,
      n: 1
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) throw new Error('Image generation returned no image data.');
    images.push({
      index,
      model,
      prompt,
      label: visual.label,
      dataUrl: `data:image/png;base64,${b64}`
    });
  }

  return { source: 'openai-image', model, size, images };
}

async function reviseImage({ input = {}, visual = {}, imageDataUrl, note = '' }) {
  const client = createClient();
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
  const size = SIZE_MAP[input.exportSize] || SIZE_MAP['1:1'];
  const image = await dataUrlToFile(imageDataUrl);
  const prompt = buildImagePrompt({
    input,
    visual,
    index: Number(visual.index || 0),
    total: Number(input.imageCount || 1),
    note
  });

  const response = await client.images.edit({
    model,
    image,
    prompt,
    size,
    n: 1
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) throw new Error('Image edit returned no image data.');

  return {
    source: 'openai-image-edit',
    model,
    size,
    prompt,
    image: {
      index: Number(visual.index || 0),
      label: visual.label,
      dataUrl: `data:image/png;base64,${b64}`
    }
  };
}

function getVisuals(input, output) {
  if (input.visualType === 'no image') return [];
  const visualSuggestions = Array.isArray(output.visualSuggestions) ? output.visualSuggestions : [];
  if (!visualSuggestions.length) return [];
  const limit = input.visualType === 'single image' ? 1 : clampNumber(input.imageCount, 1, 5, 5);
  return visualSuggestions.slice(0, limit);
}

function buildImagePrompt({ input, visual, index, total, note }) {
  const revision = note
    ? [
        '',
        'GHI CHÚ CHỈNH SỬA TRỰC TIẾP TỪ NGƯỜI XEM:',
        note,
        'Hãy chỉnh ảnh theo ghi chú này, nhưng vẫn giữ nhận diện thương hiệu và mục tiêu của visual.'
      ].join('\n')
    : '';

  return [
    'Tạo một ảnh social media chuyên nghiệp cho Content OS.',
    'Không tạo mockup giao diện app. Không tạo ảnh quá nhiều chữ nhỏ khó đọc.',
    '',
    `Thương hiệu: ${safe(input.brandName, 'Thương hiệu')}`,
    `Ngành nghề: ${safe(input.industry, 'Marketing')}`,
    `Brand voice: ${safe(input.brandVoice, 'rõ ràng, tự tin, có chiều sâu')}`,
    `Màu thương hiệu chính: ${safe(input.brandColor, '#e63022')}`,
    `Nền tảng: ${safe(input.platform, 'Facebook')}`,
    `Tỉ lệ ảnh: ${safe(input.exportSize, '1:1')}`,
    `Loại output: ${safe(input.visualType, 'single image')}`,
    `Ảnh số: ${Number(index) + 1}/${total}`,
    '',
    'NỘI DUNG VISUAL:',
    `Vai trò ảnh: ${safe(visual.label, 'Hook')}`,
    `Thông điệp chính: ${safe(visual.text, '')}`,
    `Dòng phụ: ${safe(visual.sub, '')}`,
    '',
    'ART DIRECTION:',
    '- Phong cách premium dark editorial, hiện đại, rõ hierarchy.',
    '- Dùng màu thương hiệu làm accent, nền sạch, tương phản tốt.',
    '- Typography lớn, ít chữ, dễ đọc trên mobile.',
    '- Có thể dùng abstract shapes, gradient nhẹ, texture tinh tế, ánh sáng studio.',
    '- Không dùng watermark, không dùng logo giả, không tạo chữ sai chính tả.',
    '- Nếu có chữ trong ảnh, chỉ dùng các cụm ngắn từ nội dung visual.',
    revision
  ].join('\n');
}

async function dataUrlToFile(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    const error = new Error('Invalid image data URL.');
    error.code = 'INVALID_IMAGE_DATA_URL';
    throw error;
  }
  const buffer = Buffer.from(match[2], 'base64');
  return toFile(buffer, 'content-os-image.png', { type: match[1] });
}

function safe(value, fallback) {
  const text = String(value || '').trim();
  return text || fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

module.exports = {
  generateImages,
  reviseImage,
  buildImagePrompt
};
