/* ─── script.js ─── Haven Realty */
'use strict';

// ══════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════
const PROPERTIES = [
  {
    id: 1,
    type: 'house',
    title: 'Oceanview Grand Estate',
    location: 'Juhu, Mumbai',
    price: '₹8.5 Cr',
    priceNum: 8500000,
    beds: 5, baths: 4, area: '4,200',
    image: 'images/house_1.png',
    description: 'An architectural masterpiece perched with sweeping ocean views. This contemporary home features soaring ceilings, chef-grade kitchen, home theatre, and a spectacular infinity pool overlooking the sea.',
    features: ['Infinity Pool', 'Home Theatre', "Chef's Kitchen", 'Smart Home', 'Private Gym', '4-Car Garage'],
    tag: 'Featured',
  },
  {
    id: 2,
    type: 'bungalow',
    title: 'The Meadow Bungalow',
    location: 'Koregaon Park, Pune',
    price: '₹3.2 Cr',
    priceNum: 3200000,
    beds: 3, baths: 2, area: '2,600',
    image: 'images/bungalow_1.png',
    description: 'Nestled in lush gardens, this contemporary single-storey bungalow blends warm materials with clean modernist lines. Large skylights flood every room with natural light.',
    features: ['Japanese Garden', 'Solar Panels', 'Underfloor Heating', 'Wine Cellar', 'Wrap-Around Deck'],
    tag: 'New Listing',
  },
  {
    id: 3,
    type: 'flat',
    title: 'Sky Penthouse 47F',
    location: 'BKC, Mumbai',
    price: '₹12 Cr',
    priceNum: 12000000,
    beds: 4, baths: 3, area: '3,100',
    image: 'images/flat_2.png',
    description: 'The pinnacle of urban luxury. This full-floor penthouse on the 47th level commands 360° city panoramas. Features marble flooring, a gourmet kitchen, and private terrace with jacuzzi.',
    features: ['360° City Views', 'Private Terrace', 'Jacuzzi', 'Concierge', 'Valet Parking', 'Club Access'],
    tag: 'Luxury',
  },
  {
    id: 4,
    type: 'house',
    title: 'Mediterranean Villa',
    location: 'Whitefield, Bengaluru',
    price: '₹6.8 Cr',
    priceNum: 6800000,
    beds: 5, baths: 5, area: '5,500',
    image: 'images/house_2.png',
    description: 'A timeless Mediterranean estate set behind private gates. The circular driveway with its classical fountain sets the tone for the opulence within — arched corridors, terracotta accents, and a lush courtyard garden.',
    features: ['Private Gated', 'Fountain Driveway', 'In-ground Pool', 'Staff Quarters', 'Vineyard Garden', 'Outdoor Kitchen'],
    tag: 'Premium',
  },
  {
    id: 5,
    type: 'bungalow',
    title: 'Craftsman Garden Bungalow',
    location: 'Kalyani Nagar, Pune',
    price: '₹2.1 Cr',
    priceNum: 2100000,
    beds: 3, baths: 2, area: '1,900',
    image: 'images/bungalow_2.png',
    description: 'A charming craftsman bungalow surrounded by a curated cottage garden. Original woodwork and stone pillars complement modern updates — a rare find in a coveted neighbourhood.',
    features: ['Heritage Design', 'Stone Fireplace', 'Covered Porch', 'Cottage Garden', 'Wooden Floors', 'Deep Setback'],
    tag: 'Charming',
  },
  {
    id: 6,
    type: 'flat',
    title: 'Urban Glass Residence',
    location: 'Cyber City, Gurugram',
    price: '₹4.5 Cr',
    priceNum: 4500000,
    beds: 3, baths: 2, area: '1,800',
    image: 'images/flat_1.png',
    description: 'Sleek glass-façade living in the heart of the city. Floor-to-ceiling windows, a cantilevered balcony over the skyline, and impeccable contemporary interiors. Perfect for the discerning urban professional.',
    features: ['Glass Balcony', 'City Skyline View', 'Smart Automation', 'Rooftop Pool', 'Co-working Lounge', 'EV Charging'],
    tag: 'City Views',
  },
];

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let activeFilter = 'all';
let visibleCount = 6;
let wishlist = new Set(JSON.parse(localStorage.getItem('havenWishlist') || '[]'));
let filteredProps = [...PROPERTIES];

