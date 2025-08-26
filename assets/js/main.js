/**
 * JO4 Website - Main JavaScript File
 * Last updated: 2025-08-26 21:55:27 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize carousel
    initCarousel();
    
    // Initialize modal functionality
    initModals();
    
    // Initialize form validation and submission
    initForms();
    
    // Initialize copyright year
    updateCopyrightYear();
    
    // Initialize last updated date
    updateLastUpdated();
    
    // Initialize image lazy loading
    initLazyLoading();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize tooltips
    initTooltips();
    
    // Log initialization
    console.log('JO4 Main scripts initialized | ' + new Date().toISOString());
});

/**
 * Initialize mobile navigation functionality
 */
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle navigation visibility
        this.setAttribute('aria-expanded', !expanded);
        navLinks.classList.toggle('nav-open');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = expanded ? 'fas fa-bars' : 'fas fa-times';
        }
        
        // Toggle body scroll
        document.body.classList.toggle('nav-active', !expanded);
    });
    
    // Close mobile nav when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) { // Only trigger on mobile
                mobileToggle.click();
            }
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && // Only on mobile
            navLinks.classList.contains('nav-open') && 
            !navLinks.contains(event.target) && 
            !mobileToggle.contains(event.target)) {
            mobileToggle.click();
        }
    });
    
    // Handle ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinks.classList.contains('nav-open')) {
            mobileToggle.click();
        }
    });
}

/**
 * Initialize back to top button functionality
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Show button after scrolling down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize carousel functionality
 */
function initCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const carouselInner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        if (!carouselInner || !items.length) return;
        
        // Set initial state
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Set up the carousel
        setupCarousel();
        
        // Navigate to previous slide
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                navigateCarousel('prev');
            });
        }
        
        // Navigate to next slide
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                navigateCarousel('next');
            });
        }
        
        // Handle touch events for swipe
        carouselInner.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselInner.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        // Set up carousel based on number of items
        function setupCarousel() {
            // Position items
            items.forEach((item, index) => {
                item.style.transform = `translateX(${index * 100}%)`;
                
                // Add ARIA attributes for accessibility
                item.setAttribute('aria-hidden', index !== 0);
                item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            });
            
            // Add indicators if there are more than one item
            if (items.length > 1 && !carousel.querySelector('.carousel-indicators')) {
                const indicators = document.createElement('div');
                indicators.className = 'carousel-indicators';
                
                for (let i = 0; i < items.length; i++) {
                    const dot = document.createElement('button');
                    dot.className = i === 0 ? 'active' : '';
                    dot.setAttribute('aria-label', `Slide ${i + 1}`);
                    
                    dot.addEventListener('click', function() {
                        goToSlide(i);
                    });
                    
                    indicators.appendChild(dot);
                }
                
                carousel.appendChild(indicators);
            }
            
            // Auto rotate if data attribute is set
            const autoRotate = carousel.getAttribute('data-auto-rotate');
            if (autoRotate && !isNaN(autoRotate)) {
                setInterval(function() {
                    navigateCarousel('next');
                }, parseInt(autoRotate));
            }
        }
        
        // Navigate carousel in a direction
        function navigateCarousel(direction) {
            const indicators = carousel.querySelectorAll('.carousel-indicators button');
            
            // Update current index
            if (direction === 'prev') {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            } else {
                currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            }
            
            // Update slide positions
            updateSlidePositions();
            
            // Update indicators
            if (indicators.length) {
                indicators.forEach((indicator, index) => {
                    indicator.className = index === currentIndex ? 'active' : '';
                });
            }
        }
        
        // Go to a specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateSlidePositions();
            
            // Update indicators
            const indicators = carousel.querySelectorAll('.carousel-indicators button');
            if (indicators.length) {
                indicators.forEach((indicator, idx) => {
                    indicator.className = idx === currentIndex ? 'active' : '';
                });
            }
        }
        
        // Update slide positions based on current index
        function updateSlidePositions() {
            items.forEach((item, index) => {
                // Calculate position relative to current index
                const position = index - currentIndex;
                item.style.transform = `translateX(${position * 100}%)`;
                
                // Update ARIA attributes
                item.setAttribute('aria-hidden', index !== currentIndex);
                item.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
            });
        }
        
        // Handle swipe gesture
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum swipe distance
            const swipeDistance = touchEndX - touchStartX;
            
            if (swipeDistance > swipeThreshold) {
                // Swiped right - go to previous
                navigateCarousel('prev');
            } else if (swipeDistance < -swipeThreshold) {
                // Swiped left - go to next
                navigateCarousel('next');
            }
        }
    });
}

