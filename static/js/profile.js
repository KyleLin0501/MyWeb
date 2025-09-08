document.addEventListener('DOMContentLoaded', function () {
  // 核心功能：根據 URL 錨點設定導覽列和區塊的 active 狀態
  function setActiveSection() {
    const currentHash = window.location.hash || '#home';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    document.querySelectorAll('section').forEach(section => {
      section.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-link[href="${currentHash}"]`);
    const activeSection = document.querySelector(currentHash);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    if (activeSection) {
      activeSection.classList.add('active');
    }
  }

  // 點擊導覽列連結時，精確捲動到區塊頂部
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        window.location.hash = targetId;
      }
    });
  });

  // 監聽 URL 錨點變化事件
  window.addEventListener('hashchange', setActiveSection);
  setActiveSection();

  // 載入關於我區塊的資料
  fetch('profile.json')
    .then(response => response.json())
    .then(data => {
      const aboutData = data.about;

      // 載入個人簡介
      document.getElementById('about-name').textContent = aboutData.name;
      document.getElementById('about-title').textContent = aboutData.title;
      document.getElementById('about-profile-img').src = aboutData.profile_img;
      document.getElementById('about-bio').textContent = aboutData.bio;

      // 載入個人經歷
      const experienceList = document.getElementById('about-experience');
      aboutData.experience.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        experienceList.appendChild(li);
      });

      // 載入技能專長
      const skillsList = document.getElementById('about-skills');
      aboutData.skills.forEach(skill => {
        // 建立卡片內層
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';

        // 建立圖示
        const icon = document.createElement('i');
        icon.className = getSkillIconClass(skill);

        // 建立技能名稱
        const h4 = document.createElement('h4');
        h4.textContent = skill;

        // 將圖示和技能名稱放入卡片
        skillCard.appendChild(icon);
        skillCard.appendChild(h4);

        // 將卡片放入容器
        skillsList.appendChild(skillCard);
      });

      // 輔助函式：根據技能名稱回傳對應的 Font Awesome 圖示類別
      function getSkillIconClass(skillName) {
        switch(skillName.toLowerCase()) {
          case 'swift':
            return 'fab fa-swift';
          case 'html5':
            return 'fab fa-html5';
          case 'css3':
            return 'fab fa-css3-alt';
          case 'javascript':
            return 'fab fa-js';
          case 'python':
            return 'fab fa-python';
          case 'java':
            return 'fab fa-java';
          default:
            return 'fas fa-cogs'; // 預設圖示
        }
      }

      // 載入社群連結
      const socialLinks = document.getElementById('about-social-links');
      aboutData.social.forEach(social => {
        // 建立卡片連結外層
        const socialLinkCard = document.createElement('a');
        socialLinkCard.href = social.url;
        socialLinkCard.target = '_blank';
        socialLinkCard.className = 'social-card-link';

        // 建立卡片內層
        const socialCard = document.createElement('div');
        socialCard.className = 'social-card';

        // 建立內容區塊
        const content = document.createElement('div');
        content.className = 'social-content';

        // 建立圖示
        const icon = document.createElement('i');
        icon.className = social.icon;

        // 建立平台名稱
        const h4 = document.createElement('h4');
        h4.textContent = social.platform;

        content.appendChild(icon);
        content.appendChild(h4);

        // 將內容放入卡片
        socialCard.appendChild(content);

        // 將卡片放入連結外層
        socialLinkCard.appendChild(socialCard);

        // 將卡片連結外層放入容器
        socialLinks.appendChild(socialLinkCard);
      });
    })
    .catch(error => console.error('Error fetching about data:', error));

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