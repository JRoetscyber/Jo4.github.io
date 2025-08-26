/**
 * JO4 Website - Animations and Visual Effects
 * Last updated: 2025-08-26 21:57:44 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize counter animations
    initCounterAnimations();
    
    // Initialize typing effects
    initTypingEffects();
    
    // Initialize skill bar animations
    initSkillBarAnimations();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize scroll-triggered animations
    initScrollTriggeredAnimations();
    
    // Log initialization
    console.log('JO4 Animations initialized | ' + new Date().toISOString());
});

/**
 * Initialize reveal animations for elements as they scroll into view
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;
    
    // Configure intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 15% of the element needs to be visible
    };
    
    // Create observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add revealed class with delay based on data attribute
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('revealed');
                }, delay);
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    revealElements.forEach(element => {
        // Set initial state (if not already set in CSS)
        if (!element.style.opacity) {
            element.style.opacity = '0';
        }
        
        // Begin observing
        revealObserver.observe(element);
    });
}

/**
 * Initialize parallax scrolling effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (!parallaxElements.length) return;
    
    // Store initial positions
    parallaxElements.forEach(element => {
        element.initialOffsetTop = element.getBoundingClientRect().top + window.pageYOffset;
    });
    
    // Update positions on scroll with performance optimization
    const handleScroll = () => {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            // Only process if element is in viewport range
            const rect = element.getBoundingClientRect();
            const isInViewportRange = 
                rect.bottom > -window.innerHeight && 
                rect.top < window.innerHeight * 2;
                
            if (isInViewportRange) {
                const speed = parseFloat(element.getAttribute('data-speed') || 0.5);
                const yOffset = (scrollPosition - element.initialOffsetTop) * speed;
                
                // Apply transform using translate3d for GPU acceleration
                element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            }
        });
    };
    
    // Use requestAnimationFrame for smooth scrolling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial positioning
    handleScroll();
}

/**
 * Initialize counter animations for statistics
 */
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    if (!counterElements.length) return;
    
    // Configure intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Counter visible when 50% in view
    };
    
    // Create observer
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target') || 0);
                const duration = parseInt(element.getAttribute('data-duration') || 2000);
                const prefix = element.getAttribute('data-prefix') || '';
                const suffix = element.getAttribute('data-suffix') || '';
                const separator = element.hasAttribute('data-separator') ? 
                                  element.getAttribute('data-separator') : ',';
                
                // Don't animate if already done
                if (element.classList.contains('counted')) return;
                
                // Initialize counter
                let start = 0;
                const increment = target / (duration / 16); // Update every 16ms (60fps)
                element.textContent = prefix + '0' + suffix;
                
                // Start counting
                const counter = setInterval(() => {
                    start += increment;
                    
                    // Format number if needed
                    const formatted = formatNumber(Math.floor(start), separator);
                    element.textContent = prefix + formatted + suffix;
                    
                    // Stop when target reached
                    if (start >= target) {
                        element.textContent = prefix + formatNumber(target, separator) + suffix;
                        element.classList.add('counted');
                        clearInterval(counter);
                    }
                }, 16);
                
                // Stop observing after animation started
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all counter elements
    counterElements.forEach(element => {
        counterObserver.observe(element);
    });
    
    // Format number with commas or custom separator
    function formatNumber(num, separator = ',') {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
}

/**
 * Initialize typing effects for text elements
 */
function initTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-effect');
    if (!typingElements.length) return;
    
    // Configure intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    // Create observer
    const typingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Skip if already typed
                if (element.classList.contains('typed')) return;
                
                const text = element.getAttribute('data-text');
                const speed = parseInt(element.getAttribute('data-speed') || 100);
                const startDelay = parseInt(element.getAttribute('data-start-delay') || 0);
                const cursorDuration = parseInt(element.getAttribute('data-cursor-duration') || 0);
                
                // Clear any existing content
                element.textContent = '';
                
                // Start typing after delay
                setTimeout(() => {
                    let charIndex = 0;
                    
                    // Add typing class for cursor effect
                    element.classList.add('typing');
                    
                    const typeInterval = setInterval(() => {
                        if (charIndex < text.length) {
                            element.textContent += text.charAt(charIndex);
                            charIndex++;
                        } else {
                            clearInterval(typeInterval);
                            
                            // Remove typing class after cursor duration (if specified)
                            if (cursorDuration) {
                                setTimeout(() => {
                                    element.classList.remove('typing');
                                    element.classList.add('typed');
                                }, cursorDuration);
                            } else {
                                element.classList.remove('typing');
                                element.classList.add('typed');
                            }
                        }
                    }, speed);
                }, startDelay);
                
                // Stop observing after animation started
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all typing elements
    typingElements.forEach(element => {
        typingObserver.observe(element);
    });
}

/**
 * Initialize skill bar animations
 */
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-level');
    if (!skillBars.length) return;
    
    // Configure intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Create observer
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Skip if already animated
                if (element.classList.contains('animated')) return;
                
                const targetWidth = element.getAttribute('data-progress') || element.style.width || '0%';
                
                // Reset width
                element.style.width = '0%';
                
                // Animate width after short delay
                setTimeout(() => {
                    element.style.transition = 'width 1.2s ease-in-out';
                    element.style.width = targetWidth;
                    element.classList.add('animated');
                }, 200);
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all skill bars
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

