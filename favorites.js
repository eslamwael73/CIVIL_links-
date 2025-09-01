// favorites.js
const pages = {
    favorites: {
        ar: `
        <div class="prep-container">
          <h1 class="prep-title">المفضلة</h1>
          <p class="prep-subtitle">المواد والروابط المحفوظة</p>
          <div class="subjects-grid" id="favorites-grid"></div>
        </div>
      `,
        en: `
        <div class="prep-container">
          <h1 class="prep-title">Favorites</h1>
          <p class="prep-subtitle">Saved materials and links</p>
          <div class="subjects-grid" id="favorites-grid"></div>
        </div>
      `
    }
};

function getItemData(section, id) {
    if (section === 'prep') return window.prepData[id];
    if (section === 'civil') {
        const [year, term] = id.split('.');
        return window.civilData[year]?.[term];
    }
    return null;
}

function renderFavorites() {
    console.log('Rendering Favorites'); // للتصحيح
    const container = document.getElementById('favorites-grid');
    if (!container) {
        console.error('favorites-grid element not found');
        return;
    }
    container.innerHTML = window.favorites.length === 0
        ? `<p>${window.currentLang === 'ar' ? 'لا توجد مفضلات' : 'No favorites'}</p>`
        : window.favorites.map(fav => {
            const [section, id] = fav.split(':');
            const data = getItemData(section, id);
            if (!data) return '';
            return `
              <div class="subject-box">
                <a href="${data.link || '#'}" style="color:white;text-decoration:none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening favorite link:', '${data.link}')">${data.name[window.currentLang]}</a>
                <button class="favorite-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${section}', '${id}')"><i data-lucide="heart"></i></button>
              </div>
            `;
        }).join('');
    loadIcons();
}

function updateFavoritesPage() {
    console.log('Attempting to update Favorites Page'); // للتصحيح
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
        if (currentPage && currentPage !== 'favorites') {
            window.pageHistory = window.pageHistory.filter(p => p !== 'favorites');
            window.pageHistory.push('favorites');
        }
    }
    
    closeSidebar();
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';
    header.style.display = 'flex';
    nav.style.display = 'flex';
    mainContent.style.display = 'block';
    mainContent.innerHTML = pages.favorites[window.currentLang];
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === 'favorites') {
            item.classList.add('active');
        }
    });
    updateNavText();
    renderFavorites();
    loadIcons();
    console.log('Favorites Page rendered successfully');
}

function isFavoritesPageActive() {
    const activeNavItem = document.querySelector('.nav-item.active');
    return activeNavItem && activeNavItem.dataset.page === 'favorites';
}

function toggleFavorite(section, item) {
    console.log('Toggling Favorite:', section, item); // للتصحيح
    const favoriteId = `${section}:${item}`;
    const index = window.favorites.indexOf(favoriteId);
    const isAdding = index === -1;
    if (isAdding) {
        window.favorites.push(favoriteId);
        console.log(`Added to favorites: ${favoriteId}`);
        if (section === 'civil' && item.includes('.all')) {
            const year = item.split('.')[0];
            ['term1', 'term2'].forEach(term => {
                const termId = `civil:${year}.${term}`;
                if (!window.favorites.includes(termId)) window.favorites.push(termId);
                console.log(`Added to favorites: ${termId}`);
            });
        }
    } else {
        window.favorites.splice(index, 1);
        console.log(`Removed from favorites: ${favoriteId}`);
        if (section === 'civil' && item.includes('.all')) {
            const year = item.split('.')[0];
            window.favorites = window.favorites.filter(fav => !fav.startsWith(`civil:${year}.term`));
            console.log(`Removed terms for ${year} from favorites`);
        }
    }
    localStorage.setItem('favorites', JSON.stringify(window.favorites));
    updateAllHeartIcons();
    updateFavoritesPage();
}

function updateAllHeartIcons() {
    console.log('Updating Heart Icons'); // للتصحيح
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const onclickContent = btn.getAttribute('onclick');
        if (onclickContent) {
            const match = onclickContent.match(/toggleFavorite\('(.+)', '(.+)'\)/);
            if (match) {
                const section = match[1];
                const item = match[2];
                const favoriteId = `${section}:${item}`;
                btn.classList.toggle('favorited', window.favorites.includes(favoriteId));
                btn.innerHTML = '<i data-lucide="heart"></i>';
            }
        }
    });
    loadIcons();
}

function searchContent(query) {
    console.log('Searching for:', query); // للتصحيح
    query = query.toLowerCase().trim();
    const results = [];
    if (query === '') return results;
    if (!window.prepData || !window.civilData) {
        console.error('prepData or civilData not available');
        return results;
    }
    Object.entries(window.prepData).forEach(([id, data]) => {
        if (data.name[window.currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'prep', id, name: data.name[window.currentLang], link: data.link });
        }
    });
    Object.entries(window.civilData).forEach(([year, data]) => {
        if (data.all.name[window.currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.all`, name: data.all.name[window.currentLang], link: '#' });
        }
        if (data.term1.name[window.currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.term1`, name: data.term1.name[window.currentLang], link: data.term1.link });
        }
        if (data.term2.name[window.currentLang].toLowerCase().includes(query)) {
            results.push({ section: 'civil', id: `${year}.term2`, name: data.term2.name[window.currentLang], link: data.term2.link });
        }
    });
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = results.length === 0
        ? `<p>${window.currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>`
        : results.map(result => `
            <div class="search-result" onclick="openDriveLink('${result.link}', event)">
                ${result.name}
            </div>
        `).join('');
    loadIcons();
    return results;
}