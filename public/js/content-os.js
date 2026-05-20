(() => {
  const form = document.getElementById('contentForm');
  const outputEl = document.getElementById('contentOutput');
  const visualEl = document.getElementById('visualOutput');
  const uploadInput = document.getElementById('assetUpload');
  const uploadList = document.getElementById('uploadList');
  const swatches = document.getElementById('swatches');
  const copyBtn = document.getElementById('copyBtn');
  const exportBtn = document.getElementById('exportBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !outputEl || !visualEl) return;

  const appState = {
    input: {},
    output: null,
    visuals: [],
    uploads: []
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

  function buildContent(input) {
    const brand = compact(input.brandName, 'thương hiệu của bạn');
    const audience = compact(input.audience, 'khách hàng mục tiêu');
    const pain = compact(input.painPoints, 'content chưa tạo đủ niềm tin');
    const aspiration = compact(input.aspiration, 'muốn thương hiệu chuyên nghiệp hơn');
    const voice = compact(input.brandVoice, 'rõ ràng và có chiều sâu');
    const formula = formulaMap[input.formula] || formulaMap.AIDA;

    const title = `${brand}: content không cần ồn, nhưng phải có hệ thống`;
    const opening = input.hookType === 'contrarian'
      ? `Không phải cứ đăng nhiều là thương hiệu sẽ mạnh hơn. Điều làm khách hàng nhớ đến ${brand} là một thông điệp nhất quán, được lặp lại bằng đúng ngôn ngữ của họ.`
      : `Có một vấn đề nhiều thương hiệu gặp phải: content vẫn đăng đều, nhưng khách hàng chưa cảm thấy đủ tin để bắt đầu cuộc trò chuyện.`;

    const body = [
      {
        text: `Nếu ${audience.toLowerCase()} đang thấy ${pain.toLowerCase()}, vấn đề thường không nằm ở từng bài viết riêng lẻ.`,
        why: `${formula[0]}: mở bằng insight để người đọc nhận ra mình trong tình huống, giảm cảm giác bị bán hàng.`
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
        why: `Psychology: visual consistency tạo fluency, làm thông điệp dễ xử lý và đáng tin hơn.`
      }
    ];

    const cta = input.ctaType === 'conversation'
      ? `Bạn đang muốn content của thương hiệu tạo nhiều cuộc trò chuyện hơn? Hãy bắt đầu bằng việc audit lại 5 bài gần nhất.`
      : input.ctaType === 'hard sell'
        ? `Inbox ${brand} để xây hệ thống content đầu tiên trong tuần này.`
        : `Nếu bạn muốn thương hiệu nhìn rõ ràng hơn, hãy bắt đầu từ một content system nhỏ nhưng nhất quán.`;

    const hashtags = ['#ContentOS', '#BrandStrategy', '#AIMarketing', `#${input.platform || 'SocialMedia'}`.replace(/\s+/g, '')];
    const copyVersion = [title, '', opening, '', ...body.map(item => item.text), '', cta, '', hashtags.join(' ')].join('\n');

    return {
      title,
      titleReason: `Tiêu đề dùng contrast "không cần ồn" để tạo curiosity nhưng vẫn giữ positioning cao cấp cho ${brand}.`,
      opening,
      openingReason: `Opening đánh vào pain point "${pain}" và tạo emotional trigger: người đọc thấy vấn đề của mình được gọi tên.`,
      body,
      cta,
      ctaReason: `CTA thuộc nhóm ${input.ctaType}, ưu tiên hành động phù hợp mục tiêu ${input.goal} trên ${input.platform}.`,
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
      <article class="cos-section">
        <div class="cos-section__label">Title</div>
        <h3>${escapeHtml(output.title)}</h3>
        <div class="cos-note">${escapeHtml(output.titleReason)}</div>
      </article>
      <article class="cos-section">
        <div class="cos-section__label">Opening</div>
        <p>${escapeHtml(output.opening)}</p>
        <div class="cos-note">${escapeHtml(output.openingReason)}</div>
      </article>
      <article class="cos-section">
        <div class="cos-section__label">Body</div>
        <ul>
          ${output.body.map(item => `<li>${escapeHtml(item.text)}<div class="cos-note">${escapeHtml(item.why)}</div></li>`).join('')}
        </ul>
      </article>
      <article class="cos-section">
        <div class="cos-section__label">CTA</div>
        <p>${escapeHtml(output.cta)}</p>
        <div class="cos-note">${escapeHtml(output.ctaReason)}</div>
      </article>
      <article class="cos-section">
        <div class="cos-section__label">Hashtags</div>
        <p>${escapeHtml(output.hashtags.join(' '))}</p>
      </article>
    `;
  }

  function renderVisuals(input, visuals) {
    const color = input.brandColor || '#e63022';
    const ratio = ratioMap[input.exportSize] || ratioMap['1:1'];
    swatches.innerHTML = [color, '#f0ede8', '#0a0a0b'].map(c => `<span class="cos-swatch" style="background:${c}"></span>`).join('');

    if (!visuals.length) {
      visualEl.innerHTML = `
        <div class="cos-visual-card is-empty" style="--visual-color:${color};--visual-ratio:${ratio}">
          <span>No image</span>
          <strong>Visual output đã tắt</strong>
          <p>Content vẫn có thể copy clean để đăng trực tiếp.</p>
        </div>
      `;
      return;
    }

    visualEl.innerHTML = visuals.map((visual, index) => `
      <div class="cos-visual-card" data-visual-index="${index}" style="--visual-color:${color};--visual-ratio:${ratio}">
        <span>${escapeHtml(String(index + 1).padStart(2, '0'))} / ${escapeHtml(visual.label)}</span>
        <strong>${escapeHtml(visual.text)}</strong>
        <p>${escapeHtml(visual.sub)}</p>
      </div>
    `).join('');
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cos-copy-ghost';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1700);
  }

  function generate() {
    appState.input = getInput();
    appState.output = buildContent(appState.input);
    appState.visuals = appState.output.visualSuggestions;
    renderOutput(appState.output);
    renderVisuals(appState.input, appState.visuals);
  }

  function handleUploads(files) {
    appState.uploads = Array.from(files || []);
    uploadList.innerHTML = '';
    appState.uploads.slice(0, 8).forEach((file, index) => {
      const img = document.createElement('img');
      img.className = 'cos-thumb';
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      uploadList.appendChild(img);
      if (index === 0) extractImageColor(img);
    });
  }

  function extractImageColor(img) {
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const size = 24;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const pixels = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < pixels.length; i += 16) {
        const alpha = pixels[i + 3];
        if (alpha < 80) continue;
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }
      if (!count) return;
      const color = `#${[r, g, b].map(v => Math.round(v / count).toString(16).padStart(2, '0')).join('')}`;
      form.elements.brandColor.value = color;
      if (appState.output) generate();
    }, { once: true });
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
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext('2d');
    const color = input.brandColor || '#e63022';

    ctx.fillStyle = '#0a0a0b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, color);
    grad.addColorStop(0.45, 'rgba(124,58,237,0.32)');
    grad.addColorStop(1, '#0a0a0b');
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = color;
    ctx.font = '800 34px Arial';
    ctx.fillText(visual.label.toUpperCase(), 84, 120);

    ctx.fillStyle = '#f0ede8';
    wrapCanvasText(ctx, visual.text, 84, 260, canvas.width - 168, 72, 'bold 64px Arial');

    ctx.fillStyle = '#b8b4af';
    wrapCanvasText(ctx, visual.sub, 84, canvas.height - 190, canvas.width - 168, 38, '500 32px Arial');

    ctx.fillStyle = color;
    ctx.fillRect(84, canvas.height - 96, 120, 8);
    ctx.fillStyle = '#f0ede8';
    ctx.font = '700 26px Arial';
    ctx.fillText(compact(input.brandName, 'Content OS'), 84, canvas.height - 46);

    const link = document.createElement('a');
    link.download = 'content-os-visual.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, font) {
    ctx.font = font;
    const words = String(text).split(/\s+/);
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    generate();
  });

  uploadInput.addEventListener('change', event => handleUploads(event.target.files));

  copyBtn.addEventListener('click', async () => {
    if (!appState.output) generate();
    await navigator.clipboard.writeText(appState.output.copyVersion);
    showToast('Đã copy clean content');
  });

  exportBtn.addEventListener('click', () => {
    if (!appState.output) generate();
    exportFirstVisual();
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    uploadList.innerHTML = '';
    appState.input = {};
    appState.output = null;
    appState.visuals = [];
    appState.uploads = [];
    outputEl.innerHTML = '<div class="cos-empty"><span>Content + Explanation + Psychology</span><p>Input đã được reset. Nhấn Generate để tạo bản content mới.</p></div>';
    visualEl.innerHTML = '<div class="cos-visual-card is-empty"><span>HOOK</span><strong>Visual preview sẽ xuất hiện ở đây</strong><p>Typography, màu logo và content hierarchy được render bằng frontend.</p></div>';
    swatches.innerHTML = '';
  });

  renderVisuals(getInput(), []);
})();
