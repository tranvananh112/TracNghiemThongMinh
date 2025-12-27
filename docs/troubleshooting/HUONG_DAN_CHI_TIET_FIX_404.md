# 📖 HƯỚNG DẪN CHI TIẾT KHẮC PHỤC LỖI 404

## 🎯 MỤC TIÊU
Di chuyển tất cả files từ thư mục `TracNghiemProMax-main/` lên root để Vercel/v0.dev có thể tìm thấy `index.html`.

---

## 📋 CHUẨN BỊ

Trước khi bắt đầu, hãy:
1. ✅ Đóng tất cả files đang mở trong VS Code
2. ✅ Đóng tất cả cửa sổ File Explorer đang mở thư mục project
3. ✅ Backup code (nếu cần)

---

## 🔧 PHƯƠNG PHÁP 1: SỬ DỤNG FILE EXPLORER (KHUYẾN NGHỊ)

### Bước 1: Mở thư mục project
1. Mở **File Explorer** (Windows + E)
2. Điều hướng đến thư mục project của bạn
3. Bạn sẽ thấy cấu trúc như này:
   ```
   📁 Your-Project-Folder/
   ├── 📁 .git/
   ├── 📁 .vscode/
   └── 📁 TracNghiemProMax-main/
       ├── 📄 index.html
       ├── 📄 style.css
       └── ... (nhiều files khác)
   ```

### Bước 2: Vào thư mục TracNghiemProMax-main
1. **Double-click** vào thư mục `TracNghiemProMax-main`
2. Bạn sẽ thấy tất cả files của website

### Bước 3: Chọn tất cả files
1. Nhấn **Ctrl + A** để chọn tất cả
2. Hoặc click chuột phải → **Select all**

### Bước 4: Cut files
1. Nhấn **Ctrl + X** để cut
2. Hoặc click chuột phải → **Cut**

### Bước 5: Quay lại thư mục cha
1. Click vào nút **Back** (←) trên thanh địa chỉ
2. Hoặc nhấn **Alt + ←**
3. Bạn sẽ quay lại thư mục chứa `TracNghiemProMax-main`

### Bước 6: Paste files
1. Nhấn **Ctrl + V** để paste
2. Hoặc click chuột phải → **Paste**
3. Windows sẽ hỏi có ghi đè không → Chọn **Yes to all**

### Bước 7: Xóa thư mục rỗng
1. Xóa thư mục rỗng `TracNghiemProMax-main`
2. Xóa thư mục `.vscode` (nếu có)

### Bước 8: Kiểm tra
Cấu trúc bây giờ phải như này:
```
📁 Your-Project-Folder/
├── 📁 .git/
├── 📄 .gitignore
├── 📄 index.html          ✅ (đã ở root)
├── 📄 style.css           ✅
├── 📄 script.js           ✅
├── 📄 supabase-config.js  ✅
└── ... (các files khác)
```

---

## 🔧 PHƯƠNG PHÁP 2: SỬ DỤNG COMMAND PROMPT

### Bước 1: Mở Command Prompt
1. Nhấn **Windows + R**
2. Gõ `cmd` và nhấn **Enter**

### Bước 2: Điều hướng đến thư mục project
```cmd
cd /d "C:\đường\dẫn\đến\thư\mục\project"
```
(Thay đổi đường dẫn cho phù hợp)

### Bước 3: Chạy lệnh di chuyển files
```cmd
xcopy /E /I /Y TracNghiemProMax-main\* .
```

### Bước 4: Copy .gitignore
```cmd
copy /Y TracNghiemProMax-main\.gitignore .gitignore
```

### Bước 5: Xóa thư mục cũ
```cmd
rmdir /S /Q TracNghiemProMax-main
rmdir /S /Q .vscode
```

### Bước 6: Kiểm tra
```cmd
dir
```
Bạn phải thấy `index.html` trong danh sách

---

## 🔧 PHƯƠNG PHÁP 3: SỬ DỤNG GIT BASH

### Bước 1: Mở Git Bash
1. Click chuột phải trong thư mục project
2. Chọn **Git Bash Here**

### Bước 2: Chạy lệnh
```bash
# Di chuyển tất cả files
mv TracNghiemProMax-main/* .
mv TracNghiemProMax-main/.gitignore .

# Xóa thư mục cũ
rm -rf TracNghiemProMax-main
rm -rf .vscode

# Kiểm tra
ls -la
```

---

## 📤 PUSH LÊN GITHUB

Sau khi di chuyển xong, mở **Git Bash** hoặc **Command Prompt** và chạy:

