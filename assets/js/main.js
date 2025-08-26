// JO4 Website - Main JavaScript

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or use OS preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set the initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
  body.setAttribute('data-theme', 'dark');
} else {
  body.setAttribute('data-theme', 'light');
}

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  // Update the theme toggle icon based on current theme
  function updateThemeIcon(theme) {
    const iconElement = themeToggle.querySelector('i') || document.createElement('i');
    iconElement.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    if (!themeToggle.contains(iconElement)) {
      themeToggle.appendChild(iconElement);
    }
  }
  
  // Initialize the icon
  updateThemeIcon(body.getAttribute('data-theme'));
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
  const triggerBottom = window.innerHeight * 0.8;
  
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < triggerBottom) {
      element.classList.add('revealed');
    }
  });
}

// Only enable animations if reduced motion is not preferred
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
  window.addEventListener('scroll', checkReveal);
  // Initial check
  checkReveal();
}

// Form validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', event => {
    let valid = true;
    
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        highlightInvalidField(field);
      } else {
        resetField(field);
      }
    });
    
    // Check email format
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (field.value && !emailPattern.test(field.value)) {
        valid = false;
        highlightInvalidField(field, 'Please enter a valid email address');
      }
    });
    
    // If not valid, prevent submission
    if (!valid) {
      event.preventDefault();
    }
  });
});

function highlightInvalidField(field, message = 'This field is required') {
  field.classList.add('invalid');
  
  // Add or update error message
  let errorMessage = field.nextElementSibling;
  if (!errorMessage || !errorMessage.classList.contains('error-message')) {
    errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    field.parentNode.insertBefore(errorMessage, field.nextSibling);
  }
  errorMessage.textContent = message;
}

function resetField(field) {
  field.classList.remove('invalid');
  
  // Remove error message if exists
  const errorMessage = field.nextElementSibling;
  if (errorMessage && errorMessage.classList.contains('error-message')) {
    errorMessage.remove();
  }
}

// Mobile navigation toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileNavToggle && navLinks) {
  mobileNavToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileNavToggle.setAttribute('aria-expanded', 
      navLinks.classList.contains('active') ? 'true' : 'false');
  });
}

// Initialize any page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check which page we're on and initialize accordingly
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('/brew')) {
    initializeBookingCalendar();
  } else if (currentPage.includes('/realestate')) {
    loadListings();
  }
});

// These functions will be defined in their respective JS files
function initializeBookingCalendar() {
  // This function will be implemented in booking-calendar.js
  console.log('Booking calendar initialization would happen here');
}

function loadListings() {
  // This function will be implemented in listings.js
  console.log('Property listings would load here');
}