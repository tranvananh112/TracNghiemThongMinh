/**
 * Sound Manager - Quản lý âm thanh khi chọn đáp án
 */

class SoundManager {
    constructor() {
        this.audio = null;
        this.successAudio = null;
        this.failAudio = null;
        this.enabled = true;
        this.init();
    }

    init() {
        // Lấy audio elements
        this.audio = document.getElementById('answer-sound');
        this.successAudio = document.getElementById('success-sound');
        this.failAudio = document.getElementById('fail-sound');

        console.log('SoundManager initialized');
        console.log('Answer sound:', this.audio);
        console.log('Success sound:', this.successAudio);
        console.log('Fail sound:', this.failAudio);

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

        // Unlock audio context khi user tương tác lần đầu
        this.unlockAudioContext();
    }

    unlockAudioContext() {
        const unlockAudio = () => {
            // Thử play và pause ngay để unlock audio context
            [this.audio, this.successAudio, this.failAudio].forEach(audio => {
                if (audio) {
                    audio.play().then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(() => { });
                }
            });

            // Remove listeners sau khi unlock
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            console.log('Audio context unlocked');
        };

        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
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

    /**
     * Phát âm thanh kết quả dựa trên tỷ lệ đúng
     * @param {number} percentage - Tỷ lệ phần trăm đúng (0-100)
     * Lưu ý: Âm thanh kết quả luôn phát bất kể checkbox "Bật âm thanh"
     */
    playResultSound(percentage) {
        try {
            let audioToPlay;

            if (percentage >= 70) {
                // Đạt từ 70% trở lên → Phát âm thanh chúc mừng
                audioToPlay = this.successAudio;
                console.log('Playing success sound - Score:', percentage + '%');
            } else {
                // Dưới 70% → Phát âm thanh sai đáp án
                audioToPlay = this.failAudio;
                console.log('Playing fail sound - Score:', percentage + '%');
            }

            if (!audioToPlay) {
                console.warn('Result audio not found');
                return;
            }

            // Reset audio về đầu
            audioToPlay.currentTime = 0;

            // Play audio
            const playPromise = audioToPlay.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Result audio playing successfully');
                    // Dừng sau 3 giây
                    setTimeout(() => {
                        audioToPlay.pause();
                        audioToPlay.currentTime = 0;
                        console.log('Result audio stopped after 3 seconds');
                    }, 3000);
                }).catch(error => {
                    console.error('Result audio play prevented:', error);
                });
            }
        } catch (error) {
            console.error('Error playing result sound:', error);
        }
    }

    /**
     * Phát âm thanh thành công (>=70%)
     */
    playSuccessSound() {
        this.playResultSound(100);
    }

    /**
     * Phát âm thanh thất bại (<70%)
     */
    playFailSound() {
        this.playResultSound(0);
    }
}

// Khởi tạo Sound Manager ngay lập tức và gán vào window
let soundManager;

// Khởi tạo ngay lập tức
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        soundManager = new SoundManager();
        window.soundManager = soundManager;
        console.log('SoundManager initialized on DOMContentLoaded');
    });
} else {
    soundManager = new SoundManager();
    window.soundManager = soundManager;
    console.log('SoundManager initialized immediately');
}

// Tạo hàm global để phát âm thanh kết quả (backup method)
window.playQuizResultSound = function (percentage) {
    console.log('playQuizResultSound called with percentage:', percentage);

    try {
        // Lấy audio elements trực tiếp
        const successAudio = document.getElementById('success-sound');
        const failAudio = document.getElementById('fail-sound');

        if (!successAudio || !failAudio) {
            console.error('Audio elements not found!');
            return;
        }

        let audioToPlay;

        if (percentage >= 70) {
            audioToPlay = successAudio;
            console.log('Playing success sound - Score:', percentage + '%');
        } else {
            audioToPlay = failAudio;
            console.log('Playing fail sound - Score:', percentage + '%');
        }

        // Reset audio về đầu
        audioToPlay.currentTime = 0;

        // Play audio
        const playPromise = audioToPlay.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Result audio playing successfully');
                // Dừng sau 3 giây
                setTimeout(() => {
                    audioToPlay.pause();
                    audioToPlay.currentTime = 0;
                    console.log('Result audio stopped after 3 seconds');
                }, 3000);
            }).catch(error => {
                console.error('Result audio play prevented:', error);
            });
        }
    } catch (error) {
        console.error('Error in playQuizResultSound:', error);
    }
};
