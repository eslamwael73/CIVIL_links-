// prep.js
const prepData = {
    physics: { link: "https://drive.google.com/drive/folders/1xK_yAObA4zCJo8b85ajqqS4LHpvoQBVP", name: { ar: "فيزياء 2", en: "Physics 2" } },
    math: { link: "https://drive.google.com/drive/folders/1xH4POYHcCXOCQ0HXPiSrKG7cNuMP5YY9", name: { ar: "رياضيات 2", en: "Mathematics 2" } },
    mechanics: { link: "https://drive.google.com/drive/folders/1xG60KxFXGWyZtZ2dKKJ48-8YPMp3ayCS", name: { ar: "ميكانيكا 2", en: "Mechanics 2" } },
    drawing: { link: "https://drive.google.com/drive/folders/1xMC8HtgBu0N800rJW-OYQjdWjbPBCUuf", name: { ar: "رسم 2", en: "Drawing 2" } },
    production: { link: "https://drive.google.com/drive/folders/1YumNKI_SbFXszAXOJp3hAD1EnIHpe5-j", name: { ar: "تكنولوجيا الإنتاج وتاريخ الهندسة", en: "Production Technology and History of Engineering" } },
    programming: { link: "https://drive.google.com/drive/folders/1YtzBbF6uGmqB_NVoeWTRN682kJ6L7RYx", name: { ar: "برمجة", en: "Programming" } }
};

const pages = {
    prep: {
        ar: `
        <div class="prep-container">
          <h1 class="prep-title">المرحلة الإعدادية ٢٠٢٣ / ٢٠٢٤</h1>
          <p class="prep-subtitle">بنعتذر ليس لدينا غير مواد الترم الثاني فقط</p>
          <div class="subjects-grid">
            ${Object.entries(prepData).map(([id, data]) => `
              <div class="subject-box" onclick="event.stopPropagation()">
                <a href="${data.link}" style="color: white; text-decoration: none;" onclick="event.stopPropagation(); openDriveLink('${data.link}', event); console.log('Opening prep link:', '${data.link}')">${data.name.ar}</a>
                <button class="favorite-btn ${window.favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')"><i data-lucide="heart"></i></button>
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
                <button class="favorite-btn ${window.favorites.includes(`prep:${id}`) ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('prep', '${id}')"><i data-lucide="heart"></i></button>
              </div>
            `).join('')}
          </div>
        </div>
      `
    }
};

function showPrepPage() {
    console.log('Attempting to show Prep Page'); // للتصحيح
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
        if (currentPage && currentPage !== 'prep') {
            window.pageHistory = window.pageHistory.filter(p => p !== 'prep');
            window.pageHistory.push('prep');
        }
    }
    
    closeSidebar();
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';
    header.style.display = 'flex';
    nav.style.display = 'flex';
    mainContent.style.display = 'block';
    mainContent.innerHTML = pages.prep[window.currentLang];
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === 'prep') {
            item.classList.add('active');
        }
    });
    updateNavText();
    loadIcons();
    updateAllHeartIcons();
    console.log('Prep Page rendered successfully');
}

// جعل البيانات متاحة عالميًا
window.prepData = prepData;