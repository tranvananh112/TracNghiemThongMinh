#!/bin/bash

# Script xóa Git cũ và push lại lên GitHub
# Chạy trong Git Bash

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     XÓA GIT CŨ - TẢI CODE LÊN GITHUB MỚI                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Repository: https://github.com/tranvananh112/TracNghiemThongMinh.git"
echo ""
read -p "Nhấn Enter để tiếp tục..."
echo ""

# ============================================================
# BƯỚC 1: XÓA GIT CŨ
# ============================================================
echo "════════════════════════════════════════════════════════════"
echo -e "${YELLOW}  BƯỚC 1: XÓA GIT CŨ${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ -d ".git" ]; then
    echo -e "${YELLOW}[1/1] Đang xóa thư mục .git cũ...${NC}"
    rm -rf .git
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK] Đã xóa .git cũ!${NC}"
    else
        echo -e "${RED}[ERROR] Không thể xóa .git!${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}[INFO] Không tìm thấy .git cũ${NC}"
fi

echo ""

# ============================================================
# BƯỚC 2: DI CHUYỂN FILES LÊN ROOT
# ============================================================
echo "════════════════════════════════════════════════════════════"
echo -e "${YELLOW}  BƯỚC 2: DI CHUYỂN FILES LÊN ROOT${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ -d "TracNghiemProMax-main" ]; then
    echo -e "${YELLOW}[1/5] Đang di chuyển files...${NC}"
    mv TracNghiemProMax-main/* . 2>/dev/null
    mv TracNghiemProMax-main/.* . 2>/dev/null
    echo -e "${GREEN}[OK] Di chuyển thành công!${NC}"
    
    echo -e "${YELLOW}[2/5] Đang xóa thư mục TracNghiemProMax-main...${NC}"
    rm -rf TracNghiemProMax-main
    echo -e "${GREEN}[OK] Xóa thành công!${NC}"
    
    echo -e "${YELLOW}[3/5] Đang xóa thư mục .vscode...${NC}"
    rm -rf .vscode
    echo -e "${GREEN}[OK] Xóa .vscode thành công!${NC}"
    
    echo -e "${YELLOW}[4/5] Kiểm tra...${NC}"
    if [ -f "index.html" ]; then
        echo -e "${GREEN}[OK] index.html đã ở root!${NC}"
    else
        echo -e "${RED}[ERROR] Không tìm thấy index.html!${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}[INFO] Thư mục TracNghiemProMax-main không tồn tại${NC}"
    if [ -f "index.html" ]; then
        echo -e "${GREEN}[OK] Files đã ở root rồi!${NC}"
    else
        echo -e "${RED}[ERROR] Không tìm thấy index.html!${NC}"
        exit 1
    fi
fi

echo ""

# ============================================================
# BƯỚC 3: KHỞI TẠO GIT MỚI
# ============================================================
echo "════════════════════════════════════════════════════════════"
echo -e "${YELLOW}  BƯỚC 3: KHỞI TẠO GIT MỚI${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

# Kiểm tra Git có cài đặt không
if ! command -v git &> /dev/null; then
    echo -e "${RED}[ERROR] Git chưa được cài đặt!${NC}"
    echo ""
    echo "Vui lòng cài đặt Git từ: https://git-scm.com/download"
    exit 1
fi

echo -e "${YELLOW}[1/3] Khởi tạo Git repository mới...${NC}"
git init
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK] Khởi tạo thành công!${NC}"
else
    echo -e "${RED}[ERROR] Lỗi khi khởi tạo Git!${NC}"
    exit 1
fi

echo -e "${YELLOW}[2/3] Thêm remote repository...${NC}"
git remote add origin https://github.com/tranvananh112/TracNghiemThongMinh.git 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${BLUE}[INFO] Remote đã tồn tại, đang cập nhật...${NC}"
    git remote set-url origin https://github.com/tranvananh112/TracNghiemThongMinh.git
fi
echo -e "${GREEN}[OK] Remote đã được thêm!${NC}"

echo -e "${YELLOW}[3/3] Cấu hình Git...${NC}"
git config user.name "tranvananh112" 2>/dev/null
git config user.email "tranvananh112@github.com" 2>/dev/null
echo -e "${GREEN}[OK] Cấu hình thành công!${NC}"

echo ""

# ============================================================
# BƯỚC 4: PUSH CODE LÊN GITHUB
# ============================================================
echo "════════════════════════════════════════════════════════════"
echo -e "${YELLOW}  BƯỚC 4: PUSH CODE LÊN GITHUB${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""

echo -e "${YELLOW}[1/4] Thêm tất cả files...${NC}"
git add .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK] Đã add files!${NC}"
else
    echo -e "${RED}[ERROR] Lỗi khi add files!${NC}"
    exit 1
fi

echo -e "${YELLOW}[2/4] Commit...${NC}"
git commit -m "Initial commit: Move all files to root for Vercel deployment"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK] Đã commit!${NC}"
else
    echo -e "${RED}[ERROR] Lỗi khi commit!${NC}"
    exit 1
fi

echo -e "${YELLOW}[3/4] Tạo branch main...${NC}"
git branch -M main
echo -e "${GREEN}[OK] Branch main đã được tạo!${NC}"

echo -e "${YELLOW}[4/4] Push lên GitHub...${NC}"
echo ""
echo "Đang push... (có thể mất vài giây)"
echo "Bạn có thể cần nhập username/password hoặc token"
echo ""

git push -u origin main --force
if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo -e "║     ${GREEN}HOÀN THÀNH! CODE ĐÃ ĐƯỢC PUSH LÊN GITHUB!${NC}             ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}✓ Đã xóa Git cũ${NC}"
    echo -e "${GREEN}✓ Đã di chuyển files lên root${NC}"
    echo -e "${GREEN}✓ Đã khởi tạo Git mới${NC}"
    echo -e "${GREEN}✓ Đã push lên GitHub${NC}"
else
    echo ""
    echo -e "${RED}[ERROR] Không thể push!${NC}"
    echo ""
    echo "Có thể bạn cần:"
    echo "1. Đăng nhập GitHub"
    echo "2. Tạo Personal Access Token"
    echo "3. Kiểm tra quyền truy cập repository"
    echo ""
    echo "Thử chạy lệnh này:"
    echo "   git push -u origin main --force"
    echo ""
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${CYAN}  BƯỚC TIẾP THEO${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "1. Kiểm tra GitHub:"
echo "   https://github.com/tranvananh112/TracNghiemThongMinh"
echo ""
echo "2. Kiểm tra cấu trúc files:"
echo "   - index.html phải ở root"
echo "   - Không còn thư mục TracNghiemProMax-main"
echo ""
echo "3. Deploy trên Vercel:"
echo "   - Kết nối GitHub repository"
echo "   - Vercel sẽ tự động deploy"
echo "   - Root Directory: để trống"
echo ""
echo "4. Cấu hình Supabase CORS:"
echo "   - Vào: https://supabase.com/dashboard"
echo "   - Project: uyjakelguelunqzdbscb"
echo "   - Settings → API → CORS"
echo "   - Thêm domain Vercel"
echo ""
echo "5. Test website:"
echo "   - Mở trên 2 thiết bị"
echo "   - Tạo quiz và chia sẻ"
echo "   - Kiểm tra thiết bị khác có thấy không"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
