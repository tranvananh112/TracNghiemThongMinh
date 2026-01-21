// 🔥 FORCE TEST PERMISSION - Chạy ngay trong Console
// Copy và paste vào Console (F12) của trang index.html

console.log('🔥 === FORCE TEST PERMISSION SYSTEM ===');

// 1. Kiểm tra và thiết lập môi trường
function forceSetupEnvironment() {
    console.log('🔧 1. Thiết lập môi trường...');

    // Đặt tên người dùng test
    const testUser = 'TestUser123';
    localStorage.setItem('userName', testUser);
    localStorage.setItem('currentUserName', testUser);

    if (window.exploreQuizManager) {
        window.exploreQuizManager.currentUserName = testUser;
        console.log('✅ Đã đặt exploreQuizManager.currentUserName =', testUser);
    }

    console.log('✅ Đã đặt localStorage userName =', testUser);
    return testUser;
}

// 2. Tạo quiz test với quyền
function forceCreateTestQuiz(userName) {
    console.log('🔧 2. Tạo quiz test...');

    const testQuiz = {
        id: 'force-test-' + Date.now(),
        title: 'Quiz Test Permission - ' + new Date().toLocaleTimeString(),
        userName: userName,
        user_name: userName,
        owner: userName,
        createdBy: userName,
        totalQuestions: 5,
        views: 0,
        attempts: 0,
        sharedAt: new Date().toISOString(),
        category: 'test'
    };

    console.log('✅ Tạo quiz test:', testQuiz);
    return testQuiz;
}

// 3. Force thêm quiz vào danh sách
function forceAddQuizToList(quiz) {
    console.log('🔧 3. Thêm quiz vào danh sách...');

    if (!window.exploreQuizManager) {
        console.error('❌ exploreQuizManager không tồn tại!');
        return false;
    }

    // Thêm vào đầu danh sách
    window.exploreQuizManager.sharedQuizzes.unshift(quiz);
    console.log('✅ Đã thêm quiz vào sharedQuizzes');
    console.log('📊 Tổng số quiz:', window.exploreQuizManager.sharedQuizzes.length);

    return true;
}

// 4. Force render lại UI
function forceRenderUI() {
    console.log('🔧 4. Force render UI...');

    if (!window.exploreQuizManager) {
        console.error('❌ exploreQuizManager không tồn tại!');
        return false;
    }

    try {
        window.exploreQuizManager.renderSharedQuizzes(window.exploreQuizManager.sharedQuizzes);
        console.log('✅ Đã render lại UI');
        return true;
    } catch (error) {
        console.error('❌ Lỗi render UI:', error);
        return false;
    }
}

// 5. Kiểm tra kết quả
function forceCheckResult(testQuizId) {
    console.log('🔧 5. Kiểm tra kết quả...');

    // Tìm quiz card
    const quizCard = document.querySelector(`[data-quiz-id="${testQuizId}"]`);
    if (!quizCard) {
        console.error('❌ Không tìm thấy quiz card với ID:', testQuizId);
        return false;
    }

    console.log('✅ Tìm thấy quiz card');

    // Kiểm tra nút
    const editBtn = quizCard.querySelector('.btn-quiz-warning');
    const deleteBtn = quizCard.querySelector('.btn-quiz-danger');
    const detailBtn = quizCard.querySelector('.btn-quiz-secondary');

    console.log('🔍 Kiểm tra nút:');
    console.log('   - Nút Chi tiết:', detailBtn ? '✅ Có' : '❌ Không');
    console.log('   - Nút Sửa (warning):', editBtn ? '✅ Có' : '❌ Không');
    console.log('   - Nút Xóa (danger):', deleteBtn ? '✅ Có' : '❌ Không');

    if (editBtn && deleteBtn) {
        console.log('🎉 THÀNH CÔNG! Nút quyền đã hiển thị!');

        // Highlight các nút
        editBtn.style.border = '3px solid #00ff00';
        deleteBtn.style.border = '3px solid #00ff00';

        setTimeout(() => {
            editBtn.style.border = '';
            deleteBtn.style.border = '';
        }, 3000);

        return true;
    } else {
        console.error('❌ THẤT BẠI! Nút quyền không hiển thị!');

        // Debug thêm
        console.log('🔍 Debug thêm:');
        const actionsDiv = quizCard.querySelector('.quiz-card-actions');
        if (actionsDiv) {
            console.log('   - quiz-card-actions tồn tại');
            console.log('   - innerHTML:', actionsDiv.innerHTML);
        } else {
            console.log('   - quiz-card-actions KHÔNG tồn tại');
        }

        return false;
    }
}

