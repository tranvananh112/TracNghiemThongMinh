# 📚 HƯỚNG DẪN HOÀN CHỈNH - CHIA SẺ QUIZ LÊN SUPABASE

## 🎯 MỤC TIÊU
Cho phép người dùng chia sẻ quiz lên cloud (Supabase) và mọi người đều có thể xem, làm bài.

---

## 📋 CHUẨN BỊ

### Thông tin Supabase của bạn:
- **URL**: `https://uyjakelguelunqzdbscb.supabase.co`
- **Anon Key**: Đã cấu hình trong `supabase-config.js`

### Files cần thiết:
1. ✅ `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql` - SQL để tạo bảng
2. ✅ `supabase-config.js` - Đã có sẵn, đã cấu hình
3. ✅ `explore-quiz.js` - Đã sửa để ưu tiên Supabase
4. ✅ `test-share-quiz.html` - Tool test

---

## 🚀 BƯỚC 1: CHẠY SQL TRONG SUPABASE

### 1.1. Truy cập SQL Editor

1. Mở: **https://supabase.com/dashboard/project/uyjakelguelunqzdbscb/editor**
2. Click **SQL Editor** (biểu tượng database bên trái)
3. Click **New Query**

### 1.2. Copy và chạy SQL

1. Mở file: **`SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql`**
2. Copy **TOÀN BỘ** nội dung (Ctrl+A, Ctrl+C)
3. Paste vào SQL Editor (Ctrl+V)
4. Click **Run** (hoặc nhấn Ctrl+Enter)

### 1.3. Kiểm tra kết quả

Sau khi chạy xong, bạn sẽ thấy:

```
✅ Bảng shared_quizzes đã được tạo
✅ Indexes đã được tạo
✅ RLS policies đã được thiết lập
✅ Trigger đã được tạo
```

Cuộn xuống cuối, bạn sẽ thấy kết quả kiểm tra:
- Bảng shared_quizzes: ✅ Tồn tại
- Policies: 4 policies (read, insert, update, delete)
- Total quizzes: 0 (hoặc 2 nếu bạn uncomment phần tạo dữ liệu mẫu)

---

## 🔧 BƯỚC 2: KIỂM TRA CẤU HÌNH CODE

### 2.1. Kiểm tra supabase-config.js

File này đã được cấu hình với:
- ✅ URL: `https://uyjakelguelunqzdbscb.supabase.co`
- ✅ Anon Key: Đã có
- ✅ Class `SupabaseQuizManager` với đầy đủ functions

### 2.2. Kiểm tra index.html

Đảm bảo có dòng này trong `index.html`:

```html
<!-- Supabase Integration - Cloud sharing -->
<script type="module" src="supabase-config.js"></script>
```

Phải được load **TRƯỚC** `explore-quiz.js`.

### 2.3. Kiểm tra explore-quiz.js

File này đã được sửa để:
- ✅ Kiểm tra Supabase mỗi lần chia sẻ
- ✅ Kiểm tra Supabase mỗi lần load quiz
- ✅ Ưu tiên Supabase trước Local Server

---

## 🧪 BƯỚC 3: TEST HỆ THỐNG

### 3.1. Test kết nối Supabase

1. Mở: **http://localhost:3000/test-share-quiz.html**
2. Trang sẽ tự động kiểm tra và hiển thị số quiz
3. Nếu thấy "Tìm thấy 0 quiz" → OK, chưa có dữ liệu
4. Nếu thấy lỗi → Có vấn đề, xem phần Troubleshooting

### 3.2. Tạo quiz test

1. Vẫn ở trang test, click **"📤 Chia Sẻ Quiz Test"**
2. Đợi thông báo: "✅ Đã chia sẻ quiz thành công!"
3. Click **"📋 Xem Tất Cả Quiz"**
4. Phải thấy quiz vừa tạo

### 3.3. Test trên trang chính

