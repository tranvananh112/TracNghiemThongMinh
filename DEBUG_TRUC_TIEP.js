// 🔥 DEBUG TRỰC TIẾP - Chạy ngay trong Console
// Copy và paste vào Console (F12) của trang index.html

console.log('🔥 === DEBUG TRỰC TIẾP PERMISSION ===');

// 1. Kiểm tra trạng thái hiện tại
function debugCurrentState() {
    console.log('📊 === TRẠNG THÁI HIỆN TẠI ===');

    // Kiểm tra exploreQuizManager
    if (!window.exploreQuizManager) {
        console.error('❌ exploreQuizManager không tồn tại!');
        return false;
    }

    const manager = window.exploreQuizManager;
    console.log('✅ exploreQuizManager tồn tại');
    console.log('👤 currentUserName:', manager.currentUserName);
    console.log('👑 isAdminMode:', manager.isAdminMode);
    console.log('📊 sharedQuizzes count:', manager.sharedQuizzes.length);

    // Kiểm tra admin manager
    if (window.adminManager) {
        console.log('👑 adminManager.isAdminMode:', window.adminManager.isAdminMode);
    }

    return true;
}

// 2. Test permission cho từng quiz
function testPermissionForAllQuizzes() {
    console.log('🔍 === TEST PERMISSION CHO TẤT CẢ QUIZ ===');

    const manager = window.exploreQuizManager;
    if (!manager) return;

    manager.sharedQuizzes.forEach((quiz, index) => {
        console.log(`\n📝 Quiz ${index + 1}: "${quiz.title}"`);
        console.log(`   👤 Owner: "${quiz.user_name || quiz.userName || 'KHÔNG RÕ'}"`);

        const canEdit = manager.checkQuizPermission(quiz, 'edit');
        const canDelete = manager.checkQuizPermission(quiz, 'delete');

        console.log(`   ✏️ Can Edit: ${canEdit ? '✅ YES' : '❌ NO'}`);
        console.log(`   🗑️ Can Delete: ${canDelete ? '✅ YES' : '❌ NO'}`);

        if (canEdit || canDelete) {
            console.log(`   🎯 BẠN CÓ QUYỀN VỚI QUIZ NÀY!`);

            // Test generate buttons
            const buttons = manager.generateQuizActionButtons(quiz);
            console.log(`   🔧 Generated buttons:`, buttons);
        }
    });
}

// 3. Kiểm tra UI hiện tại
function checkCurrentUI() {
    console.log('🖥️ === KIỂM TRA UI HIỆN TẠI ===');

    const quizCards = document.querySelectorAll('[data-quiz-id]');
    console.log(`📋 Tìm thấy ${quizCards.length} quiz cards`);

    quizCards.forEach((card, index) => {
        const quizId = card.getAttribute('data-quiz-id');
        const actionsDiv = card.querySelector('.quiz-card-actions');

        console.log(`\n🎴 Card ${index + 1} (ID: ${quizId}):`);

        if (!actionsDiv) {
            console.log('   ❌ Không có .quiz-card-actions div');
            return;
        }

        console.log('   ✅ Có .quiz-card-actions div');
        console.log('   📄 innerHTML:', actionsDiv.innerHTML);

        const editBtn = actionsDiv.querySelector('.btn-quiz-warning');
        const deleteBtn = actionsDiv.querySelector('.btn-quiz-danger');
        const detailBtn = actionsDiv.querySelector('.btn-quiz-secondary');

        console.log(`   🔍 Detail button: ${detailBtn ? '✅' : '❌'}`);
        console.log(`   ✏️ Edit button: ${editBtn ? '✅' : '❌'}`);
        console.log(`   🗑️ Delete button: ${deleteBtn ? '✅' : '❌'}`);

        if (editBtn) {
            console.log('   📐 Edit button style:', editBtn.style.cssText);
            console.log('   👁️ Edit button visible:', window.getComputedStyle(editBtn).display !== 'none');
        }

        if (deleteBtn) {
            console.log('   📐 Delete button style:', deleteBtn.style.cssText);
            console.log('   👁️ Delete button visible:', window.getComputedStyle(deleteBtn).display !== 'none');
        }
    });
}

// 4. Force re-render với debug
function forceReRenderWithDebug() {
    console.log('🔄 === FORCE RE-RENDER VỚI DEBUG ===');

    const manager = window.exploreQuizManager;
    if (!manager) {
        console.error('❌ Không có exploreQuizManager');
        return;
    }

    console.log('🔧 Đang re-render...');

    // Patch generateQuizActionButtons để debug
    const originalGenerate = manager.generateQuizActionButtons.bind(manager);
    manager.generateQuizActionButtons = function (quiz) {
        console.log(`🎯 [PATCHED] Generating buttons for "${quiz.title}"`);

        const canEdit = this.checkQuizPermission(quiz, 'edit');
        const canDelete = this.checkQuizPermission(quiz, 'delete');

        console.log(`   ✏️ canEdit: ${canEdit}`);
        console.log(`   🗑️ canDelete: ${canDelete}`);

        const result = originalGenerate(quiz);
        console.log(`   🔧 Result HTML length: ${result.length}`);
        console.log(`   📄 Result HTML:`, result);

        return result;
    };

    // Re-render
    manager.renderSharedQuizzes(manager.sharedQuizzes);

    console.log('✅ Re-render hoàn thành');
}

