/**
 * Effetto Neve & Tema Natalizio Interattivo - Basket 2000 Turate
 */
(function() {
    'use strict';

    // Inizializza solo una volta
    if (window.__b2kXmasInitialized) return;
    window.__b2kXmasInitialized = true;

    // Crea il Canvas per la neve
    const canvas = document.createElement('canvas');
    canvas.id = 'xmas-snow-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Controlla preferenza salvata
    let isSnowEnabled = localStorage.getItem('b2k_snow_enabled') !== 'false';

    // Pulsante ON/OFF per la neve
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'xmas-toggle-btn' + (isSnowEnabled ? '' : ' is-disabled');
    toggleBtn.type = 'button';
    toggleBtn.title = isSnowEnabled ? 'Disattiva neve natalizia' : 'Attiva neve natalizia';
    toggleBtn.setAttribute('aria-label', toggleBtn.title);
    toggleBtn.innerHTML = '❄️';
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', function() {
        isSnowEnabled = !isSnowEnabled;
        localStorage.setItem('b2k_snow_enabled', isSnowEnabled ? 'true' : 'false');
        if (isSnowEnabled) {
            toggleBtn.classList.remove('is-disabled');
            toggleBtn.title = 'Disattiva neve natalizia';
            canvas.style.display = 'block';
            animId = requestAnimationFrame(render);
        } else {
            toggleBtn.classList.add('is-disabled');
            toggleBtn.title = 'Attiva neve natalizia';
            canvas.style.display = 'none';
            if (animId) cancelAnimationFrame(animId);
        }
    });

    // Dimensionamento responsivo
    function handleResize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    // Particelle di neve
    const isMobile = window.innerWidth < 768;
    const flakeCount = isMobile ? 38 : 68; // Leggero e performante
    const flakes = [];

    for (let i = 0; i < flakeCount; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.8 + 1,
            density: Math.random() * flakeCount,
            speedY: Math.random() * 1.2 + 0.6,
            speedX: Math.random() * 0.8 - 0.4,
            opacity: Math.random() * 0.6 + 0.35,
            swing: Math.random() * 2 * Math.PI
        });
    }

    let animId = null;

    function render() {
        if (!isSnowEnabled) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, true);
            ctx.fill();

            // Movimento ondulatorio e discesa
            f.swing += 0.015;
            f.y += f.speedY;
            f.x += Math.sin(f.swing) * 0.6 + f.speedX;

            // Riposizionamento quando esce dallo schermo
            if (f.y > height + 5) {
                f.y = -5;
                f.x = Math.random() * width;
            }
            if (f.x > width + 5) {
                f.x = -5;
            } else if (f.x < -5) {
                f.x = width + 5;
            }
        }

        animId = requestAnimationFrame(render);
    }

    if (isSnowEnabled) {
        animId = requestAnimationFrame(render);
    } else {
        canvas.style.display = 'none';
    }

    // Inserisci Banner Natalizio nella Home se non già presente
    const heroSection = document.querySelector('.hero');
    if (heroSection && !document.querySelector('.xmas-greeting-banner')) {
        const banner = document.createElement('div');
        banner.className = 'container';
        banner.innerHTML = `
            <div class="xmas-greeting-banner">
                <div class="xmas-banner-left">
                    <span class="xmas-banner-icon" aria-hidden="true">🎅</span>
                    <div class="xmas-banner-text">
                        <h3>Buone Feste dal Basket 2000 Turate!</h3>
                        <p>Auguriamo a tutti i nostri atleti, famiglie, staff e tifosi un sereno Natale e un felice Anno Nuovo 🎄🏀</p>
                    </div>
                </div>
                <div class="xmas-banner-badge">
                    <span>🌟 Stagione 2026/27</span>
                </div>
            </div>
        `;
        heroSection.parentNode.insertBefore(banner, heroSection.nextSibling);
    }
})();
