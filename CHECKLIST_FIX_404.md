# ✅ CHECKLIST KHẮC PHỤC LỖI 404

## 🎯 MỤC TIÊU
Sửa lỗi 404 trên Vercel/v0.dev do cấu trúc thư mục sai

---

## 📝 DANH SÁCH CÔNG VIỆC

### PHẦN 1: DI CHUYỂN FILES (CHỌN 1 CÁCH)

#### ☐ Cách 1: File Explorer (Đơn giản nhất)
- [ ] Mở File Explorer
- [ ] Vào thư mục `TracNghiemProMax-main`
- [ ] Chọn tất cả files (Ctrl + A)
- [ ] Cut (Ctrl + X)
- [ ] Quay lại thư mục cha
- [ ] Paste (Ctrl + V)
- [ ] Xóa thư mục rỗng `TracNghiemProMax-main`
- [ ] Xóa thư mục `.vscode`

#### ☐ Cách 2: Chạy script tự động
- [ ] Double-click file `FIX_STRUCTURE.bat`
- [ ] Đợi script chạy xong

#### ☐ Cách 3: Command Prompt
```cmd
xcopy /E /I /Y TracNghiemProMax-main\* .
copy /Y TracNghiemProMax-main\.gitignore .gitignore
rmdir /S /Q TracNghiemProMax-main
rmdir /S /Q .vscode
```

---

### PHẦN 2: KIỂM TRA CẤU TRÚC

- [ ] Mở thư mục project
- [ ] Xác nhận `index.html` đã ở root (không còn trong thư mục con)
- [ ] Xác nhận các files khác cũng đã ở root:
  - [ ] `style.css`
  - [ ] `script.js`
  - [ ] `supabase-config.js`
  - [ ] `explore-quiz.js`

---

### PHẦN 3: PUSH LÊN GITHUB

```bash
git status
git add .
git commit -m "Fix: Move files to root directory"
git push origin main --force
```

- [ ] Chạy `git status` - xem có thay đổi không
- [ ] Chạy `git add .` - thêm tất cả files
- [ ] Chạy `git commit` - commit với message
- [ ] Chạy `git push` - push lên GitHub

---

### PHẦN 4: KIỂM TRA GITHUB

- [ ] Vào: https://github.com/tranvananh112/TracNghiemThongMinh
- [ ] Xác nhận `index.html` đã ở root (không còn trong `TracNghiemProMax-main/`)
- [ ] Xác nhận cấu trúc đúng:
  ```
  Repository/
  ├── index.html          ✅
  ├── style.css           ✅
  ├── script.js           ✅
  └── ...
  ```

---

### PHẦN 5: KIỂM TRA VERCEL

- [ ] Đợi 1-2 phút để Vercel tự động deploy
- [ ] Vào link website Vercel
- [ ] Xác nhận website hiển thị giao diện (không còn lỗi 404)

**Nếu vẫn lỗi 404:**
- [ ] Vào Vercel Dashboard
- [ ] Settings → General → Root Directory
- [ ] Đảm bảo để trống hoặc nhập `.`
- [ ] Save và Redeploy

---

### PHẦN 6: CẤU HÌNH SUPABASE CORS

- [ ] Vào: https://supabase.com/dashboard
- [ ] Chọn project: `uyjakelguelunqzdbscb`
- [ ] Settings → API → CORS Configuration
- [ ] Thêm domain Vercel (ví dụ: `https://your-app.vercel.app`)
- [ ] Save

---

### PHẦN 7: KIỂM TRA TÍNH NĂNG CHIA SẺ

- [ ] Mở website trên thiết bị 1
- [ ] Tạo quiz mới và click "Chia sẻ"
- [ ] Mở website trên thiết bị 2 (hoặc trình duyệt ẩn danh)
- [ ] Vào mục "Khám phá"
- [ ] Xác nhận thấy quiz vừa chia sẻ từ thiết bị 1

**Nếu không thấy quiz:**
- [ ] Mở Console (F12)
- [ ] Chạy: `localStorage.clear()`
- [ ] Refresh trang (F5)
- [ ] Thử lại

---

## 🎉 HOÀN THÀNH!

Khi tất cả checkbox đã được đánh dấu:
- ✅ Website hiển thị trên Vercel
- ✅ Tính năng chia sẻ quiz hoạt động
- ✅ Người dùng khác thấy được quiz đã chia sẻ

---

## 📞 GẶP VẤN ĐỀ?

Nếu bất kỳ bước nào không hoạt động:
1. Đọc file `HUONG_DAN_CHI_TIET_FIX_404.md` để biết chi tiết
2. Kiểm tra phần "Xử lý lỗi thường gặp"
3. Liên hệ để được hỗ trợ với:
   - Screenshot lỗi
   - Kết quả `git status`
   - Link GitHub và Vercel
