@echo off
echo Moving files from TracNghiemProMax-main to root...

REM Copy all files from subdirectory to root
xcopy /E /I /Y "TracNghiemProMax-main\*" "."

REM Copy .gitignore if exists
if exist "TracNghiemProMax-main\.gitignore" copy /Y "TracNghiemProMax-main\.gitignore" ".gitignore"

REM Remove the subdirectory
rmdir /S /Q "TracNghiemProMax-main"

REM Remove .vscode if exists
if exist ".vscode" rmdir /S /Q ".vscode"

echo Done! Files moved to root.
echo.
echo Now run these commands:
echo git add .
echo git commit -m "Fix: Move all files to root directory"
echo git push origin main --force
pause
