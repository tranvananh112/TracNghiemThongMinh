-- ============================================================================
-- THIẾT LẬP HOÀN CHỈNH HỆ THỐNG CHIA SẺ QUIZ
-- Project: https://uyjakelguelunqzdbscb.supabase.co
-- Mục đích: Cho phép người dùng chia sẻ quiz và mọi người đều thấy được
-- ============================================================================

-- ============================================================================
-- BƯỚC 1: TẠO BẢNG SHARED_QUIZZES (Chia sẻ Quiz)
-- ============================================================================

-- Xóa bảng cũ nếu muốn bắt đầu lại (CẢNH BÁO: Sẽ mất dữ liệu)
-- DROP TABLE IF EXISTS shared_quizzes CASCADE;

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

-- ============================================================================
-- BƯỚC 2: TẠO INDEXES (Tăng tốc độ truy vấn)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_shared_quizzes_shared_at ON shared_quizzes(shared_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_views ON shared_quizzes(views DESC);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_category ON shared_quizzes(category);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_difficulty ON shared_quizzes(difficulty);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_user_name ON shared_quizzes(user_name);

-- ============================================================================
-- BƯỚC 3: ENABLE ROW LEVEL SECURITY (Bảo mật)
-- ============================================================================

ALTER TABLE shared_quizzes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BƯỚC 4: XÓA TẤT CẢ POLICIES CŨ
-- ============================================================================

DROP POLICY IF EXISTS "Allow public read access" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public insert access" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public update stats" ON shared_quizzes;
DROP POLICY IF EXISTS "Allow public delete access" ON shared_quizzes;
DROP POLICY IF EXISTS "Enable read access for all users" ON shared_quizzes;
DROP POLICY IF EXISTS "Enable insert for all users" ON shared_quizzes;
DROP POLICY IF EXISTS "Enable update for all users" ON shared_quizzes;
DROP POLICY IF EXISTS "Enable delete for all users" ON shared_quizzes;

-- ============================================================================
-- BƯỚC 5: TẠO POLICIES MỚI - CHO PHÉP MỌI NGƯỜI TRUY CẬP
-- ============================================================================

-- Policy 1: Cho phép MỌI NGƯỜI đọc TẤT CẢ quiz
CREATE POLICY "Enable read access for all users"
ON shared_quizzes
FOR SELECT
TO public
USING (true);

-- Policy 2: Cho phép MỌI NGƯỜI tạo quiz mới
CREATE POLICY "Enable insert for all users"
ON shared_quizzes
FOR INSERT
TO public
WITH CHECK (true);

-- Policy 3: Cho phép MỌI NGƯỜI cập nhật (views, attempts, likes)
CREATE POLICY "Enable update for all users"
ON shared_quizzes
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy 4: Cho phép MỌI NGƯỜI xóa quiz
CREATE POLICY "Enable delete for all users"
ON shared_quizzes
FOR DELETE
TO public
USING (true);

-- ============================================================================
-- BƯỚC 6: GRANT PERMISSIONS (Cấp quyền)
-- ============================================================================

GRANT ALL ON shared_quizzes TO authenticated;
GRANT ALL ON shared_quizzes TO anon;
GRANT ALL ON shared_quizzes TO public;

-- ============================================================================
-- BƯỚC 7: TẠO FUNCTION TỰ ĐỘNG CẬP NHẬT updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_shared_quizzes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- BƯỚC 8: TẠO TRIGGER
-- ============================================================================

DROP TRIGGER IF EXISTS shared_quizzes_updated_at ON shared_quizzes;

CREATE TRIGGER shared_quizzes_updated_at
    BEFORE UPDATE ON shared_quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_shared_quizzes_updated_at();

-- ============================================================================
-- BƯỚC 9: THÊM COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE shared_quizzes IS 'Bảng lưu trữ quiz được chia sẻ - Mọi người có thể xem và làm bài';
COMMENT ON COLUMN shared_quizzes.id IS 'ID duy nhất của quiz';
COMMENT ON COLUMN shared_quizzes.title IS 'Tiêu đề quiz';
COMMENT ON COLUMN shared_quizzes.description IS 'Mô tả quiz';
COMMENT ON COLUMN shared_quizzes.questions IS 'Dữ liệu câu hỏi (JSON)';
COMMENT ON COLUMN shared_quizzes.total_questions IS 'Tổng số câu hỏi';
COMMENT ON COLUMN shared_quizzes.user_name IS 'Tên người chia sẻ';
COMMENT ON COLUMN shared_quizzes.views IS 'Số lượt xem';
COMMENT ON COLUMN shared_quizzes.attempts IS 'Số lượt làm bài';
COMMENT ON COLUMN shared_quizzes.likes IS 'Số lượt thích';
COMMENT ON COLUMN shared_quizzes.tags IS 'Tags phân loại';
COMMENT ON COLUMN shared_quizzes.difficulty IS 'Độ khó: easy, medium, hard';
COMMENT ON COLUMN shared_quizzes.category IS 'Danh mục quiz';

-- ============================================================================
-- BƯỚC 10: TẠO DỮ LIỆU MẪU (Tùy chọn - để test)
-- ============================================================================

-- Uncomment để tạo quiz mẫu
/*
INSERT INTO shared_quizzes (title, description, questions, total_questions, user_name, tags, difficulty, category)
VALUES 
(
    'Quiz Mẫu - Toán Học Cơ Bản',
    'Bài kiểm tra kiến thức toán học cơ bản',
    '[
        {
            "question": "2 + 2 = ?",
            "answers": ["3", "4", "5", "6"],
            "correctAnswer": 1
        },
        {
            "question": "5 x 5 = ?",
            "answers": ["20", "25", "30", "35"],
            "correctAnswer": 1
        },
        {
            "question": "10 - 3 = ?",
            "answers": ["5", "6", "7", "8"],
            "correctAnswer": 2
        }
    ]'::jsonb,
    3,
    'Admin',
    ARRAY['toán học', 'cơ bản'],
    'easy',
    'math'
),
(
    'Quiz Mẫu - Địa Lý Việt Nam',
    'Kiểm tra kiến thức về địa lý Việt Nam',
    '[
        {
            "question": "Thủ đô của Việt Nam là gì?",
            "answers": ["Hà Nội", "TP.HCM", "Đà Nẵng", "Huế"],
            "correctAnswer": 0
        },
        {
            "question": "Sông dài nhất Việt Nam?",
            "answers": ["Sông Hồng", "Sông Mekong", "Sông Đồng Nai", "Sông Cửu Long"],
            "correctAnswer": 1
        }
    ]'::jsonb,
    2,
    'Admin',
    ARRAY['địa lý', 'việt nam'],
    'medium',
    'geography'
);
*/

-- ============================================================================
-- BƯỚC 11: KIỂM TRA KẾT QUẢ
-- ============================================================================

-- Kiểm tra bảng đã tạo chưa
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name = 'shared_quizzes';

-- Kiểm tra policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'shared_quizzes';

-- Đếm số quiz hiện có
SELECT COUNT(*) as total_quizzes FROM shared_quizzes;

-- Xem 5 quiz mới nhất
SELECT 
    id,
    title,
    user_name,
    total_questions,
    views,
    attempts,
    shared_at
FROM shared_quizzes
ORDER BY shared_at DESC
LIMIT 5;

-- ============================================================================
-- HOÀN THÀNH! ✅
-- ============================================================================
-- 
-- Bảng shared_quizzes đã được tạo với:
--   ✓ Cấu trúc đầy đủ
--   ✓ Indexes để tăng tốc
--   ✓ RLS policies cho phép mọi người truy cập
--   ✓ Trigger tự động cập nhật
--   ✓ Permissions đầy đủ
-- 
-- Bây giờ bạn có thể:
--   ✓ Chia sẻ quiz từ web
--   ✓ Mọi người đều thấy được quiz đã chia sẻ
--   ✓ Xem, làm bài, thích quiz
--   ✓ Tìm kiếm và lọc quiz
-- 
-- Bước tiếp theo:
--   1. Refresh trang web (Ctrl+F5)
--   2. Chia sẻ một quiz
--   3. Mở tab ẩn danh và kiểm tra
-- 
-- ============================================================================
