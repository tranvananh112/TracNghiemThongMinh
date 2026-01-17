class QuizManager {
    constructor() {
        this.quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        this.currentQuiz = null;
        this.currentAnswers = {};
        this.currentResults = null;
        this.aiGeneratedQuiz = null;

        this.initializeTheme();
        this.initializeEventListeners();
        this.migrateOldQuizzes(); // Migrate quiz cũ
        this.loadQuizList();
        this.loadHomeQuizGrid(); // Thêm load home quiz grid
        this.updateQuizSelector();

        // Initialize AI Generator after DOM is ready
        setTimeout(() => {
            this.loadAISettings();
        }, 100);
    }

    migrateOldQuizzes() {
        // Migrate quiz cũ không có description hoặc có description = "Không có mô tả"
        let needSave = false;
        this.quizzes.forEach(quiz => {
            if (!quiz.description || quiz.description === 'Không có mô tả') {
                quiz.description = ''; // Set thành empty string thay vì "Không có mô tả"
                needSave = true;
            }
        });

        if (needSave) {
            this.saveQuizzes();
            console.log('✅ Migrated old quizzes descriptions');
        }
    }

    // Debug function - có thể xóa sau
    debugQuizzes() {
        console.log('📊 Current quizzes:', this.quizzes.map(q => ({
            title: q.title,
            description: q.description,
            hasDescription: !!q.description && q.description.trim() !== ''
        })));
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.querySelector('#theme-toggle i').classList.replace('fa-moon', 'fa-sun');
        }
    }

    // toggleTheme method removed - now handled by ThemeToggleManager

    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type]}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    initializeEventListeners() {
        // Theme toggle - Updated to use new theme toggle or skip if not found
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            console.log('⚠️ Old theme toggle found but method removed. Use ThemeToggleManager instead.');
        } else {
            console.log('✅ Theme toggle handled by ThemeToggleManager');
        }

        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Quiz creation
        document.getElementById('process-quiz').addEventListener('click', () => {
            this.processQuiz();
        });

        document.getElementById('clear-input').addEventListener('click', () => {
            this.clearInputs();
        });

        // Quiz management
        document.getElementById('start-quiz').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('quiz-selector').addEventListener('change', (e) => {
            document.getElementById('start-quiz').disabled = !e.target.value;
        });

        // Shuffle checkbox - ensure it's always clickable
        const shuffleCheckbox = document.getElementById('shuffle-questions');
        if (shuffleCheckbox) {
            shuffleCheckbox.addEventListener('change', (e) => {
                console.debug('shuffle-questions changed:', e.target.checked);
                if (e.target.checked) {
                    this.showToast('🔀 Xáo trộn câu hỏi: Bật', 'info');
                } else {
                    this.showToast('Xáo trộn câu hỏi: Tắt', 'info');
                }
            });
        }

        // Modal handlers
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeEditModal();
            }
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('save-edit').addEventListener('click', () => {
            this.saveQuizEdit();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeEditModal();
        });
    }

    async pasteFromClipboard(targetId) {
        try {
            const text = await navigator.clipboard.readText();
            const textarea = document.getElementById(targetId);

            if (!text) {
                this.showToast('⚠️ Clipboard trống!', 'warning');
                return;
            }

            // If textarea already has content, append with newline
            if (textarea.value.trim()) {
                textarea.value += '\n' + text;
            } else {
                textarea.value = text;
            }

            // Focus and scroll to bottom
            textarea.focus();
            textarea.scrollTop = textarea.scrollHeight;

            this.showToast('📋 Đã dán nội dung thành công!', 'success');
        } catch (error) {
            this.showToast('❌ Không thể truy cập clipboard. Vui lòng dán thủ công (Ctrl+V)', 'error');
            console.error('Clipboard error:', error);
        }
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Refresh data when switching tabs
        if (tabName === 'manage') {
            this.loadQuizList();
        } else if (tabName === 'quiz') {
            this.updateQuizSelector();
        } else if (tabName === 'home') {
            this.loadHomeQuizGrid();
        }
    }

    processQuiz() {
        const title = document.getElementById('quiz-title').value.trim();
        const description = document.getElementById('quiz-description').value.trim();
        const questionsText = document.getElementById('questions-input').value.trim();
        const answersText = document.getElementById('answers-input').value.trim();

        if (!title) {
            this.showToast('Vui lòng nhập t��n bài quiz!', 'error');
            return;
        }

        if (!questionsText || !answersText) {
            this.showToast('Vui lòng nhập đầy đủ câu hỏi và đáp án!', 'error');
            return;
        }

        try {
            const questions = this.parseQuestions(questionsText);
            const answers = this.parseAnswers(answersText, questions.length);

            if (questions.length !== answers.length) {
                this.showToast(`Số lượng câu hỏi (${questions.length}) và đáp án (${answers.length}) không khớp!`, 'error');
                return;
            }

            // Combine questions with answers
            const quiz = {
                id: Date.now().toString(),
                title: title,
                description: description, // Không set default ở đây
                questions: questions.map((q, index) => ({
                    ...q,
                    correctAnswer: answers[index]
                })),
                createdAt: new Date().toISOString(),
                totalQuestions: questions.length
            };

            // Save quiz
            this.quizzes.push(quiz);
            this.saveQuizzes();
            this.loadHomeQuizGrid(); // Cập nhật home tab

            this.showToast(`✨ Tạo bài quiz "${title}" thành công với ${questions.length} câu hỏi!`, 'success');
            this.clearInputs();
            this.switchTab('manage');

        } catch (error) {
            this.showToast('❌ Lỗi xử lý dữ liệu: ' + error.message, 'error');
        }
    }

    parseQuestions(text) {
        // Sử dụng Smart Parser
        const parser = new SmartQuestionParser();
        const parsedQuestions = parser.parseQuestions(text);

        // Chuyển đổi sang format cũ để tương thích
        return parsedQuestions.map(q => ({
            question: q.question,
            options: q.options
        }));
    }

    parseAnswers(text, expectedCount) {
        // Sử dụng Smart Parser
        const parser = new SmartQuestionParser();
        return parser.parseAnswers(text, expectedCount);
    }

    saveQuizzes() {
        localStorage.setItem('quizzes', JSON.stringify(this.quizzes));
    }

    clearInputs() {
        document.getElementById('quiz-title').value = '';
        document.getElementById('quiz-description').value = '';
        document.getElementById('questions-input').value = '';
        document.getElementById('answers-input').value = '';
    }

    loadQuizList() {
        const quizList = document.getElementById('quiz-list');

        if (this.quizzes.length === 0) {
            quizList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>Chưa có quiz nào</h3>
                    <p>Hãy tạo quiz đầu tiên của bạn!</p>
                </div>
            `;
            return;
        }

        const quizHTML = this.quizzes.map(quiz => `
            <div class="quiz-item">
                <div class="quiz-item-header">
                    <div class="quiz-item-info">
                        <h3>${quiz.title}</h3>
                        <p>${quiz.description && quiz.description.trim() ? quiz.description : 'Không có mô tả'}</p>
                        <div class="quiz-item-meta">
                            <span><i class="fas fa-question-circle"></i> ${quiz.totalQuestions} câu</span>
                            <span><i class="fas fa-calendar"></i> ${new Date(quiz.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    <div class="quiz-item-actions">
                        <button class="btn btn-sm btn-primary" onclick="quizManager.editQuiz('${quiz.id}')">
                            <i class="fas fa-edit"></i>
                            Sửa
                        </button>
                        <button class="btn btn-sm btn-share-quiz" onclick="exploreQuizManager.shareQuiz('${quiz.id}')">
                            <i class="fas fa-share-alt"></i>
                            Chia sẻ
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="quizManager.duplicateQuiz('${quiz.id}')">
                            <i class="fas fa-copy"></i>
                            Sao chép
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="quizManager.deleteQuiz('${quiz.id}')">
                            <i class="fas fa-trash"></i>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        quizList.innerHTML = quizHTML;
    }

    loadHomeQuizGrid() {
        const homeQuizGrid = document.getElementById('home-quiz-grid');
        if (!homeQuizGrid) {
            console.warn('❌ Không tìm thấy home-quiz-grid element');
            return;
        }

        console.log('🏠 Loading home quiz grid...', this.quizzes.length, 'quizzes');

        if (this.quizzes.length === 0) {
            homeQuizGrid.innerHTML = `
                <div class="empty-state-card">
                    <i class="fas fa-folder-open"></i>
                    <h3>Chưa có quiz nào</h3>
                    <p>Hãy tạo quiz đầu tiên của bạn!</p>
                    <button class="btn-primary" data-tab="input">
                        <i class="fas fa-plus"></i>
                        Tạo quiz mới
                    </button>
                </div>
            `;
            return;
        }

        // Hiển thị carousel luôn, nếu không có quiz thì hiển thị empty state đẹp
        if (this.quizzes.length > 0) {
            this.loadQuizCarousel();
        } else {
            homeQuizGrid.innerHTML = `
                <div class="empty-state-card">
                    <i class="fas fa-folder-open"></i>
                    <h3>Chưa có quiz nào</h3>
                    <p>Hãy tạo quiz đầu tiên của bạn để thấy hiệu ứng lướt đẹp!</p>
                    <button class="btn-primary" data-tab="input">
                        <i class="fas fa-plus"></i>
                        Tạo quiz mới
                    </button>
                </div>
            `;
        }

        // Load shared quiz carousel
        this.loadSharedQuizCarousel();
    }

    loadQuizCarousel() {
        const homeQuizGrid = document.getElementById('home-quiz-grid');
        const recentQuizzes = this.quizzes.slice(-6).reverse();
        console.log('🎠 Loading quiz carousel with', recentQuizzes.length, 'quizzes');
        console.log('📋 Quiz data:', recentQuizzes);

        // Mảng hình ảnh đẹp cho quiz cards
        const quizBackgrounds = [
            'https://images.unsplash.com/photo-1758314896569-b3639ee707c4?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1671649240322-2124cd07eaae?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1673029925648-af80569efc46?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1666533099824-abd0ed813f2a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1671105035554-7f8c2a587201?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://plus.unsplash.com/premium_photo-1686750875748-d00684d36b1e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ];

        // Clear existing content
        homeQuizGrid.innerHTML = '';

        // Create loop-images container
        const loopImages = document.createElement('div');
        loopImages.className = 'loop-images';
        loopImages.style.cssText = 'display: flex !important; align-items: center !important; justify-content: center !important; flex-direction: column !important; position: relative !important; min-height: 400px !important; width: 100% !important; overflow: hidden !important; padding: 40px 0 !important;';

        // Create carousel track
        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'carousel-track';
        carouselTrack.style.cssText = 'min-width: calc(10rem * ' + recentQuizzes.length + '); height: 30rem; position: relative !important;';

        // Create carousel items
        recentQuizzes.forEach((quiz, index) => {
            const description = quiz.description && quiz.description.trim() ? quiz.description : 'Không có mô tả';
            const createdDate = new Date(quiz.createdAt).toLocaleDateString('vi-VN');
            const backgroundImage = quizBackgrounds[index % quizBackgrounds.length];

            // Create carousel item
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            carouselItem.setAttribute('data-quiz-id', quiz.id);
            carouselItem.style.cssText = `
                position: absolute !important; 
                width: 30rem !important; 
                height: 30rem !important; 
                left: 100% !important; 
                display: flex !important; 
                justify-content: center !important; 
                perspective: 1000px !important; 
                transform-style: preserve-3d !important; 
                animation: scroll-left-anim 60s linear infinite !important; 
                animation-delay: ${60 / recentQuizzes.length * index - 60}s !important; 
                will-change: left !important; 
                transition: 0.5s ease-in-out !important; 
                cursor: pointer !important;
            `;

            // Create quiz card
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.style.cssText = `
                width: 100% !important; 
                height: 100% !important; 
                background-image: url('${backgroundImage}'); 
                background-size: cover !important; 
                background-position: center !important; 
                background-repeat: no-repeat !important; 
                transform: rotateY(-45deg) !important; 
                transition: 0.5s ease-in-out !important; 
                border-radius: 20px !important; 
                overflow: hidden !important; 
                border: 2px solid #e1e5f2 !important; 
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important; 
                backdrop-filter: blur(10px) !important; 
                display: flex !important; 
                flex-direction: column !important; 
                position: relative !important;
            `;

            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%); z-index: 1;';

            // Create header
            const header = document.createElement('div');
            header.className = 'quiz-card-header';
            header.style.cssText = 'position: relative !important; padding: 24px !important; background: transparent !important; border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important; flex: 1 !important; display: flex !important; flex-direction: column !important; z-index: 2 !important;';

            const title = document.createElement('div');
            title.className = 'quiz-card-title';
            title.style.cssText = 'font-size: 18px !important; font-weight: 700 !important; margin-bottom: 10px !important; color: white !important; line-height: 1.4 !important; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;';
            title.textContent = quiz.title;

            const desc = document.createElement('div');
            desc.className = 'quiz-card-description';
            desc.style.cssText = 'font-size: 14px !important; color: rgba(255, 255, 255, 0.9) !important; margin-bottom: 16px !important; line-height: 1.5 !important; flex: 1 !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;';
            desc.textContent = description;

            const meta = document.createElement('div');
            meta.className = 'quiz-card-meta';
            meta.style.cssText = 'display: flex !important; gap: 12px !important; font-size: 12px !important; color: rgba(255, 255, 255, 0.8) !important; flex-wrap: wrap !important;';
            meta.innerHTML = `
                <span style="display: flex !important; align-items: center !important; gap: 6px !important; padding: 6px 12px !important; background: rgba(255, 255, 255, 0.2) !important; border-radius: 15px !important; border: 1px solid rgba(255, 255, 255, 0.3) !important; font-weight: 500 !important; backdrop-filter: blur(10px) !important;"><i class="fas fa-question-circle" style="color: rgba(255, 255, 255, 0.9) !important; font-size: 11px !important;"></i> ${quiz.totalQuestions} câu</span>
                <span style="display: flex !important; align-items: center !important; gap: 6px !important; padding: 6px 12px !important; background: rgba(255, 255, 255, 0.2) !important; border-radius: 15px !important; border: 1px solid rgba(255, 255, 255, 0.3) !important; font-weight: 500 !important; backdrop-filter: blur(10px) !important;"><i class="fas fa-calendar" style="color: rgba(255, 255, 255, 0.9) !important; font-size: 11px !important;"></i> ${createdDate}</span>
            `;

            // Create actions
            const actions = document.createElement('div');
            actions.className = 'quiz-card-actions';
            actions.style.cssText = 'padding: 20px !important; background: transparent !important; backdrop-filter: blur(10px) !important; z-index: 2 !important; position: relative !important;';

            const button = document.createElement('button');
            button.className = 'quiz-start-btn';
            button.setAttribute('data-quiz-id', quiz.id);
            button.style.cssText = 'width: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; padding: 14px 20px !important; background: rgba(255, 255, 255, 0.9) !important; color: #333 !important; border: none !important; border-radius: 12px !important; font-size: 14px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.3s ease !important; backdrop-filter: blur(10px) !important; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;';
            button.innerHTML = '<i class="fas fa-play"></i> Vào ôn thi';

            // Assemble elements
            header.appendChild(title);
            header.appendChild(desc);
            header.appendChild(meta);
            actions.appendChild(button);
            quizCard.appendChild(overlay);
            quizCard.appendChild(header);
            quizCard.appendChild(actions);
            carouselItem.appendChild(quizCard);
            carouselTrack.appendChild(carouselItem);
        });

        // Create scroll down text
        const scrollDown = document.createElement('span');
        scrollDown.className = 'scroll-down';
        scrollDown.style.cssText = 'position: absolute !important; bottom: 2rem !important; left: 0 !important; right: 0 !important; font-family: "Poppins", sans-serif !important; text-align: center !important; font-size: 14px !important; color: #666 !important; display: flex !important; flex-direction: column !important; align-items: center !important; text-decoration: none !important; opacity: 0.8 !important; font-weight: 500 !important;';
        scrollDown.innerHTML = 'Các bài quiz của bạn <span class="arrow" style="font-size: 18px !important; margin-top: 5px !important; animation: bounce-anim 2s infinite !important;">↓</span>';

        // Assemble carousel
        loopImages.appendChild(carouselTrack);
        loopImages.appendChild(scrollDown);
        homeQuizGrid.appendChild(loopImages);

        // Add CSS animations
        const animationCSS = document.createElement('style');
        animationCSS.innerHTML = `
            @keyframes scroll-left-anim {
                0% { left: 100%; }
                100% { left: -300rem; }
            }
            
            @keyframes bounce-anim {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .carousel-item:hover .quiz-card {
                transform: rotateY(0deg) translateY(-1rem) !important;
            }
            
            .carousel-item:hover .quiz-start-btn {
                transform: translateY(-2px) !important;
                background: white !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
            }
        `;
        document.head.appendChild(animationCSS);

        console.log('✅ Quiz carousel HTML inserted');
        console.log('📦 Carousel container:', homeQuizGrid);

        // Thêm event listeners
        this.attachCarouselEventListeners();

        // Debug: Kiểm tra xem carousel có được render không
        setTimeout(() => {
            const carouselItems = document.querySelectorAll('.carousel-item');
            console.log('🔍 Found carousel items:', carouselItems.length);
            if (carouselItems.length > 0) {
                console.log('✅ Carousel animation should be working');
            } else {
                console.log('❌ No carousel items found - check CSS/HTML');
            }
        }, 100);
    }

    loadQuizGrid() {
        const homeQuizGrid = document.getElementById('home-quiz-grid');
        const recentQuizzes = this.quizzes.slice(-6).reverse();
        console.log('📋 Loading quiz grid with', recentQuizzes.length, 'quizzes');

        const quizHTML = recentQuizzes.map(quiz => {
            const description = quiz.description && quiz.description.trim() ? quiz.description : 'Không có mô tả';
            const createdDate = new Date(quiz.createdAt).toLocaleDateString('vi-VN');

            return `
            <div class="quiz-card" data-quiz-id="${quiz.id}">
                <div class="quiz-card-header">
                    <div class="quiz-card-title">${quiz.title}</div>
                    <div class="quiz-card-description">${description}</div>
                    <div class="quiz-card-meta">
                        <span><i class="fas fa-question-circle"></i> ${quiz.totalQuestions} câu</span>
                        <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                    </div>
                </div>
                <div class="quiz-card-actions">
                    <button class="btn btn-primary quiz-start-btn" data-quiz-id="${quiz.id}">
                        <i class="fas fa-play"></i>
                        Làm bài
                    </button>
                    <button class="btn btn-secondary quiz-edit-btn" data-quiz-id="${quiz.id}">
                        <i class="fas fa-edit"></i>
                        Sửa
                    </button>
                    <button class="btn btn-share-quiz quiz-share-btn" data-quiz-id="${quiz.id}">
                        <i class="fas fa-share-alt"></i>
                        Chia sẻ
                    </button>
                </div>
            </div>
            `;
        }).join('');

        homeQuizGrid.innerHTML = quizHTML;
        console.log('✅ Home quiz grid loaded successfully');

        // Thêm event listeners cho các nút
        this.attachHomeQuizEventListeners();
    }

    attachCarouselEventListeners() {
        const carouselItems = document.querySelectorAll('.carousel-item');

        carouselItems.forEach(item => {
            const startBtn = item.querySelector('.quiz-start-btn');
            if (startBtn) {
                startBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const quizId = startBtn.getAttribute('data-quiz-id');
                    console.log('🎮 Starting quiz from carousel:', quizId);
                    this.startQuizById(quizId);
                });
            }
        });
    }

    async loadSharedQuizCarousel() {
        const sharedCarousel = document.getElementById('shared-quiz-carousel');
        if (!sharedCarousel) return;

        console.log('🌐 Loading shared quiz carousel...');

        try {
            // Lấy quiz đã chia sẻ từ exploreQuizManager nếu có
            if (window.exploreQuizManager && typeof window.exploreQuizManager.loadSharedQuizzes === 'function') {
                await window.exploreQuizManager.loadSharedQuizzes();

                // Lấy danh sách quiz đã chia sẻ
                const sharedQuizzes = window.exploreQuizManager.sharedQuizzes || [];

                if (sharedQuizzes.length >= 3) {
                    const recentShared = sharedQuizzes.slice(0, 6);

                    // Mảng hình ảnh đẹp cho shared quiz cards
                    const sharedBackgrounds = [
                        'https://plus.unsplash.com/premium_photo-1686844462591-393ceae12be0?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'https://plus.unsplash.com/premium_photo-1686839181367-febb561faa53?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'https://plus.unsplash.com/premium_photo-1671199850329-91cae34a6b6d?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'https://plus.unsplash.com/premium_photo-1685655611311-9f801b43b9fa?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'https://plus.unsplash.com/premium_photo-1675598468920-878ae1e46f14?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'https://images.unsplash.com/photo-1718036094878-ecdce2b1be95?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    ];

                    const carouselHTML = `
                        <div class="loop-images">
                            <div class="carousel-track" style="--time: 60s; --total: ${recentShared.length};">
                                ${recentShared.map((quiz, index) => {
                        const description = quiz.description || 'Không có mô tả';
                        const createdDate = quiz.created_at ? new Date(quiz.created_at).toLocaleDateString('vi-VN') : 'N/A';
                        const backgroundImage = sharedBackgrounds[index % sharedBackgrounds.length];

                        return `
                                        <div class="carousel-item" style="--i: ${index + 1};" data-quiz-id="${quiz.id}">
                                            <div class="quiz-card" style="background-image: url('${backgroundImage}');">
                                                <div class="quiz-card-header">
                                                    <div class="quiz-card-title">${quiz.title}</div>
                                                    <div class="quiz-card-description">${description}</div>
                                                    <div class="quiz-card-meta">
                                                        <span><i class="fas fa-user"></i> ${quiz.user_name || 'Ẩn danh'}</span>
                                                        <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                                                    </div>
                                                </div>
                                                <div class="quiz-card-actions">
                                                    <button class="quiz-start-btn shared-quiz-btn" data-quiz-id="${quiz.id}">
                                                        <i class="fas fa-play"></i>
                                                        Làm bài
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                    }).join('')}
                            </div>
                            <span class="scroll-down">Quiz từ cộng đồng <span class="arrow">↓</span></span>
                        </div>
                    `;

                    sharedCarousel.innerHTML = carouselHTML;

                    // Attach event listeners cho shared quiz
                    this.attachSharedCarouselEventListeners();

                    console.log('✅ Shared quiz carousel loaded');
                } else {
                    sharedCarousel.innerHTML = `
                        <div class="empty-state-card">
                            <i class="fas fa-globe"></i>
                            <h3>Chưa có quiz nào được chia sẻ</h3>
                            <p>Hãy chia sẻ quiz của bạn để mọi người cùng học!</p>
                        </div>
                    `;
                }
            } else {
                // Hiển thị empty state đẹp khi chưa có quiz chia sẻ
                sharedCarousel.innerHTML = `
                    <div class="empty-state-card">
                        <i class="fas fa-globe"></i>
                        <h3>Chưa có quiz nào được chia sẻ</h3>
                        <p>Hãy chia sẻ quiz của bạn để mọi người cùng học!</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error loading shared quiz carousel:', error);
            sharedCarousel.innerHTML = `
                <div class="empty-state-card">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Không thể tải quiz đã chia sẻ</h3>
                    <p>Vui lòng thử lại sau</p>
                </div>
            `;
        }
    }

    attachSharedCarouselEventListeners() {
        const sharedBtns = document.querySelectorAll('.shared-quiz-btn');

        sharedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const quizId = btn.getAttribute('data-quiz-id');
                console.log('🌐 Starting shared quiz:', quizId);

                // Chuyển sang tab explore và load quiz
                if (window.exploreQuizManager && typeof window.exploreQuizManager.loadSharedQuizById === 'function') {
                    this.switchTab('explore');
                    window.exploreQuizManager.loadSharedQuizById(quizId);
                } else {
                    this.showToast('Tính năng đang được phát triển', 'info');
                }
            });
        });
    }

    attachHomeQuizEventListeners() {
        const homeQuizGrid = document.getElementById('home-quiz-grid');
        if (!homeQuizGrid) return;

        // Event listeners cho nút "Làm bài"
        homeQuizGrid.querySelectorAll('.quiz-start-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const quizId = btn.getAttribute('data-quiz-id');
                console.log('🎮 Starting quiz:', quizId);
                this.startQuizById(quizId);
            });
        });

        // Event listeners cho nút "Sửa"
        homeQuizGrid.querySelectorAll('.quiz-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const quizId = btn.getAttribute('data-quiz-id');
                console.log('✏️ Editing quiz:', quizId);
                this.editQuiz(quizId);
            });
        });

        // Event listeners cho nút "Chia sẻ"
        homeQuizGrid.querySelectorAll('.quiz-share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const quizId = btn.getAttribute('data-quiz-id');
                console.log('🔗 Sharing quiz:', quizId);
                if (window.exploreQuizManager && window.exploreQuizManager.shareQuiz) {
                    window.exploreQuizManager.shareQuiz(quizId);
                } else {
                    this.showToast('Tính năng chia sẻ chưa sẵn sàng', 'warning');
                }
            });
        });

        // Event listeners cho nút "Tạo quiz mới"
        homeQuizGrid.querySelectorAll('[data-tab="input"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab('input');
            });
        });
    }

    updateQuizSelector() {
        const selector = document.getElementById('quiz-selector');
        selector.innerHTML = '<option value="">Chọn bài quiz...</option>';

        this.quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz.id;
            option.textContent = `${quiz.title} (${quiz.totalQuestions} câu)`;
            selector.appendChild(option);
        });
    }

    editQuiz(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        document.getElementById('edit-title').value = quiz.title;
        document.getElementById('edit-description').value = quiz.description;

        const questionsContainer = document.getElementById('edit-questions');
        questionsContainer.innerHTML = quiz.questions.map((q, index) => `
            <div class="edit-question-item" data-index="${index}">
                <h4>Câu ${index + 1}</h4>
                <textarea placeholder="Nội dung câu hỏi...">${q.question}</textarea>
                <div class="edit-options">
                    ${q.options.map((opt, optIndex) => `
                        <div class="edit-option">
                            <span>${opt.letter}.</span>
                            <input type="text" value="${opt.text}" data-option="${opt.letter}">
                            <select ${q.correctAnswer === opt.letter ? 'selected' : ''}>
                                <option value="">-</option>
                                <option value="${opt.letter}" ${q.correctAnswer === opt.letter ? 'selected' : ''}>Đúng</option>
                            </select>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        document.getElementById('edit-modal').classList.add('active');
        document.getElementById('edit-modal').dataset.quizId = quizId;
    }

    saveQuizEdit() {
        const quizId = document.getElementById('edit-modal').dataset.quizId;
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        const title = document.getElementById('edit-title').value.trim();
        const description = document.getElementById('edit-description').value.trim();

        if (!title) {
            this.showToast('Vui lòng nhập tên quiz!', 'error');
            return;
        }

        // Update basic info
        quiz.title = title;
        quiz.description = description || 'Không có mô tả';

        // Update questions
        const questionItems = document.querySelectorAll('.edit-question-item');
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector('textarea').value.trim();
            const options = Array.from(item.querySelectorAll('.edit-option')).map(optEl => {
                const letter = optEl.querySelector('span').textContent.replace('.', '');
                const text = optEl.querySelector('input').value.trim();
                return { letter, text };
            });

            const correctAnswerSelect = item.querySelector('select[selected], select option[selected]');
            const correctAnswer = Array.from(item.querySelectorAll('select')).find(select => select.value)?.value || quiz.questions[index].correctAnswer;

            quiz.questions[index] = {
                question: questionText,
                options: options.filter(opt => opt.text),
                correctAnswer: correctAnswer
            };
        });

        this.saveQuizzes();
        this.closeEditModal();
        this.loadQuizList();
        this.loadHomeQuizGrid(); // Cập nhật home tab
        this.updateQuizSelector();

        this.showToast('✅ Cập nhật quiz thành công!', 'success');
    }

    closeEditModal() {
        document.getElementById('edit-modal').classList.remove('active');
    }

    duplicateQuiz(quizId) {
        const originalQuiz = this.quizzes.find(q => q.id === quizId);
        if (!originalQuiz) return;

        const duplicatedQuiz = {
            ...originalQuiz,
            id: Date.now().toString(),
            title: originalQuiz.title + ' (Sao chép)',
            createdAt: new Date().toISOString()
        };

        this.quizzes.push(duplicatedQuiz);
        this.saveQuizzes();
        this.loadQuizList();
        this.loadHomeQuizGrid(); // Cập nhật home tab
        this.updateQuizSelector();

        this.showToast('📋 Sao chép quiz thành công!', 'success');
    }

    deleteQuiz(quizId) {
        if (!confirm('Bạn có chắc chắn muốn xóa quiz này không?')) return;

        this.quizzes = this.quizzes.filter(q => q.id !== quizId);
        this.saveQuizzes();
        this.loadQuizList();
        this.loadHomeQuizGrid(); // Cập nhật home tab
        this.updateQuizSelector();

        this.showToast('🗑️ Xóa quiz thành công!', 'success');
    }

    startQuiz() {
        const selectedQuizId = document.getElementById('quiz-selector').value;
        const shuffleEl = document.getElementById('shuffle-questions');
        const shouldShuffle = shuffleEl ? !!shuffleEl.checked : false;

        if (!selectedQuizId) {
            this.showToast('Vui lòng chọn một bài quiz!', 'warning');
            return;
        }

        const quiz = this.quizzes.find(q => q.id === selectedQuizId);
        if (!quiz) {
            this.showToast('Không tìm thấy quiz!', 'error');
            return;
        }

        const questionsClone = (quiz.questions || []).map(q => ({
            question: q.question,
            options: (q.options || []).map(o => ({ letter: o.letter, text: o.text })),
            correctAnswer: q.correctAnswer
        }));

        const finalQuestions = (shouldShuffle && questionsClone.length >= 2)
            ? this.shuffleArray([...questionsClone])
            : questionsClone;

        this.currentQuiz = {
            ...quiz,
            questions: finalQuestions,
            totalQuestions: finalQuestions.length
        };
        this.currentAnswers = {};
        // Backup current quiz to allow restore if needed
        try {
            this._quizBackup = JSON.parse(JSON.stringify(this.currentQuiz));
            localStorage.setItem('quizBackup', JSON.stringify(this.currentQuiz));
        } catch (e) {
            console.warn('Backup currentQuiz failed:', e);
        }

        if (shouldShuffle && questionsClone.length >= 2) {
            this.showToast('🔀 Đã xáo trộn câu hỏi!', 'info');
        } else if (shouldShuffle && questionsClone.length < 2) {
            this.showToast('Không đủ câu hỏi để xáo trộn.', 'warning');
        }

        this.renderQuiz();
        this.showToast('🚀 Bắt đầu làm bài!', 'success');
    }

    startQuizById(quizId) {
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (!quiz) {
            this.showToast('Không tìm thấy quiz!', 'error');
            return;
        }

        const questionsClone = (quiz.questions || []).map(q => ({
            question: q.question,
            options: (q.options || []).map(o => ({ letter: o.letter, text: o.text })),
            correctAnswer: q.correctAnswer
        }));

        this.currentQuiz = {
            ...quiz,
            questions: questionsClone,
            totalQuestions: questionsClone.length
        };
        this.currentAnswers = {};

        // Backup current quiz
        try {
            this._quizBackup = JSON.parse(JSON.stringify(this.currentQuiz));
            localStorage.setItem('quizBackup', JSON.stringify(this.currentQuiz));
        } catch (e) {
            console.warn('Backup currentQuiz failed:', e);
        }

        // Chuyển sang tab quiz và render
        this.switchTab('quiz');
        this.renderQuiz();
        this.showToast('🚀 Bắt đầu làm bài!', 'success');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderQuiz() {
        const container = document.getElementById('quiz-container');

        const quizHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar" id="quiz-progress-bar" style="width: 0%"></div>
            </div>

            <div class="quiz-header">
                <div class="quiz-info-display">
                    <h3>${this.currentQuiz.title}</h3>
                    <p>${this.currentQuiz.description}</p>
                </div>
                <div class="quiz-progress">
                    <div>Đã trả lời: <span id="answered-count">0</span>/${this.currentQuiz.totalQuestions}</div>
                    <div>Thời gian: <span id="quiz-timer">00:00</span></div>
                </div>
            </div>

            <div class="questions-container">
                ${this.currentQuiz.questions.map((question, index) => `
                    <div class="question-card">
                        <div class="question-header">
                            <div class="question-number">${index + 1}</div>
                            <div class="question-text">${question.question}</div>
                        </div>
                        <div class="options">
                            ${question.options.map(option => `
                                <label class="option" for="q${index}_${option.letter}">
                                    <input type="radio" 
                                           id="q${index}_${option.letter}" 
                                           name="question_${index}" 
                                           value="${option.letter}"
                                           onchange="quizManager.updateAnswer(${index}, '${option.letter}')">
                                    <span class="option-label">${option.letter}.</span>
                                    <span class="option-text">${option.text}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="quiz-submit">
                <button id="submit-quiz" class="btn btn-success" onclick="quizManager.submitQuiz()">
                    <i class="fas fa-check-circle"></i>
                    Nộp Bài
                </button>
                <p style="margin-top: 10px; color: var(--text-secondary); font-size: 14px;">
                    Hãy kiểm tra kỹ các câu trả lời trước khi nộp bài
                </p>
            </div>
        `;

        container.innerHTML = quizHTML;
        this.startTimer();
        this.updateProgressBar();
    }

    updateProgressBar() {
        const answeredCount = Object.keys(this.currentAnswers).length;
        const totalQuestions = this.currentQuiz.totalQuestions;
        const percentage = (answeredCount / totalQuestions) * 100;

        const progressBar = document.getElementById('quiz-progress-bar');
        const answeredCountEl = document.getElementById('answered-count');

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }

        if (answeredCountEl) {
            answeredCountEl.textContent = answeredCount;
        }
    }

    startTimer() {
        this.quizStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.quizStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timerEl = document.getElementById('quiz-timer');
            if (timerEl) {
                timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    updateAnswer(questionIndex, selectedAnswer) {
        this.currentAnswers[questionIndex] = selectedAnswer;

        const option = document.querySelector(`#q${questionIndex}_${selectedAnswer}`).closest('.option');
        document.querySelectorAll(`input[name="question_${questionIndex}"]`).forEach(input => {
            input.closest('.option').classList.remove('selected');
        });
        option.classList.add('selected');

        this.updateProgressBar();
    }

    submitQuiz() {
        const answeredCount = Object.keys(this.currentAnswers).length;
        const totalQuestions = this.currentQuiz.totalQuestions;

        if (answeredCount < totalQuestions) {
            const unanswered = totalQuestions - answeredCount;
            if (!confirm(`Bạn còn ${unanswered} câu chưa trả lời. Bạn có muốn nộp bài không?`)) {
                return;
            }
        }

        clearInterval(this.timerInterval);
        const endTime = Date.now();
        const totalTime = Math.floor((endTime - this.quizStartTime) / 1000);

        let correctCount = 0;
        const results = this.currentQuiz.questions.map((question, index) => {
            const userAnswer = this.currentAnswers[index] || '';
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) correctCount++;

            return {
                question: question.question,
                options: question.options,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect
            };
        });

        const score = Math.round((correctCount / this.currentQuiz.totalQuestions) * 10 * 100) / 100;

        this.currentResults = {
            quizTitle: this.currentQuiz.title,
            totalQuestions: this.currentQuiz.totalQuestions,
            correctCount,
            incorrectCount: this.currentQuiz.totalQuestions - correctCount,
            score,
            totalTime,
            results,
            completedAt: new Date().toISOString()
        };

        const savedResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        savedResults.push(this.currentResults);
        localStorage.setItem('quizResults', JSON.stringify(savedResults));

        // Ghi nhận hoàn thành quiz cho streak tracking
        if (typeof recordQuizCompletion === 'function') {
            recordQuizCompletion();
        }

        // Nếu là quiz từ phòng thi, lưu vào leaderboard
        if (this.currentQuiz.isRoomQuiz && this.currentQuiz.roomId && this.currentQuiz.userName) {
            const roomResult = {
                userName: this.currentQuiz.userName,
                score: score,
                correctCount: correctCount,
                totalQuestions: this.currentQuiz.totalQuestions,
                totalTime: totalTime
            };

            // Lưu vào leaderboard
            if (window.roomManager) {
                window.roomManager.saveResultToLeaderboard(this.currentQuiz.roomId, roomResult);
            }
        }

        // Phát âm thanh kết quả dựa trên tỷ lệ đúng
        const percentage = (correctCount / this.currentQuiz.totalQuestions) * 100;
        console.log('Quiz submitted - Score:', correctCount + '/' + this.currentQuiz.totalQuestions, 'Percentage:', percentage + '%');

        // Thử phát âm thanh bằng nhiều cách
        if (typeof window.playQuizResultSound === 'function') {
            console.log('Using playQuizResultSound function...');
            window.playQuizResultSound(percentage);
        } else if (window.soundManager && typeof window.soundManager.playResultSound === 'function') {
            console.log('Using soundManager.playResultSound...');
            window.soundManager.playResultSound(percentage);
        } else {
            console.error('No sound playing method available!');
        }

        this.showToast('🎉 Đã nộp bài thành công!', 'success');
        this.switchTab('results');
        this.displayResults();
    }

    displayResults() {
        if (!this.currentResults) {
            document.getElementById('results-container').innerHTML = `
                <div class="results-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <h3>Chưa có kết quả nào</h3>
                    <p>Hoàn thành một bài quiz để xem kết quả</p>
                </div>
            `;
            return;
        }

        const { score, correctCount, incorrectCount, totalQuestions, totalTime, results, quizTitle } = this.currentResults;

        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        let performanceClass = '';
        let performanceMessage = '';
        let performanceIcon = '';

        const percentage = (correctCount / totalQuestions) * 100;

        if (percentage >= 90) {
            performanceClass = 'excellent';
            performanceMessage = 'Xuất sắc! 🌟';
            performanceIcon = '🏆';
        } else if (percentage >= 75) {
            performanceClass = 'good';
            performanceMessage = 'Tốt lắm! 👍';
            performanceIcon = '⭐';
        } else if (percentage >= 50) {
            performanceClass = 'average';
            performanceMessage = 'Khá ổn! 💪';
            performanceIcon = '📚';
        } else {
            performanceClass = 'needs-improvement';
            performanceMessage = 'Cần cố gắng thêm! 📖';
            performanceIcon = '💡';
        }

        const resultsHTML = `
            <div class="results-header ${performanceClass}">
                <div class="performance-badge">${performanceIcon}</div>
                <h2><i class="fas fa-trophy"></i> ${performanceMessage}</h2>
                <div class="quiz-title-result">${quizTitle}</div>
                <div class="score-display">${score}/10</div>
                <div class="score-text">${correctCount}/${totalQuestions} câu đúng</div>
            </div>

            <div class="results-stats">
                <div class="stat-card">
                    <div class="stat-number" style="color: #48bb78;">${correctCount}</div>
                    <div class="stat-label">Câu Đúng</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #f56565;">${incorrectCount}</div>
                    <div class="stat-label">Câu Sai</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${minutes}:${seconds.toString().padStart(2, '0')}</div>
                    <div class="stat-label">Thời Gian</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Math.round(percentage)}%</div>
                    <div class="stat-label">Tỷ Lệ Đúng</div>
                </div>
            </div>

            <div class="action-buttons-container">
                <button class="btn btn-review" onclick="quizManager.reviewAnswers(false)">
                    <i class="fas fa-eye"></i>
                    Xem Lại Bài Làm
                </button>
                <button class="btn btn-danger" onclick="quizManager.reviewAnswers(true)">
                    <i class="fas fa-times-circle"></i>
                    Xem Đáp Án Sai
                </button>
                <button class="btn btn-primary" onclick="quizManager.startNewQuiz()">
                    <i class="fas fa-play"></i>
                    Làm Bài Khác
                </button>
                <button class="btn btn-secondary" onclick="quizManager.exportResults()">
                    <i class="fas fa-download"></i>
                    Xuất Kết Quả
                </button>
            </div>

            <div id="review-section" class="review-section" style="display: none;">
                <div class="review-header">
                    <h3><i class="fas fa-list-alt"></i> <span id="review-title">Chi Tiết Từng Câu</span></h3>
                    <button class="btn-close-review" onclick="quizManager.closeReview()">
                        <i class="fas fa-times"></i>
                        Đóng
                    </button>
                </div>
                <div class="results-details" id="results-details-container"></div>
            </div>
        `;

        document.getElementById('results-container').innerHTML = resultsHTML;
    }

    reviewAnswers(filterWrongOnly = false) {
        if (!this.currentResults) return;

        const { results } = this.currentResults;
        const reviewSection = document.getElementById('review-section');
        const reviewTitle = document.getElementById('review-title');
        const detailsContainer = document.getElementById('results-details-container');

        if (!reviewSection || !detailsContainer) return;

        const displayResults = filterWrongOnly
            ? results.filter(r => !r.isCorrect)
            : results;

        if (reviewTitle) {
            reviewTitle.textContent = filterWrongOnly ? 'Chi Tiết Các Câu Sai' : 'Chi Tiết Từng Câu';
        }

        if (displayResults.length === 0) {
            detailsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>Không có câu sai nào!</h3>
                    <p>Chúc mừng! Bạn đã trả lời đúng tất cả các câu hỏi.</p>
                </div>
            `;
        } else {
            const questionsHTML = displayResults.map((result) => {
                const originalIndex = results.findIndex(r => r.question === result.question);
                const optionsHTML = result.options.map(opt => {
                    const isUserAnswer = opt.letter === result.userAnswer;
                    const isCorrectAnswer = opt.letter === result.correctAnswer;
                    let optionClass = 'result-option';

                    if (isCorrectAnswer) {
                        optionClass += ' correct-option';
                    }
                    if (isUserAnswer && !isCorrectAnswer) {
                        optionClass += ' wrong-option';
                    }

                    return `
                        <div class="${optionClass}">
                            <span class="option-letter">${opt.letter}.</span>
                            <span class="option-text">${opt.text}</span>
                            ${isCorrectAnswer ? '<i class="fas fa-check-circle correct-icon"></i>' : ''}
                            ${isUserAnswer && !isCorrectAnswer ? '<i class="fas fa-times-circle wrong-icon"></i>' : ''}
                            ${isUserAnswer ? '<span class="your-choice-badge">Bạn chọn</span>' : ''}
                        </div>
                    `;
                }).join('');

                return `
                    <div class="result-question ${result.isCorrect ? 'correct' : 'incorrect'}">
                        <div class="result-question-header">
                            <div class="question-status-badge ${result.isCorrect ? 'correct-badge' : 'incorrect-badge'}">
                                <i class="fas ${result.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                ${result.isCorrect ? 'Đúng' : 'Sai'}
                            </div>
                        </div>
                        <div class="result-question-text">
                            <strong>Câu ${originalIndex + 1}:</strong> ${result.question}
                        </div>
                        <div class="result-options">
                            ${optionsHTML}
                        </div>
                        ${!result.userAnswer ? '<div class="no-answer-notice"><i class="fas fa-exclamation-triangle"></i> Bạn chưa trả lời câu này</div>' : ''}
                    </div>
                `;
            }).join('');

            detailsContainer.innerHTML = questionsHTML;
        }

        reviewSection.style.display = 'block';
        reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const message = filterWrongOnly
            ? '❌ Đang xem các câu sai'
            : '📖 Đang xem lại bài làm';
        this.showToast(message, 'info');
    }

    closeReview() {
        const reviewSection = document.getElementById('review-section');
        if (reviewSection) {
            reviewSection.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    startNewQuiz() {
        this.currentQuiz = null;
        this.currentAnswers = {};

        this.switchTab('quiz');

        document.getElementById('quiz-selector').value = '';
        document.getElementById('start-quiz').disabled = true;

        document.getElementById('quiz-container').innerHTML = `
            <div class="quiz-placeholder">
                <i class="fas fa-clipboard-list"></i>
                <h3>Sẵn sàng làm bài mới?</h3>
                <p>Chọn một bài quiz và bấm "Bắt Đầu" để làm bài mới</p>
            </div>
        `;

        this.showToast('🎯 Hãy chọn bài quiz mới để bắt đầu!', 'success');
    }

    exportResults() {
        if (!this.currentResults) return;

        const data = {
            ...this.currentResults,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ket-qua-${this.currentResults.quizTitle.replace(/\s+/g, '-')}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('💾 Xuất kết quả thành công!', 'success');
    }

    showStreakDetails() {
        // Gọi hàm từ streak-tracker.js
        if (typeof showStreakDetails === 'function') {
            showStreakDetails();
        }
    }

    showFormatExamples(type) {
        const parser = new SmartQuestionParser();
        const examples = parser.getExamples();

        const title = type === 'questions' ? '📝 Các Format Câu Hỏi Được Hỗ Trợ' : '✅ Các Format Đáp Án Được Hỗ Trợ';
        const content = type === 'questions' ? examples.questions : examples.answers;

        // Tạo modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif; line-height: 1.6; background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 500px; overflow-y: auto;">${content}</pre>
                    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196F3;">
                        <strong>💡 Lưu ý:</strong>
                        <ul style="margin: 10px 0 0 20px;">
                            <li>Hệ thống tự động nhận diện format</li>
                            <li>Không cần theo đúng format cố định</li>
                            <li>Có thể trộn lẫn các format khác nhau</li>
                            <li>Hỗ trợ cả tiếng Việt và tiếng Anh</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-check"></i> Đã hiểu
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    autoFormatQuestions() {
        const textarea = document.getElementById('questions-input');
        const text = textarea.value.trim();

        if (!text) {
            this.showToast('⚠️ Vui lòng nhập câu hỏi trước!', 'error');
            return;
        }

        try {
            const parser = new SmartQuestionParser();
            const formatted = parser.cleanText(text);

            textarea.value = formatted;
            this.previewQuestions();
            this.showToast('✨ Đã tự động định dạng văn bản!', 'success');
        } catch (error) {
            this.showToast('❌ Lỗi: ' + error.message, 'error');
        }
    }

    previewQuestions() {
        const textarea = document.getElementById('questions-input');
        const preview = document.getElementById('questions-preview');
        const text = textarea.value.trim();

        if (!text) {
            preview.className = 'input-preview';
            preview.innerHTML = '';
            return;
        }

        try {
            const parser = new SmartQuestionParser();
            const questions = parser.parseQuestions(text);

            preview.className = 'input-preview success show';
            preview.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>✅ Nhận diện thành công ${questions.length} câu hỏi!</strong>
                <div style="margin-top: 8px; font-size: 13px; opacity: 0.9;">
                    ${questions.map(q => `Câu ${q.questionNumber}: ${q.options.length} lựa chọn`).join(' • ')}
                </div>
            `;
        } catch (error) {
            preview.className = 'input-preview error show';
            preview.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <strong>Chưa nhận diện được:</strong> ${error.message}
            `;
        }
    }

    previewAnswers() {
        const questionsText = document.getElementById('questions-input').value.trim();
        const answersText = document.getElementById('answers-input').value.trim();
        const preview = document.getElementById('answers-preview');

        if (!answersText) {
            preview.className = 'input-preview';
            preview.innerHTML = '';
            return;
        }

        try {
            const parser = new SmartQuestionParser();

            // Cần biết số lượng câu hỏi để validate
            let expectedCount = 0;
            if (questionsText) {
                try {
                    const questions = parser.parseQuestions(questionsText);
                    expectedCount = questions.length;
                } catch (e) {
                    // Ignore
                }
            }

            if (expectedCount === 0) {
                preview.className = 'input-preview error show';
                preview.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    <strong>Vui lòng nhập câu hỏi trước</strong>
                `;
                return;
            }

            const answers = parser.parseAnswers(answersText, expectedCount);

            preview.className = 'input-preview success show';
            preview.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <strong>✅ Nhận diện thành công ${answers.length} đáp án!</strong>
                <div style="margin-top: 8px; font-size: 13px; opacity: 0.9;">
                    ${answers.join(', ')}
                </div>
            `;
        } catch (error) {
            preview.className = 'input-preview error show';
            preview.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <strong>Chưa nhận diện được:</strong> ${error.message}
            `;
        }
    }

}

// Expose QuizManager to window for patches that access window.QuizManager
if (typeof window !== 'undefined' && typeof window.QuizManager === 'undefined') {
    window.QuizManager = QuizManager;
}
// Initialize the quiz manager when page loads
let quizManager;
document.addEventListener('DOMContentLoaded', () => {
    quizManager = new QuizManager();

    // Initialize scroll to top button
    initScrollToTop();
});

// Scroll to top functionality - Improved version
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.title = 'Cuộn lên đầu trang';
    document.body.appendChild(scrollBtn);

    // Chỉ hiện nút khi cuộn xuống > 500px (thay vì 300px)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Debounce để tối ưu performance
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
