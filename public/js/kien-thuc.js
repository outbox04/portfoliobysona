// ═══ KIEN THUC PAGE JS ═══

// ── TABS (trang /kien-thuc) ──
const ktTabs = document.querySelectorAll('.kt-tab');
const ktItems = document.querySelectorAll('.kt-item');
const ktFeatured = document.getElementById('ktFeatured');
const ktCatFilter = document.getElementById('ktCatFilter');

ktTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    ktTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;

    // Show/hide category filter
    if (ktCatFilter) {
      ktCatFilter.classList.toggle('visible', tab === 'knowledge');
      // Reset cat filter
      ktCatFilter.querySelectorAll('.kt-cat').forEach(c => c.classList.remove('active'));
      ktCatFilter.querySelector('[data-cat="all"]')?.classList.add('active');
    }

    // Filter items
    ktItems.forEach(item => {
      const show = tab === 'all' || item.dataset.type === tab;
      item.classList.toggle('hidden', !show);
      if (show) item.style.animation = 'cardIn .35s ease forwards';
    });

    // Featured visibility
    if (ktFeatured) {
      if (tab === 'knowledge' && ktFeatured.dataset.type === 'news') {
        ktFeatured.style.display = 'none';
      } else if (tab === 'news' && ktFeatured.dataset.type === 'knowledge') {
        ktFeatured.style.display = 'none';
      } else {
        ktFeatured.style.display = '';
      }
    }
  });
});

// ── CATEGORY FILTER ──
document.querySelectorAll('.kt-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.kt-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;

    ktItems.forEach(item => {
      if (item.dataset.type !== 'knowledge') return;
      const show = cat === 'all' || item.dataset.cat === cat;
      item.classList.toggle('hidden', !show);
      if (show) item.style.animation = 'cardIn .35s ease forwards';
    });
  });
});

// ── SIDEBAR CATEGORY BUTTONS ──
document.querySelectorAll('.kt-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Switch to knowledge tab first
    const knowledgeTab = document.querySelector('.kt-tab[data-tab="knowledge"]');
    if (knowledgeTab) knowledgeTab.click();

    // Then filter by cat
    const cat = btn.dataset.cat;
    setTimeout(() => {
      const catBtn = document.querySelector(`.kt-cat[data-cat="${cat}"]`);
      if (catBtn) catBtn.click();
    }, 50);
  });
});

// ── SEARCH (optional future feature) ──
const searchInput = document.getElementById('ktSearch');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    ktItems.forEach(item => {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc  = item.querySelector('p')?.textContent.toLowerCase() || '';
      item.classList.toggle('hidden', q.length > 0 && !title.includes(q) && !desc.includes(q));
    });
  });
}
// BLOCK DEVTOOLS
document.addEventListener('contextmenu', e => {
  e.preventDefault();
});

document.addEventListener('keydown', e => {

  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+J
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    return false;
  }

  // Ctrl+U
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    return false;
  }

});
// ======================
// ANTI COPY
// ======================

document.addEventListener('contextmenu', e => {
  e.preventDefault();
});

document.addEventListener('copy', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  e.preventDefault();
});

document.addEventListener('cut', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  e.preventDefault();
});

document.addEventListener('paste', e => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  e.preventDefault();
});

document.addEventListener('selectstart', e => {
  e.preventDefault();
});

document.addEventListener('dragstart', e => {
  e.preventDefault();
});

document.addEventListener('keydown', e => {

  // F12
  if (e.key === 'F12') {
    e.preventDefault();
  }

  // Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
  }

  // Ctrl+U
  if (e.ctrlKey && e.key.toLowerCase() === 'u') {
    e.preventDefault();
  }

  // Ctrl+C
  if (e.ctrlKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
  }

  // Ctrl+A
  if (e.ctrlKey && e.key.toLowerCase() === 'a') {
    e.preventDefault();
  }

});