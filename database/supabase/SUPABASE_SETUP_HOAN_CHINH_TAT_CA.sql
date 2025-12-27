-- ============================================================================
-- THIẾT LẬP HOÀN CHỈNH TẤT CẢ BẢNG CHO SUPABASE
-- Project: https://uyjakelguelunqzdbscb.supabase.co
-- Chạy script này trong Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PHẦN 1: BẢNG SHARED_QUIZZES (Chia sẻ Quiz)
-- ============================================================================

CREATE TABLE IF NOT EXISTS shared_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    total_questions INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    original_id TEXT,
    tags TEXT[],
    difficulty TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes cho shared_quizzes
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_shared_at ON shared_quizzes(shared_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_views ON shared_quizzes(views DESC);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_category ON shared_quizzes(category);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_difficulty ON shared_quizzes(difficulty);

-- Enable RLS cho shared_quizzes
ALTER TABLE shared_quizzes ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ
DROP POLICY IF EXISTS "Allow public read access" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public insert access" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public update stats" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public delete access" ON shared_quizzes;

-- Tạo policies mới cho shared_quizzes
CREATE POLICY "Allow public read access" ON shared_quizzes
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON shared_quizzes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update stats" ON shared_quizzes
    FOR UPDATE USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete access" ON shared_quizzes
    FOR DELETE USING (true);

-- ============================================================================
-- PHẦN 2: BẢNG EXAM_ROOMS (Phòng Thi)
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

-- Indexes cho exam_rooms
CREATE INDEX IF NOT EXISTS idx_exam_rooms_code ON exam_rooms(code);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_created_at ON exam_rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_name ON exam_rooms(creator_name);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_id ON exam_rooms(creator_id);

-- Enable RLS cho exam_rooms
ALTER TABLE exam_rooms ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ
DROP POLICY IF EXISTS "Allow public read access" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public read all rooms" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public insert access" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public update stats" ON exam_rooms;
DROP POLICY IF EXISTS "Allow creator delete" ON exam_rooms;
DROP POLICY IF EXISTS "Allow creator delete own rooms" ON exam_rooms;
DROP POLICY IF EXISTS "Allow public delete" ON exam_rooms;

-- Tạo policies mới cho exam_rooms
CREATE POLICY "Allow public read all rooms" ON exam_rooms
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON exam_rooms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update stats" ON exam_rooms
    FOR UPDATE USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete" ON exam_rooms
    FOR DELETE USING (true);

-- ============================================================================
-- PHẦN 3: BẢNG ANALYTICS_EVENTS (Thống kê)
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,
    event_type TEXT NOT NULL,
    event_name TEXT,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes cho analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- Enable RLS cho analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ
DROP POLICY IF EXISTS "Allow public insert access" ON analytics_events;
DROP POLICY IF EXISTS "Allow public select access" ON analytics_events;

-- Tạo policies mới cho analytics_events
CREATE POLICY "Allow public insert access" ON analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select access" ON analytics_events
    FOR SELECT USING (true);

-- ============================================================================
-- PHẦN 4: FUNCTIONS VÀ TRIGGERS
-- ============================================================================

-- Function tự động cập nhật updated_at cho exam_rooms
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

-- Function dọn dẹp analytics cũ (90 ngày)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
    DELETE FROM analytics_events
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PHẦN 5: VIEWS (Tùy chọn - để xem thống kê)
-- ============================================================================

-- View tổng hợp analytics theo ngày
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
-- PHẦN 6: GRANT PERMISSIONS
-- ============================================================================

-- Permissions cho shared_quizzes
GRANT ALL ON shared_quizzes TO authenticated;
GRANT ALL ON shared_quizzes TO anon;

-- Permissions cho exam_rooms
GRANT ALL ON exam_rooms TO authenticated;
GRANT ALL ON exam_rooms TO anon;

-- Permissions cho analytics_events
GRANT ALL ON analytics_events TO authenticated;
GRANT ALL ON analytics_events TO anon;
GRANT USAGE, SELECT ON SEQUENCE analytics_events_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE analytics_events_id_seq TO anon;

-- Permissions cho views
GRANT SELECT ON analytics_summary TO authenticated;
GRANT SELECT ON analytics_summary TO anon;

-- ============================================================================
-- PHẦN 7: COMMENTS (Documentation)
-- ============================================================================

-- Comments cho shared_quizzes
COMMENT ON TABLE shared_quizzes IS 'Bảng lưu trữ quiz được chia sẻ từ cộng đồng';
COMMENT ON COLUMN shared_quizzes.id IS 'ID duy nhất của quiz';
COMMENT ON COLUMN shared_quizzes.title IS 'Tiêu đề quiz';
COMMENT ON COLUMN shared_quizzes.questions IS 'Dữ liệu câu hỏi (JSON)';
COMMENT ON COLUMN shared_quizzes.views IS 'Số lượt xem';
COMMENT ON COLUMN shared_quizzes.attempts IS 'Số lượt làm bài';
COMMENT ON COLUMN shared_quizzes.likes IS 'Số lượt thích';

-- Comments cho exam_rooms
COMMENT ON TABLE exam_rooms IS 'Bảng lưu trữ phòng thi - Mọi người có thể xem và tham gia';
COMMENT ON COLUMN exam_rooms.id IS 'ID duy nhất của phòng thi';
COMMENT ON COLUMN exam_rooms.name IS 'Tên phòng thi';
COMMENT ON COLUMN exam_rooms.code IS 'Mã phòng 6 số để tham gia';
COMMENT ON COLUMN exam_rooms.quiz_data IS 'Dữ liệu đề thi (JSON)';
COMMENT ON COLUMN exam_rooms.creator_id IS 'ID người tạo phòng';
COMMENT ON COLUMN exam_rooms.participants IS 'Số người tham gia';
COMMENT ON COLUMN exam_rooms.leaderboard IS 'Bảng xếp hạng (JSON)';

-- Comments cho analytics_events
COMMENT ON TABLE analytics_events IS 'Bảng lưu trữ sự kiện analytics';
COMMENT ON COLUMN analytics_events.session_id IS 'ID phiên làm việc';
COMMENT ON COLUMN analytics_events.event_type IS 'Loại sự kiện (page_view, event)';
COMMENT ON COLUMN analytics_events.event_data IS 'Dữ liệu sự kiện (JSON)';

-- ============================================================================
-- HOÀN THÀNH! ✅
-- ============================================================================
-- Đã tạo thành công:
--   ✓ Bảng shared_quizzes (Chia sẻ quiz)
--   ✓ Bảng exam_rooms (Phòng thi)
--   ✓ Bảng analytics_events (Thống kê)
--   ✓ Indexes để tăng tốc
--   ✓ RLS policies bảo mật
--   ✓ Functions và triggers
--   ✓ Views để xem thống kê
--   ✓ Permissions đầy đủ
-- 
-- Bây giờ bạn có thể:
--   ✓ Chia sẻ quiz lên cloud
--   ✓ Tạo và tham gia phòng thi
--   ✓ Theo dõi thống kê người dùng
--   ✓ Xem bảng xếp hạng realtime
-- ============================================================================
