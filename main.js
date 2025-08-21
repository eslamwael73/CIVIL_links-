// Filename: main.js
let pageHistory = [];
let currentLang = localStorage.getItem('language') || 'ar';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let lastClickTime = 0;
let hasOpenedApp = false;
let isLinkOpening = false;

// بيانات صفحة مدني
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

// بيانات المواد في إعدادي
const prepData = {
    physics: { link: "https://drive.google.com/drive/folders/1xK_yAObA4zCJo8b85ajqqS4LHpvoQBVP", name: { ar: "فيزياء 2", en: "Physics 2" } },
    math: { link: "https://drive.google.com/drive/folders/1xH4POYHcCXOCQ0HXPiSrKG7cNuMP5YY9", name: { ar: "رياضيات 2", en: "Mathematics 2" } },
    mechanics: { link: "https://drive.google.com/drive/folders/1xG60KxFXGWyZtZ2dKKJ48-8YPMp3ayCS", name: { ar: "ميكانيكا 2", en: "Mechanics 2" } },
    drawing: { link: "https://drive.google.com/drive/folders/1xMC8HtgBu0N800rJW-OYQjdWjbPBCUuf", name: { ar: "رسم 2", en: "Drawing 2" } },
    production: { link: "https://drive.google.com/drive/folders/1YumNKI_SbFXszAXOJp3hAD1EnIHpe5-j", name: { ar: "تكنولوجيا الإنتاج وتاريخ الهندسة", en: "Production Technology and History of Engineering" } },
    programming: { link: "https://drive.google.com/drive/folders/1YtzBbF6uGmqB_NVoeWTRN682kJ6L7RYx", name: { ar: "برمجة", en: "Programming" } }
};

function closeCivilModal(modal) {
    modal.remove();
}

function showCivilModal(year) {
    const modal = document.createElement('div');
    modal.className = 'civil-modal';
    modal.innerHTML = `
      <button class="close-modal" onclick="this.parentElement.remove()">✕</button>
      <h3>${civilData[year].all.name[currentLang]}</h3>
      <div class="term-box" onclick="openDriveLink('${civilData[year].term1.link}', event)">
        <span>${civilData[year].term1.name[currentLang]}</span>
        <button class="favorite-btn ${favorites.includes(`civil:${year}.term1`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.term1')">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="term-box" onclick="openDriveLink('${civilData[year].term2.link}', event)">
        <span>${civilData[year].term2.name[currentLang]}</span>
        <button class="favorite-btn ${favorites.includes(`civil:${year}.term2`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.term2')">
          <i data-lucide="heart"></i>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    loadIcons();
}

function openDriveLink(url, event) {
    if (event.target.closest('.favorite-btn')) {
        event.stopImmediatePropagation();
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - lastClickTime < 500) return;
    lastClickTime = now;

    if (isLinkOpening) return;
    isLinkOpening = true;

    const clickedElement = event.currentTarget;
    clickedElement.style.transform = 'scale(0.95)';

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `intent://drive.google.com${new URL(url).pathname}#Intent;scheme=https;package=com.google.android.apps.docs;end`;
    document.body.appendChild(iframe);

    setTimeout(() => {
        clickedElement.style.transform = '';
    }, 200);

    const blurHandler = () => {
        hasOpenedApp = true;
        isLinkOpening = false;
        window.removeEventListener('blur', blurHandler);
    };
    window.addEventListener('blur', blurHandler);

    setTimeout(() => {
        if (!hasOpenedApp) {
            window.open(url, '_blank');
        }
        document.body.removeChild(iframe);
        isLinkOpening = false;
    }, 1000);
}

