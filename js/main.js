/* ==========================================================================
   PORTFOLIO DYNAMIC CONTROLLER (js/main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modular components
    initThemeSwitcher();
    initParticlesBackground();
    initHeaderScroll();
    initActiveNavObserver();
    initMobileMenu();
    initMagneticButtons();
    initLocalClock();
    initStatsCounter();
    initProjectFilters();
    initProjectModals();
    initTestimonialsSlider();
    initContactWidgets();
    initCard3DTilt();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK & LIGHT)
   ========================================================================== */
function initThemeSwitcher() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check cached preference, default to dark
    const cachedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', cachedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   2. PARTICLES BACKGROUND CANVAS
   ========================================================================== */
function initParticlesBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Handle canvas resizing
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object Structure
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.density = (Math.random() * 30) + 10;
        }

        draw() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = currentTheme === 'light' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Natural drift
            this.baseX += this.speedX;
            this.baseY += this.speedY;

            // Screen boundary reset
            if (this.baseX < 0) this.baseX = canvas.width;
            if (this.baseX > canvas.width) this.baseX = 0;
            if (this.baseY < 0) this.baseY = canvas.height;
            if (this.baseY > canvas.height) this.baseY = 0;

            this.x = this.baseX;
            this.y = this.baseY;

            // Interactive cursor repulsion
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    // Populate particles density relative to screen width
    function init() {
        particles = [];
        const quantity = Math.floor((canvas.width * canvas.height) / 14000);
        for (let i = 0; i < quantity; i++) {
            particles.push(new Particle());
        }
    }
    init();
    window.addEventListener('resize', init);

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   3. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. ACTIVE NAV LINK OBSERVER
   ========================================================================== */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null,
        threshold: 0.3,
        rootMargin: "-80px 0px 0px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));

    // Scroll reveal triggers
    const revealElements = document.querySelectorAll('.reveal-element');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleBtn.classList.remove('active');
        });
    });
}

/* ==========================================================================
   6. MAGNETIC HOVER BUTTONS
   ========================================================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const bounds = btn.getBoundingClientRect();
            const x = e.clientX - bounds.left - bounds.width / 2;
            const y = e.clientY - bounds.top - bounds.height / 2;
            
            // Subtly pull toward cursor
            btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.03)`;
            btn.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.25)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
            btn.style.boxShadow = '';
        });
    });
}

/* ==========================================================================
   7. BENTO DIGITAL CLOCK
   ========================================================================== */
