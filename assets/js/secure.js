/**
 * JO4 SECURE - Cybersecurity Services
 * Last updated: 2025-08-26 21:15:02 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize project expanders
    initProjectExpanders();
    
    // Initialize syntax highlighting
    initSyntaxHighlighting();
    
    // Initialize code copy functionality
    initCodeCopy();
    
    // Initialize service selectors
    initServiceSelectors();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
    
    // Initialize tool tooltips
    initToolTooltips();
    
    // Log initialization
    console.log('JO4 SECURE page initialized | ' + new Date().toISOString());
});

/**
 * Initialize project card expanders
 */
function initProjectExpanders() {
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!projectCards.length) return;
    
    projectCards.forEach(card => {
        const toggleBtn = card.querySelector('.project-expand-toggle button');
        const content = card.querySelector('.project-content');
        
        if (!toggleBtn || !content) return;
        
        // Set initial state
        const isInitiallyExpanded = card.classList.contains('expanded');
        
        if (!isInitiallyExpanded) {
            // Measure full height for animation
            content.style.height = 'auto';
            const fullHeight = content.offsetHeight;
            
            // Set collapsed height (showing just description)
            const descriptionHeight = card.querySelector('.project-description h4').offsetHeight + 
                                     card.querySelector('.project-description p').offsetHeight + 50; // Add some padding
            
            content.style.height = `${descriptionHeight}px`;
            content.style.overflow = 'hidden';
        }
        
        // Toggle button click handler
        toggleBtn.addEventListener('click', function() {
            const isExpanded = card.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse card
                card.classList.remove('expanded');
                this.textContent = 'Read Full Case Study';
                
                // Animate collapse
                const descriptionHeight = card.querySelector('.project-description h4').offsetHeight + 
                                         card.querySelector('.project-description p').offsetHeight + 50;
                
                content.style.height = `${content.offsetHeight}px`;
                content.offsetHeight; // Force reflow
                content.style.transition = 'height 0.5s ease';
                content.style.height = `${descriptionHeight}px`;
                
                // Track collapse
                if (typeof gtag === 'function') {
                    gtag('event', 'project_collapse', {
                        'event_category': 'engagement',
                        'event_label': card.id || 'Project Card'
                    });
                }
            } else {
                // Expand card
                card.classList.add('expanded');
                this.textContent = 'Show Less';
                
                // Animate expansion
                content.style.height = 'auto';
                const fullHeight = content.offsetHeight;
                content.style.height = `${content.offsetHeight}px`;
                content.offsetHeight; // Force reflow
                content.style.transition = 'height 0.5s ease';
                content.style.height = `${fullHeight}px`;
                
                // Remove fixed height after animation
                setTimeout(() => {
                    content.style.height = 'auto';
                }, 500);
                
                // Track expansion
                if (typeof gtag === 'function') {
                    gtag('event', 'project_expand', {
                        'event_category': 'engagement',
                        'event_label': card.id || 'Project Card'
                    });
                }
                
                // Scroll card into view if needed
                const cardRect = card.getBoundingClientRect();
                if (cardRect.top < 0) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const scrollTarget = window.pageYOffset + cardRect.top - headerHeight - 20;
                    
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initialize syntax highlighting with Prism
 */
function initSyntaxHighlighting() {
    // Check if Prism is loaded
    if (typeof Prism === 'undefined') {
        console.warn('Prism.js is not loaded for syntax highlighting');
        return;
    }
    
    // Apply highlighting
    Prism.highlightAll();
    
    // Handle theme changes
    document.addEventListener('themeChanged', function(e) {
        // Re-apply highlighting when theme changes
        setTimeout(() => {
            Prism.highlightAll();
        }, 50);
    });
}

/**
 * Initialize code copy functionality
 */
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (!codeBlocks.length) return;
    
    codeBlocks.forEach(block => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
        copyBtn.setAttribute('title', 'Copy code');
        
        // Add button to pre element (parent of code)
        const preElement = block.parentNode;
        preElement.classList.add('code-block');
        preElement.appendChild(copyBtn);
        
        // Copy button click handler
        copyBtn.addEventListener('click', function() {
            // Get code text
            const code = block.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Show success state
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.classList.add('success');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.classList.remove('success');
                }, 2000);
                
                // Track copy
                if (typeof gtag === 'function') {
                    gtag('event', 'code_copy', {
                        'event_category': 'engagement',
                        'event_label': 'Code Snippet Copy'
                    });
                }
            }).catch(err => {
                // Show error state
                copyBtn.innerHTML = '<i class="fas fa-times"></i>';
                copyBtn.classList.add('error');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.classList.remove('error');
                }, 2000);
                
                console.error('Could not copy code: ', err);
            });
        });
    });
}

