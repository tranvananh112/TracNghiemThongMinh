# 🚀 HƯỚNG DẪN DEPLOY LÊN VERCEL

## 📋 CHUẨN BỊ

Trước khi deploy, đảm bảo:
- ✅ Code đã được push lên GitHub
- ✅ File `index.html` ở root (không còn trong thư mục con)
- ✅ Có tài khoản Vercel (đăng ký miễn phí tại vercel.com)

---

## 🎯 BƯỚC 1: ĐĂNG NHẬP VERCEL

1. Vào: https://vercel.com
2. Click **"Sign Up"** hoặc **"Log In"**
3. Chọn **"Continue with GitHub"**
4. Đăng nhập GitHub và cho phép Vercel truy cập

---

## 🎯 BƯỚC 2: IMPORT REPOSITORY

1. Sau khi đăng nhập, click **"Add New..."** → **"Project"**
2. Chọn **"Import Git Repository"**
3. Tìm repository: **TracNghiemThongMinh**
4. Click **"Import"**

---

## 🎯 BƯỚC 3: CẤU HÌNH PROJECT

### Configure Project

**Project Name:** (để mặc định hoặc đổi tên)
```
trac-nghiem-thong-minh
```

**Framework Preset:** 
```
Other (để mặc định)
```

**Root Directory:**
```
./
(hoặc để trống - QUAN TRỌNG!)
```

**Build Command:**
```
(để trống - không cần build)
```

**Output Directory:**
```
(để trống)
```

**Install Command:**
```
(để trống)
```

### Environment Variables

**Không cần thêm** - Supabase config đã có trong code

---

## 🎯 BƯỚC 4: DEPLOY

1. Click **"Deploy"**
2. Đợi 1-2 phút để Vercel deploy
3. Sau khi xong, bạn sẽ thấy:
   - ✅ Confetti animation (chúc mừng!)
   - ✅ Link website: `https://trac-nghiem-thong-minh.vercel.app`

---

## 🎯 BƯỚC 5: KIỂM TRA WEBSITE

1. Click vào link website Vercel cung cấp
2. Kiểm tra:
   - ✅ Giao diện hiển thị đúng
   - ✅ Không có lỗi 404
   - ✅ Các nút bấm hoạt động

**Nếu thấy lỗi 404:**
- Vào **Settings** → **General**
- Tìm **Root Directory**
- Đảm bảo để trống hoặc nhập `./`
- Click **Save**
- Vào **Deployments** → Click **Redeploy**

---

## 🎯 BƯỚC 6: CẤU HÌNH SUPABASE CORS

### Lấy Domain Vercel

Sau khi deploy, bạn sẽ có domain như:
```
https://trac-nghiem-thong-minh.vercel.app
```

### Thêm vào Supabase

1. Vào: https://supabase.com/dashboard
2. Chọn project: **uyjakelguelunqzdbscb**
3. Vào **Settings** (biểu tượng bánh răng)
4. Chọn **API**
5. Cuộn xuống **CORS Configuration** hoặc **Allowed Origins**
6. Thêm domain Vercel:
   ```
   https://trac-nghiem-thong-minh.vercel.app
   ```
7. Click **Save**

**Lưu ý:** Thay `trac-nghiem-thong-minh` bằng domain thực tế của bạn

---

## 🎯 BƯỚC 7: TEST TÍNH NĂNG CHIA SẺ QUIZ

### Thiết bị 1 (Máy tính)

1. Mở website Vercel
2. Tạo quiz mới:
   - Nhập tên: "Test Quiz"
   - Thêm vài câu hỏi
   - Lưu quiz
3. Click **"Chia sẻ"**
4. Xác nhận chia sẻ thành công

### Thiết bị 2 (Điện thoại hoặc trình duyệt ẩn danh)

1. Mở website Vercel
2. Vào mục **"Khám phá"**
3. Phải thấy quiz "Test Quiz" vừa chia sẻ
4. Click vào quiz và làm thử

**Nếu không thấy quiz:**
- Mở Console (F12)
- Chạy: `localStorage.clear()`
- Refresh trang (F5)
- Thử lại

---

## 🎯 BƯỚC 8: CẤU HÌNH DOMAIN TÙY CHỈNH (TÙY CHỌN)

Nếu bạn có domain riêng (ví dụ: tracnghiem.com):

1. Vào Vercel Dashboard
2. Chọn project
3. Vào **Settings** → **Domains**
4. Click **"Add"**
5. Nhập domain của bạn
6. Làm theo hướng dẫn cấu hình DNS
7. Đợi DNS propagate (5-30 phút)

**Lưu ý:** Nhớ thêm domain mới vào Supabase CORS!

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 404: NOT_FOUND

**Nguyên nhân:** Vercel không tìm thấy `index.html`

**Giải pháp:**
1. Kiểm tra GitHub - `index.html` có ở root không
2. Vercel Settings → Root Directory → Để trống
3. Redeploy

### Lỗi: Failed to load resource (CORS)

**Nguyên nhân:** Chưa cấu hình CORS trong Supabase

**Giải pháp:**
1. Vào Supabase Dashboard
2. Settings → API → CORS
3. Thêm domain Vercel
4. Save

### Lỗi: Cannot read properties of undefined

**Nguyên nhân:** Supabase config chưa đúng

**Giải pháp:**
1. Kiểm tra `supabase-config.js`
2. Đảm bảo URL và anon key đúng
3. Redeploy

### Không thấy quiz đã chia sẻ

**Nguyên nhân:** LocalStorage cache hoặc chưa load từ Supabase

**Giải pháp:**
1. Mở Console (F12)
2. Chạy: `localStorage.clear()`
3. Refresh trang
4. Kiểm tra Console có lỗi không

---

## 📊 THEO DÕI DEPLOYMENT

### Xem Logs

1. Vào Vercel Dashboard
2. Chọn project
3. Vào **Deployments**
4. Click vào deployment mới nhất
5. Xem **Build Logs** và **Function Logs**

### Analytics

1. Vào **Analytics** tab
2. Xem số lượng visitors, page views, etc.

### Performance

1. Vào **Speed Insights**
2. Xem performance metrics
3. Tối ưu nếu cần

---

## 🔄 TỰ ĐỘNG DEPLOY

Sau khi setup xong, mỗi khi bạn push code lên GitHub:
- ✅ Vercel tự động detect thay đổi
- ✅ Tự động build và deploy
- ✅ Không cần làm gì thêm

**Xem deployment:**
- Vào Vercel Dashboard → Deployments
- Xem trạng thái: Building → Ready

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đã đăng nhập Vercel
- [ ] Đã import GitHub repository
- [ ] Root Directory để trống
- [ ] Deploy thành công
- [ ] Website hiển thị giao diện
- [ ] Đã cấu hình Supabase CORS
- [ ] Test chia sẻ quiz trên 2 thiết bị
- [ ] Người dùng khác thấy được quiz

---

## 🎉 HOÀN THÀNH!

Website của bạn đã:
- ✅ Chạy trên Vercel
- ✅ Có HTTPS miễn phí
- ✅ Tự động deploy khi push code
- ✅ Tính năng chia sẻ quiz hoạt động
- ✅ Truy cập được từ mọi thiết bị

**Chúc mừng!** 🚀

---

## 📞 HỖ TRỢ

**Vercel Documentation:**
- https://vercel.com/docs

**Supabase Documentation:**
- https://supabase.com/docs

**Nếu cần trợ giúp:**
- Kiểm tra Vercel logs
- Kiểm tra Console (F12) trên website
- Gửi screenshot lỗi để được hỗ trợ