function toggleFavorite(section, item) {
    const favoriteId = `${section}:${item}`;
    const index = favorites.indexOf(favoriteId);
    const isAdding = index === -1;

    if (isAdding) {
        favorites.push(favoriteId);
        console.log(`Added to favorites: ${favoriteId}`);
        if (section === 'civil' && item.includes('.all')) {
            const year = item.split('.')[0];
            ['term1', 'term2'].forEach(term => {
                const termId = `civil:${year}.${term}`;
                if (!favorites.includes(termId)) favorites.push(termId);
                console.log(`Added to favorites: ${termId}`);
            });
        }
    } else {
        favorites.splice(index, 1);
        console.log(`Removed from favorites: ${favoriteId}`);
        if (section === 'civil' && item.includes('.all')) {
            const year = item.split('.')[0];
            favorites = favorites.filter(fav => !fav.startsWith(`civil:${year}.term`));
            console.log(`Removed terms for ${year} from favorites`);
        }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    updateAllHeartIcons();

    updateFavoritesPage();
}

function isFavoritesPageActive() {
    const activeNavItem = document.querySelector('.nav-item.active');
    return activeNavItem && activeNavItem.dataset.page === 'favorites';
}

function getItemData(section, id) {
    if (section === 'prep') return prepData[id];
    if (section === 'civil') {
        const [year, term] = id.split('.');
        return civilData[year]?.[term];
    }
    return null;
}

function updateAllHeartIcons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const onclickContent = btn.getAttribute('onclick');
        if (onclickContent) {
            const match = onclickContent.match(/toggleFavorite\('(.+)', '(.+)'\)/);
            if (match) {
                const section = match[1];
                const item = match[2];
                const favoriteId = `${section}:${item}`;
                btn.classList.toggle('favorited', favorites.includes(favoriteId));
                btn.innerHTML = '<i data-lucide="heart"></i>';
            }
        }
    });
    loadIcons();
}

function renderFavorites() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    container.innerHTML = favorites.length === 0
        ? `<p>${currentLang === 'ar' ? 'لا توجد مفضلات' : 'No favorites'}</p>`
        : favorites.map(fav => {
            const [section, id] = fav.split(':');
            const data = getItemData(section, id);
            if (!data) return '';
            return `
              <div class="subject-box">
                <a href="${data.link || '#'}" style="color:white;text-decoration:none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening favorite link:', '${data.link}')">${data.name[currentLang]}</a>
                <button class="favorite-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${section}', '${id}')"><i data-lucide="heart"></i></button>
              </div>
            `;
        }).join('');

    loadIcons();
}

