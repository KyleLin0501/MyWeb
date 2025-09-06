document.addEventListener('DOMContentLoaded', function () {
  const experienceListContainer = document.querySelector('.experience-list-grid');

  if (!experienceListContainer) {
    console.error('Container for experience list not found.');
    return;
  }

  fetch('develop.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        const cardLink = document.createElement('a');
        cardLink.className = 'experience-card-link';
        cardLink.setAttribute('href', item.href);
        cardLink.setAttribute('aria-label', item.ariaLabel);
        cardLink.setAttribute('target', '_blank');
        cardLink.setAttribute('rel', 'noopener noreferrer');

        const cardHtml = `
            <div class="experience-card">
                <div class="experience-image">
                    <img src="${item.imageSrc}" alt="${item.imageAlt}">
                </div>
                <div class="experience-content">
                    <h4>${item.title}</h4>
                    <p class="muted">${item.date}</p>
                    <p class="description">${item.description}</p>
                </div>
            </div>
        `;
        cardLink.innerHTML = cardHtml;
        experienceListContainer.appendChild(cardLink);
      });
    })
    .catch(error => {
      console.error('There was a problem fetching the data:', error);
    });
});