1. Mở: **http://localhost:3000**
2. Nhấn **Ctrl+F5** (hard refresh)
3. Mở Console (F12)
4. Tìm dòng: `✅ Supabase detected, loading from cloud...`
5. Vào tab **"Khám Phá"**
6. Phải thấy thông báo: `☁️ Đã tải X quiz từ Supabase`
7. Phải thấy quiz test vừa tạo

---

## 📤 BƯỚC 4: TEST CHIA SẺ QUIZ THẬT

### 4.1. Chia sẻ quiz

1. Ở trang chính, tạo một quiz mới (hoặc chọn quiz có sẵn)
2. Click nút **"Chia sẻ"** (biểu tượng share)
3. Nhập thông tin:
   - Tên của bạn
   - Tên đề thi
   - Mô tả (tùy chọn)
4. Click **"Chia sẻ"**

### 4.2. Kiểm tra thông báo

Bạn phải thấy theo thứ tự:
1. `☁️ Đang chia sẻ lên Supabase...`
2. `✨ Đã chia sẻ lên Supabase thành công!`

**Nếu thấy:**
- ❌ `🔄 Đang kiểm tra Local Server...` → Supabase không hoạt động
- ❌ `📱 Đã lưu offline` → Chỉ lưu local, chưa lên cloud

### 4.3. Kiểm tra từ người dùng khác

**Cách 1: Tab ẩn danh (cùng máy)**
1. Nhấn **Ctrl+Shift+N** (Chrome) hoặc **Ctrl+Shift+P** (Firefox)
2. Truy cập: **http://localhost:3000**
3. Vào tab **"Khám Phá"**
4. Phải thấy quiz vừa chia sẻ

**Cách 2: Thiết bị khác (cùng WiFi)**
1. Lấy IP máy chủ: **192.168.100.229** (xem trong terminal khi chạy server)
2. Trên thiết bị khác, mở: **http://192.168.100.229:3000**
3. Vào tab **"Khám Phá"**
4. Phải thấy quiz vừa chia sẻ

**Cách 3: Thiết bị khác (khác WiFi)**
1. Truy cập: **http://localhost:3000** (nếu đã deploy)
2. Hoặc dùng ngrok/cloudflare tunnel
3. Vào tab **"Khám Phá"**
4. Phải thấy quiz vừa chia sẻ

---

## ✅ CHECKLIST HOÀN CHỈNH

### SQL & Database
- [ ] Đã chạy `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql` trong Supabase
- [ ] Vào Table Editor → Thấy bảng `shared_quizzes`
- [ ] Vào Authentication → Policies → Thấy 4 policies cho `shared_quizzes`

### Code & Configuration
- [ ] File `supabase-config.js` có đúng URL và Key
- [ ] File `index.html` load `supabase-config.js` trước `explore-quiz.js`
- [ ] File `explore-quiz.js` đã được sửa (có dòng "KIỂM TRA LẠI Supabase")

### Testing
- [ ] Mở http://localhost:3000/test-share-quiz.html → Không có lỗi
- [ ] Tạo quiz test → Thành công
- [ ] Xem tất cả quiz → Thấy quiz test
- [ ] Mở trang chính → Console thấy "✅ Supabase detected"
- [ ] Vào "Khám Phá" → Thấy quiz test
- [ ] Chia sẻ quiz mới → Thấy "☁️ Đang chia sẻ lên Supabase..."
- [ ] Chia sẻ quiz mới → Thấy "✨ Đã chia sẻ lên Supabase thành công!"
- [ ] Tab ẩn danh → Vào "Khám Phá" → Thấy quiz vừa chia sẻ
- [ ] Thiết bị khác → Vào "Khám Phá" → Thấy quiz vừa chia sẻ

---

## 🔍 TROUBLESHOOTING

### Lỗi 1: "Supabase không khả dụng"

**Triệu chứng:** Console không thấy "✅ Supabase initialized successfully"

**Giải pháp:**
1. Kiểm tra `supabase-config.js`:
   - URL đúng chưa?
   - Key đúng chưa?
2. Refresh trang (Ctrl+F5)
3. Xóa cache: Ctrl+Shift+Delete → Clear cache

