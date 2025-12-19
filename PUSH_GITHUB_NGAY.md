# 🚀 PUSH CODE LÊN GITHUB NGAY - 3 BƯỚC

## ⚡ CÁCH NHANH NHẤT

### BƯỚC 1: Mở PowerShell
1. Nhấn **Windows + X**
2. Chọn **Windows PowerShell** hoặc **Terminal**
3. Điều hướng đến thư mục project:
   ```powershell
   cd "C:\đường\dẫn\đến\thư\mục\project"
   ```

### BƯỚC 2: Chạy script di chuyển files
```powershell
powershell -ExecutionPolicy Bypass -File move-to-root.ps1
```

### BƯỚC 3: Push lên GitHub
```bash
git add .
git commit -m "Fix: Move files to root directory for deployment"
git push origin main --force
```

---

## 🔄 HOẶC LÀM THỦ CÔNG (NẾU SCRIPT KHÔNG CHẠY)

### Cách 1: Dùng Git Bash (Khuyến nghị)

1. **Click chuột phải** trong thư mục project
2. Chọn **Git Bash Here**
3. Chạy lệnh:

```bash
# Di chuyển files
mv TracNghiemProMax-main/* . 2>/dev/null
mv TracNghiemProMax-main/.* . 2>/dev/null

# Xóa thư mục cũ
rm -rf TracNghiemProMax-main
rm -rf .vscode

# Kiểm tra
ls -la index.html

# Push lên GitHub
git add .
git commit -m "Fix: Move files to root directory"
git push origin main --force
```

### Cách 2: Dùng File Explorer

1. Mở thư mục project
2. Vào `TracNghiemProMax-main`
3. **Ctrl + A** (chọn tất cả)
4. **Ctrl + X** (cut)
5. Quay lại thư mục cha
6. **Ctrl + V** (paste)
7. Xóa thư mục rỗng `TracNghiemProMax-main`
8. Mở Git Bash và chạy:
   ```bash
   git add .
   git commit -m "Fix: Move files to root"
   git push origin main --force
   ```

---

## ✅ KIỂM TRA SAU KHI PUSH

1. **Vào GitHub:** https://github.com/tranvananh112/TracNghiemThongMinh
2. **Xem `index.html`** có ở root không (không còn trong thư mục con)
3. **Đợi Vercel deploy** (1-2 phút)
4. **Mở website** và kiểm tra

---

## 🔧 NẾU GẶP LỖI

### Lỗi: "git push" bị từ chối
```bash
# Kiểm tra remote
git remote -v

# Nếu chưa có remote, thêm vào
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git

# Push với force
git push origin main --force
```

### Lỗi: "Permission denied"
```bash
# Đăng nhập GitHub
git config --global user.name "tranvananh112"
git config --global user.email "your-email@example.com"

# Thử push lại
git push origin main --force
```

### Lỗi: Branch là "master" thay vì "main"
```bash
# Kiểm tra branch hiện tại
git branch

# Nếu là master, dùng:
git push origin master --force
```

---

## 🎯 SAU KHI PUSH THÀNH CÔNG

### 1. Cấu hình Vercel (nếu cần)
- Vào Vercel Dashboard
- Settings → General → Root Directory → Để trống
- Save và Redeploy

### 2. Cấu hình Supabase CORS
- Vào https://supabase.com/dashboard
- Chọn project `uyjakelguelunqzdbscb`
- Settings → API → CORS
- Thêm domain Vercel của bạn
- Save

### 3. Test tính năng chia sẻ
- Mở website trên 2 thiết bị
- Tạo quiz và chia sẻ
- Kiểm tra thiết bị khác có thấy không

---

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn không chạy được, gửi cho tôi:
- Screenshot lỗi
- Kết quả lệnh `git status`
- Link website Vercel

---

## 🎉 XONG!

Sau khi làm xong, website sẽ:
- ✅ Hiển thị giao diện trên Vercel
- ✅ Chạy được tính năng chia sẻ quiz
- ✅ Người dùng khác thấy được quiz đã chia sẻ
