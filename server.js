const express = require('express');
const compression = require('compression');
const path = require('path');
// Import hàm clearCache 
const { clearCache } = require('./services/googleSheet.service');

const app = express();
app.use(express.json());
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

const helmet = require('helmet');

app.use(helmet());

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Project data
const projects = [
  {
    id: 'brand-identity',
    cat: 'brand',
    catLabel: 'Thương hiệu',
    title: 'Brand Identity Campaign – MEGAPOWER',
    short: 'Xây dựng hệ thống nhận diện thương hiệu toàn diện cho MEGAPOWER',
    thumb: '/images/projects/brand/MEGAPOWER/brand-01.jpg',
    cover: '/images/projects/brand/MEGAPOWER/brand-02.jpg',
    tags: ['Branding', 'Visual Identity', 'Design'],
    desc: `MEGAPOWER là tổng kho phân phối thiết bị năng lượng mặt trời, tập trung vào hệ thống đại lý và đội thi công trên toàn quốc.

Thách thức của dự án là xây dựng một hệ thống nhận diện thương hiệu chuyên nghiệp, nhất quán và dễ áp dụng trong môi trường B2B, nơi thương hiệu cần thể hiện sự uy tín, năng lực và khả năng mở rộng.

Dự án bao gồm việc thiết kế logo, hệ thống màu sắc, typography và bộ Brand Guideline hoàn chỉnh nhằm đảm bảo tính đồng bộ trên tất cả các điểm chạm: từ tài liệu nội bộ, truyền thông đến hệ thống đại lý.`,
    results: ['Xây dựng hoàn chỉnh bộ Brand Guideline 13+ trang', 'Chuẩn hóa 100% hệ thống nhận diện trên digital & offline', 'Tăng khả năng nhận diện thương hiệu trong hệ thống đại lý','Tạo nền tảng mở rộng marketing & bán hàng B2B','Rút ngắn thời gian triển khai thiết kế & truyền thông'],
    images: ['/images/projects/brand/MEGAPOWER/brand-01.jpg', '/images/projects/brand/MEGAPOWER/brand-03.jpg', '/images/projects/brand/MEGAPOWER/brand-04.jpg', '/images/projects/brand/MEGAPOWER/brand-05.jpg']
  },
  {
    id: 'social-branding',
    cat: 'brand',
    catLabel: 'Thương hiệu',
    title: 'TIẾN DƯƠNG HOME-Brand Identity Design',
    short: 'Xây dựng bộ nhận diện thương hiệu cho công ty kiến trúc & xây dựng, tập trung vào sự vững chắc, uy tín và hiện đại.',
    thumb: '/images/projects/brand/TDH/brand-02.jpg',
    cover: '/images/projects/brand/TDH/brand-01.jpg',
    tags: ['Social Media', 'Branding', 'Content'],
    desc: `TIẾN DƯƠNG HOME là thương hiệu hoạt động trong lĩnh vực thiết kế và thi công nhà ở. Dự án tập trung xây dựng một hệ thống nhận diện đồng bộ, thể hiện sự chuyên nghiệp, đáng tin cậy và định hướng phát triển dài hạn.`,
    results: ['Tạo logo dễ nhận diện, mang tính biểu tượng ngành xây dựng', 'Xây dựng hệ màu thể hiện sự bền vững & tin cậy', 'Ứng dụng linh hoạt trên nhiều nền tảng (online + offline)'],
    images: ['/images/projects/brand/TDH/brand-02.jpg','/images/projects/brand/TDH/brand-03.jpg','/images/projects/brand/TDH/brand-04.jpg']
  },
  {
    id: 'fb-ads-hcg',
    cat: 'performance',
    catLabel: 'Performance',
    title: 'Facebook Ads — KPI 800M/tháng',
    short: 'Tối ưu hóa chiến dịch Facebook Ads đạt 800 triệu doanh thu/tháng tại HCG.',
    thumb: '/images/projects/performance/BAOAN/perf-02.jpg',
    cover: '/images/projects/performance/BAOAN/perf-01.jpg',
    tags: ['Facebook Ads', 'Performance', 'ROAS'],
    desc: `Quản lý toàn bộ hệ thống quảng cáo Facebook cho Công ty HCG, tối ưu từng campaign, ad set và creative để đạt KPI doanh thu cao nhất với ngân sách tối ưu.`,
    results: ['KPI 800 triệu/tháng', 'Top 5 toàn hệ thống Bảo An', 'ROAS tăng 3.2x'],
    images: ['/images/projects/performance/BAOAN/perf-02.jpg', '/images/projects/performance/BAOAN/perf-03.jpg']
  },
  {
    id: 'multi-ads',
    cat: 'performance',
    catLabel: 'Performance',
    title: 'TREND PRODUCT ADS',
    short: 'Tìm kiếm sản phẩm trending từ nền tảng TMĐT Trung Quốc và triển khai Facebook Ads để kiểm chứng thị trường & scale tại Việt Nam.',
    thumb: '/images/projects/performance/TREND/perf-03.jpg',
    cover: '/images/projects/performance/TREND/perf-01.jpg',
    tags: ['Google Ads', 'TikTok Ads', 'FB Ads'],
    desc: `Xây dựng hệ thống tìm – test – scale sản phẩm trend xuyên thị trường.`,
    results: ['Tổng sản phẩm đã test: 100+', 'Sản phẩm WIN: 8–12 sản phẩm', 'Tỷ lệ WIN: ~8–12%', 'Doanh thu trung bình sản phẩm WIN: 7 triệu/ngày', 'Thời gian tìm sản phẩm WIN: 2–5 ngày'],
    images: ['/images/projects/performance/TREND/perf-02.jpg','/images/projects/performance/TREND/perf-03.jpg']
  },
  {
    id: 'anpham-nha-viet',
    cat: 'design',
    catLabel: 'Design',
    title: 'ẤN PHẨM TRUYỀN THÔNG - NHÀ VIỆT BRANDING',
    short: 'Thiết kế hệ thống ấn phẩm truyền thông cho thương hiệu Nhà Việt, bao gồm bộ nhận diện online & offline phục vụ marketing và bán hàng.',
    thumb: '/images/projects/design/NHAVIET/design-04.jpg',
    cover: '/images/projects/design/NHAVIET/design-01.jpg',
    tags: ['Print Design', 'Banner', 'Poster'],
    desc: `Dự án tập trung thiết kế hệ thống ấn phẩm truyền thông đồng bộ cho thương hiệu Nhà Việt, phục vụ hoạt động marketing đa nền tảng.
Bao gồm thiết kế banner, poster, social media và các ấn phẩm hỗ trợ bán hàng, đảm bảo tính nhất quán và nhận diện thương hiệu.`,
    results: ['Xây dựng hệ thống 30+ ấn phẩm truyền thông', 'Đồng bộ hình ảnh thương hiệu trên đa nền tảng', 'Tăng nhận diện thương hiệu', 'Hỗ trợ hiệu quả cho chiến dịch marketing'],
    images: ['/images/projects/design/NHAVIET/design-02.jpg', '/images/projects/design/NHAVIET/design-03.jpg']
  },
  {
    id: 'social-visual',
    cat: 'design',
    catLabel: 'Design',
    title: 'SƠN TÙNG DESIGN - HIGH-END BRAND VISUAL',
    short: 'Xây dựng hệ thống hình ảnh truyền thông cho dịch vụ xây nhà trọn gói phân khúc cao cấp, tập trung vào trải nghiệm sang trọng và khách hàng thu nhập cao.',
    thumb: '/images/projects/design/SONTUNG/design-02.jpg',
    cover: '/images/projects/design/SONTUNG/design-01.jpg',
    tags: ['Canva', 'Photoshop', 'Social Design'],
    desc: `Dự án tập trung xây dựng hệ thống hình ảnh truyền thông cho thương hiệu Sơn Tùng Design – đơn vị cung cấp dịch vụ xây nhà trọn gói trong phân khúc cao cấp.

Với định hướng khách hàng thu nhập cao, hệ thống visual được thiết kế theo phong cách tối giản, sang trọng, nhấn mạnh vào trải nghiệm, cảm xúc và giá trị sống thay vì yếu tố bán hàng trực tiếp.

Các ấn phẩm được triển khai bao gồm social media, website và tài liệu truyền thông, đảm bảo sự đồng bộ và nâng cao nhận diện thương hiệu trong phân khúc premium.`,
    results: ['Xây dựng hình ảnh thương hiệu cao cấp', 'Tăng độ nhận diện trong phân khúc premium', 'Đồng bộ hệ thống visual', 'Nâng perception thương hiệu','Khách hàng cao cấp không thích quảng cáo “bán hàng','Họ mua cảm giác & đẳng cấp'],
    images: ['/images/projects/design/SONTUNG/design-03.jpg']
  },
  {
    id: 'video-bao-an',
    cat: 'video',
    catLabel: 'Video',
    title: 'VIDEO PRODUCTION - LỄ CẤT NÓC EDEN LUXURY HOTEL',
    short: 'Sản xuất video ghi dấu cột mốc thi công quan trọng, góp phần nâng cao hình ảnh thương hiệu Nhà Việt Construction.',
    thumb: '/images/projects/video/NHAVIET/video-02.jpg',
    cover: '/images/projects/video/NHAVIET/video-01.jpg',
    tags: ['Video Ads', 'Premiere', 'Mobile'],
    desc: `Dự án tập trung sản xuất video truyền thông cho sự kiện lễ cất nóc khách sạn Eden Luxury – một cột mốc quan trọng trong quá trình thi công.
Video được xây dựng nhằm ghi lại tiến độ công trình, đồng thời truyền tải hình ảnh chuyên nghiệp, uy tín của Nhà Việt Construction trong lĩnh vực xây dựng công trình quy mô lớn.`,
    results: ['Ghi dấu cột mốc quan trọng của dự án', 'Nâng cao hình ảnh thương hiệu Nhà Việt Construction', 'Tăng độ tin tưởng với khách hàng & đối tác', 'Tối ưu nội dung cho đa nền tảng (Facebook, Youtube)'],
    youtube: 'https://www.youtube.com/embed/4EHlYIcEhwY',
    images: ['/images/projects/video/NHAVIET/video-03.jpg','/images/projects/video/NHAVIET/video-02.jpg']
  },
  {
    id: 'video-son-tung',
    cat: 'video',
    catLabel: 'Video',
    title: 'SONTUNG DESIGN - LUXURY VIDEO CAMPAIGN',
    short: 'Sản xuất video quảng cáo dịch vụ thiết kế & thi công nhà cao cấp, tận dụng thời điểm cuối năm – đầu năm để gia tăng nhu cầu xây dựng.',
    thumb: '/images/projects/video/SONTUNG/video-02.jpg',
    cover: '/images/projects/video/SONTUNG/video-01.jpg',
    tags: ['Cinematography', 'Editing', 'Real Estate'],
    desc: `Quay và dựng video showcase các công trình kiến trúc, nội thất hoàn thiện của Công ty Sơn Tùng, sử dụng kỹ thuật quay chuyển động và hiệu ứng chỉnh màu chuyên nghiệp.`,
    results: ['Xây dựng video quảng cáo mang tính thương hiệu', 'Nâng cao perception phân khúc cao cấp', 'Tăng độ nhận diện trong giai đoạn cao điểm', 'Tối ưu nội dung đa nền tảng (Facebook, Youtube, Reels'],
    facebook: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F762029853624808',
    images: ['/images/projects/video/SONTUNG/video-02.jpg','/images/projects/video/SONTUNG/video-03.jpg']
  }
];

function getSiteUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /');
});

app.get('/', async (req, res) => {
  const data = await getCachedData();
  res.render('index', { 
    siteUrl: getSiteUrl(req), 
    projects: data.projects,
    knowledge: data.knowledge
  });
});

app.get('/projects/:id', async (req, res) => {
  const data = await getCachedData();
  const project = data.projects.find(p => p.id === req.params.id);
  if (!project) return res.redirect('/');
  const related = data.projects.filter(p => p.cat === project.cat && p.id !== project.id).slice(0, 3);
  res.render('projects/detail', { siteUrl: getSiteUrl(req), project, related, projects: data.projects });
});

app.get('/kien-thuc', async (req, res) => {
  const data = await getCachedData();
  res.render('kien-thuc/index', {
    siteUrl: getSiteUrl(req),
    knowledge: data.knowledge
  });
});

app.get('/kien-thuc/:id', async (req, res) => {
  const data = await getCachedData();
  const article = data.knowledge.find(k => k.id === req.params.id);
  if (!article) return res.redirect('/kien-thuc');
  const related = data.knowledge
    .filter(k => k.cat === article.cat && k.id !== article.id)
    .slice(0, 3);
  res.render('kien-thuc/detail', {
    siteUrl: getSiteUrl(req),
    article,
    related,
    knowledge: data.knowledge
  });
});

