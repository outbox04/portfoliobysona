const categories = [
  { slug: 'ai-prompt', title: 'AI Prompt', icon: 'sparkles', description: 'Hệ thống prompt cho content, ads, SEO, research và automation.' },
  { slug: 'seo-geo', title: 'SEO/GEO', icon: 'search', description: 'Toolkit tối ưu Google, AI Search và Growth Engine Optimization.' },
  { slug: 'dashboard', title: 'Dashboard', icon: 'chart', description: 'Dashboard KPI, planning và operating rhythm cho team marketing.' },
  { slug: 'automation', title: 'Automation', icon: 'zap', description: 'Workflow tự động hoá lead, content, reporting và CRM handoff.' },
  { slug: 'chatbot', title: 'Chatbot', icon: 'bot', description: 'Chatbot pack cho tư vấn, lead capture và support có kịch bản.' },
  { slug: 'framework', title: 'Marketing Framework', icon: 'layers', description: 'Framework thực chiến để lập kế hoạch, brief và chạy chiến dịch.' },
  { slug: 'membership', title: 'Membership', icon: 'crown', description: 'Thư viện cập nhật hằng tháng, workshop và office hour.' },
  { slug: 'content-system', title: 'Content System', icon: 'grid', description: 'Hệ thống lập lịch, sản xuất và tái sử dụng nội dung đa kênh.' }
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
    priceText: '790.000đ',
    thumbnail: '/images/og/content-os.jpg',
    short: 'Bộ prompt, workflow và template giúp team marketing sản xuất nhanh hơn với AI.',
    tags: ['AI', 'Prompt', 'Marketing OS'],
    rating: 4.9,
    reviews: 128,
    access: 'Truy cập trọn đời',
    included: ['120+ prompt marketing', 'Planning canvas', 'Thư viện góc quảng cáo', 'Workflow tái sử dụng content', 'Video hướng dẫn setup'],
    changelog: ['v2.4: Thêm prompt GEO và AI Search', 'v2.3: Cập nhật framework audit funnel', 'v2.2: Bổ sung template campaign sprint'],
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
    priceText: '590.000đ',
    thumbnail: '/images/og/kien-thuc.jpg',
    short: 'Checklist SEO, GEO, content cluster và audit sheet cho website cá nhân/doanh nghiệp.',
    tags: ['SEO', 'GEO', 'Audit'],
    rating: 4.8,
    reviews: 64,
    access: 'Truy cập trọn đời',
    included: ['SEO audit checklist', 'GEO content map', 'Keyword cluster sheet', 'Technical quick wins', 'Reporting template'],
    changelog: ['v1.8: Thêm AI citation checklist', 'v1.7: Cập nhật entity SEO map'],
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
    priceText: '690.000đ',
    thumbnail: '/images/og/growth-roadmap.jpg',
    short: 'Dashboard theo dõi KPI, budget, channel performance và weekly review.',
    tags: ['Dashboard', 'KPI', 'Report'],
    rating: 4.9,
    reviews: 91,
    access: 'Truy cập trọn đời',
    included: ['Dashboard Google Sheets', 'KPI tree', 'Weekly review format', 'Budget tracker', 'Executive summary'],
    changelog: ['v3.1: Thêm channel forecast', 'v3.0: Redesign executive view'],
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
    priceText: '890.000đ',
    thumbnail: '/images/og/ecosystem.jpg',
    short: 'Kịch bản chatbot, lead routing và automation pack cho tư vấn sản phẩm/dịch vụ.',
    tags: ['Chatbot', 'Automation', 'Lead'],
    rating: 4.7,
    reviews: 43,
    access: 'Truy cập trọn đời',
    included: ['12 flow chatbot', 'Lead qualification script', 'CRM handoff map', 'Follow-up automation', 'Setup checklist'],
    changelog: ['v1.5: Thêm flow consulting upsell', 'v1.4: Cập nhật lead scoring'],
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
    priceText: '490.000đ',
    thumbnail: '/images/og/content-os.jpg',
    short: 'Content calendar kiểu Notion, content bank và repurpose pipeline.',
    tags: ['Content', 'Notion', 'System'],
    rating: 4.8,
    reviews: 76,
    access: 'Truy cập trọn đời',
    included: ['Content calendar', 'Idea bank', 'Repurpose matrix', 'Publishing checklist'],
    changelog: ['v2.0: Thêm AI brief workflow']
  },
  {
    slug: 'marketing-membership-june',
    title: 'Marketing Membership Tháng 6',
    category: 'membership',
    type: 'membership',
    badge: 'LIMITED',
    price: 1290000,
    compareAt: 1890000,
    priceText: '1.290.000đ',
    thumbnail: '/images/og/home.jpg',
    short: 'Membership hằng tháng gồm thư viện premium, workshop, office hour và template mới.',
    tags: ['Membership', 'Workshop', 'Office Hour'],
    rating: 5,
    reviews: 38,
    access: '30 ngày membership',
    included: ['Thư viện premium', '2 workshop/tháng', 'Office hour nhóm', 'Template mới hằng tuần'],
    changelog: ['Tháng 6: Mở enrollment 72 giờ'],
    limited: true
  }
];

const events = [
  { title: 'Membership tháng 6', status: 'Mở trong 3 ngày', progress: 72, endsAt: '2026-06-01T23:59:59+07:00', tone: 'hot' },
  { title: 'Workshop SEO GEO', status: 'Bắt đầu sau 2 ngày', progress: 46, endsAt: '2026-05-29T20:00:00+07:00', tone: 'new' },
  { title: 'Mentoring 1-1', status: 'Sold out', progress: 100, endsAt: '2026-05-27T18:00:00+07:00', tone: 'sold' }
];

const testimonials = [
  { name: 'Nguyễn Minh Anh', role: 'Founder D2C Brand', quote: 'Toolkit giúp team rút ngắn 2 tuần planning thành 3 ngày mà vẫn rõ KPI và message.', metric: '+38% ROAS' },
  { name: 'Le Quang Huy', role: 'Marketing Manager', quote: 'Dashboard va prompt framework lam weekly review cua team gon hon rat nhieu.', metric: '12h saved/week' },
  { name: 'Phạm Thảo', role: 'Content Lead', quote: 'Content System dễ dùng, đẹp và đủ chất thực chiến. Không phải template trang trí.', metric: '4x output' }
];

const faqs = [
  { q: 'Sản phẩm là digital hay physical?', a: 'Tất cả sản phẩm hiện tại là digital product: prompt, template, dashboard, automation pack và membership.' },
  { q: 'Sau khi mua tôi nhận tài nguyên như thế nào?', a: 'Bạn sẽ thấy sản phẩm trong Library của account mock. Khi tích hợp payment thật, hệ thống sẽ gửi email và cấp quyền tài khoản.' },
  { q: 'Có hỗ trợ consulting không?', a: 'Có. Mỗi trang product có CTA upsell consulting để đặt lịch audit hoặc setup riêng.' },
  { q: 'Có cập nhật miễn phí không?', a: 'Sản phẩm lifetime có changelog và cập nhật trong phạm vi version. Membership có nội dung mới theo tháng.' }
];

const orders = [
  { id: 'HS-2406-1024', date: '2026-05-25', status: 'paid', amount: '1.480.000đ' },
  { id: 'HS-2406-1019', date: '2026-05-21', status: 'pending', amount: '590.000đ' },
  { id: 'HS-2405-0991', date: '2026-05-12', status: 'expired', amount: '1.290.000đ' }
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
