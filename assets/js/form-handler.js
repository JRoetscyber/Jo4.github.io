/**
 * JO4 Website - Form Handler
 * Last updated: 2025-08-26 22:01:33 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form submissions
    initFormSubmissions();
    
    // Initialize booking form steps if exists
    initBookingForm();
    
    // Initialize property viewing requests
    initViewingRequests();
    
    // Initialize newsletter signup
    initNewsletterSignup();
    
    // Initialize form field masking
    initInputMasks();
    
    // Log initialization
    console.log('JO4 Form Handler initialized | ' + new Date().toISOString());
});

/**
 * Initialize form submissions with EmailJS
 */
function initFormSubmissions() {
    const forms = document.querySelectorAll('form:not([data-no-submit])');
    
    forms.forEach(form => {
        // Skip the newsletter forms (handled separately)
        if (form.id === 'newsletter-form' || form.id === 'security-newsletter-form') return;
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Check for honeypot field (anti-spam)
            const honeypot = form.querySelector('[name="honeypot"]');
            if (honeypot && honeypot.value) {
                console.log('Spam submission prevented');
                form.reset();
                return;
            }
            
            // Validate form
            if (!validateForm(form)) return;
            
            // Disable submit button and show loading state
            const submitBtn = form.querySelector('[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Determine which EmailJS template to use based on form ID
            let templateId = 'template_default';
            let serviceId = 'service_jo4_default';
            
            if (form.id === 'contact-form') {
                templateId = 'template_contact';
            } else if (form.id === 'booking-form') {
                templateId = 'template_booking';
            } else if (form.id === 'security-contact-form') {
                templateId = 'template_security';
            } else if (form.id === 'property-contact-form') {
                templateId = 'template_property';
            } else if (form.id === 'viewing-request-form') {
                templateId = 'template_viewing';
            }
            
            // Prepare form data
            const formData = new FormData(form);
            const templateParams = {};
            
            // Convert FormData to object for EmailJS
            formData.forEach((value, key) => {
                if (key !== 'honeypot') {
                    templateParams[key] = value;
                }
            });
            
            // Add metadata
            templateParams.form_id = form.id;
            templateParams.page_url = window.location.href;
            templateParams.submit_time = new Date().toISOString();
            
            // Send the form using EmailJS
            emailjs.send(serviceId, templateId, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    showFormMessage(form, 'success', 'Thank you! Your message has been sent successfully.');
                    
                    // Reset form
                    form.reset();
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    showFormMessage(form, 'error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
                })
                .finally(function() {
                    // Restore submit button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    
                    // Track form submission event with Google Analytics
                    if (typeof gtag === 'function') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Forms',
                            'event_label': form.id
                        });
                    }
                });
        });
    });
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form - Form to validate
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldInvalid(field, 'This field is required');
            isValid = false;
        } else {
            markFieldValid(field);
        }
    });
    
    // Check email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value.trim() && !isValidEmail(field.value)) {
            markFieldInvalid(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Check phone fields
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        if (field.value.trim() && !isValidPhone(field.value)) {
            markFieldInvalid(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Show form message (success or error)
 * @param {HTMLFormElement} form - Form element
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Message text
 */
function showFormMessage(form, type, message) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}-message`;
    messageEl.innerHTML = `<p>${message}</p>`;
    
    // Add close button for error messages
    if (type === 'error') {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'message-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close message');
        closeBtn.addEventListener('click', function() {
            messageEl.remove();
        });
        messageEl.appendChild(closeBtn);
    }
    
    // Insert before or after the submit button
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn && submitBtn.parentNode) {
        submitBtn.parentNode.insertBefore(messageEl, submitBtn);
    } else {
        form.appendChild(messageEl);
    }
    
    // Add entrance animation
    setTimeout(() => {
        messageEl.classList.add('visible');
    }, 10);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageEl.classList.remove('visible');
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }
}

/**
 * Mark a form field as invalid
 * @param {HTMLElement} field - Form field
 * @param {string} message - Error message
 */
function markFieldInvalid(field, message) {
    field.classList.add('is-invalid');
    
    // Add or update error message
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
    
    // Focus first invalid field
    if (document.querySelectorAll('.is-invalid').length === 1) {
        field.focus();
    }
}

/**
 * Mark a form field as valid
 * @param {HTMLElement} field - Form field
 */
function markFieldValid(field) {
    field.classList.remove('is-invalid');
    
    // Remove error message if exists
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
}

/**
 * Initialize booking form multi-step functionality
 */
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    const steps = bookingForm.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;
    
    // Initialize steps
    steps.forEach((step, index) => {
        if (index !== currentStep) {
            step.style.display = 'none';
        }
    });
    
    // Handle next button clicks
    const nextButtons = bookingForm.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStepElement = steps[currentStep];
            
            // Validate current step before proceeding
            if (!validateStep(currentStepElement)) return;
            
            // Hide current step
            currentStepElement.style.display = 'none';
            
            // Move to next step
            currentStep++;
            steps[currentStep].style.display = 'block';
            
            // Update progress indicator
            updateProgressIndicator();
            
            // Scroll to top of form
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Handle previous button clicks
    const prevButtons = bookingForm.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide current step
            steps[currentStep].style.display = 'none';
            
            // Move to previous step
            currentStep--;
            steps[currentStep].style.display = 'block';
            
            // Update progress indicator
            updateProgressIndicator();
        });
    });
    
    // Update progress indicator
    function updateProgressIndicator() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Validate the current step
    function validateStep(stepElement) {
        let isValid = true;
        
        // Get all required fields in this step
        const requiredFields = stepElement.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markFieldInvalid(field, 'This field is required');
                isValid = false;
            } else {
                markFieldValid(field);
            }
        });
        
        return isValid;
    }
    
    // Initialize date selection in calendar
    initBookingCalendar();
    
    // Initialize package selection
    initPackageSelection();
}

/**
 * Initialize booking calendar functionality
 */
function initBookingCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const bookingDateInput = document.getElementById('booking-date');
    const dateNextBtn = document.getElementById('date-next-btn');
    
    if (!calendarGrid || !monthYearElement) return;
    
    // Set up variables
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    // Generate and display calendar
    generateCalendar(currentMonth, currentYear);
    
    // Handle previous month button
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
    
    // Handle next month button
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
    
    // Generate the calendar for a given month and year
    function generateCalendar(month, year) {
        // Update month/year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const todayDate = new Date();
        const todayDay = todayDate.getDate();
        const todayMonth = todayDate.getMonth();
        const todayYear = todayDate.getFullYear();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Determine if this date is in the past
            const isPast = (year < todayYear) || 
                          (year === todayYear && month < todayMonth) || 
                          (year === todayYear && month === todayMonth && day < todayDay);
            
            // Determine if this date is today
            const isToday = (day === todayDay && month === todayMonth && year === todayYear);
            
            // Add appropriate classes
            if (isPast) {
                dayElement.classList.add('past');
                dayElement.setAttribute('aria-disabled', 'true');
            } else {
                // Set up selectable dates
                dayElement.classList.add('selectable');
                dayElement.setAttribute('data-date', `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
                
                // Handle date selection
                dayElement.addEventListener('click', function() {
                    const selectedDate = this.getAttribute('data-date');
                    
                    // Remove selected class from all days
                    document.querySelectorAll('.calendar-day.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Add selected class to this day
                    this.classList.add('selected');
                    
                    // Update hidden input value
                    if (bookingDateInput) {
                        bookingDateInput.value = selectedDate;
                    }
                    
                    // Enable next button
                    if (dateNextBtn) {
                        dateNextBtn.disabled = false;
                    }
                });
            }
            
            if (isToday) {
                dayElement.classList.add('today');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
}

/**
 * Initialize package selection in booking form
 */
function initPackageSelection() {
    const packageCards = document.querySelectorAll('.package-card');
    const packageInput = document.getElementById('selected-package');
    const packageNextBtn = document.querySelector('#package-step .next-step');
    
    if (!packageCards.length || !packageInput) return;
    
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            packageCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Update hidden input value
            const packageValue = this.getAttribute('data-package');
            packageInput.value = packageValue;
            
            // Enable next button
            if (packageNextBtn) {
                packageNextBtn.disabled = false;
            }
        });
    });
}

