document.addEventListener('DOMContentLoaded', function () {
    const experienceListContainer = document.querySelector('.experience-list');

    // 防呆機制：如果頁面上沒有這個區塊，就不要執行
    if (!experienceListContainer) {
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

                // === 連結判斷邏輯 ===
                if (item.useInternal) {
                    // [情況 A] 連到內部詳情頁 (detail.html)
                    cardLink.href = `detail.html?source=${item.source}&id=${item.id}`;
                    cardLink.target = "_self"; // 在當前分頁開啟
                } else {
                    // [情況 B] 連到外部網站
                    cardLink.href = item.href;
                    cardLink.target = "_blank"; // 外部連結建議開新分頁
                    cardLink.rel = "noopener noreferrer";
                }

                cardLink.setAttribute('aria-label', item.ariaLabel);

                // 2. 建立 experience-card div
                const cardDiv = document.createElement('div');
                cardDiv.className = 'experience-card';

                // 3. 建立圖片區塊
                const imageDiv = document.createElement('div');
                imageDiv.className = 'experience-image';

                const img = document.createElement('img');
                img.src = item.imageSrc || 'static/img/placeholder.png'; // 預設圖防呆
                img.alt = item.imageAlt;
                img.loading = 'lazy';

                // CSS 樣式通常寫在 CSS 檔，但這裡確保圖片填滿
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";

                imageDiv.appendChild(img);

                // 4. 建立內容區塊 (標題與日期)
                const contentDiv = document.createElement('div');
                contentDiv.className = 'experience-content';

                const titleH4 = document.createElement('h4');
                titleH4.innerHTML = item.title;

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