/**
 * Smooth Quiz Effects - Hiệu ứng mượt mà cho giao diện làm bài
 * Nâng cấp trải nghiệm người dùng với animations và transitions
 */

class SmoothQuizEffects {
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeProgressBar();
        this.setupOptionAnimations();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
    }

    /**
     * Thiết lập event listeners - tích hợp với hệ thống hiện tại
     */
    setupEventListeners() {
        // Lắng nghe sự kiện chọn đáp án (hỗ trợ cả naming convention cũ và mới)
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' &&
                (e.target.name.startsWith('q') || e.target.name.startsWith('question_'))) {
                this.handleOptionSelect(e.target);
            }
        });

        // Lắng nghe sự kiện click option
        document.addEventListener('click', (e) => {
            const option = e.target.closest('.option');
            if (option) {
                this.animateOptionClick(option);
            }
        });

        // Lắng nghe sự kiện navigation (hỗ trợ cả class name cũ và mới)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next') ||
                e.target.classList.contains('btn-nav') && e.target.id === 'btn-next') {
                this.handleNextQuestion();
            } else if (e.target.classList.contains('btn-previous') ||
                e.target.classList.contains('btn-prev') ||
                (e.target.classList.contains('btn-nav') && e.target.id === 'btn-prev')) {
                this.handlePreviousQuestion();
            }
        });
    }

    /**
     * Khởi tạo thanh tiến trình
     */
    initializeProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            // Animate progress bar on load
            setTimeout(() => {
                this.updateProgressBar();
            }, 500);
        }
    }

    /**
     * Cập nhật thanh tiến trình với animation mượt mà - tích hợp với hệ thống hiện tại
     */
    updateProgressBar() {
        // Hỗ trợ cả selector cũ và mới
        const progressBar = document.querySelector('.progress-bar') ||
            document.querySelector('.progress-bar-fill') ||
            document.querySelector('#progress-bar-fill');
        const progressText = document.querySelector('.progress-percentage') ||
            document.querySelector('#progress-percentage');

        if (!progressBar) return;

        const progress = this.totalQuestions > 0 ?
            ((this.currentQuestion + 1) / this.totalQuestions) * 100 : 0;

        // Animate progress bar
        progressBar.style.width = progress + '%';

        // Animate percentage text nếu có
        if (progressText) {
            this.animateNumber(progressText, progress);
        }

        // Cập nhật progress text trong modern layout nếu có
        const modernProgressText = document.querySelector('#progress-percentage');
        if (modernProgressText && modernProgressText !== progressText) {
            modernProgressText.textContent = Math.ceil((this.currentQuestion + 1));
        }
    }

    /**
     * Animate số với hiệu ứng đếm
     */
    animateNumber(element, targetValue) {
        const startValue = parseFloat(element.textContent) || 0;
        const duration = 800;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (targetValue - startValue) * easeOutQuart;

            element.textContent = Math.round(currentValue) + '%';

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Xử lý khi chọn đáp án - tích hợp với hệ thống hiện tại
     */
    handleOptionSelect(radioInput) {
        const option = radioInput.closest('.option');
        if (!option) return;

        const allOptions = option.parentNode.querySelectorAll('.option');

        // Remove selected class from all options
        allOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.style.transform = '';
        });

        // Add selected class to current option
        option.classList.add('selected');

        // Animate selection
        this.animateOptionSelection(option);

        // Play selection sound (if available)
        this.playSelectionSound();

        // Enable next button if available
        this.enableNextButton();

        // Update progress if quiz manager is available
        if (window.quizManager && typeof window.quizManager.updateProgressBar === 'function') {
            window.quizManager.updateProgressBar();
        }
    }

    /**
     * Animate khi click vào option
     */
    animateOptionClick(option) {
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = option.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        option.style.position = 'relative';
        option.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * Animate khi chọn đáp án
     */
    animateOptionSelection(option) {
        // Scale animation
        option.style.transform = 'scale(1.02)';
        setTimeout(() => {
            option.style.transform = 'translateX(8px)';
        }, 150);

        // Glow effect
        option.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.3)';
    }

    /**
     * Xử lý chuyển câu hỏi tiếp theo
     */
    handleNextQuestion() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const questionCard = document.querySelector('.question-card');

        if (questionCard) {
            // Slide out current question
            questionCard.classList.add('question-transition-out');

            setTimeout(() => {
                this.currentQuestion++;
                this.updateProgressBar();

                // Load next question content here
                this.loadNextQuestion();

                // Slide in new question
                questionCard.classList.remove('question-transition-out');
                questionCard.classList.add('question-transition-in');

                setTimeout(() => {
                    questionCard.classList.remove('question-transition-in');
                    this.isTransitioning = false;
                }, 400);
            }, 400);
        }
    }

    /**
     * Xử lý quay lại câu hỏi trước
     */
    handlePreviousQuestion() {
        if (this.isTransitioning || this.currentQuestion <= 0) return;

        this.isTransitioning = true;
        const questionCard = document.querySelector('.question-card');

        if (questionCard) {
            // Slide out current question (reverse direction)
            questionCard.style.animation = 'slideOutRight 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards';

            setTimeout(() => {
                this.currentQuestion--;
                this.updateProgressBar();

                // Load previous question content here
                this.loadPreviousQuestion();

                // Slide in previous question
                questionCard.style.animation = 'slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';

                setTimeout(() => {
                    questionCard.style.animation = '';
                    this.isTransitioning = false;
                }, 400);
            }, 400);
        }
    }

    /**
     * Thiết lập animations cho options
     */
    setupOptionAnimations() {
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            // Stagger animation delay
            option.style.animationDelay = (index * 0.1) + 's';

            // Hover effects
            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('selected')) {
                    option.style.transform = 'translateX(4px)';
                }
            });

            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('selected')) {
                    option.style.transform = '';
                }
            });
        });
    }

    /**
     * Thiết lập điều hướng bằng bàn phím
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateOptions(e.key === 'ArrowDown' ? 1 : -1);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.selectFocusedOption();
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.handleNextQuestion();
                    }
                    break;
                case 'ArrowLeft':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.handlePreviousQuestion();
                    }
                    break;
            }
        });
    }

    /**
     * Điều hướng giữa các options bằng bàn phím
     */
    navigateOptions(direction) {
        const options = document.querySelectorAll('.option');
        const currentFocus = document.querySelector('.option:focus-within');
        let currentIndex = currentFocus ?
            Array.from(options).indexOf(currentFocus) : -1;

        currentIndex += direction;

        if (currentIndex < 0) currentIndex = options.length - 1;
        if (currentIndex >= options.length) currentIndex = 0;

        const radioInput = options[currentIndex].querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.focus();
        }
    }

    /**
     * Chọn option đang được focus
     */
    selectFocusedOption() {
        const focusedRadio = document.querySelector('.option input[type="radio"]:focus');
        if (focusedRadio) {
            focusedRadio.checked = true;
            focusedRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    /**
     * Kích hoạt nút Next
     */
    enableNextButton() {
        const nextButton = document.querySelector('.btn-next');
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.style.opacity = '1';
        }
    }

    /**
     * Phát âm thanh khi chọn đáp án
     */
    playSelectionSound() {
        const audio = document.getElementById('answer-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        }
    }

    /**
     * Thiết lập accessibility
     */
    setupAccessibility() {
        // Add ARIA labels
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"]');
            const text = option.querySelector('.option-text');

            if (radio && text) {
                radio.setAttribute('aria-label', `Option ${String.fromCharCode(65 + index)}: ${text.textContent}`);
            }
        });

        // Add progress bar accessibility
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.setAttribute('role', 'progressbar');
            progressBar.setAttribute('aria-valuemin', '0');
            progressBar.setAttribute('aria-valuemax', '100');
        }
    }

    /**
     * Load câu hỏi tiếp theo - tích hợp với hệ thống hiện tại
     */
    loadNextQuestion() {
        if (window.quizManager && typeof window.quizManager.nextQuestion === 'function') {
            window.quizManager.nextQuestion();
        }
    }

    /**
     * Load câu hỏi trước - tích hợp với hệ thống hiện tại
     */
    loadPreviousQuestion() {
        if (window.quizManager && typeof window.quizManager.previousQuestion === 'function') {
            window.quizManager.previousQuestion();
        }
    }

    /**
     * Cập nhật tổng số câu hỏi
     */
    setTotalQuestions(total) {
        this.totalQuestions = total;
        this.updateProgressBar();
    }

    /**
     * Cập nhật câu hỏi hiện tại
     */
    setCurrentQuestion(current) {
        this.currentQuestion = current;
        this.updateProgressBar();
    }
}

