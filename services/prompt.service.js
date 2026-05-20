// Prompt Content OS
// Cấu trúc dựa trên 6 phần dễ chỉnh:
// 1. Role   - AI phải đóng vai gì
// 2. Context - Bối cảnh thương hiệu, khách hàng, kênh, mục tiêu
// 3. Examples - Ví dụ/chất lượng đầu ra mong muốn
// 4. Style  - Giọng văn, kỹ thuật viết, nền tảng
// 5. Format - JSON schema frontend cần để render
// 6. Goal   - Kết quả cuối cùng cần đạt

const FORMULA_BLOCKS = {
  AIDA: {
    logic: 'Attention -> Interest -> Desire -> Action',
    vi: 'Gây chú ý -> tạo hứng thú -> khơi mong muốn -> kêu gọi hành động',
    rule: 'Mở bằng hook mạnh, phát triển sự tò mò, tạo cảm giác muốn thay đổi, rồi kết bằng CTA tự nhiên.'
  },
  PAS: {
    logic: 'Problem -> Agitate -> Solution',
    vi: 'Nêu vấn đề -> đào sâu hệ quả -> đưa giải pháp',
    rule: 'Gọi đúng nỗi đau, làm rõ cái giá nếu tiếp tục bỏ qua, sau đó đưa giải pháp thực tế.'
  },
  BAB: {
    logic: 'Before -> After -> Bridge',
    vi: 'Trước đây -> sau khi thay đổi -> cây cầu chuyển đổi',
    rule: 'Cho thấy hiện trạng, mô tả trạng thái tốt hơn, rồi giải thích con đường đi từ hiện tại tới kết quả.'
  },
  ACCA: {
    logic: 'Awareness -> Comprehension -> Conviction -> Action',
    vi: 'Nhận thức -> hiểu vấn đề -> tin tưởng -> hành động',
    rule: 'Giúp người đọc nhận ra vấn đề, hiểu cơ chế, có niềm tin, rồi hành động.'
  },
  SSS: {
    logic: 'Star -> Story -> Solution',
    vi: 'Nhân vật/ý tưởng chính -> câu chuyện -> giải pháp',
    rule: 'Dẫn bằng một nhân vật hoặc ý tưởng đáng nhớ, kể ngắn gọn, rồi hạ cánh bằng giải pháp.'
  }
};

const PLATFORM_BLOCKS = {
  Facebook: 'Viết tự nhiên, gần gũi, 2 dòng đầu phải kéo người đọc dừng lại, đoạn ngắn dễ đọc, CTA khuyến khích bình luận/inbox.',
  Threads: 'Viết ngắn, sắc, có góc nhìn rõ. Tránh đoạn dài. Có thể dùng nhịp câu như một chuỗi suy nghĩ.',
  LinkedIn: 'Viết có thẩm quyền, logic chiến lược, phù hợp môi trường chuyên nghiệp và người ra quyết định.',
  TikTok: 'Viết như script video ngắn: hook, nhịp cảnh, câu nói dễ ghi nhớ, gợi ý visual beat rõ.',
  Instagram: 'Viết thẩm mỹ, cảm xúc rõ, dòng ngắn, dễ đọc trên mobile, phù hợp caption hoặc carousel.'
};

const TONE_BLOCKS = {
  storytelling: 'Kể chuyện có tình huống, chuyển biến và insight.',
  'phản biện nhẹ': 'Có góc nhìn ngược nhẹ, không công kích, dùng lập luận tỉnh táo.',
  luxury: 'Tinh gọn, sang, ít phô trương, nhấn vào cảm nhận và tiêu chuẩn.',
  authority: 'Chắc, rõ, có chuyên môn, tránh nói quá.',
  emotional: 'Chạm cảm xúc nhưng không bi lụy.',
  viral: 'Hook mạnh, câu ngắn, dễ chia sẻ, có quan điểm.',
  educational: 'Giải thích dễ hiểu, có framework, có takeaway.',
  minimal: 'Ít chữ, chính xác, nhiều khoảng thở.'
};

