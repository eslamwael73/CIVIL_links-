// about.js
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

function updateAboutText() {
    const aboutPage = document.getElementById('aboutPage');
    if (aboutPage) {
        aboutPage.innerHTML = `
            <header class="about-header">
                <div class="about-header-title">${window.currentLang === 'ar' ? 'حول' : 'About'}</div>
                <button class="about-back-btn" onclick="goBack()">
                    <i data-lucide="${window.currentLang === 'ar' ? 'arrow-right' : 'arrow-left'}"></i> ${window.currentLang === 'ar' ? 'رجوع' : 'Back'}
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
                    <div class="new-content ${window.currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">
                        <p>${window.currentLang === 'ar' ? 'نسخة خفيفة وآمنة بتجمعلك أهم الروابط الهندسية في مكان واحد.' : 'A light, secure version that brings together the most important engineering links in one place.'}</p>
                        <p>${window.currentLang === 'ar' ? 'تطبيق Civil Files هيسهّل عليك توصل لكل حاجة مهمة كطالب هندسة مدنية.' : 'The Civil Files app will make it easy for you to access everything important as a civil engineering student.'}</p>
                        <p>${window.currentLang === 'ar' ? 'التطبيق آمن تمامًا – مفيهوش صلاحيات غريبة أو إعلانات مزعجة.🛡️' : 'The app is completely safe – no strange permissions or annoying ads.🛡️'}</p>
                    </div>
                    <p class="contact-title ${window.currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">${window.currentLang === 'ar' ? 'محتاج مساعدة؟ 📞' : 'Need help? 📞'}</p>
                    <div class="contact-links-new ${window.currentLang === 'ar' ? 'rtl-text' : 'ltr-text'}">
                        <a href="https://wa.me/201025442369?text=Hello%20Engineer%20Islam!" target="_blank">
                            <span>${window.currentLang === 'ar' ? 'اضغط هنا للتواصل عبر واتساب' : 'Click here to contact via WhatsApp'}</span>
                            <img src="https://i.postimg.cc/bv0K5YBy/Picsart-25-08-06-15-22-09-229.png" alt="Whatsapp Icon" class="social-icon">
                        </a>
                        <a href="https://t.me/EngEslamWael" target="_blank">
                            <span>${window.currentLang === 'ar' ? 'اضغط هنا للتواصل عبر التليجرام' : 'Click here to contact via Telegram'}</span>
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