/**
 * JO4 Website - Contact Page
 * Last updated: 2025-08-26 21:19:31 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ accordions
    initFaqAccordions();
    
    // Initialize contact methods selection
    initContactMethodsSelection();
    
    // Initialize map interactions
    initMapInteraction();
    
    // Initialize social media links tracking
    initSocialTracking();
    
    // Log initialization
    console.log('JO4 Contact page initialized | ' + new Date().toISOString());
});

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-toggle i');
        
        if (!question || !answer || !icon) return;
        
        // Set initial state
        if (!item.classList.contains('active')) {
            answer.style.height = '0';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
        }
        
        // Add click event listener
        question.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-toggle i');
                    
                    // Animate closing
                    otherAnswer.style.height = otherAnswer.scrollHeight + 'px';
                    otherAnswer.offsetHeight; // Force reflow
                    otherAnswer.style.height = '0';
                    otherAnswer.style.opacity = '0';
                    
                    // Update icon
                    if (otherIcon) {
                        otherIcon.className = 'fas fa-plus';
                    }
                    
                    // Remove active class
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                // Animate closing
                answer.style.height = answer.scrollHeight + 'px';
                answer.offsetHeight; // Force reflow
                answer.style.height = '0';
                answer.style.opacity = '0';
                
                // Update icon
                if (icon) {
                    icon.className = 'fas fa-plus';
                }
                
                // Remove active class
                item.classList.remove('active');
            } else {
                // Animate opening
                answer.style.height = '0';
                answer.style.display = 'block';
                const height = answer.scrollHeight;
                answer.style.height = height + 'px';
                answer.style.opacity = '1';
                
                // Update icon
                if (icon) {
                    icon.className = 'fas fa-minus';
                }
                
                // Add active class
                item.classList.add('active');
                
                // Track FAQ interaction
                if (typeof gtag === 'function') {
                    gtag('event', 'faq_open', {
                        'event_category': 'engagement',
                        'event_label': question.textContent.trim()
                    });
                }
            }
        });
        
        // Make FAQs keyboard accessible
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

/**
 * Initialize contact methods selection
 */
function initContactMethodsSelection() {
    const contactMethods = document.querySelectorAll('.contact-method-card');
    const contactForm = document.getElementById('contact-form');
    const subjectSelect = document.getElementById('subject');
    
    if (!contactMethods.length || !contactForm || !subjectSelect) return;
    
    contactMethods.forEach(method => {
        const methodBtn = method.querySelector('.btn');
        const methodTitle = method.querySelector('h3')?.textContent.trim();
        
        if (!methodBtn || !methodTitle) return;
        
        methodBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Set appropriate subject in dropdown
            let subjectValue = 'general';
            
            if (methodTitle.includes('SECURE')) {
                subjectValue = 'security';
            } else if (methodTitle.includes('Brew')) {
                subjectValue = 'coffee';
            } else if (methodTitle.includes('Estate')) {
                subjectValue = 'realestate';
            }
            
            // Select the appropriate option
            for (let i = 0; i < subjectSelect.options.length; i++) {
                if (subjectSelect.options[i].value === subjectValue) {
                    subjectSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Trigger any change event handlers
            const event = new Event('change');
            subjectSelect.dispatchEvent(event);
            
            // Scroll to form
            contactForm.scrollIntoView({ behavior: 'smooth' });
            
            // Focus on first field after scroll
            setTimeout(() => {
                const firstInput = contactForm.querySelector('input:not([type="hidden"])');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 800);
            
            // Track method selection
            if (typeof gtag === 'function') {
                gtag('event', 'contact_method_select', {
                    'event_category': 'engagement',
                    'event_label': methodTitle
                });
            }
        });
        
        // Add hover effects
        method.addEventListener('mouseenter', function() {
            this.classList.add('method-hover');
        });
        
        method.addEventListener('mouseleave', function() {
            this.classList.remove('method-hover');
        });
    });
    
    // Update contact form based on subject selection
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            const messageField = document.getElementById('message');
            
            if (!messageField) return;
            
            // Add custom placeholders based on selection
            switch (selectedValue) {
                case 'security':
                    messageField.setAttribute('placeholder', 'Please describe your security needs, project scope, and any specific requirements.');
                    break;
                case 'coffee':
                    messageField.setAttribute('placeholder', 'Please provide details about your event, estimated guest count, and preferred date.');
                    break;
                case 'realestate':
                    messageField.setAttribute('placeholder', 'Please share information about the property you\'re interested in buying, selling, or renting.');
                    break;
                default:
                    messageField.setAttribute('placeholder', 'How can I help you?');
            }
        });
        
        // Trigger initial update
        subjectSelect.dispatchEvent(new Event('change'));
    }
}

/**
 * Initialize map interaction
 */
