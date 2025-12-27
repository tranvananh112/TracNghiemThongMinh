-- ============================================================================
-- XÓA CÁC QUIZ TEST
-- Chạy script này trong Supabase SQL Editor để xóa quiz test
-- ============================================================================

-- Xem trước các quiz sẽ bị xóa
SELECT 
    id,
    title,
    user_name,
    shared_at
FROM shared_quizzes
WHERE 
    title ILIKE '%Quiz Test%'
    OR title ILIKE '%test%'
    OR user_name = 'Test User';

-- Uncomment dòng dưới để XÓA
-- DELETE FROM shared_quizzes
-- WHERE 
--     title ILIKE '%Quiz Test%'
--     OR title ILIKE '%test%'
--     OR user_name = 'Test User';

-- Hoặc xóa theo ID cụ thể (an toàn hơn)
-- Thay YOUR_QUIZ_ID_1 và YOUR_QUIZ_ID_2 bằng ID thực tế
-- DELETE FROM shared_quizzes
-- WHERE id IN (
--     'YOUR_QUIZ_ID_1',
--     'YOUR_QUIZ_ID_2'
-- );

-- Kiểm tra kết quả sau khi xóa
-- SELECT COUNT(*) as remaining_quizzes FROM shared_quizzes;