/**
 * Initialize property viewing request functionality
 */
function initViewingRequests() {
    const viewingButtons = document.querySelectorAll('.request-viewing-btn');
    const viewingModal = document.getElementById('viewing-modal');
    
    if (!viewingButtons.length || !viewingModal) return;
    
    // Set minimum date for viewing date picker to tomorrow
    const viewingDateInput = document.getElementById('viewing-date');
    if (viewingDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        viewingDateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Setup modal close button
    const closeModal = viewingModal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            viewingModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });
    }
    
    // Setup viewing request buttons
    viewingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            const propertyTitle = this.getAttribute('data-property-title');
            
            // Set property details in modal
            document.getElementById('property-id').value = propertyId;
            
            // Update property title in modal
            const modalPropertyTitle = viewingModal.querySelector('.modal-property-title');
            if (modalPropertyTitle && propertyTitle) {
                modalPropertyTitle.textContent = propertyTitle;
            }
            
            // Show modal
            viewingModal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });
    
    // Close modal when clicking outside content
    viewingModal.addEventListener('click', function(e) {
        if (e.target === viewingModal) {
            viewingModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

/**
 * Initialize newsletter signup functionality
 */
function initNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('#newsletter-form, #security-newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get email input
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                // Show error
                if (emailInput) {
                    markFieldInvalid(emailInput, 'Please enter a valid email address');
                }
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Determine which service to use
            const serviceId = form.id === 'security-newsletter-form' ? 
                'service_jo4_security' : 'service_jo4_default';
            
            // Send subscription request
            emailjs.send(serviceId, 'template_newsletter', {
                email: emailInput.value,
                signup_page: window.location.href,
                signup_time: new Date().toISOString()
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                const formParent = form.parentNode;
                formParent.innerHTML = `
                    <div class="newsletter-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>Your email has been successfully added to our newsletter.</p>
                    </div>
                `;
                
                // Track event
                if (typeof gtag === 'function') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Engagement',
                        'event_label': form.id
                    });
                }
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                
                // Restore submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                
                // Show error message
                showFormMessage(form, 'error', 'Sorry, there was an error. Please try again or contact us directly.');
            });
        });
    });
}

/**
 * Initialize input masking for special form fields
 */
function initInputMasks() {
    // Phone number fields
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Allow only digits, spaces, and some special characters
            let value = this.value.replace(/[^\d\s\+\-\(\)]/g, '');
            
            // Basic formatting for South African numbers
            if (value.startsWith('0') && value.length > 3) {
                value = value.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2 $3');
            } else if (value.startsWith('+27') && value.length > 5) {
                value = value.replace(/^\+27(\d{2})(\d{3})(\d{4}).*/, '+27 ($1) $2 $3');
            }
            
            this.value = value;
        });
    });
    
    // Price formatting for real estate listings
    const priceInputs = document.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove non-digits
            let value = this.value.replace(/[^\d]/g, '');
            
            // Format with thousands separator
            value = Number(value).toLocaleString('en-ZA');
            
            // Add currency symbol
            this.value = value !== '0' ? value : '';
        });
    });
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone is valid
 */
function isValidPhone(phone) {
    // Very basic validation - allow digits, spaces, parentheses, plus, hyphen
    const regex = /^[\d\s\(\)\+\-]{7,}$/;
    return regex.test(phone);
}