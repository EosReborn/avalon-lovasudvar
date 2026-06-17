// ── NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ── COOKIE UTILS ──
const COOKIE_KEY  = 'avalon_cookie_consent';
const TABOR_KEY   = 'avalon_tabor_seen';

function getCookieConsent() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
}
function setCookieConsent(val) {
  try { localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...val, ts: Date.now() })); } catch {}
}

// ── COOKIE BANNER ──
const banner = document.getElementById('cookie-banner');
if (banner) {
  if (!getCookieConsent()) {
    setTimeout(() => banner.classList.remove('hidden'), 900);
  } else {
    banner.classList.add('hidden');
  }
}

function hideBanner() {
  const b = document.getElementById('cookie-banner');
  if (b) b.classList.add('hidden');
}

document.getElementById('cookieAccept')?.addEventListener('click', () => {
  setCookieConsent({ necessary: true, analytics: true, marketing: true });
  hideBanner();
});
document.getElementById('cookieDecline')?.addEventListener('click', () => {
  setCookieConsent({ necessary: true, analytics: false, marketing: false });
  hideBanner();
});
document.getElementById('cookieSettings')?.addEventListener('click', () => {
  openCookieModal();
});
document.getElementById('cookieSettingsFooter')?.addEventListener('click', e => {
  e.preventDefault(); openCookieModal();
});

function openCookieModal() {
  const modal = document.getElementById('cookie-modal');
  if (!modal) return;
  const saved = getCookieConsent();
  if (saved) {
    const ta = document.getElementById('toggleAnalytics');
    const tm = document.getElementById('toggleMarketing');
    if (ta) ta.checked = !!saved.analytics;
    if (tm) tm.checked = !!saved.marketing;
  }
  modal.classList.add('open');
}

document.getElementById('cookieModalClose')?.addEventListener('click', () => {
  document.getElementById('cookie-modal')?.classList.remove('open');
});
document.getElementById('cookieSaveSettings')?.addEventListener('click', () => {
  const analytics = document.getElementById('toggleAnalytics')?.checked || false;
  const marketing = document.getElementById('toggleMarketing')?.checked || false;
  setCookieConsent({ necessary: true, analytics, marketing });
  document.getElementById('cookie-modal')?.classList.remove('open');
  hideBanner();
});
document.getElementById('cookie-modal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('cookie-modal')) {
    document.getElementById('cookie-modal').classList.remove('open');
  }
});

// ── NYÁRI TÁBOR POP-UP ──
// Csak az index.html-en jelenik meg, és csak egyszer per session
(function() {
  const modal = document.getElementById('tabor-modal');
  if (!modal) return; // Más oldalakon nincs popup

  // Ha már látta ebben a sessionben, nem mutatjuk
  try {
    if (sessionStorage.getItem('tabor_shown') === '1') return;
  } catch {}
  
  // Ha a user egyszer "Ne jelenjen meg újra" bejelölte, akkor sem
  try {
    if (localStorage.getItem(TABOR_KEY) === 'hidden') return;
  } catch {}

  // 2 másodperc késleltetéssel jelenik meg
  setTimeout(() => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Megjelölés: ebben a sessionben már mutattuk
    try { sessionStorage.setItem('tabor_shown', '1'); } catch {}
  }, 2000);

  function closeTaborModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    try {
      if (document.getElementById('taborDontShow')?.checked) {
        localStorage.setItem(TABOR_KEY, 'hidden');
      }
    } catch {}
  }

  document.getElementById('taborClose')?.addEventListener('click', closeTaborModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeTaborModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTaborModal(); });
  document.getElementById('taborCta')?.addEventListener('click', closeTaborModal);
})();