function initLocalClock() {
    const clockEl = document.getElementById('local-clock');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        
        const hrs = String(istTime.getHours()).padStart(2, '0');
        const mins = String(istTime.getMinutes()).padStart(2, '0');
        const secs = String(istTime.getSeconds()).padStart(2, '0');
        
        clockEl.textContent = `${hrs}:${mins}:${secs}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================================
   8. STATS COUNTER ACTION
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute('data-target'), 10);
                let current = 0;
                const speed = 100; // time step scale
                const increment = limit / speed;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= limit) {
                        target.textContent = `${limit}+`;
                        clearInterval(timer);
                    } else {
                        target.textContent = `${Math.floor(current)}+`;
                    }
                }, 15);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
}

/* ==========================================================================
   9. PROJECTS CATEGORY FILTER
   ========================================================================== */
function initProjectFilters() {
    const filterContainer = document.getElementById('filter-container');
    const filterBg = document.getElementById('filter-bg');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterContainer || !filterBg) return;

    // Positions sliding background cover on active btn
    function updateSlidingBg(activeBtn) {
        filterBg.style.left = `${activeBtn.offsetLeft}px`;
        filterBg.style.width = `${activeBtn.offsetWidth}px`;
    }

    // Set initial position
    const defaultActive = filterContainer.querySelector('.filter-btn.active');
    if (defaultActive) {
        // Delay slightly for render layouts
        setTimeout(() => updateSlidingBg(defaultActive), 150);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSlidingBg(btn);

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // CSS animations hooks
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    window.addEventListener('resize', () => {
        const active = filterContainer.querySelector('.filter-btn.active');
        if (active) updateSlidingBg(active);
    });
}

/* ==========================================================================
   10. PROJECTS DETAIL OVERLAY MODAL
   ========================================================================== */
const projectData = {
    "1": {
        title: "Aetheria eCommerce",
        category: "Frontend & Design",
        longDesc: "Aetheria is an immersive, virtual shopping layout offering seamless smooth scrolling, 3D CSS item rotation, and rapid card filtering. We designed it using custom grid mechanics and loaded items dynamically using standard REST resources.",
        techStack: ["HTML5", "CSS Grid", "JS Animations", "Figma", "REST API"],
        timeline: "4 Weeks",
        github: "https://github.com",
        live: "#",
        color: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)"
    },
    "2": {
        title: "Nova Dashboard",
        category: "Fullstack Web App",
        longDesc: "Nova is a highly elegant dashboard platform serving structured statistical graphics. It includes dark mode optimization, user authorization protocols, and modular responsive frameworks that render at 60fps on mobile viewports.",
        techStack: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
        timeline: "6 Weeks",
        github: "https://github.com",
        live: "#",
        color: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
    },
    "3": {
        title: "Orbit Chat Hub",
        category: "Interactive Design",
        longDesc: "Orbit delivers standard messaging threads using WebSocket pipes to ensure real-time notification responses. We added glowing canvas visual components, custom emojis, and a sliding drawer panel layout.",
        techStack: ["HTML5", "Vanilla CSS", "JavaScript", "WebSockets", "Node.js"],
        timeline: "3 Weeks",
        github: "https://github.com",
        live: "#",
        color: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
    }
};

function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');

    if (!modal || !closeBtn) return;

    // Elements inside modal to populate
    const modalBg = document.getElementById('modal-hero-bg');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-long-desc');
    const modalTechBadges = document.getElementById('modal-tech-badges');
    const modalSidebarCategory = document.getElementById('modal-sidebar-category');
    const modalSidebarTimeline = document.getElementById('modal-sidebar-timeline');
    const modalGitLink = document.getElementById('modal-github-link');
    const modalLiveLink = document.getElementById('modal-live-link');

    function openModal(id) {
        const data = projectData[id];
        if (!data) return;

        // Populate details
        modalBg.style.backgroundImage = data.color;
        modalTag.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.longDesc;
        modalSidebarCategory.textContent = data.category;
        modalSidebarTimeline.textContent = data.timeline;
        modalGitLink.setAttribute('href', data.github);
        modalLiveLink.setAttribute('href', data.live);

        // Clear and add tech badges
        modalTechBadges.innerHTML = '';
        data.techStack.forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'project-tech-badge';
            badge.style.fontSize = '0.8rem';
            badge.style.padding = '4px 10px';
            badge.textContent = tech;
            modalTechBadges.appendChild(badge);
        });

        // Show modal overlay
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

/* ==========================================================================
   11. TESTIMONIALS DRAGGABLE CAROUSEL
   ========================================================================== */
function initTestimonialsSlider() {
    const container = document.getElementById('slider-container');
    const track = document.getElementById('slider-track');
    const dots = document.querySelectorAll('.dot-indicator');
    const cards = document.querySelectorAll('.testimonial-card');

    if (!container || !track || cards.length === 0) return;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Calculate maximum drag boundaries
    function getCardWidth() {
        return cards[0].offsetWidth + 30; // Card width + gap
    }

    // Touch & Mouse Drag Listeners
    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart, { passive: true });
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('touchend', dragEnd);
    container.addEventListener('mousemove', drag);
    container.addEventListener('touchmove', drag, { passive: true });
    container.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        animationID = requestAnimationFrame(animationLoop);
    }

    function drag(e) {
        if (!isDragging) return;
        const currentX = getPositionX(e);
        const diffX = currentX - startX;
        currentTranslate = prevTranslate + diffX;
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);

        const cardWidth = getCardWidth();
        const movedBy = currentTranslate - prevTranslate;

        // Threshold of drag to switch card
        if (movedBy < -100 && currentIndex < cards.length - 1) {
            currentIndex += 1;
        } else if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        slideToIndex(currentIndex);
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function animationLoop() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animationLoop);
    }

    function setSliderPosition() {
        // Enforce boundary damping
        const maxTranslate = 0;
        const minTranslate = -(getCardWidth() * (cards.length - 1));
        if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
        if (currentTranslate < minTranslate) currentTranslate = minTranslate;

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function slideToIndex(index) {
        currentIndex = index;
        const cardWidth = getCardWidth();
        currentTranslate = -index * cardWidth;
        prevTranslate = currentTranslate;
        
        track.style.transform = `translateX(${currentTranslate}px)`;

        // Update dot indicators
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            slideToIndex(index);
        });
    });

    // Re-adjust slider on layout changes
    window.addEventListener('resize', () => {
        slideToIndex(currentIndex);
    });
}

/* ==========================================================================
   12. CONTACT INPUT COPIER & MORPH SUBMITTER
   ========================================================================== */
function initContactWidgets() {
    // Copy-to-clipboard widget
    const copyWidget = document.getElementById('copy-email-widget');
    const toast = document.getElementById('copy-toast');

    if (copyWidget && toast) {
        copyWidget.addEventListener('click', () => {
            const email = copyWidget.getAttribute('data-email');
            
            // Clipboard standard API
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add('active');
                setTimeout(() => toast.classList.remove('active'), 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // Submit morphing animation
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form && submitBtn) {
        form.addEventListener('submit', () => {
            submitBtn.classList.add('loading');

            // Simulate server delivery
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                
                // Canvas visual confetti trigger
                createConfettiBurst();

                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    form.reset();
                }, 3000);
            }, 1800);
        });
    }
}

// Particle confetti burst
function createConfettiBurst() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let confettis = [];
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

    class Confetti {
        constructor() {
            this.x = window.innerWidth / 2;
            this.y = window.innerHeight;
            this.size = Math.random() * 8 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = Math.random() * 15 - 7.5;
            this.speedY = Math.random() * -15 - 5;
            this.gravity = 0.35;
            this.alpha = 1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.015;
        }
    }

    for (let i = 0; i < 60; i++) {
        confettis.push(new Confetti());
    }

    function runConfetti() {
        let active = false;
        // Confettis are overlayed on particle background frame logic
        for (let i = confettis.length - 1; i >= 0; i--) {
            confettis[i].update();
            confettis[i].draw();
            if (confettis[i].alpha <= 0) {
                confettis.splice(i, 1);
            } else {
                active = true;
            }
        }
        if (active) requestAnimationFrame(runConfetti);
    }
    runConfetti();
}

/* ==========================================================================
   13. CARD 3D TILT EFFECT
   ========================================================================== */
function initCard3DTilt() {
    // Select all project cards and bento items
    const cards = document.querySelectorAll('.project-card, .bento-item');

    // Desktop only - skip on mobile to save performance
    if (window.innerWidth <= 768) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const bounds = card.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            // Compute tilt degrees based on position relative to center
            const xPercent = (mouseX / bounds.width - 0.5) * 2; // Range [-1, 1]
            const yPercent = (mouseY / bounds.height - 0.5) * 2; // Range [-1, 1]

            // Degrees of rotation limit
            const rotateX = -yPercent * 6; // Range [-6, 6] deg
            const rotateY = xPercent * 6; // Range [-6, 6] deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}
