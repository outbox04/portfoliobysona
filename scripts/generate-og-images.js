const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'images', 'og');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  {
    file: 'home.jpg',
    label: 'MARKETING PORTFOLIO',
    title: 'Tran Hong Son',
    subtitle: 'Branding | Performance Ads | Content | AI Marketing',
    accent: '#e63022',
    accent2: '#ff8a45'
  },
  {
    file: 'ecosystem.jpg',
    label: 'MARKETING ECOSYSTEM',
    title: 'Marketing Ecosystem & AI',
    subtitle: '10+ marketing domains | 50+ roles | AI transformation map',
    accent: '#39a7ff',
    accent2: '#9b5cff'
  },
  {
    file: 'content-os.jpg',
    label: 'PROMPT CREATIVE LAB',
    title: 'Prompt Content OS',
    subtitle: 'AI content workflow | Psychology | Visual social-ready output',
    accent: '#56f0ff',
    accent2: '#e63022'
  },
  {
    file: 'kien-thuc.jpg',
    label: 'MARKETING KNOWLEDGE',
    title: 'Tin tuc & Kien thuc Marketing',
    subtitle: 'AI Marketing | Branding | Performance | Content Strategy',
    accent: '#d4a843',
    accent2: '#e63022'
  },
  {
    file: 'growth-roadmap.jpg',
    label: 'MARKETING ROADMAP',
    title: 'Lo Trinh Phat Trien Marketer',
    subtitle: 'From Beginner to Marketing Manager in the AI era',
    accent: '#56f0ff',
    accent2: '#9b5cff'
  }
];

function esc(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }[char]));
}

function svg(page) {
  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#05060b"/>
      <stop offset="0.48" stop-color="#101426"/>
      <stop offset="1" stop-color="#05060b"/>
    </linearGradient>
    <radialGradient id="g1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 130) rotate(45) scale(520 360)">
      <stop stop-color="${page.accent}" stop-opacity="0.48"/>
      <stop offset="1" stop-color="${page.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(950 460) rotate(45) scale(520 360)">
      <stop stop-color="${page.accent2}" stop-opacity="0.42"/>
      <stop offset="1" stop-color="${page.accent2}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <g opacity="0.18">
    ${Array.from({ length: 18 }, (_, i) => `<path d="M${i * 72} 0V630" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 72}H1200" stroke="white" stroke-width="1"/>`).join('')}
  </g>
  <circle cx="1010" cy="120" r="110" fill="${page.accent}" opacity="0.18" filter="url(#blur)"/>
  <circle cx="180" cy="500" r="140" fill="${page.accent2}" opacity="0.16" filter="url(#blur)"/>
  <rect x="70" y="70" width="1060" height="490" rx="28" fill="white" fill-opacity="0.045" stroke="white" stroke-opacity="0.13"/>
  <path d="M95 500C255 395 358 403 465 452C609 518 692 481 820 374C921 289 1015 278 1110 328" stroke="${page.accent}" stroke-opacity="0.48" stroke-width="3"/>
  <text x="96" y="150" fill="${page.accent}" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="800" letter-spacing="6">${esc(page.label)}</text>
  <text x="96" y="300" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="900" letter-spacing="-2">${esc(page.title)}</text>
  <text x="100" y="372" fill="rgba(255,255,255,0.76)" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600">${esc(page.subtitle)}</text>
  <text x="96" y="510" fill="rgba(255,255,255,0.55)" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">tran-hong-son portfolio</text>
  <text x="1005" y="510" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900">HS.</text>
</svg>`;
}

(async () => {
  for (const page of pages) {
    await sharp(Buffer.from(svg(page))).jpeg({ quality: 92 }).toFile(path.join(outDir, page.file));
    console.log(`created ${page.file}`);
  }
})();
