/**
 * LEGENGLOBAL INC. - Main JavaScript
 * Handles loading animation, navigation, and scroll effects
 */

// ========================================
// Page Protection - Disable Save, Right-click, DevTools
// ========================================
(function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S (Save)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        // F12 (DevTools)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
        // Cmd+Option+I (Mac DevTools)
        if (e.metaKey && e.altKey && e.key === 'i') {
            e.preventDefault();
            return false;
        }
        // Cmd+Option+J (Mac Console)
        if (e.metaKey && e.altKey && e.key === 'j') {
            e.preventDefault();
            return false;
        }
        // Cmd+Option+U (Mac View Source)
        if (e.metaKey && e.altKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
        // Cmd+S (Mac Save)
        if (e.metaKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
    });

    // Detect DevTools opening (polling method) - disabled for development
    // let devToolsOpen = false;
    // const threshold = 160;
    // setInterval(function() {
    //     const widthDiff = window.outerWidth - window.innerWidth > threshold;
    //     const heightDiff = window.outerHeight - window.innerHeight > threshold;
    //     if (widthDiff || heightDiff) {
    //         if (!devToolsOpen) {
    //             devToolsOpen = true;
    //             document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;font-size:1.5rem;color:#666;">Please close developer tools to view this page.</div>';
    //         }
    //     }
    // }, 100);
})();

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Loading Screen Animation
    // ========================================
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    // Wait for the logo animation to complete then hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.classList.add('visible');
        
        // Initialize scroll animations after content is visible
        initScrollAnimations();
    }, 4800); // 2s logo spin + 0.8s text appear + 2s stay

    // ========================================
    // Navigation
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Scroll Animations
    // ========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.about-card, .service-card, .advantage-item, .contact-item, .job-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Gallery Carousel
    // ========================================
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const captionElement = document.getElementById('carousel-caption');
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentIndex = 0;
        const totalSlides = carouselSlides.length;
        let typingTimeout = null;
        
        // Create dots
        carouselSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.carousel-dot');
        
        // Typewriter effect
        function typeWriter(text, element, speed = 50) {
            // Clear previous typing
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            
            element.textContent = '';
            element.classList.remove('typing-done');
            let i = 0;
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    typingTimeout = setTimeout(type, speed);
                } else {
                    element.classList.add('typing-done');
                }
            }
            
            type();
        }
        
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update caption with typewriter effect
            const caption = carouselSlides[currentIndex].getAttribute('data-caption');
            if (caption && captionElement) {
                typeWriter(caption, captionElement, 40);
            }
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        // Initialize first caption
        updateCarousel();
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Auto-play
        let autoPlayInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const carouselContainer = document.querySelector('.gallery-carousel');
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
    }
});

