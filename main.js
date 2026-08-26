/**
 * AD LIVE EVENTS – main.js v5.0 (Premium Edition)
 * Cursor · Particles · Audio · Filters · Modals · Progress · Booking Calculator
 * + Cinematic Loader · Gold Cursor · Stagger Animations · Video Fade-In
 */
'use strict';

/* ══════════════════════════════════════════════════
   PREMIUM ENHANCEMENTS — v5.0
══════════════════════════════════════════════════ */

/* ─── A. CINEMATIC PAGE LOADER ─── */
(function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  // Hide after animation completes (~1.5s) + small buffer
  const hideLoader = () => {
    loader.classList.add('hidden');
    // Remove from DOM after transition ends to free resources
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 1800);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 1800), { once: true });
    // Failsafe: always hide after 4s
    setTimeout(hideLoader, 4000);
  }
})();

/* ─── B. CUSTOM GOLD CURSOR (disabled) ─── */
(function initCursor() {
  return; // cursor removed per user preference
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');
  if (!ring || !dot) return;

  // Only activate on devices with a real pointer
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    ring.style.display = 'none';
    dot.style.display  = 'none';
    return;
  }

  let mx = -100, my = -100; // start offscreen
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly
    dot.style.left = `${mx}px`;
    dot.style.top  = `${my}px`;
  }, { passive: true });

  // Ring follows with smooth lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animCursor() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = `${rx}px`;
    ring.style.top  = `${ry}px`;
    rafId = requestAnimationFrame(animCursor);
  }
  animCursor();

  // Expand ring on interactive elements
  const hoverTargets = 'a, button, [role="button"], .service-card, .port-item, .film-card, .tcard, .pkg-card, .scard-cta, input, select, textarea, label';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
})();

/* ─── C. HERO VIDEO FADE-IN ─── */
(function initVideoFadeIn() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  const onReady = () => video.classList.add('loaded');
  if (video.readyState >= 3) {
    onReady();
  } else {
    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('loadeddata', onReady, { once: true });
    // Fallback: fade in after 2s regardless
    setTimeout(onReady, 2000);
  }
})();

