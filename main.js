/* ================================================
   අපි යමු.lk – Main JavaScript
   Features: Dynamic Content, Image Slider (Bootstrap),
   Form Validation, Smooth Scrolling, Event Handling,
   Custom Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────
     1. SMOOTH SCROLLING
     Intercepts clicks on all anchor links
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─────────────────────────────────────
     2. SCROLL ANIMATIONS (Fade In Up)
     Uses IntersectionObserver for
     performance-friendly reveals
  ───────────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));


  /* ─────────────────────────────────────
     3. NAVBAR SCROLL EFFECT
     Adds shadow when user scrolls
  ───────────────────────────────────── */
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }


  /* ─────────────────────────────────────
     4. ACTIVE NAV LINK HIGHLIGHT
  ───────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });


  /* ─────────────────────────────────────
     5. EVENT FILTERING (Dynamic Content)
     Filters event cards by category
  ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      eventCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          // Re-trigger animation
          card.classList.remove('visible');
          void card.offsetWidth; // force reflow
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });

      // Show empty state if nothing matches
      const visible = [...eventCards].filter(c => c.style.display !== 'none');
      const emptyState = document.getElementById('empty-state');
      if (emptyState) emptyState.style.display = visible.length === 0 ? 'block' : 'none';
    });
  });


  /* ─────────────────────────────────────
     6. LIVE SEARCH
     Filters cards as user types
  ───────────────────────────────────── */
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  function doSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    let count = 0;

    eventCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const city  = card.querySelector('.event-city')?.textContent.toLowerCase() || '';
      const match = title.includes(query) || city.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) count++;
    });

    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = count === 0 ? 'block' : 'none';

    // Reset filter buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
  }

  if (searchBtn) searchBtn.addEventListener('click', doSearch);
  if (searchInput) {
    searchInput.addEventListener('keyup', e => {
      if (e.key === 'Enter') doSearch();
      if (searchInput.value === '') {
        eventCards.forEach(c => c.style.display = '');
      }
    });
  }


  /* ─────────────────────────────────────
     7. RSVP MODAL – Dynamic Content
     Populates modal with event data
  ───────────────────────────────────── */
  const rsvpBtns = document.querySelectorAll('.btn-rsvp[data-event]');
  rsvpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const eventName = btn.getAttribute('data-event');
      const modalTitle = document.getElementById('rsvpModalTitle');
      const modalEventName = document.getElementById('modalEventName');
      if (modalTitle) modalTitle.textContent = `RSVP – ${eventName}`;
      if (modalEventName) modalEventName.value = eventName;
    });
  });


  /* ─────────────────────────────────────
     8. FORM VALIDATION (RSVP + Contact)
     Shows custom error messages
  ───────────────────────────────────── */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[0-9+\s\-]{7,15}$/.test(phone);
  }

  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.nextElementSibling;
    if (errEl && errEl.classList.contains('error-msg')) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.nextElementSibling;
    if (errEl && errEl.classList.contains('error-msg')) {
      errEl.style.display = 'none';
    }
  }

  // RSVP Form
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = rsvpForm.querySelectorAll('[required]');
      fields.forEach(f => clearError(f));

      fields.forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          valid = false;
        } else if (field.type === 'email' && !validateEmail(field.value)) {
          showError(field, 'Please enter a valid email address.');
          valid = false;
        } else if (field.type === 'tel' && !validatePhone(field.value)) {
          showError(field, 'Please enter a valid phone number.');
          valid = false;
        }
      });

      if (valid) {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('rsvpModal'));
        if (modal) modal.hide();
        rsvpForm.reset();
        showToast('🎉', 'RSVP Confirmed!', "You're registered. See you there!");
      }
    });

    // Real-time validation
    rsvpForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(f => clearError(f));

      fields.forEach(field => {
        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          valid = false;
        } else if (field.type === 'email' && !validateEmail(field.value)) {
          showError(field, 'Please enter a valid email address.');
          valid = false;
        }
      });

      if (valid) {
        contactForm.reset();
        showToast('✅', 'Message Sent!', "We'll get back to you shortly.");
      }
    });

    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });
  }


  /* ─────────────────────────────────────
     9. TOAST NOTIFICATION
     Custom popup notifications
  ───────────────────────────────────── */
  function showToast(icon, title, message) {
    // Remove existing toasts
    document.querySelectorAll('.toast-custom').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-custom';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div>
        <strong style="display:block;margin-bottom:2px">${title}</strong>
        <small style="color:rgba(255,255,255,0.6)">${message}</small>
      </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }


  /* ─────────────────────────────────────
     10. HOVER EFFECTS on event cards
     Custom tooltip-style popups
  ───────────────────────────────────── */
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.cursor = 'pointer';
    });
  });


  /* ─────────────────────────────────────
     11. COUNTER ANIMATION (Hero Stats)
     Animates numbers from 0 to target
  ───────────────────────────────────── */
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Observe stat numbers
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, suffix);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));


  /* ─────────────────────────────────────
     12. CUSTOM ANIMATIONS – Staggered
     Cards animate in with delays
  ───────────────────────────────────── */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.event-card').forEach(card => {
    card.classList.add('fade-in-up');
    cardObserver.observe(card);
  });


  /* ─────────────────────────────────────
     13. CAROUSEL AUTO-PLAY control
     Pause on hover
  ───────────────────────────────────── */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      bootstrap.Carousel.getInstance(carousel)?.pause();
    });
    carousel.addEventListener('mouseleave', () => {
      bootstrap.Carousel.getInstance(carousel)?.cycle();
    });
  }

});