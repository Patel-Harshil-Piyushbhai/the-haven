/* script.js - Haven Realty */
const PROPERTIES = [
    {
            id: 1,
            type: 'house',
            title: 'Oceanview Grand Estate',
            location: 'Juhu, Mumbai',
            price: 'Rs 8.5 Cr',
            priceNum: 85000000,
            beds: 5,
            baths: 4,
            area: '4,200',
            image: 'house_1.png',
            description: 'An architectural masterpiece perched with sweeping ocean views.',
            features: ['Infinity Pool', 'Home Theatre', 'Chef Kitchen'],
            tag: 'Featured',
    },
    {
            id: 2,
            type: 'bungalow',
            title: 'The Meadow Bungalow',
            location: 'Koregaon Park, Pune',
            price: 'Rs 3.2 Cr',
            priceNum: 32000000,
            beds: 3,
            baths: 2,
            area: '2,600',
            image: 'bungalow_1.png',
            description: 'Nestled in lush gardens, this contemporary bungalow.',
            features: ['Japanese Garden', 'Solar Panels'],
            tag: 'New Listing',
    },
    {
            id: 3,
            type: 'flat',
            title: 'Sky Penthouse 47F',
            location: 'BKC, Mumbai',
            price: 'Rs 12 Cr',
            priceNum: 120000000,
            beds: 4,
            baths: 3,
            area: '3,100',
            image: 'flat_2.png',
            description: 'The pinnacle of urban luxury.',
            features: ['360 City Views', 'Private Terrace'],
            tag: 'Luxury',
    },
    {
            id: 4,
            type: 'house',
            title: 'Mediterranean Villa',
            location: 'Whitefield, Bengaluru',
            price: 'Rs 6.8 Cr',
            priceNum: 68000000,
            beds: 5,
            baths: 5,
            area: '5,500',
            image: 'house_2.png',
            description: 'A timeless Mediterranean estate set behind private gates.',
            tag: 'Premium',
    },
    ];
{
        id: 5,
                type: 'bungalow',
                title: 'Craftsman Garden Bungalow',
                location: 'Kalyani Nagar, Pune',
                price: 'Rs 2.1 Cr',
                priceNum: 21000000,
                beds: 3,
                baths: 2,
                area: '1,900',
                image: 'bungalow_2.png',
                description: 'A charming craftsman bungalow with garden.',
                tag: 'Charming',
            },
        {
                id: 6,
                type: 'flat',
                title: 'Urban Glass Residence',
                location: 'Cyber City, Gurugram',
                price: 'Rs 4.5 Cr',
                priceNum: 45000000,
                beds: 3,
                baths: 2,
                area: '1,800',
                image: 'flat_1.png',
                description: 'Sleek glass-facade living.',
                tag: 'City Views',
        },
            ];

let activeFilter = 'all';
    let visibleCount = 6;
    let wishlist = new Set(JSON.parse(localStorage.getItem('havenWishlist') || '[]'));
    let filteredProps = [...PROPERTIES];

const $ = (id) => document.getElementById(id);
    const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];
    const qs = (sel, root = document) => root.querySelector(sel);

function initNavbar() {
      const navbar = $('navbar');
      const hamburger = $('hamburger-btn');
      const navLinks = $('nav-links');

      window.addEventListener('scroll', () => {
              if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);

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

      if (hamburger) {
              hamburger.addEventListener('click', () => {
                        hamburger.classList.toggle('open');
                        if (navLinks) navLinks.classList.toggle('mobile-open');
              });
      }

      if (navLinks) {
              navLinks.addEventListener('click', (e) => {
                        if (e.target.classList.contains('nav-link') && navLinks.classList.contains('mobile-open')) {
                                    navLinks.classList.remove('mobile-open');
                                    if (hamburger) hamburger.classList.remove('open');
                        }
              });
      }
}

function initHero() {
      const heroBg = $('hero-bg');
      if (heroBg) {
              heroBg.classList.add('loaded');
              window.addEventListener('scroll', () => {
                        const y = window.scrollY;
                        heroBg.style.transform = `scale(1.05) translateY(\${y * 0.25}px)`;
              });
      }

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

function initSearch() {
      qsa('.search-tab').forEach((tab) => {
              tab.addEventListener('click', () => {
                        qsa('.search-tab').forEach((t) => t.classList.remove('active'));
                        tab.classList.add('active');
                        activeFilter = tab.dataset.filter;
                        applySearch();
              });
      });

      const searchBtn = $('search-btn');
      if (searchBtn) searchBtn.addEventListener('click', applySearch);

      const locInput = $('location-input');
      if (locInput) {
              locInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') applySearch();
              });
      }

      const loadMoreBtn = $('load-more-btn');
      if (loadMoreBtn) {
              loadMoreBtn.addEventListener('click', () => {
                        visibleCount += 3;
                        renderCards();
              });
      }
}

