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
            let isSharing = false; // Prevent multiple calls

            window.exploreQuizManager.confirmShareQuiz = async function () {
                if (isSharing) {
                    console.log('⚠️ Already sharing, ignoring duplicate call');
                    return;
                }

                isSharing = true;
                console.log('🔄 [PATCHED] Sharing to Supabase...');

                // Get form elements first (declare early to avoid reference errors)
                const userNameEl = document.getElementById('share-user-name');
                const titleEl = document.getElementById('share-quiz-title');
                const descriptionEl = document.getElementById('share-quiz-description');
                const categoryEl = document.getElementById('share-quiz-category');

                // Get quiz info
                if (!this.currentSharingQuizId) {
                    console.log('❌ No currentSharingQuizId');
                    window.quizManager && window.quizManager.showToast('Lỗi: Không tìm thấy quiz!', 'error');
                    isSharing = false; // Reset flag
                    return;
                }

                const quiz = window.quizManager && window.quizManager.quizzes.find(q => q.id === this.currentSharingQuizId);
                if (!quiz) {
                    console.log('❌ Quiz not found in quizManager.quizzes');
                    console.log('🔍 currentSharingQuizId:', this.currentSharingQuizId);
                    console.log('🔍 quizManager exists:', !!window.quizManager);
                    console.log('🔍 quizManager.quizzes:', window.quizManager?.quizzes);
                    console.log('🔍 Available quiz IDs:', window.quizManager?.quizzes?.map(q => q.id));

                    // Try to get quiz from localStorage directly
                    try {
                        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
                        console.log('🔍 Stored quizzes in localStorage:', storedQuizzes.length);
                        const quizFromStorage = storedQuizzes.find(q => q.id === this.currentSharingQuizId);

                        if (quizFromStorage) {
                            console.log('✅ Found quiz in localStorage!');
                            // Use quiz from localStorage
                            const userName = userNameEl?.value.trim() || '';
                            const title = titleEl?.value.trim() || quizFromStorage.title;
                            const description = descriptionEl?.value.trim() || quizFromStorage.description || 'Không có mô tả';
                            const category = categoryEl?.value || 'general';

                            if (!userName) {
                                window.quizManager && window.quizManager.showToast('Vui lòng nhập tên của bạn!', 'warning');
                                userNameEl?.focus();
                                isSharing = false;
                                return;
                            }

                            // Save user name
                            this.currentUserName = userName;
                            localStorage.setItem('userName', userName);

                            const sharedQuiz = {
                                ...quizFromStorage,
                                title: title,
                                description: description,
                                category: category
                            };

                            // Continue with sharing process
                            if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                                console.log('✅ Sharing quiz from localStorage to Supabase...');
                                window.quizManager && window.quizManager.showToast('☁️ Đang chia sẻ lên Supabase...', 'info');

                                try {
                                    const result = await window.supabaseQuizManager.shareQuiz(sharedQuiz, userName);

                                    if (result.success) {
                                        console.log('✅ Shared successfully!');
                                        window.quizManager && window.quizManager.showToast('✨ Đã chia sẻ lên Supabase thành công!', 'success');
                                        this.closeShareModal && this.closeShareModal();
                                        this.switchToExploreTab && this.switchToExploreTab();
                                        await this.loadSharedQuizzes();
                                        isSharing = false;
                                        return;
                                    }
                                } catch (error) {
                                    console.error('❌ Error sharing:', error);
                                    window.quizManager && window.quizManager.showToast('❌ Lỗi: ' + error.message, 'error');
                                }
                            }

                            isSharing = false;
                            return;
                        }
                    } catch (storageError) {
                        console.error('❌ Error reading from localStorage:', storageError);
                    }

                    window.quizManager && window.quizManager.showToast('Không tìm thấy quiz!', 'error');
                    isSharing = false; // Reset flag
                    return;
                }

                // Get form data with fallbacks
                const userNameEl = document.getElementById('share-user-name');
                const titleEl = document.getElementById('share-quiz-title');
                const descriptionEl = document.getElementById('share-quiz-description');
                const categoryEl = document.getElementById('share-quiz-category');

                const userName = userNameEl?.value.trim() || 'Anonymous';
                const title = titleEl?.value.trim() || quiz.title;
                const description = descriptionEl?.value.trim() || quiz.description || 'Không có mô tả';
                const category = categoryEl?.value || 'general';

                console.log('📝 Form data:', { userName, title, description, category });

                if (!userName || userName === 'Anonymous') {
                    window.quizManager && window.quizManager.showToast('Vui lòng nhập tên của bạn!', 'warning');
                    userNameEl?.focus();
                    isSharing = false; // Reset flag
                    return;
                }

                if (!title) {
                    window.quizManager && window.quizManager.showToast('Vui lòng nhập tên đề thi!', 'warning');
                    titleEl?.focus();
                    isSharing = false; // Reset flag
                    return;
                }

                // Save user name
                this.currentUserName = userName;
                localStorage.setItem('userName', userName);

                const sharedQuiz = {
                    ...quiz,
                    title: title,
                    description: description,
                    category: category
                };

                // FORCE use Supabase
                if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                    console.log('✅ Sharing to Supabase...');

                    // Test connection first
                    console.log('🔍 Testing Supabase connection...');
                    const connectionTest = await window.supabaseQuizManager.testConnection();
                    console.log('🔍 Connection test result:', connectionTest);

                    if (!connectionTest.success) {
                        console.error('❌ Connection test failed:', connectionTest.error);
                        window.quizManager && window.quizManager.showToast('❌ Lỗi kết nối Supabase: ' + connectionTest.error, 'error');
                        return;
                    }

                    console.log('📝 Quiz data:', {
                        title: sharedQuiz.title,
                        description: sharedQuiz.description,
                        questionsCount: sharedQuiz.questions?.length,
                        userName: userName,
                        category: sharedQuiz.category
                    });

                    window.quizManager && window.quizManager.showToast('☁️ Đang chia sẻ lên Supabase...', 'info');

                    try {
                        const result = await window.supabaseQuizManager.shareQuiz(sharedQuiz, userName);

                        if (result.success) {
                            console.log('✅ Shared successfully!');

                            window.quizManager && window.quizManager.showToast('✨ Đã chia sẻ lên Supabase thành công!', 'success');

                            // Close modal and reset state
                            this.closeShareModal && this.closeShareModal();
                            this.switchToExploreTab && this.switchToExploreTab();
                            await this.loadSharedQuizzes();

                            isSharing = false; // Reset flag
                            return;
                        } else {
                            console.log('❌ Share failed: result.success = false');
                            window.quizManager && window.quizManager.showToast('❌ Chia sẻ thất bại', 'error');
                        }
                    } catch (error) {
                        console.error('❌ Error sharing to Supabase:', error);

                        // Show detailed error message
                        let errorMessage = 'Lỗi chia sẻ: ';
                        if (error.message) {
                            errorMessage += error.message;
                        } else if (error.details) {
                            errorMessage += error.details;
                        } else {
                            errorMessage += 'Không xác định';
                        }

                        window.quizManager && window.quizManager.showToast('❌ ' + errorMessage, 'error');

                        // Try fallback to original method
                        console.log('🔄 Trying fallback method...');
                        try {
                            return await originalShare.call(this);
                        } catch (fallbackError) {
                            console.error('❌ Fallback also failed:', fallbackError);
                            window.quizManager && window.quizManager.showToast('❌ Không thể chia sẻ đề thi', 'error');
                        }
                        isSharing = false; // Reset flag
                        return;
                    }
                }

                // Fallback - should not reach here if Supabase is available
                console.log('⚠️ Supabase not available, falling back to original confirmShareQuiz');
                try {
                    const result = await originalShare.call(this);
                    isSharing = false; // Reset flag
                    return result;
                } catch (error) {
                    console.error('❌ Original share also failed:', error);
                    window.quizManager && window.quizManager.showToast('❌ Không thể chia sẻ đề thi', 'error');
                    isSharing = false; // Reset flag
                    return;
                }
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