### Lỗi 2: "404 Not Found" khi chia sẻ

**Triệu chứng:** Console thấy `POST .../shared_quizzes 404`

**Giải pháp:**
1. Bảng `shared_quizzes` chưa được tạo
2. Chạy lại SQL: `SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql`
3. Kiểm tra Table Editor → Phải thấy bảng

### Lỗi 3: "Permission denied"

**Triệu chứng:** Console thấy lỗi permission

**Giải pháp:**
1. RLS policies chưa đúng
2. Chạy lại phần BƯỚC 4 và 5 trong SQL
3. Kiểm tra Policies → Phải có 4 policies

### Lỗi 4: Chia sẻ nhưng chỉ lưu offline

**Triệu chứng:** Thấy "📱 Đã lưu offline" thay vì "☁️ Đang chia sẻ lên Supabase..."

**Giải pháp:**

Mở Console (F12) và chạy:

```javascript
// Kiểm tra Supabase
console.log('Supabase available?', window.supabaseQuizManager?.isAvailable());

// Force enable
if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
    exploreQuizManager.isSupabaseAvailable = true;
    console.log('✅ Đã bật Supabase');
} else {
    console.log('❌ Supabase chưa sẵn sàng');
}
```

Sau đó thử chia sẻ lại.

### Lỗi 5: Không thấy quiz từ người khác

**Triệu chứng:** Chia sẻ thành công nhưng người khác không thấy

**Giải pháp:**

1. Kiểm tra quiz đã lên Supabase chưa:
   - Vào: https://supabase.com/dashboard/project/uyjakelguelunqzdbscb/editor
   - Click Table Editor → `shared_quizzes`
   - Xem có quiz không

2. Nếu có quiz trong Supabase nhưng không hiển thị:
   - Mở Console (F12)
   - Chạy: `forceReloadFromSupabase()` (từ DEBUG_EXPLORE.js)
   - Hoặc refresh trang (Ctrl+F5)

3. Nếu vẫn không được:
   - Xóa localStorage: `localStorage.clear()`
   - Refresh trang (Ctrl+F5)

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành tất cả các bước:

### ✅ Người dùng A (máy 1):
1. Tạo quiz
2. Click "Chia sẻ"
3. Thấy "✨ Đã chia sẻ lên Supabase thành công!"
4. Quiz xuất hiện trong "Khám Phá"

### ✅ Người dùng B (máy 2):
1. Mở web (không cần cùng WiFi)
2. Vào "Khám Phá"
3. Thấy quiz của người dùng A
4. Có thể làm bài, xem kết quả

### ✅ Người dùng C (máy 3):
1. Mở web
2. Vào "Khám Phá"
3. Thấy quiz của A và B
4. Chia sẻ quiz mới
5. A và B đều thấy quiz của C

---

## 📞 HỖ TRỢ

Nếu vẫn gặp vấn đề, gửi cho tôi:

1. **Screenshot Console (F12)** khi:
   - Load trang chính
   - Chia sẻ quiz
   - Vào tab "Khám Phá"

2. **Kết quả từ test page:**
   - http://localhost:3000/test-share-quiz.html
   - Screenshot hoặc copy text

3. **Thông tin Supabase:**
   - Vào Table Editor → `shared_quizzes`
   - Screenshot số lượng rows

4. **Kết quả debug:**
   - Load `DEBUG_EXPLORE.js` trong Console
   - Copy toàn bộ output

---

## 🎯 TÓM TẮT

**3 bước chính:**
1. Chạy SQL trong Supabase
2. Refresh trang web (Ctrl+F5)
3. Test chia sẻ quiz

**Nếu thành công:**
- ✅ Chia sẻ → Thấy "☁️ Đang chia sẻ lên Supabase..."
- ✅ Tab ẩn danh → Thấy quiz vừa chia sẻ
- ✅ Thiết bị khác → Thấy quiz vừa chia sẻ

**Chúc bạn thành công!** 🚀
