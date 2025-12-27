# 🔍 KIỂM TRA CHỨC NĂNG CHIA SẺ

## ❓ Vấn đề hiện tại
Người dùng chia sẻ bài nhưng người khác không thấy được (chỉ lưu offline).

## ✅ CÁCH KIỂM TRA

### Bước 1: Kiểm tra Supabase đã kết nối chưa

1. Mở trang chính: **http://localhost:3000**
2. Nhấn **F12** để mở Console
3. Tìm các dòng sau:

```
✅ Supabase initialized successfully
✅ Supabase is available
```

**Nếu KHÔNG thấy** → Supabase chưa kết nối → Đọc phần "Sửa lỗi" bên dưới

### Bước 2: Test chia sẻ quiz

1. Tạo một quiz mới (hoặc chọn quiz có sẵn)
2. Click nút **"Chia sẻ"** (biểu tượng share)
3. Nhập tên và mô tả
4. Click **"Chia sẻ"**
5. Xem thông báo:

**Nếu thấy:**
- ✅ "☁️ Đang chia sẻ lên Supabase..." → Đang kết nối Supabase
- ✅ "✨ Đã chia sẻ lên Supabase thành công!" → THÀNH CÔNG!
- ❌ "🔄 Đang kiểm tra Local Server..." → Supabase KHÔNG hoạt động
- ❌ "📱 Đã lưu offline" → Chỉ lưu local, CHƯA lên cloud

### Bước 3: Kiểm tra người khác có thấy không

1. Mở **tab ẩn danh** (Ctrl+Shift+N)
2. Truy cập: **http://localhost:3000**
3. Vào tab **"Khám Phá"**
4. Xem có quiz vừa chia sẻ không

**Nếu THẤY** → ✅ Thành công!
**Nếu KHÔNG THẤY** → ❌ Có vấn đề

---

## 🔧 SỬA LỖI

### Lỗi 1: Supabase chưa kết nối

**Triệu chứng:** Console không thấy "✅ Supabase initialized successfully"

**Giải pháp:**

1. Kiểm tra file `supabase-config.js`:
   - URL: `https://uyjakelguelunqzdbscb.supabase.co`
   - Key: Đã có đúng không?

2. Chạy lại SQL trong Supabase:
   - File: `SUPABASE_SETUP_HOAN_CHINH_TAT_CA.sql`
   - Hoặc: `SUPABASE_TAO_ANALYTICS_EVENTS.sql` + `SUPABASE_BO_SUNG_MOI.sql`

3. Refresh trang (Ctrl+F5)

### Lỗi 2: Chia sẻ nhưng chỉ lưu offline

**Triệu chứng:** Thấy thông báo "📱 Đã lưu offline"

**Nguyên nhân:** `exploreQuizManager.isSupabaseAvailable = false`

**Giải pháp:**

Mở Console (F12) và chạy lệnh sau:

```javascript
// Kiểm tra Supabase
console.log('Supabase available?', window.supabaseQuizManager?.isAvailable());
console.log('Explore knows Supabase?', exploreQuizManager?.isSupabaseAvailable);

// Force enable Supabase
if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
    exploreQuizManager.isSupabaseAvailable = true;
    console.log('✅ Đã bật Supabase cho Explore Manager');
}
```

Sau đó thử chia sẻ lại.

### Lỗi 3: Lỗi 404 khi chia sẻ

**Triệu chứng:** Console thấy lỗi `POST .../shared_quizzes 404`

**Giải pháp:**

Bảng `shared_quizzes` chưa được tạo trong Supabase.

1. Vào: https://supabase.com/dashboard/project/uyjakelguelunqzdbscb/editor
2. Chạy SQL: `SUPABASE_SETUP_HOAN_CHINH_TAT_CA.sql`
3. Kiểm tra Table Editor → Phải thấy bảng `shared_quizzes`

---

## 🧪 TEST NHANH

### Test 1: Kiểm tra Supabase trong Console

Mở Console (F12) và chạy:

```javascript
// Test kết nối
window.supabaseQuizManager.isAvailable()
// Kết quả: true → OK, false → Có vấn đề

// Test lấy quiz
window.supabaseQuizManager.getAllQuizzes(10).then(result => {
    console.log('Số quiz:', result.quizzes.length);
    console.log('Danh sách:', result.quizzes);
});
```

### Test 2: Chia sẻ quiz test

```javascript
// Tạo quiz test
const testQuiz = {
    id: 'test-' + Date.now(),
    title: 'Quiz Test Console',
    description: 'Test từ console',
    questions: [
        {
            question: 'Test?',
            answers: ['A', 'B', 'C', 'D'],
            correctAnswer: 0
        }
    ]
};

// Chia sẻ
window.supabaseQuizManager.shareQuiz(testQuiz, 'Test User').then(result => {
    console.log('Kết quả:', result);
    if (result.success) {
        console.log('✅ Chia sẻ thành công!');
    }
});
```

### Test 3: Xem quiz vừa chia sẻ

```javascript
// Load lại danh sách
exploreQuizManager.loadSharedQuizzes();
```

---

## 📊 CHECKLIST HOÀN CHỈNH

- [ ] Console thấy "✅ Supabase initialized successfully"
- [ ] Console thấy "✅ Supabase is available"
- [ ] Chạy `window.supabaseQuizManager.isAvailable()` → trả về `true`
- [ ] Chạy `exploreQuizManager.isSupabaseAvailable` → trả về `true`
- [ ] Chia sẻ quiz → Thấy "☁️ Đang chia sẻ lên Supabase..."
- [ ] Chia sẻ quiz → Thấy "✨ Đã chia sẻ lên Supabase thành công!"
- [ ] Mở tab ẩn danh → Vào "Khám Phá" → Thấy quiz vừa chia sẻ
- [ ] Người dùng khác (máy khác) → Vào "Khám Phá" → Thấy quiz

---

## 🎯 KẾT LUẬN

Nếu tất cả checklist đều ✅ → Hệ thống hoạt động hoàn hảo!

Nếu vẫn có vấn đề → Gửi cho tôi:
1. Screenshot Console (F12)
2. Thông báo khi chia sẻ
3. Kết quả các lệnh test trong Console
