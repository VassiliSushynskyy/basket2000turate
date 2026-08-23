(() => {
  const mobileMenu = document.querySelector('.js-menu-container');
  const openMenuBtn = document.querySelector('.js-open-menu');
  const closeMenuBtn = document.querySelector('.js-close-menu');
  const menuBackdrop = document.querySelector('.js-menu-backdrop');
  const menuLinks = document.querySelectorAll('.mobile-menu .js-menu-link');

  if (!mobileMenu || !openMenuBtn) return;

  const openMenu = () => {
    mobileMenu.classList.add('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  const toggleMenu = () => {
    const isMenuOpen = mobileMenu.classList.contains('is-open');
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  openMenuBtn.addEventListener('click', toggleMenu);

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  // Close when clicking any navigation link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close the mobile menu on wider screens if the device orientation changes
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => {
    if (!e.matches) return;
    closeMenu();
  });
})();