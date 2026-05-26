// ═══════════════════════════════════════════════
// PRELOADER — MARKETER RUNNING LOADER
// ═══════════════════════════════════════════════

(function () {
  'use strict';

  // ── CONFIG ──
  const DURATION    = 2800;   // total ms before 100%
  const FAST_END    = 400;    // ms to go 95→100% at the end
  const FPS         = 60;

  // Status messages cycling through loading
  const STATUSES = [
    ['Analyzing brand...', 'Loading assets'],
    ['Building strategy...', 'Connecting modules'],
    ['Optimizing content...', 'Syncing data'],
    ['Launching system...', 'Almost ready'],
    ['System ready.', 'Welcome'],
  ];

  // Checkpoint data: percentage, label, step name
  const CHECKPOINTS = [
    { pct: 0,   label: 'Start',    step: '' },
    { pct: 25,  label: 'Strategy', step: '01' },
    { pct: 50,  label: 'Content',  step: '02' },
    { pct: 75,  label: 'Design',   step: '03' },
    { pct: 100, label: 'Launch',   step: '04' },
  ];

  // ── DOM REFS ──
  const preloader   = document.getElementById('preloader');
  if (!preloader) return;

  const pctEl       = document.getElementById('prePct');
  const barFill     = document.getElementById('preBarFill');
  const barTip      = document.getElementById('preBarTip');
  const runner      = document.getElementById('preRunner');
  const statusLines = document.querySelectorAll('.pre-status-line');
  const flashEl     = document.getElementById('preFinishFlash');
  const cpEls       = document.querySelectorAll('.pre-checkpoint');
  const cpLabels    = document.querySelectorAll('.pre-cp-label');

  document.body.classList.add('pre-loading');

  // ── SVG RUNNER FRAMES (minimal stick figure running) ──
  // 4 frames of a minimalist running silhouette
  const RUNNER_FRAMES = [
    // Frame 1 — stride forward
    `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="5" r="3.5" fill="white" opacity="0.9"/>
      <line x1="18" y1="8.5" x2="18" y2="19" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="18" y1="12" x2="11" y2="17" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="12" x2="26" y2="15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="19" x2="12" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="18" y1="19" x2="25" y2="26" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="28" x2="10" y2="32" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="25" y1="26" x2="29" y2="30" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    // Frame 2 — mid air
    `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="4" r="3.5" fill="white" opacity="0.9"/>
      <line x1="18" y1="7.5" x2="17" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="17" y1="11" x2="9"  y2="15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="17" y1="11" x2="25" y2="13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="17" y1="18" x2="10" y2="25" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="17" y1="18" x2="26" y2="24" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="10" y1="25" x2="8"  y2="31" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="26" y1="24" x2="30" y2="29" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    // Frame 3 — stride back
    `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="5" r="3.5" fill="white" opacity="0.9"/>
      <line x1="18" y1="8.5" x2="19" y2="19" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="12" y2="15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="27" y2="17" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="19" y1="19" x2="13" y2="27" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="19" x2="24" y2="28" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="13" y1="27" x2="9"  y2="32" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="24" y1="28" x2="27" y2="32" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    // Frame 4 — push off
    `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="5" r="3.5" fill="white" opacity="0.9"/>
      <line x1="18" y1="8.5" x2="18" y2="18" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="18" y1="11" x2="10" y2="16" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="11" x2="25" y2="14" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="18" x2="11" y2="26" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="18" y1="18" x2="26" y2="25" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <line x1="11" y1="26" x2="7"  y2="31" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="26" y1="25" x2="31" y2="28" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  ];

  // Inject runner SVG
  if (runner) runner.innerHTML = RUNNER_FRAMES[0];

  // ── STATE ──
  let progress   = 0;
  let frameIdx   = 0;
  let frameTimer = 0;
  const FRAME_INTERVAL = 120; // ms per animation frame

  // ── EASING ──
  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
  }

  // ── UPDATE UI ──
  function updateUI(pct) {
    const p = Math.min(100, Math.max(0, pct));

    // Counter
    if (pctEl) pctEl.textContent = Math.floor(p);

    // Bar fill
    if (barFill) barFill.style.width = p + '%';

    // Bar tip position
    if (barTip) barTip.style.left = `calc(${p}% - 20px)`;

    // Runner position — offset by half runner width (18px)
    if (runner) {
      const trackW = runner.closest('.pre-runner-area')?.offsetWidth || 600;
      const runnerW = 36;
      const minLeft = runnerW / 2;
      const maxLeft = trackW - runnerW / 2;
      const left = minLeft + (p / 100) * (maxLeft - minLeft);
      runner.style.left = left + 'px';
    }

    // Checkpoints
    cpEls.forEach((cp, i) => {
      const cpPct = CHECKPOINTS[i + 1]?.pct || 0; // skip index 0 (start)
      if (p >= cpPct) {
        cp.classList.remove('active');
        cp.classList.add('passed');
      }
      // Flash when crossing
      if (Math.floor(p) === cpPct && !cp.dataset.fired) {
        cp.classList.add('active');
        cp.dataset.fired = '1';
        // Background pulse
        triggerBgPulse();
        setTimeout(() => cp.classList.remove('active'), 600);
      }
    });

    // Checkpoint labels
    cpLabels.forEach((lbl) => {
      const lblPct = parseInt(lbl.dataset.pct || 0);
      if (p >= lblPct) {
        lbl.classList.remove('active');
        lbl.classList.add('passed');
      }
      if (Math.floor(p) >= lblPct - 2 && Math.floor(p) <= lblPct + 2) {
        lbl.classList.add('active');
      }
    });

    // Status messages
    const stageIdx = Math.min(Math.floor(p / 20), STATUSES.length - 1);
    statusLines.forEach((line, i) => {
      const txt = STATUSES[stageIdx][i] || '';
      if (line.textContent !== txt) {
        line.style.opacity = '0';
        setTimeout(() => {
          line.textContent = txt;
          line.style.opacity = '';
          if (i === 0) line.classList.add('active');
        }, 150);
      }
    });

    // Runner bounce animation (CSS class)
    if (runner) {
      const speed = p > 90 ? 'fast' : p > 60 ? 'normal' : 'slow';
      runner.dataset.speed = speed;
    }
  }

  // ── RUNNER FRAME ANIMATION ──
  function animateRunner(delta) {
    frameTimer += delta;
    const interval = progress > 90 ? 80 : progress > 60 ? 110 : 140;
    if (frameTimer >= interval) {
      frameTimer = 0;
      frameIdx = (frameIdx + 1) % RUNNER_FRAMES.length;
      if (runner) runner.innerHTML = RUNNER_FRAMES[frameIdx];
    }
  }

  // ── BACKGROUND PULSE ──
  function triggerBgPulse() {
    if (!flashEl) return;
    flashEl.style.transition = 'none';
    flashEl.style.opacity = '1';
    setTimeout(() => {
      flashEl.style.transition = 'opacity 0.8s ease';
      flashEl.style.opacity = '0';
    }, 50);
  }

  // ── MAIN ANIMATION LOOP ──
  let startTime = null;
  let lastTime  = null;
  let finished  = false;

  function loop(timestamp) {
    if (!startTime) startTime = timestamp;
    if (!lastTime)  lastTime  = timestamp;
    const delta   = timestamp - lastTime;
    const elapsed = timestamp - startTime;
    lastTime = timestamp;

    if (!finished) {
      // Ease progress over DURATION
      const t = Math.min(elapsed / DURATION, 1);
      const eased = easeInOutCubic(t);

      // Target: 0→95% over DURATION, then fast to 100%
      let target;
      if (t < 1) {
        target = eased * 95;
      } else {
        // After DURATION, rush to 100
        const rushElapsed = elapsed - DURATION;
        target = 95 + Math.min((rushElapsed / FAST_END) * 5, 5);
      }

      progress = target;
      updateUI(progress);
      animateRunner(delta);

      if (progress >= 100) {
        finished = true;
        onComplete();
        return;
      }
    }

    requestAnimationFrame(loop);
  }

  // ── ON COMPLETE ──
  function onComplete() {
    updateUI(100);

    // Runner sprint effect
    if (runner) {
      runner.style.filter = 'drop-shadow(0 0 16px rgba(77,124,255,1)) drop-shadow(0 0 32px rgba(122,92,255,0.6))';
      runner.style.transform = 'translate(-50%, -60%) scaleX(1.2)';
    }

    // Bar full glow
    if (barFill) {
      barFill.style.boxShadow = '0 0 20px rgba(77,124,255,0.8), 0 0 40px rgba(77,124,255,0.4)';
    }

    // Flash
    triggerBgPulse();

    // Status: done
    statusLines.forEach((line, i) => {
      line.textContent = ['System ready.', 'Welcome'][i] || '';
      if (i === 0) line.classList.add('active');
    });

    // Fade out preloader after short pause
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.classList.remove('pre-loading');
      document.body.classList.add('pre-done');

      // Remove from DOM after animation
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 900);
    }, 500);
  }

  // ── START ──
  // Small delay to let fonts load
  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 100);

})();
