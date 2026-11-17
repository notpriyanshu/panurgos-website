// Site settings shared by every page. Edit these, nothing else.
window.PANURGOS = {
  // Download service (Cloudflare Worker). Empty = downloads show "Opening soon".
  api: /^(127\.0\.0\.1|localhost)$/.test(location.hostname) ? 'http://127.0.0.1:8787' : '',
  // Shown in the nav/footer and on the privacy page when filled in.
  instagram: '',
  email: ''
};
