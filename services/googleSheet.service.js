const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

// Cấu hình xác thực với Google Service Account
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

// In-memory Cache cục bộ (hoạt động giống Redis nhưng lưu trên RAM)
let cache = {
  projects: [],
  knowledge: [],
  depts: [],
  lastFetch: 0
};
const CACHE_TTL = 5 * 60 * 1000; // Bộ nhớ đệm tồn tại 5 phút

async function loadDataFromSheets() {
  try {
    await doc.loadInfo(); // Lấy thông tin file Sheet
    
    const projectsSheet = doc.sheetsByTitle['Projects'];
    const knowledgeSheet = doc.sheetsByTitle['Knowledge'];
    const deptsSheet = doc.sheetsByTitle['Depts'];

    // Đọc tất cả các dòng song song
    const [projectsRows, knowledgeRows, deptsRows] = await Promise.all([
      projectsSheet ? projectsSheet.getRows() : [],
      knowledgeSheet ? knowledgeSheet.getRows() : [],
      deptsSheet ? deptsSheet.getRows() : []
    ]);

    // Mapping Data: Phân tách các chuỗi ngăn cách bằng dấu phẩy thành Array
    const projects = projectsRows.map(row => ({
      id: row.get('id'),
      cat: row.get('cat'),
      catLabel: row.get('catLabel'),
      title: row.get('title'),
      short: row.get('short'),
      thumb: row.get('thumb'),
      cover: row.get('cover'),
      tags: row.get('tags') ? row.get('tags').split(', ') : [],
      desc: row.get('desc'),
      results: row.get('results') ? row.get('results').split('; ') : [],
      images: row.get('images') ? row.get('images').split(', ') : [],
      youtube: row.get('youtube') || undefined,
      facebook: row.get('facebook') || undefined
    }));

    const knowledge = knowledgeRows.map(row => ({
      id: row.get('id'),
      type: row.get('type'),
      cat: row.get('cat'),
      title: row.get('title'),
      short: row.get('short'),
      thumb: row.get('thumb'),
      ogImage: row.get('ogImage'),
      date: row.get('date'),
      readTime: row.get('readTime'),
      content: row.get('content')
    }));

    const depts = deptsRows.map(row => ({
      icon: row.get('icon'),
      name: row.get('name'),
      desc: row.get('desc'),
      color: row.get('color'),
      border: row.get('border'),
      ai: Number(row.get('ai')) || 0,
      roles: row.get('roles') ? row.get('roles').split(', ') : [],
      skills: row.get('skills') ? row.get('skills').split(', ') : [],
      tools: row.get('tools') ? row.get('tools').split(', ') : [],
      aiUses: row.get('aiUses') ? row.get('aiUses').split(', ') : []
    }));

    return { projects, knowledge, depts };
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu từ Google Sheets:', error);
    return null;
  }
}

async function getCachedData() {
  const now = Date.now();
  if (cache.projects.length > 0 && (now - cache.lastFetch < CACHE_TTL)) return cache;
  const data = await loadDataFromSheets();
  if (data) cache = { ...data, lastFetch: now };
  return cache;
}

function clearCache() {
  // Reset lại toàn bộ biến cache
  cache = {
    projects: [],
    knowledge: [],
    depts: [],
    lastFetch: 0
  };
  console.log('🧹 Đã xóa cache cục bộ. API Google Sheets sẽ được gọi lại ở request tiếp theo.');
}

module.exports = { getCachedData, clearCache };