/**
 * Initialize hover effects for interactive elements
 */
function initHoverEffects() {
    // Card hover effects
    const hoverCards = document.querySelectorAll('.hover-card');
    
    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
    
    // 3D tilt effect for featured elements
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX * 10; // -10 to 10 degrees
            const deltaY = (y - centerY) / centerY * 10; // -10 to 10 degrees
            
            this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            this.style.transition = 'transform 0.5s ease';
        });
    });
    
    // Float effect for buttons and icons
    const floatElements = document.querySelectorAll('.float-effect');
    
    floatElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('floating');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('floating');
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollTriggeredAnimations() {
    // Image zoom effect on scroll
    const zoomImages = document.querySelectorAll('.zoom-on-scroll');
    
    if (zoomImages.length) {
        const zoomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('zoomed');
                } else {
                    // Optionally remove the class when out of view
                    // entry.target.classList.remove('zoomed');
                }
            });
        }, { threshold: 0.5 });
        
        zoomImages.forEach(image => {
            zoomObserver.observe(image);
        });
    }
    
    // Staggered list items animation
    const staggerLists = document.querySelectorAll('.stagger-list');
    
    if (staggerLists.length) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const listItems = entry.target.querySelectorAll('li');
                    listItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('revealed');
                        }, 100 * index);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        staggerLists.forEach(list => {
            staggerObserver.observe(list);
        });
    }
    
    // Slide-in elements from sides
    const slideElements = document.querySelectorAll('.slide-in-left, .slide-in-right');
    
    if (slideElements.length) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    slideObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        slideElements.forEach(element => {
            slideObserver.observe(element);
        });
    }
}

/**
 * Add fade-in animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
function fadeIn(element, duration = 400, callback) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            window.requestAnimationFrame(animate);
        } else if (typeof callback === 'function') {
            callback();
        }
    }
    
    window.requestAnimationFrame(animate);
}

/**
 * Add fade-out animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Optional callback after animation completes
 */
function fadeOut(element, duration = 400, callback) {
    element.style.opacity = '1';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(1 - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            window.requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    
    window.requestAnimationFrame(animate);
}

/**
 * Add slide-down animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideDown(element, duration = 400) {
    // Store original height
    element.style.display = 'block';
    const height = element.scrollHeight;
    
    // Start from 0 height
    element.style.overflow = 'hidden';
    element.style.height = '0px';
    element.style.paddingTop = '0px';
    element.style.paddingBottom = '0px';
    element.style.marginTop = '0px';
    element.style.marginBottom = '0px';
    element.style.opacity = '0';
    
    // Trigger reflow
    element.offsetHeight;
    
    // Add transition
    element.style.transition = `height ${duration}ms ease, 
                               padding ${duration}ms ease, 
                               margin ${duration}ms ease, 
                               opacity ${duration}ms ease`;
    
    // Set target values
    element.style.height = height + 'px';
    element.style.opacity = '1';
    
    // Remove the 'zero' values
    setTimeout(() => {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
    }, duration);
}

/**
 * Add slide-up animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function slideUp(element, duration = 400) {
    // Set initial height
    element.style.height = element.offsetHeight + 'px';
    element.style.overflow = 'hidden';
    element.style.opacity = '1';
    
    // Trigger reflow
    element.offsetHeight;
    
    // Add transition
    element.style.transition = `height ${duration}ms ease, 
                               padding ${duration}ms ease, 
                               margin ${duration}ms ease, 
                               opacity ${duration}ms ease`;
    
    // Set target values
    element.style.height = '0px';
    element.style.paddingTop = '0px';
    element.style.paddingBottom = '0px';
    element.style.marginTop = '0px';
    element.style.marginBottom = '0px';
    element.style.opacity = '0';
    
    // Hide after animation
    setTimeout(() => {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('opacity');
    }, duration);
}

/**
 * Add bounce animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function bounce(element, duration = 600) {
    element.style.transform = 'scale(1)';
    element.style.transition = 'none';
    
    // Trigger reflow
    element.offsetHeight;
    
    // Add keyframe animation
    element.style.animation = `bounce ${duration}ms ease`;
    
    // Remove animation after completion
    setTimeout(() => {
        element.style.removeProperty('animation');
    }, duration);
}

/**
 * Add pulse animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function pulse(element, duration = 600) {
    element.style.transform = 'scale(1)';
    element.style.transition = 'none';
    
    // Trigger reflow
    element.offsetHeight;
    
    // Add keyframe animation
    element.style.animation = `pulse ${duration}ms ease`;
    
    // Remove animation after completion
    setTimeout(() => {
        element.style.removeProperty('animation');
    }, duration);
}

/**
 * Add shake animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function shake(element, duration = 600) {
    element.style.transform = 'translateX(0)';
    element.style.transition = 'none';
    
    // Trigger reflow
    element.offsetHeight;
    
    // Add keyframe animation
    element.style.animation = `shake ${duration}ms ease`;
    
    // Remove animation after completion
    setTimeout(() => {
        element.style.removeProperty('animation');
    }, duration);
}