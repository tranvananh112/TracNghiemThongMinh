# 🔧 SỬA LỖI VERCEL DEPLOYMENT

## ✅ ĐÃ THỰC HIỆN

Tôi đã sửa các vấn đề sau:

1. ✅ Đơn giản hóa `vercel.json` - xóa cấu hình phức tạp
2. ✅ Xóa `package.json` và `package-lock.json` - không cần cho static site
3. ✅ Tạo `.vercelignore` - bỏ qua các file không cần thiết
4. ✅ Push lên GitHub

---

## 🎯 BƯỚC TIẾP THEO

### CÁCH 1: Đợi Vercel tự động deploy lại (1-2 phút)

Vercel sẽ tự động detect thay đổi và deploy lại.

Kiểm tra tại: https://github.com/tranvananh112/TracNghiemThongMinh

---

### CÁCH 2: Redeploy thủ công trên Vercel

Nếu sau 2 phút vẫn lỗi:

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Chọn project TracNghiemThongMinh**

3. **Vào tab "Deployments"**

4. **Click "Redeploy"** ở deployment mới nhất

5. **Chọn "Redeploy"** (không cần thay đổi gì)

---

### CÁCH 3: Cấu hình lại project (nếu vẫn lỗi)

1. **Vào Vercel Dashboard**

2. **Chọn project → Settings**

3. **General Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `.` (hoặc để trống)
   - **Build Command:** (để trống)
   - **Output Directory:** (để trống)
   - **Install Command:** (để trống)

4. **Click "Save"**

5. **Vào "Deployments" → "Redeploy"**

---

## 🔍 KIỂM TRA LỖI

### Xem Deployment Logs

1. Vào Vercel Dashboard
2. Chọn project
3. Click vào deployment bị lỗi
4. Xem **Build Logs**
5. Tìm dòng lỗi màu đỏ

### Các lỗi thường gặp:

**Lỗi: "No Output Directory"**
- Giải pháp: Settings → Output Directory → Để trống

**Lỗi: "Build failed"**
- Giải pháp: Settings → Build Command → Để trống

**Lỗi: "npm install failed"**
- Giải pháp: Đã xóa package.json rồi, redeploy lại

**Lỗi: 404 NOT_FOUND**
- Giải pháp: Settings → Root Directory → Để trống

---

## ✅ SAU KHI DEPLOY THÀNH CÔNG

### 1. Kiểm tra website

Mở link Vercel (ví dụ: `https://trac-nghiem-thong-minh.vercel.app`)

Phải thấy:
- ✅ Giao diện hiển thị đúng
- ✅ Không có lỗi 404
- ✅ Các nút bấm hoạt động

### 2. Cấu hình Supabase CORS

1. Copy domain Vercel của bạn
2. Vào: https://supabase.com/dashboard
3. Chọn project: `uyjakelguelunqzdbscb`
4. Settings → API → CORS Configuration
5. Thêm domain Vercel
6. Save

### 3. Test tính năng chia sẻ quiz

**Thiết bị 1:**
- Tạo quiz mới
- Click "Chia sẻ"

**Thiết bị 2:**
- Vào "Khám phá"
- Phải thấy quiz vừa chia sẻ

---

## 🐛 NẾU VẪN LỖI

### Option 1: Xóa và tạo lại project Vercel

1. Vào Vercel Dashboard
2. Settings → Delete Project
3. Import lại từ GitHub
4. Cấu hình như trên

### Option 2: Deploy bằng Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

### Option 3: Dùng GitHub Pages thay vì Vercel

GitHub Pages đã được cấu hình sẵn (Jekyll workflow).

Website sẽ tự động deploy tại:
```
https://tranvananh112.github.io/TracNghiemThongMinh/
```

Không cần làm gì thêm!

---

## 📞 CẦN TRỢ GIÚP?

Nếu vẫn gặp lỗi, gửi cho tôi:

1. Screenshot lỗi trên Vercel
2. Build logs (copy toàn bộ)
3. Link Vercel project
4. Screenshot Settings → General

---

## 🎉 HOÀN THÀNH!

Sau khi deploy thành công:
- ✅ Website chạy trên Vercel
- ✅ HTTPS miễn phí
- ✅ Tự động deploy khi push code
- ✅ Tính năng chia sẻ quiz hoạt động

**Chúc mừng!** 🚀
