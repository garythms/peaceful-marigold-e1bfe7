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
