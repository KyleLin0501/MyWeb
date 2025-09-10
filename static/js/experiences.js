document.addEventListener('DOMContentLoaded', function () {
  const experienceListContainer = document.querySelector('.experience-list');

  if (!experienceListContainer) {
    console.error('Container for experience list not found.');
    return;
  }

  fetch('experiences.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        // 1. 建立外層的 a 標籤
        const cardLink = document.createElement('a');
        cardLink.className = 'experience-card-link';
        cardLink.href = item.href;
        cardLink.setAttribute('aria-label', item.ariaLabel);

        // 2. 建立 experience-card div
        const cardDiv = document.createElement('div');
        cardDiv.className = 'experience-card';

        // 3. 建立 experience-image div 和 img
        const imageDiv = document.createElement('div');
        imageDiv.className = 'experience-image';
        const img = document.createElement('img');
        img.src = item.imageSrc;
        img.alt = item.imageAlt;
        img.loading = 'lazy';
        imageDiv.appendChild(img);

        // 4. 建立 experience-content div 和內容
        const contentDiv = document.createElement('div');
        contentDiv.className = 'experience-content';
        const titleH4 = document.createElement('h4');
        titleH4.textContent = item.title;
        const dateP = document.createElement('p');
        dateP.className = 'muted';
        dateP.textContent = item.date;
        contentDiv.appendChild(titleH4);
        contentDiv.appendChild(dateP);

        // 5. 組合所有元素
        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(contentDiv);
        cardLink.appendChild(cardDiv);

        experienceListContainer.appendChild(cardLink);
      });
    })
    .catch(error => {
      console.error('There was a problem fetching the data:', error);
    });
});