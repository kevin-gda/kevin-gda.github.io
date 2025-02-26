// Immediately Invoked Function Expression for scope isolation
(function() {
    'use strict';
  
    // DOM Elements cache
    const DOM = {
      navbar: document.querySelector('.navbar'),
      navToggle: document.getElementById('navToggle'),
      navLinks: document.querySelector('.nav-links'),
      navItems: document.querySelectorAll('.nav-links a'),
      anchorLinks: document.querySelectorAll('a[href^="#"]'),
      scrollElements: document.querySelectorAll('.reveal'),
      serviceCards: document.querySelectorAll('.service-card'),
      backToTop: document.querySelector('.back-to-top')
    };
  
    // Configuration
    const CONFIG = {
      headerHeight: 70,
      scrollThreshold: 50,
      animationThreshold: 0.2,
      animationDelay: 150,
      navbarScrolledClass: 'scrolled'
    };
  
    /**
     * Navigation functionality
     */
    const Navigation = {
      init() {
        this.setupEventListeners();
      },
  
      setupEventListeners() {
        // Mobile menu toggle
        DOM.navToggle?.addEventListener('click', this.toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', this.handleOutsideClick);
        
        // Close menu when clicking on a link
        DOM.navItems.forEach(link => {
          link.addEventListener('click', this.closeMobileMenu);
        });
        
        // Escape key to close menu
        document.addEventListener('keydown', this.handleEscKey);
      },
      
      toggleMobileMenu(e) {
        e.stopPropagation();
        DOM.navToggle.classList.toggle('active');
        DOM.navLinks.classList.toggle('active');
        
        // Add/remove body scroll lock
        document.body.classList.toggle('menu-open');
  
        // Accessibility
        const expanded = DOM.navToggle.getAttribute('aria-expanded') === 'true' || false;
        DOM.navToggle.setAttribute('aria-expanded', !expanded);
        DOM.navLinks.setAttribute('aria-hidden', expanded);
      },
      
      closeMobileMenu() {
        DOM.navToggle.classList.remove('active');
        DOM.navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Accessibility
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        DOM.navLinks.setAttribute('aria-hidden', 'true');
      },
      
      handleOutsideClick(event) {
        const isClickInsideNav = DOM.navLinks?.contains(event.target);
        const isClickOnToggle = DOM.navToggle?.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && DOM.navLinks?.classList.contains('active')) {
          Navigation.closeMobileMenu();
        }
      },
      
      handleEscKey(event) {
        if (event.key === 'Escape' && DOM.navLinks?.classList.contains('active')) {
          Navigation.closeMobileMenu();
        }
      }
    };
  
    /**
     * Smooth scrolling functionality
     */
    const SmoothScroll = {
      init() {
        DOM.anchorLinks.forEach(anchor => {
          anchor.addEventListener('click', this.scrollToTarget);
        });
      },
      
      scrollToTarget(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;
        
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - CONFIG.headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page jump
        window.history.pushState('', '', targetId);
      }
    };
  
    /**
     * Scroll effects functionality
     */
    const ScrollEffects = {
      init() {
        this.setupObservers();
        this.setupEventListeners();
        this.checkScroll();
      },
      
      setupEventListeners() {
        // Throttled scroll event
        let throttleTimer;
        window.addEventListener('scroll', () => {
          if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
              this.checkScroll();
              throttleTimer = null;
            }, 100);
          }
        });
        
        // Update on resize (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            this.checkScroll();
          }, 250);
        });
        
        // Back to top button
        DOM.backToTop?.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      },
      
      checkScroll() {
        // Navbar background change on scroll
        if (window.scrollY > CONFIG.scrollThreshold) {
          DOM.navbar.classList.add(CONFIG.navbarScrolledClass);
        } else {
          DOM.navbar.classList.remove(CONFIG.navbarScrolledClass);
        }
        
        // Back to top button visibility
        if (DOM.backToTop) {
          if (window.scrollY > window.innerHeight / 2) {
            DOM.backToTop.classList.add('visible');
          } else {
            DOM.backToTop.classList.remove('visible');
          }
        }
      },
      
      setupObservers() {
        // Animation effect for elements
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            // Add staggered delay to elements
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('active');
              }, Array.from(DOM.scrollElements).indexOf(entry.target) * CONFIG.animationDelay);
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: CONFIG.animationThreshold,
          rootMargin: '0px 0px -100px 0px'
        });
        
        // Apply to all elements with .reveal class
        DOM.scrollElements.forEach(element => {
          revealObserver.observe(element);
        });
        
        // Service cards animation
        const cardsObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }, index * 150);
              cardsObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: CONFIG.animationThreshold,
          rootMargin: '0px 0px -50px 0px'
        });
        
        // Apply to service cards
        DOM.serviceCards.forEach(card => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(50px)';
          cardsObserver.observe(card);
        });
      }
    };
  
    /**
     * Counter animation for trust section
     */
    const CounterAnimation = {
      init() {
        this.setupCounters();
      },
      
      setupCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const counter = entry.target;
              const target = parseInt(counter.getAttribute('data-target'), 10);
              let count = 0;
              const duration = 2000; // ms
              const frameDuration = 1000 / 60; // 60fps
              const totalFrames = Math.round(duration / frameDuration);
              const increment = target / totalFrames;
              
              const updateCount = () => {
                count += increment;
                counter.textContent = Math.min(Math.ceil(count), target).toLocaleString();
                
                if (count < target) {
                  requestAnimationFrame(updateCount);
                }
              };
              
              updateCount();
              counterObserver.unobserve(counter);
            }
          });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
          counterObserver.observe(counter);
        });
      }
    };
  
    /**
     * Form validation and handling
     */
    const FormHandler = {
      init() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
          contactForm.addEventListener('submit', this.handleSubmit);
          
          // Real-time validation
          const inputs = contactForm.querySelectorAll('.form-control');
          inputs.forEach(input => {
            input.addEventListener('blur', this.validateField);
            input.addEventListener('input', this.removeError);
          });
        }
      },
      
      validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && value === '') {
          FormHandler.showError(field, 'This field is required');
          return false;
        }
        
        if (field.type === 'email' && value !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            FormHandler.showError(field, 'Please enter a valid email address');
            return false;
          }
        }
        
        return true;
      },
      
      showError(field, message) {
        // Remove any existing error
        this.removeError({ target: field });
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        
        // Insert error after the field
        field.parentNode.insertBefore(error, field.nextSibling);
      },
      
      removeError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        // Remove error message if it exists
        const error = field.parentNode.querySelector('.error-message');
        if (error) {
          field.parentNode.removeChild(error);
        }
      },
      
      handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        const form = e.target;
        const inputs = form.querySelectorAll('.form-control');
        
        // Validate all fields
        inputs.forEach(input => {
          if (!FormHandler.validateField({ target: input })) {
            isValid = false;
          }
        });
        
        if (isValid) {
          // Show loading state
          const submitBtn = form.querySelector('.submit-btn');
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
          
          // Simulate form submission (replace with actual API call)
          setTimeout(() => {
            // Success message
            form.reset();
            submitBtn.textContent = 'Message Sent!';
            
            // Reset button after delay
            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            }, 3000);
          }, 1500);
        }
      }
    };
  
    /**
     * Dark mode toggle (optional)
     */
    const ThemeToggle = {
      init() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
          this.loadSavedTheme();
          themeToggle.addEventListener('click', this.toggleTheme);
        }
      },
      
      loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      },
      
      toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };
  
    /**
     * Page load animations
     */
    const PageLoader = {
      init() {
        window.addEventListener('load', this.onPageLoad);
      },
      
      onPageLoad() {
        document.body.classList.add('loaded');
        
        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.classList.add('fade-in');
        }
      }
    };
  
    /**
     * Certifications Accordion
     */
    const certItems = document.querySelectorAll('.cert-item');
    
    certItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('i');
        const content = item.querySelector('.cert-content');
        icon.style.transform = 'rotate(15deg)';
        content.style.maxHeight = content.scrollHeight + "px";
        item.classList.add('opened');
      });
      
      item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('i');
        icon.style.transform = 'rotate(0)';
      });
    });
  
    /**
     * Customers Carousel
     */
    const carousel = {
      track: document.querySelector('.carousel-track'),
      slides: document.querySelectorAll('.carousel-slide'),
      prevButton: document.querySelector('.carousel-button.prev'),
      nextButton: document.querySelector('.carousel-button.next'),
      slideWidth: 200,
      gap: 32, // 2rem in pixels
      
      init() {
        // Clone slides for infinite scroll
        const slidesToClone = [...this.slides].map(slide => slide.cloneNode(true));
        slidesToClone.forEach(clone => this.track.appendChild(clone));
        
        this.setupControls();
      },
      
      setupControls() {
        this.prevButton.addEventListener('click', () => {
          this.track.style.animationPlayState = 'paused';
          this.track.style.transform = `translateX(${this.slideWidth + this.gap}px)`;
          setTimeout(() => {
            this.track.style.transition = 'none';
            this.track.style.transform = '';
            setTimeout(() => {
              this.track.style.transition = 'transform 0.5s ease-in-out';
              this.track.style.animationPlayState = 'running';
            }, 50);
          }, 500);
        });
        
        this.nextButton.addEventListener('click', () => {
          this.track.style.animationPlayState = 'paused';
          this.track.style.transform = `translateX(-${this.slideWidth + this.gap}px)`;
          setTimeout(() => {
            this.track.style.transition = 'none';
            this.track.style.transform = '';
            setTimeout(() => {
              this.track.style.transition = 'transform 0.5s ease-in-out';
              this.track.style.animationPlayState = 'running';
            }, 50);
          }, 500);
        });
      }
    };
  
    /**
     * Initialize all modules
     */
    function init() {
      document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
        SmoothScroll.init();
        ScrollEffects.init();
        CounterAnimation.init();
        FormHandler.init();
        ThemeToggle.init();
        PageLoader.init();
        
        // Add ARIA attributes for accessibility
        setupAccessibility();
        
        // Initialize carousel
        if (document.querySelector('.carousel-track')) {
          carousel.init();
        }
      });
    }
  
    /**
     * Set up accessibility attributes
     */
    function setupAccessibility() {
      // Nav toggle button
      if (DOM.navToggle) {
        DOM.navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        DOM.navToggle.setAttribute('aria-expanded', 'false');
        DOM.navLinks.setAttribute('aria-hidden', 'true');
      }
      
      // Back to top button
      if (DOM.backToTop) {
        DOM.backToTop.setAttribute('aria-label', 'Scroll to top');
      }
    }
  
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.getElementsByTagName('a');
    for (let link of mobileMenuLinks) {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
  
    // Initialize the application
    init();
  })();