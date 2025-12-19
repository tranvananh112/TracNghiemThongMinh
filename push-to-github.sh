#!/bin/bash

# Script push code lên GitHub
# Chạy trong Git Bash

echo "========================================"
echo "  PUSH CODE LÊN GITHUB"
echo "========================================"
echo ""

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[BƯỚC 1] Di chuyển files lên root...${NC}"
echo ""

# Kiểm tra thư mục tồn tại
if [ ! -d "TracNghiemProMax-main" ]; then
    echo -e "${RED}[ERROR] Không tìm thấy thư mục TracNghiemProMax-main${NC}"
    echo ""
    if [ -f "index.html" ]; then
        echo -e "${GREEN}[OK] index.html đã ở root!${NC}"
        echo "Files có thể đã được di chuyển rồi."
        echo ""
    else
        echo -e "${RED}[ERROR] Không tìm thấy index.html!${NC}"
        exit 1
    fi
else
    # Di chuyển files
    echo "[1/4] Di chuyển files..."
    mv TracNghiemProMax-main/* . 2>/dev/null
    mv TracNghiemProMax-main/.* . 2>/dev/null
    echo -e "${GREEN}✓ Đã di chuyển files${NC}"
    
    # Xóa thư mục cũ
    echo "[2/4] Xóa thư mục cũ..."
    rm -rf TracNghiemProMax-main
    echo -e "${GREEN}✓ Đã xóa TracNghiemProMax-main${NC}"
    
    # Xóa .vscode
    echo "[3/4] Xóa .vscode..."
    rm -rf .vscode
    echo -e "${GREEN}✓ Đã xóa .vscode${NC}"
    
    # Kiểm tra
    echo "[4/4] Kiểm tra..."
    if [ -f "index.html" ]; then
        echo -e "${GREEN}✓ index.html đã ở root!${NC}"
    else
        echo -e "${RED}✗ Không tìm thấy index.html!${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}[BƯỚC 2] Push lên GitHub...${NC}"
echo ""

# Kiểm tra Git repository
if [ ! -d ".git" ]; then
    echo "[INFO] Khởi tạo Git repository..."
    git init
    git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git
fi

# Add files
echo "[1/3] Add files..."
git add .
echo -e "${GREEN}✓ Đã add files${NC}"

# Commit
echo "[2/3] Commit..."
git commit -m "Fix: Move all files to root directory for Vercel deployment"
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[WARNING] Không có thay đổi hoặc đã commit rồi${NC}"
fi

# Push
echo "[3/3] Push lên GitHub..."
echo ""
echo "Đang push... (có thể mất vài giây)"
echo ""

git push origin main --force 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}[INFO] Thử lại với branch master...${NC}"
    git push origin master --force
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Không thể push!${NC}"
        echo ""
        echo "Có thể bạn cần:"
        echo "1. Đăng nhập GitHub"
        echo "2. Kiểm tra quyền truy cập repository"
        echo ""
        exit 1
    fi
fi

echo ""
echo "========================================"
echo -e "${GREEN}  HOÀN THÀNH! PUSH THÀNH CÔNG!${NC}"
echo "========================================"
echo ""
echo "✓ Files đã được di chuyển lên root"
echo "✓ Code đã được push lên GitHub"
echo ""
echo "========================================"
echo "  BƯỚC TIẾP THEO"
echo "========================================"
echo ""
echo "1. Kiểm tra GitHub:"
echo "   https://github.com/tranvananh112/TracNghiemThongMinh"
echo ""
echo "2. Đợi 1-2 phút để Vercel tự động deploy"
echo ""
echo "3. Cấu hình Supabase CORS:"
echo "   - Vào: https://supabase.com/dashboard"
echo "   - Project: uyjakelguelunqzdbscb"
echo "   - Settings → API → CORS Configuration"
echo "   - Thêm domain Vercel của bạn"
echo ""
echo "4. Kiểm tra website có hiển thị không"
echo ""
echo "========================================"
echo ""