// ══════════════════════════════════════════════
// DOM HELPERS
// ══════════════════════════════════════════════
const $ = (id) => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

// ══════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════
function initNavbar() {
  const navbar = $('navbar');
  const hamburger = $('hamburger-btn');
  const navLinks = $('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link
    const sections = ['home', 'properties', 'about', 'contact'];
    let current = 'home';
    sections.forEach((id) => {
      const el = $(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    qsa('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link') && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('open');
    }
  });
}

// ══════════════════════════════════════════════
// HERO PARALLAX & COUNTER
// ══════════════════════════════════════════════
function initHero() {
  const heroBg = $('hero-bg');
  heroBg.classList.add('loaded');

  // Parallax
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
  });

  // Animate counters on intersection
  const counters = qsa('.stat-number');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => io.observe(c));
}

function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ══════════════════════════════════════════════
// SEARCH & FILTER
// ══════════════════════════════════════════════
function initSearch() {
  qsa('.search-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      qsa('.search-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      applySearch();
    });
  });

  $('search-btn').addEventListener('click', applySearch);
  $('location-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') applySearch(); });

  $('load-more-btn').addEventListener('click', () => {
    visibleCount += 3;
    renderCards();
  });
}

function applySearch() {
  const loc = $('location-input').value.toLowerCase().trim();
  const maxPrice = +$('price-select').value || Infinity;
  const minBeds = +$('beds-select').value || 0;

  filteredProps = PROPERTIES.filter((p) => {
    const matchType = activeFilter === 'all' || p.type === activeFilter;
    const matchLoc = !loc || p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc);
    const matchPrice = p.priceNum <= maxPrice;
    const matchBeds = p.beds >= minBeds;
    return matchType && matchLoc && matchPrice && matchBeds;
  });

  visibleCount = 6;
  renderCards();

  // Smooth scroll to grid
  setTimeout(() => {
    $('properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ══════════════════════════════════════════════
// RENDER CARDS
// ══════════════════════════════════════════════
function renderCards() {
  const grid = $('properties-grid');
  const visible = filteredProps.slice(0, visibleCount);

  if (visible.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="empty-icon">🏠</div>
        <h3>No properties found</h3>
        <p>Try adjusting your search filters</p>
      </div>`;
    $('load-more-wrap').style.display = 'none';
    return;
  }

  grid.innerHTML = visible.map((p, i) => buildCard(p, i)).join('');

  // Stagger in with animation
  qsa('.property-card').forEach((card, i) => {
    setTimeout(() => card.classList.add('visible'), i * 80);
  });

  // Bind events
  qsa('.card-wishlist').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(btn, +btn.dataset.id);
    });
  });
  qsa('.property-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-wishlist')) return;
      openModal(+card.dataset.id);
    });
  });

  const hasMore = filteredProps.length > visibleCount;
  $('load-more-wrap').style.display = hasMore ? 'block' : 'none';
}

function buildCard(p, index) {
  const isWished = wishlist.has(p.id);
  const badgeClass = `badge-${p.type}`;
  const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
  const delay = index * 80;

  return `
    <div class="property-card" data-id="${p.id}" style="animation-delay:${delay}ms">
      <div class="card-image-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <span class="card-badge ${badgeClass}">${typeLabel}</span>
        <button class="card-wishlist ${isWished ? 'active' : ''}" data-id="${p.id}" aria-label="Wishlist">
          ${isWished ? '♥' : '♡'}
        </button>
        <div class="card-overlay"></div>
        <button class="btn btn-primary card-quick-view">Quick View</button>
      </div>
      <div class="card-body">
        <p class="card-type">${p.tag}</p>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-location">📍 ${p.location}</p>
        <div class="card-specs">
          <span class="card-spec"><span class="spec-icon">🛏</span>${p.beds} Beds</span>
          <span class="card-spec"><span class="spec-icon">🚿</span>${p.baths} Baths</span>
          <span class="card-spec"><span class="spec-icon">📐</span>${p.area} sq ft</span>
        </div>
        <div class="card-footer">
          <div>
            <p class="card-price">${p.price}</p>
            <p class="card-price-label">Sale Price</p>
          </div>
          <button class="btn btn-outline card-cta">View Details</button>
        </div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
// WISHLIST
// ══════════════════════════════════════════════
function toggleWishlist(btn, id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.innerHTML = '♡';
    btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.add(id);
    btn.innerHTML = '♥';
    btn.classList.add('active');
    showToast('💛 Added to wishlist!');
  }
  localStorage.setItem('havenWishlist', JSON.stringify([...wishlist]));
}

// ══════════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════════
function openModal(id) {
  const p = PROPERTIES.find((x) => x.id === id);
  if (!p) return;

  $('modal-img').src = p.image;
  $('modal-img').alt = p.title;
  $('modal-badge').textContent = p.type.charAt(0).toUpperCase() + p.type.slice(1);
  $('modal-title').textContent = p.title;
  $('modal-location').textContent = '📍 ' + p.location;
  $('modal-price').textContent = p.price;
  $('modal-desc').textContent = p.description;

  $('modal-specs').innerHTML = `
    <div class="modal-spec">🛏 <strong>${p.beds}</strong> Bedrooms</div>
    <div class="modal-spec">🚿 <strong>${p.baths}</strong> Bathrooms</div>
    <div class="modal-spec">📐 <strong>${p.area}</strong> sq ft</div>
    <div class="modal-spec">🏷️ <strong>${p.tag}</strong></div>
  `;

  $('modal-features').innerHTML = p.features
    .map((f) => `<span class="modal-feature-tag">${f}</span>`)
    .join('');

  $('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  $('modal-close-btn').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('modal-overlay')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
  $('modal-enquire-btn').addEventListener('click', closeModal);
  $('modal-tour-btn').addEventListener('click', () => {
    closeModal();
    showToast('📅 Tour request noted! We\'ll be in touch.');
  });
}

// ══════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════
function initContactForm() {
  $('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = $('submit-btn');
    const success = $('form-success');

    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      $('contact-form').reset();
      success.classList.add('show');
      showToast('✓ Message sent! We\'ll be in touch soon.');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
}

// ══════════════════════════════════════════════
// NEWSLETTER
// ══════════════════════════════════════════════
function initNewsletter() {
  $('newsletter-btn').addEventListener('click', () => {
    const val = $('newsletter-email').value.trim();
    if (!val || !val.includes('@')) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }
    $('newsletter-email').value = '';
    showToast('🎉 Subscribed! Welcome to Haven Realty.');
  });
}

// ══════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const revealTargets = qsa('.feature-card, .testimonial-card, .contact-item, .feature-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.6s ease forwards';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    io.observe(el);
  });
}

// ══════════════════════════════════════════════
// FOOTER QUICK-FILTER LINKS
// ══════════════════════════════════════════════
function initFooterLinks() {
  const filters = { 'foot-houses': 'house', 'foot-bungalows': 'bungalow', 'foot-flats': 'flat' };
  Object.entries(filters).forEach(([id, type]) => {
    const el = $(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        activeFilter = type;
        qsa('.search-tab').forEach((t) => {
          t.classList.toggle('active', t.dataset.filter === type);
        });
        applySearch();
        $('properties').scrollIntoView({ behavior: 'smooth' });
      });
    }
  });
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initSearch();
  renderCards();
  initModal();
  initContactForm();
  initNewsletter();
  initScrollReveal();
  initFooterLinks();

  // Lazy-load observer for property cards
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Re-observe after render
  qsa('.property-card').forEach((card) => cardObserver.observe(card));
});