function applySearch() {
      const locInput = $('location-input');
      const loc = locInput ? locInput.value.toLowerCase().trim() : '';

      const priceSelect = $('price-select');
      const maxPrice = priceSelect ? (+priceSelect.value || Infinity) : Infinity;

      const bedsSelect = $('beds-select');
      const minBeds = bedsSelect ? (+bedsSelect.value || 0) : 0;

      filteredProps = PROPERTIES.filter((p) => {
              const matchType = activeFilter === 'all' || p.type === activeFilter;
              const matchLoc = !loc || p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc);
              const matchPrice = p.priceNum <= maxPrice;
              const matchBeds = p.beds >= minBeds;
              return matchType && matchLoc && matchPrice && matchBeds;
      });

      visibleCount = 6;
      renderCards();

      const propSec = $('properties');
      if (propSec) {
              setTimeout(() => {
                        propSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
      }
}

function renderCards() {
      const grid = $('properties-grid');
      if (!grid) return;

      const visible = filteredProps.slice(0, visibleCount);

      if (visible.length === 0) {
              grid.innerHTML = `
                    <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
                            <div class="empty-icon" style="font-size: 4rem; margin-bottom: 1rem;">
                            function toggleWishlist(btn, id) {
                              if (wishlist.has(id)) {
                                  wishlist.delete(id);
                                      btn.innerHTML = 'Wish';
                                          btn.classList.remove('active');
                                              showToast('Removed from wishlist');
                                                } else {
                                                    wishlist.add(id);
                                                        btn.innerHTML = 'Wished';
                                                            btn.classList.add('active');
                                                                showToast('Added to wishlist!');
                                                                  }
                                                                    localStorage.setItem('havenWishlist', JSON.stringify([...wishlist]));
                                                                    }

                                                                    function openModal(id) {
                                                                      const p = PROPERTIES.find((x) => x.id === id);
                                                                        if (!p) return;

                                                                          $('modal-img').src = p.image;
                                                                            $('modal-img').alt = p.title;
                                                                              $('modal-badge').textContent = p.type.charAt(0).toUpperCase() + p.type.slice(1);
                                                                                $('modal-title').textContent = p.title;
                                                                                  $('modal-location').textContent = 'Location: ' + p.location;
                                                                                    $('modal-price').textContent = p.price;
                                                                                      $('modal-desc').textContent = p.description;
                                                                                        $('modal-specs').innerHTML = `
              <div class="modal-spec">Beds: <strong>\${p.beds}</strong></div>
                      <div class="modal-spec">Baths: <strong>\${p.baths}</strong></div>
                      <div class="modal-spec">Area: <strong>\${p.area}</strong> sq ft</div>
                    `;

                      $('modal-overlay').classList.add('open');
                        document.body.style.overflow = 'hidden';
                        }

                        function closeModal() {
                          const modal = $('modal-overlay');
                            if (modal) modal.classList.remove('open');
                              document.body.style.overflow = '';
                              }

                              function initModal() {
                                const closeBtn = $('modal-close-btn');
                                  if (closeBtn) closeBtn.addEventListener('click', closeModal);

                                    const modalOverlay = $('modal-overlay');
                                      if (modalOverlay) {
                                          modalOverlay.addEventListener('click', (e) => {
                                                if (e.target === modalOverlay) closeModal();
                                                    });
                                                      }

                                                        document.addEventListener('keydown', (e) => {
                                                            if (e.key === 'Escape') closeModal();
                                                              });
                                                              }

                                                              function showToast(msg) {
                                                                let container = $('toast-container');
                                                                  if (!container) {
                                                                      container = document.createElement('div');
                                                                          container.id = 'toast-container';
                                                                              container.style.cssText = 'position:fixed; bottom:2rem; right:2rem; z-index:9999; display:flex; flex-direction:column; gap:0.5rem;';
                                                                                  document.body.appendChild(container);
                                                                                    }

                                                                                      const toast = document.createElement('div');
                                                                                        toast.style.cssText = 'background:rgba(18,18,18,0.95); color:#fff; padding:1rem 1.5rem; border-radius:0.5rem; border-left:4px solid #d4af37; box-shadow:0 10px 30px rgba(0,0,0,0.3); transform:translateX(120%); transition:transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); font-family:inherit;';
                                                                                          toast.textContent = msg;
                                                                                            container.appendChild(toast);

                                                                                              requestAnimationFrame(() => {
                                                                                                  toast.style.transform = 'translateX(0)';
                                                                                                    });
                                                                                                    
                                                                                                      setTimeout(() => {
                                                                                                          toast.style.transform = 'translateX(120%)';
                                                                                                              setTimeout(() => toast.remove(), 300);
                                                                                                                }, 3000);
                                                                                                                }
                                                                                                                
                                                                                                                const EMAILJS_CONFIG = {
                                                                                                                  publicKey: 'Kq924KK3lHanPgVQn',
                                                                                                                    serviceId: 'service_r3waw83',
                                                                                                                      templateId: 'template_ta40dlq',
                                                                                                                      };
                                                                                                                      
                                                                                                                      function initContactForm() {
                                                                                                                        emailjs.init(EMAILJS_CONFIG.publicKey);
                                                                                                                          const form = $('contact-form');
                                                                                                                            if (!form) return;
                                                                                                                            
                                                                                                                              form.addEventListener('submit', (e) => {
                                                                                                                                  e.preventDefault();
                                                                                                                                      const btn = $('submit-btn');
                                                                                                                                          if (!btn) return;
                                                                                                                                          
                                                                                                                                              const formData = {
                                                                                                                                                    from_name: $('name-input')?.value || '',
                                                                                                                                                          from_email: $('email-input')?.value || '',
                                                                                                                                                                from_phone: $('phone-input')?.value || '',
                                                                                                                                                                      interest: $('interest-select')?.value || '',
                                                                                                                                                                            message: $('message-input')?.value || '',
                                                                                                                                                                                  to_email: 'harshilpatelce8787@gmail.com',
                                                                                                                                                                                        sent_at: new Date().toLocaleString(),
                                                                                                                                                                                            };
                                                                                                                                                                                            
                                                                                                                                                                                                btn.textContent = 'Sending...';
                                                                                                                                                                                                
                                                                                                                                                                                                    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
                                                                                                                                                                                                          .then(() => {
                                                                                                                                                                                                                  btn.textContent = 'Send Message';
                                                                                                                                                                                                                          form.reset();
                                                                                                                                                                                                                                  const successMsg = $('form-success');
                                                                                                                                                                                                                                          if (successMsg) successMsg.classList.add('show');
                                                                                                                                                                                                                                                  showToast('Message sent successfully!');
                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                              .catch((err) => {
                                                                                                                                                                                                                                                                      console.error(err);
                                                                                                                                                                                                                                                                              btn.textContent = 'Send Message';
                                                                                                                                                                                                                                                                                      showToast('Failed to send message.');
                                                                                                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                              document.addEventListener('DOMContentLoaded', () => {
                                                                                                                                                                                                                                                                                                initNavbar();
                                                                                                                                                                                                                                                                                                  initHero();
                                                                                                                                                                                                                                                                                                    initSearch();
                                                                                                                                                                                                                                                                                                      initModal();
                                                                                                                                                                                                                                                                                                        initContactForm();
                                                                                                                                                                                                                                                                                                          renderCards();
                                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                                          
