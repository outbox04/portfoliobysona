const categories = [
  { slug: 'ai-prompt', title: 'AI Prompt', icon: 'sparkles', description: 'Prompt system cho content, ads, SEO, research va automation.' },
  { slug: 'seo-geo', title: 'SEO/GEO', icon: 'search', description: 'Toolkit toi uu Google, AI Search va Growth Engine Optimization.' },
  { slug: 'dashboard', title: 'Dashboard', icon: 'chart', description: 'Dashboard KPI, planning va operating rhythm cho team marketing.' },
  { slug: 'automation', title: 'Automation', icon: 'zap', description: 'Workflow tu dong hoa lead, content, reporting va CRM handoff.' },
  { slug: 'chatbot', title: 'Chatbot', icon: 'bot', description: 'Chatbot pack cho tu van, lead capture va support co kich ban.' },
  { slug: 'framework', title: 'Marketing Framework', icon: 'layers', description: 'Framework thuc chien de lap ke hoach, brief va chay chien dich.' },
  { slug: 'membership', title: 'Membership', icon: 'crown', description: 'Thu vien cap nhat hang thang, workshop va office hour.' },
  { slug: 'content-system', title: 'Content System', icon: 'grid', description: 'He thong lap lich, san xuat va tai su dung noi dung da kenh.' }
];

const products = [
  {
    slug: 'decaz-ai-marketing-toolkit',
    title: 'DECAZ AI Marketing Toolkit',
    category: 'ai-prompt',
    type: 'toolkit',
    badge: 'BESTSELLER',
    price: 790000,
    compareAt: 1290000,
    priceText: '790.000d',
    thumbnail: '/images/og/content-os.jpg',
    short: 'Bo prompt, workflow va template giup team marketing san xuat nhanh hon voi AI.',
    tags: ['AI', 'Prompt', 'Marketing OS'],
    rating: 4.9,
    reviews: 128,
    access: 'Lifetime access',
    included: ['120+ prompt marketing', 'Planning canvas', 'Ad angle library', 'Content repurpose workflow', 'Video huong dan setup'],
    changelog: ['v2.4: Them prompt GEO va AI Search', 'v2.3: Cap nhat framework audit funnel', 'v2.2: Bo sung template campaign sprint'],
    featured: true,
    bestseller: true
  },
  {
    slug: 'seo-geo-growth-kit',
    title: 'SEO & GEO Growth Kit',
    category: 'seo-geo',
    type: 'template',
    badge: 'NEW',
    price: 590000,
    compareAt: 890000,
    priceText: '590.000d',
    thumbnail: '/images/og/kien-thuc.jpg',
    short: 'Checklist SEO, GEO, content cluster va audit sheet cho website ca nhan/doanh nghiep.',
    tags: ['SEO', 'GEO', 'Audit'],
    rating: 4.8,
    reviews: 64,
    access: 'Lifetime access',
    included: ['SEO audit checklist', 'GEO content map', 'Keyword cluster sheet', 'Technical quick wins', 'Reporting template'],
    changelog: ['v1.8: Them AI citation checklist', 'v1.7: Update entity SEO map'],
    featured: true,
    bestseller: true
  },
  {
    slug: 'marketing-kpi-dashboard',
    title: 'Marketing KPI Dashboard',
    category: 'dashboard',
    type: 'dashboard',
    badge: 'LIMITED',
    price: 690000,
    compareAt: 990000,
    priceText: '690.000d',
    thumbnail: '/images/og/growth-roadmap.jpg',
    short: 'Dashboard theo doi KPI, budget, channel performance va weekly review.',
    tags: ['Dashboard', 'KPI', 'Report'],
    rating: 4.9,
    reviews: 91,
    access: 'Lifetime access',
    included: ['Dashboard Google Sheets', 'KPI tree', 'Weekly review format', 'Budget tracker', 'Executive summary'],
    changelog: ['v3.1: Them channel forecast', 'v3.0: Redesign executive view'],
    featured: true
  },
  {
    slug: 'chatbot-automation-pack',
    title: 'Chatbot Automation Pack',
    category: 'chatbot',
    type: 'automation',
    badge: 'NEW',
    price: 890000,
    compareAt: 1490000,
    priceText: '890.000d',
    thumbnail: '/images/og/ecosystem.jpg',
    short: 'Kich ban chatbot, lead routing va automation pack cho tu van san pham/dich vu.',
    tags: ['Chatbot', 'Automation', 'Lead'],
    rating: 4.7,
    reviews: 43,
    access: 'Lifetime access',
    included: ['12 flow chatbot', 'Lead qualification script', 'CRM handoff map', 'Follow-up automation', 'Setup checklist'],
    changelog: ['v1.5: Them flow consulting upsell', 'v1.4: Cap nhat lead scoring'],
    featured: true
  },
  {
    slug: 'content-system-template',
    title: 'Content System Template',
    category: 'content-system',
    type: 'template',
    badge: 'BESTSELLER',
    price: 490000,
    compareAt: 790000,
    priceText: '490.000d',
    thumbnail: '/images/og/content-os.jpg',
    short: 'Notion-style content calendar, content bank va repurpose pipeline.',
    tags: ['Content', 'Notion', 'System'],
    rating: 4.8,
    reviews: 76,
    access: 'Lifetime access',
    included: ['Content calendar', 'Idea bank', 'Repurpose matrix', 'Publishing checklist'],
    changelog: ['v2.0: Them AI brief workflow']
  },
  {
    slug: 'marketing-membership-june',
    title: 'Marketing Membership Thang 6',
    category: 'membership',
    type: 'membership',
    badge: 'LIMITED',
    price: 1290000,
    compareAt: 1890000,
    priceText: '1.290.000d',
    thumbnail: '/images/og/home.jpg',
    short: 'Membership hang thang gom thu vien premium, workshop, office hour va template moi.',
    tags: ['Membership', 'Workshop', 'Office Hour'],
    rating: 5,
    reviews: 38,
    access: '30 ngay membership',
    included: ['Thu vien premium', '2 workshop/thang', 'Office hour nhom', 'Template moi hang tuan'],
    changelog: ['June: Mo enrollment 72 gio'],
    limited: true
  }
];

