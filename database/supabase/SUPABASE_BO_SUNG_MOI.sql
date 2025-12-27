-- ============================================================================
-- CÁC LỆNH BỔ SUNG MỚI - An toàn để chạy nhiều lần
-- Chỉ chứa những gì BẠN CHƯA CHẠY
-- ============================================================================

-- ============================================================================
-- 1. BỔ SUNG CHO BẢNG SHARED_QUIZZES (nếu thiếu cột)
-- ============================================================================

-- Thêm cột tags nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='shared_quizzes' AND column_name='tags') THEN
        ALTER TABLE shared_quizzes ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- Thêm cột difficulty nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='shared_quizzes' AND column_name='difficulty') THEN
        ALTER TABLE shared_quizzes ADD COLUMN difficulty TEXT DEFAULT 'medium';
    END IF;
END $$;

-- Thêm cột category nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='shared_quizzes' AND column_name='category') THEN
        ALTER TABLE shared_quizzes ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
END $$;

-- Thêm cột original_id nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='shared_quizzes' AND column_name='original_id') THEN
        ALTER TABLE shared_quizzes ADD COLUMN original_id TEXT;
    END IF;
END $$;

-- Thêm cột likes nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='shared_quizzes' AND column_name='likes') THEN
        ALTER TABLE shared_quizzes ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================================================
-- 2. BỔ SUNG CHO BẢNG EXAM_ROOMS (nếu thiếu cột)
-- ============================================================================

-- Thêm cột creator_id nếu chưa có
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='exam_rooms' AND column_name='creator_id') THEN
        ALTER TABLE exam_rooms ADD COLUMN creator_id TEXT;
    END IF;
END $$;

-- ============================================================================
-- 3. TẠO INDEXES BỔ SUNG (nếu chưa có)
-- ============================================================================

-- Indexes cho shared_quizzes
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_category ON shared_quizzes(category);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_difficulty ON shared_quizzes(difficulty);

-- Indexes cho exam_rooms
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_id ON exam_rooms(creator_id);

-- ============================================================================
-- 4. CẬP NHẬT POLICIES (Xóa cũ và tạo mới)
-- ============================================================================

-- Policies cho shared_quizzes
DROP POLICY IF EXISTS "Allow public delete access" ON shared_quizzes;
CREATE POLICY "Allow public delete access" ON shared_quizzes
    FOR DELETE USING (true);

-- Policies cho exam_rooms
DROP POLICY IF EXISTS "Allow public delete" ON exam_rooms;
CREATE POLICY "Allow public delete" ON exam_rooms
    FOR DELETE USING (true);

-- ============================================================================
-- 5. TẠO FUNCTION TỰ ĐỘNG CẬP NHẬT updated_at
-- ============================================================================

-- Function cho exam_rooms
CREATE OR REPLACE FUNCTION update_exam_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cho exam_rooms
DROP TRIGGER IF EXISTS exam_rooms_updated_at ON exam_rooms;
CREATE TRIGGER exam_rooms_updated_at
    BEFORE UPDATE ON exam_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_exam_rooms_updated_at();

-- ============================================================================
-- 6. TẠO VIEW ANALYTICS_SUMMARY (nếu chưa có)
-- ============================================================================

CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
    COUNT(CASE WHEN event_type = 'event' THEN 1 END) as user_events
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- 7. GRANT PERMISSIONS BỔ SUNG
-- ============================================================================

-- Permissions cho analytics_summary view
GRANT SELECT ON analytics_summary TO authenticated;
GRANT SELECT ON analytics_summary TO anon;

-- ============================================================================
-- 8. THÊM COMMENTS (Documentation)
-- ============================================================================

COMMENT ON COLUMN shared_quizzes.tags IS 'Tags để phân loại quiz';
COMMENT ON COLUMN shared_quizzes.difficulty IS 'Độ khó: easy, medium, hard';
COMMENT ON COLUMN shared_quizzes.category IS 'Danh mục quiz';
COMMENT ON COLUMN shared_quizzes.likes IS 'Số lượt thích';
COMMENT ON COLUMN exam_rooms.creator_id IS 'ID người tạo phòng (để phân biệt)';

-- ============================================================================
-- HOÀN THÀNH! ✅
-- ============================================================================
-- Đã bổ sung:
--   ✓ Các cột thiếu cho shared_quizzes (tags, difficulty, category, likes)
--   ✓ Cột creator_id cho exam_rooms
--   ✓ Indexes bổ sung
--   ✓ Policies xóa (delete)
--   ✓ Function và trigger tự động cập nhật
--   ✓ View analytics_summary
--   ✓ Permissions đầy đủ
--   ✓ Comments documentation
-- 
-- Script này AN TOÀN để chạy nhiều lần!
-- ============================================================================
