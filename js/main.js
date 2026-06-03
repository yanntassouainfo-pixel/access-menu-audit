/* ACCESS Menu — Lookbook · main.js
   scene reveal + counters + form -> WhatsApp */

(function () {
  'use strict';

  /* ---------- Places restantes (1 variable -> 2 endroits) ---------- */
  const PLACES_LEFT = 22;
  ['placesHero', 'placesClub'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = PLACES_LEFT.toString();
  });

  /* ---------- Scene reveal on scroll ---------- */
  const scenes = document.querySelectorAll('.scene');
  if ('IntersectionObserver' in window && scenes.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });
    scenes.forEach((s) => sio.observe(s));
  } else {
    scenes.forEach((s) => s.classList.add('is-visible'));
  }

  /* ---------- Animated counters ---------- */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  function animateCount(el, target, duration = 1400) {
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * easeOutCubic(p)).toString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const target = parseInt(e.target.dataset.count, 10) || 0;
          animateCount(e.target, target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => { c.textContent = c.dataset.count || '0'; });
  }

  /* ---------- Form -> WhatsApp ---------- */
  const WA_NUMBER = '22892257351';
  const form = document.getElementById('auditForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const fn = (data.get('firstname') || '').toString().trim();
      const en = (data.get('establishment') || '').toString().trim();
      const ph = (data.get('phone') || '').toString().trim();
      const fields = [['firstname', fn], ['establishment', en], ['phone', ph]];
      let ok = true;
      fields.forEach(([n, v]) => {
        const inp = form.querySelector(`[name="${n}"]`);
        if (!v) { ok = false; inp.style.borderBottomColor = '#C9543F'; }
        else { inp.style.borderBottomColor = ''; }
      });
      if (!ok) {
        const first = form.querySelector('input[style*="C9543F"]');
        if (first) first.focus();
        return;
      }
      const lines = [
        'Bonjour ACCESS Menu,',
        '',
        "Je souhaite recevoir l'audit gratuit de ma carte et de ma présence digitale.",
        '',
        `• Prénom : ${fn}`,
        `• Enseigne : ${en}`,
        `• WhatsApp : ${ph}`,
        '',
        '(Demande envoyée depuis la landing Club Founders Lomé.)',
      ];
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Ouverture de WhatsApp…</span>';
        btn.style.opacity = '0.85';
        setTimeout(() => { btn.innerHTML = original; btn.style.opacity = ''; }, 2500);
      }
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
    });
    form.addEventListener('input', (ev) => {
      if (ev.target.matches('input')) ev.target.style.borderBottomColor = '';
    });
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (ev) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const t = document.querySelector(id);
      if (t) {
        ev.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (id === '#audit') {
          const first = document.querySelector('#auditForm input');
          if (first) setTimeout(() => first.focus({ preventScroll: true }), 700);
        }
      }
    });
  });

  /* ---------- Phone 3D slider — 3 écrans avec auto-rotate + swipe + dots ---------- */
  (function initPhoneSlider() {
    const phone = document.querySelector('[data-phone-slider]');
    if (!phone) return;

    const track  = phone.querySelector('.phone-3d__slides');
    const slides = phone.querySelectorAll('.phone-3d__slide');
    const dots   = phone.querySelectorAll('[data-phone-dot]');
    if (!track || !slides.length || !dots.length) return;

    const TOTAL      = slides.length;
    const AUTO_MS    = 5000;   // rotation auto toutes les 5 s
    const RESUME_MS  = 9000;   // reprise auto 9 s après une interaction
    const THRESHOLD  = 40;     // px minimum pour valider un swipe

    let index   = 0;
    let timer   = null;
    let isHover = false;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function applyTransform() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => {
        const active = i === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    }

    function goTo(i) {
      index = ((i % TOTAL) + TOTAL) % TOTAL;
      applyTransform();
    }
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function startAuto() {
      if (prefersReduced || isHover) return;
      stopAuto();
      timer = setInterval(next, AUTO_MS);
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function pauseThenResume(ms = RESUME_MS) {
      stopAuto();
      setTimeout(() => { if (!isHover) startAuto(); }, ms);
    }

    // Pastilles
    dots.forEach((d) => {
      d.addEventListener('click', () => {
        goTo(parseInt(d.getAttribute('data-phone-dot'), 10) || 0);
        pauseThenResume();
      });
    });

    // Pause au survol (desktop)
    phone.addEventListener('mouseenter', () => { isHover = true; stopAuto(); });
    phone.addEventListener('mouseleave', () => { isHover = false; startAuto(); });

    // Flèches clavier quand le focus est sur le slider
    phone.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); pauseThenResume(); }
      else if (e.key === 'ArrowLeft') { prev(); pauseThenResume(); }
    });

    // Swipe tactile + souris (sur l'écran de l'iPhone)
    const surface = phone.querySelector('.phone-3d__screen');
    if (surface) {
      let sx = 0, sy = 0, started = false;
      const onStart = (x, y) => { sx = x; sy = y; started = true; stopAuto(); };
      const onEnd = (x, y) => {
        if (!started) return;
        started = false;
        const dx = x - sx, dy = y - sy;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
          dx < 0 ? next() : prev();
        }
        pauseThenResume();
      };
      surface.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
      surface.addEventListener('touchend',   (e) => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY));
      surface.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') onStart(e.clientX, e.clientY); });
      surface.addEventListener('pointerup',   (e) => { if (e.pointerType === 'mouse') onEnd(e.clientX, e.clientY); });
    }

    applyTransform();
    startAuto();
  })();
})();
