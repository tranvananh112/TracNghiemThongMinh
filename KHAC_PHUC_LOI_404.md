# 🚨 KHẮC PHỤC LỖI 404 - WEBSITE KHÔNG HIỂN THỊ

## VẤN ĐỀ
Website deploy lên Vercel/v0.dev bị lỗi **404: NOT_FOUND** vì files đang nằm trong thư mục con `TracNghiemProMax-main/` thay vì ở root.

## GIẢI PHÁP NHANH (3 BƯỚC)

### BƯỚC 1: Chạy script tự động

**Double-click** vào file `FIX_STRUCTURE.bat` để chạy tự động.

Script sẽ:
- ✅ Di chuyển tất cả files lên root
- ✅ Xóa thư mục cũ
- ✅ Kiểm tra cấu trúc

### BƯỚC 2: Push lên GitHub

Mở **Command Prompt** hoặc **Git Bash** và chạy:

```bash
git add .
git commit -m "Fix: Move files to root directory"
git push origin main --force
```

### BƯỚC 3: Kiểm tra

1. Vào GitHub: https://github.com/tranvananh112/TracNghiemThongMinh
2. Xem `index.html` đã ở root chưa
3. Vercel sẽ tự động deploy lại
4. Kiểm tra website có hiển thị chưa

---

## NẾU SCRIPT KHÔNG CHẠY ĐƯỢC

### Cách thủ công (dùng File Explorer):

1. Mở thư mục project
2. Vào thư mục `TracNghiemProMax-main`
3. Chọn tất cả files (Ctrl + A)
4. Cut (Ctrl + X)
5. Quay lại thư mục cha
6. Paste (Ctrl + V)
7. Xóa thư mục rỗng `TracNghiemProMax-main`
8. Chạy lệnh git ở BƯỚC 2

---

## SAU KHI DEPLOY THÀNH CÔNG

### Cấu hình CORS cho Supabase:

1. Vào https://supabase.com/dashboard
2. Chọn project `uyjakelguelunqzdbscb`
3. Settings → API → CORS Configuration
4. Thêm domain Vercel của bạn (ví dụ: `https://your-app.vercel.app`)
5. Save

### Kiểm tra tính năng chia sẻ quiz:

1. Mở website trên 2 thiết bị khác nhau
2. Thiết bị 1: Tạo quiz và chia sẻ
3. Thiết bị 2: Vào "Khám phá" → Phải thấy quiz vừa chia sẻ

---

## CẦN TRỢ GIÚP?

Nếu vẫn gặp lỗi, hãy gửi cho tôi:
- Screenshot lỗi trên Vercel
- Kết quả của lệnh `git status`
- Link website Vercel của bạn
