<<<<<<< HEAD
// ==========================================================================
// SONICFLOW THEME MANAGER
// Enforces pure obsidian black dark mode permanently across all pages
// ==========================================================================

(function() {
    // Lock dark mode on <html> and in localStorage
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sonicflow_theme', 'dark');

    document.addEventListener('DOMContentLoaded', function() {
        document.documentElement.setAttribute('data-theme', 'dark');
=======
﻿// ==========================================================================
// SONICFLOW THEME MANAGER (DARK & LIGHT MODE)
// Persists theme preference across pages and manages toggle buttons
// ==========================================================================

(function() {
    // 1. Determine Initial Theme
    const storedTheme = localStorage.getItem('sonicflow_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

    // 2. Apply Theme Immediately to <html>
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 3. Helper to update UI toggles
    function updateThemeUI(theme) {
        const isDark = theme === 'dark';
        const toggleButtons = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #sidebarThemeToggle');
        
        toggleButtons.forEach(btn => {
            const icon = btn.querySelector('.theme-icon');
            const label = btn.querySelector('.theme-label');
            
            if (icon) {
                icon.textContent = isDark ? '☀️' : '🌙';
            }
            if (label) {
                label.textContent = isDark ? 'Light' : 'Dark';
            }
            btn.setAttribute('title', isDark ? 'Switch to Light mode' : 'Switch to Dark mode');
            btn.setAttribute('aria-label', isDark ? 'Switch to Light mode' : 'Switch to Dark mode');
        });
    }

    // 4. Toggle function
    window.toggleSonicFlowTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sonicflow_theme', newTheme);
        updateThemeUI(newTheme);
    };

    // 5. Initialize listeners on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateThemeUI(activeTheme);

        // Bind click events
        document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn, #sidebarThemeToggle').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                window.toggleSonicFlowTheme();
            });
        });
>>>>>>> f488952eac721cff9e8db671353847099801d9b0
    });
})();