/* ─── D. STAGGER-CHILDREN OBSERVER ─── */
(function initStaggerObserver() {
  const staggerEls = document.querySelectorAll('.stagger-children');
  if (!staggerEls.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  staggerEls.forEach(el => obs.observe(el));
})();

/* ─── E. GOLD-BAR VISIBLE CLASS (for pulsing dot) ─── */
(function initGoldBarObserver() {
  const goldBars = document.querySelectorAll('.gold-bar');
  if (!goldBars.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  goldBars.forEach(bar => obs.observe(bar));
})();

/* ─── F. SUBTLE PARALLAX ON HERO VIDEO ─── */
(function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      // Very subtle: move content up gently as user scrolls
      heroContent.style.transform = `translateY(${scrollY * 0.08}px)`;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════
   ORIGINAL MAIN.JS CODE BELOW (unchanged)
══════════════════════════════════════════════════ */

/* ── 1. NAVBAR & SCROLL STATE ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50), { passive: true });
navbar.classList.toggle('scrolled', window.scrollY > 50);

/* ── 2. MOBILE NAV ── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
navMenu?.querySelectorAll('a, button').forEach(l => l.addEventListener('click', closeNav));
document.addEventListener('click', e => { if (navbar && !navbar.contains(e.target)) closeNav(); });

function closeNav() {
  navMenu?.classList.remove('open');
  navToggle?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ── 3. HERO GOLD STARDUST CANVAS PARTICLES ── */
const canvas = document.getElementById('heroGoldCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class GoldParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.alpha = Math.random() * 0.6 + 0.2;
      this.fade = Math.random() * 0.008 + 0.003;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < 0) {
        this.reset();
        this.y = height + 5;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#c9a84c';
      ctx.fill();
    }
  }

  for (let i = 0; i < 45; i++) {
    particles.push(new GoldParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ── 5. HERO BACKGROUND VIDEO AUDIO TOGGLE ── */
const heroVideo       = document.getElementById('heroVideo');
const heroAudioToggle = document.getElementById('heroAudioToggle');
const audioIcon       = document.getElementById('audioIcon');
const audioLabel      = document.getElementById('audioLabel');

if (heroVideo && heroAudioToggle) {
  heroAudioToggle.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    if (heroVideo.muted) {
      if (audioIcon) audioIcon.textContent = '🔇';
      if (audioLabel) audioLabel.textContent = 'Sound Off';
      heroAudioToggle.setAttribute('aria-label', 'Unmute hero video');
    } else {
      if (audioIcon) audioIcon.textContent = '🔊';
      if (audioLabel) audioLabel.textContent = 'Sound On';
      heroAudioToggle.setAttribute('aria-label', 'Mute hero video');
      // If paused due to browser policies, force play
      heroVideo.play().catch(() => {});
    }
  });
}

/* ── 6. SCROLL REVEAL OBSERVER ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
    
    // Support data-delay if present
    let delay = 0;
    if (entry.target.hasAttribute('data-delay')) {
      delay = parseInt(entry.target.getAttribute('data-delay'));
    } else {
      delay = Math.min(siblings.indexOf(entry.target) * 80, 400);
    }
    
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.01, rootMargin: '0px 0px 20px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── 6B. ADVANCED ANIMATIONS & SEQUENCES ── */

// 1. Scroll Progress Bar
const scrollProgressBar = document.createElement('div');
scrollProgressBar.id = 'scrollProgressBar';
document.body.appendChild(scrollProgressBar);

// 2. Back to Top Button
const backToTopBtn = document.createElement('button');
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top of page');
backToTopBtn.setAttribute('data-magnetic', '');
backToTopBtn.innerHTML = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
`;
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll Event Handler for Progress & Back-to-top
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  
  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }
  
  if (backToTopBtn) {
    if (scrollTop > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
}, { passive: true });

// 3. Magnetic Buttons
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('[data-magnetic]');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
initMagneticButtons();

// 4. Smooth Title Reveal (Clean Native HTML Rendering)
// Removed split text character splitting to prevent missing heading text and empty layout gaps.

// 5. Card Dynamic Spotlight Glow on Mouse Move
const spotlightCards = document.querySelectorAll('.service-card, .legacy-card, .tcard, .pkg-card, .cam-card, .vss-card');
spotlightCards.forEach(card => {
  card.classList.add('card-spotlight');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  });
});

// 6. Smooth Parallax Scroll Images
const parallaxImgs = document.querySelectorAll('.parallax-img');
window.addEventListener('scroll', () => {
  parallaxImgs.forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = img.dataset.speed || 0.12;
      const yPos = (rect.top - window.innerHeight / 2) * speed;
      img.style.transform = `scale(1.12) translateY(${yPos}px)`;
    }
  });
}, { passive: true });

/* ── 7. NUMBER COUNTER ANIMATION ── */
function animateCount(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix || '';
  const decimal = el.dataset.decimal === 'true';
  const dur     = 2000;
  let start     = null;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const v = target * ease(p);
    el.textContent = (decimal ? v.toFixed(1) : Math.floor(v)) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = (decimal ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); statObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => statObs.observe(el));

/* ── 8. SERVICE & CRAFT CARD 3D TILT ── */
document.querySelectorAll('.service-card, .craft-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${(-y * 5).toFixed(1)}deg) rotateY(${(x * 5).toFixed(1)}deg)`;
    card.style.transition = 'transform 0.05s linear';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

/* ── 9. ACTIVE NAV OBSERVER ── */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => sectionObs.observe(s));

/* ── 10. STEP CIRCLES POP ANIMATION ── */
const circleObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'circleIn .5s cubic-bezier(.23,1,.32,1) both';
      circleObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.step-circle').forEach(c => circleObs.observe(c));

/* ── 11. PORTFOLIO CATEGORY FILTER TABS ── */
const filterTabs = document.querySelectorAll('.filter-tab-btn');
const portCards  = document.querySelectorAll('.portfolio-masonry .port-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;

    filterTabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', String(t === tab));
    });

    portCards.forEach(card => {
      const cat = card.dataset.category || '';
      const match = filter === 'all' || cat === filter || (filter === 'films' && card.classList.contains('port-card-yt'));

      if (match) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 30);
      } else {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => { card.style.display = 'none'; }, 260);
      }
    });

    // Re-initialize active photo list for lightbox
    setTimeout(initPhotoTriggers, 300);
  });
});

/* ── 12. VIDEO MODAL CONTROLLER ── */
const videoModal      = document.getElementById('videoModal');
const iframe          = document.getElementById('modalIframe');
const videoModalClose = document.getElementById('modalClose');

function openVideoModal(videoId) {
  if (!videoId) return;
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  videoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  videoModalClose?.focus();
}

function closeVideoModal() {
  videoModal.hidden = true;
  iframe.src = '';
  document.body.style.overflow = '';
}

videoModalClose?.addEventListener('click', closeVideoModal);
videoModal?.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });

