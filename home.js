// home.js
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
    }
};

function showHomePage() {
    console.log('Attempting to show Home Page'); // للتصحيح
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
        if (currentPage && currentPage !== 'home') {
            window.pageHistory = window.pageHistory.filter(p => p !== 'home');
            window.pageHistory.push('home');
        }
    }
    
    closeSidebar();
    aboutPage.style.display = 'none';
    settingsPage.style.display = 'none';
    header.style.display = 'flex';
    nav.style.display = 'flex';
    mainContent.style.display = 'block';
    mainContent.innerHTML = pages.home[window.currentLang];
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === 'home') {
            item.classList.add('active');
        }
    });
    updateNavText();
    loadIcons();
    console.log('Home Page rendered successfully');
}
window.loadHomePage = loadHomePage;