function updateFavoritesPage() {
    if (isFavoritesPageActive()) {
        renderFavorites();
    }
    pages.favorites[currentLang] = `
    <div class="prep-container">
      <h1 class="prep-title">${currentLang === 'ar' ? 'المفضلة' : 'Favorites'}</h1>
      <p class="prep-subtitle">${currentLang === 'ar' ? 'المواد والروابط المحفوظة' : 'Saved materials and links'}</p>
      <div class="subjects-grid" id="favorites-grid">
        ${favorites.length === 0 ? `<p>${currentLang === 'ar' ? 'لم تتم إضافة مفضلة بعد' : 'No favorites added yet'}</p>` : favorites.map(item => {
            const [section, id] = item.split(':');
            const data = section === 'prep' ? prepData[id] : getItemData(section, id);
            return `
            <div class="subject-box">
              <a href="${data.link || '#'}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening favorite link:', '${data.link}')">${data.name[currentLang]}</a>
              <button class="favorite-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${section}', '${id}')"><i data-lucide="heart"></i></button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function searchContent(query) {
    query = query.toLowerCase().trim();
    const results = [];
    if (query === '') {
        return results;
    }

    Object.entries(prepData).forEach(([id, data]) => {
        if (data.name[currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'prep', id, name: data.name[currentLang], link: data.link });
        }
    });

    Object.entries(civilData).forEach(([year, data]) => {
        if (data.all.name[currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.all`, name: data.all.name[currentLang], link: '#' });
        }
        if (data.term1.name[currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.term1`, name: data.term1.name[currentLang], link: data.term1.link });
        }
        if (data.term2.name[currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.term2`, name: data.term2.name[currentLang], link: data.term2.link });
        }
    });

    return results;
}

const pages = {
    home: {
        ar: `
        <h2>مرحبًا بك</h2>
        <img src="https://i.postimg.cc/Y9LHL2xH/Picsart-25-07-22-18-01-32-565.png" alt="Welcome Image" class="main-img">
        <p>ابدأ باختيار القسم من الأسفل</p>
      `,
        en: `
        <h2>Welcome to</h2>
        <img src="https://i.postimg.cc/Y9LHL2xH/Picsart-25-07-22-18-01-32-565.png" alt="Welcome Image" class="main-img">
        <p>Start by selecting a section from below</p>
      `
    },
    prep: {
        ar: `
        <div class="prep-container">
          <h1 class="prep-title">المرحلة الإعدادية ٢٠٢٣ / ٢٠٢٤</h1>
          <p class="prep-subtitle">بنعتذر ليس لدينا غير مواد الترم الثاني فقط</p>
          <div class="subjects-grid">
            ${Object.entries(prepData).map(([id, data]) => `
              <div class="subject-box" onclick="event.stopPropagation()">
                <a href="${data.link}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening prep link:', '${data.link}')">${data.name.ar}</a>
                <button class="favorite-btn ${favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')"><i data-lucide="heart"></i></button>
              </div>
            `).join('')}
          </div>
        </div>
      `,
        en: `
        <div class="prep-container">
          <h1 class="prep-title">Preparatory Stage 2023/2024</h1>
          <p class="prep-subtitle">We apologize, only second-term materials are available.</p>
          <div class="subjects-grid">
            ${Object.entries(prepData).map(([id, data]) => `
              <div class="subject-box" onclick="event.stopPropagation()">
                <a href="${data.link}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening prep link:', '${data.link}')">${data.name.en}</a>
                <button class="favorite-btn ${favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')"><i data-lucide="heart"></i></button>
              </div>
            `).join('')}
          </div>
        </div>
      `
    },
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
            <button class="favorite-btn ${favorites.includes(`civil:${year}.all`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.all')"><i data-lucide="heart"></i></button>
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
            <button class="favorite-btn ${favorites.includes(`civil:${year}.all`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('civil', '${year}.all')"><i data-lucide="heart"></i></button>
          </div>
        `).join('')}
      </div>
    </div>
  `
    },
    favorites: {
        ar: `
        <div class="prep-container">
          <h1 class="prep-title">المفضلة</h1>
          <p class="prep-subtitle">المواد والروابط المحفوظة</p>
          <div class="subjects-grid" id="favorites-grid">
            ${favorites.length === 0 ? '<p>لم تتم إضافة مفضلة بعد</p>' : favorites.map(item => {
            const [section, id] = item.split(':');
            const data = section === 'prep' ? prepData[id] : civilData[id.split('.')[0]][id.includes('.all') ? 'all' : id.split('.')[1]];
            return `
                <div class="subject-box">
                  <a href="${data.link || '#'}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening favorite link:', '${data.link}')">${data.name[currentLang]}</a>
                  <button class="favorite-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${section}', '${id}')"><i data-lucide="heart"></i></button>
                </div>
              `;
        }).join('')}
          </div>
        </div>
      `,
        en: `
        <div class="prep-container">
          <h1 class="prep-title">Favorites</h1>
          <p class="prep-subtitle">Saved materials and links</p>
          <div class="subjects-grid" id="favorites-grid">
            ${favorites.length === 0 ? '<p>No favorites added yet</p>' : favorites.map(item => {
            const [section, id] = item.split(':');
            const data = section === 'prep' ? prepData[id] : civilData[id.split('.')[0]][id.includes('.all') ? 'all' : id.split('.')[1]];
            return `
                <div class="subject-box">
                  <a href="${data.link || '#'}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening favorite link:', '${data.link}')">${data.name[currentLang]}</a>
                  <button class="favorite-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${section}', '${id}')"><i data-lucide="heart"></i></button>
                </div>
              `;
        }).join('')}
          </div>
        </div>
      `
    }
};

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedLoadIcons = debounce(loadIcons, 100);

function loadIcons(attempts = 5) {
    if (attempts <= 0) {
        console.error('Failed to load Lucide library after multiple attempts');
        return;
    }
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } else {
        console.warn('Lucide library not loaded, retrying...');
        setTimeout(() => loadIcons(attempts - 1), 100);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
}

function showPage(page) {
    const mainContent = document.getElementById('main-content');
    const aboutPage = document.getElementById('aboutPage');
    const settingsPage = document.getElementById('settingsPage');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');

    document.querySelectorAll('.civil-modal').forEach(modal => modal.remove());
    document.querySelectorAll('.download-modal').forEach(modal => modal.remove());

    const currentActive = document.querySelector('.nav-item.active');
    if (currentActive) {
        const currentPage = currentActive.getAttribute('data-page');
        if (currentPage && currentPage !== page && ['home', 'prep', 'civil', 'favorites'].includes(page)) {
            pageHistory = pageHistory.filter(p => p !== page);
            pageHistory.push(page);
        }
    }

    closeSidebar();
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';
    header.style.display = 'flex';
    nav.style.display = 'flex';
    mainContent.style.display = 'block';

    mainContent.innerHTML = pages[page][currentLang];

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });

    updateNavText();
    loadIcons();
    updateAllHeartIcons();
}

function showAbout() {
    const mainContent = document.getElementById('main-content');
    const aboutPage = document.getElementById('aboutPage');
    const settingsPage = document.getElementById('settingsPage');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');

    document.querySelectorAll('.civil-modal').forEach(modal => modal.remove());
    document.querySelectorAll('.download-modal').forEach(modal => modal.remove());

    closeSidebar();
    mainContent.style.display = 'none';
    header.style.display = 'none';
    nav.style.display = 'none';
    settingsPage.style.display = 'none';
    aboutPage.style.display = 'block';

    updateAboutText();
    loadIcons();
}

function showSettings() {
    const mainContent = document.getElementById('main-content');
    const aboutPage = document.getElementById('aboutPage');
    const settingsPage = document.getElementById('settingsPage');
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');

    document.querySelectorAll('.civil-modal').forEach(modal => modal.remove());
    document.querySelectorAll('.download-modal').forEach(modal => modal.remove());

    closeSidebar();
    mainContent.style.display = 'none';
    header.style.display = 'none';
    nav.style.display = 'none';
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'block';

    updateSettingsText();
    loadIcons();
}

function goBack() {
    const aboutPage = document.getElementById('aboutPage');
    const settingsPage = document.getElementById('settingsPage');

    document.querySelectorAll('.civil-modal').forEach(modal => modal.remove());
    document.querySelectorAll('.download-modal').forEach(modal => modal.remove());

    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';

    if (pageHistory.length > 0) {
        const previousPage = pageHistory.pop();
        if (['home', 'prep', 'civil', 'favorites'].includes(previousPage)) {
            showPage(previousPage);
        } else {
            showPage('home');
        }
    } else {
        showPage('home');
    }
}

function toggleSearch() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    if (modal.style.display === 'flex') {
        input.focus();
        results.innerHTML = '';
    }
    loadIcons();
}

function toggleDarkMode() {
    try {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');

        localStorage.setItem('darkMode', isDarkMode);

        const customColor = localStorage.getItem('customColor') || '#1C6AE3';
        const appliedColor = isDarkMode ? lightenColor(customColor, 0.2) : customColor;
        document.body.style.setProperty('--primary-color', appliedColor);

        const darkModeBtn = document.querySelector('[title="Dark Mode"]');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '';
            const newIcon = document.createElement('i');
            newIcon.setAttribute('data-lucide', isDarkMode ? 'sun' : 'moon');
            darkModeBtn.appendChild(newIcon);

            setTimeout(() => {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                } else {
                    console.warn('Lucide not loaded during toggle');
                }
            }, 50);
        } else {
            console.error('Dark Mode button not found');
        }
    } catch (error) {
        console.error('Error toggling dark mode:', error);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
    updateSidebarText();
    loadIcons();
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    pageHistory = [];

    updateHeaderTitle();
    updateNavText();
    updateSidebarText();
    updateAboutText();
    updateSettingsText();
    updateFavoritesPage();

    showPage('home');
    closeSidebar();
    loadIcons();
}

function updateNavText() {
    const navItems = document.querySelectorAll('.nav-item');
    const navText = {
        home: { ar: 'الرئيسية', en: 'Home' },
        prep: { ar: 'إعدادي', en: 'Preparatory' },
        civil: { ar: 'مدني', en: 'Civil' },
        favorites: { ar: 'مفضلة', en: 'Favorites' }
    };

    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        item.querySelector('div').innerText = navText[page][currentLang];
    });
}

function updateSidebarText() {
    const sidebarItems = document.querySelectorAll('.sidebar-content ul li');
    const sidebarText = [
        { ar: 'الرئيسية', en: 'Home' },
        { ar: 'إعدادي', en: 'Preparatory' },
        { ar: 'مدني', en: 'Civil' },
        { ar: 'مفضلة', en: 'Favorites' },
        { ar: 'الإعدادات', en: 'Settings' },
        { ar: 'حول', en: 'About' }
    ];

    sidebarItems.forEach((item, index) => {
        item.innerText = sidebarText[index][currentLang];
    });

    document.querySelector('.sidebar-content h3').innerText = currentLang === 'ar' ? 'القائمة' : 'Menu';
}

function updateAboutText() {
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) {
        aboutPage.innerHTML = `
            <header class="about-header">
                <div class="about-header-title">${currentLang === 'ar' ? 'حول' : 'About'}</div>
                <button class="about-back-btn" onclick="goBack()">
                    <i data-lucide="${currentLang === 'ar' ? 'arrow-right' : 'arrow-left'}"></i> ${currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
            </header>
            <div class="about-container">
                <h1>👋 أهلاً بيك في المكان اللي معمول علشانك.</h1>
                <p>هنا مش بس هتلاقي كل ملفاتك ومقرراتك…<br>هتلاقي ناس زيك، بيسعوا، بيتعلموا، ورايحين لهدف واضح.</p>
                <p>إحنا مش بنقدم روابط… إحنا بنبني طريق.<br>بنشتغل مع بعض، نذاكر مع بعض، وندفع بعض لقدّام.</p>
                <p>ماتخليش يومك يعدي من غير خطوة لقدّام.<br>ولو تعبت… افتكر إنك مش لوحدك.<br>إحنا معاك في كل خطوة، لحد ما نوصل سوا.</p>
                <p>أنا واحد منكم، ودي كانت البداية.<br>الباقي عليكم… خلّي مجهودنا يوصل للكل، وخلّي النجاح عادة.</p>
                <p>المشروع دا مش جهد فرد… دا صوت دفعة كاملة حبت تسيب أثر، وتثبت إن لما بنتكاتف، نقدر نعمل حاجة تفضل شاهدة علينا.</p>
                <p>منّا… ولينا… ودايمًا فخورين ببعض</p>
                <h3>إحنا مش مجرد مجموعة<br>إحنا الجيل اللي هيغيّر شكل الهندسة المدنية.</h3>
                
                <div class="app-footer">
                    <p class="app-info">Civil Files - Version 1.0</p>
                    <div class="center-icon-container">
                        <img src="https://i.postimg.cc/BvvxrMhj/icon.png" alt="App Icon" class="app-icon">
                    </div>
                    <div class="new-content ${currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">
                        <p>${currentLang === 'ar' ? 'نسخة خفيفة وآمنة بتجمعلك أهم الروابط الهندسية في مكان واحد.' : 'A light, secure version that brings together the most important engineering links in one place.'}</p>
                        <p>${currentLang === 'ar' ? 'تطبيق Civil Files هيسهّل عليك توصل لكل حاجة مهمة كطالب هندسة مدنية.' : 'The Civil Files app will make it easy for you to access everything important as a civil engineering student.'}</p>
                        <p>${currentLang === 'ar' ? 'التطبيق آمن تمامًا – مفيهوش صلاحيات غريبة أو إعلانات مزعجة.🛡️' : 'The app is completely safe – no strange permissions or annoying ads.🛡️'}</p>
                    </div>
                    <p class="contact-title ${currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">${currentLang === 'ar' ? 'محتاج مساعدة؟ 📞' : 'Need help? 📞'}</p>
                    <div class="contact-links-new ${currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">
                        <a href="https://wa.me/201025442369?text=Hello%20Engineer%20Islam!" target="_blank">
                            <span>${currentLang === 'ar' ? 'اضغط هنا للتواصل عبر واتساب' : 'Click here to contact via WhatsApp'}</span>
                            <img src="https://i.postimg.cc/bv0K5YBy/Picsart-25-08-06-15-22-09-229.png" alt="Whatsapp Icon" class="social-icon">
                        </a>
                        <a href="https://t.me/EngEslamWael" target="_blank">
                            <span>${currentLang === 'ar' ? 'اضغط هنا للتواصل عبر التليجرام' : 'Click here to contact via Telegram'}</span>
                            <img src="https://i.postimg.cc/8c7XTTtr/Telegram.png" alt="Telegram Icon" class="social-icon">
                        </a>
                    </div>
                    <footer class="developer-credit">Developed by Engineer Eslam Wael — Level 3 Civil</footer>
                </div>
            </div>
        `;
        loadIcons();
    }
}

function showDownloadModal() {
    const modal = document.createElement('div');
    modal.className = 'civil-modal download-modal';
    modal.innerHTML = `
      <button class="close-modal" onclick="this.parentElement.remove()">✕</button>
      <h3>${currentLang === 'ar' ? 'تنزيل التطبيق' : 'Download App'}</h3>
      <div class="term-box" onclick="openLink('https://www.mediafire.com/file/ivia6yruf30g4j2/CIVIL+Files+1.0.apk/file', event)">
        <span>Android</span>
      </div>
      <div class="term-box" onclick="showToast('${currentLang === 'ar' ? 'قريبًا...' : 'Coming soon...'}')">
        <span>iPhone</span>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    loadIcons();
}

function updateSettingsText() {
    const settingsPage = document.getElementById('settingsPage');
    if (settingsPage) {
        settingsPage.innerHTML = `
            <header class="settings-header">
                <div class="settings-header-title">${currentLang === 'ar' ? 'الإعدادات' : 'Settings'}</div>
                <button class="settings-back-btn" onclick="goBack()">
                    <i data-lucide="${currentLang === 'ar' ? 'arrow-right' : 'arrow-left'}"></i>
                    ${currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
            </header>
            <div class="settings-container">
                <div class="settings-grid">
                    <button class="btn" onclick="toggleLanguage()">
                        <i data-lucide="globe"></i>
                        <span>${currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language'}</span>
                    </button>
                    <button class="btn" onclick="openColorPicker()">
                        <i data-lucide="palette"></i>
                        <span>${currentLang === 'ar' ? 'اختيار لون جديد' : 'Choose New Color'}</span>
                    </button>
                    <a class="btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdmktV9yW6t9fx93CLJMYxvgy1l6J5v-RNKXtQjPXQeKG7PfA/viewform?usp=sharing" target="_blank">
                        <i data-lucide="star"></i>
                        <span>${currentLang === 'ar' ? 'تقييم الموقع' : 'Rate the Website'}</span>
                    </a>
                    <button class="btn" onclick="showDownloadModal()">
                        <i data-lucide="download"></i>
                        <span>${currentLang === 'ar' ? 'تنزيل التطبيق' : 'Download App'}</span>
                    </button>
                    <button class="btn" onclick="shareWebsite()">
                        <i data-lucide="share-2"></i>
                        <span>${currentLang === 'ar' ? 'مشاركة الموقع' : 'Share Website'}</span>
                    </button>
                    <button class="btn" onclick="resetSettings()">
                        <i data-lucide="rotate-ccw"></i>
                        <span>${currentLang === 'ar' ? 'إعادة الضبط' : 'Reset Settings'}</span>
                    </button>
                </div>
            </div>
        `;
        loadIcons();
    }
}

function updateHeaderTitle() {
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
        headerTitle.innerHTML = `
      <img src="https://i.postimg.cc/Jhr0BFT4/Picsart-25-07-20-16-04-51-889.png" class="icon" alt="Logo" />
      Civil Files
    `;
    }
}

function shareWebsite() {
    const url = 'https://eslamwael73.github.io/CIVIL_links-/';
    if (navigator.share) {
        navigator.share({ url })
            .then(() => console.log('تمت المشاركة بنجاح'))
            .catch((error) => console.log('خطأ في المشاركة:', error));
    } else {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert(currentLang === 'ar' ? 'تم نسخ رابط الموقع إلى الحافظة!' : 'Website link copied to clipboard!');
            })
            .catch((error) => {
                alert(currentLang === 'ar' ? 'المشاركة غير مدعومة. انسخ الرابط يدويًا: ' + url : 'Sharing not supported. Copy the link manually: ' + url);
            });
    }
}

