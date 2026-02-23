/* ═══════════════════════════════════════════════════════════
   GUNJAN BARUA PORTFOLIO – main.js
   Handles:
   • Faded snap-scroll with IntersectionObserver
   • Overflow-section inner scroll → auto-snap to next
   • Right-side nav active state
   • Hamburger / mobile drawer
   • Gallery lightbox
   • Contact form (mailto fallback)
═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────────────── */
    const $ = (s, ctx = document) => ctx.querySelector(s);
    const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

    /* ── DOM refs ─────────────────────────────────────────── */
    const snapContainer = $('#snap-container');
    const sections = $$('.snap-section');
    const navDots = $$('.nav-dot');
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobile-nav');
    const mobileOverlay = $('#mobile-overlay');
    const mobileClose = $('#mobile-nav-close');
    const mobileLinks = $$('.mobile-nav-link');
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxCap = $('#lightbox-caption');
    const lightboxClose = $('#lightbox-close');
    const lightboxPrev = $('#lightbox-prev');
    const lightboxNext = $('#lightbox-next');
    const contactForm = $('#contact-form');
    const formNote = $('#form-note');

    /* ═══════════════════════════════════════════════════════
       1. FADE-IN / INTERSECTION OBSERVER
       Adds .visible to sections when they are 30%+ visible.
    ═══════════════════════════════════════════════════════ */
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    updateActiveNav(entry.target.id);
                } else {
                    // Optional: fade out when leaving. Remove 'visible' for re-fade.
                    // Uncomment the line below to fade out as you scroll away:
                    // entry.target.classList.remove('visible');
                }
            });
        },
        {
            root: snapContainer,
            threshold: 0.3,
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    /* ═══════════════════════════════════════════════════════
       2. ACTIVE NAV DOT UPDATER
    ═══════════════════════════════════════════════════════ */
    function updateActiveNav(sectionId) {
        navDots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === sectionId);
        });
    }

    /* ═══════════════════════════════════════════════════════
       3. NAV DOT CLICK → SMOOTH SCROLL TO SECTION
    ═══════════════════════════════════════════════════════ */
    navDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = dot.dataset.section || dot.getAttribute('href')?.replace('#', '');
            const target = $(`#${sectionId}`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ═══════════════════════════════════════════════════════
       4. OVERFLOW SECTIONS: snap-to-next when inner scroll hits bottom
       For .overflow-section, the inner .section-inner is scrollable.
       When user reaches bottom, snap container snaps to next section.
    ═══════════════════════════════════════════════════════ */
    $$('.snap-section.overflow-section').forEach((section) => {
        const inner = section.querySelector('.section-inner');
        if (!inner) return;

        let cooldown = false;

        inner.addEventListener('wheel', (e) => {
            if (cooldown) return;

            const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 4;
            const atTop = inner.scrollTop <= 0;

            if (e.deltaY > 0 && atBottom) {
                // Scrolling down at bottom → snap to next section
                e.preventDefault();
                cooldown = true;
                const next = section.nextElementSibling;
                if (next && next.classList.contains('snap-section')) {
                    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => { cooldown = false; }, 900);
            } else if (e.deltaY < 0 && atTop) {
                // Scrolling up at top → snap to previous section
                e.preventDefault();
                cooldown = true;
                const prev = section.previousElementSibling;
                if (prev && prev.classList.contains('snap-section')) {
                    prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => { cooldown = false; }, 900);
            }
        }, { passive: false });

        // Touch support for overflow sections
        let touchStartY = 0;
        inner.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        inner.addEventListener('touchend', (e) => {
            if (cooldown) return;
            const deltaY = touchStartY - e.changedTouches[0].clientY;
            const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 4;
            const atTop = inner.scrollTop <= 0;

            if (deltaY > 40 && atBottom) {
                cooldown = true;
                const next = section.nextElementSibling;
                if (next?.classList.contains('snap-section')) {
                    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => { cooldown = false; }, 900);
            } else if (deltaY < -40 && atTop) {
                cooldown = true;
                const prev = section.previousElementSibling;
                if (prev?.classList.contains('snap-section')) {
                    prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setTimeout(() => { cooldown = false; }, 900);
            }
        }, { passive: true });
    });

    /* ═══════════════════════════════════════════════════════
       5. HAMBURGER / MOBILE DRAWER
    ═══════════════════════════════════════════════════════ */
    function openMobileNav() {
        mobileNav.classList.add('open');
        mobileOverlay.classList.add('active');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        mobileNav.classList.remove('open');
        mobileOverlay.classList.remove('active');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', () => {
        hamburger.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    mobileLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            const href = link.getAttribute('href');
            const target = $(href);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350); // wait for drawer close animation
            }
        });
    });

    /* ═══════════════════════════════════════════════════════
       6. GALLERY LIGHTBOX
    ═══════════════════════════════════════════════════════ */
    let galleryItems = [];
    let currentIndex = 0;

    function buildGalleryItems() {
        galleryItems = $$('.gallery-item');
    }

    function openLightbox(index) {
        if (!galleryItems.length) return;
        currentIndex = index;
        const item = galleryItems[index];
        if (!item) return;
        const img = item.querySelector('img');
        const cap = item.querySelector('figcaption');
        if (img) { lightboxImg.src = img.src; lightboxImg.alt = img.alt || ''; }
        if (cap) lightboxCap.textContent = cap.textContent;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Show/hide prev/next
        lightboxPrev.style.display = galleryItems.length > 1 ? 'flex' : 'none';
        lightboxNext.style.display = galleryItems.length > 1 ? 'flex' : 'none';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function showLightboxItem(index) {
        const wrapped = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
        openLightbox(wrapped);
    }

    if (lightbox) {
        buildGalleryItems();

        $$('.gallery-item').forEach((item, i) => {
            item.addEventListener('click', () => openLightbox(i));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
            });
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxItem(currentIndex - 1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxItem(currentIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxItem(currentIndex - 1);
            if (e.key === 'ArrowRight') showLightboxItem(currentIndex + 1);
        });
    }

    /* ═══════════════════════════════════════════════════════
       7. CONTACT FORM (mailto fallback)
       ─ For a real form, integrate Formspree or Netlify Forms.
    ═══════════════════════════════════════════════════════ */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#contact-name')?.value.trim();
            const email = $('#contact-email')?.value.trim();
            const subject = $('#contact-subject')?.value.trim() || 'Portfolio Inquiry';
            const message = $('#contact-message')?.value.trim();

            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            const mailto = `mailto:gunjanb@vt.edu?subject=${encodeURIComponent(subject)}&body=${body}`;
            window.location.href = mailto;

            if (formNote) {
                formNote.textContent = '✅ Opening your email client…';
                setTimeout(() => { formNote.textContent = ''; }, 4000);
            }
        });
    }

    /* ═══════════════════════════════════════════════════════
       8. KEYBOARD NAVIGATION between sections
    ═══════════════════════════════════════════════════════ */
    document.addEventListener('keydown', (e) => {
        // Don't intercept when typing in inputs/textarea or lightbox is open
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
        if (lightbox?.classList.contains('open')) return;

        // Find currently visible section
        const current = sections.find(s => s.classList.contains('visible'));
        if (!current) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const next = current.nextElementSibling;
            if (next?.classList.contains('snap-section')) {
                next.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const prev = current.previousElementSibling;
            if (prev?.classList.contains('snap-section')) {
                prev.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

})();