// 5. Force thêm nút trực tiếp
function forceAddButtonsDirectly() {
    console.log('🔧 === FORCE THÊM NÚT TRỰC TIẾP ===');

    const quizCards = document.querySelectorAll('[data-quiz-id]');

    quizCards.forEach((card, index) => {
        const quizId = card.getAttribute('data-quiz-id');

        // Tìm hoặc tạo actions div
        let actionsDiv = card.querySelector('.quiz-card-actions');
        if (!actionsDiv) {
            actionsDiv = document.createElement('div');
            actionsDiv.className = 'quiz-card-actions';

            // Tìm vị trí để chèn
            const content = card.querySelector('.quiz-card-content, .shared-quiz-content');
            const practiceAction = card.querySelector('.quiz-card-practice-action');

            if (content && practiceAction) {
                content.insertBefore(actionsDiv, practiceAction);
            } else if (content) {
                content.appendChild(actionsDiv);
            } else {
                card.appendChild(actionsDiv);
            }

            console.log(`✅ Tạo actions div cho card ${index + 1}`);
        }

        // Style cho actions div
        actionsDiv.style.cssText = `
            display: flex !important;
            gap: 8px;
            padding: 10px 0;
            border-top: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
            flex-wrap: wrap;
            justify-content: flex-start;
        `;

        // Xóa nội dung cũ và thêm nút mới
        actionsDiv.innerHTML = `
            <button class="btn-quiz-action btn-quiz-secondary" onclick="alert('Chi tiết quiz ${quizId}')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none !important; cursor: pointer; display: flex !important; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #e2e8f0, #cbd5e0) !important; color: #4a5568 !important;">
                <i class="fas fa-info-circle"></i>
                <span style="display: none;">Chi tiết</span>
            </button>
            <button class="btn-quiz-action btn-quiz-warning" onclick="alert('Chỉnh sửa quiz ${quizId}')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none !important; cursor: pointer; display: flex !important; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #f6ad55, #ed8936) !important; color: white !important;">
                <i class="fas fa-edit"></i>
                <span style="display: none;">Sửa</span>
            </button>
            <button class="btn-quiz-action btn-quiz-danger" onclick="alert('Xóa quiz ${quizId}')" style="flex: 1; min-width: 80px; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: none !important; cursor: pointer; display: flex !important; align-items: center; justify-content: center; gap: 4px; font-weight: 600; background: linear-gradient(135deg, #fc8181, #e53e3e) !important; color: white !important;">
                <i class="fas fa-trash"></i>
                <span style="display: none;">Xóa</span>
            </button>
        `;

        // Hiển thị text trên màn hình lớn
        if (window.innerWidth >= 768) {
            const spans = actionsDiv.querySelectorAll('span');
            spans.forEach(span => {
                span.style.display = 'inline';
                span.style.marginLeft = '4px';
            });
        }

        console.log(`✅ Force thêm nút cho card ${index + 1}`);
    });

    // Highlight nút
    setTimeout(() => {
        const editBtns = document.querySelectorAll('.btn-quiz-warning');
        const deleteBtns = document.querySelectorAll('.btn-quiz-danger');

        [...editBtns, ...deleteBtns].forEach(btn => {
            btn.style.border = '3px solid #00ff00';
            btn.style.boxShadow = '0 0 15px #00ff00';
        });

        console.log('🌟 Highlighted permission buttons');

        setTimeout(() => {
            [...editBtns, ...deleteBtns].forEach(btn => {
                btn.style.border = '';
                btn.style.boxShadow = '';
            });
        }, 5000);

    }, 500);

    console.log('🎉 HOÀN THÀNH! Kiểm tra giao diện để thấy nút Sửa/Xóa');
}

// 6. Chạy tất cả debug
function runFullDebug() {
    console.log('🚀 === CHẠY FULL DEBUG ===\n');

    const step1 = debugCurrentState();
    if (!step1) return;

    testPermissionForAllQuizzes();
    checkCurrentUI();
    forceReRenderWithDebug();

    setTimeout(() => {
        console.log('\n🔍 === KIỂM TRA LẠI SAU RE-RENDER ===');
        checkCurrentUI();

        console.log('\n💡 Nếu vẫn không thấy nút, chạy: forceAddButtonsDirectly()');
    }, 1000);
}

// Export functions
window.debugPermission = {
    full: runFullDebug,
    state: debugCurrentState,
    testPermissions: testPermissionForAllQuizzes,
    checkUI: checkCurrentUI,
    reRender: forceReRenderWithDebug,
    forceButtons: forceAddButtonsDirectly
};

// Hướng dẫn
console.log('💡 === HƯỚNG DẪN DEBUG ===');
console.log('🚀 runFullDebug() - Chạy tất cả debug');
console.log('🔧 forceAddButtonsDirectly() - Force thêm nút ngay');
console.log('🔍 checkCurrentUI() - Kiểm tra UI hiện tại');
console.log('🔄 forceReRenderWithDebug() - Re-render với debug');

// Auto run
console.log('\n🎯 Bắt đầu debug...');
runFullDebug();