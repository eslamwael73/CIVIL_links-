// settings.js
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

function updateSettingsText() {
    const settingsPage = document.getElementById('settingsPage');
    if (settingsPage) {
        settingsPage.innerHTML = `
            <header class="settings-header">
                <div class="settings-header-title">${window.currentLang === 'ar' ? 'الإعدادات' : 'Settings'}</div>
                <button class="settings-back-btn" onclick="goBack()">
                    <i data-lucide="${window.currentLang === 'ar' ? 'arrow-right' : 'arrow-left'}"></i>
                    ${window.currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
            </header>
            <div class="settings-container">
                <div class="settings-grid">
                    <button class="btn" onclick="toggleLanguage()">
                        <i data-lucide="globe"></i>
                        <span>${window.currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language'}</span>
                    </button>
                    <button class="btn" onclick="openColorPicker()">
                        <i data-lucide="palette"></i>
                        <span>${window.currentLang === 'ar' ? 'اختيار لون جديد' : 'Choose New Color'}</span>
                    </button>
                    <a class="btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdmktV9yW6t9fx93CLJMYxvgy1l6J5v-RNKXtQjPXQeKG7PfA/viewform?usp=sharing" target="_blank">
                        <i data-lucide="star"></i>
                        <span>${window.currentLang === 'ar' ? 'تقييم الموقع' : 'Rate the Website'}</span>
                    </a>
                    <button class="btn" onclick="showDownloadModal()">
                        <i data-lucide="download"></i>
                        <span>${window.currentLang === 'ar' ? 'تنزيل التطبيق' : 'Download App'}</span>
                    </button>
                    <button class="btn" onclick="shareWebsite()">
                        <i data-lucide="share-2"></i>
                        <span>${window.currentLang === 'ar' ? 'مشاركة الموقع' : 'Share Website'}</span>
                    </button>
                    <button class="btn" onclick="resetSettings()">
                        <i data-lucide="rotate-ccw"></i>
                        <span>${window.currentLang === 'ar' ? 'إعادة الضبط' : 'Reset Settings'}</span>
                    </button>
                </div>
            </div>
        `;
        loadIcons();
    }
}

function toggleLanguage() {
    window.currentLang = window.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', window.currentLang);
    document.documentElement.lang = window.currentLang;
    document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
    window.pageHistory = [];
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
                alert(window.currentLang === 'ar' ? 'تم نسخ رابط الموقع إلى الحافظة!' : 'Website link copied to clipboard!');
            })
            .catch((error) => {
                alert(window.currentLang === 'ar' ? 'المشاركة غير مدعومة. انسخ الرابط يدويًا: ' + url : 'Sharing not supported. Copy the link manually: ' + url);
            });
    }
}

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
        alert(window.currentLang === 'ar' ? 'حدث خطأ أثناء تطبيق اللون.' : 'An error occurred while applying the color.');
    }
}

function openColorPicker() {
    try {
        const supportsColorInput = 'HTMLInputElement' in window && 'type' in document.createElement('input');
        if (!supportsColorInput) {
            alert(window.currentLang === 'ar' ? 'اختيار الألوان غير مدعوم في هذا المتصفح. جرب متصفح آخر.' : 'Color picker is not supported in this browser. Try another browser.');
            return;
        }
        const input = document.createElement('input');
        input.type = 'color';
        input.value = localStorage.getItem('customColor') || '#8B0000';
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
                alert(window.currentLang === 'ar' ? 'حدث خطأ أثناء تطبيق اللون.' : 'An error occurred while applying the color.');
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
        alert(window.currentLang === 'ar' ? 'حدث خطأ أثناء فتح أداة اختيار اللون.' : 'An error occurred while opening the color picker.');
    }
}

function resetSettings() {
    try {
        document.body.classList.remove('dark-mode', 'custom-theme', 'custom-background');
        document.body.classList.add('custom-theme');
        const defaultColor = '#8B0000';
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

function showDownloadModal() {
    const modal = document.createElement('div');
    modal.className = 'civil-modal download-modal';
    modal.innerHTML = `
      <button class="close-modal" onclick="this.parentElement.remove()">✕</button>
      <h3>${window.currentLang === 'ar' ? 'تنزيل التطبيق' : 'Download App'}</h3>
      <div class="term-box" onclick="openLink('https://www.mediafire.com/file/ivia6yruf30g4j2/CIVIL+Files+1.0.apk/file', event)">
        <span>Android</span>
      </div>
      <div class="term-box" onclick="showToast('${window.currentLang === 'ar' ? 'قريبًا...' : 'Coming soon...'}')">
        <span>iPhone</span>
      </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    loadIcons();
}