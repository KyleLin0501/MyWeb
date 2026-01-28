let rawData = [];
let currentIndex = 1;
let isTransitioning = false;
let autoPlayInterval;
let isPaused = false;

async function initCarousel() {
    try {
        if (rawData.length === 0) {
            const response = await fetch('experiences.json');
            if (!response.ok) throw new Error("無法取得 experiences.json");
            rawData = await response.json();
        }

        const container = document.getElementById('carouselContainer');
        const wrapper = document.getElementById('bannerWrapper');
        if (!container || !wrapper) return;

        // 1. 建立循環列表
        const firstClone = rawData[0];
        const lastClone = rawData[rawData.length - 1];
        const fullList = [lastClone, ...rawData, firstClone];

        // 2. 渲染 HTML
        container.innerHTML = fullList.map((item, index) => {
            let targetUrl = item.useInternal
                ? `detail.html?source=${item.source || 'experiences'}&id=${item.id}`
                : (item.href || "");

            let linkAttributes = targetUrl.trim() !== ""
                ? `href="${targetUrl}" ${!item.useInternal ? 'target="_blank" rel="noopener noreferrer"' : ''}`
                : `style="cursor: default;"`;

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

        // 3. 初始定位
        setTimeout(() => {
            updateCarousel(true);
            startAutoPlay();
        }, 100);

        // 4. 事件監聽
        container.addEventListener('transitionend', handleTransitionEnd);

        wrapper.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoPlay();
        });
        wrapper.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoPlay();
        });

        // 5. 關鍵修正：自動偵測 Section 顯示狀態
        initVisibilityObserver(wrapper);

    } catch (e) {
        console.error("Banner 初始化失敗:", e);
    }
}

/**
 * 偵測 Banner 是否進入視窗或從隱藏變為顯示
 */
function initVisibilityObserver(element) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 當 Section 顯示時，強制校正並啟動
                console.log("Banner 已顯示，啟動輪播...");
                setTimeout(() => {
                    updateCarousel(true);
                    startAutoPlay();
                }, 100);
            } else {
                // 當 Section 隱藏時，停止計時省電
                stopAutoPlay();
            }
        });
    }, { threshold: 0.1 }); // 只要露出 10% 就觸發

    observer.observe(element);
}

function updateCarousel(noAnimation = false) {
    const container = document.getElementById('carouselContainer');
    const wrapper = document.getElementById('bannerWrapper');
    const allItems = document.querySelectorAll('.carousel-item');

    if (!container || !wrapper || allItems.length === 0) return;

    // 安全防護：寬度為 0 (隱藏中) 則不計算
    const wrapperWidth = wrapper.offsetWidth;
    if (wrapperWidth === 0) return;

    if (noAnimation) {
        isTransitioning = false; // 強制解除鎖定
        wrapper.classList.add('no-animation');
        container.classList.add('no-transition');
    } else {
        wrapper.classList.remove('no-animation');
        container.classList.remove('no-transition');
    }

    // 確保索引正確
    if (currentIndex >= allItems.length) currentIndex = 1;
    if (currentIndex < 0) currentIndex = rawData.length;

    const targetItem = allItems[currentIndex];
    if (!targetItem) return;

    const itemWidth = targetItem.offsetWidth;
    const itemLeft = targetItem.offsetLeft;

    // 計算居中偏移量
    const offset = (wrapperWidth / 2) - (itemWidth / 2) - itemLeft;
    container.style.transform = `translateX(${offset}px)`;

    // 更新 Active 狀態
    allItems.forEach((item, i) => {
        item.classList.toggle('active', i === currentIndex);
    });

    if (noAnimation) {
        container.offsetHeight; // 強迫重繪
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                wrapper.classList.remove('no-animation');
                container.classList.remove('no-transition');
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

function moveNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    startAutoPlay(); // 手動點擊時重設計時器
    currentIndex++;
    updateCarousel(false);
}

function movePrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    startAutoPlay(); // 手動點擊時重設計時器
    currentIndex--;
    updateCarousel(false);
}

function startAutoPlay() {
    stopAutoPlay();
    if (isPaused) return;
    autoPlayInterval = setInterval(() => {
        if (!document.hidden) moveNext();
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 監聽視窗與頁面狀態
window.addEventListener('resize', () => updateCarousel(true));
window.addEventListener('pageshow', () => {
    if (rawData.length > 0) {
        updateCarousel(true);
        startAutoPlay();
    }
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
    else { updateCarousel(true); startAutoPlay(); }
});

// 初始化
document.addEventListener('DOMContentLoaded', initCarousel);