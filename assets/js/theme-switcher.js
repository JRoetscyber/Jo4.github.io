/**
 * JO4 Website - Theme Switcher
 * Last updated: 2025-08-26 21:59:59 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Log initialization
    console.log('JO4 Theme Switcher initialized | ' + new Date().toISOString());
});

/**
 * Initialize theme switcher functionality
 */
function initThemeSwitcher() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const storedTheme = localStorage.getItem('jo4-theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on stored preference or system preference
    let currentTheme;
    
    if (storedTheme) {
        currentTheme = storedTheme;
    } else {
        currentTheme = prefersDarkScheme ? 'dark' : 'light';
    }
    
    // Apply the theme
    setTheme(currentTheme);
    
    // Add click event to toggles
    themeToggles.forEach(toggle => {
        // Set initial aria-label based on current theme
        updateToggleState(toggle, currentTheme);
        
        toggle.addEventListener('click', function() {
            // Toggle the theme
            const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            
            // Apply the new theme
            setTheme(newTheme);
            
            // Update toggle states
            themeToggles.forEach(t => {
                updateToggleState(t, newTheme);
            });
            
            // Store preference
            localStorage.setItem('jo4-theme', newTheme);
        });
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only apply if user hasn't explicitly chosen a theme
        if (!localStorage.getItem('jo4-theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            
            // Update toggle states
            themeToggles.forEach(t => {
                updateToggleState(t, newTheme);
            });
        }
    });
}

/**
 * Apply theme to the document
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function setTheme(theme) {
    // Set theme attribute on body
    document.body.setAttribute('data-theme', theme);
    
    // For compatibility with older code that might use classes
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    }
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

/**
 * Update the toggle button state
 * @param {HTMLElement} toggle - The toggle button element
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateToggleState(toggle, theme) {
    // Update icon based on current theme
    if (toggle.querySelector('i')) {
        const icon = toggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Update aria-label for accessibility
    toggle.setAttribute('aria-label', 
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
    );
}

/**
 * Get the current theme
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
    return document.body.getAttribute('data-theme') || 'light';
}

// Export theme functions for other scripts to use
window.themeUtils = {
    setTheme,
    getCurrentTheme
};