// ============================================================================
// BẢN VÁ KHẨN CẤP V2 - FORCE LOAD TỪ SUPABASE
// Thêm file này vào index.html NGAY SAU explore-quiz.js
// ============================================================================

(function () {
    console.log('🔧 Force Supabase Fix V2 Loading...');

    let retryCount = 0;
    const maxRetries = 10;

    function applyFix() {
        retryCount++;

        console.log(`🔧 Attempt ${retryCount}/${maxRetries} - Applying Force Supabase Fix...`);

        // 1. Kiểm tra Supabase
        if (!window.supabaseQuizManager) {
            console.warn(`⚠️ supabaseQuizManager not found (attempt ${retryCount})`);
            if (retryCount < maxRetries) {
                setTimeout(applyFix, 1000);
            }
            return;
        }

        if (!window.supabaseQuizManager.isAvailable()) {
            console.warn(`⚠️ Supabase not available (attempt ${retryCount})`);
            if (retryCount < maxRetries) {
                setTimeout(applyFix, 1000);
            }
            return;
        }

        console.log('✅ Supabase is available');

        // 2. Kiểm tra Explore Manager
        if (!window.exploreQuizManager) {
            console.warn(`⚠️ exploreQuizManager not found (attempt ${retryCount})`);
            if (retryCount < maxRetries) {
                setTimeout(applyFix, 1000);
            }
            return;
        }

        console.log('✅ Explore Manager found');

        // 3. FORCE SET Supabase available
        window.exploreQuizManager.isSupabaseAvailable = true;
        console.log('✅ Force set isSupabaseAvailable = true');

        // 4. XÓA dữ liệu offline cũ
        try {
            localStorage.removeItem('offlineSharedQuizzes');
            console.log('✅ Cleared offline quizzes');
        } catch (e) {
            console.warn('⚠️ Could not clear offline quizzes:', e);
        }

        // 5. Patch loadSharedQuizzes
        if (window.exploreQuizManager.loadSharedQuizzes) {
            const original = window.exploreQuizManager.loadSharedQuizzes.bind(window.exploreQuizManager);

            window.exploreQuizManager.loadSharedQuizzes = async function () {
                console.log('🔄 [PATCHED] Loading from Supabase...');

                // ALWAYS check Supabase first
                if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                    this.isSupabaseAvailable = true;

                    try {
                        this.showLoading && this.showLoading(true);

                        const result = await window.supabaseQuizManager.getAllQuizzes(100);

                        if (result.success) {
                            this.sharedQuizzes = result.quizzes;
                            this.renderSharedQuizzes && this.renderSharedQuizzes(this.sharedQuizzes);

                            console.log(`✅ Loaded ${result.quizzes.length} quizzes from Supabase`);

                            if (window.quizManager && window.quizManager.showToast) {
                                window.quizManager.showToast(`☁️ Đã tải ${result.quizzes.length} quiz từ Supabase`, 'success');
                            }

                            this.showLoading && this.showLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.error('❌ Error loading from Supabase:', error);
                        this.showLoading && this.showLoading(false);
                    }
                }

                // Fallback to original
                console.log('⚠️ Falling back to original loadSharedQuizzes');
                return original();
            };

            console.log('✅ Patched loadSharedQuizzes');
        }

        // 6. Patch confirmShareQuiz
        if (window.exploreQuizManager.confirmShareQuiz) {
            const originalShare = window.exploreQuizManager.confirmShareQuiz.bind(window.exploreQuizManager);

            window.exploreQuizManager.confirmShareQuiz = async function () {
                console.log('🔄 [PATCHED] Sharing to Supabase...');

                // Get quiz info
                if (!this.currentSharingQuizId) {
                    window.quizManager && window.quizManager.showToast('Lỗi: Không tìm thấy quiz!', 'error');
                    return;
                }

                const quiz = window.quizManager && window.quizManager.quizzes.find(q => q.id === this.currentSharingQuizId);
                if (!quiz) {
                    window.quizManager && window.quizManager.showToast('Không tìm thấy quiz!', 'error');
                    return;
                }

                const userName = document.getElementById('share-user-name')?.value.trim();
                const title = document.getElementById('share-quiz-title')?.value.trim();
                const description = document.getElementById('share-quiz-description')?.value.trim();

                if (!userName || !title) {
                    window.quizManager && window.quizManager.showToast('Vui lòng nhập đầy đủ thông tin!', 'warning');
                    return;
                }

                // Save user name
                this.currentUserName = userName;
                localStorage.setItem('userName', userName);

                const sharedQuiz = {
                    ...quiz,
                    title: title,
                    description: description || 'Không có mô tả'
                };

                // FORCE use Supabase
                if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                    console.log('✅ Sharing to Supabase...');

                    window.quizManager && window.quizManager.showToast('☁️ Đang chia sẻ lên Supabase...', 'info');

                    try {
                        const result = await window.supabaseQuizManager.shareQuiz(sharedQuiz, userName);

                        if (result.success) {
                            console.log('✅ Shared successfully!');

                            window.quizManager && window.quizManager.showToast('✨ Đã chia sẻ lên Supabase thành công!', 'success');

                            this.closeShareModal && this.closeShareModal();
                            this.switchToExploreTab && this.switchToExploreTab();
                            await this.loadSharedQuizzes();
                            return;
                        }
                    } catch (error) {
                        console.error('❌ Error sharing:', error);
                        window.quizManager && window.quizManager.showToast('❌ Lỗi: ' + error.message, 'error');
                        return;
                    }
                }

                // Fallback
                console.log('⚠️ Falling back to original confirmShareQuiz');
                return originalShare();
            };

            console.log('✅ Patched confirmShareQuiz');
        }

        // 7. Auto reload if on Explore tab
        setTimeout(() => {
            const exploreTab = document.querySelector('[data-tab="explore"]');
            if (exploreTab && exploreTab.classList.contains('active')) {
                console.log('🔄 On Explore tab, reloading...');
                window.exploreQuizManager.loadSharedQuizzes();
            }
        }, 500);

        console.log('✅✅✅ Force Supabase Fix V2 Applied Successfully! ✅✅✅');
        console.log('📊 Status:');
        console.log('   - Supabase:', window.supabaseQuizManager.isAvailable() ? '✅ Ready' : '❌ Not ready');
        console.log('   - Explore knows Supabase:', window.exploreQuizManager.isSupabaseAvailable ? '✅ Yes' : '❌ No');
    }

    // Start applying fix after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyFix, 1000);
        });
    } else {
        setTimeout(applyFix, 1000);
    }
})();
