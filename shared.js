// ── NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── COOKIE BANNER ──
const COOKIE_KEY = 'avalon_cookie_consent';

function getCookieConsent() {
  try { return JSON.parse(localStorage.getItem(COOKIE_KEY)); } catch { return null; }
}
function setCookieConsent(val) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(val));
}

const banner = document.getElementById('cookie-banner');
const modal = document.getElementById('cookie-modal');

function hideBanner() {
  if (banner) banner.classList.add('hidden');
}

// Show banner if no consent yet
if (!getCookieConsent() && banner) {
  setTimeout(() => banner.classList.remove('hidden'), 800);
} else if (banner) {
  banner.classList.add('hidden');
}

// Accept all
document.getElementById('cookieAccept')?.addEventListener('click', () => {
  setCookieConsent({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
  hideBanner();
});

// Decline non-essential
document.getElementById('cookieDecline')?.addEventListener('click', () => {
  setCookieConsent({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
  hideBanner();
});

// Open settings modal
document.getElementById('cookieSettings')?.addEventListener('click', () => {
  if (modal) modal.classList.add('open');
});
document.getElementById('cookieModalClose')?.addEventListener('click', () => {
  if (modal) modal.classList.remove('open');
});
document.getElementById('cookieSaveSettings')?.addEventListener('click', () => {
  const analytics = document.getElementById('toggleAnalytics')?.checked || false;
  const marketing = document.getElementById('toggleMarketing')?.checked || false;
  setCookieConsent({ necessary: true, analytics, marketing, ts: Date.now() });
  if (modal) modal.classList.remove('open');
  hideBanner();
});
// Close modal on backdrop click
modal?.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

// Fill in saved prefs when opening modal
document.getElementById('cookieSettings')?.addEventListener('click', () => {
  const saved = getCookieConsent();
  if (saved) {
    const ta = document.getElementById('toggleAnalytics');
    const tm = document.getElementById('toggleMarketing');
    if (ta) ta.checked = saved.analytics;
    if (tm) tm.checked = saved.marketing;
  }
});
