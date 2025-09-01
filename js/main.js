/* ============================================
   MAIN JAVASCRIPT FOR JO4 WEBSITE
   Version: 1.0.0
   Last Updated: 2025-09-01 15:27:28 (UTC)
   Author: Jonathan Roets (JRoetscyber)
============================================ */

// Initialize EmailJS
(function() {
    emailjs.init({
        publicKey: "YOUR_PUBLIC_KEY" // Replace with your actual EmailJS public key
    });
})();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Navigation scroll effect
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Check for saved theme preference or respect OS preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = localStorage.getItem('theme');
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
    
    // Project filtering (for Projects page)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card, .cyber-project-card, .property-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    card.classList.remove('animate-filter');
                    
                    // Get card categories
                    const categories = card.getAttribute('data-category');
                    
                    if (!categories) return;
                    
                    // Handle "all" filter differently
                    if (filterValue === 'all' || filterValue === 'all properties') {
                        card.classList.remove('hide');
                        return;
                    }
                    
                    // Check if card has the selected category
                    if (categories.includes(filterValue)) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                        card.classList.add('animate-filter');
                    }
                });
            });
        });
    }
    
    // Timeline tabs (for Education/Experience sections)
    const timelineTabs = document.querySelectorAll('.timeline-tab');
    const timelines = document.querySelectorAll('.timeline');
    
    if (timelineTabs.length > 0 && timelines.length > 0) {
        timelineTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                timelineTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding timeline
                const target = tab.getAttribute('data-target');
                timelines.forEach(timeline => {
                    timeline.classList.remove('active');
                    if (timeline.id === target) {
                        timeline.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Form submission handling with EmailJS
    window.submitForm = function(event) {
        event.preventDefault();
        
        // Get form data
        const form = event.target;
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };
        
        // Add additional fields if they exist
        if (form.service) formData.service = form.service.value;
        if (form.propertyType) formData.propertyType = form.propertyType.value;
        if (form.projectType) formData.projectType = form.projectType.value;
        
        // Show loading state
        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.querySelector('.submit-text').textContent;
        submitButton.disabled = true;
        submitButton.querySelector('.submit-text').textContent = 'Sending...';
        
        // Send the email using EmailJS
        emailjs.send('default_service', 'template_default', formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                const formSuccess = document.getElementById('formSuccess');
                if (formSuccess) {
                    formSuccess.classList.add('active');
                }
                
                // Reset form
                form.reset();
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                alert('Failed to send message. Please try again later.');
            })
            .finally(function() {
                // Reset button state
                submitButton.disabled = false;
                submitButton.querySelector('.submit-text').textContent = originalText;
            });
        
        return false;
    };
    
    // Reset form after successful submission
    window.resetForm = function() {
        const formSuccess = document.getElementById('formSuccess');
        if (formSuccess) {
            formSuccess.classList.remove('active');
        }
    };
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip links that should not scroll
            if (this.getAttribute('href') === '#' || this.getAttribute('role') === 'tab') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});