document.addEventListener('DOMContentLoaded', function () {
  // Navigation active state logic
  let currentPath = window.location.pathname.split('/')[1]; // Get the first path segment
  console.log('currentPath:', currentPath); // Debugging

  document.querySelectorAll('.category-container a').forEach((link) => {
    let linkPath = new URL(link.href, window.location.origin).pathname.split(
      '/',
    )[1]; // Get the first path segment of the full link URL
    console.log('linkPath:', linkPath); // Debugging

    if (linkPath === currentPath) {
      link.parentElement.classList.add('active');
    }
  });

  // IntersectionObserver animation for cards
  const cards = document.querySelectorAll('.experience-card');
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  cards.forEach((card) => observer.observe(card));

  // Click event listener for cards to handle navigation
  const links = document.querySelectorAll('.experience-card-link');
  links.forEach(link => {
    link.addEventListener('click', function() {
      const url = this.getAttribute('data-href');
      if (url) {
        window.location.href = url;
      }
    });
  });
});


