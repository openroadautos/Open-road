// ── Nav scroll behavior ──
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile menu ──
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
}

// ── Hero bg parallax (subtle) ──
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
  setTimeout(() => { heroBg.style.transform = 'scale(1) translateY(0)'; }, 100);
}

// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
}

// ── Animated counters ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = prefix + val.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counterEls.forEach(el => cio.observe(el));
}

// ── Inventory filter pills ──
function bindInventoryFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = () => document.querySelectorAll('.vehicle-card[data-category]');
  if (!pills.length || !cards().length) return;
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('category') || 'all';

  function applyInventoryFilter(cat) {
    pills.forEach(p => p.classList.toggle('active', p.dataset.filter === cat));
    cards().forEach(card => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
    });
  }

  pills.forEach(pill => {
    if (pill.dataset.bound === 'true') return;
    pill.dataset.bound = 'true';
    pill.addEventListener('click', () => {
      const cat = pill.dataset.filter;
      applyInventoryFilter(cat);
      const url = cat === 'all' ? window.location.pathname : `${window.location.pathname}?category=${cat}`;
      window.history.replaceState({}, '', url);
    });
  });

  if ([...pills].some(p => p.dataset.filter === initialFilter)) {
    applyInventoryFilter(initialFilter);
  }
}
bindInventoryFilters();
window.addEventListener('openroad:inventory-rendered', bindInventoryFilters);

// ── Form: prevent default, show success ──
document.querySelectorAll('form[data-ajax]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    if (btn) { btn.textContent = 'Sent ✓'; btn.disabled = true; btn.style.opacity = '0.7'; }
  });
});
