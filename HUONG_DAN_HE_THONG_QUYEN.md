# 🔐 Hướng Dẫn Hệ Thống Quyền Quiz

## Tổng Quan
Hệ thống quyền đã được triển khai để quản lý ai có thể chỉnh sửa/xóa các bài quiz được chia sẻ.

## Cách Hoạt Động

### 1. Quyền Cơ Bản
- **Xem/Làm bài**: Tất cả mọi người đều có quyền xem và làm bài quiz
- **Chỉnh sửa**: Chỉ người tạo quiz mới có quyền chỉnh sửa
- **Xóa**: Chỉ người tạo quiz mới có quyền xóa
- **Admin**: Admin có tất cả quyền với mọi quiz

### 2. Nhận Diện Người Dùng
Hệ thống nhận diện người dùng qua:
- Tên được nhập khi chia sẻ quiz
- Tên được lưu trong localStorage
- So sánh không phân biệt hoa/thường

### 3. Hiển Thị Nút Quyền
Trong phần "Khám Phá Đề Thi", mỗi quiz sẽ hiển thị:
- **Nút "Chi tiết"**: Luôn hiển thị cho mọi người
- **Nút "Sửa" (màu vàng)**: Chỉ hiển thị nếu bạn là chủ sở hữu hoặc admin
- **Nút "Xóa" (màu đỏ)**: Chỉ hiển thị nếu bạn là chủ sở hữu hoặc admin

## Cách Sử Dụng

### Bước 1: Đặt Tên Người Dùng
1. Vào tab "Khám Phá Đề Thi"
2. Nhập tên của bạn vào ô "Tên người dùng"
3. Tên này sẽ được lưu và sử dụng để nhận diện quyền

### Bước 2: Chia Sẻ Quiz
1. Khi chia sẻ quiz, đảm bảo nhập đúng tên của bạn
2. Tên này sẽ được gắn với quiz làm "chủ sở hữu"

### Bước 3: Quản Lý Quiz Của Bạn
1. Các quiz bạn tạo sẽ hiển thị nút "Sửa" và "Xóa"
2. Click vào nút tương ứng để chỉnh sửa hoặc xóa

### Bước 4: Kiểm Tra Quyền
1. Click nút "Kiểm tra quyền" để xem thông tin chi tiết
2. Xem có bao nhiêu quiz bạn có thể chỉnh sửa

## Khắc Phục Sự Cố

### Không Thấy Nút Sửa/Xóa?
1. **Kiểm tra tên người dùng**: Đảm bảo tên bạn nhập giống với tên khi chia sẻ quiz
2. **Kiểm tra chính tả**: Tên phải khớp chính xác (không phân biệt hoa/thường)
3. **Làm mới trang**: Thử reload trang và nhập lại tên
4. **Kiểm tra console**: Mở Developer Tools (F12) để xem log debug

### Debug Thông Tin
1. Mở Developer Tools (F12)
2. Vào tab Console
3. Tìm các log bắt đầu bằng "🔐 Checking permission"
4. Kiểm tra thông tin currentUser và quizOwner

### Test Hệ Thống
1. Mở file `TEST_PERMISSION_SYSTEM.html`
2. Chạy các test để đảm bảo hệ thống hoạt động đúng
3. Thử các trường hợp khác nhau

## Lưu Ý Quan Trọng

### Bảo Mật
- Hệ thống này chỉ là bảo vệ giao diện, không phải bảo mật thực sự
- Dành cho môi trường tin cậy (gia đình, lớp học, văn phòng)

### Tên Người Dùng
- Sử dụng tên duy nhất để tránh xung đột
- Tránh sử dụng ký tự đặc biệt
- Nên sử dụng tên thật hoặc nickname cố định

### Admin Mode
- Admin có thể chỉnh sửa/xóa mọi quiz
- Để bật admin mode, cần mật khẩu admin
- Admin mode được quản lý bởi AdminManager

## Ví Dụ Thực Tế

### Trường Hợp 1: Giáo Viên Chia Sẻ Bài Thi
```
1. Cô Mai tạo quiz "Toán lớp 8"
2. Cô Mai nhập tên "Co Mai" khi chia sẻ
3. Học sinh có thể xem và làm bài
4. Chỉ Cô Mai (hoặc admin) mới thấy nút Sửa/Xóa
```

### Trường Hợp 2: Học Sinh Tạo Quiz
```
1. Học sinh An tạo quiz "Ôn tập Văn"
2. An nhập tên "Nguyen Van An" khi chia sẻ
3. Các bạn khác có thể làm bài
4. Chỉ An mới có thể sửa/xóa quiz của mình
```

## Liên Hệ Hỗ Trợ
Nếu gặp vấn đề, hãy:
1. Kiểm tra console log (F12)
2. Chạy test file để xác định lỗi
3. Đảm bảo tên người dùng được nhập đúng
4. Thử làm mới trang và nhập lại thông tin