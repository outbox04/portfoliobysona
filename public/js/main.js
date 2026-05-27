const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);

themeBtn && themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ═══ CURSOR ═══
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (cursor && follower && !isTouchDevice) {
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function animF() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animF);
  })();
  document.querySelectorAll('a,button,.project-card,.contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width='14px'; cursor.style.height='14px'; follower.style.width='52px'; follower.style.height='52px'; follower.style.borderColor='var(--red)'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='10px'; cursor.style.height='10px'; follower.style.width='36px'; follower.style.height='36px'; follower.style.borderColor='rgba(230,48,34,0.5)'; });
  });
}

// ═══ NAV SCROLL ═══
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav && nav.classList.toggle('scrolled', window.scrollY > 60);
  // Active link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  document.querySelectorAll('.nav__link').forEach(l => {
    const href = l.getAttribute('href');
    if (href && href.startsWith('#')) {
      l.classList.toggle('active-link', href === '#' + current);
    }
  });
});

// ═══ MOBILE NAV ═══
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
toggle && toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks && navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  toggle.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ═══ REVEAL ON SCROLL ═══
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = Array.from(el.parentElement.children)
      .filter(c => c.classList.contains('reveal-up') || c.classList.contains('reveal-right'));
    const delay = siblings.indexOf(el) * 80;
    setTimeout(() => el.classList.add('revealed'), delay);
    revObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-up,.reveal-right,.reveal-scale').forEach(el => revObs.observe(el));

// ═══ STAT COUNTER ═══
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = target / (1400 / 16);
    const t = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count);
      if (count >= target) clearInterval(t);
    }, 16);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => countObs.observe(el));

// ═══ SKILL BARS ═══
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.width = entry.target.dataset.w + '%';
    barObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.bar__fill').forEach(b => barObs.observe(b));

document.querySelectorAll('[data-skill-command]').forEach(command => {
  const tabs = Array.from(command.querySelectorAll('[data-skill-tab]'));
  const panels = Array.from(command.querySelectorAll('[data-skill-panel]'));
  if (!tabs.length || !panels.length) return;

  let activeIndex = Math.max(0, tabs.findIndex(tab => tab.classList.contains('active')));
  let isHovering = false;

  const activateSkillPanel = (index) => {
    activeIndex = (index + tabs.length) % tabs.length;
    const key = tabs[activeIndex].dataset.skillTab;

    tabs.forEach(tab => {
      const active = tab.dataset.skillTab === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    panels.forEach(panel => {
      const active = panel.dataset.skillPanel === key;
      panel.classList.toggle('active', active);
      if (!active) return;
      panel.querySelectorAll('.bar__fill').forEach(fill => {
        fill.style.width = '0%';
        fill.offsetHeight;
        fill.style.width = fill.dataset.w + '%';
      });
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateSkillPanel(index));
  });

  command.addEventListener('mouseenter', () => { isHovering = true; });
  command.addEventListener('mouseleave', () => { isHovering = false; });

  setInterval(() => {
    if (isHovering || document.hidden) return;
    activateSkillPanel(activeIndex + 1);
  }, 5200);
});

// ═══ PROJECT FILTER & PAGINATION ═══
const tabBtns = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.project-card');

const PROJECT_ITEMS_PER_PAGE = 4; // Hiển thị 4 dự án mỗi trang (bạn có thể đổi thành 6 hoặc 8 tùy ý)
let projectCurrentPage = 1;

function updateProjectPagination() {
  if (!projectCards || projectCards.length === 0) return;
  
  const activeTabBtn = document.querySelector('.tab-btn.active');
  const f = activeTabBtn ? activeTabBtn.dataset.filter : 'all';

  let visibleItems = [];

  projectCards.forEach(card => {
    const show = f === 'all' || card.dataset.cat === f;
    if (show) visibleItems.push(card);
    else card.classList.add('hidden');
  });

  const totalPages = Math.ceil(visibleItems.length / PROJECT_ITEMS_PER_PAGE);
  if (projectCurrentPage > totalPages) projectCurrentPage = totalPages || 1;

  const startIndex = (projectCurrentPage - 1) * PROJECT_ITEMS_PER_PAGE;
  const endIndex = startIndex + PROJECT_ITEMS_PER_PAGE;

  visibleItems.forEach((card, index) => {
    if (index >= startIndex && index < endIndex) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      card.offsetHeight; // trigger reflow
      card.style.animation = 'cardIn .35s ease forwards';
    } else {
      card.classList.add('hidden');
    }
  });

  renderProjectPaginationUI(totalPages);
}

function renderProjectPaginationUI(totalPages) {
  let paginationContainer = document.getElementById('projectPagination');
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.id = 'projectPagination';
    paginationContainer.className = 'project-pagination';
    const grid = document.getElementById('projectsGrid');
    if (grid && grid.parentNode) {
      grid.parentNode.appendChild(paginationContainer);
    }
  }

  paginationContainer.innerHTML = '';
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `project-page-btn ${i === projectCurrentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      projectCurrentPage = i;
      updateProjectPagination();
      
      const section = document.getElementById('projects');
      if (section) {
        const offset = section.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(btn);
  }
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    projectCurrentPage = 1;
    updateProjectPagination();
  });
});

// ═══ CARD TILT ═══
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    card.style.transform = `translateY(-8px) perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ═══ HERO PARALLAX ═══
const b1 = document.querySelector('.blob-1');
const b2 = document.querySelector('.blob-2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (b1) b1.style.transform = `translateY(${y * 0.12}px)`;
  if (b2) b2.style.transform = `translateY(${y * 0.07}px)`;
}, { passive: true });

