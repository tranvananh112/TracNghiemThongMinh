# 🌐 SỬ DỤNG GITHUB PAGES THAY VÌ VERCEL

## ❌ VẤN ĐỀ VỚI VERCEL

Vercel liên tục báo lỗi:
```
Error: Cannot read properties of undefined (reading 'fsPath')
```

**Nguyên nhân:** Vercel đang cố detect project type và gặp lỗi với cấu trúc files.

---

## ✅ GIẢI PHÁP: DÙNG GITHUB PAGES

GitHub Pages **ĐÃ TỰ ĐỘNG DEPLOY** website của bạn!

### 🌐 Website đã live tại:

```
https://tranvananh112.github.io/TracNghiemThongMinh/
```

---

## 🎯 KIỂM TRA GITHUB PAGES

### Bước 1: Kiểm tra GitHub Actions

1. Vào: https://github.com/tranvananh112/TracNghiemThongMinh
2. Click tab **"Actions"**
3. Xem workflow **"Deploy Jekyll with GitHub Pages"**
4. Nếu có dấu ✅ màu xanh → Website đã deploy thành công

### Bước 2: Mở website

Mở link này trong trình duyệt:
```
https://tranvananh112.github.io/TracNghiemThongMinh/
```

**Nếu thấy giao diện → THÀNH CÔNG!** 🎉

---

## ⚙️ CẤU HÌNH SUPABASE CORS

Bây giờ cần thêm domain GitHub Pages vào Supabase:

### Bước 1: Vào Supabase Dashboard

1. Vào: https://supabase.com/dashboard
2. Chọn project: **uyjakelguelunqzdbscb**

### Bước 2: Thêm domain

1. Vào **Settings** (biểu tượng bánh răng)
2. Chọn **API**
3. Cuộn xuống **CORS Configuration** hoặc **Allowed Origins**
4. Thêm domain:
   ```
   https://tranvananh112.github.io
   ```
5. Click **Save**

**Lưu ý:** Chỉ cần thêm `https://tranvananh112.github.io` (không cần `/TracNghiemThongMinh`)

---

## 🧪 TEST TÍNH NĂNG CHIA SẺ QUIZ

### Thiết bị 1 (Máy tính)

1. Mở: https://tranvananh112.github.io/TracNghiemThongMinh/
2. Tạo quiz mới:
   - Nhập tên: "Test Quiz"
   - Thêm vài câu hỏi
   - Lưu quiz
3. Click **"Chia sẻ"**
4. Xác nhận chia sẻ thành công

### Thiết bị 2 (Điện thoại hoặc trình duyệt ẩn danh)

1. Mở: https://tranvananh112.github.io/TracNghiemThongMinh/
2. Vào mục **"Khám phá"**
3. Phải thấy quiz "Test Quiz" vừa chia sẻ
4. Click vào quiz và làm thử

### Nếu không thấy quiz:

1. Mở Console (F12)
2. Chạy: `localStorage.clear()`
3. Refresh trang (F5)
4. Thử lại

---

## 🔄 TỰ ĐỘNG DEPLOY

Mỗi khi bạn push code lên GitHub:
- ✅ GitHub Actions tự động chạy
- ✅ Website tự động cập nhật
- ✅ Không cần làm gì thêm

**Xem deployment:**
- GitHub → Actions → Xem workflow mới nhất

---

## 🆚 SO SÁNH GITHUB PAGES VS VERCEL

| Tính năng | GitHub Pages | Vercel |
|-----------|--------------|--------|
| **Tốc độ deploy** | 2-5 phút | 1-2 phút (khi không lỗi) |
| **Độ ổn định** | ⭐⭐⭐⭐⭐ Rất cao | ⭐⭐⭐ Đôi khi lỗi |
| **Dễ setup** | ⭐⭐⭐⭐⭐ Rất dễ | ⭐⭐⭐ Phức tạp hơn |
| **Custom domain** | ✅ Miễn phí | ✅ Miễn phí |
| **HTTPS** | ✅ Tự động | ✅ Tự động |
| **CDN** | ✅ Global | ✅ Global |
| **Giới hạn** | 1GB, 100GB bandwidth/tháng | 100GB bandwidth/tháng |

**Kết luận:** GitHub Pages **ổn định hơn** và **dễ dùng hơn** cho static site!

---

## 🎨 TÙY CHỈNH DOMAIN (TÙY CHỌN)

Nếu bạn có domain riêng (ví dụ: tracnghiem.com):

### Bước 1: Cấu hình DNS

Thêm CNAME record:
```
Type: CNAME
Name: www (hoặc @)
Value: tranvananh112.github.io
```

### Bước 2: Cấu hình GitHub

1. Vào: https://github.com/tranvananh112/TracNghiemThongMinh
2. Settings → Pages
3. Custom domain: Nhập domain của bạn
4. Save

### Bước 3: Cập nhật Supabase CORS

Thêm domain mới vào Supabase CORS.

---

## 🐛 XỬ LÝ LỖI

### Lỗi: 404 trên GitHub Pages

**Nguyên nhân:** Website chưa deploy xong

**Giải pháp:**
1. Vào GitHub → Actions
2. Đợi workflow chạy xong (màu xanh)
3. Thử lại sau 2-3 phút

### Lỗi: Không thấy quiz chia sẻ

**Nguyên nhân:** Chưa cấu hình Supabase CORS

**Giải pháp:**
1. Thêm `https://tranvananh112.github.io` vào Supabase CORS
2. Xóa localStorage: `localStorage.clear()`
3. Refresh trang

### Lỗi: CSS không load

**Nguyên nhân:** Path không đúng

**Giải pháp:**
- Kiểm tra Console (F12) xem lỗi gì
- Đảm bảo tất cả files CSS ở root

---

## 📊 THEO DÕI DEPLOYMENT

### Xem GitHub Actions

1. Vào: https://github.com/tranvananh112/TracNghiemThongMinh/actions
2. Click vào workflow mới nhất
3. Xem logs chi tiết

### Xem traffic

1. GitHub → Insights → Traffic
2. Xem số lượng visitors, views

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Mở https://tranvananh112.github.io/TracNghiemThongMinh/
- [ ] Website hiển thị giao diện đúng
- [ ] Đã thêm domain vào Supabase CORS
- [ ] Test tạo quiz
- [ ] Test chia sẻ quiz
- [ ] Test trên thiết bị khác
- [ ] Người dùng khác thấy được quiz

---

## 🎉 HOÀN THÀNH!

Website của bạn đã:
- ✅ Chạy trên GitHub Pages
- ✅ Có HTTPS miễn phí
- ✅ Tự động deploy khi push code
- ✅ Ổn định và đáng tin cậy
- ✅ Không cần lo lỗi Vercel nữa

**Domain chính thức:**
```
https://tranvananh112.github.io/TracNghiemThongMinh/
```

**Chúc mừng!** 🚀

---

## 📞 HỖ TRỢ

**GitHub Pages Documentation:**
- https://docs.github.com/en/pages

**Supabase Documentation:**
- https://supabase.com/docs

**Nếu cần trợ giúp:**
- Kiểm tra GitHub Actions logs
- Kiểm tra Console (F12) trên website
- Gửi screenshot lỗi
