# Content OS Prompt Template

Prompt trong `prompt.service.js` đang theo cấu trúc 6 phần:

1. **Role - Vai trò**
   - AI đóng vai chuyên gia content marketing, brand strategist, social copywriter, creative director.

2. **Context - Bối cảnh**
   - Thông tin thương hiệu.
   - Thông tin khách hàng.
   - Nền tảng đăng bài.
   - Tone, công thức viết, mục tiêu, CTA, hook.

3. **Examples - Mẫu chất lượng**
   - Ví dụ title, opening, body, explanation, visual suggestion.
   - Dùng để định hướng chất lượng đầu ra.

4. **Style - Phong cách viết**
   - Quy định giọng văn.
   - Những điều nên tránh.
   - Cách dùng thuật ngữ marketing.

5. **Format - Định dạng đầu ra**
   - Bắt buộc trả JSON đúng schema:

```json
{
  "title": "",
  "titleReason": "",
  "opening": "",
  "openingReason": "",
  "body": [
    {
      "text": "",
      "why": ""
    }
  ],
  "cta": "",
  "ctaReason": "",
  "hashtags": [],
  "copyVersion": "",
  "visualSuggestions": [
    {
      "label": "",
      "text": "",
      "sub": ""
    }
  ]
}
```

6. **Goal - Mục tiêu**
   - Tạo content sẵn sàng đăng.
   - Giải thích được psychology/copywriting phía sau.
   - Có clean content để copy.
   - Có visual suggestions đủ ngắn để render thành ảnh.

## Nơi chỉnh nhanh

- Công thức viết: `FORMULA_BLOCKS`
- Luật từng nền tảng: `PLATFORM_BLOCKS`
- Tone of voice: `TONE_BLOCKS`
- Vai trò AI: `buildRoleBlock()`
- Bối cảnh: `buildContextBlock()`
- Ví dụ mẫu: `buildExamplesBlock()`
- Phong cách viết: `buildStyleBlock()`
- JSON format: `buildFormatBlock()`
- Mục tiêu cuối: `buildGoalBlock()`

## Image prompt

Ảnh được tạo/chỉnh trong `services/image.service.js`.

- Provider: Gemini API
- Content model mặc định: `gemini-3.5-flash`
- Image model mặc định: `gemini-3.1-flash-image-preview`
- Tạo ảnh: `generateImages()`
- Chỉnh ảnh theo ghi chú người xem: `reviseImage()`
- Prompt ảnh chính: `buildImagePrompt()`

Logic:

- `single image`: dùng visual suggestion đầu tiên, gom thông điệp chính vào 1 ảnh.
- `multi-image` / `carousel`: dùng nhiều visual suggestions theo thứ tự Hook, Pain point, Insight, Solution, CTA.
- Người xem có thể nhập ghi chú cho từng ảnh, ví dụ: "nền sáng hơn", "ít chữ hơn", "luxury hơn", rồi gọi endpoint chỉnh ảnh.
