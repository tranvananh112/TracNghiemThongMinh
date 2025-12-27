@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo   PUSH CODE LEN GITHUB
echo ========================================
echo.

echo [BUOC 1] Di chuyen files len root...
echo.

REM Di chuyển files
xcopy /E /I /Y /Q "TracNghiemProMax-main\*" "." >nul 2>&1
if exist "TracNghiemProMax-main\.gitignore" copy /Y "TracNghiemProMax-main\.gitignore" ".gitignore" >nul 2>&1

echo   - Da copy files
echo.

REM Xóa thư mục cũ
rmdir /S /Q "TracNghiemProMax-main" >nul 2>&1
rmdir /S /Q ".vscode" >nul 2>&1

echo   - Da xoa thu muc cu
echo.

REM Kiểm tra
if exist "index.html" (
    echo   OK: index.html da o root!
    echo.
) else (
    echo   LOI: Khong tim thay index.html!
    echo.
    pause
    exit /b 1
)

echo [BUOC 2] Push len GitHub...
echo.

REM Git commands
git add . >nul 2>&1
echo   - Da add files

git commit -m "Fix: Move files to root directory for deployment" >nul 2>&1
echo   - Da commit

echo.
echo Dang push len GitHub...
git push origin main --force

if errorlevel 1 (
    echo.
    echo Thu lai voi branch master...
    git push origin master --force
)

echo.
echo ========================================
echo   HOAN THANH!
echo ========================================
echo.
echo Kiem tra tai: https://github.com/tranvananh112/TracNghiemThongMinh
echo.
echo Doi 1-2 phut de Vercel deploy lai
echo.
pause
