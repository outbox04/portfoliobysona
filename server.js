const express = require('express');
const compression = require('compression');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://images.dmca.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.dmca.com", "https://www.google-analytics.com"],
      connectSrc: [
        "'self'",
        "https://www.google-analytics.com",
        "https://script.google.com",
        "https://script.googleusercontent.com"
      ],
      frameAncestors: ["'self'"]
    }
  }
}));

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '30d',
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return;
    }
    if (/\.(?:css|js|mjs|png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Project data
const projects = require('./projects');
const knowledge = require('./knowledge');
const depts = require('./depts');

const ADMIN_SESSION_COOKIE = 'hs_admin_session';
const ADMIN_SESSION_AGE_MS = 8 * 60 * 60 * 1000;
const DEFAULT_ADMIN_AUTH_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBU8HphPjvlsa6tK6Krd195XIMomYL2Q5cUaOpQX3UYY8rUuynInc-Cl9vvf6fQswYGw/exec';
const DEFAULT_ADMIN_SESSION_SECRET = 'hs-portfolio-admin-session-secret-20260527';

function getAdminConfig() {
  return {
    authScriptUrl: process.env.ADMIN_AUTH_SCRIPT_URL || DEFAULT_ADMIN_AUTH_SCRIPT_URL,
    secret: process.env.ADMIN_SESSION_SECRET || DEFAULT_ADMIN_SESSION_SECRET
  };
}

function parseCookies(req) {
  return String(req.headers.cookie || '')
    .split(';')
    .map(cookie => cookie.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const index = cookie.indexOf('=');
      if (index === -1) return cookies;
      cookies[cookie.slice(0, index)] = decodeURIComponent(cookie.slice(index + 1));
      return cookies;
    }, {});
}

function signAdminSession(user) {
  const { secret } = getAdminConfig();
  const payload = Buffer.from(JSON.stringify({
    user,
    expiresAt: Date.now() + ADMIN_SESSION_AGE_MS
  })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminSession(req) {
  const { secret } = getAdminConfig();
  if (!secret) return false;

  const token = parseCookies(req)[ADMIN_SESSION_COOKIE];
  if (!token || !token.includes('.')) return false;

  const [payload, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Boolean(session.user) && session.expiresAt > Date.now();
  } catch (error) {
    return false;
  }
}

function getAdminSession(req) {
  const { secret } = getAdminConfig();
  if (!secret) return null;

  const token = parseCookies(req)[ADMIN_SESSION_COOKIE];
  if (!token || !token.includes('.')) return null;

  const [payload, signature] = token.split('.');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64url');

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.user || session.expiresAt <= Date.now()) return null;
    return session;
  } catch (error) {
    return null;
  }
}

function requireAdmin(req, res, next) {
  if (verifyAdminSession(req)) return next();
  res.redirect('/login');
}

function setAdminSessionCookie(res, user) {
  res.cookie(ADMIN_SESSION_COOKIE, signAdminSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_SESSION_AGE_MS,
    path: '/'
  });
}

function clearAdminSessionCookie(res) {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}

function validateStrongPassword(password) {
  return [
    { valid: password.length >= 8, message: 'Mat khau phai co it nhat 8 ky tu.' },
    { valid: /[A-Z]/.test(password), message: 'Mat khau phai co it nhat 1 ky tu in hoa.' },
    { valid: /[a-z]/.test(password), message: 'Mat khau phai co it nhat 1 chu thuong.' },
    { valid: /[^A-Za-z0-9]/.test(password), message: 'Mat khau phai co it nhat 1 ky tu dac biet.' }
  ];
}

function getSiteUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${getSiteUrl(req)}/sitemap.xml`);
});

app.get('/', (req, res) => {
  res.render('index', { 
    siteUrl: getSiteUrl(req), 
    projects,
    knowledge
  });
});

app.get('/tran-hong-son', (req, res) => {
  res.render('about-me', { siteUrl: getSiteUrl(req) });
});

app.get('/about-me', (req, res) => {
  res.redirect(301, '/tran-hong-son');
});

app.get('/login', (req, res) => {
  if (verifyAdminSession(req)) return res.redirect('/admin');
  res.render('login', {
    siteUrl: getSiteUrl(req),
    error: null
  });
});

app.post('/login', (req, res) => {
  const { authScriptUrl, secret } = getAdminConfig();
  if (!authScriptUrl || !secret) {
    return res.status(500).render('login', {
      siteUrl: getSiteUrl(req),
      error: 'Chua cau hinh xac thuc quan tri. Hay thiet lap ADMIN_AUTH_SCRIPT_URL va ADMIN_SESSION_SECRET.'
    });
  }

  const inputUsername = String(req.body.username || '').trim();
  const inputPassword = String(req.body.password || '');

  fetch(authScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'login',
      username: inputUsername,
      password: inputPassword
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.success) {
        setAdminSessionCookie(res, data.user || { username: inputUsername });
        return res.redirect('/admin');
      }

      return res.status(401).render('login', {
        siteUrl: getSiteUrl(req),
        error: data && data.message ? data.message : 'Tai khoan hoac mat khau khong dung.'
      });
    })
    .catch(error => {
      console.error('Admin login failed:', error);
      return res.status(502).render('login', {
        siteUrl: getSiteUrl(req),
        error: 'Khong the ket noi he thong xac thuc. Vui long thu lai.'
      });
    });
});

app.get('/register', (req, res) => {
  if (verifyAdminSession(req)) return res.redirect('/admin');
  res.render('register', {
    siteUrl: getSiteUrl(req),
    error: null,
    success: null
  });
});

app.post('/register', (req, res) => {
  const { authScriptUrl, secret } = getAdminConfig();
  if (!authScriptUrl || !secret) {
    return res.status(500).render('register', {
      siteUrl: getSiteUrl(req),
      error: 'Chua cau hinh xac thuc quan tri. Hay thiet lap ADMIN_AUTH_SCRIPT_URL va ADMIN_SESSION_SECRET.',
      success: null
    });
  }

  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const confirmPassword = String(req.body.confirmPassword || '');
  const fullName = String(req.body.fullName || '').trim();
  const email = String(req.body.email || '').trim();

  if (!username || !password || !confirmPassword) {
    return res.status(400).render('register', {
      siteUrl: getSiteUrl(req),
      error: 'Vui long dien day du tai khoan va mat khau.',
      success: null
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).render('register', {
      siteUrl: getSiteUrl(req),
      error: 'Mat khau xac nhan khong khop.',
      success: null
    });
  }

  const passwordIssues = validateStrongPassword(password).filter(rule => !rule.valid);
  if (passwordIssues.length) {
    return res.status(400).render('register', {
      siteUrl: getSiteUrl(req),
      error: passwordIssues.map(rule => rule.message).join(' '),
      success: null
    });
  }

  fetch(authScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'register',
      username,
      password,
      fullName,
      full_name: fullName,
      email
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.success) {
        return res.render('register', {
          siteUrl: getSiteUrl(req),
          error: null,
          success: data.message || 'Dang ky thanh cong. Ban co the dang nhap sau khi tai khoan duoc kich hoat.'
        });
      }

      return res.status(400).render('register', {
        siteUrl: getSiteUrl(req),
        error: data && data.message ? data.message : 'Khong the dang ky tai khoan.',
        success: null
      });
    })
    .catch(error => {
      console.error('Admin register failed:', error);
      return res.status(502).render('register', {
        siteUrl: getSiteUrl(req),
        error: 'Khong the ket noi he thong dang ky. Vui long thu lai.',
        success: null
      });
    });
});

app.post('/logout', (req, res) => {
  clearAdminSessionCookie(res);
  res.redirect('/login');
});

app.get('/admin', requireAdmin, (req, res) => {
  res.render('admin', {
    siteUrl: getSiteUrl(req),
    user: getAdminSession(req)?.user || null
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

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = getSiteUrl(req);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Các trang tĩnh
  const staticPages = ['', '/tran-hong-son', '/kien-thuc', '/ecosystem', '/content-os', '/growth-roadmap'];
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

app.get('/growth-roadmap', (req, res) => {
  res.render('growth-roadmap', { siteUrl: getSiteUrl(req) });
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
