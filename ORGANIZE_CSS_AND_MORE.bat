@echo off
echo ========================================
echo    TỔ CHỨC CSS VÀ CÁC FILES KHÁC
echo ========================================
echo.

echo [1/6] Di chuyển CSS chính...
move "style.css" "src\css\" 2>nul
move "style-newyear-2026.css" "src\css\" 2>nul

echo [2/6] Di chuyển CSS components...
move "style-ai-quiz.css" "src\css\components\" 2>nul
move "style-analytics.css" "src\css\components\" 2>nul
move "style-explore.css" "src\css\components\" 2>nul
move "style-room.css" "src\css\components\" 2>nul
move "style-streak.css" "src\css\components\" 2>nul
move "cat-welcome.css" "src\css\components\" 2>nul
move "style-modern-*.css" "src\css\components\" 2>nul
move "style-updated.css" "src\css\components\" 2>nul

echo [3/6] Di chuyển CSS responsive...
move "style-mobile-*.css" "src\css\responsive\" 2>nul
move "style-responsive-*.css" "src\css\responsive\" 2>nul

echo [4/6] Di chuyển database files...
move "SUPABASE_*.sql" "database\supabase\" 2>nul
move "XOA_QUIZ_TEST.sql" "database\supabase\" 2>nul
move "TEST_SUPABASE_QUICK.sql" "database\supabase\" 2>nul
move "SETUP_HOAN_CHINH_CHIA_SE_QUIZ.sql" "database\supabase\" 2>nul
move "community-quizzes.json" "database\json\" 2>nul
move "shared-quizzes.json" "database\json\" 2>nul

echo [5/6] Di chuyển test files...
move "test-*.html" "tests\" 2>nul
move "TEST_*.html" "tests\" 2>nul
move "KIEM_TRA_*.html" "tests\" 2>nul
move "convert-logo-to-base64.html" "tests\" 2>nul

echo [6/6] Di chuyển scripts...
move "start-*.bat" "scripts\" 2>nul
move "PUSH_*.bat" "scripts\" 2>nul
move "RESET_*.bat" "scripts\" 2>nul
move "EXECUTE_*.bat" "scripts\" 2>nul
move "FIX_*.bat" "scripts\" 2>nul
move "AP_DUNG_*.bat" "scripts\" 2>nul
move "ROLLBACK_*.bat" "scripts\" 2>nul
move "move-*.bat" "scripts\" 2>nul
move "*.sh" "scripts\" 2>nul
move "*.ps1" "scripts\" 2>nul

echo.
echo ✅ Hoàn thành tổ chức CSS và scripts!
echo Tiếp tục với documentation...
pause