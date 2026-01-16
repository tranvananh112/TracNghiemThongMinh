# 🎠 HƯỚNG DẪN KIỂM TRA CAROUSEL

## ✅ Đã Sửa Xong

Tôi đã xóa CSS trùng lặp trong file `index.html` và giữ lại CSS từ file external `src/css/components/style-quiz-carousel.css`.

## 📋 Các File Đã Tạo/Sửa

1. **index.html** - Đã xóa CSS trùng lặp trong thẻ `<style>`
2. **TEST_CAROUSEL_SIMPLE.html** - File test đơn giản để kiểm tra carousel
3. **src/css/components/style-quiz-carousel.css** - File CSS carousel (đã có sẵn, không thay đổi)

## 🧪 Cách Kiểm Tra

### Bước 1: Kiểm tra file test đơn giản
```bash
# Mở file này trong trình duyệt
TEST_CAROUSEL_SIMPLE.html
```

File này sẽ hiển thị carousel với 6 quiz mẫu. Nếu carousel hoạt động tốt ở đây, nghĩa là CSS đã đúng.

### Bước 2: Kiểm tra index.html
```bash
# Mở file index.html trong trình duyệt
index.html
```

Carousel sẽ hiển thị ở 2 vị trí:
1. **📚 Quiz Của Bạn** - Hiển thị quiz cá nhân (nếu có)
2. **🌐 Quiz Đã Chia Sẻ** - Hiển thị quiz từ cộng đồng

### Bước 3: Mở Console để xem log
Nhấn `F12` và xem tab Console, bạn sẽ thấy:
```
🎠 Loading quiz carousel with X quizzes
✅ Quiz carousel HTML inserted
🌐 Loading shared quiz carousel...
✅ Shared quiz carousel loaded
```

## 🔍 Vấn Đề Có Thể Gặp

### 1. Carousel không hiển thị
**Nguyên nhân:** Chưa có quiz nào
**Giải pháp:** Tạo ít nhất 1 quiz từ tab "Tạo Bài Quiz"

### 2. Carousel không lướt
**Nguyên nhân:** CSS animation bị tắt
**Giải pháp:** Kiểm tra xem trình duyệt có bật "Reduce Motion" không

### 3. Quiz card không có hiệu ứng 3D
**Nguyên nhân:** CSS variables chưa được định nghĩa
**Giải pháp:** Đảm bảo file `src/css/style.css` được load trước

## 📝 Cấu Trúc HTML Carousel

```html
<div class="loop-images">
    <div class="carousel-track" style="--time: 60s; --total: 6;">
        <div class="carousel-item" style="--i: 1;">
            <div class="quiz-card">
                <div class="quiz-card-header">
                    <div class="quiz-card-title">Tên Quiz</div>
                    <div class="quiz-card-description">Mô tả</div>
                    <div class="quiz-card-meta">
                        <span><i class="fas fa-question-circle"></i> 20 câu</span>
                    </div>
                </div>
                <div class="quiz-card-actions">
                    <button class="quiz-start-btn">
                        <i class="fas fa-play"></i>
                        Vào ôn thi
                    </button>
                </div>
            </div>
        </div>
        <!-- Các carousel-item khác... -->
    </div>
    <span class="scroll-down">Lướt liên tục <span class="arrow">↓</span></span>
</div>
```

## 🎨 CSS Variables Cần Thiết

Đảm bảo các biến này được định nghĩa trong `src/css/style.css`:

```css
:root {
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --card-bg: rgba(255, 255, 255, 0.95);
    --text-primary: #333;
    --text-secondary: #666;
    --text-tertiary: #999;
    --border-color: #e1e5f2;
    --primary-color: #667eea;
}
```

## ✨ Hiệu Ứng Carousel

1. **Lướt tự động** - Các card lướt từ phải sang trái liên tục
2. **Hiệu ứng 3D** - Card nghiêng 45 độ, khi hover sẽ xoay về 0 độ
3. **Animation mượt mà** - Sử dụng CSS animation với `will-change` để tối ưu
4. **Responsive** - Tự động điều chỉnh kích thước trên mobile

## 🚀 Nếu Vẫn Không Hoạt Động

1. Xóa cache trình duyệt (`Ctrl + Shift + Delete`)
2. Hard reload (`Ctrl + F5`)
3. Kiểm tra Console có lỗi JavaScript không
4. Đảm bảo tất cả file CSS được load đúng thứ tự

## 📞 Liên Hệ

Nếu vẫn gặp vấn đề, hãy:
1. Chụp ảnh màn hình Console (F12)
2. Chụp ảnh màn hình trang web
3. Gửi cho tôi để debug tiếp
