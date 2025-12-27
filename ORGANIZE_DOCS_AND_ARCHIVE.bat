@echo off
echo ========================================
echo    TỔ CHỨC DOCS VÀ ARCHIVE
echo ========================================
echo.

echo [1/5] Di chuyển setup docs...
move "BAT_DAU_O_DAY.md" "docs\setup\" 2>nul
move "START_HERE.txt" "docs\setup\" 2>nul
move "HUONG_DAN_THIET_LAP_PHONG_THI.md" "docs\setup\" 2>nul
move "DANH_SACH_FILES_CAN_THIET.md" "docs\setup\" 2>nul

echo [2/5] Di chuyển deployment docs...
move "HUONG_DAN_DEPLOY_VERCEL.md" "docs\deployment\" 2>nul
move "FIX_VERCEL_DEPLOYMENT.md" "docs\deployment\" 2>nul
move "VERCEL_FINAL_FIX.md" "docs\deployment\" 2>nul
move "HUONG_DAN_PUSH_GITHUB.md" "docs\deployment\" 2>nul
move "PUSH_GITHUB_NGAY.md" "docs\deployment\" 2>nul
move "SU_DUNG_GITHUB_PAGES.md" "docs\deployment\" 2>nul
move "README_PUSH_GITHUB.txt" "docs\deployment\" 2>nul

echo [3/5] Di chuyển feature docs...
move "HUONG_DAN_HOAN_CHINH_CHIA_SE.md" "docs\features\" 2>nul
move "KIEM_TRA_CHIA_SE.md" "docs\features\" 2>nul
move "TINH_NANG_NHAN_DIEN_TU_DONG.md" "docs\features\" 2>nul

echo [4/5] Di chuyển troubleshooting docs...
move "HUONG_DAN_CHI_TIET_FIX_404.md" "docs\troubleshooting\" 2>nul
move "KHAC_PHUC_LOI_404.md" "docs\troubleshooting\" 2>nul
move "CHECKLIST_FIX_404.md" "docs\troubleshooting\" 2>nul
move "HUONG_DAN_SUA_CAU_TRUC_THU_MUC.md" "docs\troubleshooting\" 2>nul
move "HUONG_DAN_CUOI_CUNG.md" "docs\troubleshooting\" 2>nul

echo [5/5] Di chuyển files cũ vào archive...
move "*FIX*.js" "archive\fixes\" 2>nul
move "*PATCH*.js" "archive\fixes\" 2>nul
move "*EMERGENCY*.js" "archive\fixes\" 2>nul
move "*ULTIMATE*.js" "archive\fixes\" 2>nul
move "*SIMPLE*.js" "archive\fixes\" 2>nul
move "*FINAL*.js" "archive\fixes\" 2>nul
move "*DEBUG*.js" "archive\fixes\" 2>nul
move "index-*.html" "archive\old-versions\" 2>nul
move "script-*.js" "archive\old-versions\" 2>nul
move "explore-quiz-delete-functions.js" "archive\deprecated\" 2>nul
move "fix-*.js" "archive\fixes\" 2>nul

echo.
echo ✅ Hoàn thành tổ chức docs và archive!
pause