# 🎬 Image to Video Prompt Builder

Công cụ AI giúp biến ảnh của bạn thành video với các prompt chuyên nghiệp cho các nền tảng AI tạo video như Runway Gen-3, Pika Labs, Luma Dream Machine, và nhiều hơn nữa.

## ✨ Tính năng

- 📤 **Upload Ảnh Dễ Dàng**: Kéo thả hoặc click để upload ảnh
- 🤖 **AI Phân Tích Thông Minh**: Tự động phân tích ảnh và tạo prompt video
- 🎨 **Prompt Tối Ưu**: Tạo prompt với thông tin chi tiết về style, motion, camera angle, duration
- 💾 **Lưu Trữ History**: Lưu lại tất cả các prompt đã tạo để sử dụng lại
- 📋 **Copy Nhanh**: Một click để copy prompt vào clipboard
- 🎯 **Responsive**: Giao diện đẹp trên mọi thiết bị

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **API**: tRPC 11 - Type-safe RPC
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **State Management**: TanStack React Query 5
- **Validation**: Zod
- **Icons**: Lucide React

## 🚀 Getting Started

### Yêu cầu

- Node.js 18+
- PostgreSQL database
- npm, yarn, pnpm hoặc bun

### Cài đặt

1. Clone repository:
```bash
git clone <your-repo-url>
cd agent-code
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Thiết lập environment variables:
```bash
# Tạo file .env
cp .env.example .env

# Cấu hình DATABASE_URL trong .env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Chạy Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Chạy development server:
```bash
npm run dev
```

6. Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc Project

```
agent-code/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main page
│   │   ├── client.tsx         # Client component với UI chính
│   │   └── api/trpc/          # tRPC API endpoint
│   │
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── image-upload.tsx   # Component upload ảnh
│   │   └── prompt-display.tsx # Component hiển thị prompt
│   │
│   ├── trpc/                  # tRPC setup
│   │   ├── router/
│   │   │   └── _app.ts        # API routes & procedures
│   │   ├── server.tsx
│   │   └── client.tsx
│   │
│   └── lib/
│       ├── prisma.ts          # Prisma client
│       └── utils.ts           # Utility functions
│
├── prisma/
│   └── schema.prisma          # Database schema
│
└── package.json
```

## 🗄️ Database Schema

### Image Model
Lưu trữ thông tin ảnh đã upload:
- URL, filename, mime type, size
- Dimensions (width, height)
- Upload timestamp
- User relation

### VideoPrompt Model
Lưu trữ video prompts đã tạo:
- Prompt text (full prompt)
- Style (cinematic, dramatic, etc.)
- Duration (3s, 5s, 7s, 10s)
- Motion (zoom, pan, dolly, etc.)
- Camera angle (low angle, high angle, etc.)
- Description
- Image relation

## 🎯 Sử dụng

### Tạo Video Prompt

1. **Upload Ảnh**: Click vào khu vực upload hoặc kéo thả ảnh
2. **Tạo Prompt**: Click nút "Tạo Prompt" để AI phân tích ảnh
3. **Copy Prompt**: Sử dụng nút "Copy Prompt" để copy vào clipboard
4. **Sử dụng**: Paste prompt vào công cụ AI tạo video như:
   - Runway Gen-3
   - Pika Labs 1.5
   - Luma Dream Machine
   - Stable Video Diffusion
   - Và nhiều công cụ khác

### Xem Lại Prompts Cũ

- Phần "Prompts Gần Đây" hiển thị 5 prompts mới nhất
- Click vào bất kỳ prompt nào để xem lại chi tiết

## 🔧 Tùy chỉnh

### Thêm AI Vision API

Hiện tại ứng dụng sử dụng random selection để demo. Để tích hợp AI thực sự, cập nhật function `generateVideoPrompt` trong `src/trpc/router/_app.ts`:

```typescript
async function generateVideoPrompt(imageUrl: string) {
    // Tích hợp OpenAI Vision API
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [{
            role: "user",
            content: [
                { type: "text", text: "Analyze this image and suggest video parameters..." },
                { type: "image_url", image_url: { url: imageUrl } }
            ]
        }]
    });

    // Parse response và return prompt data
}
```

### Upload ảnh lên Cloud Storage

Để lưu ảnh thực sự thay vì base64, tích hợp với:
- AWS S3
- Cloudinary
- Vercel Blob
- UploadThing

## 📝 API Endpoints (tRPC)

### `analyzeImageAndGeneratePrompt`
Tạo video prompt từ ảnh

**Input:**
```typescript
{
  imageUrl: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  userId?: number;
}
```

**Output:** VideoPrompt object với image relation

### `getVideoPrompts`
Lấy danh sách video prompts

**Input:**
```typescript
{
  userId?: number;
  limit?: number; // default: 10, max: 100
}
```

### `getVideoPromptById`
Lấy một prompt theo ID

### `deleteVideoPrompt`
Xóa một prompt

## 🚀 Deploy

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm environment variable `DATABASE_URL`
4. Deploy!

### Docker

```bash
docker build -t image-to-video-prompt .
docker run -p 3000:3000 image-to-video-prompt
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Prisma](https://prisma.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
