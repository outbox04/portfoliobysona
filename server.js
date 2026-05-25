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
const projects = require('./projects');
const knowledge = require('./knowledge');
const depts = require('./depts');

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

function getSiteUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /');
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = getSiteUrl(req);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Các trang tĩnh
  const staticPages = ['', '/kien-thuc', '/ecosystem', '/content-os'];
  staticPages.forEach(page => {
    xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // Các trang chi tiết Dự án
  projects.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/projects/${p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Các trang chi tiết Kiến thức
  knowledge.forEach(k => {
    xml += `  <url>\n    <loc>${baseUrl}/kien-thuc/${k.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
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
