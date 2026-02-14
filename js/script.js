// ========================================
// ONE-PAGE PORTFOLIO - EXPANDABLE SECTIONS
// ========================================

// ========================================
// THEME TOGGLE
// ========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
if (currentTheme === 'light') {
    document.body.classList.add('light');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ========================================
// EXPANDABLE PROJECTS
// ========================================
function toggleProject(element) {
    const projectItem = element.closest('.project-item');
    const wasActive = projectItem.classList.contains('active');
    
    // Close all other projects
    document.querySelectorAll('.project-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current project
    if (!wasActive) {
        projectItem.classList.add('active');
        
        // Smooth scroll to show full content if needed
        setTimeout(() => {
            const rect = projectItem.getBoundingClientRect();
            const isFullyVisible = rect.bottom <= window.innerHeight;
            
            if (!isFullyVisible) {
                projectItem.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        }, 100);
    }
}

// ========================================
// KEYBOARD ACCESSIBILITY
// ========================================
// Allow Enter/Space to toggle projects
document.querySelectorAll('.project-summary').forEach(summary => {
    summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleProject(summary);
        }
    });
    
    // Make focusable
    summary.setAttribute('tabindex', '0');
});

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// NEWSLETTER FORM HANDLING
// ========================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (email) {
            alert('Thanks for subscribing! You\'ll receive updates at ' + email);
            e.target.reset();
        }
    });
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards
document.querySelectorAll('.info-card, .project-item, .experience-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ========================================
// PERFORMANCE - REDUCED MOTION
// ========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable animations
    document.querySelectorAll('.info-card, .project-item, .experience-card, .blog-card').forEach(el => {
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// ========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ========================================
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update on page load
updateActiveNavLink();

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c👋 Hi there!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cThanks for checking out my portfolio!', 'color: #7c3aed; font-size: 14px;');
console.log('%c- Anoj Rawal', 'color: #a1a1aa; font-size: 12px;');

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portfolio loaded successfully!');
    
    // Add initial animation to hero
    const heroCompact = document.querySelector('.hero-compact');
    const blogHeader = document.querySelector('.blog-header');
    const targetElement = heroCompact || blogHeader;
    
    if (targetElement) {
        targetElement.style.opacity = '0';
        targetElement.style.transform = 'translateY(20px)';
        targetElement.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            targetElement.style.opacity = '1';
            targetElement.style.transform = 'translateY(0)';
        }, 100);
    }

    // Newsletter animation
    const newsletterCard = document.querySelector('.newsletter-card');
    if (newsletterCard) {
        newsletterCard.style.opacity = '0';
        newsletterCard.style.transform = 'scale(0.95)';
        newsletterCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const newsletterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 0.3 });
        
        newsletterObserver.observe(newsletterCard);
    }
});

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejection:', e.reason);
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    });
}

// ========================================
// CLOSE PROJECT ON OUTSIDE CLICK
// ========================================
document.addEventListener('click', (e) => {
    const projectItem = e.target.closest('.project-item');
    
    // If clicking outside any project, close all
    if (!projectItem) {
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Prevent closing when clicking inside project details
document.querySelectorAll('.project-details').forEach(details => {
    details.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// ========================================
// SMOOTH HOVER EFFECTS FOR CARDS
// ========================================
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ========================================
// BACK TO TOP FUNCTIONALITY (Optional)
// ========================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // You can add a back-to-top button here if needed
        if (scrollTop > 500) {
            // Show back to top button
        } else {
            // Hide back to top button
        }
    }, 100);
});