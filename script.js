(function () {
    'use strict';

    // ====== CONFIG: links a las tiendas ======
    const APP_LINKS = {
        ios: 'https://apps.apple.com/cl/app/guardias-en-red/id6756922542',
        android: 'https://play.google.com/store/apps/details?id=com.gruposep.guardiasred',
    };

    // ====== DETECCIÓN DE DISPOSITIVO ======
    function detectPlatform() {
        const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();

        const isIOS =
            /iphone|ipad|ipod/.test(ua) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        const isAndroid = /android/.test(ua);

        if (isIOS) return 'ios';
        if (isAndroid) return 'android';
        return 'unknown';
    }

    // ====== ICONOS SVG ======
    const APPLE_SVG = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
    `;

    const ANDROID_SVG = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.34c-.62 0-1.124-.504-1.124-1.123 0-.62.504-1.124 1.124-1.124s1.123.504 1.123 1.124c0 .62-.504 1.124-1.123 1.124m-11.045 0c-.62 0-1.123-.504-1.123-1.123 0-.62.503-1.124 1.123-1.124s1.124.504 1.124 1.124c0 .62-.504 1.124-1.124 1.124m11.45-6.118l2.245-3.89a.469.469 0 0 0-.171-.64.469.469 0 0 0-.641.171l-2.273 3.937A14.072 14.072 0 0 0 12 7.245c-2.084 0-4.04.46-5.788 1.297L3.939 4.605a.469.469 0 1 0-.812.469l2.245 3.89C1.5 11.05.222 14.022 0 17.4h24c-.222-3.378-1.5-6.35-5.072-8.178"/>
        </svg>
    `;

    const DOWNLOAD_SVG = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v12"/>
            <path d="m7 10 5 5 5-5"/>
            <path d="M5 21h14"/>
        </svg>
    `;

    // ====== BOTONES DE DESCARGA ======
    function renderDownloadButtons() {
        const container = document.getElementById('downloadButtons');
        if (!container) return;

        const platform = detectPlatform();

        const iosBtn = `
            <a href="${APP_LINKS.ios}" class="store-button ${platform === 'ios' ? 'primary' : ''}" target="_blank" rel="noopener" data-platform="ios">
                ${APPLE_SVG}
                <div class="store-button-text">
                    <small>Descargar en</small>
                    <strong>App Store</strong>
                </div>
            </a>
        `;

        const androidBtn = `
            <a href="${APP_LINKS.android}" class="store-button ${platform === 'android' ? 'primary' : ''}" target="_blank" rel="noopener" data-platform="android">
                ${ANDROID_SVG}
                <div class="store-button-text">
                    <small>Disponible en</small>
                    <strong>Google Play</strong>
                </div>
            </a>
        `;

        if (platform === 'ios') {
            container.innerHTML = iosBtn + androidBtn;
        } else if (platform === 'android') {
            container.innerHTML = androidBtn + iosBtn;
        } else {
            container.innerHTML = iosBtn + androidBtn;
        }
    }

    // ====== HEADER SCROLL ======
    function initHeaderScroll() {
        const header = document.getElementById('header');
        const onScroll = () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ====== FLOATING CTA ======
    function initFloatingCta() {
        const cta = document.getElementById('floatingCta');
        const onScroll = () => {
            const downloadSection = document.getElementById('descargar');
            const downloadTop = downloadSection
                ? downloadSection.getBoundingClientRect().top
                : Infinity;

            if (window.scrollY > 600 && downloadTop > 200) {
                cta.classList.add('show');
            } else {
                cta.classList.remove('show');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ====== REVEAL ON SCROLL ======
    function initReveal() {
        const elements = document.querySelectorAll(
            '.section-title, .section-sub, .eyebrow, .benefit-card, .problem-card, .how-card, .testi, .rank-card, .rank-tier-head, .puntos-list li, .stat, .download-card, .protege-card, .protege-feat, .video-frame, .hero-text > *, .hero-phone-wrap'
        );

        elements.forEach((el) => el.classList.add('reveal'));

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        elements.forEach((el) => io.observe(el));
    }

    // ====== STATS COUNTER ======
    function initCounters() {
        const stats = document.querySelectorAll('.stat strong');
        if (!stats.length) return;

        const formatNumber = (n) => {
            return new Intl.NumberFormat('es-CL').format(Math.floor(n));
        };

        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(target * eased);
                el.textContent = formatNumber(value) + suffix;
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = formatNumber(target) + suffix;
                }
            };

            requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        stats.forEach((s) => io.observe(s));
    }

    // ====== MEDAL COUNTER ANIMATION (PHONE) ======
    function initMedalCounter() {
        const el = document.getElementById('medalCounter');
        if (!el) return;

        const target = 85;
        let triggered = false;

        const animate = () => {
            if (triggered) return;
            triggered = true;

            const duration = 2400;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.floor(target * eased);
                el.textContent = new Intl.NumberFormat('es-CL').format(value);
                if (progress < 1) requestAnimationFrame(tick);
            };

            el.textContent = '0';
            requestAnimationFrame(tick);
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) animate();
                });
            },
            { threshold: 0.5 }
        );

        io.observe(el);
    }

    // ====== SMOOTH SCROLL FALLBACK ======
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const headerH = 80;
                const top =
                    target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });
    }

    // ====== INIT ======
    document.addEventListener('DOMContentLoaded', () => {
        renderDownloadButtons();
        initHeaderScroll();
        initFloatingCta();
        initReveal();
        initCounters();
        initMedalCounter();
        initSmoothScroll();
    });
})();
