/**
 * ATELIER AURA — MAIN APPLICATION LOGIC
 * Header Scroll State, Mobile Navigation, Testimonials Carousel, FAQ Accordion,
 * Scroll Reveal Animations, and Luxury Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation Header Transition
  const siteHeader = document.querySelector('.site-header');
  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // 2. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer .btn');

  function toggleMobileMenu() {
    const isOpen = mobileDrawer.classList.toggle('is-open');
    mobileToggle.classList.toggle('is-active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    mobileToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('is-open');
    mobileToggle.classList.remove('is-active');
    document.body.style.overflow = '';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .curtain-wrap');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items for clean accordion behavior
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 5. Testimonial Reviews Carousel
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');
  let currentSlide = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('is-active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('is-active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('is-active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('is-active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 6500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  const carouselContainer = document.querySelector('.reviews-carousel');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) {
        nextSlide();
        resetAutoplay();
      } else if (touchEndX > touchStartX + 40) {
        prevSlide();
        resetAutoplay();
      }
    }, { passive: true });

    startAutoplay();
  }

  // 6. Smooth Scroll Anchor Links with Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight + 10;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Global Toast Notification System
  window.showToast = function (title, message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✦</span>
      <div class="toast-body">
        <strong style="display:block; font-size:0.85rem; letter-spacing:0.04em; margin-bottom:2px; color: var(--color-accent);">${title}</strong>
        <span style="font-size:0.8rem; color: var(--color-text-light-muted); line-height:1.4;">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('is-show');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  };
});