/**
 * Initialize service selectors
 */
function initServiceSelectors() {
    const serviceCards = document.querySelectorAll('.service-card');
    const contactForm = document.getElementById('security-contact-form');
    const serviceTypeSelect = document.getElementById('service-type');
    
    if (!serviceCards.length || !contactForm || !serviceTypeSelect) return;
    
    serviceCards.forEach(card => {
        const serviceName = card.querySelector('h3')?.textContent;
        const serviceValue = slugify(serviceName);
        const ctaButton = card.querySelector('a.btn');
        
        if (ctaButton && serviceName) {
            ctaButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Set service type in dropdown
                for (let i = 0; i < serviceTypeSelect.options.length; i++) {
                    if (serviceTypeSelect.options[i].value === serviceValue || 
                        serviceTypeSelect.options[i].text === serviceName) {
                        serviceTypeSelect.selectedIndex = i;
                        break;
                    }
                }
                
                // Scroll to form
                contactForm.scrollIntoView({ behavior: 'smooth' });
                
                // Focus on first input after scroll completes
                setTimeout(() => {
                    const firstInput = contactForm.querySelector('input:not([type="hidden"])');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
                
                // Track service selection
                if (typeof gtag === 'function') {
                    gtag('event', 'service_selection', {
                        'event_category': 'engagement',
                        'event_label': serviceName
                    });
                }
            });
        }
    });
    
    /**
     * Convert string to slug
     */
    function slugify(text) {
        return text.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}

/**
 * Initialize testimonials slider
 */
function initTestimonialsSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    let autoSlideInterval = null;
    
    // Initialize
    updateSlideState();
    startAutoSlide();
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
            resetAutoSlide();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide((currentIndex + 1) % slides.length);
            resetAutoSlide();
        });
    }
    
    // Pause auto-slide on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // Resume auto-slide on mouse leave
    slider.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        currentIndex = index;
        updateSlideState();
    }
    
    /**
     * Update slide state based on current index
     */
    function updateSlideState() {
        // Update slides
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.style.opacity = '0';
                slide.style.display = 'block';
                
                // Trigger reflow
                slide.offsetWidth;
                
                // Fade in
                slide.style.opacity = '1';
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.style.opacity = '0';
                slide.setAttribute('aria-hidden', 'true');
                
                // Hide after fade out
                setTimeout(() => {
                    if (index !== currentIndex) {
                        slide.style.display = 'none';
                    }
                }, 500);
            }
        });
    }
    
    /**
     * Start auto-slide interval
     */
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide((currentIndex + 1) % slides.length);
        }, 7000); // Change slide every 7 seconds
    }
    
    /**
     * Reset auto-slide interval
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

/**
 * Initialize tool tooltips
 */
function initToolTooltips() {
    const toolBadges = document.querySelectorAll('.tool-badge, .certification-badge');
    
    if (!toolBadges.length) return;
    
    toolBadges.forEach(badge => {
        // Add hover effect
        badge.addEventListener('mouseenter', function() {
            this.classList.add('badge-hover');
        });
        
        badge.addEventListener('mouseleave', function() {
            this.classList.remove('badge-hover');
        });
        
        // Add tooltip if description exists
        const description = badge.getAttribute('data-description');
        if (description) {
            // Make badge focusable for accessibility
            badge.setAttribute('tabindex', '0');
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = description;
            badge.appendChild(tooltip);
            
            // Show tooltip on focus for keyboard users
            badge.addEventListener('focus', function() {
                tooltip.classList.add('visible');
            });
            
            badge.addEventListener('blur', function() {
                tooltip.classList.remove('visible');
            });
        }
    });
}