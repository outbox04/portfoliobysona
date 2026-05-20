// ═══ ECOSYSTEM PAGE JS ═══

// ── PARTICLES BACKGROUND ──
(() => {

(function initParticles() {
  const canvas = document.getElementById('ecoParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(124,58,237,', 'rgba(230,48,34,', 'rgba(6,182,212,', 'rgba(16,185,129,'];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // Draw connections
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── DEPARTMENT TABS ──
const deptNavItems = document.querySelectorAll('.eco-dept-nav-item');
const deptPanels   = document.querySelectorAll('.eco-dept-panel');

deptNavItems.forEach(item => {
  item.addEventListener('click', () => {
    deptNavItems.forEach(i => i.classList.remove('active'));
    deptPanels.forEach(p => p.classList.remove('active'));

    item.classList.add('active');

    const target =
      document.getElementById('panel-' + item.dataset.dept);

    if (target) {
      target.classList.add('active');
    }
  });
});

// ── AI IMPACT BARS ──
const impactBars = document.querySelectorAll('.ai-impact__fill');
const matrixFills = document.querySelectorAll('.eco-matrix__fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.width = e.target.dataset.w + '%';
    barObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
[...impactBars, ...matrixFills].forEach(b => barObs.observe(b));

document.querySelectorAll('.eco-dept-card[data-color][data-border]').forEach(card => {
  card.style.setProperty('--card-color', card.dataset.color);
  card.style.background = card.dataset.color;
  card.style.borderColor = card.dataset.border;
});

// ── SCROLL NAV DOTS ──
const scrollDots = document.querySelectorAll('.eco-scroll-dot');
const ecoSections = document.querySelectorAll('section[data-eco]');

function updateScrollNav() {
  let current = '';
  ecoSections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.dataset.eco;
  });
  scrollDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.section === current);
  });
}
window.addEventListener('scroll', updateScrollNav, { passive: true });

scrollDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.querySelector(`[data-eco="${dot.dataset.section}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll('.eco-stat__num[data-target]');
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let count = 0;
    const step = target / (1200 / 16);
    const t = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count) + suffix;
      if (count >= target) clearInterval(t);
    }, 16);
    cObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cObs.observe(c));

// ── REVEAL ANIMATION ──
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, idx) => {
    if (!e.isIntersecting) return;
    const siblings = Array.from(e.target.parentElement.children)
      .filter(c => c.classList.contains('reveal-up') || c.classList.contains('reveal-right'));
    setTimeout(() => e.target.classList.add('revealed'), siblings.indexOf(e.target) * 70);
    revObs.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal-up, .reveal-right, .reveal-scale').forEach(el => revObs.observe(el));

// ── CARD TILT ──
document.querySelectorAll('.eco-dept-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
    card.style.transform = `translateY(-8px) scale(1.02) perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

})();
