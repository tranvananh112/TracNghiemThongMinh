/* ========================================
   THEME TOGGLE MANAGER - QUẢN LÝ CHUYỂN ĐỔI THEME
   ======================================== */

class ThemeToggleManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggleButton = null;
        this.init();
    }

    init() {
        // Đợi DOM load xong
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
        } else {
            this.setupThemeToggle();
        }
    }

    setupThemeToggle() {
        this.toggleButton = document.getElementById('theme-toggle-input');

        if (!this.toggleButton) {
            console.warn('⚠️ Theme toggle button not found');
            return;
        }

        // Load saved theme
        this.loadSavedTheme();

        // Add event listener
        this.toggleButton.addEventListener('change', (e) => {
            this.toggleTheme(e.target.checked);
        });

        console.log('🌙 Theme Toggle Manager initialized');
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;

        if (savedTheme === 'dark') {
            this.toggleButton.checked = true;
            document.body.classList.add('dark-theme');
        } else {
            this.toggleButton.checked = false;
            document.body.classList.remove('dark-theme');
        }

        console.log(`🎨 Loaded theme: ${savedTheme}`);
    }

    toggleTheme(isDark) {
        if (isDark) {
            this.setDarkTheme();
        } else {
            this.setLightTheme();
        }
    }

    setDarkTheme() {
        this.currentTheme = 'dark';
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');

        // Trigger custom event for other components
        this.dispatchThemeChangeEvent('dark');

        console.log('🌙 Switched to dark theme');
    }

    setLightTheme() {
        this.currentTheme = 'light';
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');

        // Trigger custom event for other components
        this.dispatchThemeChangeEvent('light');

        console.log('☀️ Switched to light theme');
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    isLightTheme() {
        return this.currentTheme === 'light';
    }

    // Public method to programmatically change theme
    setTheme(theme) {
        if (theme === 'dark') {
            this.toggleButton.checked = true;
            this.setDarkTheme();
        } else {
            this.toggleButton.checked = false;
            this.setLightTheme();
        }
    }
}

// Initialize theme toggle manager
const themeToggleManager = new ThemeToggleManager();

// Export for global access
window.themeToggleManager = themeToggleManager;

// Listen for theme change events (for other components)
document.addEventListener('themeChanged', (e) => {
    const theme = e.detail.theme;
    console.log(`🎨 Theme changed to: ${theme}`);

    // Update carousel colors if needed
    if (window.exploreQuizManager) {
        // Refresh carousel with new theme colors
        // This can be extended later if needed
    }

    // Update other components as needed
    // Add more theme-aware component updates here
});

console.log('🌙 Theme Toggle script loaded');