/* ── 13. FULL PHOTO LIGHTBOX MODAL ── */
const photoModal        = document.getElementById('photoModal');
const photoModalImg     = document.getElementById('photoModalImg');
const photoModalCaption = document.getElementById('photoModalCaption');
const photoModalCounter = document.getElementById('photoModalCounter');
const photoModalClose   = document.getElementById('photoModalClose');
const photoModalPrev    = document.getElementById('photoModalPrev');
const photoModalNext    = document.getElementById('photoModalNext');
const photoModalBackdrop= document.getElementById('photoModalBackdrop');

let photoList = [];
let currentPhotoIndex = 0;

function initPhotoTriggers() {
  // Only select currently visible triggers
  const triggers = document.querySelectorAll('.port-photo-trigger');
  photoList = [];
  
  triggers.forEach(trigger => {
    // If element is hidden via tab filtering, skip
    if (trigger.closest('.port-card') && trigger.closest('.port-card').style.display === 'none') {
      return;
    }
    const src = trigger.dataset.fullImg || trigger.querySelector('img')?.src;
    const caption = trigger.dataset.caption || trigger.querySelector('img')?.alt || 'AD Live Events';
    if (src) {
      photoList.push({ src, caption, element: trigger });
      const currentIdx = photoList.length - 1;

      trigger.onclick = (e) => {
        e.preventDefault();
        openPhotoModal(currentIdx);
      };
      trigger.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPhotoModal(currentIdx);
        }
      };
    }
  });
}

function openPhotoModal(idx) {
  if (!photoList.length) return;
  currentPhotoIndex = (idx + photoList.length) % photoList.length;
  renderPhotoModal();
  photoModal.hidden = false;
  document.body.style.overflow = 'hidden';
  photoModalClose?.focus();
}

function renderPhotoModal() {
  const item = photoList[currentPhotoIndex];
  if (!item) return;
  photoModalImg.src = item.src;
  photoModalImg.alt = item.caption;
  photoModalCaption.textContent = item.caption;
  photoModalCounter.textContent = `${currentPhotoIndex + 1} / ${photoList.length}`;
}

function nextPhoto() {
  if (!photoList.length) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % photoList.length;
  renderPhotoModal();
}

function prevPhoto() {
  if (!photoList.length) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + photoList.length) % photoList.length;
  renderPhotoModal();
}

function closePhotoModal() {
  photoModal.hidden = true;
  photoModalImg.src = '';
  document.body.style.overflow = '';
}

photoModalClose?.addEventListener('click', closePhotoModal);
photoModalBackdrop?.addEventListener('click', closePhotoModal);
photoModalPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
photoModalNext?.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });

/* Touch swipe for lightbox */
let photoTouchStartX = 0;
photoModal?.addEventListener('touchstart', e => { photoTouchStartX = e.changedTouches[0].clientX; }, { passive: true });
photoModal?.addEventListener('touchend', e => {
  const diffX = e.changedTouches[0].clientX - photoTouchStartX;
  if (Math.abs(diffX) > 50) diffX < 0 ? nextPhoto() : prevPhoto();
}, { passive: true });

/* ── 14. INSTANT DATE & PACKAGE BOOKING MODAL ── */
const bookingModal         = document.getElementById('bookingModal');
const bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
const bookingModalClose    = document.getElementById('bookingModalClose');
const bmSubmitBtn          = document.getElementById('bmSubmitBtn');
const bmEventDate          = document.getElementById('bmEventDate');

// Set minimum date to today
if (bmEventDate) {
  const today = new Date().toISOString().split('T')[0];
  bmEventDate.min = today;
  bmEventDate.value = today;
}

function openBookingModal() {
  if (!bookingModal) return;
  bookingModal.hidden = false;
  document.body.style.overflow = 'hidden';
  bookingModalClose?.focus();
}

function closeBookingModal() {
  if (!bookingModal) return;
  bookingModal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-booking-btn, [href="#bookingModal"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openBookingModal();
  });
});

bookingModalClose?.addEventListener('click', closeBookingModal);
bookingModalBackdrop?.addEventListener('click', closeBookingModal);

