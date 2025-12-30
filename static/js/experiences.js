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

                // === 修改後的連結判斷邏輯開始 ===
                let targetUrl = "";

                // 先決定網址是什麼
                if (item.useInternal) {
                    // [情況 A] 內部連結 (detail.html)
                    targetUrl = `detail.html?source=${item.source}&id=${item.id}`;
                } else {
                    // [情況 B] 外部連結，若 item.href 未定義則視為空字串
                    targetUrl = item.href || "";
                }

                // 判斷網址是否有效
                if (targetUrl.trim() !== "") {
                    // 有網址：設定 href 與 target
                    cardLink.href = targetUrl;

                    if (item.useInternal) {
                        cardLink.target = "_self"; // 內部連結：當前分頁開啟
                    } else {
                        cardLink.target = "_blank"; // 外部連結：新分頁開啟
                        cardLink.rel = "noopener noreferrer";
                    }
                } else {
                    // 無網址 (targetUrl 為空)：
                    // 1. 不設定 href 屬性 (這樣 <a> 標籤就不會跳轉)
                    // 2. 將滑鼠游標改為預設樣式 (避免出現手指圖示)
                    cardLink.style.cursor = "default";
                }
                // === 修改後的連結判斷邏輯結束 ===

                cardLink.setAttribute('aria-label', item.ariaLabel);

                // 2. 建立 experience-card div
                const cardDiv = document.createElement('div');
                cardDiv.className = 'experience-card';

                // 3. 建立圖片區塊
                const imageDiv = document.createElement('div');
                imageDiv.className = 'experience-image';

                const img = document.createElement('img');
                // 這裡改用 item.imageSrc 配合防呆
                img.src = item.imageSrc || 'static/img/placeholder.png';
                img.alt = item.imageAlt || ''; // 防呆：如果沒 alt 至少給空字串
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
                // 建議使用 textContent 防止 XSS，若需解析 HTML 才用 innerHTML
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