function initMapInteraction() {
    const mapWrapper = document.querySelector('.map-wrapper');
    const mapIframe = document.querySelector('.map-wrapper iframe');
    
    if (!mapWrapper || !mapIframe) return;
    
    // Handle lazy loading
    if ('loading' in HTMLIFrameElement.prototype) {
        // Browser supports native lazy loading
        mapIframe.loading = 'lazy';
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadMap = function() {
            if (isInViewport(mapWrapper)) {
                // Replace placeholder with actual map
                const src = mapIframe.getAttribute('data-src');
                if (src) {
                    mapIframe.src = src;
                }
                
                // Remove scroll listener after map is loaded
                window.removeEventListener('scroll', lazyLoadMap);
            }
        };
        
        // Set initial src if in viewport
        if (isInViewport(mapWrapper)) {
            const src = mapIframe.getAttribute('data-src');
            if (src) {
                mapIframe.src = src;
            }
        } else {
            // Add scroll listener to load map when in viewport
            window.addEventListener('scroll', lazyLoadMap);
        }
    }
    
    // Add loading animation
    mapIframe.addEventListener('load', function() {
        mapIframe.classList.add('loaded');
    });
    
    // Expand map on click if it has a data-full-src attribute
    if (mapWrapper.hasAttribute('data-full-src')) {
        const expandButton = document.createElement('button');
        expandButton.className = 'map-expand-btn';
        expandButton.innerHTML = '<i class="fas fa-expand-alt"></i>';
        expandButton.setAttribute('aria-label', 'Expand map');
        
        mapWrapper.appendChild(expandButton);
        
        expandButton.addEventListener('click', function() {
            const fullSrc = mapWrapper.getAttribute('data-full-src');
            
            // Create modal with larger map
            const mapModal = document.createElement('div');
            mapModal.className = 'map-modal';
            mapModal.innerHTML = `
                <div class="map-modal-content">
                    <button class="map-modal-close">&times;</button>
                    <iframe src="${fullSrc}" width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            `;
            
            document.body.appendChild(mapModal);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Add close button handler
            mapModal.querySelector('.map-modal-close').addEventListener('click', function() {
                mapModal.remove();
                document.body.style.overflow = ''; // Restore scrolling
            });
            
            // Close on click outside
            mapModal.addEventListener('click', function(e) {
                if (e.target === mapModal) {
                    mapModal.remove();
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
            
            // Track map expansion
            if (typeof gtag === 'function') {
                gtag('event', 'map_expand', {
                    'event_category': 'engagement',
                    'event_label': 'Map Expanded'
                });
            }
        });
    }
    
    /**
     * Check if element is in viewport
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
}

/**
 * Initialize social media link tracking
 */
function initSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-icons a, .social-media a');
    
    if (!socialLinks.length) return;
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label') || 
                           this.querySelector('i')?.className.replace('fab fa-', '').replace('fas fa-', '') || 
                           'social';
            
            // Track social click
            if (typeof gtag === 'function') {
                gtag('event', 'social_click', {
                    'event_category': 'engagement',
                    'event_label': platform,
                    'transport_type': 'beacon' // Allow the navigation to proceed
                });
            }
        });
    });
}

/**
 * Initialize direct contact buttons (phone, email, etc.)
 */
function initDirectContactButtons() {
    const contactButtons = document.querySelectorAll('.contact-info-item a, .contact-method-details a');
    
    if (!contactButtons.length) return;
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const contactType = this.href.startsWith('tel:') ? 'phone' : 
                              this.href.startsWith('mailto:') ? 'email' :
                              this.href.startsWith('https://wa.me/') ? 'whatsapp' : 'other';
            
            // Track contact button click
            if (typeof gtag === 'function') {
                gtag('event', 'direct_contact', {
                    'event_category': 'engagement',
                    'event_label': contactType,
                    'transport_type': 'beacon' // Allow the navigation to proceed
                });
            }
        });
    });
}

/**
 * Initialize emergency contact section
 */
function initEmergencyContact() {
    const emergencySection = document.querySelector('.emergency-contact');
    
    if (!emergencySection) return;
    
    // Add pulsing animation to emphasize emergency contact
    const pulseEffect = document.createElement('div');
    pulseEffect.className = 'emergency-pulse';
    
    emergencySection.prepend(pulseEffect);
    
    // Add click tracking
    const emergencyLinks = emergencySection.querySelectorAll('a');
    emergencyLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track emergency contact usage
            if (typeof gtag === 'function') {
                gtag('event', 'emergency_contact', {
                    'event_category': 'engagement',
                    'event_label': this.textContent.trim(),
                    'transport_type': 'beacon'
                });
            }
        });
    });
}

// Initialize all contact-specific features
document.addEventListener('DOMContentLoaded', function() {
    // Core functions already called at the top
    
    // Additional contact page functions
    initDirectContactButtons();
    initEmergencyContact();
    
    // Handle contact form subject pre-filling from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    
    if (subjectParam) {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            for (let i = 0; i < subjectSelect.options.length; i++) {
                if (subjectSelect.options[i].value === subjectParam) {
                    subjectSelect.selectedIndex = i;
                    
                    // Trigger change event
                    subjectSelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
        }
    }
});