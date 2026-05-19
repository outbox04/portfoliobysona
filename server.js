const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Knowledge & News data
const knowledge = [
  {
    id: 'ai-thay-doi-marketing-2025',
    type: 'news',
    cat: 'AI & Công nghệ',
    title: 'AI đang thay đổi ngành Marketing như thế nào trong 2025?',
    short: 'Từ tự động hóa content, cá nhân hóa quảng cáo đến chatbot — AI đang tái định hình toàn bộ cách doanh nghiệp tiếp cận khách hàng.',
    thumb: '/images/knowledge/news-01.jpg',
    date: '15/05/2025',
    readTime: '5 phút đọc'
  },
  {
    id: 'meta-ads-thay-doi-2025',
    type: 'news',
    cat: 'Performance',
    title: 'Meta Ads 2025: Những thay đổi lớn ảnh hưởng ngân sách quảng cáo',
    short: 'Meta liên tục cập nhật thuật toán và chính sách — hiểu đúng để không lãng phí ngân sách và tối ưu hiệu quả chiến dịch.',
    thumb: '/images/knowledge/news-02.jpg',
    date: '10/05/2025',
    readTime: '4 phút đọc'
  },
  {
    id: 'brand-la-gi',
    type: 'knowledge',
    cat: 'Branding',
    title: 'Brand là gì? Tại sao Branding quan trọng hơn bạn nghĩ?',
    short: 'Brand không phải logo, không phải màu sắc — đó là cảm xúc và niềm tin khách hàng dành cho bạn. Hiểu đúng để xây đúng.',
    thumb: '/images/knowledge/know-01.jpg',
    date: '05/05/2025',
    readTime: '6 phút đọc'
  },
  {
    id: 'facebook-ads-co-ban',
    type: 'knowledge',
    cat: 'Performance',
    title: 'Facebook Ads từ A-Z: Cấu trúc chiến dịch và tư duy tối ưu',
    short: 'Hướng dẫn toàn diện về cấu trúc Campaign > Ad Set > Ad và tư duy tối ưu để đạt ROAS cao nhất với ngân sách tối thiểu.',
    thumb: '/images/knowledge/know-02.jpg',
    date: '01/05/2025',
    readTime: '8 phút đọc'
  },
  {
    id: 'content-marketing-strategy',
    type: 'knowledge',
    cat: 'Content',
    title: 'Content Marketing Strategy: Xây dựng hệ thống nội dung bền vững',
    short: 'Content không phải đăng bài hàng ngày — đó là hệ thống giá trị giúp thu hút đúng người, nuôi dưỡng niềm tin và chuyển đổi.',
    thumb: '/images/knowledge/know-03.jpg',
    date: '28/04/2025',
    readTime: '7 phút đọc'
  },
  {
    id: 'tiktok-ads-2025',
    type: 'news',
    cat: 'AI & Công nghệ',
    title: 'TikTok Shop & TikTok Ads 2025: Cơ hội vàng cho doanh nghiệp vừa và nhỏ',
    short: 'TikTok đang mở ra kỷ nguyên social commerce mới — doanh nghiệp nào nắm bắt sớm sẽ có lợi thế cạnh tranh vượt trội.',
    thumb: '/images/knowledge/news-03.jpg',
    date: '20/04/2025',
    readTime: '5 phút đọc'
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
      <h2>AI đang thay đổi ngành Marketing như thế nào?</h2>
      <p>Trí tuệ nhân tạo không còn là công nghệ của tương lai — nó đang hiện diện trong từng chiến dịch marketing ngay hôm nay.</p>

      <h2>1. Tự động hóa Content</h2>
      <p>Các công cụ như <strong>ChatGPT, Gemini, Claude</strong> giúp marketer tạo nội dung nhanh hơn 10 lần mà không mất chất lượng.</p>
      <ul>
        <li>Viết caption, script video, email marketing</li>
        <li>Tạo biến thể A/B test cho ad copy</li>
        <li>Tóm tắt báo cáo và dữ liệu phức tạp</li>
      </ul>

      <h2>2. Cá nhân hóa Quảng cáo</h2>
      <p>Meta và Google tích hợp AI sâu vào hệ thống quảng cáo. <strong>Advantage+ của Meta</strong> tự động tối ưu audience, placement và creative.</p>
      <blockquote>AI không thay thế marketer giỏi. AI thay thế marketer không chịu học AI.</blockquote>

      <h2>3. Phân tích và Dự đoán</h2>
      <p>AI phân tích hành vi khách hàng, dự đoán xu hướng mua hàng và đề xuất thời điểm tối ưu để tiếp cận.</p>

      <div class="highlight-box">
        <h3>💡 Takeaway cho Marketer</h3>
        <ul>
          <li>Học cách viết prompt hiệu quả</li>
          <li>Tích hợp AI vào workflow hàng ngày</li>
          <li>Tập trung vào Strategy & Creative</li>
          <li>Dùng AI để phân tích data nhanh hơn</li>
        </ul>
      </div>
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

app.get('/download-cv', (req, res) => {
  const file = path.join(__dirname, 'public', 'files', 'CV_Tran_Hong_Son.pdf');
  res.download(file, 'CV_TranHongSon_Marketing.pdf');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