/**
 * Initialize modal functionality
 */
function initModals() {
    // Find all modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    
    // Set up triggers
    modalTriggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(modalId);
        
        if (!modal) return;
        
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(modal);
        });
    });
    
    // Set up close buttons and overlay clicks
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal);
            });
        }
        
        // Close when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
    
    // Open modal function
    window.openModal = function(modal) {
        if (!modal) return;
        
        // Add 'show' class to display modal
        modal.classList.add('show');
        
        // Prevent body scrolling
        document.body.classList.add('modal-open');
        
        // Set focus to first focusable element
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) {
            focusable[0].focus();
        }
        
        // Fire custom event
        modal.dispatchEvent(new CustomEvent('modal:open'));
    };
    
    // Close modal function
    window.closeModal = function(modal) {
        if (!modal) return;
        
        // Remove 'show' class to hide modal
        modal.classList.remove('show');
        
        // Restore body scrolling
        const openModals = document.querySelectorAll('.modal.show');
        if (openModals.length === 0) {
            document.body.classList.remove('modal-open');
        }
        
        // Fire custom event
        modal.dispatchEvent(new CustomEvent('modal:close'));
    };
}

/**
 * Initialize form validation and submission
 */
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip if form has data-no-validate attribute
        if (form.hasAttribute('data-no-validate')) return;
        
        // Add validation styles
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Find first invalid field and focus it
                const invalidField = form.querySelector(':invalid');
                if (invalidField) {
                    invalidField.focus();
                }
            }
            
            form.classList.add('was-validated');
        });
        
        // Check for honeypot field (anti-spam)
        if (form.querySelector('[name="honeypot"]')) {
            form.addEventListener('submit', function(event) {
                const honeypot = form.querySelector('[name="honeypot"]');
                if (honeypot.value) {
                    event.preventDefault();
                    console.log('Spam submission prevented');
                }
            });
        }
        
        // Custom email validation with feedback
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (field.value && !isValidEmail(field.value)) {
                    field.setCustomValidity('Please enter a valid email address');
                } else {
                    field.setCustomValidity('');
                }
            });
        });
        
        // Phone number formatting
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            field.addEventListener('input', function() {
                let value = field.value.replace(/\D/g, '');
                
                // Apply basic formatting
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 6) {
                        value = value.slice(0, 3) + ' ' + value.slice(3);
                    } else {
                        value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
                    }
                    
                    field.value = value;
                }
            });
        });
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }
}

/**
 * Update copyright year
 */
function updateCopyrightYear() {
    const yearElements = document.querySelectorAll('.copyright-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Update last updated timestamp
 */
function updateLastUpdated() {
    const elements = document.querySelectorAll('.last-updated');
    const username = document.querySelectorAll('.username');
    
    // Set the last updated date
    elements.forEach(element => {
        element.textContent = '2025-08-26 21:55:27';
    });
    
    // Set the username if available
    username.forEach(element => {
        element.textContent = 'JRoetscyber';
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        // Use native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.loading = 'lazy';
        });
        
        // Also handle iframes
        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        lazyIframes.forEach(iframe => {
            iframe.src = iframe.dataset.src;
            iframe.loading = 'lazy';
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src], iframe[data-src]');
        
        if (!lazyImages.length) return;
        
        // Create intersection observer
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add('loaded');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        // Observe each lazy image
        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset (if fixed header)
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate position
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                // Scroll smoothly
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL but don't scroll again
                history.pushState(null, null, targetId);
                
                // Set focus to element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({preventScroll: true});
            }
        });
    });
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    if (!tooltipElements.length) return;
    
    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        
        // Add position class if specified
        const position = element.getAttribute('data-tooltip-position') || 'top';
        tooltip.classList.add(`tooltip-${position}`);
        
        // Append tooltip to element
        element.appendChild(tooltip);
        
        // Toggle tooltip on hover/focus
        element.addEventListener('mouseenter', () => {
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
        
        element.addEventListener('focus', () => {
            tooltip.classList.add('visible');
        });
        
        element.addEventListener('blur', () => {
            tooltip.classList.remove('visible');
        });
    });
}

/**
 * Helper function to check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom >= 0 &&
        rect.right >= 0
    );
}

/**
 * Helper function to debounce function calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Helper function to throttle function calls
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}