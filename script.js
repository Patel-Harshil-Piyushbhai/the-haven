/* script.js - Haven Realty */
'use strict';

const EMAILJS_CONFIG = {
    publicKey: 'Kq924KK3lHanPgVQn',
    serviceId: 'service_r3waw83',
    templateId: 'template_ta40dlq',
};

// Simplified core logic for EmailJS
function initContactForm() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    const form = document.getElementById('contact-form');
    if (form) {
          form.addEventListener('submit', (e) => {
                  e.preventDefault();
                  const btn = document.getElementById('submit-btn');
                  const formData = {
                            from_name: document.getElementById('name-input')?.value || '',
                            from_email: document.getElementById('email-input')?.value || '',
                            from_phone: document.getElementById('phone-input')?.value || '',
                            interest: document.getElementById('interest-select')?.value || '',
                            message: document.getElementById('message-input')?.value || '',
                            to_email: 'harshilpatelce8787@gmail.com',
                            sent_at: new Date().toLocaleString(),
                  };
                  btn.textContent = 'Sending...';
                  emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
                    .then(() => {
                                btn.textContent = 'Send Message';
                                form.reset();
                                document.getElementById('form-success')?.classList.add('show');
                    })
                    .catch(err => {
                                console.error(err);
                                btn.textContent = 'Send Message';
                    });
          });
    }
}
document.addEventListener('DOMContentLoaded', initContactForm);
