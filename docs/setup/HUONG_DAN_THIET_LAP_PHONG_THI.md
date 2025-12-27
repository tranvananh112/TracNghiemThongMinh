# 🏠 HƯỚNG DẪN THIẾT LẬP PHÒNG THI VỚI SUPABASE

## 📋 Tổng quan

Hệ thống phòng thi cho phép:
- ✅ Người dùng tạo phòng thi và chia sẻ mã phòng
- ✅ Mọi người có thể xem danh sách phòng thi
- ✅ Tham gia phòng bằng mã 6 số
- ✅ Theo dõi bảng xếp hạng realtime
- ✅ Thống kê số người tham gia, lượt làm bài

---

## 🚀 BƯỚC 1: Chạy SQL trong Supabase

### 1.1. Truy cập Supabase SQL Editor

1. Mở: https://supabase.com/dashboard/project/uyjakelguelunqzdbscb
2. Click vào **SQL Editor** (biểu tượng database bên trái)
3. Click **New Query**

### 1.2. Copy và chạy SQL

Mở file: `SUPABASE_SETUP_PHONG_THI_HOAN_CHINH.sql`

Copy toàn bộ nội dung và paste vào SQL Editor, sau đó click **Run** (hoặc Ctrl+Enter)

### 1.3. Kiểm tra kết quả

Sau khi chạy xong, bạn sẽ thấy:
- ✅ Table `exam_rooms` đã được tạo
- ✅ Indexes đã được tạo
- ✅ RLS policies đã được thiết lập
- ✅ Trigger tự động cập nhật `updated_at`

---

## 🔧 BƯỚC 2: Tích hợp vào HTML

### 2.1. Thêm script vào file HTML chính

Mở file `index.html` (hoặc file HTML chính của bạn) và thêm dòng này **SAU** dòng import `supabase-config.js`:

```html
<!-- Supabase Configuration -->
<script type="module" src="supabase-config.js"></script>

<!-- Supabase Room Manager - THÊM DÒNG NÀY -->
<script type="module" src="room-manager-supabase.js"></script>

<!-- Room Manager (Local) -->
<script src="room-manager.js"></script>
```

### 2.2. Cập nhật room-manager.js để sử dụng Supabase

Trong file `room-manager.js`, tìm hàm `createRoom()` và thêm code kết nối Supabase:

```javascript
async createRoom() {
    // ... code hiện tại ...
    
    // THÊM: Lưu lên Supabase
    if (window.supabaseRoomManager && window.supabaseRoomManager.isAvailable) {
        try {
            const result = await window.supabaseRoomManager.createRoom({
                name: roomName,
                code: roomCode,
                description: roomDescription,
                quizData: selectedQuiz,
                creatorName: this.currentUserName
            });
            
            console.log('✅ Room saved to Supabase:', result.room.id);
        } catch (error) {
            console.error('❌ Error saving to Supabase:', error);
        }
    }
    
    // ... code hiện tại ...
}
```

### 2.3. Cập nhật hàm loadRooms() để lấy từ Supabase

```javascript
async loadRooms() {
    // Lấy phòng từ Supabase
    if (window.supabaseRoomManager && window.supabaseRoomManager.isAvailable) {
        try {
            const result = await window.supabaseRoomManager.getMyRooms();
            this.myRooms = result.rooms;
            console.log('✅ Loaded rooms from Supabase:', this.myRooms.length);
        } catch (error) {
            console.error('❌ Error loading from Supabase:', error);
        }
    }
    
    // Hiển thị danh sách phòng
    this.displayMyRooms();
}
```

### 2.4. Cập nhật hàm joinRoom() để tìm phòng từ Supabase

```javascript
async joinRoom() {
    const code = document.getElementById('join-room-code-input').value.trim();
    
    if (!code) {
        this.showToast('⚠️ Vui lòng nhập mã phòng', 'warning');
        return;
    }
    
    // Tìm phòng từ Supabase
    if (window.supabaseRoomManager && window.supabaseRoomManager.isAvailable) {
        try {
            const result = await window.supabaseRoomManager.getRoomByCode(code);
            const room = result.room;
            
            console.log('✅ Found room:', room.name);
            
            // Tăng số người tham gia
            await window.supabaseRoomManager.incrementParticipants(room.id);
            
            // Bắt đầu làm bài
            this.startRoomQuiz(room);
            
        } catch (error) {
            this.showToast('❌ ' + error.message, 'error');
        }
    }
}
```

---

## 🧪 BƯỚC 3: Test hệ thống

### 3.1. Mở Console (F12)

Kiểm tra các thông báo:
```
✅ Supabase initialized successfully
🏠 Supabase Room Manager initialized
✅ Supabase Room Manager connected
✅ Realtime subscribed for rooms
```

### 3.2. Test tạo phòng

