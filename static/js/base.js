// 整合所有 JavaScript 邏輯到一個區塊，這樣更容易管理
document.addEventListener('DOMContentLoaded', function () {
  // 核心功能：根據 URL 錨點設定導覽列和區塊的 active 狀態
  function setActiveSection() {
    // 取得 URL 的錨點，如果沒有則預設為 #home
    const currentHash = window.location.hash || '#home';

    // 移除所有 .nav-link 和 section 的 active 狀態
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active');
    });

    // 根據錨點設定對應的 nav-link 和 section 為 active
    const activeLink = document.querySelector(`.nav-link[href="${currentHash}"]`);
    const activeSection = document.querySelector(currentHash);

    if (activeLink) {
      activeLink.classList.add('active');
    }
    if (activeSection) {
      activeSection.classList.add('active');
    }
  }

  // 監聽 URL 錨點變化事件，確保點擊內部連結時也能正確更新 active 狀態
  window.addEventListener('hashchange', setActiveSection);

  // 頁面載入時執行一次，處理初始狀態
  setActiveSection();

  // IntersectionObserver 動畫效果
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
});