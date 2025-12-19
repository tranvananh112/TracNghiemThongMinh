/**
 * Sound Manager - Quản lý âm thanh khi chọn đáp án
 */

class SoundManager {
    constructor() {
        this.audio = null;
        this.enabled = true;
        this.init();
    }

    init() {
        // Lấy audio element
        this.audio = document.getElementById('answer-sound');

        // Lấy trạng thái từ localStorage
        const savedState = localStorage.getItem('soundEnabled');
        this.enabled = savedState === null ? true : savedState === 'true';

        // Cập nhật checkbox
        const checkbox = document.getElementById('enable-sound');
        if (checkbox) {
            checkbox.checked = this.enabled;
            checkbox.addEventListener('change', (e) => {
                this.setEnabled(e.target.checked);
            });
        }

        // Thêm event listener cho tất cả các nút đáp án
        this.attachToAnswerButtons();

        // Theo dõi DOM changes để attach vào các nút mới
        this.observeDOM();
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('soundEnabled', enabled.toString());

        // Hiển thị toast
        if (typeof quizManager !== 'undefined' && quizManager.showToast) {
            const message = enabled ? '🔊 Đã bật âm thanh' : '🔇 Đã tắt âm thanh';
            quizManager.showToast(message, 'success');
        }
    }

    play() {
        if (!this.enabled || !this.audio) {
            return;
        }

        try {
            // Reset audio về đầu
            this.audio.currentTime = 0;

            // Play audio
            const playPromise = this.audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play prevented:', error);
                });
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    attachToAnswerButtons() {
        // Tìm tất cả các nút đáp án
        const answerButtons = document.querySelectorAll('.option-btn, .answer-option, [class*="option"]');

        answerButtons.forEach(button => {
            // Kiểm tra xem đã attach chưa
            if (!button.dataset.soundAttached) {
                button.addEventListener('click', () => {
                    this.play();
                });
                button.dataset.soundAttached = 'true';
            }
        });
    }

    observeDOM() {
        // Theo dõi thay đổi DOM để attach vào các nút mới
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // Đợi một chút để DOM render xong
                    setTimeout(() => {
                        this.attachToAnswerButtons();
                    }, 100);
                }
            });
        });

        // Theo dõi quiz container
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            observer.observe(quizContainer, {
                childList: true,
                subtree: true
            });
        }

        // Theo dõi toàn bộ body để bắt các thay đổi khác
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Method để gọi từ code khác
    playSound() {
        this.play();
    }

    // Method để bật/tắt từ code khác
    toggle() {
        this.setEnabled(!this.enabled);
        const checkbox = document.getElementById('enable-sound');
        if (checkbox) {
            checkbox.checked = this.enabled;
        }
    }
}

// Khởi tạo Sound Manager khi DOM ready
let soundManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        soundManager = new SoundManager();
    });
} else {
    soundManager = new SoundManager();
}

// Export để sử dụng ở nơi khác
if (typeof window !== 'undefined') {
    window.soundManager = soundManager;
}