1. Tạo một phòng thi mới
2. Kiểm tra Console xem có thông báo: `✅ Room saved to Supabase`
3. Vào Supabase Dashboard > Table Editor > exam_rooms
4. Xem phòng vừa tạo có xuất hiện không

### 3.3. Test tham gia phòng

1. Mở trình duyệt khác (hoặc tab ẩn danh)
2. Truy cập: http://localhost:3000
3. Nhập mã phòng 6 số
4. Click "Tham gia"
5. Kiểm tra xem có vào được phòng không

### 3.4. Test bảng xếp hạng

1. Hoàn thành bài thi
2. Kiểm tra bảng xếp hạng có cập nhật không
3. Vào Supabase > exam_rooms > xem cột `leaderboard`

---

## 📊 BƯỚC 4: Xem dữ liệu trong Supabase

### 4.1. Truy cập Table Editor

1. Vào: https://supabase.com/dashboard/project/uyjakelguelunqzdbscb
2. Click **Table Editor** (biểu tượng bảng bên trái)
3. Chọn table `exam_rooms`

### 4.2. Các cột quan trọng

| Cột | Mô tả |
|-----|-------|
| `id` | ID duy nhất của phòng |
| `name` | Tên phòng thi |
| `code` | Mã phòng 6 số |
| `creator_name` | Tên người tạo |
| `creator_id` | ID người tạo (để phân biệt) |
| `participants` | Số người tham gia |
| `attempts` | Số lượt làm bài |
| `leaderboard` | Bảng xếp hạng (JSON) |
| `quiz_data` | Dữ liệu đề thi (JSON) |

---

## 🔍 BƯỚC 5: Kiểm tra Policies (Bảo mật)

### 5.1. Xem RLS Policies

1. Vào Supabase Dashboard
2. Click **Authentication** > **Policies**
3. Chọn table `exam_rooms`

### 5.2. Các policies đã thiết lập

✅ **Allow public read all rooms** - Mọi người có thể xem tất cả phòng
✅ **Allow public insert access** - Mọi người có thể tạo phòng
✅ **Allow public update stats** - Mọi người có thể cập nhật thống kê
✅ **Allow public delete** - Cho phép xóa phòng

---

## 🎯 BƯỚC 6: Tính năng nâng cao (Tùy chọn)

### 6.1. Hiển thị danh sách tất cả phòng

Thêm nút "Khám phá phòng thi" để xem tất cả phòng:

```javascript
async showAllRooms() {
    const result = await window.supabaseRoomManager.getAllRooms(50);
    const rooms = result.rooms;
    
    // Hiển thị danh sách
    rooms.forEach(room => {
        console.log(`${room.name} - Mã: ${room.code} - Người tạo: ${room.creatorName}`);
    });
}
```

### 6.2. Tìm kiếm phòng

```javascript
async searchRooms(keyword) {
    const result = await window.supabaseRoomManager.searchRooms(keyword);
    const rooms = result.rooms;
    
    console.log(`Tìm thấy ${rooms.length} phòng`);
}
```

### 6.3. Realtime updates

Lắng nghe khi có phòng mới:

```javascript
window.supabaseRoomManager.onRoomUpdate((data) => {
    if (data.type === 'INSERT') {
        console.log('🆕 Phòng mới:', data.room.name);
        // Cập nhật UI
    }
});
```

---

## ❓ Troubleshooting

### Lỗi: "Supabase không khả dụng"

**Giải pháp:**
1. Kiểm tra file `supabase-config.js` có đúng URL và Key không
2. Mở Console (F12) xem có lỗi gì
3. Kiểm tra kết nối internet

### Lỗi: "Không tìm thấy phòng"

**Giải pháp:**
1. Kiểm tra mã phòng có đúng không (6 số)
2. Vào Supabase > Table Editor > exam_rooms xem phòng có tồn tại không
3. Kiểm tra RLS policies có đúng không

### Lỗi: "Permission denied"

**Giải pháp:**
1. Vào Supabase > Authentication > Policies
2. Kiểm tra table `exam_rooms` có enable RLS không
3. Chạy lại SQL script để tạo policies

---

## ✅ Checklist hoàn thành

- [ ] Đã chạy SQL trong Supabase
- [ ] Đã thêm `room-manager-supabase.js` vào HTML
- [ ] Đã cập nhật `room-manager.js` để kết nối Supabase
- [ ] Đã test tạo phòng thành công
- [ ] Đã test tham gia phòng thành công
- [ ] Đã test bảng xếp hạng cập nhật
- [ ] Đã kiểm tra dữ liệu trong Supabase

---

## 🎉 Hoàn thành!

Bây giờ hệ thống phòng thi của bạn đã:
- ✅ Lưu trữ trên cloud (Supabase)
- ✅ Mọi người có thể xem và tham gia
- ✅ Realtime updates
- ✅ Bảng xếp hạng tự động
- ✅ Thống kê chi tiết

**Chúc bạn thành công!** 🚀
