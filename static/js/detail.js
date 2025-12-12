document.addEventListener('DOMContentLoaded', function() {

    // 1. 抓取網址參數
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const id = params.get('id');

    // 檢查參數是否存在
    if (!source || !id) {
        // 如果沒有參數，通常是直接開啟網頁，這邊不做動作或顯示錯誤皆可
        const titleEl = document.getElementById('detail-title');
        if (titleEl) titleEl.innerText = "參數錯誤";
        return;
    }

    // 2. 決定讀取哪個 JSON 檔案 (teaching.json 或 experiences.json)
    const jsonFile = `${source}.json`;

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`無法讀取檔案 (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            // 確保資料是陣列
            if (!Array.isArray(data)) {
                console.error("JSON 格式錯誤：應為陣列");
                return;
            }

            // 3. 比對 ID 找出對應資料
            const item = data.find(p => p.id === id);

            if (item) {
                renderDetail(item);
            } else {
                const titleEl = document.getElementById('detail-title');
                if (titleEl) titleEl.innerText = "查無此資料";
            }
        })
        .catch(err => {
            console.error("載入發生錯誤:", err);
            const titleEl = document.getElementById('detail-title');
            if (titleEl) titleEl.innerText = "載入發生錯誤";
        });
});

function renderDetail(item) {
    try {
        const titleEl = document.getElementById('detail-title');
        const dateEl = document.getElementById('detail-date');
        const descEl = document.getElementById('detail-desc');
        const galleryContainer = document.getElementById('gallery-container');

        // 防呆：如果 HTML 元素改名或找不到，就停止執行
        if(!titleEl || !dateEl || !descEl || !galleryContainer) {
            console.error("HTML 元素缺失");
            return;
        }

        // --- 填入內容 ---

        // 1. 標題 (支援 HTML 標籤，如 <br>)
        titleEl.innerHTML = item.title || "無標題";

        // 2. 日期
        dateEl.innerText = item.date || "";

        // 3. 描述 (你的需求：如果沒有 description 就隱藏)
        if (item.description && item.description.trim() !== "") {
            descEl.innerText = item.description;
            descEl.style.display = "block"; // 顯示
        } else {
            descEl.style.display = "none";  // 隱藏 (把位置空出來，比較美觀)
        }

        // 4. 圖片集 (Gallery)
        galleryContainer.innerHTML = ''; // 清空容器

        if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
            item.gallery.forEach(imgSrc => {
                const div = document.createElement('div');
                div.className = 'gallery-item';

                // 圖片標籤
                div.innerHTML = `<img src="${imgSrc}" alt="${item.title} photo">`;

                galleryContainer.appendChild(div);
            });
        } else {
            // 如果真的沒有圖片，可以選擇顯示文字，或是什麼都不顯示
            galleryContainer.innerHTML = '<p style="text-align:center; color:#999;">暫無圖片展示</p>';
        }

    } catch (e) {
        console.error("渲染過程發生錯誤:", e);
    }
}