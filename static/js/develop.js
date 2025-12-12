document.addEventListener('DOMContentLoaded', function () {

    /**
     * 載入經歷資料的共用函式
     * @param {string} jsonFile - JSON 檔案路徑
     * @param {string} containerSelector - 容器選擇器
     * @param {string|null} internalSource - (選填) 如果是內部詳情頁，傳入來源名稱(如 'teaching')；如果是外部連結則不傳或是 null
     */
    function loadExperience(jsonFile, containerSelector, internalSource = null) {
        const listContainer = document.querySelector(containerSelector);

        if (!listContainer) {
            console.error(`Container for ${containerSelector} not found.`);
            return;
        }

        fetch(jsonFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok for ${jsonFile}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    const cardLink = document.createElement('a');
                    cardLink.className = 'experience-card-link';

                    // === 關鍵修改邏輯開始 ===
                    if (internalSource) {
                        // 【Teaching 模式】：連到內部詳情頁
                        // 網址格式：detail.html?source=teaching&id=xxxx
                        cardLink.setAttribute('href', `detail.html?source=${internalSource}&id=${item.id}`);
                        // 內部連結通常不需要 target="_blank"，除非你想在新分頁開
                    } else {
                        // 【Develop 模式】：維持原本操作 (連到外部網站)
                        cardLink.setAttribute('href', item.href);
                        cardLink.setAttribute('target', '_blank');
                        cardLink.setAttribute('rel', 'noopener noreferrer');
                    }
                    // === 關鍵修改邏輯結束 ===

                    cardLink.setAttribute('aria-label', item.ariaLabel);

                    // 這裡的 HTML 結構不變
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
                    listContainer.appendChild(cardLink);
                });

                // 呼叫懶加載處理函式
                initLazyLoading(listContainer);
            })
            .catch(error => {
                console.error(`There was a problem fetching the data from ${jsonFile}:`, error);
            });
    }

    // 懶加載邏輯 (維持不變)
    function initLazyLoading(scopeElement) {
        const lazyImages = scopeElement.querySelectorAll('img[loading="lazy"]');

        if (lazyImages.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => observer.observe(img));
    }

    // --- 執行程式 ---

    // 1. 載入開發經歷 (Develop)
    // 不傳入第三個參數 -> 維持原本操作 (讀取 item.href 並另開視窗)
    loadExperience('develop.json', '.develop-list-grid');

    // 2. 載入教學經歷 (Teaching)
    // 傳入 'teaching' -> 改為連到 detail.html
    loadExperience('teaching.json', '.teaching-list-grid', 'teaching');
});