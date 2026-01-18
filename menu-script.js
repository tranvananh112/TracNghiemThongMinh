// Menu functionality với hiệu ứng bubble
class MenuManager {
    constructor() {
        this.menuItems = document.querySelectorAll('.menu-item');
        this.activeBubble = document.querySelector('.bubble.active');
        this.hoverBubble = document.querySelector('.bubble.hover');
        this.currentActive = document.querySelector('.menu-item.active');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBubblePosition();
    }

    setupEventListeners() {
        this.menuItems.forEach(item => {
            // Click event
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveItem(item);
            });

            // Hover events
            item.addEventListener('mouseenter', () => {
                this.showHoverBubble(item);
            });

            item.addEventListener('mouseleave', () => {
                this.hideHoverBubble();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    setActiveItem(newActiveItem) {
        // Remove active class from current item
        this.currentActive?.classList.remove('active');

        // Add active class to new item
        newActiveItem.classList.add('active');
        this.currentActive = newActiveItem;

        // Update bubble position
        this.updateBubblePosition();

        // Trigger function based on data attribute
        const functionName = newActiveItem.dataset.function;
        this.triggerFunction(functionName);

        // Add ripple effect
        this.addRippleEffect(newActiveItem);
    }

    updateBubblePosition() {
        if (!this.currentActive) return;

        const rect = this.currentActive.getBoundingClientRect();
        const containerRect = this.currentActive.closest('.menu-nav').getBoundingClientRect();

        // Calculate position relative to container
        const top = rect.top - containerRect.top;
        const left = rect.left - containerRect.left;
        const width = rect.width;
        const height = rect.height;

        // Update active bubble position
        this.activeBubble.style.top = `${top}px`;
        this.activeBubble.style.left = `${left}px`;
        this.activeBubble.style.width = `${width}px`;
        this.activeBubble.style.height = `${height}px`;
    }

    showHoverBubble(item) {
        if (item === this.currentActive) return;

        const rect = item.getBoundingClientRect();
        const containerRect = item.closest('.menu-nav').getBoundingClientRect();

        const top = rect.top - containerRect.top;
        const left = rect.left - containerRect.left;
        const width = rect.width;
        const height = rect.height;

        this.hoverBubble.style.top = `${top}px`;
        this.hoverBubble.style.left = `${left}px`;
        this.hoverBubble.style.width = `${width}px`;
        this.hoverBubble.style.height = `${height}px`;
        this.hoverBubble.style.opacity = '0.3';
    }

    hideHoverBubble() {
        this.hoverBubble.style.opacity = '0';
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 100;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width - size) / 2 + 'px';
        ripple.style.top = (rect.height - size) / 2 + 'px';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleKeyboardNavigation(e) {
        const currentIndex = Array.from(this.menuItems).indexOf(this.currentActive);
        let newIndex;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                newIndex = (currentIndex + 1) % this.menuItems.length;
                this.setActiveItem(this.menuItems[newIndex]);
                break;
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentIndex === 0 ? this.menuItems.length - 1 : currentIndex - 1;
                this.setActiveItem(this.menuItems[newIndex]);
                break;
            case 'Enter':
                e.preventDefault();
                this.triggerFunction(this.currentActive.dataset.function);
                break;
        }
    }

    triggerFunction(functionName) {
        // Simulate function calls - replace with actual functionality
        const functions = {
            'home': () => {
                console.log('Navigating to Home');
                this.showNotification('Đang chuyển đến Trang Chủ', 'info');
            },
            'create-quiz': () => {
                console.log('Opening Create Quiz');
                this.showNotification('Mở trang Tạo Bài Quiz', 'success');
            },
            'ai-quiz': () => {
                console.log('Opening AI Quiz Creator');
                this.showNotification('Khởi động AI Tạo Quiz', 'info');
            },
            'create-room': () => {
                console.log('Creating Exam Room');
                this.showNotification('Tạo Phòng Thi mới', 'success');
            },
            'explore': () => {
                console.log('Exploring Tests');
                this.showNotification('Khám phá các đề thi', 'info');
            },
            'manage': () => {
                console.log('Managing Quizzes');
                this.showNotification('Quản lý Quiz của bạn', 'warning');
            },
            'take-quiz': () => {
                console.log('Taking Quiz');
                this.showNotification('Bắt đầu làm bài', 'success');
            },
            'results': () => {
                console.log('Viewing Results');
                this.showNotification('Xem kết quả', 'info');
            },
            'admin': () => {
                console.log('Admin Reports');
                this.showNotification('Truy cập báo cáo Admin', 'warning');
            }
        };

        if (functions[functionName]) {
            functions[functionName]();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        // Set background color based on type
        const colors = {
            'info': '#4A90E2',
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#F44336'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(style);

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
});

// Handle window resize
window.addEventListener('resize', () => {
    const menuManager = window.menuManager;
    if (menuManager) {
        menuManager.updateBubblePosition();
    }
});