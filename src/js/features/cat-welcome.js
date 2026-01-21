/* ========================================
   🐱 HIỆU ỨNG CHÀO MỪNG CON MÈO - CHỈ CHO NGƯỜI DÙNG MỚI
   ======================================== */

class CatWelcome {
    constructor() {
        this.hasVisited = localStorage.getItem('catWelcomeShown');
        this.init();
    }

    init() {
        // Chỉ hiện cho người dùng mới (chưa từng vào)
        // TEMP: Force show for testing - remove this line in production
        if (!this.hasVisited || window.location.search.includes('showcat=1')) {
            this.createWelcomeAnimation();
            // Đánh dấu đã xem (chỉ khi không phải test)
            if (!window.location.search.includes('showcat=1')) {
                localStorage.setItem('catWelcomeShown', 'true');
            }
        }
    }

    createWelcomeAnimation() {
        // Tạo container cho hiệu ứng
        const welcomeContainer = document.createElement('div');
        welcomeContainer.className = 'cat-welcome-container';

        // Tạo sợi dây
        const rope = document.createElement('div');
        rope.className = 'cat-rope';

        // Tạo con mèo
        const catGif = document.createElement('img');
        catGif.src = 'assets/images/Cat Hello GIF by Mikitti.gif';
        catGif.className = 'cat-hello-gif';
        catGif.alt = 'Chào mừng!';
        catGif.style.cssText = `
            width: 120px;
            height: 120px;
            object-fit: contain;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

        // Error handling cho GIF
        catGif.onerror = () => {
            console.warn('Cat GIF not found, using fallback');
            catGif.style.cssText += `
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
            `;
            catGif.innerHTML = '🐱';
            catGif.removeAttribute('src');
        };

        catGif.onload = () => {
            console.log('✅ Cat GIF loaded successfully!');
        };

        // Tạo bubble chào
        const welcomeBubble = document.createElement('div');
        welcomeBubble.className = 'welcome-bubble';
        welcomeBubble.innerHTML = `
            <div class="bubble-text">
                🎉 Chào mừng bạn đến với<br>
                <strong>QuizTva Studio!</strong>
            </div>
        `;

        // Ghép các elements
        welcomeContainer.appendChild(rope);
        welcomeContainer.appendChild(catGif);
        welcomeContainer.appendChild(welcomeBubble);

        // Thêm vào body
        document.body.appendChild(welcomeContainer);

        // Bắt đầu animation
        this.startAnimation(welcomeContainer, rope, catGif, welcomeBubble);
    }

    startAnimation(container, rope, cat, bubble) {
        // Phase 1: Thả dây xuống (1.5s)
        setTimeout(() => {
            rope.classList.add('rope-drop');
            cat.classList.add('cat-drop');
        }, 500);

        // Phase 2: Hiện bubble chào (2.5s)
        setTimeout(() => {
            bubble.classList.add('bubble-show');
        }, 2000);

        // Phase 3: Ẩn bubble (4s)
        setTimeout(() => {
            bubble.classList.add('bubble-hide');
        }, 4000);

        // Phase 4: Thu dây lên nhanh (4.5s)
        setTimeout(() => {
            rope.classList.add('rope-retract');
            cat.classList.add('cat-retract');
        }, 4500);

        // Phase 5: Xóa hoàn toàn (6s)
        setTimeout(() => {
            container.classList.add('welcome-fade-out');
            setTimeout(() => {
                container.remove();
            }, 500);
        }, 6000);
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Đợi một chút để trang load xong
    setTimeout(() => {
        new CatWelcome();
    }, 800);
});