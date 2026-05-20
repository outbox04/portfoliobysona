# Prompt Template - Content OS

Content OS hiện chạy ở chế độ **No API / Prompt Builder**: ứng dụng tạo prompt, preview nội dung và preview visual cục bộ để người dùng copy prompt sang ChatGPT/Gemini web khi cần.

## Workflow

1. Nhập thông tin brand, audience, strategy và visual settings.
2. Bấm `Build Prompt + Preview`.
3. Website tự tạo:
   - Local content preview.
   - Visual preview bằng HTML/CSS/canvas.
   - Prompt chuẩn để copy sang ChatGPT/Gemini web.
4. Nếu muốn dùng AI web, copy prompt đã tạo sang ChatGPT/Gemini.
5. Dán JSON AI trả về vào ô `Paste AI Result`.
6. Bấm `Apply JSON` để render lại content và visual preview.

## Output JSON

AI web phải trả về **JSON hợp lệ**, không bọc trong markdown và không thêm giải thích ngoài JSON.

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

## Field Rules

- `title`: headline chính của bài viết.
- `titleReason`: giải thích ngắn vì sao headline hoạt động.
- `opening`: đoạn mở đầu có hook rõ.
- `openingReason`: trigger tâm lý hoặc chiến lược copywriting phía sau opening.
- `body`: gồm 3-5 đoạn, mỗi đoạn có `text` và `why`.
- `cta`: lời kêu gọi hành động phù hợp với mục tiêu content.
- `ctaReason`: giải thích chiến lược CTA.
- `hashtags`: 3-8 hashtag liên quan.
- `copyVersion`: chỉ chứa nội dung sạch để copy đăng bài, không có label, note hoặc explanation.
- `visualSuggestions`: danh sách gợi ý visual để frontend render thành visual card.

## Visual Rules

- Nếu `visualType` là `single image`, `visualSuggestions` chỉ cần 1 object và gom thông điệp chính vào một visual rõ ràng.
- Nếu `visualType` là `multi-image` hoặc `carousel`, chia thông điệp theo logic `Hook -> Pain point -> Insight -> Solution -> CTA`.
- Mỗi `visualSuggestions.text` phải ngắn, đủ lớn để đặt lên ảnh social-ready.
- Mỗi `visualSuggestions.sub` là dòng phụ hoặc direction ngắn để hỗ trợ bố cục ảnh.
- Nếu `visualType` là `no image`, `visualSuggestions` phải là array rỗng.

## Không Dùng API

- Không cần `.env`.
- Không cần Vercel Environment Variables.
- Không gọi OpenAI/Gemini API.
- Không tạo ảnh AI thật.
- Visual Engine render từ `visualSuggestions`.

## Nơi Chỉnh Prompt

Prompt frontend hiện nằm trong:

```text
public/js/content-os.js
```

Hàm chính:

```js
buildPrompt(input)
```

Các phần nên chỉnh:

- Role
- Context
- Examples
- Style
- Format
- Goal

Prompt server-side chi tiết hơn nằm trong:

```text
services/prompt.service.js
```

Chỉ chỉnh file này nếu dự án bật lại luồng gọi API hoặc cần đồng bộ prompt chi tiết giữa frontend và backend.
