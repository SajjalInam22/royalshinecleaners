/* =============================================
   ROYAL SHINE CLEANERS - MAIN JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== PRELOADER ===== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 900);
  });


  /* ===== HEADER SCROLL ===== */
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navbar.classList.toggle('open');
  });
  // Close menu on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navbar.classList.remove('open');
    });
  });


  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const updateActiveNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        counter.textContent = Math.floor(current).toLocaleString();
        if (current < target) requestAnimationFrame(update);
      };
      update();
    });
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);


  /* ===== SCROLL REVEAL ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => el.classList.add('revealed'), parseInt(delay, 10));
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-left, .reveal-right, [data-delay]').forEach(el => {
    revealObserver.observe(el);
  });

  // Service cards staggered reveal
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.setProperty('data-delay', i * 100);
    card.setAttribute('data-delay', i * 100);
    revealObserver.observe(card);
  });


  /* ===== REVIEWS SLIDER ===== */
  const track = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.review-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    const totalSlides = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return 3;
    }

    function getCardWidth() {
      if (!cards.length) return 0;
      const card = cards[0];
      const style = window.getComputedStyle(card);
      return card.offsetWidth + parseFloat(style.marginRight || 0) + 24; // 24px gap
    }

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      const cardW = getCardWidth();
      track.style.transform = `translateX(${-currentIndex * cardsPerView * cardW}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Auto-play
    let autoPlay = setInterval(() => goTo((currentIndex + 1) % totalSlides), 4500);
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => goTo((currentIndex + 1) % totalSlides), 4500);
      });
    });

    // Touch/drag support
    let startX = 0, isDragging = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    track.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });
    track.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });

    // Resize handler
    window.addEventListener('resize', () => {
      const newCPV = getCardsPerView();
      if (newCPV !== cardsPerView) {
        cardsPerView = newCPV;
        currentIndex = 0;
        buildDots();
      }
      goTo(currentIndex);
    });

    buildDots();
    goTo(0);
  }


  /* ===== CONTACT FORM ===== */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        const val = field.value.trim();
        if (!val) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });

      // Validate phone
      const phone = document.getElementById('phone');
      const phonePattern = /^[\+\d][\d\s\-]{6,}/;
      if (phone && phone.value.trim() && !phonePattern.test(phone.value.trim())) {
        phone.classList.add('error');
        valid = false;
      }

      // Validate email format if filled
      const email = document.getElementById('email');
      if (email && email.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
          email.classList.add('error');
          valid = false;
        }
      }

      if (valid) {
        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        setTimeout(() => {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
        }, 1500);
      } else {
        // Shake invalid fields
        form.querySelectorAll('.error').forEach(el => {
          el.style.animation = 'shake 0.4s ease';
          el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
        });
      }
    });

    // Remove error on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }


  /* ===== BACK TO TOP ===== */
  const backToTop = document.getElementById('backToTop');
  const handleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', handleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ===== SMOOTH ANCHOR SCROLLING ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

/* ===== SHAKE KEYFRAME (added via JS) ===== */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(shakeStyle);
