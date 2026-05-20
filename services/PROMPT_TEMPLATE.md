# Prompt Content OS

Content OS hiện chạy ở chế độ **No API / Prompt Builder**.

## Workflow

1. Nhập brand, audience, strategy và visual settings.
2. Bấm `Build Prompt + Preview`.
3. Website tự tạo:
   - Local content preview.
   - Visual preview bằng HTML/CSS/canvas.
   - Prompt chuẩn để copy sang ChatGPT/Gemini web.
4. Nếu dùng AI web, copy prompt sang ChatGPT/Gemini.
5. Dán JSON trả về vào ô `Paste AI Result`.
6. Bấm `Apply JSON` để render lại output.

## Output JSON

AI web nên trả đúng format:

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

## Không dùng API

- Không cần `.env`.
- Không cần Vercel Environment Variables.
- Không gọi OpenAI/Gemini API.
- Không tạo ảnh AI thật.
- Visual Engine render từ `visualSuggestions`.

## Nơi chỉnh prompt

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
