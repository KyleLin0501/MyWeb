document.addEventListener('DOMContentLoaded', function () {
  const experienceListContainer = document.querySelector('.develop-list-grid');

  if (!experienceListContainer) {
    console.error('Container for develop list not found.');
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

        // 移除多餘的 cardHtml 變數，直接賦值給 innerHTML
        cardLink.innerHTML = `
            <div class="experience-card">
                <div class="experience-image">
                    <img src="placeholder.png" data-src="${item.imageSrc}" alt="${item.imageAlt}" loading="lazy">
                </div>
                <div class="experience-content">
                    <h4>${item.title}</h4>
                    <p class="muted">${item.date}</p>
                    <p class="description">${item.description}</p>
                </div>
            </div>
        `;
        experienceListContainer.appendChild(cardLink);
      });

      // 新增的程式碼：處理圖片延遲載入
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img); // 載入後停止觀察
          }
        });
      });

      lazyImages.forEach(img => observer.observe(img));
    })
    .catch(error => {
      console.error('There was a problem fetching the data:', error);
    });
});