const redis = require('redis');
// Giả định bạn đã viết file googleSheet.js chứa logic kéo dữ liệu
const { loadDataFromSheets } = require('../googleSheet');

// Khởi tạo Redis Client
const redisClient = redis.createClient({
  // Thay bằng URL Redis thật của bạn (ví dụ: lấy từ Upstash)
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('❌ Lỗi Redis Client:', err));
redisClient.on('connect', () => console.log('✅ Đã kết nối tới Redis Server'));

// Mở kết nối
(async () => {
  await redisClient.connect();
})();

const CACHE_TTL = 300; // Thời gian sống của cache là 300 giây (5 phút)

async function getCachedProjects() {
  try {
    // 1. Kiểm tra cache trong Redis
    const cachedData = await redisClient.get('projects_data');
    
    if (cachedData) {
      console.log('⚡ Trả về dữ liệu từ Redis Cache (Rất nhanh)');
      return JSON.parse(cachedData);
    }

    // 2. Không có cache hoặc đã hết hạn -> Gọi Google Sheets API
    console.log('🔄 Cache trống hoặc hết hạn, đang gọi API Google Sheets...');
    const projects = await loadDataFromSheets();

    // 3. Lưu dữ liệu mới vào Redis với hàm setEx (lưu + đặt thời gian sống)
    await redisClient.setEx('projects_data', CACHE_TTL, JSON.stringify(projects));
    
    return projects;
  } catch (error) {
    console.error('❌ Lỗi khi thao tác với Redis/Google Sheets:', error);
    return []; // Trả về mảng rỗng để web không bị crash nếu có lỗi
  }
}

module.exports = { getCachedProjects };