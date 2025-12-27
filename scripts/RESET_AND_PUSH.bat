@echo off
chcp 65001 >nul
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     XOA GIT CU - TAI CODE LEN GITHUB MOI                   ║
echo ║                                                            ║
echo ╔════════════════════════════════════════════════════════════╗
echo.
echo Repository: https://github.com/tranvananh112/TracNghiemThongMinh.git
echo.
pause
echo.

echo ════════════════════════════════════════════════════════════
echo   BUOC 1: XOA GIT CU
echo ════════════════════════════════════════════════════════════
echo.

if exist ".git" (
    echo [1/1] Dang xoa thu muc .git cu...
    rmdir /S /Q ".git" 2>nul
    timeout /t 1 /nobreak >nul
    if exist ".git" (
        echo [ERROR] Khong the xoa .git (co the dang mo)
        echo Vui long dong tat ca chuong trinh dang mo thu muc nay
        pause
        exit /b 1
    )
    echo [OK] Da xoa .git cu!
) else (
    echo [INFO] Khong tim thay .git cu
)

echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC 2: DI CHUYEN FILES LEN ROOT
echo ════════════════════════════════════════════════════════════
echo.

if exist "TracNghiemProMax-main" (
    echo [1/5] Dang copy files...
    xcopy /E /I /Y /Q "TracNghiemProMax-main\*" "." 2>nul
    if errorlevel 1 (
        echo [ERROR] Loi khi copy files!
        pause
        exit /b 1
    )
    echo [OK] Copy thanh cong!
    
    echo [2/5] Dang copy .gitignore...
    if exist "TracNghiemProMax-main\.gitignore" (
        copy /Y "TracNghiemProMax-main\.gitignore" ".gitignore" >nul 2>&1
        echo [OK] Copy .gitignore thanh cong!
    )
    
    echo [3/5] Dang xoa thu muc TracNghiemProMax-main...
    timeout /t 1 /nobreak >nul
    rmdir /S /Q "TracNghiemProMax-main" 2>nul
    if exist "TracNghiemProMax-main" (
        echo [WARNING] Khong the xoa (co the dang mo)
        echo Ban co the xoa thu cong sau
    ) else (
        echo [OK] Xoa thanh cong!
    )
    
    echo [4/5] Dang xoa thu muc .vscode...
    if exist ".vscode" (
        rmdir /S /Q ".vscode" 2>nul
        echo [OK] Xoa .vscode thanh cong!
    )
    
    echo [5/5] Kiem tra...
    if exist "index.html" (
        echo [OK] index.html da o root!
    ) else (
        echo [ERROR] Khong tim thay index.html!
        pause
        exit /b 1
    )
) else (
    echo [INFO] Thu muc TracNghiemProMax-main khong ton tai
    if exist "index.html" (
        echo [OK] Files da o root roi!
    ) else (
        echo [ERROR] Khong tim thay index.html!
        pause
        exit /b 1
    )
)

echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC 3: KHOI TAO GIT MOI
echo ════════════════════════════════════════════════════════════
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git chua duoc cai dat!
    echo.
    echo Vui long cai dat Git tu: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/3] Khoi tao Git repository moi...
git init
if errorlevel 1 (
    echo [ERROR] Loi khi khoi tao Git!
    pause
    exit /b 1
)
echo [OK] Khoi tao thanh cong!

echo [2/3] Them remote repository...
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
if errorlevel 1 (
    echo [WARNING] Remote da ton tai, dang cap nhat...
    git remote set-url origin https://github.com/tranvananh112/TracNghiemThongMinh.git
)
echo [OK] Remote da duoc them!

echo [3/3] Cau hinh Git...
git config user.name "tranvananh112" 2>nul
git config user.email "tranvananh112@github.com" 2>nul
echo [OK] Cau hinh thanh cong!

echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC 4: PUSH CODE LEN GITHUB
echo ════════════════════════════════════════════════════════════
echo.

echo [1/4] Them tat ca files...
git add .
if errorlevel 1 (
    echo [ERROR] Loi khi add files!
    pause
    exit /b 1
)
echo [OK] Da add files!

echo [2/4] Commit...
git commit -m "Initial commit: Move all files to root for Vercel deployment"
if errorlevel 1 (
    echo [ERROR] Loi khi commit!
    pause
    exit /b 1
)
echo [OK] Da commit!

echo [3/4] Tao branch main...
git branch -M main
echo [OK] Branch main da duoc tao!

echo [4/4] Push len GitHub...
echo.
echo Dang push... (co the mat vai giay)
echo Ban co the can nhap username/password hoac token
echo.

git push -u origin main --force
if errorlevel 1 (
    echo.
    echo [ERROR] Khong the push!
    echo.
    echo Co the ban can:
    echo 1. Dang nhap GitHub
    echo 2. Tao Personal Access Token
    echo 3. Kiem tra quyen truy cap repository
    echo.
    echo Hoac thu chay lenh nay trong Git Bash:
    echo    git push -u origin main --force
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     HOAN THANH! CODE DA DUOC PUSH LEN GITHUB!             ║
echo ║                                                            ║
echo ╔════════════════════════════════════════════════════════════╗
echo.
echo ✓ Da xoa Git cu
echo ✓ Da di chuyen files len root
echo ✓ Da khoi tao Git moi
echo ✓ Da push len GitHub
echo.
echo ════════════════════════════════════════════════════════════
echo   BUOC TIEP THEO
echo ════════════════════════════════════════════════════════════
echo.
echo 1. Kiem tra GitHub:
echo    https://github.com/tranvananh112/TracNghiemThongMinh
echo.
echo 2. Kiem tra cau truc files:
echo    - index.html phai o root
echo    - Khong con thu muc TracNghiemProMax-main
echo.
echo 3. Deploy tren Vercel:
echo    - Ket noi GitHub repository
echo    - Vercel se tu dong deploy
echo    - Root Directory: de trong
echo.
echo 4. Cau hinh Supabase CORS:
echo    - Vao: https://supabase.com/dashboard
echo    - Project: uyjakelguelunqzdbscb
echo    - Settings → API → CORS
echo    - Them domain Vercel
echo.
echo 5. Test website:
echo    - Mo tren 2 thiet bi
echo    - Tao quiz va chia se
echo    - Kiem tra thiet bi khac co thay khong
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
