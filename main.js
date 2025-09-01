// main.js
window.pageHistory = [];
window.currentLang = localStorage.getItem('language') || 'ar';
window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
window.lastClickTime = 0;
window.hasOpenedApp = false;
window.isLinkOpening = false;

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
        const customColor = localStorage.getItem('customColor') || '#8B0000';
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
                }
            }, 50);
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
        item.querySelector('div').innerText = navText[page][window.currentLang];
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
        item.innerText = sidebarText[index][window.currentLang];
    });
    document.querySelector('.sidebar-content h3').innerText = window.currentLang === 'ar' ? 'القائمة' : 'Menu';
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
    if (localStorage.getItem(storageKey)) return;
    let message = "";
    if (hijriMonth === 9 && hijriDay >= 1 && hijriDay <= 3) {
        message = "رمضان كريم 🌙";
    } else if (hijriMonth === 10 && hijriDay >= 1 && hijriDay <= 3) {
        message = "عيد فطر سعيد! 🎉";
    } else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        message = "عيد أضحى سعيد! 🎉";
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

function openDriveLink(url, event) {
    if (event.target.closest('.favorite-btn')) {
        event.stopImmediatePropagation();
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - window.lastClickTime < 500) return;
    window.lastClickTime = now;
    if (window.isLinkOpening) return;
    window.isLinkOpening = true;
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
        window.hasOpenedApp = true;
        window.isLinkOpening = false;
        window.removeEventListener('blur', blurHandler);
    };
    window.addEventListener('blur', blurHandler);
    setTimeout(() => {
        if (!window.hasOpenedApp) {
            window.open(url, '_blank');
        }
        document.body.removeChild(iframe);
        window.isLinkOpening = false;
    }, 500);
}

function openLink(url, event) {
    if (event && event.target.closest('.favorite-btn')) {
        event.stopImmediatePropagation();
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    const now = Date.now();
    if (now - window.lastClickTime < 500) return;
    window.lastClickTime = now;
    if (window.isLinkOpening) return;
    window.isLinkOpening = true;
    const clickedElement = event.currentTarget;
    clickedElement.parentElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickedElement.parentElement.style.transform = '';
    }, 200);
    window.open(url, '_blank');
    window.isLinkOpening = false;
}

function lightenColor(hex, factor) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `#${Math.min(Math.floor(r + (255 - r) * factor), 255).toString(16).padStart(2, '0')}${Math.min(Math.floor(g + (255 - g) * factor), 255).toString(16).padStart(2, '0')}${Math.min(Math.floor(b + (255 - b) * factor), 255).toString(16).padStart(2, '0')}`;
}

function darkenColor(hex, factor) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `#${Math.floor(r * factor).toString(16).padStart(2, '0')}${Math.floor(g * factor).toString(16).padStart(2, '0')}${Math.floor(b * factor).toString(16).padStart(2, '0')}`;
}

function goBack() {
    console.log('Going Back, pageHistory:', window.pageHistory); // للتصحيح
    if (window.pageHistory.length > 0) {
        const lastPage = window.pageHistory.pop();
        if (lastPage === 'home') showHomePage();
        else if (lastPage === 'prep') showPrepPage();
        else if (lastPage === 'civil') showCivilPage();
        else if (lastPage === 'favorites') updateFavoritesPage();
    } else {
        showHomePage();
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    document.documentElement.lang = window.currentLang;
    document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
    const savedTheme = localStorage.getItem('theme') || 'custom';
    const customColor = localStorage.getItem('customColor') || '#8B0000';
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
    showHomePage();
    updateFavoritesPage();
    loadIcons();
    checkIslamicDate();
});