// CSS cho ripple effect
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes slideOutRight {
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}
`;

// Thêm CSS vào head
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Khởi tạo khi DOM ready và tích hợp với hệ thống hiện tại
document.addEventListener('DOMContentLoaded', () => {
    window.smoothQuizEffects = new SmoothQuizEffects();

    // Tích hợp với QuizManager hiện tại
    if (window.QuizManager && window.QuizManager.prototype) {
        // Hook vào renderQuiz để áp dụng smooth effects
        const originalRenderQuiz = window.QuizManager.prototype.renderQuiz;
        window.QuizManager.prototype.renderQuiz = function () {
            const result = originalRenderQuiz.call(this);

            // Áp dụng smooth effects sau khi render
            setTimeout(() => {
                if (window.smoothQuizEffects) {
                    window.smoothQuizEffects.setupOptionAnimations();
                    window.smoothQuizEffects.setTotalQuestions(this.currentQuiz?.totalQuestions || 0);
                    window.smoothQuizEffects.setCurrentQuestion(this.currentQuestionIndex || 0);
                }
            }, 100);

            return result;
        };

        // Hook vào renderQuizModern nếu có
        if (window.QuizManager.prototype.renderQuizModern) {
            const originalRenderQuizModern = window.QuizManager.prototype.renderQuizModern;
            window.QuizManager.prototype.renderQuizModern = function () {
                const result = originalRenderQuizModern.call(this);

                // Áp dụng smooth effects sau khi render
                setTimeout(() => {
                    if (window.smoothQuizEffects) {
                        window.smoothQuizEffects.setupOptionAnimations();
                        window.smoothQuizEffects.setTotalQuestions(this.currentQuiz?.totalQuestions || 0);
                        window.smoothQuizEffects.setCurrentQuestion(this.currentQuestionIndex || 0);
                    }
                }, 100);

                return result;
            };
        }

        console.log('✅ Smooth Quiz Effects integrated with QuizManager');
    }
});

// Export để sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmoothQuizEffects;
}