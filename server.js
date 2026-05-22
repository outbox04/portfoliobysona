const express = require('express');
const compression = require('compression');
const path = require('path');

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

app.get('/', (req, res) => {
  res.render('index', { 
    siteUrl: getSiteUrl(req), 
    projects,
    knowledge
  });
});

app.get('/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.redirect('/');
  const related = projects.filter(p => p.cat === project.cat && p.id !== project.id).slice(0, 3);
  res.render('projects/detail', { siteUrl: getSiteUrl(req), project, related, projects });
});

app.get('/kien-thuc', (req, res) => {
  res.render('kien-thuc/index', {
    siteUrl: getSiteUrl(req),
    knowledge
  });
});

app.get('/kien-thuc/:id', (req, res) => {
  const article = knowledge.find(k => k.id === req.params.id);
  if (!article) return res.redirect('/kien-thuc');
  const related = knowledge
    .filter(k => k.cat === article.cat && k.id !== article.id)
    .slice(0, 3);
  res.render('kien-thuc/detail', {
    siteUrl: getSiteUrl(req),
    article,
    related,
    knowledge
  });
});

const knowledge = [
  {
    id: 'ai-thay-doi-marketing-2025',
    type: 'news',
    cat: 'AI & Công nghệ',
    title: 'AI đang thay đổi ngành Marketing như thế nào trong 2025?',
    short: 'Từ tự động hóa content...',
    thumb: '/images/knowledge/news-01.jpg',
    date: '15/05/2025',
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
    // ... các field cũ ...
    content: `
      <h2>Meta Ads 2025 có gì thay đổi?</h2>
      <p>Meta liên tục cập nhật thuật toán và chính sách quảng cáo. Nắm rõ để không lãng phí ngân sách.</p>

      <h2>1. Advantage+ Shopping Campaign</h2>
      <p>Meta đang đẩy mạnh <strong>Advantage+</strong> — hệ thống tự động hóa toàn bộ quảng cáo từ targeting đến creative.</p>

      <h2>2. Thay đổi về Tracking</h2>
      <p>iOS 17 và các chính sách privacy mới ảnh hưởng đến khả năng tracking. Cần chuyển sang <strong>Conversions API</strong> để đảm bảo data chính xác.</p>
      <blockquote>First-party data là tài sản quý giá nhất của doanh nghiệp trong kỷ nguyên privacy-first.</blockquote>

      <div class="highlight-box">
        <h3>⚡ Checklist tối ưu Meta Ads 2025</h3>
        <ul>
          <li>Cài đặt Conversions API</li>
          <li>Test Advantage+ Campaign</li>
          <li>Xây dựng first-party data</li>
          <li>Đa dạng hóa creative format</li>
        </ul>
      </div>
    `
  },
  {
    id: 'brand-la-gi',
    // ... các field cũ ...
    content: `
      <h2>Brand là gì?</h2>
      <p>Brand không phải là logo, màu sắc hay slogan. <em>Brand là cảm xúc và niềm tin mà khách hàng có về bạn khi bạn không có mặt trong phòng.</em></p>

      <h2>Tại sao Branding quan trọng?</h2>
      <p>Doanh nghiệp có brand mạnh có thể bán giá cao hơn, giữ chân khách hàng lâu hơn và tốn ít chi phí marketing hơn trong dài hạn.</p>
      <ul>
        <li><strong>Apple</strong> bán điện thoại đắt hơn đối thủ 30-50% vì brand</li>
        <li><strong>Nike</strong> bán cảm giác chiến thắng, không phải giày</li>
        <li>Khách hàng trung thành của brand mạnh ít nhạy cảm với giá hơn</li>
      </ul>

      <h2>5 yếu tố tạo nên Brand mạnh</h2>
      <ul>
        <li><strong>Purpose</strong> — Tại sao bạn tồn tại ngoài việc kiếm tiền?</li>
        <li><strong>Positioning</strong> — Bạn khác gì so với đối thủ?</li>
        <li><strong>Personality</strong> — Nếu brand là người, người đó như thế nào?</li>
        <li><strong>Visual Identity</strong> — Logo, màu sắc, typography nhất quán</li>
        <li><strong>Voice & Tone</strong> — Cách bạn nói chuyện với khách hàng</li>
      </ul>

      <blockquote>Brand là lời hứa bạn đưa ra với khách hàng — và mọi điểm chạm đều phải thực hiện lời hứa đó.</blockquote>

      <div class="highlight-box">
        <h3>🏷️ Bắt đầu xây dựng Brand từ đâu?</h3>
        <ul>
          <li>Xác định rõ Why — Simon Sinek's Golden Circle</li>
          <li>Nghiên cứu đối thủ để tìm khoảng trắng</li>
          <li>Phỏng vấn 10 khách hàng tốt nhất để hiểu họ thấy gì ở bạn</li>
          <li>Viết Brand Statement một câu rõ ràng</li>
        </ul>
      </div>
    `
  },
  {
    id: 'facebook-ads-co-ban',
    // ... các field cũ ...
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
    // ... các field cũ ...
    content: `
      <h2>Content Marketing là gì?</h2>
      <p>Content Marketing là chiến lược tạo ra và phân phối nội dung có giá trị, liên quan và nhất quán để thu hút và giữ chân khách hàng mục tiêu — từ đó thúc đẩy hành động có lợi cho doanh nghiệp.</p>

      <h2>Content Pillar — Nền tảng hệ thống</h2>
      <p>Thay vì đăng bài ngẫu hứng, hãy xây dựng <strong>Content Pillar</strong> — 3-5 chủ đề cốt lõi phản ánh chuyên môn và giá trị thương hiệu.</p>
      <ul>
        <li><strong>Educational</strong> — Dạy khách hàng điều gì đó hữu ích</li>
        <li><strong>Inspirational</strong> — Truyền cảm hứng, kể câu chuyện</li>
        <li><strong>Entertaining</strong> — Giải trí, tăng kết nối cảm xúc</li>
        <li><strong>Promotional</strong> — Quảng bá sản phẩm/dịch vụ (tối đa 20%)</li>
      </ul>

      <h2>Content Funnel — Dẫn dắt hành trình</h2>
      <ul>
        <li><strong>TOFU</strong> (Top of Funnel) — Nội dung thu hút người chưa biết đến bạn</li>
        <li><strong>MOFU</strong> (Middle) — Nuôi dưỡng người đang cân nhắc</li>
        <li><strong>BOFU</strong> (Bottom) — Chuyển đổi người sắp mua hàng</li>
      </ul>

      <blockquote>Content tốt không phải là content được nhiều like — mà là content dẫn dắt đúng người đến đúng hành động.</blockquote>

      <div class="highlight-box">
        <h3>✍️ Quy trình xây dựng Content System</h3>
        <ul>
          <li>Xác định 3-5 Content Pillar phù hợp thương hiệu</li>
          <li>Lập Content Calendar tối thiểu 4 tuần trước</li>
          <li>Tạo 1 hero content/tuần, repurpose thành nhiều micro content</li>
          <li>Đo lường: Reach, Engagement, Click, Conversion</li>
          <li>Tối ưu dựa trên data, không dựa trên cảm tính</li>
        </ul>
      </div>
    `
  },
  {
    id: 'tiktok-ads-2025',
    // ... các field cũ ...
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

app.get('/', (req, res) => {
  res.render('index', { siteUrl: getSiteUrl(req), projects });
});

app.get('/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.redirect('/');
  const related = projects.filter(p => p.cat === project.cat && p.id !== project.id).slice(0, 3);
  res.render('projects/detail', { siteUrl: getSiteUrl(req), project, related, projects });
});

app.get('/kien-thuc', (req, res) => {
  res.render('kien-thuc', { siteUrl: getSiteUrl(req) });
});

app.get('/ecosystem', (req, res) => {
  res.render('ecosystem/index', { siteUrl: getSiteUrl(req), depts });
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
