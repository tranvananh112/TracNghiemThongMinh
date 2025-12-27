# 📤 HƯỚNG DẪN ĐƯA CODE LÊN GITHUB

## 🎯 Repository đích
**https://github.com/tranvananh112/TracNghiemThongMinh.git**

---

## 📋 CHUẨN BỊ

### 1. Cài đặt Git (nếu chưa có)
- Download: https://git-scm.com/download/win
- Cài đặt với các tùy chọn mặc định
- Restart terminal sau khi cài

### 2. Cấu hình Git (lần đầu)
Mở **Git Bash** hoặc **Command Prompt** và chạy:

```bash
git config --global user.name "Tran Van Anh"
git config --global user.email "your-email@example.com"
```

---

## 🚀 CÁCH 1: PUSH CODE MỚI (Repository trống)

### Bước 1: Mở Git Bash trong thư mục project

1. Mở thư mục: `F:\Trắc nghiệm thông minh\TracNghiemProMax-main`
2. Click chuột phải → Chọn **"Git Bash Here"**

### Bước 2: Khởi tạo Git repository

```bash
# Khởi tạo git
git init

# Thêm remote repository
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
```

### Bước 3: Thêm tất cả files

```bash
# Thêm tất cả files
git add .

# Hoặc thêm từng file cụ thể
# git add index.html
# git add supabase-config.js
# git add explore-quiz.js
```

### Bước 4: Commit

```bash
git commit -m "Initial commit - QuizTva Studio with Supabase integration"
```

### Bước 5: Push lên GitHub

```bash
# Push lên branch main
git push -u origin main

# Hoặc nếu branch là master
# git push -u origin master
```

**Lưu ý:** Nếu yêu cầu đăng nhập, nhập username và password GitHub của bạn.

---

## 🔄 CÁCH 2: CẬP NHẬT CODE (Repository đã có sẵn)

### Bước 1: Clone repository về (nếu chưa có)

```bash
cd "F:\Trắc nghiệm thông minh"
git clone https://github.com/tranvananh112/TracNghiemThongMinh.git
```

### Bước 2: Copy files mới vào

1. Copy tất cả files từ `TracNghiemProMax-main`
2. Paste vào thư mục `TracNghiemThongMinh` (ghi đè nếu cần)

### Bước 3: Commit và push

```bash
cd TracNghiemThongMinh

# Xem files đã thay đổi
git status

# Thêm tất cả thay đổi
git add .

# Commit
git commit -m "Update: Add Supabase integration and fix share quiz feature"

# Push
git push origin main
```

---

## 🔐 XỬ LÝ LỖI AUTHENTICATION

### Nếu gặp lỗi authentication:

**Cách 1: Sử dụng Personal Access Token**

1. Vào GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Chọn quyền: `repo` (full control)
4. Copy token
5. Khi push, dùng token thay cho password:
   - Username: `tranvananh112`
   - Password: `<paste token ở đây>`

**Cách 2: Sử dụng GitHub CLI**

```bash
# Cài GitHub CLI
winget install --id GitHub.cli

# Đăng nhập
gh auth login

# Push
git push origin main
```

---

## 📝 CÁC LỆNH GIT HỮU ÍCH

```bash
# Xem trạng thái
git status

# Xem lịch sử commit
git log --oneline

# Xem remote repository
git remote -v

# Pull code mới nhất từ GitHub
git pull origin main

# Tạo branch mới
git checkout -b feature/new-feature

# Chuyển branch
git checkout main

# Xem diff
git diff

# Hủy thay đổi chưa commit
git checkout -- <file>

# Xóa file khỏi git (nhưng giữ trong máy)
git rm --cached <file>
```

---

## 🎯 PUSH LÊN V0.DEV

### Bước 1: Đảm bảo code đã lên GitHub

Làm theo các bước ở trên để push code lên GitHub trước.

### Bước 2: Import vào v0.dev

1. Truy cập: https://v0.dev
2. Đăng nhập
3. Click **"New Project"** hoặc **"Import"**
4. Chọn **"Import from GitHub"**
5. Chọn repository: `tranvananh112/TracNghiemThongMinh`
6. Click **"Import"**

### Bước 3: Cấu hình v0.dev

1. **Framework**: Static HTML/Vanilla JS
2. **Build Command**: (để trống hoặc `echo "No build needed"`)
3. **Output Directory**: `.` (thư mục gốc)
4. **Install Command**: (để trống)

### Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi v0.dev build và deploy
3. Nhận được URL: `https://your-project.v0.app`

### Bước 5: Cấu hình Supabase cho v0.dev

Sau khi deploy, cần cập nhật CORS trong Supabase:

1. Vào Supabase Dashboard
2. Settings → API → CORS
3. Thêm domain v0.dev: `https://your-project.v0.app`

---

## 📦 FILES NÊN THÊM VÀO .gitignore

Tạo file `.gitignore` trong thư mục gốc:

```
# Node modules
node_modules/

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log

# Temporary files
*.tmp
*.temp
```

---

## ✅ CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã xóa thông tin nhạy cảm (API keys, passwords)
- [ ] Đã test code hoạt động tốt
- [ ] Đã tạo file README.md
- [ ] Đã tạo .gitignore
- [ ] Đã commit với message rõ ràng
- [ ] Đã kiểm tra không có file không cần thiết

---

## 🆘 GẶP VẤN ĐỀ?

### Lỗi: "fatal: not a git repository"
```bash
git init
```

### Lỗi: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
```

### Lỗi: "failed to push some refs"
```bash
# Pull trước khi push
git pull origin main --rebase
git push origin main
```

### Lỗi: "Permission denied"
- Kiểm tra đã đăng nhập GitHub chưa
- Sử dụng Personal Access Token thay vì password

---

## 📞 LIÊN HỆ

Nếu cần hỗ trợ thêm, hãy:
1. Chụp màn hình lỗi
2. Copy toàn bộ thông báo lỗi
3. Gửi cho tôi

**Chúc bạn thành công!** 🚀
