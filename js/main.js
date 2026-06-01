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
})();
