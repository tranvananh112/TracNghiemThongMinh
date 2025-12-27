# 🔧 HƯỚNG DẪN SỬA CẤU TRÚC THƯ MỤC - KHẮC PHỤC LỖI 404

## ❌ VẤN ĐỀ HIỆN TẠI

Files đang nằm trong thư mục con `TracNghiemProMax-main/` thay vì ở root:

```
Repository/
├── .vscode/
└── TracNghiemProMax-main/
    ├── index.html  ❌ (phải ở root)
    ├── style.css   ❌ (phải ở root)
    └── ...
```

Vercel/v0.dev không tìm thấy `index.html` → Lỗi **404: NOT_FOUND**

## ✅ GIẢI PHÁP

### CÁCH 1: Di chuyển files bằng File Explorer (ĐƠN GIẢN NHẤT)

1. **Mở File Explorer** và vào thư mục project của bạn
2. **Vào thư mục `TracNghiemProMax-main`**
3. **Chọn tất cả files** (Ctrl + A)
4. **Cut** (Ctrl + X)
5. **Quay lại thư mục cha** (lên 1 cấp)
6. **Paste** (Ctrl + V) - tất cả files sẽ được di chuyển lên root
7. **Xóa thư mục rỗng `TracNghiemProMax-main`**
8. **Xóa thư mục `.vscode`** (nếu có)

### CÁCH 2: Sử dụng Command Prompt

Mở **Command Prompt** (cmd) tại thư mục project và chạy:

```cmd
REM Di chuyển tất cả files lên root
xcopy /E /I /Y TracNghiemProMax-main\* .

REM Copy file .gitignore
copy /Y TracNghiemProMax-main\.gitignore .gitignore

REM Xóa thư mục cũ
rmdir /S /Q TracNghiemProMax-main

REM Xóa .vscode
rmdir /S /Q .vscode
```

### CÁCH 3: Sử dụng PowerShell

Mở **PowerShell** tại thư mục project và chạy:

```powershell
# Di chuyển tất cả files
Get-ChildItem -Path "TracNghiemProMax-main" -Recurse | Move-Item -Destination "." -Force

# Xóa thư mục cũ
Remove-Item -Path "TracNghiemProMax-main" -Recurse -Force

# Xóa .vscode
Remove-Item -Path ".vscode" -Recurse -Force
```

## 📤 PUSH LÊN GITHUB

Sau khi di chuyển xong, chạy các lệnh sau:

```bash
# Kiểm tra trạng thái
git status

# Thêm tất cả files
git add .

# Commit
git commit -m "Fix: Move all files to root directory for deployment"

# Push lên GitHub (force để ghi đè)
git push origin main --force
```

## 🔍 KIỂM TRA SAU KHI PUSH

1. Vào GitHub repository: https://github.com/tranvananh112/TracNghiemThongMinh
2. Kiểm tra xem `index.html` đã ở root chưa
3. Cấu trúc đúng phải như này:

```
Repository/
├── .git/
├── .gitignore
├── index.html          ✅
├── style.css           ✅
├── script.js           ✅
├── supabase-config.js  ✅
├── explore-quiz.js     ✅
└── ... (các files khác)
```

## 🚀 DEPLOY LẠI TRÊN VERCEL/V0.DEV

Sau khi push lên GitHub:

1. **Vercel sẽ tự động deploy lại** (nếu đã kết nối)
2. Hoặc vào **Vercel Dashboard** → **Deployments** → **Redeploy**
3. Kiểm tra website có hiển thị giao diện chưa

## ⚙️ NẾU VẪN LỖI 404

Nếu sau khi di chuyển files mà vẫn lỗi 404, có thể cần:

### Cấu hình Vercel Root Directory

1. Vào **Vercel Dashboard**
2. Chọn project **TracNghiemThongMinh**
3. Vào **Settings** → **General**
4. Tìm **Root Directory**
5. Để trống (hoặc nhập `.`) để chỉ đến root
6. **Save** và **Redeploy**

## 🔐 CẤU HÌNH SUPABASE CORS

Sau khi deploy thành công, cần thêm domain Vercel vào Supabase:

1. Vào **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project: **uyjakelguelunqzdbscb**
3. Vào **Settings** → **API**
4. Tìm **CORS Configuration**
5. Thêm domain Vercel của bạn (ví dụ: `https://trac-nghiem-thong-minh.vercel.app`)
6. **Save**

## 📝 GHI CHÚ

- Sau khi di chuyển files, tất cả đường dẫn trong code vẫn hoạt động bình thường
- Không cần sửa code gì thêm
- Chỉ cần push lên GitHub và Vercel sẽ deploy đúng

## ❓ CẦN TRỢ GIÚP?

Nếu gặp lỗi khi chạy lệnh, hãy:
1. Chụp màn hình lỗi
2. Cho tôi biết bạn đang dùng cách nào (1, 2, hay 3)
3. Tôi sẽ hỗ trợ thêm
