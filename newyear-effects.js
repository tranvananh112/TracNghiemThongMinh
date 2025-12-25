/**
 * 🎄 HIỆU ỨNG NOEL TRANG NHÃ 2026 🎄
 * Tuyết rơi rất nhẹ, Confetti tinh tế
 */

class NewYearEffects {
    constructor() {
        this.isActive = true;
        this.snowflakes = [];
        this.confetti = [];
        this.init();
    }

    init() {
        // Tạo banner chúc mừng năm mới
        this.createNewYearBanner();

        // Tạo trang trí bằng ảnh
        this.createImageDecorations();

        // Tạo Santa Claus animation
        this.createSantaAnimation();

        // Tạo cây thông trang trí
        this.createChristmasTree();

        // Tạo quả cầu treo
        this.createHangingOrnaments();

        // Bắt đầu hiệu ứng tuyết rơi rất nhẹ
        this.startSnowfall();

        // Thêm event listeners
        this.addEventListeners();

        // 🦌 Đảm bảo con hưu nhảy liên tục
        this.ensureReindeerContinuous();
    }

    createNewYearBanner() {
        const banner = document.createElement('div');
        banner.className = 'new-year-banner';
        banner.innerHTML = '🎄 Giáng Sinh An Lành 2026 ⭐';
        document.body.appendChild(banner);

        // Tự động ẩn sau 6 giây
        setTimeout(() => {
            banner.style.animation = 'fadeOut 1s ease-out forwards';
            setTimeout(() => banner.remove(), 1000);
        }, 6000);
    }

    createImageDecorations() {
        // Dây trang trí viền trên
        const topDecor = document.createElement('div');
        topDecor.className = 'christmas-decoration-top';
        document.body.appendChild(topDecor);

        // Dây trang trí góc trái
        const leftDecor = document.createElement('div');
        leftDecor.className = 'christmas-decoration-left';
        document.body.appendChild(leftDecor);

        // Dây trang trí góc phải
        const rightDecor = document.createElement('div');
        rightDecor.className = 'christmas-decoration-right';
        document.body.appendChild(rightDecor);

        // Cây thông góc dưới trái
        const treeImage = document.createElement('div');
        treeImage.className = 'christmas-tree-image';
        document.body.appendChild(treeImage);
    }

