// 🔥 FIX NGAY LÚNG TÙNG - Chạy trong Console (F12)
// Copy và paste vào Console của trang index.html

console.log('🔥 === FIX NÚT PERMISSION NGAY ===');

// 1. Đặt tên người dùng
function fixSetUser() {
    const testUser = prompt('Nhập tên người dùng của bạn:', localStorage.getItem('userName') || 'TestUser');
    if (!testUser) return false;

    localStorage.setItem('userName', testUser);
    localStorage.setItem('currentUserName', testUser);

    if (window.exploreQuizManager) {
        window.exploreQuizManager.currentUserName = testUser;
    }

    console.log('✅ Đã đặt tên người dùng:', testUser);
    return testUser;
}

// 2. Force hiển thị nút cho tất cả quiz
function fixShowButtons() {
    console.log('🔧 Force hiển thị nút...');

    const quizCards = document.querySelectorAll('[data-quiz-id]');
    console.log(`📋 Tìm thấy ${quizCards.length} quiz cards`);

    if (quizCards.length === 0) {
        console.log('❌ Không tìm thấy quiz nào. Vui lòng vào tab "Khám Phá Đề Thi"');
        return false;
    }

    quizCards.forEach((card, index) => {
        const quizId = card.getAttribute('data-quiz-id');

        // Tìm hoặc tạo actions div
        let actionsDiv = card.querySelector('.quiz-card-actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'quiz-card-actions';

            // Tìm vị trí thích hợp để chèn
            const content = card.querySelector('.quiz-card-content, .shared-quiz-content');
            const practiceBtn = card.querySelector('.quiz-card-practice-action, .btn-quiz-practice-full');

            if (content && practiceBtn) {
                content.insertBefore(actionsDiv, practiceBtn);
            } else if (content) {
                content.appendChild(actionsDiv);
            } else {
                card.appendChild(actionsDiv);
            }

            console.log(`✅ Tạo actions div cho card ${index + 1}`);
        }

        // Style cho actions div
        actionsDiv.style.display = 'flex';
        actionsDiv.style.gap = '8px';
        actionsDiv.style.padding = '10px 0';
        actionsDiv.style.borderTop = '1px solid #e2e8f0';
        actionsDiv.style.borderBottom = '1px solid #e2e8f0';
        actionsDiv.style.flexWrap = 'wrap';

        // Kiểm tra nút hiện có
        const hasDetail = actionsDiv.querySelector('.btn-quiz-secondary');
        const hasEdit = actionsDiv.querySelector('.btn-quiz-warning');
        const hasDelete = actionsDiv.querySelector('.btn-quiz-danger');

        // Tạo HTML nút
        let buttonsHTML = '';

        if (!hasDetail) {
            buttonsHTML += `
                <button class="btn-quiz-action btn-quiz-secondary" onclick="alert('Xem chi tiết quiz')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #e2e8f0, #cbd5e0); color: #4a5568;">
                    <i class="fas fa-info-circle"></i>
                    <span style="display: none;">Chi tiết</span>
                </button>
            `;
        }

        if (!hasEdit) {
            buttonsHTML += `
                <button class="btn-quiz-action btn-quiz-warning" onclick="alert('Chỉnh sửa quiz')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #f6ad55, #ed8936); color: white;">
                    <i class="fas fa-edit"></i>
                    <span style="display: none;">Sửa</span>
                </button>
            `;
        }

        if (!hasDelete) {
            buttonsHTML += `
                <button class="btn-quiz-action btn-quiz-danger" onclick="alert('Xóa quiz')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #fc8181, #e53e3e); color: white;">
                    <i class="fas fa-trash"></i>
                    <span style="display: none;">Xóa</span>
                </button>
            `;
        }

        if (buttonsHTML) {
            actionsDiv.innerHTML += buttonsHTML;
            console.log(`✅ Thêm nút cho card ${index + 1}`);
        }

        // Hiển thị text trên màn hình lớn
        if (window.innerWidth >= 768) {
            const spans = actionsDiv.querySelectorAll('.btn-quiz-action span');
            spans.forEach(span => {
                span.style.display = 'inline';
                span.style.marginLeft = '4px';
            });
        }
    });

    console.log('✅ Hoàn thành force hiển thị nút');
    return true;
}

// 3. Chạy tất cả
function fixAll() {
    console.log('🚀 Bắt đầu fix tất cả...');

    // Đặt tên người dùng
    const user = fixSetUser();
    if (!user) {
        console.log('❌ Hủy bỏ - không có tên người dùng');
        return;
    }

    // Hiển thị nút
    const success = fixShowButtons();
    if (success) {
        console.log('🎉 HOÀN THÀNH! Kiểm tra giao diện để thấy nút Sửa/Xóa');

        // Highlight tất cả nút permission
        setTimeout(() => {
            const editBtns = document.querySelectorAll('.btn-quiz-warning');
            const deleteBtns = document.querySelectorAll('.btn-quiz-danger');

            [...editBtns, ...deleteBtns].forEach(btn => {
                btn.style.border = '3px solid #00ff00';
                btn.style.boxShadow = '0 0 10px #00ff00';
            });

            setTimeout(() => {
                [...editBtns, ...deleteBtns].forEach(btn => {
                    btn.style.border = '';
                    btn.style.boxShadow = '';
                });
            }, 3000);

        }, 500);
    }
}

// 4. Chỉ hiển thị nút (không hỏi tên)
function fixButtonsOnly() {
    console.log('🔧 Chỉ fix nút...');

    const success = fixShowButtons();
    if (success) {
        console.log('✅ Đã thêm nút. Nếu muốn có quyền thật, hãy chạy: fixAll()');
    }
}

// Export functions
window.fixPermission = {
    all: fixAll,
    buttonsOnly: fixButtonsOnly,
    setUser: fixSetUser,
    showButtons: fixShowButtons
};

// Hướng dẫn
console.log('💡 === HƯỚNG DẪN SỬ DỤNG ===');
console.log('🔥 fixAll() - Fix tất cả (hỏi tên + hiển thị nút)');
console.log('🔧 fixButtonsOnly() - Chỉ hiển thị nút');
console.log('👤 fixSetUser() - Chỉ đặt tên người dùng');
console.log('🎯 fixShowButtons() - Chỉ hiển thị nút');

// Auto-run nếu muốn
if (confirm('Bạn có muốn chạy fix ngay không?')) {
    fixAll();
} else {
    console.log('💡 Chạy thủ công: fixAll()');
}