// ═══ TYPING EFFECT ═══
const eyebrow = document.querySelector('.hero__eyebrow');
if (eyebrow) {
  const text = eyebrow.textContent;
  eyebrow.textContent = ''; eyebrow.style.opacity = '1';
  let i = 0;
  const type = () => { if (i < text.length) { eyebrow.textContent += text[i++]; setTimeout(type, 38); } };
  setTimeout(type, 500);
}

// ═══ INJECT STYLES ═══
const s = document.createElement('style');
s.textContent = `
  @keyframes cardIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .nav__link.active-link { color: var(--text) !important; }
  .nav__link.active-link::after { width: 100% !important; }
`;
document.head.appendChild(s);
// ═══ MINDSET TABS ═══
document.querySelectorAll('.mindset-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mindset-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mindset-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});
// ═══ KNOWLEDGE FILTER ═══
document.querySelectorAll('.kp-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.kp-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.kp-card').forEach(card => {
      const show = f === 'all' || card.dataset.type === f;
      card.classList.toggle('hidden', !show);
      if (show) card.style.animation = 'cardIn .35s ease forwards';
    });
  });
});

// Project brief modal
const BRIEF_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbykOFwiCymWcR0wj9xUnIaa6-jvCaU-KNvxCqXlThxd4KtL4Upkq-RNV2brtlBuDDXaaQ/exec';
const briefModal = document.getElementById('briefModal');
const briefForm = document.getElementById('briefForm');
const briefOpenButtons = document.querySelectorAll('[data-brief-open]');
const briefCloseButtons = document.querySelectorAll('[data-brief-close]');

function openBriefModal() {
  if (!briefModal) return;
  briefModal.classList.add('open');
  briefModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const firstField = briefModal.querySelector('input, textarea, button');
  firstField && firstField.focus();
}

function closeBriefModal() {
  if (!briefModal) return;
  briefModal.classList.remove('open');
  briefModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

briefOpenButtons.forEach(button => button.addEventListener('click', openBriefModal));
briefCloseButtons.forEach(button => button.addEventListener('click', closeBriefModal));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && briefModal && briefModal.classList.contains('open')) {
    closeBriefModal();
  }
});

briefForm && briefForm.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('.brief-form__submit');
  const goals = Array.from(form.querySelectorAll('input[name="goals"]:checked')).map(item => item.value);

  const payload = {
    brand: form.brand.value.trim(),
    product: form.product.value.trim(),
    channel: form.channel.value.trim(),
    budget: form.budget.value.trim(),
    goals: goals.join(', '),
    goalsJson: JSON.stringify(goals),
    detail: form.detail.value.trim(),
    source: window.location.href,
    submittedAt: new Date().toISOString()
  };

  if (!payload.brand || !payload.product || !payload.detail) {
    alert('Vui lòng điền đầy đủ Tên thương hiệu, Sản phẩm/Dịch vụ và Thông tin chi tiết.');
    return;
  }

  if (!BRIEF_WEB_APP_URL || BRIEF_WEB_APP_URL === 'PASTE_WEB_APP_URL') {
    alert('Chưa cấu hình Web App URL để nhận brief.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi brief...';
  }

  try {
    const body = new URLSearchParams(payload);

    await fetch(BRIEF_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      body
    });

    alert('Brief đã được gửi thành công. Tôi sẽ phản hồi bạn sớm!');
    form.reset();
    closeBriefModal();
  } catch (error) {
    console.error('Brief submit failed:', error);
    alert('Có lỗi xảy ra khi gửi brief. Vui lòng thử lại.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gửi Brief';
    }
  }
});

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
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
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
