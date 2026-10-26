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
    });
})();
