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
    short: 'Xây dựng hệ thống nhận diện thương hiệu toàn diện cho MEGAPOWER – tổng kho phân phối thiết bị năng lượng mặt trời, nhằm chuẩn hóa hình ảnh B2B và nâng cao khả năng mở rộng đại lý trên toàn quốc.',
    thumb: '/images/projects/brand/brand-02.jpg',
    cover: '/images/projects/brand/brand-02.jpg',
    tags: ['Branding', 'Visual Identity', 'Design'],
    desc: `MEGAPOWER là tổng kho phân phối thiết bị năng lượng mặt trời, tập trung vào hệ thống đại lý và đội thi công trên toàn quốc.

Thách thức của dự án là xây dựng một hệ thống nhận diện thương hiệu chuyên nghiệp, nhất quán và dễ áp dụng trong môi trường B2B, nơi thương hiệu cần thể hiện sự uy tín, năng lực và khả năng mở rộng.

Dự án bao gồm việc thiết kế logo, hệ thống màu sắc, typography và bộ Brand Guideline hoàn chỉnh nhằm đảm bảo tính đồng bộ trên tất cả các điểm chạm: từ tài liệu nội bộ, truyền thông đến hệ thống đại lý.`,
    results: ['Xây dựng hoàn chỉnh bộ Brand Guideline 13+ trang', 'Chuẩn hóa 100% hệ thống nhận diện trên digital & offline', 'Tăng khả năng nhận diện thương hiệu trong hệ thống đại lý','Tạo nền tảng mở rộng marketing & bán hàng B2B','Rút ngắn thời gian triển khai thiết kế & truyền thông'],
    images: ['/images/projects/brand/brand-01.jpg', '/images/projects/brand/brand-02.jpg']
  },
  {
    id: 'social-branding',
    cat: 'brand',
    catLabel: 'Thương hiệu',
    title: 'Social Media Branding',
    short: 'Thiết lập bộ nhận diện đồng bộ trên tất cả kênh mạng xã hội.',
    thumb: '/images/projects/brand/brand-02.jpg',
    cover: '/images/projects/brand/brand-02.jpg',
    tags: ['Social Media', 'Branding', 'Content'],
    desc: `Xây dựng bộ nhận diện thống nhất trên Facebook, Instagram, TikTok và YouTube, bao gồm template post, story, thumbnail và cover photo.`,
    results: ['Xây dựng hoàn chỉnh bộ Brand Guideline 13+ trang', 'Chuẩn hóa 100% hệ thống nhận diện trên digital & offline', 'Tăng khả năng nhận diện thương hiệu trong hệ thống đại lý','Tạo nền tảng mở rộng marketing & bán hàng B2B','Rút ngắn thời gian triển khai thiết kế & truyền thông'],
    images: ['/images/projects/brand/brand-02.jpg']
  },
  {
    id: 'fb-ads-hcg',
    cat: 'performance',
    catLabel: 'Performance',
    title: 'Facebook Ads — KPI 800M/tháng',
    short: 'Tối ưu hóa chiến dịch Facebook Ads đạt 800 triệu doanh thu/tháng tại HCG.',
    thumb: '/images/projects/performance/perf-01.jpg',
    cover: '/images/projects/performance/perf-01.jpg',
    tags: ['Facebook Ads', 'Performance', 'ROAS'],
    desc: `Quản lý toàn bộ hệ thống quảng cáo Facebook cho Công ty HCG, tối ưu từng campaign, ad set và creative để đạt KPI doanh thu cao nhất với ngân sách tối ưu.`,
    results: ['KPI 800 triệu/tháng', 'Top 5 toàn hệ thống Bảo An', 'ROAS tăng 3.2x'],
    images: ['/images/projects/performance/perf-01.jpg', '/images/projects/performance/perf-02.jpg']
  },
  {
    id: 'multi-ads',
    cat: 'performance',
    catLabel: 'Performance',
    title: 'Multi-channel Ads Campaign',
    short: 'Triển khai ADS đồng thời trên FB, Google, TikTok cho doanh nghiệp xây dựng.',
    thumb: '/images/projects/performance/perf-02.jpg',
    cover: '/images/projects/performance/perf-02.jpg',
    tags: ['Google Ads', 'TikTok Ads', 'FB Ads'],
    desc: `Chiến dịch quảng cáo đa kênh cho công ty xây dựng và nội thất, phối hợp giữa Facebook Ads, Google Search và TikTok để tiếp cận đúng tệp khách hàng mục tiêu.`,
    results: ['CPL giảm 45%', 'Lead tăng 120%/tháng', '3 kênh vận hành song song'],
    images: ['/images/projects/performance/perf-02.jpg']
  },
  {
    id: 'anpham-nha-viet',
    cat: 'design',
    catLabel: 'Design',
    title: 'Ấn phẩm truyền thông — Nhà Việt',
    short: 'Thiết kế banner, poster, backdrop cho các sự kiện và chiến dịch truyền thông.',
    thumb: '/images/projects/design/design-01.jpg',
    cover: '/images/projects/design/design-01.jpg',
    tags: ['Print Design', 'Banner', 'Poster'],
    desc: `Thiết kế toàn bộ ấn phẩm truyền thông cho Công ty Nhà Việt bao gồm banner online/offline, poster sự kiện, backdrop hội nghị và bộ tài liệu marketing.`,
    results: ['30+ ấn phẩm/tháng', 'Giảm 50% thời gian thiết kế', 'Đồng bộ brand guideline'],
    images: ['/images/projects/design/design-01.jpg', '/images/projects/design/design-02.jpg']
  },
  {
    id: 'social-visual',
    cat: 'design',
    catLabel: 'Design',
    title: 'Social Media Visual Design',
    short: 'Bộ template và nội dung hình ảnh đồng bộ cho fanpage và các kênh MXH.',
    thumb: '/images/projects/design/design-02.jpg',
    cover: '/images/projects/design/design-02.jpg',
    tags: ['Canva', 'Photoshop', 'Social Design'],
    desc: `Xây dựng hệ thống template thiết kế cho mạng xã hội, đảm bảo tính nhất quán về visual và dễ dàng cập nhật nội dung mới theo từng chiến dịch.`,
    results: ['100+ template có thể tái sử dụng', 'Giảm 70% thời gian production', 'Tăng nhất quán thương hiệu'],
    images: ['/images/projects/design/design-02.jpg']
  },
  {
    id: 'video-bao-an',
    cat: 'video',
    catLabel: 'Video',
    title: 'Video Ads — Dược phẩm Bảo An',
    short: 'Sản xuất video quảng cáo sản phẩm dược phẩm tối ưu cho mobile feed.',
    thumb: '/images/projects/video/video-01.jpg',
    cover: '/images/projects/video/video-01.jpg',
    tags: ['Video Ads', 'Premiere', 'Mobile'],
    desc: `Sản xuất series video quảng cáo cho các sản phẩm dược phẩm Bảo An, tối ưu định dạng cho Facebook/TikTok feed với hook mạnh trong 3 giây đầu.`,
    results: ['CTR tăng 2.8x', 'View through rate 65%', 'KPI 200 triệu/tháng'],
    images: ['/images/projects/video/video-01.jpg', '/images/projects/video/video-02.jpg']
  },
  {
    id: 'video-son-tung',
    cat: 'video',
    catLabel: 'Video',
    title: 'Video Công trình — Sơn Tùng',
    short: 'Quay dựng video showcase công trình kiến trúc và nội thất thực tế.',
    thumb: '/images/projects/video/video-02.jpg',
    cover: '/images/projects/video/video-02.jpg',
    tags: ['Cinematography', 'Editing', 'Real Estate'],
    desc: `Quay và dựng video showcase các công trình kiến trúc, nội thất hoàn thiện của Công ty Sơn Tùng, sử dụng kỹ thuật quay chuyển động và hiệu ứng chỉnh màu chuyên nghiệp.`,
    results: ['20+ video công trình', 'Tăng trust 80% từ khách hàng', 'Viral TikTok 50K+ views'],
    images: ['/images/projects/video/video-02.jpg']
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
  res.render('index', { siteUrl: getSiteUrl(req), projects });
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
