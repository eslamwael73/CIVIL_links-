// prep.js - ملف قسم المرحلة الإعدادية

// بيانات المواد الإعدادية
const prepData = {
    physics: { 
        link: "https://drive.google.com/drive/folders/1xK_yAObA4zCJo8b85ajqqS4LHpvoQBVP", 
        name: { ar: "فيزياء 2", en: "Physics 2" } 
    },
    math: { 
        link: "https://drive.google.com/drive/folders/1xH4POYHcCXOCQ0HXPiSrKG7cNuMP5YY9", 
        name: { ar: "رياضيات 2", en: "Mathematics 2" } 
    },
    mechanics: { 
        link: "https://drive.google.com/drive/folders/1xG60KxFXGWyZtZ2dKKJ48-8YPMp3ayCS", 
        name: { ar: "ميكانيكا 2", en: "Mechanics 2" } 
    },
    drawing: { 
        link: "https://drive.google.com/drive/folders/1xMC8HtgBu0N800rJW-OYQjdWjbPBCUuf", 
        name: { ar: "رسم 2", en: "Drawing 2" } 
    },
    production: { 
        link: "https://drive.google.com/drive/folders/1YumNKI_SbFXszAXOJp3hAD1EnIHpe5-j", 
        name: { ar: "تكنولوجيا الإنتاج وتاريخ الهندسة", en: "Production Technology and History of Engineering" } 
    },
    programming: { 
        link: "https://drive.google.com/drive/folders/1YtzBbF6uGmqB_NVoeWTRN682kJ6L7RYx", 
        name: { ar: "برمجة", en: "Programming" } 
    }
};

// دالة فتح رابط Google Drive مع محاولة فتح التطبيق أولاً
function openDriveLink(url, event) {
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
    clickedElement.style.transform = 'scale(0.95)';

    // محاولة فتح تطبيق Google Drive أولاً
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

    // في حالة عدم وجود التطبيق، فتح في المتصفح
    setTimeout(() => {
        if (!hasOpenedApp) {
            window.open(url, '_blank');
        }
        document.body.removeChild(iframe);
        isLinkOpening = false;
    }, 1000);
}

// تحديث قائمة المفضلات للمواد الإعدادية
function updatePrepFavorites() {
    const heartButtons = document.querySelectorAll('.prep-container .favorite-btn');
    heartButtons.forEach(btn => {
        const onclickContent = btn.getAttribute('onclick');
        if (onclickContent) {
            const match = onclickContent.match(/toggleFavorite\('prep', '(.+)'\)/);
            if (match) {
                const itemId = match[1];
                const favoriteId = `prep:${itemId}`;
                btn.classList.toggle('favorited', favorites.includes(favoriteId));
                btn.innerHTML = '<i data-lucide="heart"></i>';
            }
        }
    });
    if (typeof loadIcons === 'function') {
        loadIcons();
    }
}

// تحميل صفحة الإعدادي
function loadPrepPage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const content = {
        ar: `
            <div class="prep-container">
                <h1 class="prep-title">المرحلة الإعدادية ٢٠٢٣ / ٢٠٢٤</h1>
                <p class="prep-subtitle">بنعتذر ليس لدينا غير مواد الترم الثاني فقط</p>
                <div class="subjects-grid">
                    ${Object.entries(prepData).map(([id, data]) => `
                        <div class="subject-box" onclick="event.stopPropagation()">
                            <a href="${data.link}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening prep link:', '${data.link}')">${data.name.ar}</a>
                            <button class="favorite-btn ${favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')">
                                <i data-lucide="heart"></i>
                            </button>
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
                            <button class="favorite-btn ${favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')">
                                <i data-lucide="heart"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    };

    mainContent.innerHTML = content[currentLang];
    
    // تحديث المفضلات وتحميل الأيقونات
    setTimeout(() => {
        updatePrepFavorites();
        if (typeof loadIcons === 'function') {
            loadIcons();
        }
    }, 100);
}

// إضافة دالة البحث في مواد الإعدادي
function searchPrepContent(query) {
    const results = [];
    if (!query || query.trim() === '') return results;
    
    query = query.toLowerCase().trim();
    
    Object.entries(prepData).forEach(([id, data]) => {
        if (data.name[currentLang].toLowerCase().includes(query)) {
            results.push({
                section: 'prep',
                id: id,
                name: data.name[currentLang],
                link: data.link
            });
        }
    });
    
    return results;
}

// تصدير الدوال والبيانات للاستخدام في الملفات الأخرى
window.loadPrepPage = loadPrepPage;
window.prepData = prepData;
window.searchPrepContent = searchPrepContent;
window.openDriveLink = openDriveLink;