```bash
# Kiểm tra trạng thái
git status

# Thêm tất cả files
git add .

# Commit với message
git commit -m "Fix: Move all files to root directory for Vercel deployment"

# Push lên GitHub (force để ghi đè)
git push origin main --force
```

**Lưu ý:** Nếu branch của bạn là `master` thay vì `main`, dùng:
```bash
git push origin master --force
```

---

## ✅ KIỂM TRA SAU KHI PUSH

### 1. Kiểm tra trên GitHub
1. Vào: https://github.com/tranvananh112/TracNghiemThongMinh
2. Xem `index.html` có ở root không
3. Cấu trúc phải như này:
   ```
   Repository/
   ├── index.html          ✅
   ├── style.css           ✅
   ├── script.js           ✅
   └── ...
   ```

### 2. Kiểm tra Vercel
1. Vercel sẽ **tự động deploy lại** sau khi push
2. Đợi 1-2 phút để deploy hoàn tất
3. Vào link website Vercel của bạn
4. Kiểm tra có hiển thị giao diện không

### 3. Nếu vẫn lỗi 404
Vào **Vercel Dashboard**:
1. Chọn project **TracNghiemThongMinh**
2. Vào **Settings** → **General**
3. Tìm **Root Directory**
4. Đảm bảo để trống hoặc nhập `.`
5. Click **Save**
6. Vào **Deployments** → Click **Redeploy**

---

## 🔐 CẤU HÌNH SUPABASE CORS (SAU KHI DEPLOY THÀNH CÔNG)

### Bước 1: Lấy domain Vercel
Sau khi deploy thành công, bạn sẽ có domain như:
- `https://trac-nghiem-thong-minh.vercel.app`
- Hoặc domain tùy chỉnh của bạn

### Bước 2: Thêm vào Supabase
1. Vào: https://supabase.com/dashboard
2. Chọn project: **uyjakelguelunqzdbscb**
3. Vào **Settings** → **API**
4. Tìm **CORS Configuration** hoặc **Allowed Origins**
5. Thêm domain Vercel của bạn:
   ```
   https://trac-nghiem-thong-minh.vercel.app
   ```
6. Click **Save**

### Bước 3: Kiểm tra tính năng chia sẻ
1. Mở website trên **thiết bị 1**
2. Tạo một quiz mới và click **Chia sẻ**
3. Mở website trên **thiết bị 2** (hoặc trình duyệt ẩn danh)
4. Vào mục **Khám phá**
5. Bạn phải thấy quiz vừa chia sẻ từ thiết bị 1

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Access denied" khi xóa thư mục
**Nguyên nhân:** Thư mục đang được mở trong VS Code hoặc File Explorer

**Giải pháp:**
1. Đóng VS Code
2. Đóng tất cả cửa sổ File Explorer
3. Thử lại

### Lỗi: "git push" bị từ chối
**Nguyên nhân:** Có conflict hoặc branch protection

**Giải pháp:**
```bash
# Force push (cẩn thận!)
git push origin main --force

# Hoặc nếu dùng master
git push origin master --force
```

### Lỗi: Vercel vẫn báo 404
**Nguyên nhân:** Vercel cache hoặc cấu hình sai

**Giải pháp:**
1. Vào Vercel Dashboard
2. Settings → General → Root Directory → Để trống
3. Deployments → Redeploy
4. Xóa cache trình duyệt (Ctrl + Shift + Delete)

### Lỗi: Không thấy quiz chia sẻ
**Nguyên nhân:** Chưa cấu hình CORS hoặc RLS policies

**Giải pháp:**
1. Kiểm tra CORS đã thêm domain Vercel chưa
2. Chạy lại SQL setup trong Supabase:
   - `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql`
3. Xóa localStorage: Mở Console (F12) → gõ `localStorage.clear()`

---

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn gặp vấn đề, hãy cung cấp:
1. ✅ Screenshot lỗi trên Vercel
2. ✅ Kết quả lệnh `git status`
3. ✅ Link GitHub repository
4. ✅ Link website Vercel
5. ✅ Screenshot Console (F12) nếu có lỗi JavaScript

---

## 🎉 HOÀN THÀNH!

Sau khi làm theo hướng dẫn:
- ✅ Website hiển thị giao diện trên Vercel
- ✅ Người dùng có thể chia sẻ quiz
- ✅ Người dùng khác thấy được quiz đã chia sẻ
- ✅ Hệ thống hoạt động trên mọi thiết bị

Chúc bạn thành công! 🚀
