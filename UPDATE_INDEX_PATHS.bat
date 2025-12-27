@echo off
echo ========================================
echo    CẬP NHẬT ĐƯỜNG DẪN TRONG INDEX.HTML
echo ========================================
echo.

echo Tạo backup index.html...
copy "index.html" "archive\old-versions\index-backup.html" 2>nul

echo Cập nhật đường dẫn CSS và JS...
echo Bạn cần cập nhật thủ công các đường dẫn sau trong index.html:
echo.
echo CSS FILES:
echo - style.css → src/css/style.css
echo - style-newyear-2026.css → src/css/style-newyear-2026.css
echo - style-ai-quiz.css → src/css/components/style-ai-quiz.css
echo - style-analytics.css → src/css/components/style-analytics.css
echo - style-explore.css → src/css/components/style-explore.css
echo - style-room.css → src/css/components/style-room.css
echo - style-streak.css → src/css/components/style-streak.css
echo - cat-welcome.css → src/css/components/cat-welcome.css
echo - style-mobile-enhanced.css → src/css/responsive/style-mobile-enhanced.css
echo - style-mobile-optimized.css → src/css/responsive/style-mobile-optimized.css
echo - style-responsive-enhanced.css → src/css/responsive/style-responsive-enhanced.css
echo.
echo JS FILES:
echo - script.js → src/js/core/script.js
echo - smart-question-parser.js → src/js/core/smart-question-parser.js
echo - smooth-quiz-effects.js → src/js/core/smooth-quiz-effects.js
echo - ABSOLUTE_QUIZ_PROTECTION.js → src/js/core/ABSOLUTE_QUIZ_PROTECTION.js
echo - newyear-effects.js → src/js/features/newyear-effects.js
echo - cat-welcome.js → src/js/features/cat-welcome.js
echo.
echo IMAGES:
echo - hưu nhảy.gif → assets/images/hưu nhảy.gif
echo - ông già noel.gif → assets/images/ông già noel.gif
echo - Merry Christmas GIF.gif → assets/images/Merry Christmas GIF.gif
echo.
pause