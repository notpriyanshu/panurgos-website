// Site settings shared by every page. Edit these, nothing else.
window.PANURGOS = {
  // Download service (Cloudflare Worker). Empty = downloads show "Opening soon".
  api: /^(127\.0\.0\.1|localhost)$/.test(location.hostname) ? 'http://127.0.0.1:8787' : 'https://panurgos-api.panurgos-download-api.workers.dev',
  // Sign-in buttons in the download panel (switch on once the OAuth apps exist).
  login: { google: true, github: true },
  // Shown in the nav/footer and on the privacy page when filled in.
  instagram: '',
  email: ''
};
