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

app.get('/download-cv', (req, res) => {
  const file = path.join(__dirname, 'public', 'files', 'CV_Tran_Hong_Son.pdf');
  res.download(file, 'CV_TranHongSon_Marketing.pdf');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
