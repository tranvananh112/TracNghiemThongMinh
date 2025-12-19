# Script di chuyển files từ TracNghiemProMax-main lên root
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DI CHUYEN FILES LEN ROOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra thư mục tồn tại
if (-not (Test-Path "TracNghiemProMax-main")) {
    Write-Host "Loi: Khong tim thay thu muc TracNghiemProMax-main" -ForegroundColor Red
    exit 1
}

Write-Host "[1/4] Dang di chuyen files..." -ForegroundColor Yellow

# Di chuyển tất cả files và folders
Get-ChildItem -Path "TracNghiemProMax-main" -Force | ForEach-Object {
    $dest = Join-Path -Path "." -ChildPath $_.Name
    if (Test-Path $dest) {
        Remove-Item $dest -Recurse -Force -ErrorAction SilentlyContinue
    }
    Move-Item -Path $_.FullName -Destination "." -Force
    Write-Host "  Moved: $($_.Name)" -ForegroundColor Gray
}

Write-Host "[2/4] Xoa thu muc cu..." -ForegroundColor Yellow
Remove-Item "TracNghiemProMax-main" -Force -ErrorAction SilentlyContinue

Write-Host "[3/4] Xoa .vscode..." -ForegroundColor Yellow
Remove-Item ".vscode" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "[4/4] Kiem tra..." -ForegroundColor Yellow
if (Test-Path "index.html") {
    Write-Host "  OK: index.html da o root!" -ForegroundColor Green
} else {
    Write-Host "  LOI: Khong tim thay index.html!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HOAN THANH!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bay gio chay cac lenh sau:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Fix: Move files to root'" -ForegroundColor White
Write-Host "  git push origin main --force" -ForegroundColor White
Write-Host ""
