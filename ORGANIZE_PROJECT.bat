@echo off
echo ========================================
echo    TỔ CHỨC LẠI CẤU TRÚC PROJECT
echo ========================================
echo.

echo [1/8] Di chuyển hình ảnh...
move "logo.png" "assets\images\" 2>nul
move "hưu nhảy.gif" "assets\images\" 2>nul
move "ông già noel.gif" "assets\images\" 2>nul
move "Merry Christmas GIF.gif" "assets\images\" 2>nul
move "Cat Hello GIF by Mikitti.gif" "assets\images\" 2>nul

echo [2/8] Di chuyển âm thanh...
move "chinhxac.wav" "assets\audio\" 2>nul
move "saidapan.wav" "assets\audio\" 2>nul
move "âm thanh chúc mừng.wav" "assets\audio\" 2>nul

echo [3/8] Di chuyển trang trí...
xcopy "trang trí noel\*" "assets\decorations\" /E /I /Y 2>nul

echo [4/8] Di chuyển JavaScript core...
move "script.js" "src\js\core\" 2>nul
move "smart-question-parser.js" "src\js\core\" 2>nul
move "smooth-quiz-effects.js" "src\js\core\" 2>nul
move "ABSOLUTE_QUIZ_PROTECTION.js" "src\js\core\" 2>nul

echo [5/8] Di chuyển JavaScript features...
move "ai-quiz.js" "src\js\features\" 2>nul
move "ai-file-handler.js" "src\js\features\" 2>nul
move "explore-quiz.js" "src\js\features\" 2>nul
move "community-share.js" "src\js\features\" 2>nul
move "sound-manager.js" "src\js\features\" 2>nul
move "streak-tracker.js" "src\js\features\" 2>nul
move "mobile-menu.js" "src\js\features\" 2>nul
move "newyear-effects.js" "src\js\features\" 2>nul
move "cat-welcome.js" "src\js\features\" 2>nul

echo [6/8] Di chuyển JavaScript room...
move "room-manager*.js" "src\js\room\" 2>nul
move "room-quiz-validation-upgrade.js" "src\js\room\" 2>nul

echo [7/8] Di chuyển JavaScript admin...
move "admin-*.js" "src\js\admin\" 2>nul
move "analytics-*.js" "src\js\admin\" 2>nul

echo [8/8] Di chuyển JavaScript config...
move "firebase-config.js" "src\js\config\" 2>nul
move "supabase-config.js" "src\js\config\" 2>nul
move "cloud-storage.js" "src\js\config\" 2>nul

echo.
echo ✅ Hoàn thành tổ chức cấu trúc cơ bản!
echo Tiếp tục với CSS và các files khác...
pause