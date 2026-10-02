/* =========================================================
   Youthwave — Main JavaScript
   Handles: mobile navigation, scroll reveal, lightbox,
   and demo contact form validation.
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Mobile navigation toggle
     ------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (header && navToggle && nav) {
    const closeNav = () => {
      header.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a link is clicked (mobile)
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        header.classList.contains('is-open') &&
        !header.contains(e.target)
      ) {
        closeNav();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeNav();
    });
  }

  /* -------------------------------------------------------
     2. Scroll reveal
     ------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* -------------------------------------------------------
     3. Gallery lightbox
     Works for any element with class .lightbox-trigger
     or any image inside a .gallery__item.
     ------------------------------------------------------- */
  const lightboxTriggers = document.querySelectorAll(
    '.lightbox-trigger, .gallery__item img'
  );

  if (lightboxTriggers.length) {
    // Build lightbox once
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');

    lightbox.innerHTML = `
      <div class="lightbox__content">
        <button class="lightbox__close" type="button" aria-label="Close preview">&times;</button>
        <img src="" alt="">
      </div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    let lastFocused = null;

    const openLightbox = (src, alt) => {
      lastFocused = document.activeElement;
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
      if (lastFocused) lastFocused.focus();
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        // If it's an img inside .gallery__item, use its src/alt
        const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  /* -------------------------------------------------------
     4. Contact form validation (demo only)
     ------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const successBox = contactForm.querySelector('.form__success');

    const showError = (field, message) => {
      const errorEl = field.parentElement.querySelector('.form__error');
      if (errorEl) errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    };

    const clearError = (field) => {
      const errorEl = field.parentElement.querySelector('.form__error');
      if (errorEl) errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
    };

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      let isValid = true;

      // Name
      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      } else {
        clearError(name);
      }

      // Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'Please enter your email address.');
        isValid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(email);
      }

      // Subject
      if (!subject.value.trim()) {
        showError(subject, 'Please enter a subject.');
        isValid = false;
      } else {
        clearError(subject);
      }

      // Message
      if (!message.value.trim()) {
        showError(message, 'Please write a short message.');
        isValid = false;
      } else {
        clearError(message);
      }

      if (!isValid) return;

      // Demo success
      contactForm.reset();
      if (successBox) {
        successBox.textContent =
          'Thanks! Your message has been received. This is a demo form — no data was actually sent.';
        successBox.classList.add('is-visible');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* -------------------------------------------------------
     5. Footer year (optional)
     ------------------------------------------------------- */
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();