const events = [
  { title: 'Membership thang 6', status: 'Open for 3 days', progress: 72, endsAt: '2026-06-01T23:59:59+07:00', tone: 'hot' },
  { title: 'Workshop SEO GEO', status: 'Starts in 2 days', progress: 46, endsAt: '2026-05-29T20:00:00+07:00', tone: 'new' },
  { title: 'Mentoring 1-1', status: 'Sold out', progress: 100, endsAt: '2026-05-27T18:00:00+07:00', tone: 'sold' }
];

const testimonials = [
  { name: 'Nguyen Minh Anh', role: 'Founder D2C Brand', quote: 'Toolkit giup team rut ngan 2 tuan planning thanh 3 ngay ma van ro KPI va message.', metric: '+38% ROAS' },
  { name: 'Le Quang Huy', role: 'Marketing Manager', quote: 'Dashboard va prompt framework lam weekly review cua team gon hon rat nhieu.', metric: '12h saved/week' },
  { name: 'Pham Thao', role: 'Content Lead', quote: 'Content System de dung, dep va du chat thuc chien. Khong phai template trang tri.', metric: '4x output' }
];

const faqs = [
  { q: 'San pham la digital hay physical?', a: 'Tat ca san pham hien tai la digital product: prompt, template, dashboard, automation pack va membership.' },
  { q: 'Sau khi mua toi nhan tai nguyen nhu the nao?', a: 'Ban se thay san pham trong Library cua account mock. Khi tich hop payment that, he thong se gui email va cap quyen tai khoan.' },
  { q: 'Co ho tro consulting khong?', a: 'Co. Moi trang product co CTA upsell consulting de dat lich audit hoac setup rieng.' },
  { q: 'Co cap nhat mien phi khong?', a: 'San pham lifetime co changelog va cap nhat trong pham vi version. Membership co noi dung moi theo thang.' }
];

const orders = [
  { id: 'HS-2406-1024', date: '2026-05-25', status: 'paid', amount: '1.480.000d' },
  { id: 'HS-2406-1019', date: '2026-05-21', status: 'pending', amount: '590.000d' },
  { id: 'HS-2405-0991', date: '2026-05-12', status: 'expired', amount: '1.290.000d' }
];

function getCategory(slug) {
  return categories.find(category => category.slug === slug);
}

function getProduct(slug) {
  return products.find(product => product.slug === slug);
}

function getProductsByCategory(slug) {
  return products.filter(product => product.category === slug);
}

module.exports = {
  categories,
  products,
  events,
  testimonials,
  faqs,
  orders,
  getCategory,
  getProduct,
  getProductsByCategory
};