document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value;
    const results = searchContent(query);
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = results.length === 0
        ? `<p>${currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>`
        : results.map(result => `
        <div class="subject-box">
          <a href="${result.link}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${result.link}', event); console.log('Opening search link:', '${result.link}')">${result.name}</a>
          <button class="favorite-btn ${favorites.includes(`${result.section}:${result.id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${result.section}', '${result.id}')"><i data-lucide="heart"></i></button>
        </div>
      `).join('');
    loadIcons();
});

function applyCustomColor(color) {
    try {
        document.body.classList.remove('custom-theme');
        document.body.classList.add('custom-theme');
        const isDarkMode = document.body.classList.contains('dark-mode');
        const appliedColor = isDarkMode ? lightenColor(color, 0.2) : color;
        document.body.style.setProperty('--custom-color', color);
        document.body.style.setProperty('--custom-hover', darkenColor(color, 0.8));
        document.body.style.setProperty('--primary-color', appliedColor);
        localStorage.setItem('theme', 'custom');
        localStorage.setItem('customColor', color);
        debouncedLoadIcons();
    } catch (error) {
        console.error('Error applying custom color:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء تطبيق اللون.' : 'An error occurred while applying the color.');
    }
}

function darkenColor(hex, factor) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `#${Math.floor(r * factor).toString(16).padStart(2, '0')}${Math.floor(g * factor).toString(16).padStart(2, '0')}${Math.floor(b * factor).toString(16).padStart(2, '0')}`;
}

function openColorPicker() {
    try {
        const supportsColorInput = 'HTMLInputElement' in window && 'type' in document.createElement('input');
        if (!supportsColorInput) {
            alert(currentLang === 'ar' ? 'اختيار الألوان غير مدعوم في هذا المتصفح. جرب متصفح آخر.' : 'Color picker is not supported in this browser. Try another browser.');
            return;
        }

        const input = document.createElement('input');
        input.type = 'color';
        input.value = localStorage.getItem('customColor') || '#1C6AE3';
        input.style.position = 'absolute';
        input.style.opacity = '0';
        input.style.width = '0';
        input.style.height = '0';
        input.style.border = 'none';
        input.style.padding = '0';
        input.style.margin = '0';
        input.style.pointerEvents = 'none';

        input.onchange = function () {
            try {
                applyCustomColor(this.value);
            } catch (error) {
                console.error('Error applying custom color:', error);
                alert(currentLang === 'ar' ? 'حدث خطأ أثناء تطبيق اللون.' : 'An error occurred while applying the color.');
            }
            this.remove();
        };

        input.oncancel = function () {
            this.remove();
        };

        document.body.appendChild(input);
        setTimeout(() => {
            input.click();
        }, 0);
    } catch (error) {
        console.error('Error opening color picker:', error);
        alert(currentLang === 'ar' ? 'حدث خطأ أثناء فتح أداة اختيار اللون.' : 'An error occurred while opening the color picker.');
    }
}

function lightenColor(hex, factor) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `#${Math.min(Math.floor(r + (255 - r) * factor), 255).toString(16).padStart(2, '0')}${Math.min(Math.floor(g + (255 - g) * factor), 255).toString(16).padStart(2, '0')}${Math.min(Math.floor(b + (255 - b) * factor), 255).toString(16).padStart(2, '0')}`;
}

