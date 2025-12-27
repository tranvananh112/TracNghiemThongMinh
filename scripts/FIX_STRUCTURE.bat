@echo off
chcp 65001 >nul
echo ========================================
echo   SỬA CẤU TRÚC THƯ MỤC - FIX 404 ERROR
echo ========================================
echo.

echo [1/5] Đang di chuyển files lên root...
xcopy /E /I /Y "TracNghiemProMax-main\*" "." 2>nul
if errorlevel 1 (
    echo ❌ Lỗi khi copy files!
    pause
    exit /b 1
)
echo ✅ Copy files thành công!
echo.

echo [2/5] Đang copy .gitignore...
if exist "TracNghiemProMax-main\.gitignore" (
    copy /Y "TracNghiemProMax-main\.gitignore" ".gitignore" >nul
    echo ✅ Copy .gitignore thành công!
) else (
    echo ⚠️  Không tìm thấy .gitignore
)
echo.

echo [3/5] Đang xóa thư mục TracNghiemProMax-main...
rmdir /S /Q "TracNghiemProMax-main" 2>nul
if exist "TracNghiemProMax-main" (
    echo ⚠️  Không thể xóa thư mục (có thể đang mở)
) else (
    echo ✅ Xóa thư mục thành công!
)
echo.

echo [4/5] Đang xóa thư mục .vscode...
if exist ".vscode" (
    rmdir /S /Q ".vscode" 2>nul
    echo ✅ Xóa .vscode thành công!
) else (
    echo ⚠️  Không tìm thấy .vscode
)
echo.

echo [5/5] Kiểm tra cấu trúc...
if exist "index.html" (
    echo ✅ index.html đã ở root!
) else (
    echo ❌ Không tìm thấy index.html ở root!
)
echo.

echo ========================================
echo   HOÀN THÀNH! 
echo ========================================
echo.
echo Bây giờ hãy chạy các lệnh sau để push lên GitHub:
echo.
echo   git add .
echo   git commit -m "Fix: Move files to root directory"
echo   git push origin main --force
echo.
echo ========================================
pause
