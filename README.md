# 🎓 QuizTva Studio - Hệ Thống Trắc Nghiệm Thông Minh

Hệ thống tạo và chia sẻ bài trắc nghiệm trực tuyến với tích hợp Supabase.

## ✨ Tính năng

### 🎯 Tạo và Quản lý Quiz
- ✅ Tạo quiz với nhiều câu hỏi
- ✅ Hỗ trợ 4 đáp án cho mỗi câu
- ✅ Chỉnh sửa và xóa quiz
- ✅ Import quiz từ file Word/Text
- ✅ Tạo quiz bằng AI

### ☁️ Chia sẻ Quiz (Supabase)
- ✅ Chia sẻ quiz lên cloud
- ✅ Mọi người có thể xem và làm bài
- ✅ Không cần cùng mạng WiFi
- ✅ Realtime updates
- ✅ Thống kê lượt xem, lượt làm bài

### 🏆 Phòng Thi
- ✅ Tạo phòng thi với mã 6 số
- ✅ Bảng xếp hạng realtime
- ✅ Theo dõi người tham gia
- ✅ Thống kê kết quả

### 📊 Thống kê và Báo cáo
- ✅ Lịch sử làm bài
- ✅ Điểm số và thời gian
- ✅ Phân tích kết quả
- ✅ Dashboard admin

### 🎨 Giao diện
- ✅ Responsive design
- ✅ Dark/Light mode
- ✅ Mobile-friendly
- ✅ Modern UI/UX

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/tranvananh112/TracNghiemThongMinh.git
cd TracNghiemThongMinh
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Supabase

1. Tạo project tại [Supabase](https://supabase.com)
2. Copy URL và Anon Key
3. Cập nhật trong `supabase-config.js`:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

4. Chạy SQL setup:
   - Mở Supabase SQL Editor
   - Copy và chạy file `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql`

### 4. Chạy server

```bash
node server.js
```

Hoặc sử dụng Live Server trong VS Code.

### 5. Truy cập

Mở trình duyệt: `http://localhost:3000`

## 📁 Cấu trúc thư mục

```
TracNghiemThongMinh/
├── index.html              # Trang chính
├── supabase-config.js      # Cấu hình Supabase
├── explore-quiz.js         # Quản lý khám phá quiz
├── room-manager.js         # Quản lý phòng thi
├── script.js               # Logic chính
├── style.css               # Styles
├── server.js               # Node.js server
├── package.json            # Dependencies
└── SQL/
    ├── SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql
    └── SUPABASE_SETUP_PHONG_THI_HOAN_CHINH.sql
```

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Realtime**: Supabase Realtime
- **Storage**: LocalStorage, Supabase Storage

## 📖 Hướng dẫn sử dụng

### Tạo Quiz

1. Click **"Tạo Bài Quiz"**
2. Nhập tên quiz
3. Thêm câu hỏi và đáp án
4. Click **"Lưu"**

### Chia sẻ Quiz

1. Chọn quiz muốn chia sẻ
2. Click nút **"Chia sẻ"**
3. Nhập tên và mô tả
4. Click **"Chia sẻ"**
5. Quiz sẽ xuất hiện trong tab **"Khám Phá"**

### Tạo Phòng Thi

1. Vào tab **"Tạo Phòng Thi"**
2. Chọn quiz
3. Nhập tên phòng
4. Click **"Tạo Phòng"**
5. Chia sẻ mã phòng 6 số

### Tham gia Phòng Thi

1. Nhập mã phòng 6 số
2. Click **"Vào Phòng"**
3. Làm bài thi
4. Xem kết quả và bảng xếp hạng

## 🔧 Cấu hình nâng cao

### Supabase RLS Policies

Đã cấu hình cho phép:
- ✅ Mọi người đọc quiz
- ✅ Mọi người tạo quiz
- ✅ Mọi người cập nhật thống kê
- ✅ Mọi người xóa quiz

### Realtime

Tự động cập nhật khi:
- Có quiz mới được chia sẻ
- Có người tham gia phòng thi
- Bảng xếp hạng thay đổi

## 🐛 Troubleshooting

### Lỗi: "Supabase không khả dụng"

1. Kiểm tra URL và Key trong `supabase-config.js`
2. Chạy lại SQL setup
3. Refresh trang (Ctrl+F5)

### Lỗi: "404 Not Found"

1. Bảng chưa được tạo trong Supabase
2. Chạy file SQL setup
3. Kiểm tra Table Editor

### Quiz không hiển thị

1. Mở Console (F12)
2. Chạy: `window.exploreQuizManager.loadSharedQuizzes()`
3. Xóa cache: `localStorage.clear()`

## 📝 Changelog

### Version 2.0 (2025-12-18)
- ✅ Tích hợp Supabase
- ✅ Chia sẻ quiz lên cloud
- ✅ Realtime updates
- ✅ Xóa quảng cáo Google AdSense
- ✅ Fix force load từ Supabase

### Version 1.0
- ✅ Tạo và quản lý quiz
- ✅ Phòng thi
- ✅ Thống kê
- ✅ Local storage

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Mở Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👤 Tác giả

**Trần Văn Anh**
- GitHub: [@tranvananh112](https://github.com/tranvananh112)
- Email: your-email@example.com

## 🙏 Cảm ơn

- [Supabase](https://supabase.com) - Backend as a Service
- [Font Awesome](https://fontawesome.com) - Icons
- [Google Fonts](https://fonts.google.com) - Typography

---

⭐ Nếu project này hữu ích, hãy cho một star nhé! ⭐
