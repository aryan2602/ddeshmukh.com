document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Typed.js for Hero Section
    const typed = new Typed('#typed-text', {
        strings: [
            'Java Full Stack Developer.',
            'Spring Boot Architect.',
            'Microservices Engineer.',
            'Scalable Systems Builder.'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. GSAP Animations Registration
    gsap.registerPlugin(ScrollTrigger);

    // Hero Timeline (Load Animation)
    const heroTl = gsap.timeline();
    heroTl.fromTo(".fade-up", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(".hero-visual",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
    );

    // General Section Fade-ups on Scroll
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.fromTo(header,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%"
                }
            }
        );
    });

    // Staggered Cards (Skills & Projects)
    const staggerGroups = ['.skills-grid', '.project-grid'];
    staggerGroups.forEach(selector => {
        const wrapper = document.querySelector(selector);
        if(wrapper) {
            const cards = wrapper.querySelectorAll('.glass-card');
            gsap.fromTo(cards,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 85%"
                    }
                }
            );
        }
    });

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
        gsap.fromTo(item,
            { x: -30, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.7, ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%"
                }
            }
        );
    });

    // 4. Counter Animation logic (Vanilla JS Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // roughly 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(counter); // Run once
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Google Sheets Form Submission Logic
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzE9dKFyKGcE22sHGX_Lgwq7KuIagArnP4JZWpc_ak9fNDgNMkXFbOOb1pbCa6k6SzK/exec';

if(contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault(); // Prevent page reload
        
        // Change button text to show it's working
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite;"></i>';
        
        const formData = new FormData(contactForm);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.result === "success") {
                submitBtn.innerHTML = 'Message Sent! <i class="ph ph-check-circle"></i>';
                submitBtn.style.background = "#10b981"; // Turn green
                contactForm.reset(); // Clear the form
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = "";
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            submitBtn.innerHTML = 'Error. Try Again.';
            submitBtn.style.background = "#ef4444"; // Turn red
        });
    });
}
