// civil.js
const civilData = {
    year1: {
        term1: { link: "https://drive.google.com/drive/folders/19cPnys-MgV0ySa17j4NPE5bFBpy32hMi", name: { ar: "السنة الأولى - الترم الأول", en: "First Year - First Term" } },
        term2: { link: "https://drive.google.com/drive/folders/1vR6OVMnKX7r07_uLcMdKYPxDMBlZg6tM", name: { ar: "السنة الأولى - الترم الثاني", en: "First Year - Second Term" } },
        all: { name: { ar: "السنة الأولى", en: "First Year" } }
    },
    year2: {
        term1: { link: "https://drive.google.com/drive/folders/11vNshzT6Uub_A7KU2MhE5WDQupPyF4b9", name: { ar: "السنة الثانية - الترم الأول", en: "Second Year - First Term" } },
        term2: { link: "https://drive.google.com/drive/folders/16xa3FEt4xFOUQKfpDrMEnkY8EWklY78j", name: { ar: "السنة الثانية - الترم الثاني", en: "Second Year - Second Term" } },
        all: { name: { ar: "السنة الثانية", en: "Second Year" } }
    },
    year3: {
        term1: { link: "https://drive.google.com/drive/folders/1-1Z2KiGeYI74YILYXosuXLoS-aIWcHkU", name: { ar: "السنة الثالثة - الترم الأول", en: "Third Year - First Term" } },
        term2: { link: "https://drive.google.com/drive/folders/1-5qlvYeRIMCIwwtZ2nQrAadnL0W_RN38", name: { ar: "السنة الثالثة - الترم الثاني", en: "Third Year - Second Term" } },
        all: { name: { ar: "السنة الثالثة", en: "Third Year" } }
    },
    year4: {
        term1: { link: "https://drive.google.com/drive/folders/1-7LHVS1ipxjw1ale9sKD2I2WIym_jhna", name: { ar: "السنة الرابعة - الترم الأول", en: "Fourth Year - First Term" } },
        term2: { link: "https://drive.google.com/drive/folders/1-BwXYdeTlTqklY7_zynxx2qfE7bXm6qa", name: { ar: "السنة الرابعة - الترم الثاني", en: "Fourth Year - Second Term" } },
        all: { name: { ar: "السنة الرابعة", en: "Fourth Year" } }
    }
};

const pages = {
    civil: {
        ar: `
    <div class="prep-container">
      <h1 class="prep-title">قسم الهندسة المدنية</h1>
      <div class="subjects-grid">
        <div class="telegram-box">
          <a href="https://t.me/Civilengineersgroup6" onclick="event.stopPropagation(); openLink('https://t.me/Civilengineersgroup6', event); return false;">
            <span class="telegram-title">تليجرام</span>
            <small class="telegram-subtitle">لو عايز أي شروحات هتلاقيها هنا</small>
          </a>
        </div>
        <div class="telegram-box">
          <a href="https://youtube.com/@engeslamwael" onclick="event.stopPropagation(); openLink('https://youtube.com/@engeslamwael', event); return false;">
            <span class="telegram-title">يوتيوب</span>
            <small class="telegram-subtitle">لو عايز اي شروحات هتلاقيها هنا..قريبا </small>
          </a>
        </div>
        ${Object.keys(civilData).map(year => `
          <div class="subject-box" onclick="showCivilModal('${year}')">
            ${civilData[year].all.name.ar} ${year === 'year1' ? '٢٠٢٥ / ٢٠٢٦' : year === 'year2' ? '٢٠٢٦ / ٢٠٢٧' : year === 'year3' ? '٢٠٢٧ / ٢٠٢٨' : '٢٠٢٨ / ٢٠٢٩'}
            <button class="favorite-btn ${window.favorites.includes(`civil:${year}.all`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.all')"><i data-lucide="heart"></i></button>
          </div>
        `).join('')}
      </div>
    </div>
  `,
        en: `
    <div class="prep-container">
      <h1 class="prep-title">Civil Engineering Section</h1>
      <div class="subjects-grid">
        <div class="telegram-box">
          <a href="https://t.me/Civilengineersgroup6" onclick="event.stopPropagation(); openLink('https://t.me/Civilengineersgroup6', event); return false;">
            <span class="telegram-title">Telegram</span>
            <small class="telegram-subtitle">Find all explanations here.</small>
          </a>
        </div>
        <div class="telegram-box">
          <a href="https://youtube.com/@engeslamwael" onclick="event.stopPropagation(); openLink('https://youtube.com/@engeslamwael', event); return false;">
            <span class="telegram-title">YouTube</span>
            <small class="telegram-subtitle">Find all explanations here soon.</small>
          </a>
        </div>
        ${Object.keys(civilData).map(year => `
          <div class="subject-box" onclick="showCivilModal('${year}')">
            ${civilData[year].all.name.en} ${year === 'year1' ? '2025/2026' : year === 'year2' ? '2026/2027' : year === 'year3' ? '2027/2028' : '2028/2029'}
            <button class="favorite-btn ${window.favorites.includes(`civil:${year}.all`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.all')"><i data-lucide="heart"></i></button>
          </div>
        `).join('')}
      </div>
    </div>
  `
    }
};

function showCivilModal(year) {
    console.log('Showing Civil Modal for year:', year); // للتصحيح
    const modal = document.createElement('div');
    modal.className = 'civil-modal';
    modal.innerHTML = `
      <button class="close-modal" onclick="this.parentElement.remove()">✕</button>
      <h3>${civilData[year].all.name[window.currentLang]}</h3>
      <div class="term-box" onclick="openDriveLink('${civilData[year].term1.link}', event)">
        <span>${civilData[year].term1.name[window.currentLang]}</span>
        <button class="favorite-btn ${window.favorites.includes(`civil:${year}.term1`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.term1')">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="term-box" onclick="openDriveLink('${civilData[year].term2.link}', event)">
        <span>${civilData[year].term2.name[window.currentLang]}</span>
        <button class="favorite-btn ${window.favorites.includes(`civil:${year}.term2`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.term2')">
          <i data-lucide="heart"></i>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    loadIcons();
}

function showCivilPage() {
    console.log('Attempting to show Civil Page'); // للتصحيح
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('main-content element not found');
        return;
    }
    const aboutPage = document.getElementById('aboutPage');
    const settingsPage = document.getElementById('settingsPage');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    document.querySelectorAll('.civil-modal').forEach(modal => modal.remove());
    document.querySelectorAll('.download-modal').forEach(modal => modal.remove());
    
    // تحديث pageHistory
    const currentActive = document.querySelector('.nav-item.active');
    if (currentActive) {
        const currentPage = currentActive.getAttribute('data-page');
        if (currentPage && currentPage !== 'civil') {
            window.pageHistory = window.pageHistory.filter(p => p !== 'civil');
            window.pageHistory.push('civil');
        }
    }
    
    closeSidebar();
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';
    header.style.display = 'flex';
    nav.style.display = 'flex';
    mainContent.style.display = 'block';
    mainContent.innerHTML = pages.civil[window.currentLang];
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === 'civil') {
            item.classList.add('active');
        }
    });
    updateNavText();
    loadIcons();
    updateAllHeartIcons();
    console.log('Civil Page rendered successfully');
}

// جعل البيانات متاحة عالميًا
window.civilData = civilData;