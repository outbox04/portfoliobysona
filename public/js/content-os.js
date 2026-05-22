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

  async function generate() {
    const input = getInput();
    
    outputEl.innerHTML = '<div class="cos-loading"><span>Đang phân tích & tạo nội dung...</span><p>Vui lòng đợi trong giây lát</p></div>';
    visualEl.innerHTML = '<div class="cos-visual-card is-empty"><span>...</span><strong>Đang tạo visual...</strong></div>';
    showToast('Đang gửi yêu cầu tới AI...');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!response.ok) throw new Error('API request failed');
      
      const output = await response.json();
      
      appState.input = input;
      appState.output = output;
      appState.visuals = output.visualSuggestions || [];
      
      if (promptEl) promptEl.value = 'Nội dung được tạo tự động qua API.';
      renderOutput(output);
      renderVisuals(input, appState.visuals);
      showToast('Đã tạo xong content!');
    } catch (error) {
      console.error('[Content OS] Generation Error:', error);
      outputEl.innerHTML = '<div class="cos-empty"><span>Lỗi tạo content</span><p>Đã xảy ra lỗi trong quá trình giao tiếp với AI. Vui lòng thử lại.</p></div>';
      visualEl.innerHTML = '';
      showToast('Tạo content thất bại');
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
