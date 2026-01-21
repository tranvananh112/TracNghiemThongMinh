// 🔍 SCRIPT DEBUG PERMISSION - Chạy trong Console của trang chính
// Copy và paste script này vào Console (F12) của trang index.html

console.log('🔍 === BẮT ĐẦU DEBUG PERMISSION SYSTEM ===');

// 1. Kiểm tra ExploreQuizManager
function debugExploreManager() {
    console.log('📋 1. Kiểm tra ExploreQuizManager:');

    if (typeof window.exploreQuizManager === 'undefined') {
        console.error('❌ exploreQuizManager không tồn tại!');
        return false;
    }

    const manager = window.exploreQuizManager;
    console.log('✅ exploreQuizManager tồn tại');
    console.log('   - currentUserName:', manager.currentUserName);
    console.log('   - isAdminMode:', manager.isAdminMode);
    console.log('   - sharedQuizzes count:', manager.sharedQuizzes.length);

    return true;
}

// 2. Kiểm tra localStorage
function debugLocalStorage() {
    console.log('📋 2. Kiểm tra localStorage:');

    const userName = localStorage.getItem('userName');
    const currentUserName = localStorage.getItem('currentUserName');

    console.log('   - userName:', userName || 'KHÔNG CÓ');
    console.log('   - currentUserName:', currentUserName || 'KHÔNG CÓ');

    if (!userName && !currentUserName) {
        console.warn('⚠️ Không có tên người dùng trong localStorage!');
        return false;
    }

    return true;
}

// 3. Test permission với quiz thật
function debugRealQuizzes() {
    console.log('📋 3. Test permission với quiz thật:');

    if (!window.exploreQuizManager) {
        console.error('❌ Không có exploreQuizManager');
        return;
    }

    const manager = window.exploreQuizManager;
    const currentUser = manager.currentUserName || localStorage.getItem('userName') || 'CHƯA ĐẶT';

    console.log(`   - Người dùng hiện tại: "${currentUser}"`);
    console.log(`   - Số quiz: ${manager.sharedQuizzes.length}`);

    if (manager.sharedQuizzes.length === 0) {
        console.warn('⚠️ Không có quiz nào để test!');
        return;
    }

    manager.sharedQuizzes.forEach((quiz, index) => {
        console.log(`\n   📝 Quiz ${index + 1}: "${quiz.title}"`);
        console.log(`      - Người tạo: "${quiz.user_name || quiz.userName || 'KHÔNG RÕ'}"`);

        const canEdit = manager.checkQuizPermission(quiz, 'edit');
        const canDelete = manager.checkQuizPermission(quiz, 'delete');

        console.log(`      - Quyền sửa: ${canEdit ? '✅' : '❌'}`);
        console.log(`      - Quyền xóa: ${canDelete ? '✅' : '❌'}`);

        if (canEdit || canDelete) {
            console.log('      🎯 BẠN CÓ QUYỀN VỚI QUIZ NÀY!');
        }
    });
}

// 4. Test tạo quiz giả để kiểm tra
function debugTestQuiz() {
    console.log('📋 4. Test với quiz giả:');

    const currentUser = localStorage.getItem('userName') || 'TestUser';

    // Tạo quiz test
    const testQuiz = {
        id: 'test-123',
        title: 'Quiz Test Debug',
        userName: currentUser,
        user_name: currentUser
    };

    console.log('   - Tạo quiz test:', testQuiz);

    if (window.exploreQuizManager) {
        const manager = window.exploreQuizManager;
        const canEdit = manager.checkQuizPermission(testQuiz, 'edit');
        const canDelete = manager.checkQuizPermission(testQuiz, 'delete');

        console.log(`   - Quyền sửa quiz test: ${canEdit ? '✅' : '❌'}`);
        console.log(`   - Quyền xóa quiz test: ${canDelete ? '✅' : '❌'}`);

        if (canEdit && canDelete) {
            console.log('   🎯 PERMISSION SYSTEM HOẠT ĐỘNG ĐÚNG!');
        } else {
            console.error('   ❌ PERMISSION SYSTEM CÓ VẤN ĐỀ!');
        }
    }
}

// 5. Kiểm tra UI buttons
function debugUIButtons() {
    console.log('📋 5. Kiểm tra UI buttons:');

    const quizCards = document.querySelectorAll('[data-quiz-id]');
    console.log(`   - Tìm thấy ${quizCards.length} quiz cards`);

    quizCards.forEach((card, index) => {
        const quizId = card.getAttribute('data-quiz-id');
        const editBtn = card.querySelector('.btn-quiz-warning');
        const deleteBtn = card.querySelector('.btn-quiz-danger');
        const title = card.querySelector('.quiz-card-title, .shared-quiz-title')?.textContent || 'Không rõ';

        console.log(`\n   🎴 Card ${index + 1}: "${title}" (ID: ${quizId})`);
        console.log(`      - Nút Sửa: ${editBtn ? '✅ Có' : '❌ Không'}`);
        console.log(`      - Nút Xóa: ${deleteBtn ? '✅ Có' : '❌ Không'}`);

        if (!editBtn && !deleteBtn) {
            console.warn('      ⚠️ Không có nút quyền nào!');
        }
    });
}

// 6. Đặt tên người dùng test
function setTestUser(username = 'TestUser') {
    console.log(`📋 6. Đặt tên người dùng test: "${username}"`);

    localStorage.setItem('userName', username);
    localStorage.setItem('currentUserName', username);

    if (window.exploreQuizManager) {
        window.exploreQuizManager.currentUserName = username;
        console.log('   ✅ Đã cập nhật exploreQuizManager.currentUserName');

        // Re-render để cập nhật UI
        if (window.exploreQuizManager.sharedQuizzes.length > 0) {
            console.log('   🔄 Re-rendering quizzes...');
            window.exploreQuizManager.renderSharedQuizzes(window.exploreQuizManager.sharedQuizzes);
        }
    }

    console.log('   ✅ Đã đặt tên người dùng test');
}

// 7. Chạy tất cả debug
function runAllDebug() {
    console.log('🚀 === CHẠY TẤT CẢ DEBUG ===\n');

    const step1 = debugExploreManager();
    const step2 = debugLocalStorage();

    if (step1) {
        debugRealQuizzes();
        debugTestQuiz();
        debugUIButtons();
    }

    console.log('\n🏁 === KẾT THÚC DEBUG ===');
    console.log('💡 Để đặt tên test: setTestUser("TenCuaBan")');
    console.log('💡 Để chạy lại: runAllDebug()');
}

// Chạy debug ngay lập tức
runAllDebug();

// Export functions để có thể gọi lại
window.debugPermission = {
    runAll: runAllDebug,
    setUser: setTestUser,
    checkManager: debugExploreManager,
    checkStorage: debugLocalStorage,
    checkQuizzes: debugRealQuizzes,
    checkUI: debugUIButtons
};

console.log('💡 Sử dụng: debugPermission.runAll() để chạy lại tất cả');
console.log('💡 Sử dụng: debugPermission.setUser("TenCuaBan") để đặt tên');