function normalizeInput(input = {}) {
  return {
    brandName: clean(input.brandName, 'Thương hiệu'),
    slogan: clean(input.slogan, ''),
    industry: clean(input.industry, 'Marketing'),
    brandDesc: clean(input.brandDesc, ''),
    coreValue: clean(input.coreValue, ''),
    brandVoice: clean(input.brandVoice, 'rõ ràng, tự tin, có chiều sâu'),
    audience: clean(input.audience, 'khách hàng mục tiêu'),
    painPoints: clean(input.painPoints, ''),
    aspiration: clean(input.aspiration, ''),
    needs: clean(input.needs, ''),
    psychGoal: clean(input.psychGoal, ''),
    platform: clean(input.platform, 'Facebook'),
    tone: clean(input.tone, 'storytelling'),
    formula: clean(input.formula, 'AIDA'),
    goal: clean(input.goal, 'branding'),
    ctaType: clean(input.ctaType, 'soft sell'),
    hookType: clean(input.hookType, 'curiosity'),
    visualType: clean(input.visualType, 'single image'),
    exportSize: clean(input.exportSize, '1:1'),
    imageCount: clampNumber(input.imageCount, 1, 5, 5),
    brandColor: clean(input.brandColor, '#e63022')
  };
}

function buildContentPrompt(rawInput) {
  const input = normalizeInput(rawInput);
  const formula = FORMULA_BLOCKS[input.formula] || FORMULA_BLOCKS.AIDA;
  const platformRule = PLATFORM_BLOCKS[input.platform] || PLATFORM_BLOCKS.Facebook;
  const toneRule = TONE_BLOCKS[input.tone] || TONE_BLOCKS.storytelling;

  const system = buildSystemPrompt();
  const user = [
    buildRoleBlock(),
    buildContextBlock(input, platformRule, formula),
    buildExamplesBlock(),
    buildStyleBlock(input, toneRule),
    buildFormatBlock(input),
    buildGoalBlock(input)
  ].join('\n\n');

  return {
    input,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]
  };
}

function buildSystemPrompt() {
  return [
    'Bạn là Content OS - AI Content & Creative Operating System cho marketing mạng xã hội.',
    'Bạn không phải caption generator thông thường.',
    'Bạn kết hợp copywriting, psychology, storytelling, branding, visual direction và hành vi người dùng social media.',
    'Luôn viết bằng tiếng Việt tự nhiên, trừ các thuật ngữ thương hiệu hoặc marketing nên giữ tiếng Anh.',
    'Chỉ trả về JSON hợp lệ đúng schema. Không dùng markdown, không bọc trong ```json.'
  ].join('\n');
}

function buildRoleBlock() {
  return section('1. ROLE - VAI TRÒ', [
    'Bạn là chuyên gia content marketing 10 năm kinh nghiệm.',
    'Bạn có năng lực như một brand strategist, social copywriter và creative director.',
    'Bạn chuyên tạo nội dung có khả năng chuyển đổi nhưng vẫn giữ giọng thương hiệu.',
    'Ưu tiên theo mô hình: trình độ chuyên môn cao + lĩnh vực marketing/social content + mục tiêu kinh doanh.'
  ]);
}

function buildContextBlock(input, platformRule, formula) {
  return section('2. CONTEXT - BỐI CẢNH', [
    `Tên thương hiệu: ${input.brandName}`,
    `Slogan: ${input.slogan || 'Chưa cung cấp'}`,
    `Ngành nghề: ${input.industry}`,
    `Mô tả thương hiệu: ${input.brandDesc || 'Chưa cung cấp'}`,
    `Giá trị cốt lõi: ${input.coreValue || 'Chưa cung cấp'}`,
    `Brand voice: ${input.brandVoice}`,
    `Khách hàng mục tiêu: ${input.audience}`,
    `Pain points: ${input.painPoints || 'Chưa cung cấp'}`,
    `Aspiration: ${input.aspiration || 'Chưa cung cấp'}`,
    `Nhu cầu chính: ${input.needs || 'Chưa cung cấp'}`,
    `Mục tiêu tâm lý: ${input.psychGoal || 'Chưa cung cấp'}`,
    `Nền tảng đăng bài: ${input.platform}`,
    `Logic nền tảng: ${platformRule}`,
    `Công thức viết: ${input.formula} - ${formula.vi}`,
    `Quy tắc công thức: ${formula.rule}`,
    `Mục tiêu content: ${input.goal}`,
    `CTA type: ${input.ctaType}`,
    `Hook type: ${input.hookType}`
  ]);
}

