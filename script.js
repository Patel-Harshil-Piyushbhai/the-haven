/* script.js */
'use strict';
const PROPERTIES = [
    {id:1, type:'house', title:'Oceanview Grand Estate', location:'Juhu, Mumbai', price:'Rs 8.5 Cr', priceNum:85000000, beds:5, baths:4, area:'4200', image:'house_1.png', description:'Luxury house.', tag:'Featured'},
    {id:2, type:'bungalow', title:'The Meadow Bungalow', location:'Koregaon Park, Pune', price:'Rs 3.2 Cr', priceNum:32000000, beds:3, baths:2, area:'2600', image:'bungalow_1.png', description:'Nice bungalow.', tag:'New'},
    {id:3, type:'flat', title:'Sky Penthouse 47F', location:'BKC, Mumbai', price:'Rs 12 Cr', priceNum:120000000, beds:4, baths:3, area:'3100', image:'flat_2.png', description:'City view.', tag:'Luxury'},
    {id:4, type:'house', title:'Mediterranean Villa', location:'Whitefield, Bengaluru', price:'Rs 6.8 Cr', priceNum:68000000, beds:5, baths:5, area:'5500', image:'house_2.png', description:'Large villa.', tag:'Premium'},
    {id:5, type:'bungalow', title:'Craftsman Garden', location:'Kalyani Nagar, Pune', price:'Rs 2.1 Cr', priceNum:21000000, beds:3, baths:2, area:'1900', image:'bungalow_2.png', description:'Small garden.', tag:'Charming'},
    {id:6, type:'flat', title:'Urban Glass Residence', location:'Cyber City, Gurugram', price:'Rs 4.5 Cr', priceNum:45000000, beds:3, baths:2, area:'1800', image:'flat_1.png', description:'Modern flat.', tag:'City'}
    ];
let activeFilter = 'all';
let filteredProps = [...PROPERTIES];
const $ = (id) => document.getElementById(id);
const qsa = (sel) => [...document.querySelectorAll(sel)];
function initNavbar() {
      const navbar = $('navbar');
      window.addEventListener('scroll', () => { if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 40); });
}
function initSearch() {
      qsa('.search-tab').forEach(tab => {
              tab.addEventListener('click', () => {
                        qsa('.search-tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        activeFilter = tab.dataset.filter;
                        applySearch();
              });
      });
      if($('search-btn')) $('search-btn').addEventListener('click', applySearch);
}
function applySearch() {
      const loc = $('location-input')?.value.toLowerCase().trim() || '';
      filteredProps = PROPERTIES.filter(p => {
              const mt = activeFilter === 'all' || p.type === activeFilter;
              const ml = !loc || p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc);
              return mt && ml;
      });
      renderCards();
}
function renderCards() {
      const grid = $('properties-grid');
      if(!grid) return;
      grid.innerHTML = filteredProps.map(p => `
          <div class="property-card visible" data-id="\${p.id}">
                <div class="card-image-wrap">
                        <img src="\${p.image}" alt="\${p.title}" style="width:100%">
                                <span class="card-badge badge-\${p.type}">\${p.type}</span>
                                      </div>
                                            <div class="card-body">
                                                    <h3 class="card-title">\${p.title}</h3>
                                                            <p class="card-location">Location: \${p.location}</p>
                                                                    <p class="card-price">\${p.price}</p>
                                                                          </div>
                                                                              </div>
                                                                                `).join('');
}
const EMAILJS_CONFIG = { publicKey: 'Kq924KK3lHanPgVQn', serviceId: 'service_r3waw83', templateId: 'template_ta40dlq' };
function initContactForm() {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      const form = $('contact-form');
      if(!form) return;
      form.addEventListener('submit', (e) => {
              e.preventDefault();
              const formData = {
                        from_name: $('name-input')?.value || '',
                        from_email: $('email-input')?.value || '',
                        message: $('message-input')?.value || '',
                        to_email: 'harshilpatelce8787@gmail.com'
              };
              emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
                .then(() => alert('Sent!'))
                .catch((err) => console.error(err));
      });
}
document.addEventListener('DOMContentLoaded', () => {
      initNavbar();
      initSearch();
      initContactForm();
      renderCards();
});
