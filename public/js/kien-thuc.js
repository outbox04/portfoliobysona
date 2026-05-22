// ═══ KIEN THUC PAGE JS ═══

// ── TABS (trang /kien-thuc) ──
const ktTabs = document.querySelectorAll('.kt-tab');
const ktItems = document.querySelectorAll('.kt-item');
const ktFeatured = document.getElementById('ktFeatured');
const ktCatFilter = document.getElementById('ktCatFilter');

// ── PAGINATION LOGIC ──
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

function updatePagination() {
  if (!ktItems || ktItems.length === 0) return;
  
  const activeTabBtn = document.querySelector('.kt-tab.active');
  const tab = activeTabBtn ? activeTabBtn.dataset.tab : 'all';

  const activeCatBtn = document.querySelector('.kt-cat.active');
  const cat = activeCatBtn ? activeCatBtn.dataset.cat : 'all';

  const searchInput = document.getElementById('ktSearch');
  const q = searchInput ? searchInput.value.toLowerCase() : '';

  let visibleItems = [];

  ktItems.forEach(item => {
    let show = true;
    if (tab !== 'all' && item.dataset.type !== tab) show = false;
    if (tab === 'knowledge' && cat !== 'all' && item.dataset.cat !== cat) show = false;
    if (q) {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc  = item.querySelector('p')?.textContent.toLowerCase() || '';
      if (!title.includes(q) && !desc.includes(q)) show = false;
    }
    if (show) visibleItems.push(item);
    else item.classList.add('hidden');
  });

  const totalPages = Math.ceil(visibleItems.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  visibleItems.forEach((item, index) => {
    if (index >= startIndex && index < endIndex) {
      item.classList.remove('hidden');
      item.style.animation = 'none';
      item.offsetHeight; // trigger reflow
      item.style.animation = 'cardIn .35s ease forwards';
    } else {
      item.classList.add('hidden');
    }
  });

  renderPaginationUI(totalPages);
}

function renderPaginationUI(totalPages) {
  let paginationContainer = document.getElementById('ktPagination');
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'ktPagination';
    paginationContainer.className = 'kt-pagination';
    const ktList = document.querySelector('.kt-list');
    if (ktList && ktList.parentNode) {
      ktList.parentNode.insertBefore(paginationContainer, ktList.nextSibling);
    }
  }

  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `kt-page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      currentPage = i;
      updatePagination();
      
      // Cuộn lên mượt mà khi chuyển trang
      const layout = document.querySelector('.kt-layout');
      if (layout) {
        const offset = layout.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(btn);
  }
}

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

    // Apply pagination & filters
    currentPage = 1;
    updatePagination();

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

    currentPage = 1;
    updatePagination();
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