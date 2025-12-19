# 🚀 HƯỚNG DẪN CUỐI CÙNG - PUSH CODE LÊN GITHUB

## ⚡ CHỌN 1 TRONG 2 CÁCH

---

## CÁCH 1: DOUBLE-CLICK FILE (WINDOWS)

### Bước 1: Double-click file này
```
EXECUTE_NOW.bat
```

### Bước 2: Đợi script chạy xong

Script sẽ tự động:
- ✅ Di chuyển files lên root
- ✅ Xóa thư mục cũ
- ✅ Push lên GitHub

### Bước 3: Kiểm tra
- Vào GitHub: https://github.com/tranvananh112/TracNghiemThongMinh
- Xem `index.html` có ở root không

---

## CÁCH 2: GIT BASH (KHUYẾN NGHỊ NẾU CÁCH 1 KHÔNG ĐƯỢC)

### Bước 1: Mở Git Bash
- Click chuột phải trong thư mục project
- Chọn **"Git Bash Here"**

### Bước 2: Chạy script
```bash
bash push-to-github.sh
```

### HOẶC chạy lệnh trực tiếp (1 dòng):
```bash
mv TracNghiemProMax-main/* . && mv TracNghiemProMax-main/.gitignore . && rm -rf TracNghiemProMax-main && rm -rf .vscode && git add . && git commit -m "Fix: Move to root" && git push origin main --force
```

---

## ✅ SAU KHI PUSH THÀNH CÔNG

### 1. Kiểm tra GitHub
Vào: https://github.com/tranvananh112/TracNghiemThongMinh

Cấu trúc phải như này:
```
Repository/
├── index.html          ✅ (ở root, không còn trong thư mục con)
├── style.css           ✅
├── script.js           ✅
├── supabase-config.js  ✅
├── explore-quiz.js     ✅
└── ...
```

### 2. Đợi Vercel Deploy
- Vercel tự động deploy sau 1-2 phút
- Hoặc vào Vercel Dashboard → Deployments → Redeploy

### 3. Kiểm tra Website
- Mở link Vercel của bạn
- Phải thấy giao diện (không còn lỗi 404)

### 4. Cấu hình Supabase CORS

**Bước 1:** Lấy domain Vercel
- Ví dụ: `https://trac-nghiem-thong-minh.vercel.app`

**Bước 2:** Thêm vào Supabase
1. Vào: https://supabase.com/dashboard
2. Chọn project: `uyjakelguelunqzdbscb`
3. Settings → API → CORS Configuration
4. Thêm domain Vercel của bạn
5. Save

### 5. Test Tính Năng Chia Sẻ Quiz

**Thiết bị 1:**
1. Mở website
2. Tạo quiz mới
3. Click "Chia sẻ"

**Thiết bị 2:**
1. Mở website (hoặc trình duyệt ẩn danh)
2. Vào mục "Khám phá"
3. Phải thấy quiz vừa chia sẻ từ thiết bị 1

**Nếu không thấy:**
- Mở Console (F12)
- Chạy: `localStorage.clear()`
- Refresh trang (F5)
- Thử lại

---

## 🐛 XỬ LÝ LỖI

### Lỗi: "Git chưa cài đặt"
**Giải pháp:**
1. Tải Git: https://git-scm.com/download/win
2. Cài đặt với cấu hình mặc định
3. Chạy lại script

### Lỗi: "Permission denied" khi push
**Giải pháp:**
```bash
# Cấu hình Git
git config --global user.name "tranvananh112"
git config --global user.email "your-email@example.com"

# Thử push lại
git push origin main --force
```

### Lỗi: "Branch master" thay vì "main"
**Giải pháp:**
```bash
git push origin master --force
```

### Lỗi: "No remote"
**Giải pháp:**
```bash
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
git push origin main --force
```

### Vercel vẫn báo 404 sau khi push
**Giải pháp:**
1. Vào Vercel Dashboard
2. Settings → General → Root Directory
3. Đảm bảo để trống hoặc nhập `.`
4. Save
5. Deployments → Redeploy

### Không thấy quiz chia sẻ
**Giải pháp:**
1. Kiểm tra CORS đã cấu hình chưa
2. Mở Console (F12) xem có lỗi không
3. Chạy: `localStorage.clear()`
4. Refresh trang

---

## 📋 CHECKLIST

- [ ] Đã chạy script hoặc lệnh Git Bash
- [ ] Kiểm tra GitHub - `index.html` ở root
- [ ] Đợi Vercel deploy (1-2 phút)
- [ ] Website hiển thị giao diện (không còn 404)
- [ ] Đã cấu hình Supabase CORS
- [ ] Test chia sẻ quiz trên 2 thiết bị
- [ ] Người dùng khác thấy được quiz đã chia sẻ

---

## 🎉 HOÀN THÀNH!

Khi tất cả checklist đã xong:
- ✅ Website chạy trên Vercel
- ✅ Tính năng chia sẻ quiz hoạt động
- ✅ Người dùng khác thấy được quiz
- ✅ Hệ thống hoạt động trên mọi thiết bị

**Chúc mừng bạn!** 🚀

---

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn gặp vấn đề, cung cấp:
1. Screenshot lỗi
2. Kết quả lệnh `git status`
3. Link GitHub repository
4. Link website Vercel
5. Screenshot Console (F12) nếu có lỗi

---

## 🔗 LINKS QUAN TRỌNG

- **GitHub Repository:** https://github.com/tranvananh112/TracNghiemThongMinh
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Project:** uyjakelguelunqzdbscb
- **Supabase URL:** https://uyjakelguelunqzdbscb.supabase.co
