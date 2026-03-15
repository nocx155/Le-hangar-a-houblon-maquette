/**
 * Le Hangar à Houblon - Optimisé
 */

(function() {
  'use strict';

  const scrollContainer = document.querySelector('.scroll-h');
  const dots = document.querySelectorAll('.nav-main__dot');
  const header = document.getElementById('header');

  function init() {
    initAnchors();
    initScrollHandler();
    initMobileMenu();
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#panel"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const panel = document.querySelector(link.getAttribute('href'));
        if (panel) {
          e.preventDefault();
          panel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
      });
    });
  }

  let scrollRAF = null;
  function onScroll() {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      if (!scrollContainer) return;
      const x = scrollContainer.scrollLeft;
      const w = window.innerWidth;
      const idx = Math.round(x / w);

      dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
      if (header) header.classList.toggle('scrolled', x > 50);

      scrollRAF = null;
    });
  }

  function initScrollHandler() {
    if (!scrollContainer) return;

    const scrollInner = scrollContainer.querySelector('.scroll-inner');
    const panels = scrollInner ? Array.from(scrollInner.querySelectorAll('.panel')) : [];
    const panelCount = panels.length;

    let wheelBlockedUntil = 0; // empêche les sauts multiples pendant la transition

    // Molette : un panel à la fois, avec transition fluide
    function onWheel(e) {
      const dy = e.deltaY;
      const dx = e.deltaX;
      if (Math.abs(dy) <= Math.abs(dx) || panelCount === 0) return;

      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now < wheelBlockedUntil) return;

      const w = scrollContainer.clientWidth;
      const x = scrollContainer.scrollLeft;
      const currentIndex = Math.round(x / w);
      let nextIndex = currentIndex;

      if (dy > 0) {
        nextIndex = Math.min(currentIndex + 1, panelCount - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex === currentIndex) return;

      const targetPanel = panels[nextIndex];
      const targetLeft = targetPanel.offsetLeft;

      scrollContainer.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });

      // Bloquer la molette le temps de la transition (~800 ms)
      wheelBlockedUntil = now + 900;
    }

    scrollContainer.addEventListener('wheel', onWheel, { passive: false, capture: true });
    document.addEventListener('wheel', onWheel, { passive: false, capture: true });

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  function initMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    if (!btn || !overlay) return;

    btn.addEventListener('click', () => {
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
