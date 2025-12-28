// Responsive Navbar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const headerNav = document.getElementById('headerNav');

  if (!hamburgerBtn || !headerNav) return;

  // Toggle menu when hamburger is clicked
  hamburgerBtn.addEventListener('click', function() {
    headerNav.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    
    // Update aria-expanded for accessibility
    const isExpanded = hamburgerBtn.classList.contains('active');
    hamburgerBtn.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when a nav link is clicked
  const navLinks = headerNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      headerNav.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when action buttons or user profile items are clicked
  const header = document.querySelector('.header-1');
  const actionLinks = header.querySelectorAll('.actions a, .user-profile a');
  actionLinks.forEach(link => {
    link.addEventListener('click', function() {
      headerNav.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking logout button
  const logoutBtn = header.querySelector('.logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      headerNav.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = headerNav.contains(event.target);
    const isClickInsideBtn = hamburgerBtn.contains(event.target);
    const isClickInsideActions = header.querySelector('.actions') && header.querySelector('.actions').contains(event.target);
    const isClickInsideProfile = header.querySelector('.user-profile') && header.querySelector('.user-profile').contains(event.target);
    
    if (!isClickInsideNav && !isClickInsideBtn && !isClickInsideActions && !isClickInsideProfile && headerNav.classList.contains('active')) {
      headerNav.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && headerNav.classList.contains('active')) {
      headerNav.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
});