const knowledge = [
  {
    id: 'ai-thay-doi-marketing-2025',
    type: 'news',
    cat: 'AI & Công nghệ',
    title: 'AI đang thay đổi ngành Marketing như thế nào trong 2026?',
    short: 'Từ tự động hóa content...',
    thumb: '/images/knowledge/AI/post.jpg',
    ogImage: '/images/knowledge/AI/thumb.jpg',
    date: '22/05/2026',
    readTime: '5 phút đọc',
    content: `
<h1>AI đang thay đổi ngành Marketing như thế nào trong 2026?</h1>

<p>AI không còn là “xu hướng tương lai”. Đến năm 2026, trí tuệ nhân tạo đã trở thành một phần cốt lõi trong chiến lược marketing của doanh nghiệp, freelancer và creator cá nhân. Từ việc tạo content, tối ưu quảng cáo, phân tích dữ liệu đến chăm sóc khách hàng — AI đang giúp marketer làm nhanh hơn, chính xác hơn và cá nhân hóa mạnh hơn.</p>

<p>Nếu trước đây marketing phụ thuộc nhiều vào nhân sự và kinh nghiệm thủ công, thì hiện nay AI Marketing 2026 đang mở ra một giai đoạn hoàn toàn mới: tự động hóa, tối ưu theo dữ liệu và sáng tạo theo thời gian thực.</p>

<img src="/images/knowledge/AI/post-1.jpg" alt="AI Marketing 2026" />

<h2>AI Marketing 2026 là gì?</h2>

<p><strong>AI Marketing 2026</strong> là việc ứng dụng trí tuệ nhân tạo vào các hoạt động marketing nhằm tăng hiệu quả, giảm chi phí và cải thiện trải nghiệm khách hàng.</p>

<p>AI hiện có thể:</p>

<ul>
  <li>Viết content chuẩn SEO chỉ trong vài phút</li>
  <li>Tạo video quảng cáo tự động</li>
  <li>Phân tích hành vi khách hàng theo thời gian thực</li>
  <li>Dự đoán xu hướng mua hàng</li>
  <li>Tối ưu quảng cáo Meta Ads và Google Ads</li>
  <li>Cá nhân hóa email marketing và chatbot</li>
</ul>

<p>Những công cụ phổ biến hiện nay gồm ChatGPT, Gemini, Claude, Midjourney, Canva AI, Notion AI, HubSpot AI, Meta Advantage+...</p>

<h2>1. AI đang thay đổi cách tạo Content</h2>

<p>Trước đây, để viết một bài blog chuẩn SEO, marketer có thể mất từ 4–8 giờ. Nhưng hiện nay, AI có thể hỗ trợ hoàn thành 70–80% công việc chỉ trong vài phút.</p>

<h3>AI hỗ trợ Content Marketing như thế nào?</h3>

<ul>
  <li>Viết bài blog SEO</li>
  <li>Tạo caption Facebook, TikTok, LinkedIn</li>
  <li>Viết email marketing</li>
  <li>Lên ý tưởng video viral</li>
  <li>Viết script YouTube Shorts</li>
  <li>Tạo landing page copy</li>
</ul>

<blockquote>
  “AI không thay thế marketer giỏi. AI thay thế marketer không biết dùng AI.”
</blockquote>

<p>Điểm khác biệt lớn nhất trong năm 2026 là AI không chỉ tạo nội dung nhanh — mà còn có khả năng phân tích intent người dùng và tối ưu nội dung theo hành vi tìm kiếm.</p>

<h3>Từ khóa ngách đang tăng mạnh:</h3>

<ul>
  <li>AI viết content SEO</li>
  <li>AI content marketing</li>
  <li>Công cụ AI cho marketer</li>
  <li>AI viết bài chuẩn SEO</li>
  <li>AI tạo content TikTok</li>
</ul>

<h2>2. AI giúp cá nhân hóa quảng cáo mạnh hơn</h2>

<p>Một trong những thay đổi lớn nhất của ngành digital marketing là khả năng cá nhân hóa quảng cáo bằng AI.</p>

<p>Các nền tảng như Meta và Google hiện sử dụng machine learning để:</p>

<ul>
  <li>Tự tối ưu audience</li>
  <li>Phân phối quảng cáo theo hành vi</li>
  <li>Test creative tự động</li>
  <li>Dự đoán khả năng chuyển đổi</li>
</ul>

<h3>Ví dụ thực tế:</h3>

<p>Meta Advantage+ có thể tự động:</p>

<ul>
  <li>Phân tích tệp khách hàng tiềm năng</li>
  <li>Tìm người có khả năng mua cao nhất</li>
  <li>Tối ưu placement</li>
  <li>Tự scale chiến dịch hiệu quả</li>
</ul>

<p>Điều này khiến performance marketing trong 2026 thay đổi hoàn toàn. Marketer không còn chỉ “set ads”, mà phải hiểu data, insight và creative strategy.</p>

<h2>3. AI đang thay đổi SEO trong năm 2026</h2>

<p>SEO hiện không còn chỉ là tối ưu Google Search truyền thống. Năm 2026, SEO đang chuyển dịch sang:</p>

<ul>
  <li>SEO cho AI Search</li>
  <li>GEO (Generative Engine Optimization)</li>
  <li>Search Intent Optimization</li>
  <li>Entity SEO</li>
</ul>

<h3>GEO là gì?</h3>

<p><strong>GEO (Generative Engine Optimization)</strong> là tối ưu nội dung để xuất hiện trong kết quả trả lời của AI như ChatGPT, Gemini hay Perplexity.</p>

<p>Điều này có nghĩa:</p>

<ul>
  <li>Nội dung phải chuyên sâu hơn</li>
  <li>Có cấu trúc rõ ràng</li>
  <li>Tăng tính chuyên gia (E-E-A-T)</li>
  <li>Trả lời đúng intent người dùng</li>
</ul>

<h3>Xu hướng SEO AI 2026:</h3>

<ul>
  <li>Topical Authority</li>
  <li>Semantic SEO</li>
  <li>Search Experience Optimization</li>
  <li>AI-generated search results</li>
  <li>Voice Search SEO</li>
</ul>

<h2>4. AI giúp phân tích dữ liệu nhanh hơn</h2>

<p>Marketing hiện đại phụ thuộc rất lớn vào dữ liệu. Nhưng vấn đề là lượng data ngày càng khổng lồ.</p>

<p>AI giúp marketer:</p>

<ul>
  <li>Tự động đọc báo cáo ads</li>
  <li>Phát hiện chiến dịch hiệu quả</li>
  <li>Dự đoán hành vi khách hàng</li>
  <li>Phân tích sentiment khách hàng</li>
  <li>Tối ưu funnel marketing</li>
</ul>

<p>Trước đây cần analyst mất nhiều giờ để tổng hợp báo cáo, hiện nay AI dashboard có thể đưa insight gần như realtime.</p>

<h2>5. Chatbot AI đang thay đổi chăm sóc khách hàng</h2>

<p>AI chatbot hiện không còn trả lời theo kịch bản cứng như trước.</p>

<p>Trong năm 2026, chatbot AI có thể:</p>

<ul>
  <li>Tư vấn như nhân viên thật</li>
  <li>Nhớ lịch sử khách hàng</li>
  <li>Tự đề xuất sản phẩm phù hợp</li>
  <li>Hỗ trợ bán hàng 24/7</li>
</ul>

<p>Đây là lý do nhiều doanh nghiệp đang chuyển sang AI CRM và AI Customer Support.</p>

<h2>6. Marketer cần học gì để không bị tụt lại?</h2>

<p>AI không làm ngành marketing biến mất. Nhưng AI đang thay đổi kỹ năng mà marketer cần có.</p>

<h3>Những kỹ năng quan trọng trong 2026:</h3>

<ul>
  <li>Prompt Engineering</li>
  <li>SEO + GEO</li>
  <li>Creative Strategy</li>
  <li>Data Analytics</li>
  <li>Performance Marketing</li>
  <li>Automation Workflow</li>
  <li>Content AI Optimization</li>
</ul>

<div class="highlight-box">
  <h3>🎯 Takeaway cho Marketer 2026</h3>

  <ul>
    <li>Biết dùng AI là lợi thế cạnh tranh lớn</li>
    <li>Content số lượng lớn sẽ không còn hiệu quả nếu thiếu chiều sâu</li>
    <li>SEO đang chuyển sang GEO và AI Search</li>
    <li>Creative + Strategy vẫn là thứ AI khó thay thế hoàn toàn</li>
    <li>Marketer tương lai sẽ là người biết kết hợp AI + tư duy chiến lược</li>
  </ul>
</div>

<h2>Kết luận</h2>

<p>AI đang thay đổi ngành Marketing nhanh hơn bất kỳ công nghệ nào trước đây. Từ content, quảng cáo, SEO đến chăm sóc khách hàng — mọi thứ đều đang được tự động hóa và tối ưu bằng dữ liệu.</p>

<p>Tuy nhiên, AI chỉ là công cụ. Người chiến thắng trong năm 2026 sẽ không phải là người dùng nhiều AI nhất, mà là người biết kết hợp AI với chiến lược, insight khách hàng và tư duy sáng tạo.</p>

<p>Nếu bạn đang làm marketing, đây không còn là lúc “nên học AI hay không”, mà là “học nhanh đến mức nào”.</p>

<!-- SEO Meta -->

<meta name="title" content="AI đang thay đổi ngành Marketing như thế nào trong 2026?" />
<meta name="description" content="Khám phá cách AI đang thay đổi ngành Marketing trong năm 2026: Content AI, SEO AI, GEO, quảng cáo tự động, chatbot AI và xu hướng marketer tương lai." />
<meta name="keywords" content="AI Marketing 2026, AI trong marketing, AI content marketing, GEO SEO, SEO AI 2026, AI quảng cáo, chatbot AI, AI viết content, xu hướng marketing 2026" />
    `
  },
  {
    id: 'meta-ads-thay-doi-2025',
    type: 'news',
    cat: 'AI & Công nghệ',
    title: 'Chính sách Meta Ads thay đổi mới nhất năm 2026',
    short: 'Meta Ads 2026 đang thay đổi mạnh với AI Ads, kiểm duyệt nội dung nghiêm ngặt hơn, siết tracking dữ liệu và ưu tiên trải nghiệm người dùng.',
    thumb: '/images/knowledge/Meta/post.jpg',
    ogImage: '/images/knowledge/Meta/thumb.jpg',
    date: '20/05/2026',
    readTime: '5 phút đọc',
    // ... các field cũ ...
    content: `
      <h1>Chính sách Meta Ads thay đổi mới nhất năm 2026</h1>

<p>Meta Ads đang bước vào giai đoạn thay đổi lớn nhất trong nhiều năm trở lại đây. Năm 2026, Meta không chỉ nâng cấp AI quảng cáo mà còn siết mạnh các chính sách liên quan đến nội dung, tracking dữ liệu và trải nghiệm người dùng.</p>

<p>Nếu bạn đang chạy Facebook Ads hoặc Instagram Ads, việc cập nhật chính sách Meta Ads mới nhất 2026 là điều bắt buộc để tránh khóa tài khoản, giảm CPM và duy trì hiệu quả chuyển đổi.</p>

<!-- SEO META -->

<meta name="title" content="Chính sách Meta Ads thay đổi mới nhất năm 2026" />
<meta name="description" content="Cập nhật chính sách Meta Ads mới nhất năm 2026: AI Ads, kiểm duyệt quảng cáo, tracking dữ liệu, risk score và cách tránh vi phạm Facebook Ads." />
<meta name="keywords" content="Chính sách Meta Ads 2026, Facebook Ads 2026, Meta Ads mới nhất, AI Meta Ads, Facebook Ads policy 2026, cập nhật Meta Ads" />

<!-- HEADER -->

<h2>1. Meta AI đang thay đổi toàn bộ hệ thống quảng cáo</h2>

<p>Meta hiện ưu tiên AI-driven advertising thay vì các thiết lập target thủ công như trước đây. Các công cụ như Advantage+ Audience, AI Creative Optimization và Automated Campaign đang được Meta đẩy mạnh trong năm 2026.</p>

<p>Điều này khiến advertiser phải thay đổi hoàn toàn tư duy chạy ads truyền thống.</p>

<h3>Những thay đổi đáng chú ý:</h3>

<ul>
  <li>Meta AI tự động tối ưu audience</li>
  <li>AI tự test nhiều creative cùng lúc</li>
  <li>Tự động tối ưu placement</li>
  <li>Machine Learning quyết định phân phối quảng cáo</li>
</ul>

<p>Hiện nay, Meta đang giảm dần độ hiệu quả của interest targeting và ưu tiên broad targeting kết hợp AI optimization.</p>

<!-- INTERNAL LINK -->

<p>Xem thêm:
<a href="https://www.portfoliobyson.site/kien-thuc/ai-thay-doi-marketing-2025">
AI đang thay đổi ngành Marketing như thế nào trong 2026?
</a>
</p>

<h2>2. Chính sách nội dung quảng cáo bị kiểm duyệt chặt hơn</h2>

<p>Một trong những thay đổi lớn nhất của Meta Ads 2026 là AI moderation. Meta hiện sử dụng AI để quét:</p>

<ul>
  <li>Text trong hình ảnh</li>
  <li>Voice trong video</li>
  <li>Landing page</li>
  <li>Comment và engagement</li>
</ul>

<h3>Các dạng content dễ bị hạn chế:</h3>

<ul>
  <li>Before/After quá mạnh</li>
  <li>Content gây tiêu cực</li>
  <li>Cam kết kết quả tuyệt đối</li>
  <li>Tiêu đề clickbait</li>
  <li>Hình ảnh nhạy cảm</li>
</ul>

<h3>Ví dụ vi phạm phổ biến:</h3>

<ul>
  <li>“Giảm 10kg sau 7 ngày”</li>
  <li>“Bạn đang già đi mỗi ngày mà không biết”</li>
  <li>“Da xấu như thế này là do bạn”</li>
</ul>

<p>Meta hiện ưu tiên content tự nhiên, educational content và UGC hơn các mẫu quảng cáo bán hàng trực diện.</p>

<h2>3. Meta siết tracking dữ liệu người dùng trong 2026</h2>

<p>Sau các thay đổi về quyền riêng tư từ Apple và châu Âu, Meta tiếp tục giảm khả năng tracking của Pixel truyền thống.</p>

<h3>Những thay đổi ảnh hưởng lớn:</h3>

<ul>
  <li>Retargeting kém chính xác hơn</li>
  <li>Lookalike Audience giảm hiệu quả</li>
  <li>Tracking conversion thiếu dữ liệu</li>
  <li>Attribution không còn chính xác tuyệt đối</li>
</ul>

<h3>Meta hiện ưu tiên:</h3>

<ul>
  <li>Conversions API (CAPI)</li>
  <li>Server-side tracking</li>
  <li>First-party data</li>
  <li>CRM integration</li>
</ul>

<p>Nếu doanh nghiệp chưa triển khai CAPI trong năm 2026, hiệu quả Facebook Ads sẽ giảm đáng kể.</p>

<!-- EXTERNAL LINK -->

<p>Nguồn tham khảo chính thức:
<a href="https://www.facebook.com/business/help" target="_blank" rel="nofollow noopener">
Meta Business Help Center
</a>
</p>

<h2>4. Tài khoản quảng cáo bị đánh giá bằng AI Risk Score</h2>

<p>Meta hiện sử dụng AI Risk Scoring để đánh giá chất lượng advertiser.</p>

<h3>Những yếu tố ảnh hưởng trust score:</h3>

<ul>
  <li>Lịch sử vi phạm policy</li>
  <li>Tỷ lệ feedback tiêu cực</li>
  <li>Landing page quality</li>
  <li>Comment tiêu cực</li>
  <li>Tỷ lệ ẩn quảng cáo</li>
</ul>

<h3>Dấu hiệu tài khoản đang bị hạn chế:</h3>

<ul>
  <li>CPM tăng bất thường</li>
  <li>Ads learning kéo dài</li>
  <li>Reach giảm mạnh</li>
  <li>Reject quảng cáo liên tục</li>
</ul>

<p>Meta hiện không chỉ đánh giá từng ads mà còn đánh giá:</p>

<ul>
  <li>Business Manager</li>
  <li>Domain</li>
  <li>Fanpage</li>
  <li>Payment Profile</li>
  <li>User behavior</li>
</ul>

<h2>5. Meta ưu tiên UGC và video ngắn</h2>

<p>Xu hướng creative Meta Ads 2026 đang nghiêng mạnh về short-form content và UGC video.</p>

<h3>Các định dạng đang được Meta ưu tiên:</h3>

<ul>
  <li>Facebook Reels Ads</li>
  <li>Instagram Reels</li>
  <li>Story Ads</li>
  <li>Click-to-message Ads</li>
</ul>

<h3>Creative hiệu quả trong 2026:</h3>

<ul>
  <li>Video review thật</li>
  <li>Content storytelling</li>
  <li>Educational content</li>
  <li>AI-assisted creative</li>
</ul>

<p>Các banner quá “salesy” đang giảm hiệu quả đáng kể.</p>

<!-- INTERNAL LINK -->

<p>Đọc thêm:
<a href="/kien-thuc/cach-viet-content-facebook-ads-chuyen-doi-cao">
Cách viết content Facebook Ads chuyển đổi cao
</a>
</p>

<h2>6. Meta ưu tiên trải nghiệm người dùng hơn conversion ngắn hạn</h2>

<p>Một thay đổi lớn trong 2026 là Meta bắt đầu đánh giá trải nghiệm tổng thể thay vì chỉ conversion.</p>

<h3>Meta đang đánh giá:</h3>

<ul>
  <li>Time on page</li>
  <li>Bounce rate</li>
  <li>Negative feedback</li>
  <li>User engagement</li>
  <li>Landing page speed</li>
</ul>

<p>Landing page load chậm hoặc UX kém có thể làm giảm hiệu quả phân phối quảng cáo.</p>

<h2>7. Cách thích nghi với chính sách Meta Ads mới năm 2026</h2>

<p>Để chạy Meta Ads hiệu quả trong năm 2026, advertiser cần thay đổi cách triển khai chiến dịch.</p>

<h3>Checklist tối ưu Meta Ads 2026:</h3>

<ul>
  <li>Sử dụng Conversions API</li>
  <li>Tăng first-party data</li>
  <li>Ưu tiên content tự nhiên</li>
  <li>Đầu tư video ngắn</li>
  <li>Giảm phụ thuộc vào interest targeting</li>
  <li>Tối ưu landing page UX</li>
  <li>Tuân thủ policy ngay từ creative</li>
</ul>

<!-- FAQ -->

<h2>FAQ - Câu hỏi thường gặp về chính sách Meta Ads 2026</h2>

<h3>Meta Ads 2026 thay đổi gì lớn nhất?</h3>

<p>Meta đang chuyển sang AI-driven advertising, giảm phụ thuộc vào target thủ công và tăng kiểm duyệt nội dung bằng AI.</p>

<h3>Pixel Facebook còn hiệu quả trong 2026 không?</h3>

<p>Có, nhưng Meta hiện ưu tiên Conversions API và server-side tracking để cải thiện độ chính xác dữ liệu.</p>

<h3>Tại sao quảng cáo Facebook dễ bị từ chối hơn?</h3>

<p>Meta đang dùng AI moderation để kiểm duyệt text, hình ảnh, video và landing page nghiêm ngặt hơn trước.</p>

<h3>Meta hiện ưu tiên loại quảng cáo nào?</h3>

<p>Meta ưu tiên UGC video, short-form video, Reels Ads và các nội dung mang tính tự nhiên.</p>

<h3>Làm sao để tránh khóa tài khoản quảng cáo?</h3>

<p>Doanh nghiệp nên tuân thủ policy, tránh content gây tiêu cực, tối ưu trust score và sử dụng domain chất lượng.</p>

<!-- FOOTER -->

<h2>Kết luận</h2>

<p>Chính sách Meta Ads năm 2026 đang thay đổi theo hướng AI-first, ưu tiên trải nghiệm người dùng và siết mạnh việc kiểm duyệt quảng cáo.</p>

<p>Advertiser cần tập trung vào content quality, dữ liệu first-party, creative tự nhiên và tối ưu trải nghiệm landing page để duy trì hiệu quả quảng cáo lâu dài.</p>

<p>Nếu bạn đang chạy Facebook Ads hoặc Instagram Ads, đây là thời điểm cần cập nhật chiến lược trước khi thuật toán mới ảnh hưởng trực tiếp đến chi phí quảng cáo và khả năng phân phối.</p>

<p><strong>Bạn đã gặp thay đổi nào khi chạy Meta Ads trong năm 2026?</strong> Hãy để lại bình luận để cùng thảo luận.</p>
    `
  },
  {
    id: 'brand-la-gi',
    type: 'branding',
    cat: 'Branding',
    title: 'Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?',
    short: 'Tìm hiểu Brand là gì, Branding là gì và cách xây dựng thương hiệu mạnh giúp doanh nghiệp tăng nhận diện, tạo niềm tin và phát triển bền vững trong 2026.',
    thumb: '/images/knowledge/Brandj/post.jpg',
    ogImage: '/images/knowledge/Brandj/thumb.jpg',
    date: '19/05/2026',
    readTime: '5 phút đọc',
    content: `
      <h1>Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?</h1>

<p>Rất nhiều người nghĩ rằng brand chỉ là logo, màu sắc hay slogan. Nhưng trên thực tế, brand là toàn bộ cảm nhận mà khách hàng nhớ về doanh nghiệp, sản phẩm hoặc cá nhân của bạn.</p>

<p>Trong thời đại cạnh tranh mạnh về content, quảng cáo và AI Marketing, thương hiệu không còn là “phần trang trí” mà trở thành yếu tố quyết định khách hàng có nhớ đến bạn hay không.</p>

<p>Nếu marketing giúp bạn tiếp cận khách hàng, thì branding giúp khách hàng nhớ và tin bạn lâu dài.</p>

<!-- SEO META -->

<meta name="title" content="Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?" />

<meta name="description" content="Tìm hiểu Brand là gì, Branding là gì và tại sao thương hiệu lại quan trọng trong Marketing hiện đại. Hướng dẫn xây dựng brand hiệu quả trong 2026." />

<meta name="keywords" content="Brand là gì, Branding là gì, xây dựng thương hiệu, brand marketing, thương hiệu doanh nghiệp, nhận diện thương hiệu, branding 2026" />

<!-- BODY -->

<h2>1. Brand là gì?</h2>

<p><strong>Brand (thương hiệu)</strong> là tổng hợp cảm nhận, suy nghĩ, trải nghiệm và niềm tin mà khách hàng dành cho một doanh nghiệp hoặc sản phẩm.</p>

<p>Brand không chỉ là:</p>

<ul>
  <li>Logo</li>
  <li>Màu sắc</li>
  <li>Font chữ</li>
  <li>Slogan</li>
</ul>

<p>Mà còn là:</p>

<ul>
  <li>Cảm xúc khách hàng</li>
  <li>Uy tín doanh nghiệp</li>
  <li>Trải nghiệm sử dụng</li>
  <li>Hình ảnh trong tâm trí khách hàng</li>
</ul>

<h3>Ví dụ dễ hiểu:</h3>

<p>Khi nhắc đến Apple, nhiều người nghĩ đến:</p>

<ul>
  <li>Tối giản</li>
  <li>Cao cấp</li>
  <li>Sáng tạo</li>
  <li>Khác biệt</li>
</ul>

<p>Đó chính là brand.</p>

<p>Brand là thứ tồn tại trong tâm trí khách hàng, không phải chỉ trên thiết kế.</p>

<h2>2. Branding là gì?</h2>

<p><strong>Branding</strong> là quá trình xây dựng và định hình thương hiệu trong tâm trí khách hàng.</p>

<p>Branding bao gồm:</p>

<ul>
  <li>Thiết kế nhận diện thương hiệu</li>
  <li>Định vị thương hiệu</li>
  <li>Chiến lược nội dung</li>
  <li>Trải nghiệm khách hàng</li>
  <li>Giọng điệu truyền thông</li>
  <li>Hình ảnh thương hiệu</li>
</ul>

<p>Nói đơn giản:</p>

<ul>
  <li>Brand = khách hàng nghĩ gì về bạn</li>
  <li>Branding = cách bạn tạo ra suy nghĩ đó</li>
</ul>

<h2>3. Tại sao Brand quan trọng?</h2>

<p>Trong năm 2026, người dùng nhìn thấy hàng nghìn quảng cáo mỗi ngày. Nếu không có thương hiệu rõ ràng, doanh nghiệp rất dễ bị quên lãng.</p>

<h3>Brand mạnh giúp:</h3>

<ul>
  <li>Tăng độ nhận diện</li>
  <li>Tăng tỷ lệ chuyển đổi</li>
  <li>Giảm chi phí quảng cáo</li>
  <li>Tăng lòng tin khách hàng</li>
  <li>Dễ scale marketing hơn</li>
</ul>

<h3>Ví dụ thực tế:</h3>

<p>Hai sản phẩm giống nhau nhưng thương hiệu mạnh thường:</p>

<ul>
  <li>Bán giá cao hơn</li>
  <li>Dễ được lựa chọn hơn</li>
  <li>Ít phụ thuộc vào giảm giá</li>
</ul>

<p>Đó là lý do branding ngày càng quan trọng trong digital marketing.</p>

<!-- INTERNAL LINK -->

<div class="related-post">

  <span class="related-label">📚 Xem thêm</span>

  <a 
    href="/kien-thuc/ai-thay-doi-marketing-2025"
    class="related-link"
  >
    AI đang thay đổi ngành Marketing như thế nào trong 2026?
  </a>

  <p>
    Khám phá cách AI đang thay đổi Content, SEO, Ads và hành vi người dùng trong năm 2026.
  </p>

</div>

<h2>4. Các yếu tố tạo nên một Brand mạnh</h2>

<h3>4.1 Định vị thương hiệu (Brand Positioning)</h3>

<p>Đây là cách thương hiệu muốn khách hàng ghi nhớ mình.</p>

<p>Ví dụ:</p>

<ul>
  <li>Giá rẻ</li>
  <li>Cao cấp</li>
  <li>Sáng tạo</li>
  <li>Chuyên gia</li>
  <li>Thân thiện</li>
</ul>

<p>Một brand mạnh luôn có định vị rõ ràng.</p>

<h3>4.2 Nhận diện thương hiệu</h3>

<p>Đây là phần visual của brand:</p>

<ul>
  <li>Logo</li>
  <li>Màu sắc</li>
  <li>Typography</li>
  <li>Website</li>
  <li>Social media</li>
</ul>

<p>Sự đồng nhất giúp khách hàng dễ nhận ra thương hiệu hơn.</p>

<h3>4.3 Brand Voice</h3>

<p>Brand voice là “cách thương hiệu nói chuyện”.</p>

<p>Một số phong cách phổ biến:</p>

<ul>
  <li>Chuyên nghiệp</li>
  <li>Trẻ trung</li>
  <li>Hài hước</li>
  <li>Cao cấp</li>
  <li>Công nghệ</li>
</ul>

<h3>4.4 Trải nghiệm khách hàng</h3>

<p>Brand không chỉ nằm ở quảng cáo mà còn nằm trong trải nghiệm thực tế.</p>

<p>Ví dụ:</p>

<ul>
  <li>Chất lượng sản phẩm</li>
  <li>Chăm sóc khách hàng</li>
  <li>Website UX/UI</li>
  <li>Quy trình mua hàng</li>
</ul>

<p>Trải nghiệm tốt sẽ giúp brand mạnh lên tự nhiên.</p>

<h2>5. Brand khác gì với Marketing?</h2>

<p>Rất nhiều người nhầm giữa branding và marketing.</p>

<h3>Marketing:</h3>

<ul>
  <li>Giúp bán hàng</li>
  <li>Tạo traffic</li>
  <li>Tạo lead</li>
  <li>Tăng chuyển đổi</li>
</ul>

<h3>Branding:</h3>

<ul>
  <li>Tạo niềm tin</li>
  <li>Tạo sự ghi nhớ</li>
  <li>Xây dựng cảm xúc</li>
  <li>Tạo giá trị dài hạn</li>
</ul>

<p>Nói đơn giản:</p>

<ul>
  <li>Marketing giúp khách mua lần đầu</li>
  <li>Brand giúp khách quay lại nhiều lần</li>
</ul>

<h2>6. Xu hướng Branding năm 2026</h2>

<p>Branding đang thay đổi mạnh trong thời đại AI và social media.</p>

<h3>Xu hướng branding mới:</h3>

<ul>
  <li>Personal Branding tăng mạnh</li>
  <li>Video-first branding</li>
  <li>AI-assisted branding</li>
  <li>Community-driven brand</li>
  <li>Authentic content</li>
</ul>

<p>Người dùng hiện không còn thích thương hiệu “quá corporate”. Họ ưu tiên:</p>

<ul>
  <li>Thật hơn</li>
  <li>Gần gũi hơn</li>
  <li>Có cá tính rõ hơn</li>
</ul>

<!-- EXTERNAL LINK -->

<p>Nguồn tham khảo:
<a href="https://www.shopify.com/blog/branding" target="_blank" rel="nofollow noopener">
Shopify - Branding Guide
</a>
</p>

<h2>7. Cách xây dựng Brand hiệu quả cho người mới</h2>

<h3>Bước 1: Xác định định vị</h3>

<p>Trả lời:</p>

<ul>
  <li>Bạn khác gì đối thủ?</li>
  <li>Khách hàng nhớ gì về bạn?</li>
  <li>Brand mang cảm giác gì?</li>
</ul>

<h3>Bước 2: Xây dựng nhận diện đồng nhất</h3>

<ul>
  <li>Logo</li>
  <li>Màu sắc</li>
  <li>Website</li>
  <li>Social media</li>
</ul>

<h3>Bước 3: Xây dựng content brand</h3>

<p>Content giúp thương hiệu được ghi nhớ lâu dài.</p>

<h3>Những content branding hiệu quả:</h3>

<ul>
  <li>Storytelling</li>
  <li>Case study</li>
  <li>Behind the scenes</li>
  <li>Educational content</li>
  <li>Founder story</li>
</ul>

<h3>Bước 4: Duy trì consistency</h3>

<p>Một brand mạnh luôn nhất quán trong:</p>

<ul>
  <li>Hình ảnh</li>
  <li>Thông điệp</li>
  <li>Giọng điệu</li>
  <li>Trải nghiệm</li>
</ul>

<h2>FAQ - Câu hỏi thường gặp về Brand</h2>

<h3>Brand có phải chỉ là logo không?</h3>

<p>Không. Logo chỉ là một phần nhỏ của brand. Thương hiệu là toàn bộ cảm nhận khách hàng dành cho doanh nghiệp.</p>

<h3>Branding có quan trọng với doanh nghiệp nhỏ không?</h3>

<p>Có. Branding giúp doanh nghiệp nhỏ tạo khác biệt và tăng độ tin tưởng dù ngân sách marketing không lớn.</p>

<h3>Branding và Marketing khác nhau thế nào?</h3>

<p>Marketing giúp tạo doanh số, còn branding giúp khách hàng nhớ và tin thương hiệu lâu dài.</p>

<h3>Personal Brand là gì?</h3>

<p>Personal Brand là thương hiệu cá nhân — cách người khác nhìn nhận và ghi nhớ về bạn.</p>

<h3>Làm Brand có cần chạy quảng cáo không?</h3>

<p>Không bắt buộc, nhưng quảng cáo có thể giúp thương hiệu được biết đến nhanh hơn.</p>

<!-- FOOTER -->

<h2>Kết luận</h2>

<p>Brand không chỉ là logo hay thiết kế đẹp. Một thương hiệu mạnh là thứ khiến khách hàng nhớ, tin và muốn quay lại.</p>

<p>Trong thời đại AI và digital marketing 2026, branding ngày càng trở thành lợi thế cạnh tranh quan trọng giúp doanh nghiệp khác biệt giữa hàng nghìn đối thủ.</p>

<p>Nếu marketing giúp bạn bán hàng hôm nay, thì brand giúp bạn tồn tại và phát triển trong nhiều năm tới.</p>

<p><strong>Theo bạn, điều quan trọng nhất để xây dựng một brand mạnh là gì?</strong> Hãy chia sẻ góc nhìn của bạn.</p>
    `
  },
  {
    id: 'facebook-ads-co-ban',
    type: 'branding',
    cat: 'Branding',
    title: 'Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?',
    short: 'Tìm hiểu Brand là gì, Branding là gì và cách xây dựng thương hiệu mạnh giúp doanh nghiệp tăng nhận diện, tạo niềm tin và phát triển bền vững trong 2026.',
    thumb: '/images/knowledge/Brandj/post.jpg',
    ogImage: '/images/knowledge/Brandj/thumb.jpg',
    date: '19/05/2026',
    readTime: '5 phút đọc',
    content: `
      <h2>Cấu trúc Facebook Ads</h2>
      <p>Facebook Ads có 3 tầng: <strong>Campaign → Ad Set → Ad</strong>. Hiểu đúng từng tầng sẽ giúp bạn tối ưu hiệu quả và tiết kiệm ngân sách.</p>

      <h2>1. Campaign — Mục tiêu</h2>
      <p>Chọn đúng mục tiêu campaign quyết định 50% thành công. Meta sẽ tối ưu theo mục tiêu bạn chọn.</p>
      <ul>
        <li><strong>Awareness</strong> — Tăng nhận diện thương hiệu</li>
        <li><strong>Traffic</strong> — Kéo người về website/landing page</li>
        <li><strong>Engagement</strong> — Tăng tương tác bài viết</li>
        <li><strong>Leads</strong> — Thu thập thông tin khách hàng</li>
        <li><strong>Sales</strong> — Tối ưu cho đơn hàng/conversion</li>
      </ul>

      <h2>2. Ad Set — Audience & Budget</h2>
      <p>Đây là nơi xác định <strong>ai sẽ thấy quảng cáo</strong> và bạn sẵn sàng trả bao nhiêu.</p>
      <ul>
        <li>Custom Audience từ danh sách khách hàng cũ</li>
        <li>Lookalike Audience — tìm người giống khách hàng tốt nhất</li>
        <li>Interest Targeting — nhắm theo sở thích</li>
        <li>Broad Targeting — để Meta tự tìm</li>
      </ul>

      <h2>3. Ad — Creative</h2>
      <p><strong>Creative là vũ khí cạnh tranh</strong> trong thời đại Advantage+. Ad tốt = Hook mạnh trong 3 giây đầu.</p>
      <blockquote>Ngân sách theo được thuật toán, nhưng creative theo được cảm xúc — và cảm xúc mới tạo ra hành động.</blockquote>

      <div class="highlight-box">
        <h3>⚡ Công thức Creative hiệu quả</h3>
        <ul>
          <li><strong>Hook</strong> — Câu mở đầu gây chú ý trong 3 giây</li>
          <li><strong>Problem</strong> — Chạm đúng nỗi đau khách hàng</li>
          <li><strong>Solution</strong> — Sản phẩm/dịch vụ của bạn giải quyết thế nào</li>
          <li><strong>Proof</strong> — Bằng chứng: số liệu, testimonial</li>
          <li><strong>CTA</strong> — Kêu gọi hành động rõ ràng</li>
        </ul>
      </div>
    `
  },
  {
    id: 'content-marketing-strategy',
    type: 'branding',
    cat: 'Branding',
    title: 'Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?',
    short: 'Tìm hiểu Brand là gì, Branding là gì và cách xây dựng thương hiệu mạnh giúp doanh nghiệp tăng nhận diện, tạo niềm tin và phát triển bền vững trong 2026.',
    thumb: '/images/knowledge/Brandj/post.jpg',
    ogImage: '/images/knowledge/Brandj/thumb.jpg',
    date: '19/05/2026',
    readTime: '5 phút đọc',
    content: `
      <h1>Content Marketing là gì? Chiến lược Content Marketing hiệu quả trong 2026</h1>

<p>Trong thời đại AI và Digital Marketing phát triển mạnh, người dùng không còn thích các quảng cáo bán hàng trực diện như trước. Thay vào đó, họ ưu tiên những thương hiệu mang lại giá trị, kiến thức và trải nghiệm thật.</p>

<p>Đó là lý do Content Marketing trở thành một trong những chiến lược quan trọng nhất trong năm 2026.</p>

<p>Content không chỉ giúp doanh nghiệp tăng nhận diện thương hiệu mà còn giúp tạo niềm tin, xây dựng cộng đồng và chuyển đổi khách hàng bền vững.</p>

<!-- SEO META -->

<meta name="title" content="Content Marketing là gì? Chiến lược Content Marketing hiệu quả trong 2026" />

<meta name="description" content="Tìm hiểu Content Marketing là gì, cách hoạt động và chiến lược Content Marketing hiệu quả giúp tăng nhận diện thương hiệu và chuyển đổi khách hàng trong 2026." />

<meta name="keywords" content="Content Marketing là gì, chiến lược content marketing, content marketing 2026, cách làm content marketing, content branding, content SEO" />

<!-- BODY -->

<h2>1. Content Marketing là gì?</h2>

<p><strong>Content Marketing</strong> là chiến lược tạo và phân phối nội dung có giá trị nhằm thu hút, xây dựng niềm tin và chuyển đổi khách hàng mục tiêu.</p>

<p>Content Marketing không đơn thuần là “đăng bài mỗi ngày”.</p>

<p>Một hệ thống content hiệu quả cần:</p>

<ul>
  <li>Đúng khách hàng mục tiêu</li>
  <li>Đúng insight</li>
  <li>Đúng hành trình mua hàng</li>
  <li>Có mục tiêu rõ ràng</li>
</ul>

<h3>Content có thể bao gồm:</h3>

<ul>
  <li>Bài viết blog</li>
  <li>Video TikTok/Reels</li>
  <li>Email marketing</li>
  <li>Case study</li>
  <li>Infographic</li>
  <li>Podcast</li>
  <li>Social media post</li>
</ul>

<p>Mục tiêu cuối cùng của Content Marketing là biến người xem thành khách hàng và khách hàng thành người tin tưởng thương hiệu.</p>

<h2>2. Tại sao Content Marketing quan trọng trong 2026?</h2>

<p>Người dùng hiện nay không còn muốn bị “bán hàng” liên tục.</p>

<p>Họ muốn:</p>

<ul>
  <li>Được cung cấp kiến thức</li>
  <li>Được giải quyết vấn đề</li>
  <li>Được truyền cảm hứng</li>
  <li>Được tin tưởng thương hiệu trước khi mua</li>
</ul>

<p>Đó là lý do Content Marketing ngày càng quan trọng.</p>

<h3>Content Marketing giúp:</h3>

<ul>
  <li>Tăng nhận diện thương hiệu</li>
  <li>Tăng traffic tự nhiên</li>
  <li>Tăng chuyển đổi</li>
  <li>Giảm chi phí quảng cáo</li>
  <li>Xây dựng cộng đồng khách hàng</li>
</ul>

<p>Trong thời đại AI Search và GEO SEO, content còn giúp thương hiệu được AI hiểu và đề xuất nhiều hơn.</p>

<!-- INTERNAL LINK -->

<div class="related-post">

  <span class="related-label">📚 Xem thêm</span>

  <a 
    href="/kien-thuc/brand-la-gi"
    class="related-link"
  >
    Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?
  </a>

  <p>
    Tìm hiểu cách thương hiệu giúp doanh nghiệp tăng độ tin tưởng và khác biệt trong thời đại AI Marketing.
  </p>

</div>

<h2>3. Các loại Content Marketing phổ biến</h2>

<h3>3.1 Blog Content</h3>

<p>Blog giúp doanh nghiệp:</p>

<ul>
  <li>Làm SEO</li>
  <li>Tăng traffic Google</li>
  <li>Xây topical authority</li>
  <li>Tăng trust thương hiệu</li>
</ul>

<p>Đây là dạng content quan trọng nhất cho SEO và GEO.</p>

<h3>3.2 Video Content</h3>

<p>Video đang là định dạng được ưu tiên mạnh trên:</p>

<ul>
  <li>TikTok</li>
  <li>Facebook Reels</li>
  <li>YouTube Shorts</li>
  <li>Instagram Reels</li>
</ul>

<p>Video ngắn giúp tăng reach và xây dựng thương hiệu nhanh hơn.</p>

<h3>3.3 Social Content</h3>

<p>Đây là các nội dung đăng trên:</p>

<ul>
  <li>Facebook</li>
  <li>LinkedIn</li>
  <li>Instagram</li>
  <li>Zalo</li>
</ul>

<p>Mục tiêu:</p>

<ul>
  <li>Giữ tương tác</li>
  <li>Xây cộng đồng</li>
  <li>Tăng độ nhận diện</li>
</ul>

<h3>3.4 Email Marketing</h3>

<p>Email giúp:</p>

<ul>
  <li>Nurture khách hàng</li>
  <li>Remarketing</li>
  <li>Tăng retention</li>
  <li>Tăng chuyển đổi dài hạn</li>
</ul>

<h2>4. Hệ thống Content Marketing hiện đại</h2>

<p>Một hệ thống content hiệu quả thường chia thành 3 tầng:</p>

<h3>TOFU — Top of Funnel</h3>

<p>Mục tiêu: Thu hút người mới.</p>

<h4>Nội dung phù hợp:</h4>

<ul>
  <li>Tips</li>
  <li>Kiến thức</li>
  <li>Xu hướng</li>
  <li>Sai lầm phổ biến</li>
</ul>

<h3>MOFU — Middle of Funnel</h3>

<p>Mục tiêu: Tăng niềm tin.</p>

<h4>Nội dung phù hợp:</h4>

<ul>
  <li>Case study</li>
  <li>Review</li>
  <li>So sánh giải pháp</li>
  <li>Quy trình làm việc</li>
</ul>

<h3>BOFU — Bottom of Funnel</h3>

<p>Mục tiêu: Chuyển đổi khách hàng.</p>

<h4>Nội dung phù hợp:</h4>

<ul>
  <li>Báo giá</li>
  <li>Ưu đãi</li>
  <li>Demo</li>
  <li>CTA mạnh</li>
</ul>

<h2>5. Content Marketing khác gì với quảng cáo?</h2>

<h3>Quảng cáo:</h3>

<ul>
  <li>Tiếp cận nhanh</li>
  <li>Có traffic ngay</li>
  <li>Phụ thuộc ngân sách</li>
</ul>

<h3>Content Marketing:</h3>

<ul>
  <li>Xây trust dài hạn</li>
  <li>Tạo organic traffic</li>
  <li>Tăng brand authority</li>
  <li>Hiệu quả bền vững hơn</li>
</ul>

<p>Một chiến lược marketing mạnh luôn kết hợp cả content và ads.</p>

<h2>6. Xu hướng Content Marketing năm 2026</h2>

<h3>6.1 AI-assisted Content</h3>

<p>AI đang giúp marketer:</p>

<ul>
  <li>Viết content nhanh hơn</li>
  <li>Tạo outline</li>
  <li>Phân tích insight</li>
  <li>Tối ưu SEO</li>
</ul>

<p>Tuy nhiên, content chỉ dùng AI mà thiếu trải nghiệm thật sẽ khó tạo trust.</p>

<h3>6.2 Video-first Content</h3>

<p>Short-form video tiếp tục là xu hướng lớn nhất.</p>

<p>Các nền tảng ưu tiên:</p>

<ul>
  <li>Reels</li>
  <li>TikTok</li>
  <li>Shorts</li>
</ul>

<h3>6.3 GEO SEO Content</h3>

<p>Content hiện không chỉ tối ưu cho Google mà còn phải tối ưu cho:</p>

<ul>
  <li>ChatGPT</li>
  <li>Gemini</li>
  <li>Perplexity</li>
  <li>AI Search</li>
</ul>

<p>Điều này khiến semantic content và topical authority ngày càng quan trọng.</p>

<!-- INTERNAL LINK -->

<div class="related-post">

  <span class="related-label">📚 Xem thêm</span>

  <a 
    href="/kien-thuc/ai-dang-thay-doi-nganh-marketing-nhu-the-nao-trong-2026"
    class="related-link"
  >
    AI đang thay đổi ngành Marketing như thế nào trong 2026?
  </a>

  <p>
    Khám phá cách AI đang thay đổi SEO, Content, Ads và hành vi người dùng trong thời đại AI Search.
  </p>

</div>

<h2>7. Cách xây dựng chiến lược Content Marketing hiệu quả</h2>

<h3>Bước 1: Xác định khách hàng mục tiêu</h3>

<p>Content hiệu quả bắt đầu từ insight khách hàng.</p>

<h3>Bước 2: Chọn đúng nền tảng</h3>

<ul>
  <li>TikTok → reach nhanh</li>
  <li>Facebook → cộng đồng</li>
  <li>LinkedIn → B2B</li>
  <li>Blog → SEO dài hạn</li>
</ul>

<h3>Bước 3: Xây content pillar</h3>

<p>Mỗi thương hiệu nên có 3–5 content pillar chính.</p>

<h4>Ví dụ:</h4>

<ul>
  <li>Kiến thức</li>
  <li>Case study</li>
  <li>Behind the scenes</li>
  <li>Review khách hàng</li>
  <li>Xu hướng thị trường</li>
</ul>

<h3>Bước 4: Duy trì consistency</h3>

<p>Content Marketing là cuộc chơi dài hạn.</p>

<p>Người thắng thường không phải người đăng nhiều nhất, mà là người duy trì đều nhất.</p>

<!-- EXTERNAL LINK -->

<p>Nguồn tham khảo:
<a href="https://contentmarketinginstitute.com/" target="_blank" rel="nofollow noopener">
Content Marketing Institute
</a>
</p>

<h2>FAQ - Câu hỏi thường gặp về Content Marketing</h2>

<h3>Content Marketing có cần chạy quảng cáo không?</h3>

<p>Không bắt buộc, nhưng kết hợp content và ads sẽ giúp tăng hiệu quả nhanh hơn.</p>

<h3>Content Marketing có phù hợp với B2B không?</h3>

<p>Có. B2B thậm chí cần content nhiều hơn để xây trust và giáo dục khách hàng.</p>

<h3>Content Marketing mất bao lâu để hiệu quả?</h3>

<p>Thông thường cần từ 3–6 tháng để thấy hiệu quả rõ rệt nếu làm đúng chiến lược.</p>

<h3>AI có thay thế Content Marketing không?</h3>

<p>Không. AI chỉ hỗ trợ sản xuất content nhanh hơn, nhưng insight và trải nghiệm thật vẫn là yếu tố quan trọng.</p>

<h3>Nên ưu tiên video hay blog?</h3>

<p>Tốt nhất nên kết hợp cả hai: video để tăng reach, blog để xây SEO dài hạn.</p>

<!-- FOOTER -->

<h2>Kết luận</h2>

<p>Content Marketing không còn là “đăng bài cho có”. Trong thời đại AI và digital marketing 2026, content chính là cách thương hiệu xây dựng niềm tin và tạo lợi thế cạnh tranh lâu dài.</p>

<p>Một hệ thống content tốt giúp doanh nghiệp:</p>

<ul>
  <li>Được nhớ đến</li>
  <li>Được tin tưởng</li>
  <li>Được tìm thấy trên Google và AI Search</li>
  <li>Chuyển đổi khách hàng bền vững hơn</li>
</ul>

<p><strong>Theo bạn, điều khó nhất khi làm Content Marketing hiện nay là gì?</strong> Hãy chia sẻ góc nhìn của bạn.</p>
    `
  },
  {
    id: 'tiktok-ads-2025',
    type: 'branding',
    cat: 'Branding',
    title: 'Brand là gì? Tại sao Branding quan trọng trong Marketing hiện đại?',
    short: 'Tìm hiểu Brand là gì, Branding là gì và cách xây dựng thương hiệu mạnh giúp doanh nghiệp tăng nhận diện, tạo niềm tin và phát triển bền vững trong 2026.',
    thumb: '/images/knowledge/Brandj/post.jpg',
    ogImage: '/images/knowledge/Brandj/thumb.jpg',
    date: '19/05/2026',
    readTime: '5 phút đọc',
    content: `
      <h2>Tại sao TikTok là cơ hội vàng năm 2025?</h2>
      <p>TikTok đang có <strong>hơn 100 triệu người dùng tại Đông Nam Á</strong>, với chi phí quảng cáo vẫn thấp hơn Facebook 40-60%. Đây là cửa sổ cơ hội trước khi thị trường bão hòa.</p>

      <h2>TikTok Shop — Social Commerce</h2>
      <p>TikTok Shop kết hợp giải trí và mua sắm trong cùng một trải nghiệm. Người dùng xem video → thấy sản phẩm → mua ngay mà không cần rời app.</p>
      <ul>
        <li>Live Shopping: Doanh thu từ livestream tăng 300% YoY</li>
        <li>In-feed Shopping: Gắn sản phẩm trực tiếp vào video</li>
        <li>Affiliate: Hợp tác KOC/KOL bán hàng ăn hoa hồng</li>
      </ul>

      <h2>TikTok Ads — Format hiệu quả nhất</h2>
      <ul>
        <li><strong>In-feed Ads</strong> — Xuất hiện tự nhiên trong For You Page</li>
        <li><strong>TopView</strong> — Hiển thị đầu tiên khi mở app, tỉ lệ xem cao</li>
        <li><strong>Spark Ads</strong> — Boost organic content của chính bạn</li>
        <li><strong>Collection Ads</strong> — Kết hợp video + product catalog</li>
      </ul>

      <blockquote>Trên TikTok, nội dung tốt > ngân sách lớn. Một video viral có thể mang về hàng triệu đồng doanh thu mà không tốn xu quảng cáo nào.</blockquote>

      <div class="highlight-box">
        <h3>📱 Bắt đầu với TikTok Ads như thế nào?</h3>
        <ul>
          <li>Tạo tài khoản TikTok Business và TikTok Shop</li>
          <li>Sản xuất 3-5 video organic trước khi chạy paid</li>
          <li>Test với ngân sách nhỏ 200-500k/ngày</li>
          <li>Tập trung vào hook 3 giây đầu</li>
          <li>Dùng Spark Ads để boost video organic đang tốt</li>
        </ul>
      </div>
    `
  }
];

