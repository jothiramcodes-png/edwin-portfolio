document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky Header and Active Link on Scroll
    window.addEventListener('scroll', () => {
        let current = '';

        // Header Shadow on Scroll
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
            header.style.padding = '15px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '20px 0';
        }

        // Active Link Highlighting
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Basic Entrance Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.skill-card, .stat-item, .about-text, .education-block, .internship-block, .gallery-item, .cert-card, .hobby-card, .image-wrapper, .project-card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navItems = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navItems.classList.toggle('active');
            mobileMenu.classList.toggle('is-active');
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navItems.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('is-active');
        });
    });

    // Custom CSS for animations added via JS for cleaner organization
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .appear {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .nav-links a.active {
            color: var(--primary-color) !important;
            border-bottom: 2px solid var(--primary-color);
        }
        .menu-toggle.is-active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        .menu-toggle.is-active span:nth-child(2) {
            opacity: 0;
        }
        .menu-toggle.is-active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
    document.head.appendChild(styleSheet);
    // Background Particle System
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', initCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse Interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                if (mouse.x < this.x && this.x < canvas.width - 10) this.x += 2;
                if (mouse.x > this.x && this.x > 10) this.x -= 2;
                if (mouse.y < this.y && this.y < canvas.height - 10) this.y += 2;
                if (mouse.y > this.y && this.y > 10) this.y -= 2;
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 123, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 123, 255, ${1 - distance / 150})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animate);
    }

    initCanvas();
    animate();
});
