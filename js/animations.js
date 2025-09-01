/* ============================================
   ANIMATIONS JAVASCRIPT FOR JO4 WEBSITE
   Version: 1.0.0
   Last Updated: 2025-09-01 15:27:28 (UTC)
   Author: Jonathan Roets (JRoetscyber)
============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the browser supports IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Scroll animations for elements with 'animate-on-scroll' class
        const scrollAnimationElements = document.querySelectorAll('.animate-on-scroll');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        scrollAnimationElements.forEach(element => {
            scrollObserver.observe(element);
        });
        
        // Progress bar animations for skill bars
        const progressBars = document.querySelectorAll('.skill-progress');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get percentage value from custom property or data attribute
                    const percentage = entry.target.parentElement.dataset.percent || 
                                       entry.target.style.getPropertyValue('--skill-percent') || 
                                       '0%';
                    
                    // Convert percentage to scale transform (e.g. 80% -> 0.8)
                    const scaleValue = parseInt(percentage) / 100;
                    
                    // Apply animation
                    entry.target.style.transform = `scaleX(${scaleValue})`;
                    entry.target.style.transition = 'transform 1.5s ease';
                    
                    // Stop observing after animation
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('animated');
        });
        
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const percentage = bar.parentElement.dataset.percent || 
                              bar.style.getPropertyValue('--skill-percent') || 
                              '0%';
            const scaleValue = parseInt(percentage) / 100;
            bar.style.transform = `scaleX(${scaleValue})`;
        });
    }
    
    // Particle animations for hero section (if particle container exists)
    const particleContainer = document.querySelector('.particles');
    if (particleContainer) {
        createParticles();
    }
    
    // Parallax effect for hero shapes
    const shapes = document.querySelectorAll('.shape');
    
    if (shapes.length > 0) {
        window.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach(shape => {
                const speed = parseFloat(shape.getAttribute('data-speed')) || 0.1;
                const offsetX = (mouseX - 0.5) * 100 * speed;
                const offsetY = (mouseY - 0.5) * 100 * speed;
                
                shape.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
    
    // Morphing animation for hero image container
    const morphElements = document.querySelectorAll('.morph-animation');
    
    if (morphElements.length > 0) {
        // Set initial random border radius for morphing animation
        morphElements.forEach(element => {
            setRandomBorderRadius(element);
            
            // Change border radius periodically
            setInterval(() => {
                setRandomBorderRadius(element);
            }, 5000);
        });
    }
    
    // Terminal typing effect (for security page)
    const terminalElements = document.querySelectorAll('.terminal-content');
    
    if (terminalElements.length > 0) {
        terminalElements.forEach(terminal => {
            // Check if the terminal should have a typing animation
            if (terminal.classList.contains('typing-animation')) {
                simulateTyping(terminal);
            }
        });
    }
    
    // Function to create particle animation
    function createParticles() {
        const count = 100;
        const particleContainer = document.querySelector('.particles');
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random particle properties
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${Math.random() * 5 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particleContainer.appendChild(particle);
        }
    }
    
    // Function to set random border radius for morphing effect
    function setRandomBorderRadius(element) {
        const getRandomValue = () => Math.floor(Math.random() * 70) + 30;
        
        const borderRadius = `${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}% / ${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}% ${getRandomValue()}%`;
        
        element.style.transition = 'border-radius 10s ease-in-out';
        element.style.borderRadius = borderRadius;
    }
    
    // Function to simulate terminal typing animation
    function simulateTyping(terminal) {
        const originalContent = terminal.innerHTML;
        terminal.textContent = '';
        
        // Extract text content only
        const textContent = terminal.textContent || terminal.innerText;
        const characters = textContent.split('');
        
        let currentIndex = 0;
        const typingSpeed = 30; // milliseconds per character
        
        // Reset to original HTML to preserve formatting
        terminal.innerHTML = '';
        
        const typingInterval = setInterval(() => {
            if (currentIndex < characters.length) {
                terminal.innerHTML += characters[currentIndex];
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Restore original HTML with formatting
                terminal.innerHTML = originalContent;
            }
        }, typingSpeed);
    }
});

// Define CSS keyframe animations programmatically (if needed)
function addKeyframeAnimation() {
    const style = document.createElement('style');
    
    const keyframes = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
            from { 
                opacity: 0;
                transform: translateX(-50px); 
            }
            to { 
                opacity: 1;
                transform: translateX(0); 
            }
        }
        
        @keyframes slideInRight {
            from { 
                opacity: 0;
                transform: translateX(50px); 
            }
            to { 
                opacity: 1;
                transform: translateX(0); 
            }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px); 
            }
            to { 
                opacity: 1;
                transform: translateY(0); 
            }
        }
        
        @keyframes morphing {
            0% {
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            }
            25% {
                border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            }
            50% {
                border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            }
            75% {
                border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            }
            100% {
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            }
        }
    `;
    
    style.innerHTML = keyframes;
    document.head.appendChild(style);
}

// Run the keyframe animation function if needed
// addKeyframeAnimation();