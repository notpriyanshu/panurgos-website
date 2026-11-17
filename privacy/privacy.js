// Fills the contact address from config.js; falls back to GitHub when it isn't set.
(() => {
  const email = (window.PANURGOS || {}).email;
  const withMail = document.querySelector('[data-contact]');
  const fallback = document.querySelector('[data-contact-fallback]');
  if (email) {
    const a = withMail.querySelector('a');
    a.href = `mailto:${email}`; a.textContent = email;
    fallback.remove();
  } else {
    withMail.remove();
  }
})();
