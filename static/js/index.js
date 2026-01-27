let rawData = [];
let currentIndex = 1;
let isTransitioning = false;
let autoPlayInterval;

async function initCarousel() {
    try {
        // 1. 取得資料 (避免重複 fetch)
        if (rawData.length === 0) {
            const response = await fetch('experiences.json');
            if (!response.ok) throw new Error("無法取得 experiences.json");
            rawData = await response.json();
        }

        const container = document.getElementById('carouselContainer');
        if (!container) return;

        // 2. 建立無限循環列表 [最後一項, ...原始數據, 第一項]
        const firstClone = rawData[0];
        const lastClone = rawData[rawData.length - 1];
        const fullList = [lastClone, ...rawData, firstClone];

        // 3. 渲染內容 (整合連結邏輯)
        container.innerHTML = fullList.map((item, index) => {
            let targetUrl = "";
            let linkAttributes = "";

            if (item.useInternal) {
                targetUrl = `detail.html?source=${item.source || 'experiences'}&id=${item.id}`;
            } else {
                targetUrl = item.href || "";
            }

            if (targetUrl.trim() !== "") {
                linkAttributes = `href="${targetUrl}"`;
                if (!item.useInternal) {
                    linkAttributes += ` target="_blank" rel="noopener noreferrer"`;
                }
            } else {
                linkAttributes = `style="cursor: default;"`;
            }

            return `
                <a ${linkAttributes} class="carousel-item" data-index="${index}">
                    <img src="${item.imageSrc}" alt="${item.imageAlt}">
                    <div class="carousel-info">
                        <h4>${item.title}</h4>
                        <p class="muted">${item.date}</p>
                    </div>
                </a>
            `;
        }).join('');

        // 4. 初始定位
        setTimeout(() => {
            updateCarousel(true);
            startAutoPlay();
        }, 100);

        // 監聽動畫結束
        container.removeEventListener('transitionend', handleTransitionEnd); // 防止重複綁定
        container.addEventListener('transitionend', handleTransitionEnd);

        // 滑鼠移入停止自動播放，移出恢復
        const wrapper = document.getElementById('bannerWrapper');
        wrapper.addEventListener('mouseenter', stopAutoPlay);
        wrapper.addEventListener('mouseleave', startAutoPlay);

    } catch (e) {
        console.error("Banner 初始化失敗:", e);
    }
}

function updateCarousel(noAnimation = false) {
    const container = document.getElementById('carouselContainer');
    const wrapper = document.getElementById('bannerWrapper');
    const allItems = document.querySelectorAll('.carousel-item');

    if (!container || !wrapper || allItems.length === 0) return;

    if (noAnimation) {
        wrapper.classList.add('no-animation');
        container.classList.add('no-transition');
    } else {
        wrapper.classList.remove('no-animation');
        container.classList.remove('no-transition');
    }

    const targetItem = allItems[currentIndex];
    const wrapperWidth = wrapper.offsetWidth;
    const itemWidth = targetItem.offsetWidth;
    const itemLeft = targetItem.offsetLeft;

    const offset = (wrapperWidth / 2) - (itemWidth / 2) - itemLeft;
    container.style.transform = `translateX(${offset}px)`;

    allItems.forEach((item, i) => {
        item.classList.toggle('active', i === currentIndex);
    });

    if (noAnimation) {
        container.offsetHeight; // 強迫重繪
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!isTransitioning) {
                    wrapper.classList.remove('no-animation');
                    container.classList.remove('no-transition');
                }
            });
        });
    }
}

function handleTransitionEnd() {
    isTransitioning = false;
    if (currentIndex === rawData.length + 1) {
        currentIndex = 1;
        updateCarousel(true);
    }
    if (currentIndex === 0) {
        currentIndex = rawData.length;
        updateCarousel(true);
    }
}

// --- 修改 moveNext 與 movePrev，加入計時器重置 ---

function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;

    // 關鍵：手動按的時候，重新計算 5 秒，避免與自動播放衝突
    startAutoPlay();

    currentIndex++;
    updateCarousel(false);
}

function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;

    // 關鍵：手動按的時候，重新計算 5 秒
    startAutoPlay();

    currentIndex--;
    updateCarousel(false);
}

// --- 自動播放控制邏輯 (保持不變，但確保 startAutoPlay 總會先清除舊的) ---

function startAutoPlay() {
    // 這裡的 stopAutoPlay 會清除正在跑的 setInterval
    stopAutoPlay();
    // 重新從 0 開始數 5 秒
    autoPlayInterval = setInterval(moveNext, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 監聽視窗變化
window.addEventListener('resize', () => updateCarousel(true));

// --- 關鍵修正：解決回退/快取問題 ---

window.addEventListener('pageshow', (event) => {
    // 每次顯示頁面都確保啟動，如果是初次載入由 initCarousel 負責，若是回退則由此觸發
    if (rawData.length === 0) {
        initCarousel();
    } else {
        updateCarousel(true);
        startAutoPlay();
    }
});

// 切換分頁時暫停，節省效能並防止回來時動畫堆疊
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});