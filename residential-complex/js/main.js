/**
 * Жилой Комплекс "Панорама" - Основной JavaScript файл
 * Функционал: навигация, фильтры, модальные окна, формы, анимации
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn-login');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    
    // ========================================
    // Property Filter Functionality
    // ========================================
    const propertyFilter = document.getElementById('propertyFilter');
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (propertyFilter && propertiesGrid) {
        propertyFilter.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rooms = document.getElementById('rooms').value;
            const areaMin = document.getElementById('area-min').value;
            const areaMax = document.getElementById('area-max').value;
            const priceMin = document.getElementById('price-min').value;
            const priceMax = document.getElementById('price-max').value;
            
            const propertyCards = propertiesGrid.querySelectorAll('.property-card');
            
            propertyCards.forEach(card => {
                const cardRooms = card.getAttribute('data-rooms');
                const cardArea = parseInt(card.getAttribute('data-area'));
                const cardPrice = parseInt(card.getAttribute('data-price'));
                
                let show = true;
                
                // Filter by rooms
                if (rooms && cardRooms !== rooms) {
                    show = false;
                }
                
                // Filter by area min
                if (areaMin && cardArea < parseInt(areaMin)) {
                    show = false;
                }
                
                // Filter by area max
                if (areaMax && cardArea > parseInt(areaMax)) {
                    show = false;
                }
                
                // Filter by price min
                if (priceMin && cardPrice < parseInt(priceMin)) {
                    show = false;
                }
                
                // Filter by price max
                if (priceMax && cardPrice > parseInt(priceMax)) {
                    show = false;
                }
                
                if (show) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // ========================================
    // Modal Functionality
    // ========================================
    const loginModal = document.getElementById('loginModal');
    const scheduleModal = document.getElementById('scheduleModal');
    const loginModalClose = document.getElementById('loginModalClose');
    const scheduleModalClose = document.getElementById('scheduleModalClose');
    const btnLogin = document.querySelector('.btn-login');
    const scheduleViewBtns = document.querySelectorAll('.schedule-view');
    const svPropertyInput = document.getElementById('sv-property');
    
    // Login Modal
    if (btnLogin && loginModal && loginModalClose) {
        btnLogin.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.add('active');
        });
        
        loginModalClose.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
        
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    // Schedule View Modal
    scheduleViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('h3').textContent;
            const propertyArea = propertyCard.querySelector('.property-area').textContent;
            const propertyPrice = propertyCard.querySelector('.property-price').textContent;
            
            if (svPropertyInput) {
                svPropertyInput.value = `${propertyTitle}, ${propertyArea}, ${propertyPrice}`;
            }
            
            if (scheduleModal) {
                scheduleModal.classList.add('active');
            }
        });
    });
    
    if (scheduleModalClose) {
        scheduleModalClose.addEventListener('click', function() {
            scheduleModal.classList.remove('active');
        });
    }
    
    if (scheduleModal) {
        scheduleModal.addEventListener('click', function(e) {
            if (e.target === scheduleModal) {
                scheduleModal.classList.remove('active');
            }
        });
    }
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (loginModal && loginModal.classList.contains('active')) {
                loginModal.classList.remove('active');
            }
            if (scheduleModal && scheduleModal.classList.contains('active')) {
                scheduleModal.classList.remove('active');
            }
        }
    });
    
    // ========================================
    // Form Submissions
    // ========================================
    
    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('fb-name').value.trim();
            const email = document.getElementById('fb-email').value.trim();
            const message = document.getElementById('fb-message').value.trim();
            
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Пожалуйста, введите корректный email', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            feedbackForm.reset();
        });
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const login = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!login || !password) {
                showNotification('Введите логин и пароль', 'error');
                return;
            }
            
            // Simulate login
            showNotification('Вход выполнен успешно!', 'success');
            setTimeout(() => {
                loginModal.classList.remove('active');
                loginForm.reset();
            }, 1000);
        });
    }
    
    // Schedule View Form
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('sv-name').value.trim();
            const phone = document.getElementById('sv-phone').value.trim();
            
            if (!name || !phone) {
                showNotification('Пожалуйста, заполните имя и телефон', 'error');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\d\+\-\(\)\s]{10,20}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Заявка на просмотр успешно отправлена! Менеджер свяжется с вами для подтверждения.', 'success');
            setTimeout(() => {
                scheduleModal.classList.remove('active');
                scheduleForm.reset();
            }, 1500);
        });
    }
    
    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#48bb78';
                break;
            case 'error':
                notification.style.backgroundColor = '#f56565';
                break;
            default:
                notification.style.backgroundColor = '#4299e1';
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Add notification animations to document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ========================================
    // Virtual Tour Thumbnails
    // ========================================
    const tourThumbnails = document.querySelectorAll('.tour-thumb');
    const tourImage = document.querySelector('.tour-image');
    
    if (tourThumbnails.length > 0 && tourImage) {
        tourThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                tourThumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Change main image (in real implementation, this would load different images)
                const newSrc = this.getAttribute('src');
                tourImage.style.opacity = '0';
                
                setTimeout(() => {
                    tourImage.setAttribute('src', newSrc);
                    tourImage.style.opacity = '1';
                }, 300);
            });
        });
    }
    
    // Virtual Tour Navigation Buttons
    const tourPrev = document.getElementById('tourPrev');
    const tourNext = document.getElementById('tourNext');
    
    if (tourPrev && tourNext && tourThumbnails.length > 0) {
        let currentIndex = 0;
        
        tourPrev.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + tourThumbnails.length) % tourThumbnails.length;
            tourThumbnails[currentIndex].click();
        });
        
        tourNext.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % tourThumbnails.length;
            tourThumbnails[currentIndex].click();
        });
    }
    
    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or modal trigger
            if (href === '#' || href.startsWith('#login')) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // View Plan Button (Placeholder)
    // ========================================
    const viewPlanBtns = document.querySelectorAll('.view-plan');
    viewPlanBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyCard = this.closest('.property-card');
            const propertyTitle = propertyCard.querySelector('h3').textContent;
            showNotification(`Планировка: ${propertyTitle}. В полной версии откроется PDF с планировкой.`, 'info');
        });
    });
    
    // ========================================
    // Intersection Observer for Animations
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.property-card, .news-card, .infra-item, .office-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========================================
    // Console Info
    // ========================================
    console.log('%c ЖК "Панорама" - Сайт загружен успешно! ', 'background: #2c5282; color: white; font-size: 14px; padding: 10px;');
    console.log('Функционал сайта:');
    console.log('- Фильтрация недвижимости');
    console.log('- Модальные окна (вход, запись на просмотр)');
    console.log('- Формы с валидацией');
    console.log('- Адаптивное меню');
    console.log('- Плавная прокрутка');
    console.log('- Анимации при скролле');
});
