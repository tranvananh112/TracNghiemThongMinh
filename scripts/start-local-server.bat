@echo off
echo ========================================
echo    KHOI DONG WEB SERVER LOCAL
echo ========================================
echo.

REM Kiem tra PHP
where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PHP da duoc cai dat
    echo [INFO] Khoi dong PHP server...
    echo.
    echo Server dang chay tai: http://localhost:8080
    echo Nhan Ctrl+C de dung server
    echo ========================================
    echo.
    php -S localhost:8080
    goto :end
)

REM Kiem tra Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python da duoc cai dat
    echo [INFO] Khoi dong Python server...
    echo.
    echo Server dang chay tai: http://localhost:8080
    echo Nhan Ctrl+C de dung server
    echo ========================================
    echo.
    python -m http.server 8080
    goto :end
)

REM Kiem tra Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js da duoc cai dat
    echo [INFO] Khoi dong Node.js server...
    echo.
    echo Server dang chay tai: http://localhost:8080
    echo Nhan Ctrl+C de dung server
    echo ========================================
    echo.
    npx http-server -p 8080
    goto :end
)

echo [ERROR] Khong tim thay PHP, Python hoac Node.js!
echo Vui long cai dat mot trong cac cong cu sau:
echo - PHP: https://www.php.net/downloads
echo - Python: https://www.python.org/downloads/
echo - Node.js: https://nodejs.org/
echo.
pause
exit /b 1

:end
pause