// 6. Force thêm nút nếu không có
function forceAddButtons(testQuizId) {
    console.log('🔧 6. Force thêm nút...');

    const quizCard = document.querySelector(`[data-quiz-id="${testQuizId}"]`);
    if (!quizCard) {
        console.error('❌ Không tìm thấy quiz card');
        return false;
    }

    let actionsDiv = quizCard.querySelector('.quiz-card-actions');
    if (!actionsDiv) {
        // Tạo div actions nếu chưa có
        actionsDiv = document.createElement('div');
        actionsDiv.className = 'quiz-card-actions';

        // Tìm vị trí thích hợp để chèn
        const content = quizCard.querySelector('.quiz-card-content, .shared-quiz-content');
        if (content) {
            content.appendChild(actionsDiv);
        } else {
            quizCard.appendChild(actionsDiv);
        }

        console.log('✅ Đã tạo quiz-card-actions div');
    }

    // Force thêm nút
    actionsDiv.innerHTML = `
        <button class="btn-quiz-action btn-quiz-secondary" onclick="alert('Chi tiết quiz')">
            <i class="fas fa-info-circle"></i>
            <span>Chi tiết</span>
        </button>
        <button class="btn-quiz-action btn-quiz-warning" onclick="alert('Chỉnh sửa quiz')" style="background: linear-gradient(135deg, #f6ad55, #ed8936) !important; color: white !important; border: none !important;">
            <i class="fas fa-edit"></i>
            <span>Sửa</span>
        </button>
        <button class="btn-quiz-action btn-quiz-danger" onclick="alert('Xóa quiz')" style="background: linear-gradient(135deg, #fc8181, #e53e3e) !important; color: white !important; border: none !important;">
            <i class="fas fa-trash"></i>
            <span>Xóa</span>
        </button>
    `;

    console.log('✅ Đã force thêm nút quyền');

    // Highlight
    const editBtn = actionsDiv.querySelector('.btn-quiz-warning');
    const deleteBtn = actionsDiv.querySelector('.btn-quiz-danger');

    if (editBtn && deleteBtn) {
        editBtn.style.border = '3px solid #00ff00';
        deleteBtn.style.border = '3px solid #00ff00';

        setTimeout(() => {
            editBtn.style.border = '';
            deleteBtn.style.border = '';
        }, 5000);
    }

    return true;
}

// 7. Chạy tất cả test
function runForceTest() {
    console.log('🚀 === BẮT ĐẦU FORCE TEST ===\n');

    try {
        // Bước 1: Thiết lập
        const testUser = forceSetupEnvironment();

        // Bước 2: Tạo quiz
        const testQuiz = forceCreateTestQuiz(testUser);

        // Bước 3: Thêm vào danh sách
        const addSuccess = forceAddQuizToList(testQuiz);
        if (!addSuccess) return;

        // Bước 4: Render UI
        const renderSuccess = forceRenderUI();
        if (!renderSuccess) return;

        // Đợi một chút để UI render xong
        setTimeout(() => {
            // Bước 5: Kiểm tra kết quả
            const checkSuccess = forceCheckResult(testQuiz.id);

            if (!checkSuccess) {
                console.log('⚠️ Nút không hiển thị, thử force thêm...');
                forceAddButtons(testQuiz.id);
            }

            console.log('\n🏁 === KẾT THÚC FORCE TEST ===');
            console.log('💡 Nếu thành công, bạn sẽ thấy nút Sửa/Xóa có viền xanh');
            console.log('💡 Để chạy lại: runForceTest()');

        }, 1000);

    } catch (error) {
        console.error('❌ Lỗi trong quá trình test:', error);
    }
}

// 8. Test permission system trực tiếp
function testPermissionDirect() {
    console.log('🔧 Test permission system trực tiếp...');

    if (!window.exploreQuizManager) {
        console.error('❌ exploreQuizManager không tồn tại!');
        return;
    }

    const testUser = 'DirectTestUser';
    const testQuiz = {
        id: 'direct-test',
        title: 'Direct Test Quiz',
        userName: testUser,
        user_name: testUser
    };

    // Set user
    window.exploreQuizManager.currentUserName = testUser;
    localStorage.setItem('userName', testUser);

    // Test permission
    const canEdit = window.exploreQuizManager.checkQuizPermission(testQuiz, 'edit');
    const canDelete = window.exploreQuizManager.checkQuizPermission(testQuiz, 'delete');

    console.log('📊 Kết quả test permission:');
    console.log('   - Current user:', testUser);
    console.log('   - Quiz owner:', testQuiz.userName);
    console.log('   - Can edit:', canEdit ? '✅' : '❌');
    console.log('   - Can delete:', canDelete ? '✅' : '❌');

    // Test generate buttons
    const buttons = window.exploreQuizManager.generateQuizActionButtons(testQuiz);
    console.log('🔧 Generated buttons HTML:');
    console.log(buttons);

    return { canEdit, canDelete, buttons };
}

// Export functions
window.forceTest = {
    run: runForceTest,
    testDirect: testPermissionDirect,
    setup: forceSetupEnvironment,
    addButtons: forceAddButtons
};

// Chạy test ngay lập tức
console.log('🎯 Sẵn sàng chạy test!');
console.log('💡 Chạy: runForceTest() hoặc forceTest.run()');
console.log('💡 Test trực tiếp: testPermissionDirect() hoặc forceTest.testDirect()');

// Auto run nếu có exploreQuizManager
if (window.exploreQuizManager) {
    console.log('🚀 Auto-running force test...');
    runForceTest();
} else {
    console.log('⚠️ exploreQuizManager chưa sẵn sàng. Chạy thủ công: runForceTest()');
}