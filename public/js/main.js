// ═══ THEME TOGGLE ═══
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
if (cursor && follower) {
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
    l.classList.toggle('active-link', l.getAttribute('href') === '#' + current);
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

// ═══ PROJECT FILTER ═══
const tabBtns = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.project-card');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !show);
      if (show) card.style.animation = 'cardIn .35s ease forwards';
    });
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