// ─── ECOSYSTEM DATA ────────────────────────────────────────────────────────

const depts = [
  {
    icon: '🏷️', name: 'Branding',
    desc: 'Xây dựng nhận diện, cảm xúc và giá trị thương hiệu — nền tảng của mọi hoạt động marketing.',
    color: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)', ai: 45,
    roles:   ['Brand Executive', 'Brand Manager', 'Creative Planner', 'Communication Executive', 'Brand Strategist'],
    skills:  ['Brand Strategy', 'Consumer Insight', 'Storytelling', 'Market Research', 'Visual Identity', 'Brand Guideline'],
    tools:   ['Figma', 'Illustrator', 'Photoshop', 'Notion', 'Canva'],
    aiUses:  ['AI brainstorm campaign', 'AI viết brand concept', 'AI tạo moodboard', 'AI phân tích insight', 'AI generate logo idea', 'AI competitor analysis'],
  },
  {
    icon: '⚡', name: 'Performance',
    desc: 'Tối ưu quảng cáo trả phí đa kênh — Facebook Ads, Google Ads, TikTok Ads để đạt ROAS cao nhất.',
    color: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.2)', ai: 82,
    roles:   ['Performance Marketer', 'Media Buyer', 'Ads Specialist', 'Growth Hacker', 'PPC Manager'],
    skills:  ['Facebook Ads', 'Google Ads', 'TikTok Ads', 'A/B Testing', 'Conversion Optimization', 'ROAS / CPA'],
    tools:   ['Meta Ads Manager', 'Google Ads', 'TikTok Ads Manager', 'Google Tag Manager', 'Data Studio'],
    aiUses:  ['AI tối ưu bidding tự động', 'AI generate ad creative', 'AI phân tích audience', 'AI dự đoán ROAS', 'AI viết ad copy', 'Meta Advantage+'],
  },
  {
    icon: '✍️', name: 'Content',
    desc: 'Xây dựng chiến lược nội dung, sản xuất content đa nền tảng và tối ưu engagement.',
    color: 'rgba(230,48,34,0.06)', border: 'rgba(230,48,34,0.18)', ai: 88,
    roles:   ['Content Strategist', 'Copywriter', 'Content Creator', 'Social Content', 'Editorial Manager'],
    skills:  ['Copywriting', 'Content Calendar', 'Storytelling', 'SEO Writing', 'Hook Writing', 'Brand Voice'],
    tools:   ['Notion', 'WordPress', 'Canva', 'ChatGPT', 'Hemingway'],
    aiUses:  ['AI viết bài tự động', 'AI tối ưu headline', 'AI lên content calendar', 'AI phân tích engagement', 'AI repurpose content', 'AI viết caption MXH'],
  },
  {
    icon: '📱', name: 'Social Media',
    desc: 'Quản trị fanpage, xây dựng cộng đồng và tối ưu organic reach trên các nền tảng MXH.',
    color: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.2)', ai: 60,
    roles:   ['Social Media Manager', 'Community Manager', 'Social Strategist', 'Influencer Manager', 'Page Admin'],
    skills:  ['Facebook Management', 'TikTok Strategy', 'Community Building', 'Influencer Marketing', 'Viral Content', 'Live Selling'],
    tools:   ['Meta Business Suite', 'Buffer', 'Hootsuite', 'TikTok Studio', 'Sprout Social'],
    aiUses:  ['AI lên lịch đăng bài', 'AI phân tích hashtag', 'AI gợi ý trend', 'AI tạo caption nhanh', 'AI báo cáo tự động'],
  },
  {
    icon: '🔍', name: 'SEO / GEO',
    desc: 'Tối ưu công cụ tìm kiếm truyền thống và AI — từ technical SEO đến GEO (Generative Engine Optimization).',
    color: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)', ai: 72,
    roles:   ['SEO Specialist', 'SEO Manager', 'Technical SEO', 'Content SEO', 'GEO Strategist'],
    skills:  ['On-page SEO', 'Technical SEO', 'Link Building', 'Keyword Research', 'GEO / AI Search', 'Core Web Vitals'],
    tools:   ['Ahrefs', 'SEMrush', 'Google Search Console', 'Screaming Frog', 'SurferSEO'],
    aiUses:  ['AI viết meta description', 'AI cluster từ khóa', 'AI tối ưu schema', 'AI phân tích backlink', 'AI cho AI Overview citation', 'AI content brief'],
  },
  {
    icon: '🎨', name: 'Design',
    desc: 'Thiết kế ấn phẩm truyền thông, visual identity và UI/UX cho các kênh digital và print.',
    color: 'rgba(244,114,182,0.06)', border: 'rgba(244,114,182,0.2)', ai: 70,
    roles:   ['Graphic Designer', 'Visual Designer', 'UI/UX Designer', 'Art Director', 'Motion Designer'],
    skills:  ['Visual Design', 'Typography', 'Color Theory', 'UI/UX', 'Motion Graphics', 'Brand Collateral'],
    tools:   ['Photoshop', 'Illustrator', 'Figma', 'After Effects', 'Canva', 'Midjourney'],
    aiUses:  ['AI generate hình ảnh', 'AI xóa phông tự động', 'AI tạo mockup', 'AI upscale ảnh', 'AI tạo animation', 'Canva AI magic design'],
  },
  {
    icon: '🎬', name: 'Video',
    desc: 'Sản xuất video quảng cáo, short-form content cho TikTok, Reels và YouTube.',
    color: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.2)', ai: 78,
    roles:   ['Video Producer', 'Video Editor', 'Motion Designer', 'Content Videographer', 'TikToker'],
    skills:  ['Video Editing', 'Color Grading', 'Script Writing', 'Short-form Video', 'Motion Graphics', 'Hook Strategy'],
    tools:   ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'TikTok Studio'],
    aiUses:  ['AI generate video (Kling/Sora)', 'AI dựng tự động', 'AI viết script', 'AI tạo voice-over', 'AI auto subtitle', 'AI color grade'],
  },
  {
    icon: '🔗', name: 'CRM & Auto',
    desc: 'Tự động hoá marketing, quản lý khách hàng và xây dựng hệ thống nurturing hiệu quả.',
    color: 'rgba(34,211,238,0.06)', border: 'rgba(34,211,238,0.2)', ai: 80,
    roles:   ['CRM Manager', 'Marketing Automation', 'Email Marketer', 'Customer Success', 'RevOps'],
    skills:  ['Email Marketing', 'Marketing Automation', 'CRM Management', 'Lead Nurturing', 'Segmentation', 'A/B Testing'],
    tools:   ['HubSpot', 'Mailchimp', 'ActiveCampaign', 'Klaviyo', 'Zapier'],
    aiUses:  ['AI cá nhân hoá email', 'AI phân đoạn khách hàng', 'AI dự đoán churn', 'AI gợi ý upsell', 'AI chatbot CSKH', 'AI tối ưu send time'],
  },
  {
    icon: '📊', name: 'Analytics',
    desc: 'Đo lường hiệu quả marketing, phân tích dữ liệu và đưa ra quyết định dựa trên data.',
    color: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', ai: 85,
    roles:   ['Marketing Analyst', 'Data Analyst', 'BI Analyst', 'Growth Analyst', 'Performance Analyst'],
    skills:  ['Google Analytics', 'Data Visualization', 'Attribution Modeling', 'Cohort Analysis', 'SQL Cơ bản', 'Dashboard'],
    tools:   ['GA4', 'Looker Studio', 'Meta Pixel', 'Mixpanel', 'Google Sheets'],
    aiUses:  ['AI phân tích báo cáo', 'AI dự đoán xu hướng', 'AI tạo dashboard tự động', 'AI anomaly detection', 'AI insight từ data', 'AI viết báo cáo'],
  },
  {
    icon: '🤖', name: 'AI Marketing',
    desc: 'Ứng dụng AI vào toàn bộ quy trình Marketing — từ research, sáng tạo đến tối ưu và đo lường.',
    color: 'rgba(230,48,34,0.06)', border: 'rgba(230,48,34,0.18)', ai: 98,
    roles:   ['AI Marketing Specialist', 'Prompt Engineer', 'AI Content Lead', 'AI Ads Manager', 'Marketing Technologist'],
    skills:  ['Prompt Engineering', 'AI Workflow Design', 'LLM Integration', 'AI Tool Evaluation', 'Automation', 'AI Ethics'],
    tools:   ['ChatGPT', 'Claude', 'Midjourney', 'Kling AI', 'Make.com', 'Zapier AI'],
    aiUses:  ['AI làm tất cả mọi thứ 😄', 'Prompt marketing chuyên sâu', 'AI workflow end-to-end', 'Multi-agent automation', 'AI brand voice training', 'AI performance loop'],
  },
];