    createSantaAnimation() {
        // Đợi DOM load xong
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initSanta());
        } else {
            this.initSanta();
        }
    }

    initSanta() {
        const canvas = document.getElementById('santa-canvas');
        if (!canvas || !window.rive) {
            console.log('🎅 Santa canvas or Rive library not found');
            return;
        }

        try {
            const riv = new rive.Rive({
                src: '15557-29342-christmas-season-celebration-santa-claus.riv',
                canvas: canvas,
                autoplay: true,
                stateMachines: 'State Machine 1',
                onLoad: () => {
                    console.log('🎅 Santa Claus loaded successfully!');
                    riv.resizeDrawingSurfaceToCanvas();
                },
                onLoadError: (err) => {
                    console.error('❌ Santa loading error:', err);
                }
            });

            // Click để tương tác với Santa
            canvas.addEventListener('click', () => {
                console.log('🎅 Ho ho ho! Santa clicked!');
            });

        } catch (error) {
            console.error('❌ Santa initialization error:', error);
        }
    }

    createChristmasTree() {
        const treeContainer = document.createElement('div');
        treeContainer.className = 'christmas-tree-decoration';
        treeContainer.innerHTML = `
            <div class="christmas-tree">
                <div class="tree-star"></div>
                <div class="tree-layer"></div>
                <div class="tree-layer"></div>
                <div class="tree-layer"></div>
                <div class="tree-layer"></div>
                <div class="tree-ornament red"></div>
                <div class="tree-ornament gold"></div>
                <div class="tree-ornament blue"></div>
                <div class="tree-ornament red"></div>
                <div class="tree-ornament gold"></div>
                <div class="tree-ornament blue"></div>
                <div class="tree-sparkle"></div>
                <div class="tree-sparkle"></div>
                <div class="tree-sparkle"></div>
                <div class="tree-sparkle"></div>
                <div class="tree-sparkle"></div>
                <div class="tree-trunk"></div>
            </div>
        `;
        document.body.appendChild(treeContainer);
    }

    createHangingOrnaments() {
        const ornamentsContainer = document.createElement('div');
        ornamentsContainer.className = 'hanging-ornaments-decoration';
        ornamentsContainer.innerHTML = `
            <div class="hanging-ornament">
                <div class="ornament-string"></div>
                <div class="ornament-ball solid-gold"></div>
            </div>
            <div class="hanging-ornament">
                <div class="ornament-string"></div>
                <div class="ornament-ball striped"></div>
            </div>
            <div class="hanging-ornament">
                <div class="ornament-string"></div>
                <div class="ornament-ball solid-red"></div>
            </div>
            <div class="hanging-ornament">
                <div class="ornament-string"></div>
                <div class="ornament-ball solid-green"></div>
            </div>
            <div class="hanging-ornament">
                <div class="ornament-string"></div>
                <div class="ornament-ball solid-gold"></div>
            </div>
        `;
        document.body.appendChild(ornamentsContainer);
    }

    startSnowfall() {
        // Tạo tuyết rơi rất nhẹ - chỉ 20 bông
        setInterval(() => {
            if (this.isActive && this.snowflakes.length < 20) {
                this.createSnowflake();
            }
        }, 800); // Rất chậm
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Chỉ dùng ký tự tuyết đơn giản
        const snowChars = ['❄', '❅'];
        snowflake.textContent = snowChars[Math.floor(Math.random() * snowChars.length)];

        // Random vị trí và kích thước - rất nhỏ
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = (Math.random() * 0.8 + 0.5) + 'em'; // Rất nhỏ
        snowflake.style.animationDuration = (Math.random() * 10 + 10) + 's'; // Rất chậm
        snowflake.style.animationDelay = Math.random() * 4 + 's';

        document.body.appendChild(snowflake);
        this.snowflakes.push(snowflake);

        // Xóa sau khi animation kết thúc
        setTimeout(() => {
            snowflake.remove();
            this.snowflakes = this.snowflakes.filter(s => s !== snowflake);
        }, 24000);
    }

    createConfettiBurst(count = 15) {
        // Màu Đỏ & Xanh lá Noel
        const colors = ['#c41e3a', '#dc143c', '#2d5016', '#1e7e34', '#c9302c'];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 4) + 's'; // Rất chậm
                confetti.style.animationDelay = Math.random() + 's';

                // Random hình dạng
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                }

                document.body.appendChild(confetti);
                this.confetti.push(confetti);

                // Xóa sau khi rơi xong
                setTimeout(() => {
                    confetti.remove();
                    this.confetti = this.confetti.filter(c => c !== confetti);
                }, 6000);
            }, i * 100);
        }
    }

    createFireworks(x, y) {
        // Pháo hoa Đỏ & Xanh
        const colors = ['#c41e3a', '#2d5016', '#dc143c'];
        const particles = 12; // Rất ít

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.opacity = '0.6';

            const angle = (Math.PI * 2 * i) / particles;
            const velocity = Math.random() * 40 + 30; // Rất chậm
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            document.body.appendChild(particle);

            let posX = x;
            let posY = y;
            let opacity = 0.6;

            const animate = () => {
                posX += vx * 0.012;
                posY += vy * 0.012 + 1; // Gravity rất nhẹ
                opacity -= 0.012;

                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };

            animate();
        }
    }

    addEventListeners() {
        // Tạo pháo hoa rất nhẹ khi click vào button quan trọng
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary, .btn-success')) {
                this.createFireworks(e.clientX, e.clientY);
            }
        });

        // Tạo confetti rất nhẹ khi hoàn thành quiz
        const originalSubmitQuiz = window.quizManager?.submitQuiz;
        if (originalSubmitQuiz) {
            window.quizManager.submitQuiz = function () {
                originalSubmitQuiz.call(this);
                if (window.newYearEffects) {
                    window.newYearEffects.createConfettiBurst(25); // Rất ít
                }
            };
        }
    }

    toggle() {
        this.isActive = !this.isActive;

        if (!this.isActive) {
            // Xóa tất cả hiệu ứng
            this.snowflakes.forEach(s => s.remove());
            this.confetti.forEach(c => c.remove());
            this.snowflakes = [];
            this.confetti = [];
        }
    }

    destroy() {
        this.isActive = false;
        this.snowflakes.forEach(s => s.remove());
        this.confetti.forEach(c => c.remove());
        this.snowflakes = [];
        this.confetti = [];
    }
}

// Thêm CSS animation cho fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Khởi tạo hiệu ứng khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.newYearEffects = new NewYearEffects();
    });
} else {
    window.newYearEffects = new NewYearEffects();
}

// Export để có thể tắt/bật từ console
window.toggleNewYearEffects = () => {
    if (window.newYearEffects) {
        window.newYearEffects.toggle();
        console.log('🎄 Hiệu ứng Noel:', window.newYearEffects.isActive ? 'BẬT ✅' : 'TẮT ❌');
    }
};
/**
 * 🦌 REINDEER GIF CONTINUOUS ANIMATION
 * Đảm bảo GIF con hưu luôn chạy liên tục không bị dừng
 */
ensureReindeerContinuous() {
    const reindeerGif = document.querySelector('.reindeer-on-card');
    if (reindeerGif) {
        // Thêm thuộc tính loop cho GIF để tự động lặp lại
        reindeerGif.style.animationIterationCount = 'infinite';

        // Đảm bảo GIF luôn được load và không bị cache
        const originalSrc = reindeerGif.src;

        // Thêm timestamp để tránh cache và đảm bảo GIF luôn fresh
        const refreshGif = () => {
            const timestamp = new Date().getTime();
            reindeerGif.src = originalSrc + '?t=' + timestamp;
        };

        // Refresh GIF mỗi 30 giây để đảm bảo không bị stuck
        setInterval(refreshGif, 30000);

        // Click để refresh ngay lập tức
        reindeerGif.addEventListener('click', refreshGif);

        // Đảm bảo GIF được load đúng cách
        reindeerGif.addEventListener('error', () => {
            setTimeout(refreshGif, 100);
        });
    }
}