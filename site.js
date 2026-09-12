document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
// Intake is deliberately disabled; no endpoint, email address, or storage.
document.querySelector('#inquiry-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
});
const updateInsets = () => {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.legal-bar');
  document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  document.documentElement.style.setProperty('--legal-h', footer.offsetHeight + 'px');
};
new ResizeObserver(updateInsets).observe(document.querySelector('.site-header'));
new ResizeObserver(updateInsets).observe(document.querySelector('.legal-bar'));
updateInsets();

// Follow the reading position below the sticky masthead.
const sectionLinks = [...document.querySelectorAll('.section-nav a[href^="#"], .connect-button')];
const trackedSections = sectionLinks.map(link => ({
  link, section: document.querySelector(link.getAttribute('href'))
})).filter(item => item.section);
let scrollFrame = 0;
const updateActiveSection = () => {
  scrollFrame = 0;
  const boundary = document.querySelector('.site-header').getBoundingClientRect().bottom + 24;
  let active = null;
  for (const item of trackedSections) {
    if (item.section.getBoundingClientRect().top <= boundary) active = item;
  }
  if (window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    active = trackedSections[trackedSections.length - 1];
  }
  for (const item of trackedSections) {
    if (item === active) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  }
};
const queueSectionUpdate = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateActiveSection);
};
window.addEventListener('scroll', queueSectionUpdate, { passive: true });
window.addEventListener('resize', queueSectionUpdate);
window.addEventListener('pageshow', queueSectionUpdate);
document.addEventListener('toggle', queueSectionUpdate, true);
new ResizeObserver(queueSectionUpdate).observe(document.querySelector('main'));
new ResizeObserver(queueSectionUpdate).observe(document.querySelector('.site-header'));
updateActiveSection();