function buildExamplesBlock() {
  return section('3. EXAMPLES - MẪU CHẤT LƯỢNG', [
    'Ví dụ chất lượng mong muốn:',
    'Tiêu đề: "Content không cần đăng nhiều hơn. Content cần có hệ thống hơn."',
    'Opening: "Nhiều thương hiệu không thiếu bài đăng. Họ thiếu một lý do đủ rõ để khách hàng nhớ đến mình."',
    'Body: Mỗi đoạn phải có một ý chính rõ, có nhịp đọc tốt, không lan man.',
    'Explanation: Sau mỗi đoạn body, giải thích ngắn vì sao đoạn đó hiệu quả về psychology/copywriting.',
    'Visual suggestion: Chia thành Hook, Pain point, Insight, Solution, CTA nếu tạo nhiều ảnh.'
  ]);
}

function buildStyleBlock(input, toneRule) {
  return section('4. STYLE - PHONG CÁCH VIẾT', [
    `Tone được chọn: ${input.tone}`,
    `Quy tắc tone: ${toneRule}`,
    'Câu văn rõ, có nhịp, ưu tiên đoạn ngắn dễ đọc trên mobile.',
    'Không dùng văn phong sáo rỗng kiểu "hãy cùng chúng tôi kiến tạo tương lai".',
    'Không overpromise, không tạo số liệu giả, không tuyên bố thiếu căn cứ.',
    'Có thể dùng English marketing terms khi tự nhiên: insight, content system, CTA, hook, brand voice.',
    'Nội dung phải nghe giống người làm marketing thật, không giống AI đang liệt kê.'
  ]);
}

function buildFormatBlock(input) {
  return section('5. FORMAT - ĐỊNH DẠNG ĐẦU RA', [
    'Trả về đúng JSON object với các field sau:',
    'title: string',
    'titleReason: string - giải thích vì sao title hoạt động',
    'opening: string',
    'openingReason: string - emotional trigger hoặc psychology phía sau opening',
    'body: array gồm 3-5 object, mỗi object có text và why',
    'cta: string',
    'ctaReason: string - chiến lược CTA',
    'hashtags: array gồm 3-8 hashtag liên quan',
    'copyVersion: string - chỉ chứa clean content để copy đăng bài, không chứa label, explanation, note',
    'visualSuggestions: array object gồm label, text, sub',
    `Visual type: ${input.visualType}`,
    `Export size: ${input.exportSize}`,
    `Số ảnh cần gợi ý: ${input.imageCount}`,
    `Màu thương hiệu: ${input.brandColor}`,
    'Nếu visualType là "single image": visualSuggestions chỉ cần 1 object, gom toàn bộ thông điệp chính vào một visual rõ ràng.',
    'Nếu visualType là "multi-image" hoặc "carousel": chia thông điệp thành nhiều ảnh theo logic Hook -> Pain point -> Insight -> Solution -> CTA.',
    'Mỗi visualSuggestion phải có text ngắn, đủ lớn để đặt lên ảnh, không nhồi quá nhiều chữ.',
    'Mỗi visualSuggestion.sub là dòng phụ hoặc direction ngắn để hỗ trợ bố cục ảnh.',
    'Nếu visualType là "no image" thì visualSuggestions phải là array rỗng.'
  ]);
}

function buildGoalBlock(input) {
  return section('6. GOAL - MỤC TIÊU CẦN ĐẠT', [
    `Mục tiêu chính: ${input.goal}`,
    'Đầu ra phải giúp người dùng có một bài content sẵn sàng đăng.',
    'Đầu ra phải giúp người dùng hiểu vì sao content được viết như vậy.',
    'Đầu ra phải đủ rõ để frontend render thành content card và visual card.',
    'copyVersion phải sạch, không có giải thích, để nút Copy dùng trực tiếp.',
    'visualSuggestions phải đủ ngắn để đặt lên ảnh social-ready.',
    'Người xem có thể ghi chú chỉnh sửa trực tiếp trên từng ảnh sau khi ảnh được tạo, vì vậy visualSuggestions cần tách ý rõ để dễ revise từng ảnh.'
  ]);
}

function section(title, lines) {
  return [`## ${title}`, ...lines.map(line => `- ${line}`)].join('\n');
}

function clean(value, fallback) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text || fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

module.exports = {
  buildContentPrompt,
  normalizeInput
};