function resetSettings() {
    try {
        document.body.classList.remove('dark-mode', 'custom-theme', 'custom-background');
        document.body.classList.add('custom-theme');
        const defaultColor = '#1C6AE3';
        document.body.style.setProperty('--custom-color', defaultColor);
        document.body.style.setProperty('--custom-hover', darkenColor(defaultColor, 0.8));
        document.body.style.setProperty('--primary-color', defaultColor);
        document.body.style.backgroundImage = '';
        localStorage.setItem('theme', 'custom');
        localStorage.setItem('customColor', defaultColor);
        localStorage.removeItem('background');
        localStorage.removeItem('darkMode');
        const icon = document.querySelector('[title="Dark Mode"] i');
        if (icon) {
            icon.setAttribute('data-lucide', 'moon');
        }
        debouncedLoadIcons();
    } catch (error) {
        console.error('Error resetting settings:', error);
    }
}

function openLink(url, event) {
    if (event && event.target.closest('.favorite-btn')) {
        event.stopImmediatePropagation();
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    if (now - lastClickTime < 500) return;
    lastClickTime = now;

    if (isLinkOpening) return;
    isLinkOpening = true;

    const clickedElement = event.currentTarget;
    clickedElement.parentElement.style.transform = 'scale(0.95)';

    setTimeout(() => {
        clickedElement.parentElement.style.transform = '';
    }, 200);

    window.open(url, '_blank');
    isLinkOpening = false;
}

function showToast(message) {
    Toastify({
        text: message,
        duration: 5000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#ffffff",
        style: {
            fontFamily: "'Cairo', Arial, sans-serif",
            fontSize: "16px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            color: "#000000"
        }
    }).showToast();
}

function checkIslamicDate() {
    const todayHijri = moment().format('iYYYY/iM/iD');
    const [hijriYear, hijriMonth, hijriDay] = todayHijri.split('/').map(Number);

    const storageKey = `toastShown-${moment().format('YYYY-MM-DD')}`;
    if (localStorage.getItem(storageKey)) {
        return;
    }

    let message = "";

    if (hijriMonth === 9 && hijriDay >= 1 && hijriDay <= 3) {
        message = "رمضان كريم 🌙";
    }
    else if (hijriMonth === 10 && hijriDay >= 1 && hijriDay <= 3) {
        message = "عيد فطر سعيد! 🎉";
    }
    else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        message = "عيد أضحي سعيد! 🎉";
    }

    if (message !== "") {
        showToast(message);
        localStorage.setItem(storageKey, "shown");
    }
}

