# 📚 Trắc Nghiệm Thông Minh

Hệ thống trắc nghiệm trực tuyến với tính năng chia sẻ quiz và phòng thi.

## ✨ Tính Năng

- 📝 Tạo và quản lý quiz
- 🌐 Chia sẻ quiz với cộng đồng
- 🏫 Tạo phòng thi trực tuyến
- 📊 Thống kê và phân tích kết quả
- 🎯 Giao diện thân thiện, responsive
- 🔐 Bảo mật với Supabase

## 🚀 Demo

Website: [Đang deploy trên Vercel]

## 🛠️ Công Nghệ

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage

## 📦 Cài Đặt

### 1. Clone Repository
```bash
git clone https://github.com/tranvananh112/TracNghiemThongMinh.git
cd TracNghiemThongMinh
```

### 2. Cấu Hình Supabase
1. Tạo project tại: https://supabase.com
2. Copy URL và anon key
3. Cập nhật `supabase-config.js`:
```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 3. Chạy SQL Setup
Chạy các file SQL trong Supabase SQL Editor:
- `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql` - Setup bảng chia sẻ quiz
- `SUPABASE_SETUP_PHONG_THI_HOAN_CHINH.sql` - Setup phòng thi

### 4. Deploy
- Push code lên GitHub
- Kết nối với Vercel
- Deploy tự động

## 📖 Hướng Dẫn Sử Dụng

### Tạo Quiz
1. Click "Tạo đề thi mới"
2. Nhập tên và mô tả
3. Thêm câu hỏi và đáp án
4. Lưu quiz

### Chia Sẻ Quiz
1. Mở quiz đã tạo
2. Click "Chia sẻ"
3. Quiz sẽ xuất hiện trong mục "Khám phá"
4. Người dùng khác có thể xem và làm bài

### Tạo Phòng Thi
1. Vào mục "Phòng thi"
2. Click "Tạo phòng mới"
3. Chọn quiz và cấu hình
4. Chia sẻ mã phòng với học sinh

## 🔧 Cấu Trúc Project

```
TracNghiemThongMinh/
├── index.html                    # Trang chính
├── style.css                     # CSS chính
├── script.js                     # JavaScript chính
├── supabase-config.js            # Cấu hình Supabase
├── explore-quiz.js               # Quản lý khám phá quiz
├── room-manager-supabase.js      # Quản lý phòng thi
├── FIX_FORCE_SUPABASE_V2.js      # Fix load từ Supabase
└── *.sql                         # SQL setup files
```

## 🐛 Xử Lý Lỗi

### Không thấy quiz đã chia sẻ
1. Kiểm tra Supabase connection
2. Xóa localStorage: `localStorage.clear()`
3. Refresh trang

### Lỗi CORS
1. Vào Supabase Dashboard
2. Settings → API → CORS
3. Thêm domain của bạn

### Lỗi 404 trên Vercel
1. Đảm bảo `index.html` ở root
2. Vercel Settings → Root Directory → Để trống
3. Redeploy

## 📝 License

MIT License - Tự do sử dụng và chỉnh sửa

## 👨‍💻 Tác Giả

Trần Văn Anh

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

## 📞 Liên Hệ

- GitHub: [@tranvananh112](https://github.com/tranvananh112)
- Repository: [TracNghiemThongMinh](https://github.com/tranvananh112/TracNghiemThongMinh)

---

⭐ Nếu thấy hữu ích, hãy cho project một star nhé!
