# Prompt Template - Content OS

Content OS hiện chạy ở chế độ **No API / Prompt Builder**: ứng dụng tạo prompt, preview nội dung và preview visual cục bộ để người dùng copy prompt sang ChatGPT/Gemini web khi cần.

Mục tiêu chính của template này là tạo ra **một bài post hoàn chỉnh có thể copy và đăng ngay**. Phần dùng để đăng nằm trong field `copyVersion`.

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

## Prompt Mẫu Để Dùng Với AI Web

Copy prompt này sang ChatGPT/Gemini, sau đó thay các phần trong dấu `[]` bằng thông tin thật:

```text
Bạn là chuyên gia content marketing, social copywriter và brand strategist.

Hãy viết một bài post social media hoàn chỉnh bằng tiếng Việt, có thể copy và đăng ngay.

Thông tin đầu vào:
- Thương hiệu: [Tên thương hiệu]
- Ngành hàng: [Ngành hàng]
- Sản phẩm/dịch vụ: [Sản phẩm hoặc dịch vụ chính]
- Khách hàng mục tiêu: [Ai là người đọc]
- Pain point của khách hàng: [Vấn đề họ đang gặp]
- Mong muốn của khách hàng: [Kết quả họ muốn đạt được]
- Brand voice: [Ví dụ: chuyên nghiệp, gần gũi, truyền cảm hứng, thẳng thắn]
- Tone bài viết: [Ví dụ: storytelling, educational, soft-sell, launch, authority]
- Nền tảng đăng: [Facebook/LinkedIn/Instagram/TikTok caption]
- Mục tiêu bài viết: [Tăng nhận diện / tạo niềm tin / bán hàng / kéo inbox / giới thiệu sản phẩm]
- CTA mong muốn: [Ví dụ: inbox, comment, đặt lịch, truy cập website, mua hàng]

Yêu cầu nội dung:
- Viết như người làm marketing thật, không giống AI đang liệt kê.
- Có hook mở đầu mạnh, rõ vấn đề hoặc insight.
- Nội dung có mạch: hook -> vấn đề/insight -> giải pháp/góc nhìn -> lợi ích -> CTA.
- Câu ngắn, dễ đọc trên mobile.
- Không dùng số liệu giả, không overpromise, không sáo rỗng.
- Hashtag vừa đủ, liên quan trực tiếp.

Trả về đúng JSON hợp lệ, không bọc markdown, không thêm giải thích ngoài JSON:

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

Quy tắc quan trọng:
- `copyVersion` phải là bài post hoàn chỉnh để paste thẳng lên nền tảng đăng.
- `copyVersion` không được chứa label như "Title:", "Opening:", "Body:", "CTA:".
- `copyVersion` không được chứa giải thích, reason, note hoặc markdown code block.
- `copyVersion` nên gồm headline/hook, các đoạn nội dung chính, CTA và hashtag.
- Các field `titleReason`, `openingReason`, `why`, `ctaReason` chỉ dùng để giải thích chiến lược, không được đưa vào `copyVersion`.
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
- `copyVersion`: bài post hoàn chỉnh để copy đăng ngay, không có label, note hoặc explanation.
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
