(() => {
  const form = document.getElementById('contentForm');
  const outputEl = document.getElementById('contentOutput');
  const visualEl = document.getElementById('visualOutput');
  const promptEl = document.getElementById('promptOutput');
  const aiResultInput = document.getElementById('aiResultInput');
  const uploadInput = document.getElementById('assetUpload');
  const uploadList = document.getElementById('uploadList');
  const swatches = document.getElementById('swatches');
  const copyBtn = document.getElementById('copyBtn');
  const copyPromptBtn = document.getElementById('copyPromptBtn');
  const applyResultBtn = document.getElementById('applyResultBtn');
  const exportBtn = document.getElementById('exportBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !outputEl || !visualEl) return;

  const appState = {
    input: {},
    output: null,
    visuals: [],
    uploads: [],
    prompt: ''
  };

  const formulaMap = {
    AIDA: ['Attention', 'Interest', 'Desire', 'Action'],
    PAS: ['Problem', 'Agitate', 'Solution'],
    BAB: ['Before', 'After', 'Bridge'],
    ACCA: ['Awareness', 'Comprehension', 'Conviction', 'Action'],
    SSS: ['Star', 'Story', 'Solution']
  };

  const ratioMap = {
    '1:1': '1 / 1',
    '4:5': '4 / 5',
    '9:16': '9 / 16',
    carousel: '1 / 1'
  };

  function getInput() {
    const data = Object.fromEntries(new FormData(form).entries());
    data.imageCount = Math.max(1, Math.min(5, Number(data.imageCount || 1)));
    return data;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function compact(value, fallback) {
    const text = String(value || '').trim();
    return text || fallback;
  }

  function buildPrompt(input) {
    const formula = input.formula || 'AIDA';
    return [
      '# PROMPT CONTENT OS',
      '',
      '## 1. ROLE - VAI TRO',
      'Ban la chuyen gia content marketing 10 nam kinh nghiem, dong thoi la brand strategist, social copywriter va creative director.',
      'Hay tao noi dung social media bang tieng Viet tu nhien, co chien luoc, co psychology va san sang dang.',
      '',
      '## 2. CONTEXT - BOI CANH',
      `Thuong hieu: ${compact(input.brandName, 'Chua cung cap')}`,
      `Slogan: ${compact(input.slogan, 'Chua cung cap')}`,
      `Nganh nghe: ${compact(input.industry, 'Chua cung cap')}`,
      `Mo ta thuong hieu: ${compact(input.brandDesc, 'Chua cung cap')}`,
      `Core value: ${compact(input.coreValue, 'Chua cung cap')}`,
      `Brand voice: ${compact(input.brandVoice, 'Chua cung cap')}`,
      `Khach hang muc tieu: ${compact(input.audience, 'Chua cung cap')}`,
      `Pain points: ${compact(input.painPoints, 'Chua cung cap')}`,
      `Aspiration: ${compact(input.aspiration, 'Chua cung cap')}`,
      `Nhu cau: ${compact(input.needs, 'Chua cung cap')}`,
      `Muc tieu tam ly: ${compact(input.psychGoal, 'Chua cung cap')}`,
      `Nen tang: ${compact(input.platform, 'Facebook')}`,
      `Tone: ${compact(input.tone, 'storytelling')}`,
      `Cong thuc viet: ${formula}`,
      `Muc tieu content: ${compact(input.goal, 'branding')}`,
      `CTA type: ${compact(input.ctaType, 'soft sell')}`,
      `Hook type: ${compact(input.hookType, 'curiosity')}`,
      '',
      '## 3. EXAMPLES - MAU CHAT LUONG',
      'Tieu de mau: "Content khong can dang nhieu hon. Content can co he thong hon."',
      'Opening mau: "Nhieu thuong hieu khong thieu bai dang. Ho thieu mot ly do du ro de khach hang nho den minh."',
      'Moi doan body phai co 1 y chinh ro, co nhip doc tot, khong lan man.',
      '',
      '## 4. STYLE - PHONG CACH',
      'Viet ro rang, co chieu sau, uu tien doan ngan de doc tren mobile.',
      'Khong viet kieu sao rong, khong overpromise, khong tao so lieu gia.',
      'Co the dung thuat ngu marketing tieng Anh neu tu nhien: insight, hook, CTA, content system, brand voice.',
      '',
      '## 5. FORMAT - DINH DANG DAU RA',
      'Chi tra ve JSON hop le, khong boc trong markdown.',
      'Schema:',
      '{',
      '  "title": "",',
      '  "titleReason": "",',
      '  "opening": "",',
      '  "openingReason": "",',
      '  "body": [{ "text": "", "why": "" }],',
      '  "cta": "",',
      '  "ctaReason": "",',
      '  "hashtags": [],',
      '  "copyVersion": "",',
      '  "visualSuggestions": [{ "label": "", "text": "", "sub": "" }]',
      '}',
      '',
      '## 6. GOAL - MUC TIEU',
      'Tao content san sang dang, co giai thich psychology/copywriting phia sau.',
      'copyVersion chi chua clean content de copy dang bai, khong co label hay explanation.',
      `Neu visualType la ${input.visualType}, hay tao visualSuggestions phu hop voi ${input.imageCount} anh va ti le ${input.exportSize}.`
    ].join('\n');
  }

  function buildContent(input) {
    const brand = compact(input.brandName, 'thương hiệu của bạn');
    const audience = compact(input.audience, 'khách hàng mục tiêu');
    const pain = compact(input.painPoints, 'content chưa tạo đủ niềm tin');
    const voice = compact(input.brandVoice, 'rõ ràng và có chiều sâu');
    const formula = formulaMap[input.formula] || formulaMap.AIDA;
    const title = `${brand}: content không cần ồn, nhưng phải có hệ thống`;
    const opening = input.hookType === 'contrarian'
      ? `Không phải cứ đăng nhiều là thương hiệu sẽ mạnh hơn. Điều làm khách hàng nhớ đến ${brand} là một thông điệp nhất quán.`
      : `Có một vấn đề nhiều thương hiệu gặp phải: content vẫn đăng đều, nhưng khách hàng chưa cảm thấy đủ tin để bắt đầu cuộc trò chuyện.`;
    const body = [
      {
        text: `Nếu ${audience.toLowerCase()} đang thấy ${pain.toLowerCase()}, vấn đề thường không nằm ở từng bài viết riêng lẻ.`,
        why: `${formula[0]}: mở bằng insight để người đọc nhận ra mình trong tình huống.`
      },
      {
        text: `Vấn đề nằm ở cách các bài viết kết nối với nhau: một bài tạo nhận thức, một bài giải thích niềm tin, một bài chứng minh năng lực, và một bài mở đường cho hành động.`,
        why: `${formula[1] || 'Interest'}: chuyển từ triệu chứng sang hệ thống, giúp brand voice "${voice}" có nền tảng chiến lược.`
      },
      {
        text: `${brand} nên xây content như một operating system: rõ mục tiêu, rõ vai trò từng bài, rõ visual language và rõ CTA.`,
        why: `${formula[2] || 'Desire'}: đưa ra khung giải pháp cụ thể, phù hợp mục tiêu ${input.goal}.`
      },
      {
        text: `Khi content đi cùng màu sắc, typography và hierarchy nhất quán, người xem không chỉ đọc bài viết. Họ bắt đầu ghi nhớ thương hiệu.`,
        why: 'Psychology: visual consistency tạo fluency, làm thông điệp dễ xử lý và đáng tin hơn.'
      }
    ];
    const cta = input.ctaType === 'conversation'
      ? 'Bạn đang muốn content của thương hiệu tạo nhiều cuộc trò chuyện hơn? Hãy bắt đầu bằng việc audit lại 5 bài gần nhất.'
      : input.ctaType === 'hard sell'
        ? `Inbox ${brand} để xây hệ thống content đầu tiên trong tuần này.`
        : 'Nếu bạn muốn thương hiệu nhìn rõ ràng hơn, hãy bắt đầu từ một content system nhỏ nhưng nhất quán.';
    const hashtags = ['#ContentOS', '#BrandStrategy', '#AIMarketing', `#${input.platform || 'SocialMedia'}`.replace(/\s+/g, '')];
    const copyVersion = [title, '', opening, '', ...body.map(item => item.text), '', cta, '', hashtags.join(' ')].join('\n');

    return {
      title,
      titleReason: `Tiêu đề dùng contrast để tạo curiosity nhưng vẫn giữ positioning cao cấp cho ${brand}.`,
      opening,
      openingReason: `Opening đánh vào pain point "${pain}" và tạo emotional trigger.`,
      body,
      cta,
      ctaReason: `CTA thuộc nhóm ${input.ctaType}, phù hợp mục tiêu ${input.goal} trên ${input.platform}.`,
      hashtags,
      copyVersion,
      visualSuggestions: buildVisuals(input, title, body, cta)
    };
  }

  function buildVisuals(input, title, body, cta) {
    if (input.visualType === 'no image') return [];
    const count = input.visualType === 'single image' ? 1 : input.imageCount;
    const blocks = [
      { label: 'Hook', text: title, sub: compact(input.slogan, 'A clearer content system') },
      { label: 'Pain point', text: compact(input.painPoints, 'Content rời rạc làm thương hiệu khó được nhớ'), sub: 'Name the real friction' },
      { label: 'Insight', text: body[1]?.text || 'Content cần kết nối thành một hệ thống', sub: 'Make the invisible structure visible' },
      { label: 'Solution', text: body[2]?.text || 'Build a repeatable content workflow', sub: compact(input.coreValue, 'Clarity, rhythm, consistency') },
      { label: 'CTA', text: cta, sub: compact(input.brandName, 'Content OS') }
    ];
    return blocks.slice(0, count);
  }

  function renderOutput(output) {
    outputEl.innerHTML = `
      <article class="cos-section"><div class="cos-section__label">Title</div><h3>${escapeHtml(output.title)}</h3><div class="cos-note">${escapeHtml(output.titleReason)}</div></article>
      <article class="cos-section"><div class="cos-section__label">Opening</div><p>${escapeHtml(output.opening)}</p><div class="cos-note">${escapeHtml(output.openingReason)}</div></article>
      <article class="cos-section"><div class="cos-section__label">Body</div><ul>${output.body.map(item => `<li>${escapeHtml(item.text)}<div class="cos-note">${escapeHtml(item.why)}</div></li>`).join('')}</ul></article>
      <article class="cos-section"><div class="cos-section__label">CTA</div><p>${escapeHtml(output.cta)}</p><div class="cos-note">${escapeHtml(output.ctaReason)}</div></article>
      <article class="cos-section"><div class="cos-section__label">Hashtags</div><p>${escapeHtml(output.hashtags.join(' '))}</p></article>
    `;
  }

  function renderVisuals(input, visuals) {
    const color = input.brandColor || '#e63022';
    const ratio = ratioMap[input.exportSize] || ratioMap['1:1'];
    swatches.innerHTML = [color, '#f0ede8', '#0a0a0b'].map(c => `<span class="cos-swatch" style="background:${c}"></span>`).join('');
    if (!visuals.length) {
      visualEl.innerHTML = `<div class="cos-visual-card is-empty" style="--visual-color:${color};--visual-ratio:${ratio}"><span>No image</span><strong>Visual output đã tắt</strong><p>Content vẫn có thể copy clean để đăng trực tiếp.</p></div>`;
      return;
    }
    visualEl.innerHTML = visuals.map((visual, index) => `
      <div class="cos-visual-card" style="--visual-color:${color};--visual-ratio:${ratio}">
        <span>${escapeHtml(String(index + 1).padStart(2, '0'))} / ${escapeHtml(visual.label)}</span>
        <strong>${escapeHtml(visual.text)}</strong>
        <p>${escapeHtml(visual.sub)}</p>
      </div>
    `).join('');
  }

  function generate() {
    const input = getInput();
    const output = buildContent(input);
    const prompt = buildPrompt(input);
    appState.input = input;
    appState.output = output;
    appState.visuals = output.visualSuggestions;
    appState.prompt = prompt;
    promptEl.value = prompt;
    renderOutput(output);
    renderVisuals(input, appState.visuals);
    showToast('Đã build prompt và preview');
  }

  function applyAiResult() {
    const raw = aiResultInput.value.trim();
    if (!raw) {
      showToast('Chưa có JSON để apply');
      return;
    }
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      const output = JSON.parse(cleaned);
      const normalized = {
        ...buildContent(getInput()),
        ...output,
        body: Array.isArray(output.body) ? output.body : buildContent(getInput()).body,
        hashtags: Array.isArray(output.hashtags) ? output.hashtags : [],
        visualSuggestions: Array.isArray(output.visualSuggestions) ? output.visualSuggestions : []
      };
      appState.output = normalized;
      appState.visuals = normalized.visualSuggestions;
      renderOutput(normalized);
      renderVisuals(getInput(), appState.visuals);
      showToast('Đã apply AI result');
    } catch (error) {
      console.warn('[Content OS] Invalid pasted JSON:', error);
      showToast('JSON chưa hợp lệ');
    }
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cos-copy-ghost';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1700);
  }

  async function handleUploads(files) {
    const incoming = Array.from(files || []).filter(file => file.type.startsWith('image/'));
    const existingKeys = new Set(appState.uploads.map(item => item.key));
    const nextUploads = [];
    for (const file of incoming) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (existingKeys.has(key)) continue;
      nextUploads.push({ key, file, dataUrl: await readFileAsDataUrl(file) });
      existingKeys.add(key);
    }
    appState.uploads = [...appState.uploads, ...nextUploads].slice(0, 8);
    renderUploadList();
    uploadInput.value = '';
  }

  function renderUploadList() {
    uploadList.innerHTML = '';
    appState.uploads.forEach((item, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'cos-thumb-wrap';
      wrap.innerHTML = `<img class="cos-thumb" alt="${escapeHtml(item.file.name)}" src="${item.dataUrl}" /><button type="button" class="cos-thumb-remove" data-remove-upload="${index}" aria-label="Xóa ${escapeHtml(item.file.name)}">×</button>`;
      uploadList.appendChild(wrap);
      if (index === 0) extractImageColor(wrap.querySelector('img'));
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Cannot read image file.'));
      reader.readAsDataURL(file);
    });
  }

  function extractImageColor(img) {
    const readColor = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 24, 24);
      const pixels = ctx.getImageData(0, 0, 24, 24).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixels.length; i += 16) {
        if (pixels[i + 3] < 80) continue;
        r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2]; count++;
      }
      if (!count) return;
      form.elements.brandColor.value = `#${[r, g, b].map(v => Math.round(v / count).toString(16).padStart(2, '0')).join('')}`;
      if (appState.output) generate();
    };
    if (img.complete && img.naturalWidth > 0) readColor();
    else img.addEventListener('load', readColor, { once: true });
  }

  function exportFirstVisual() {
    const visual = appState.visuals[0];
    if (!visual) {
      showToast('Không có visual để export');
      return;
    }
    const input = appState.input;
    const size = input.exportSize === '9:16' ? [1080, 1920] : input.exportSize === '4:5' ? [1080, 1350] : [1080, 1080];
    const canvas = document.createElement('canvas');
    canvas.width = size[0]; canvas.height = size[1];
    const ctx = canvas.getContext('2d');
    const color = input.brandColor || '#e63022';
    ctx.fillStyle = '#0a0a0b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, color); grad.addColorStop(0.45, 'rgba(124,58,237,0.32)'); grad.addColorStop(1, '#0a0a0b');
    ctx.globalAlpha = 0.34; ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1;
    ctx.fillStyle = color; ctx.font = '800 34px Arial'; ctx.fillText(visual.label.toUpperCase(), 84, 120);
    ctx.fillStyle = '#f0ede8'; wrapCanvasText(ctx, visual.text, 84, 260, canvas.width - 168, 72, 'bold 64px Arial');
    ctx.fillStyle = '#b8b4af'; wrapCanvasText(ctx, visual.sub, 84, canvas.height - 190, canvas.width - 168, 38, '500 32px Arial');
    ctx.fillStyle = color; ctx.fillRect(84, canvas.height - 96, 120, 8);
    ctx.fillStyle = '#f0ede8'; ctx.font = '700 26px Arial'; ctx.fillText(compact(input.brandName, 'Content OS'), 84, canvas.height - 46);
    const link = document.createElement('a');
    link.download = 'content-os-visual.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, font) {
    ctx.font = font;
    let line = '';
    String(text).split(/\s+/).forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y); line = word; y += lineHeight;
      } else line = test;
    });
    if (line) ctx.fillText(line, x, y);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    generate();
  });
  uploadInput.addEventListener('change', event => handleUploads(event.target.files));
  uploadList.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-upload]');
    if (!removeButton) return;
    appState.uploads.splice(Number(removeButton.dataset.removeUpload), 1);
    renderUploadList();
  });
  copyBtn.addEventListener('click', async () => {
    if (!appState.output) generate();
    await navigator.clipboard.writeText(appState.output.copyVersion);
    showToast('Đã copy clean content');
  });
  copyPromptBtn?.addEventListener('click', async () => {
    if (!appState.prompt) generate();
    await navigator.clipboard.writeText(appState.prompt);
    showToast('Đã copy prompt');
  });
  applyResultBtn?.addEventListener('click', applyAiResult);
  exportBtn.addEventListener('click', () => {
    if (!appState.output) generate();
    exportFirstVisual();
  });
  resetBtn.addEventListener('click', () => {
    form.reset();
    appState.input = {}; appState.output = null; appState.visuals = []; appState.uploads = []; appState.prompt = '';
    uploadInput.value = ''; uploadList.innerHTML = ''; promptEl.value = ''; if (aiResultInput) aiResultInput.value = '';
    outputEl.innerHTML = '<div class="cos-empty"><span>Content + Explanation + Psychology</span><p>Input đã được reset. Nhấn Build Prompt + Preview để tạo bản mới.</p></div>';
    visualEl.innerHTML = '<div class="cos-visual-card is-empty"><span>HOOK</span><strong>Visual preview sẽ xuất hiện ở đây</strong><p>Typography, màu logo và content hierarchy được render bằng frontend.</p></div>';
    swatches.innerHTML = '';
  });

  renderVisuals(getInput(), []);
})();