// ─── END ECOSYSTEM DATA ────────────────────────────────────────────────────

function getSiteUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /');
});

// Webhook bí mật để xóa cache thủ công
app.get('/api/refresh-cache', (req, res) => {
  const secret = req.query.secret;
  // Thay 'mat-khau-bi-mat-cua-son' bằng mật khẩu bạn muốn
  if (secret !== 'mat-khau-bi-mat-cua-son') {
    return res.status(403).send('❌ Từ chối truy cập: Sai mã bí mật!');
  }
  clearCache();
  res.send('✅ Đã xóa cache thành công! Lần tải trang tiếp theo sẽ lấy dữ liệu mới nhất từ Google Sheets.');
});

app.get('/sitemap.xml', async (req, res) => {
  const data = await getCachedData();
  const baseUrl = getSiteUrl(req);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Các trang tĩnh
  const staticPages = ['', '/kien-thuc', '/ecosystem', '/content-os'];
  staticPages.forEach(page => {
    xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // Các trang chi tiết Dự án
  data.projects.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/projects/${p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Các trang chi tiết Kiến thức
  data.knowledge.forEach(k => {
    xml += `  <url>\n    <loc>${baseUrl}/kien-thuc/${k.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/ecosystem', async (req, res) => {
  const data = await getCachedData();
  res.render('ecosystem/index', { siteUrl: getSiteUrl(req), depts: data.depts });
});

app.get('/content-os', (req, res) => {
  res.render('content-os/index', { siteUrl: getSiteUrl(req) });
});

app.post('/api/generate-content', async (req, res) => {
  try {
    const { buildContentPrompt } = require('./services/prompt.service.js');
    const promptData = buildContentPrompt(req.body);
    
    // Gọi API của LLM tại đây (OpenAI, Gemini, v.v.)
    // Ví dụ với OpenAI:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: promptData.messages,
        response_format: { type: 'json_object' }
      })
    });
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return res.json(content);
    */

    // Dữ liệu Mock mô phỏng AI trả về hợp lệ (để test khi chưa gắn API Key)
    res.json({
      title: "Content OS: Viết tự động - Nhất quán hệ thống",
      titleReason: "Gây chú ý ngay từ headline, giải quyết được pain point lặp đi lặp lại.",
      opening: "Bạn vẫn đang đau đầu vì phải viết bài mỗi ngày mà không thấy sự gắn kết?",
      openingReason: "Đánh thẳng vào nỗi đau của Content Creator.",
      body: [{ text: "Content OS giúp bạn xây dựng một hệ thống rõ ràng.", why: "Giới thiệu giải pháp" }],
      cta: "Thử Content OS ngay hôm nay!",
      ctaReason: "Kêu gọi hành động ngắn gọn, trực diện.",
      hashtags: ["#ContentOS", "#Marketing", "#AI"],
      copyVersion: "Content OS: Viết tự động - Nhất quán hệ thống\n\nBạn vẫn đang đau đầu vì phải viết bài mỗi ngày mà không thấy sự gắn kết?\n\nContent OS giúp bạn xây dựng một hệ thống rõ ràng.\n\nThử Content OS ngay hôm nay!\n\n#ContentOS #Marketing #AI",
      visualSuggestions: [{ label: "Hook", text: "Hết ý tưởng?", sub: "Dùng Content OS" }]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.get('/download-cv', (req, res) => {
  const file = path.join(__dirname, 'public', 'files', 'CV_Tran_Hong_Son.pdf');
  res.download(file, 'CV_TranHongSon_Marketing.pdf');
});

app.use((error, req, res, next) => {
  if (!error) return next();
  if (req.path.startsWith('/api/')) {
    return res.status(error.status || 500).json({
      error: 'API_REQUEST_FAILED',
      code: error.type || 'SERVER_ERROR',
      message: error.type === 'entity.parse.failed' ? 'Invalid JSON body.' : 'API request failed.'
    });
  }
  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
