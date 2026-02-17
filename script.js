// RTL Language Detection and Dynamic Application
const RTL_LANGS = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'iw', 'ps', 'sd'];

function applyRTLIfNeeded() {
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang') || 'en';
  const baseLang = currentLang.split('-')[0].toLowerCase();
  
  if (RTL_LANGS.includes(baseLang)) {
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.classList.add('rtl-mode');
    document.body.classList.add('rtl-mode');
  } else {
    htmlElement.setAttribute('dir', 'ltr');
    htmlElement.classList.remove('rtl-mode');
    document.body.classList.remove('rtl-mode');
  }
}

// Watch for Google Translate language changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'lang') {
      applyRTLIfNeeded();
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});

// Initial check on page load
applyRTLIfNeeded();

const timeline = document.getElementById('timeline');
const cards = Array.from(document.querySelectorAll('.card'));
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const progressFill = document.getElementById('progress');

// Create progress fill bar element
const fill = document.createElement('i');
document.getElementById('progress').appendChild(fill);

function updateProgress() {
  const scrollWidth = timeline.scrollWidth - timeline.clientWidth;
  const pct = scrollWidth ? (timeline.scrollLeft / scrollWidth) * 100 : 0;
  fill.style.width = pct + '%';
}

// Intersection observer to mark center card as active
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const card = e.target;
    if (e.isIntersecting && e.intersectionRatio > 0.5) {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }
  });
}, { root: timeline, threshold: [0.5] });

cards.forEach(c => io.observe(c));

timeline.addEventListener('scroll', () => {
  updateProgress();
});

prev.addEventListener('click', () => {
  // find current active index
  const idx = cards.findIndex(c => c.classList.contains('active'));
  const nextIdx = Math.max(0, idx - 1);
  cards[nextIdx].scrollIntoView({behavior:'smooth', inline:'center'});
});

next.addEventListener('click', () => {
  const idx = cards.findIndex(c => c.classList.contains('active'));
  const nextIdx = Math.min(cards.length - 1, (idx === -1 ? 0 : idx + 1));
  cards[nextIdx].scrollIntoView({behavior:'smooth', inline:'center'});
});

// keyboard support
timeline.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next.click();
  if (e.key === 'ArrowLeft') prev.click();
});

// initial centering: ensure first card is active
setTimeout(()=>{ cards[0].scrollIntoView({behavior:'smooth', inline:'center'}); updateProgress(); }, 120);

// Subscription form handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('subscription-form');
  const alertWrap = document.getElementById('subscribe-alert');

  if (!form) return;

  function showAlert(message, type = 'success'){
    alertWrap.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const name = form.name.value.trim();
    const consent = form.consent.checked;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
      showAlert('Please enter a valid email address.', 'danger');
      return;
    }
    if (!consent){
      showAlert('Please agree to receive the newsletter.', 'danger');
      return;
    }

    // Simulate successful subscription (replace with real API call)
    showAlert(`Thanks ${name || ''}! You've been subscribed with ${email}.`);
    form.reset();
  });
});