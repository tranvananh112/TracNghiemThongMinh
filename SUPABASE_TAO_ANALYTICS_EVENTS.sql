-- ============================================================================
-- TẠO BẢNG ANALYTICS_EVENTS - Sửa lỗi 404
-- Chạy file này nếu bạn gặp lỗi: POST .../analytics_events 404 (Not Found)
-- ============================================================================

-- ============================================================================
-- 1. TẠO BẢNG ANALYTICS_EVENTS
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

-- ============================================================================
-- 2. TẠO INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. XÓA POLICIES CŨ (nếu có)
-- ============================================================================

DROP POLICY IF EXISTS "Allow public insert access" ON analytics_events;
DROP POLICY IF EXISTS "Allow public select access" ON analytics_events;

-- ============================================================================
-- 5. TẠO POLICIES MỚI
-- ============================================================================

-- Cho phép INSERT từ mọi người (để tracking)
CREATE POLICY "Allow public insert access" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Cho phép SELECT từ mọi người (để xem thống kê)
CREATE POLICY "Allow public select access" ON analytics_events
    FOR SELECT USING (true);

-- ============================================================================
-- 6. GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON analytics_events TO authenticated;
GRANT ALL ON analytics_events TO anon;
GRANT USAGE, SELECT ON SEQUENCE analytics_events_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE analytics_events_id_seq TO anon;

-- ============================================================================
-- 7. THÊM COMMENTS
-- ============================================================================

COMMENT ON TABLE analytics_events IS 'Bảng lưu trữ sự kiện analytics và tracking người dùng';
COMMENT ON COLUMN analytics_events.session_id IS 'ID phiên làm việc của người dùng';
COMMENT ON COLUMN analytics_events.user_id IS 'ID người dùng (nếu có)';
COMMENT ON COLUMN analytics_events.event_type IS 'Loại sự kiện: page_view, event, click, etc.';
COMMENT ON COLUMN analytics_events.event_name IS 'Tên sự kiện cụ thể';
COMMENT ON COLUMN analytics_events.event_data IS 'Dữ liệu bổ sung của sự kiện (JSON)';
COMMENT ON COLUMN analytics_events.created_at IS 'Thời gian sự kiện xảy ra';

-- ============================================================================
-- 8. TEST INSERT (Tùy chọn - để kiểm tra)
-- ============================================================================

-- Uncomment dòng dưới để test:
-- INSERT INTO analytics_events (session_id, user_id, event_type, event_name, event_data)
-- VALUES ('test_session', 'test_user', 'page_view', 'home', '{"test": true}'::jsonb);

-- ============================================================================
-- 9. TEST SELECT (Tùy chọn - để kiểm tra)
-- ============================================================================

-- Uncomment dòng dưới để test:
-- SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- HOÀN THÀNH! ✅
-- ============================================================================
-- Bảng analytics_events đã được tạo thành công!
-- Lỗi 404 sẽ biến mất sau khi refresh trang web.
-- ============================================================================
