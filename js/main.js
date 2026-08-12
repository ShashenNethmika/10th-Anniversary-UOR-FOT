// ===== University of Ruhuna - Faculty of Technology 10th Anniversary =====
// ===== Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initCampusMap();
});

// ===== Particle Animation (Hero Canvas) =====
function initParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadeDirection = 1;
            // Gold tones
            const goldShade = Math.random();
            if (goldShade < 0.5) {
                this.color = `rgba(212, 168, 67, ${this.opacity})`;
                this.baseR = 212; this.baseG = 168; this.baseB = 67;
            } else if (goldShade < 0.8) {
                this.color = `rgba(245, 200, 66, ${this.opacity})`;
                this.baseR = 245; this.baseG = 200; this.baseB = 66;
            } else {
                this.color = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
                this.baseR = 255; this.baseG = 255; this.baseB = 255;
            }
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Fade in and out
            this.opacity += this.fadeSpeed * this.fadeDirection;
            if (this.opacity >= 0.6) this.fadeDirection = -1;
            if (this.opacity <= 0.05) {
                this.fadeDirection = 1;
                this.reset();
            }

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.baseR}, ${this.baseG}, ${this.baseB}, ${this.opacity})`;
            ctx.fill();

            // Glow effect for larger particles
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.baseR}, ${this.baseG}, ${this.baseB}, ${this.opacity * 0.1})`;
                ctx.fill();
            }
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw subtle connection lines between close particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const lineOpacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 168, 67, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

// ===== Countdown Timer =====
function initCountdown() {
    const targetDate = new Date('2026-08-14T09:00:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Event is happening or has passed
            document.getElementById('countDays').textContent = '0';
            document.getElementById('countHours').textContent = '0';
            document.getElementById('countMinutes').textContent = '0';
            document.getElementById('countSeconds').textContent = '0';

            const countdownSection = document.querySelector('.countdown');
            if (countdownSection) {
                countdownSection.innerHTML = '<div class="countdown-item" style="min-width: 200px;"><span class="countdown-number" style="font-size: 1.5rem;">🎉</span><span class="countdown-label" style="font-size: 1rem; letter-spacing: 1px;">Event is Live!</span></div>';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('countDays');
        const hoursEl = document.getElementById('countHours');
        const minutesEl = document.getElementById('countMinutes');
        const secondsEl = document.getElementById('countSeconds');

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link highlight
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ===== Scroll Animations (Intersection Observer) =====
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-triggering if needed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== Interactive Campus Map =====
function initCampusMap() {
    const markers = document.querySelectorAll('.map-marker');
    const legendItems = document.querySelectorAll('.map-legend-item');

    if (!markers.length) return;

    // Legend click to highlight and scroll to marker
    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetVenue = item.getAttribute('data-target');
            const markerEl = document.querySelector(`.map-marker[data-venue="${targetVenue}"]`);
            if (!markerEl) return;

            // Remove active from all markers
            markers.forEach(m => m.classList.remove('active'));

            // Activate target marker
            markerEl.classList.add('active');

            // Scroll map into view if needed
            markerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Auto remove after 4 seconds
            setTimeout(() => {
                markerEl.classList.remove('active');
            }, 4000);
        });
    });

    // Touch support: toggle popup on tap for mobile
    markers.forEach(marker => {
        marker.addEventListener('click', (e) => {
            // On mobile, toggle active state
            const isActive = marker.classList.contains('active');
            markers.forEach(m => m.classList.remove('active'));
            if (!isActive) {
                marker.classList.add('active');
                // Auto hide after 4 seconds
                setTimeout(() => {
                    marker.classList.remove('active');
                }, 4000);
            }
        });
    });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