function showDailySalawatToast() {
    Toastify({
        text: "هل صليت على النبي اليوم؟ ﷺ",
        duration: 5000,
        gravity: "bottom",
        position: "center",
        close: true,
        backgroundColor: "#ffffff",
        style: {
            fontFamily: "'Cairo', Arial, sans-serif",
            fontSize: "16px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            color: "#000000",
            marginBottom: "60px"
        }
    }).showToast();
}

function closeModal() {
    const modal = document.getElementById("welcomeModal");
    if (modal) {
        modal.classList.add("hidden");
        localStorage.setItem("welcomeShown", "true");
        setTimeout(() => {
            modal.style.display = "none";
            document.getElementById("main-content").style.display = "block";
            document.getElementById("header").style.display = "flex";
            document.getElementById("nav").style.display = "flex";
            showDailySalawatToast();
        }, 300);
    }
}
// طلب الإذن للإشعارات
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // هنا هتسجل الـ token مع Firebase
      }
    });
  }
}

// نادي عليها لما يتحمل الـ DOM
document.addEventListener("DOMContentLoaded", function() {
  requestNotificationPermission();
});
// تهيئة الصفحة عند التحميل
document.addEventListener("DOMContentLoaded", async function () {
    try {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

        const savedTheme = localStorage.getItem('theme') || 'custom';
        const customColor = localStorage.getItem('customColor') || '#1C6AE3';
        document.body.classList.add('custom-theme');
        document.body.style.setProperty('--custom-color', customColor);
        document.body.style.setProperty('--custom-hover', darkenColor(customColor, 0.8));
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        const appliedColor = isDarkMode ? lightenColor(customColor, 0.2) : customColor;
        document.body.style.setProperty('--primary-color', appliedColor);

        document.getElementById("main-content").style.display = "none";
        document.getElementById("settingsPage").style.display = "none";
        document.getElementById("aboutPage").style.display = "none";
        document.getElementById("header").style.display = "none";
        document.getElementById("nav").style.display = "none";

        const modal = document.getElementById("welcomeModal");
        if (modal) {
            if (!localStorage.getItem("welcomeShown")) {
                modal.classList.add("active");
                modal.style.display = "flex";
            } else {
                modal.style.display = "none";
                document.getElementById("main-content").style.display = "block";
                document.getElementById("header").style.display = "flex";
                document.getElementById("nav").style.display = "flex";
                showDailySalawatToast();
            }
        } else {
            document.getElementById("main-content").style.display = "block";
            document.getElementById("header").style.display = "flex";
            document.getElementById("nav").style.display = "flex";
            showDailySalawatToast();
        }

        const darkModeIcon = document.querySelector('[title="Dark Mode"] i');
        if (darkModeIcon) {
            darkModeIcon.setAttribute('data-lucide', isDarkMode ? 'sun' : 'moon');
            setTimeout(() => {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            }, 50);
        }

        showPage('home');
        updateFavoritesPage();
        loadIcons();
        checkIslamicDate();

    } catch (error) {
        console.error('Error during page load:', error);
    }
});