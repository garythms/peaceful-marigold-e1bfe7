
document.querySelectorAll('.menu').forEach((button, index) => {
  const nav = button.parentElement.querySelector('nav');
  if (!nav) return;
  const navId = nav.id || `site-navigation-${index + 1}`;
  nav.id = navId;
  button.setAttribute('type', 'button');
  button.setAttribute('aria-controls', navId);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
  };
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('is-open', !isOpen);
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
});

(() => {
  const addSiteControls = () => {
    document.querySelectorAll('header .logo, header .brand, footer .logo, footer .footerbrand').forEach((brand) => {
      const logo = brand.querySelector('img') || document.createElement('img');
      logo.src = 'assets/vttravel-logo.jpg';
      logo.alt = 'VT Travel logo';
      brand.replaceChildren(logo);
      if (brand.matches('header .brand')) {  const wordmark = document.createElement('span');  wordmark.innerHTML = '<b>VT</b> Travel<small>YOUR JOURNEY • OUR PASSION</small>';  brand.replaceChildren(logo, wordmark);  brand.classList.remove('logo-image-only');} else {  brand.classList.add('logo-image-only');}
    });
    if (document.querySelector('.contact-dock')) return;
    const dock = document.createElement('nav');
    dock.className = 'contact-dock';
    dock.setAttribute('aria-label', 'Contact VT Travel');
    dock.innerHTML = `
      <a class="contact-dock__link" href="tel:01608670152" aria-label="Call VT Travel on 01608 670152">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.58 1 1 0 0 1-.25 1.02z"/></svg>
        <span><small>Call us</small><strong>01608 670152</strong></span>
      </a>
      <a class="contact-dock__link" href="mailto:info@vttravel.co.uk" aria-label="Email info@vttravel.co.uk">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m3 6 9 7 9-7"/></svg>
        <span><small>Email</small><strong>info@vttravel.co.uk</strong></span>
      </a>
      <a class="contact-dock__link contact-dock__link--whatsapp" href="https://wa.me/441608670152" target="_blank" rel="noopener noreferrer" aria-label="Message VT Travel on WhatsApp">
        <img class="contact-dock__icon" src="https://cdn.simpleicons.org/whatsapp/25D366" alt="" aria-hidden="true">
        <span><small>Message us</small><strong>WhatsApp</strong></span>
      </a>
      <a class="contact-dock__link contact-dock__link--instagram" href="https://www.instagram.com/vttravel2026/" target="_blank" rel="noopener noreferrer" aria-label="VT Travel on Instagram">
        <img class="contact-dock__icon" src="https://cdn.simpleicons.org/instagram/FFFFFF" alt="" aria-hidden="true">
        <span><small>Follow us</small><strong>Instagram</strong></span>
      </a>
      <a class="contact-dock__link contact-dock__link--facebook" href="https://www.facebook.com/vttravelservices/" target="_blank" rel="noopener noreferrer" aria-label="VT Travel on Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3.5C10.5 4 9 5.8 9 8.5V11H6v4h3v6h4v-6h3.2l.8-4h-4V8.8c0-.6.3-.8 1-.8Z"/></svg>
        <span><small>Follow us</small><strong>Facebook</strong></span>
      </a>`;
    document.body.append(dock);
    document.body.classList.add('has-contact-dock');
    const style = document.createElement('style');
    style.textContent = '.contact-dock{grid-template-columns:minmax(0,1fr) minmax(0,1.8fr) repeat(3,minmax(0,1fr))!important}.contact-dock__link{min-width:0}.contact-dock__link:nth-child(2) span{min-width:0}.contact-dock__link strong{overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;font-size:12px!important}@media(max-width:700px){.contact-dock{grid-template-columns:repeat(5,minmax(0,1fr))!important}.contact-dock__link{justify-content:center!important}.contact-dock__link strong{font-size:9px!important;white-space:normal!important;overflow-wrap:anywhere!important}}';
    document.head.append(style);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSiteControls, { once: true });
  } else {
    addSiteControls();
  }
})();
