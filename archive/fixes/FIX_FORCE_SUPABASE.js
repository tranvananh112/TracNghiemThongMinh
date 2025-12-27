// ============================================================================
// BẢN VÁ KHẨN CẤP - FORCE LOAD TỪ SUPABASE
// Thêm file này vào index.html NGAY SAU explore-quiz.js
// ============================================================================

(function () {
    console.log('🔧 Loading Force Supabase Fix...');

    // Đợi DOM và tất cả scripts load xong
    window.addEventListener('load', function () {
        setTimeout(function () {
            console.log('🔧 Applying Force Supabase Fix...');

            // 1. Kiểm tra Supabase có sẵn sàng không
            if (!window.supabaseQuizManager) {
                console.error('❌ supabaseQuizManager not found!');
                return;
            }

            if (!window.supabaseQuizManager.isAvailable()) {
                console.error('❌ Supabase not available!');
                return;
            }

            console.log('✅ Supabase is available');

            // 2. Kiểm tra Explore Manager
            if (!window.exploreQuizManager) {
                console.error('❌ exploreQuizManager not found!');
                return;
            }

            console.log('✅ Explore Manager found');

            // 3. FORCE SET Supabase available
            window.exploreQuizManager.isSupabaseAvailable = true;
            console.log('✅ Force set isSupabaseAvailable = true');

            // 4. XÓA dữ liệu offline cũ (để không bị conflict)
            localStorage.removeItem('offlineSharedQuizzes');
            console.log('✅ Cleared offline quizzes');

            // 5. Override hàm loadSharedQuizzes để LUÔN LUÔN dùng Supabase
            const originalLoadSharedQuizzes = window.exploreQuizManager.loadSharedQuizzes;

            window.exploreQuizManager.loadSharedQuizzes = async function () {
                console.log('🔄 Force loading from Supabase...');

                try {
                    this.showLoading(true);

                    // FORCE check Supabase
                    const supabaseReady = window.supabaseQuizManager && window.supabaseQuizManager.isAvailable();

                    if (!supabaseReady) {
                        console.error('❌ Supabase not ready!');
                        return originalLoadSharedQuizzes.call(this);
                    }

                    console.log('✅ Loading from Supabase...');

                    // Load từ Supabase
                    const result = await window.supabaseQuizManager.getAllQuizzes(50);

                    if (result.success) {
                        this.sharedQuizzes = result.quizzes;
                        this.renderSharedQuizzes(this.sharedQuizzes);

                        console.log(`✅ Loaded ${result.quizzes.length} quizzes from Supabase`);

                        if (window.quizManager && window.quizManager.showToast) {
                            window.quizManager.showToast(`☁️ Đã tải ${result.quizzes.length} quiz từ Supabase`, 'success');
                        }

                        return;
                    } else {
                        console.error('❌ Failed to load from Supabase');
                    }
                } catch (error) {
                    console.error('❌ Error loading from Supabase:', error);
                } finally {
                    this.showLoading(false);
                }

                // Fallback to original
                return originalLoadSharedQuizzes.call(this);
            };

            console.log('✅ Override loadSharedQuizzes complete');

            // 6. Override hàm confirmShareQuiz để LUÔN LUÔN dùng Supabase
            const originalConfirmShareQuiz = window.exploreQuizManager.confirmShareQuiz;

            window.exploreQuizManager.confirmShareQuiz = async function () {
                console.log('🔄 Force sharing to Supabase...');

                if (!this.currentSharingQuizId) {
                    if (window.quizManager) {
                        window.quizManager.showToast('Lỗi: Không tìm thấy quiz!', 'error');
                    }
                    return;
                }

                const quiz = window.quizManager.quizzes.find(q => q.id === this.currentSharingQuizId);
                if (!quiz) {
                    if (window.quizManager) {
                        window.quizManager.showToast('Không tìm thấy quiz!', 'error');
                    }
                    return;
                }

                // Lấy thông tin từ form
                const userName = document.getElementById('share-user-name').value.trim();
                const title = document.getElementById('share-quiz-title').value.trim();
                const description = document.getElementById('share-quiz-description').value.trim();

                // Validate
                if (!userName) {
                    if (window.quizManager) {
                        window.quizManager.showToast('Vui lòng nhập tên của bạn!', 'warning');
                    }
                    document.getElementById('share-user-name').focus();
                    return;
                }

                if (!title) {
                    if (window.quizManager) {
                        window.quizManager.showToast('Vui lòng nhập tên đề thi!', 'warning');
                    }
                    document.getElementById('share-quiz-title').focus();
                    return;
                }

                // Lưu tên người dùng
                this.currentUserName = userName;
                localStorage.setItem('userName', userName);

                // Tạo quiz mới
                const sharedQuiz = {
                    ...quiz,
                    title: title,
                    description: description || 'Không có mô tả'
                };

                // FORCE check Supabase
                const supabaseReady = window.supabaseQuizManager && window.supabaseQuizManager.isAvailable();

                if (!supabaseReady) {
                    console.error('❌ Supabase not ready for sharing!');
                    if (window.quizManager) {
                        window.quizManager.showToast('❌ Supabase không sẵn sàng!', 'error');
                    }
                    return;
                }

                console.log('✅ Sharing to Supabase...');

                if (window.quizManager) {
                    window.quizManager.showToast('☁️ Đang chia sẻ lên Supabase...', 'info');
                }

                try {
                    const result = await window.supabaseQuizManager.shareQuiz(sharedQuiz, userName);

                    if (result.success) {
                        console.log('✅ Shared to Supabase successfully!');

                        if (window.quizManager) {
                            window.quizManager.showToast('✨ Đã chia sẻ lên Supabase thành công!', 'success');
                        }

                        this.closeShareModal();
                        this.switchToExploreTab();
                        await this.loadSharedQuizzes();
                        return;
                    } else {
                        console.error('❌ Failed to share to Supabase');
                        if (window.quizManager) {
                            window.quizManager.showToast('❌ Lỗi khi chia sẻ lên Supabase', 'error');
                        }
                    }
                } catch (error) {
                    console.error('❌ Error sharing to Supabase:', error);
                    if (window.quizManager) {
                        window.quizManager.showToast('❌ Lỗi: ' + error.message, 'error');
                    }
                }
            };

            console.log('✅ Override confirmShareQuiz complete');

            // 7. Nếu đang ở tab Khám Phá, reload ngay
            const exploreTab = document.querySelector('[data-tab="explore"]');
            if (exploreTab && exploreTab.classList.contains('active')) {
                console.log('🔄 Currently on Explore tab, reloading...');
                window.exploreQuizManager.loadSharedQuizzes();
            }

            console.log('✅ Force Supabase Fix Applied Successfully!');
            console.log('📊 Current state:');
            console.log('   - Supabase available:', window.supabaseQuizManager.isAvailable());
            console.log('   - Explore knows Supabase:', window.exploreQuizManager.isSupabaseAvailable);

        }, 2000); // Đợi 2 giây để tất cả scripts load xong
    });
})();