// WhatsApp Direct Inquiry Generation
bmSubmitBtn?.addEventListener('click', () => {
  const eventType = document.getElementById('bmEventType')?.value || 'Event';
  const eventDate = document.getElementById('bmEventDate')?.value || 'Upcoming';
  const location  = document.getElementById('bmLocation')?.value || 'Tirupati';
  const name      = document.getElementById('bmName')?.value || 'Sir/Madam';

  const selectedServices = [];
  document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
    selectedServices.push(cb.value);
  });
  const servicesText = selectedServices.length ? selectedServices.join(', ') : 'Full Photography & Video Coverage';

  const message = `Namaskaram Anil Kumar garu (AD Live Events),\n\nI would like to check availability and get a quote for our upcoming event:\n\n👤 *Client Name:* ${name}\n💒 *Event Type:* ${eventType}\n📅 *Event Date:* ${eventDate}\n📍 *Location:* ${location}\n🎬 *Services Required:* ${servicesText}\n\nPlease let me know your availability and package details. Thank you!`;

  const waUrl = `https://wa.me/919704442318?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  closeBookingModal();
});

/* ── 15. SCROLL TO TOP WITH CIRCULAR PROGRESS RING ── */
const scrollTopBtn   = document.getElementById('scrollTopBtn');
const progressCircle = document.getElementById('progressCircle');
const circumference  = 131.95; // 2 * PI * 21

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? scrollTop / docHeight : 0;

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', scrollTop > 300);
  }

  if (progressCircle) {
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
  }
}, { passive: true });

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 16. GLOBAL KEYBOARD LISTENERS ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!photoModal.hidden) closePhotoModal();
    if (!videoModal.hidden) closeVideoModal();
    if (!bookingModal.hidden) closeBookingModal();
  }
  if (!photoModal.hidden) {
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft')  prevPhoto();
  }
});

/* ── 17. VIDEO CARD CLICK HANDLERS ── */
document.querySelectorAll('[data-yt]').forEach(card => {
  card.addEventListener('click', () => openVideoModal(card.dataset.yt));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openVideoModal(card.dataset.yt);
    }
  });
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
});

// Boot photo triggers on initial load
initPhotoTriggers();

/* ── 18. INTERACTIVE BEFORE & AFTER COLOR GRADING SLIDER ── */
function initColorGradeSlider() {
  const box    = document.getElementById('gradeComparisonBox');
  const raw    = document.getElementById('gradeRawLayer');
  const handle = document.getElementById('gradeSliderHandle');
  if (!box || !raw || !handle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = box.getBoundingClientRect();
    let posX = clientX - rect.left;
    posX = Math.max(0, Math.min(posX, rect.width));
    const percent = (posX / rect.width) * 100;
    raw.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
    handle.style.left = `${percent}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(percent)));
  }

  box.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch Support for Mobile
  box.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  box.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });
}
initColorGradeSlider();

/* ── 19. VIDEO SHOWCASE SECTION CLICK HANDLERS & HOVER-TO-PLAY ── */
function initVideoShowcase() {
  // All video cards across the site (click to play in modal with sound)
  const allVideoCards = document.querySelectorAll('[data-yt]');
  allVideoCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      openVideoModal(card.dataset.yt);
    });
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        openVideoModal(card.dataset.yt); 
      }
    });
  });

  // Video Cards (Showcase & Films): Hover to Play Muted, Mouse Leave to Pause/Reset
  const previewCards = document.querySelectorAll('.vss-card[data-yt], .film-card[data-yt]');
  previewCards.forEach(card => {
    const ytId = card.dataset.yt;
    const videoSlot = card.querySelector('.vss-card-video-slot, .film-video-slot');
    const iframeClass = card.classList.contains('film-card') ? 'film-hover-iframe' : 'vss-hover-iframe';
    let hoverTimer = null;

    card.addEventListener('mouseenter', () => {
      // Small 150ms debounce so rapid mouse passing doesn't trigger unneeded iframes
      hoverTimer = setTimeout(() => {
        if (videoSlot && !videoSlot.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.className = iframeClass;
          iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1&playlist=${ytId}`;
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.setAttribute('tabindex', '-1');
          iframe.setAttribute('aria-hidden', 'true');
          iframe.title = 'Muted Preview';
          videoSlot.innerHTML = '';
          videoSlot.appendChild(iframe);
          requestAnimationFrame(() => {
            setTimeout(() => iframe.classList.add('playing'), 50);
          });
        }
      }, 150);
    });

    card.addEventListener('mouseleave', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      if (videoSlot) {
        videoSlot.innerHTML = '';
      }
      card.style.transform = '';
    });

    // Subtle 3D tilt on mouse move
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) scale(1.02) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });
  });

  // Featured Hero Video: Intersection Observer for muted background autoplay
  const heroBgVideo = document.querySelector('.vss-hero .vss-bg-video');
  if (heroBgVideo && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src && !iframe.src) {
            iframe.src = iframe.dataset.src;
            setTimeout(() => {
              iframe.classList.add('loaded');
            }, 1000);
            observer.unobserve(iframe);
          }
        }
      });
    }, { rootMargin: '100px' });
    heroObserver.observe(heroBgVideo);
  }
}
initVideoShowcase();
