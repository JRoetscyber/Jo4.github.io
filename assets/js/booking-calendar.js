// JO4 Brew - Booking Calendar & Form Functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeBookingCalendar();
  setupBookingForm();
});

// Calendar Setup
function initializeBookingCalendar() {
  const calendarContainer = document.getElementById('booking-calendar');
  if (!calendarContainer) return;
  
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  // Store selected date
  let selectedDate = null;
  
  // Render initial calendar
  renderCalendar(currentMonth, currentYear);
  
  // Month navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  // Calendar rendering function
  function renderCalendar(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    // Update header
    document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Clear existing calendar
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of month
    const currentDate = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';
      dayCell.textContent = day;
      
      // Disable past dates
      const dateToCheck = new Date(year, month, day);
      if (dateToCheck < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) {
        dayCell.classList.add('disabled');
      } else {
        // Check availability (this would typically come from a backend)
        const isAvailable = checkAvailability(year, month, day);
        
        if (!isAvailable) {
          dayCell.classList.add('disabled');
        } else {
          // Click handler for available dates
          dayCell.addEventListener('click', () => {
            // Remove selected class from previous selection
            const previously = document.querySelector('.calendar-day.selected');
            if (previously) previously.classList.remove('selected');
            
            // Add selected class to current selection
            dayCell.classList.add('selected');
            
            // Store selected date
            selectedDate = new Date(year, month, day);
            
            // Update form field
            document.getElementById('booking-date').value = 
              `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Enable next step button if it exists
            const nextStepBtn = document.getElementById('date-next-btn');
            if (nextStepBtn) nextStepBtn.disabled = false;
          });
        }
      }
      
      // Mark selected date if revisiting this month
      if (selectedDate && selectedDate.getDate() === day && 
          selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
        dayCell.classList.add('selected');
      }
      
      calendarGrid.appendChild(dayCell);
    }
  }
  
  // Function to check date availability
  // In a real application, this would likely fetch data from a server
  function checkAvailability(year, month, day) {
    // Example: Let's say we're not available on Sundays
    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0) return false;
    
    // Example unavailable dates (could be loaded from JSON/API)
    const unavailableDates = [
      '2025-09-15', // Format: YYYY-MM-DD
      '2025-10-20',
      '2025-11-25'
    ];
    
    const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return !unavailableDates.includes(dateString);
  }
}

// Booking Form Setup
function setupBookingForm() {
  const bookingForm = document.getElementById('booking-form');
  if (!bookingForm) return;
  
  // Multi-step form navigation
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  let currentStep = 0;
  showStep(currentStep);
  
  // Next buttons
  const nextButtons = document.querySelectorAll('.next-step');
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
      }
    });
  });
  
  // Previous buttons
  const prevButtons = document.querySelectorAll('.prev-step');
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentStep--;
      showStep(currentStep);
      updateProgress();
    });
  });
  
  // Package selection
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all packages
      packageCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked package
      card.classList.add('selected');
      
      // Update hidden input
      const packageInput = document.getElementById('selected-package');
      if (packageInput) {
        packageInput.value = card.dataset.package;
      }
      
      // Enable next button if disabled
      const nextBtn = document.querySelector('#package-step .next-step');
      if (nextBtn) nextBtn.disabled = false;
    });
  });
  
  // Show current step
  function showStep(stepIndex) {
    formSteps.forEach((step, index) => {
      step.style.display = index === stepIndex ? 'block' : 'none';
    });
    
    // Adjust button visibility
    const prevButtons = document.querySelectorAll('.prev-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const submitButton = document.querySelector('button[type="submit"]');
    
    prevButtons.forEach(btn => {
      btn.style.display = stepIndex === 0 ? 'none' : 'inline-block';
    });
    
    if (submitButton) {
      submitButton.style.display = stepIndex === formSteps.length - 1 ? 'inline-block' : 'none';
    }
  }
  
  // Update progress indicator
  function updateProgress() {
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
  
  // Validate current step
  function validateStep(stepIndex) {
    const currentStepEl = formSteps[stepIndex];
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('invalid');
        
        // Add error message if not exists
        let errorMsg = field.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
          errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          field.parentNode.insertBefore(errorMsg, field.nextSibling);
        }
        errorMsg.textContent = 'This field is required';
      } else {
        field.classList.remove('invalid');
        const errorMsg = field.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
    });
    
    // Special validations based on step
    if (stepIndex === 0 && isValid) {
      // Date step - check if date is selected
      const dateInput = document.getElementById('booking-date');
      if (!dateInput.value) {
        isValid = false;
        alert('Please select a date on the calendar');
      }
    } else if (stepIndex === 1 && isValid) {
      // Package step - check if package is selected
      const packageInput = document.getElementById('selected-package');
      if (!packageInput.value) {
        isValid = false;
        alert('Please select a package');
      }
    }
    
    return isValid;
  }
  
  // Form submission
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    // Gather form data
    const formData = new FormData(bookingForm);
    const bookingData = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
      // In a real application, you would send this data to a server
      // For demo purposes, we'll just simulate a successful booking
      await simulateBookingSubmission(bookingData);
      
      // Show success message
      const formContainer = document.querySelector('.booking-form-container');
      formContainer.innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745;"></i>
          <h2>Booking Confirmed!</h2>
          <p>Thank you for booking JO4 Brew for your event on ${formatDate(bookingData.bookingDate)}.</p>
          <p>We've sent a confirmation email to ${bookingData.email} with all the details.</p>
          <p>If you have any questions, please contact us directly at <a href="tel:+27123456789">+27 12 345 6789</a>.</p>
          <button class="btn mt-4" onclick="window.location.href='/'">Return to Home</button>
        </div>
      `;
      
    } catch (error) {
      // Show error
      alert('There was an error processing your booking. Please try again or contact us directly.');
      console.error('Booking error:', error);
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
  
  // Simulate form submission (for demo purposes)
  function simulateBookingSubmission(data) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        console.log('Booking data that would be sent to server:', data);
        resolve({ success: true });
      }, 2000);
    });
  }
  
  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}