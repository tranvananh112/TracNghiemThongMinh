-- ============================================================================
-- THIẾT LẬP HOÀN CHỈNH PHÒNG THI TRÊN SUPABASE
-- Chạy script này trong Supabase SQL Editor
-- Project: https://uyjakelguelunqzdbscb.supabase.co
-- ============================================================================

-- BƯỚC 1: Tạo bảng exam_rooms (Phòng Thi)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exam_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    quiz_data JSONB NOT NULL,
    creator_name TEXT NOT NULL,
    creator_id TEXT,
    participants INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    leaderboard JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BƯỚC 2: Tạo indexes để tăng tốc độ truy vấn
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_exam_rooms_code ON exam_rooms(code);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_created_at ON exam_rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_name ON exam_rooms(creator_name);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_id ON exam_rooms(creator_id);

-- BƯỚC 3: Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE exam_rooms ENABLE ROW LEVEL SECURITY;

-- BƯỚC 4: Xóa tất cả policy cũ (nếu có)
-- ============================================================================
DROP POLICY IF EXISTS "Allow public read access" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public read all rooms" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public insert access" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public update stats" ON exam_rooms;
DROP POLICY IF EXISTS "Allow creator delete" ON exam_rooms;
DROP POLICY IF EXISTS "Allow creator delete own rooms" ON exam_rooms;

-- BƯỚC 5: Tạo policies mới - Cho phép mọi người xem và tham gia phòng
-- ============================================================================

-- Policy 1: Cho phép mọi người đọc TẤT CẢ phòng thi
-- (Để người khác có thể tìm và tham gia phòng bằng mã)
CREATE POLICY "Allow public read all rooms" ON exam_rooms
    FOR SELECT USING (true);

-- Policy 2: Cho phép mọi người tạo phòng mới
CREATE POLICY "Allow public insert access" ON exam_rooms
    FOR INSERT WITH CHECK (true);

-- Policy 3: Cho phép cập nhật thống kê (participants, attempts, leaderboard)
CREATE POLICY "Allow public update stats" ON exam_rooms
    FOR UPDATE USING (true)
    WITH CHECK (true);

-- Policy 4: Cho phép xóa phòng (tạm thời cho phép tất cả, có thể thắt chặt sau)
CREATE POLICY "Allow public delete" ON exam_rooms
    FOR DELETE USING (true);

-- BƯỚC 6: Tạo function tự động cập nhật updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_exam_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BƯỚC 7: Tạo trigger để tự động cập nhật updated_at
-- ============================================================================
DROP TRIGGER IF EXISTS exam_rooms_updated_at ON exam_rooms;

CREATE TRIGGER exam_rooms_updated_at
    BEFORE UPDATE ON exam_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_exam_rooms_updated_at();

-- BƯỚC 8: Thêm comments cho documentation
-- ============================================================================
COMMENT ON TABLE exam_rooms IS 'Bảng lưu trữ thông tin phòng thi - Mọi người có thể xem và tham gia';
COMMENT ON COLUMN exam_rooms.id IS 'ID duy nhất của phòng thi';
COMMENT ON COLUMN exam_rooms.name IS 'Tên phòng thi';
COMMENT ON COLUMN exam_rooms.code IS 'Mã phòng 6 số để tham gia';
COMMENT ON COLUMN exam_rooms.description IS 'Mô tả phòng thi';
COMMENT ON COLUMN exam_rooms.quiz_data IS 'Dữ liệu đề thi (JSON)';
COMMENT ON COLUMN exam_rooms.creator_name IS 'Tên người tạo phòng';
COMMENT ON COLUMN exam_rooms.creator_id IS 'ID duy nhất của người tạo phòng';
COMMENT ON COLUMN exam_rooms.participants IS 'Số người tham gia';
COMMENT ON COLUMN exam_rooms.attempts IS 'Số lượt làm bài';
COMMENT ON COLUMN exam_rooms.leaderboard IS 'Bảng xếp hạng (JSON array)';
COMMENT ON COLUMN exam_rooms.created_at IS 'Thời gian tạo phòng';
COMMENT ON COLUMN exam_rooms.updated_at IS 'Thời gian cập nhật cuối';

-- ============================================================================
-- HOÀN THÀNH! ✅
-- ============================================================================
-- Bảng exam_rooms đã được tạo thành công
-- Mọi người có thể:
--   ✓ Xem tất cả phòng thi
--   ✓ Tạo phòng mới
--   ✓ Tham gia phòng bằng mã
--   ✓ Cập nhật điểm và bảng xếp hạng
--   ✓ Xóa phòng (nếu cần)
-- ============================================================================
