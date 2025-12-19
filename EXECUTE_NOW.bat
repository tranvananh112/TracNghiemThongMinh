@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     PUSH CODE LEN GITHUB - TU DONG                         ║
echo ║                                                            ║
echo ╔════════════════════════════════════════════════════════════╗
echo.
echo Repository: https://github.com/tranvananh112/TracNghiemThongMinh.git
echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC 1: DI CHUYEN FILES LEN ROOT
echo ════════════════════════════════════════════════════════════
echo.

REM Kiểm tra thư mục tồn tại
if not exist "TracNghiemProMax-main" (
    echo [ERROR] Khong tim thay thu muc TracNghiemProMax-main
    echo.
    echo Co the files da duoc di chuyen roi.
    echo Kiem tra xem index.html co o root chua?
    echo.
    if exist "index.html" (
        echo [OK] index.html da o root!
        goto :PUSH_TO_GIT
    ) else (
        echo [ERROR] Khong tim thay index.html!
        pause
        exit /b 1
    )
)

echo [1/5] Dang copy files...
xcopy /E /I /Y /Q "TracNghiemProMax-main\*" "." 2>nul
if errorlevel 1 (
    echo [ERROR] Loi khi copy files!
    echo.
    echo Thu chay lai voi quyen Administrator:
    echo - Click phai vao file nay
    echo - Chon "Run as administrator"
    echo.
    pause
    exit /b 1
)
echo [OK] Copy thanh cong!

echo [2/5] Dang copy .gitignore...
if exist "TracNghiemProMax-main\.gitignore" (
    copy /Y "TracNghiemProMax-main\.gitignore" ".gitignore" >nul 2>&1
    echo [OK] Copy .gitignore thanh cong!
) else (
    echo [SKIP] Khong tim thay .gitignore
)

echo [3/5] Dang xoa thu muc TracNghiemProMax-main...
timeout /t 1 /nobreak >nul
rmdir /S /Q "TracNghiemProMax-main" 2>nul
if exist "TracNghiemProMax-main" (
    echo [WARNING] Khong the xoa thu muc (co the dang mo)
    echo Ban co the xoa thu cong sau
) else (
    echo [OK] Xoa thanh cong!
)

echo [4/5] Dang xoa thu muc .vscode...
if exist ".vscode" (
    rmdir /S /Q ".vscode" 2>nul
    echo [OK] Xoa .vscode thanh cong!
) else (
    echo [SKIP] Khong tim thay .vscode
)

echo [5/5] Kiem tra cau truc...
if exist "index.html" (
    echo [OK] index.html da o root!
) else (
    echo [ERROR] Khong tim thay index.html o root!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC 2: PUSH LEN GITHUB
echo ════════════════════════════════════════════════════════════
echo.

:PUSH_TO_GIT

REM Kiểm tra Git có cài đặt không
where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chua duoc cai dat!
    echo.
    echo Vui long:
    echo 1. Cai dat Git tu: https://git-scm.com/download/win
    echo 2. Hoac mo Git Bash va chay lenh:
    echo.
    echo    git add .
    echo    git commit -m "Fix: Move files to root"
    echo    git push origin main --force
    echo.
    pause
    exit /b 1
)

echo [1/4] Kiem tra Git repository...
git status >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Chua khoi tao Git repository
    echo [ACTION] Dang khoi tao...
    git init
    git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
)

echo [2/4] Dang add files...
git add .
if errorlevel 1 (
    echo [ERROR] Loi khi add files!
    pause
    exit /b 1
)
echo [OK] Add files thanh cong!

echo [3/4] Dang commit...
git commit -m "Fix: Move all files to root directory for Vercel deployment"
if errorlevel 1 (
    echo [WARNING] Khong co thay doi hoac da commit roi
)

echo [4/4] Dang push len GitHub...
echo.
echo Dang push... (co the mat vai giay)
echo.

git push origin main --force 2>nul
if errorlevel 1 (
    echo [INFO] Thu lai voi branch master...
    git push origin master --force 2>nul
    if errorlevel 1 (
        echo [ERROR] Khong the push!
        echo.
        echo Co the ban can:
        echo 1. Dang nhap GitHub
        echo 2. Kiem tra quyen truy cap repository
        echo 3. Chay lenh thu cong trong Git Bash:
        echo.
        echo    git push origin main --force
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     HOAN THANH! PUSH THANH CONG!                          ║
echo ║                                                            ║
echo ╔════════════════════════════════════════════════════════════╗
echo.
echo ✓ Files da duoc di chuyen len root
echo ✓ Code da duoc push len GitHub
echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC TIEP THEO
echo ════════════════════════════════════════════════════════════
echo.
echo 1. Kiem tra GitHub:
echo    https://github.com/tranvananh112/TracNghiemThongMinh
echo.
echo 2. Doi 1-2 phut de Vercel tu dong deploy
echo.
echo 3. Cau hinh Supabase CORS:
echo    - Vao: https://supabase.com/dashboard
echo    - Project: uyjakelguelunqzdbscb
echo    - Settings → API → CORS Configuration
echo    - Them domain Vercel cua ban
echo.
echo 4. Kiem tra website co hien thi khong
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
