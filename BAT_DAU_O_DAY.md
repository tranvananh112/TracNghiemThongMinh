# 🎯 BẮT ĐẦU Ở ĐÂY - PUSH CODE LÊN GITHUB

## ⚡ CÁCH NHANH NHẤT (1 CLICK)

### Double-click file này:
```
PUSH_GITHUB.bat
```

Script sẽ tự động:
1. ✅ Di chuyển files lên root
2. ✅ Xóa thư mục cũ
3. ✅ Push lên GitHub

**Xong!** Đợi 1-2 phút để Vercel deploy.

---

## 🔄 CÁCH THỦ CÔNG (NẾU SCRIPT KHÔNG CHẠY)

### Bước 1: Mở Git Bash
- Click chuột phải trong thư mục project
- Chọn **"Git Bash Here"**

### Bước 2: Copy toàn bộ đoạn này và paste vào Git Bash

```bash
mv TracNghiemProMax-main/* . 2>/dev/null && mv TracNghiemProMax-main/.gitignore . 2>/dev/null && rm -rf TracNghiemProMax-main && rm -rf .vscode && git add . && git commit -m "Fix: Move files to root" && git push origin main --force
```

**Nhấn Enter** và đợi!

---

## 📋 HOẶC CHẠY TỪNG LỆNH

Mở **Git Bash** và chạy từng lệnh:

```bash
# 1. Di chuyển files
mv TracNghiemProMax-main/* .
mv TracNghiemProMax-main/.gitignore .

# 2. Xóa thư mục cũ
rm -rf TracNghiemProMax-main
rm -rf .vscode

# 3. Kiểm tra
ls -la index.html

# 4. Push lên GitHub
git add .
git commit -m "Fix: Move files to root"
git push origin main --force
```

---

## ✅ SAU KHI CHẠY XONG

### 1. Kiểm tra GitHub
Vào: https://github.com/tranvananh112/TracNghiemThongMinh

Xem `index.html` có ở root không:
```
Repository/
├── index.html          ✅ (phải ở đây)
├── style.css           ✅
├── script.js           ✅
└── ...
```

### 2. Đợi Vercel deploy
- Vercel tự động deploy sau 1-2 phút
- Hoặc vào Vercel Dashboard → Redeploy

### 3. Kiểm tra website
- Mở link Vercel của bạn
- Phải thấy giao diện (không còn 404)

### 4. Cấu hình Supabase CORS
1. Vào: https://supabase.com/dashboard
2. Chọn project: `uyjakelguelunqzdbscb`
3. Settings → API → CORS Configuration
4. Thêm domain Vercel (ví dụ: `https://your-app.vercel.app`)
5. Save

### 5. Test chia sẻ quiz
- Mở website trên 2 thiết bị
- Thiết bị 1: Tạo quiz và chia sẻ
- Thiết bị 2: Vào "Khám phá" → Phải thấy quiz

---

## 🐛 XỬ LÝ LỖI

### Lỗi: "branch master" thay vì "main"
```bash
git push origin master --force
```

### Lỗi: "no remote"
```bash
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
git push origin main --force
```

### Lỗi: "permission denied"
```bash
git config --global user.name "tranvananh112"
git config --global user.email "your-email@example.com"
git push origin main --force
```

### Vercel vẫn báo 404
1. Vào Vercel Dashboard
2. Settings → General → Root Directory
3. Để trống hoặc nhập `.`
4. Save → Redeploy

---

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn không được, gửi cho tôi:
- Screenshot lỗi
- Kết quả lệnh `git status`
- Link GitHub và Vercel

---

## 🎉 HOÀN THÀNH!

Sau khi làm xong:
- ✅ Website hiển thị trên Vercel
- ✅ Tính năng chia sẻ quiz hoạt động
- ✅ Người dùng khác thấy được quiz

**Chúc mừng!** 🚀
