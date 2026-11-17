// Redeems the emailed link and starts the download. The token is removed from the address bar immediately.
(() => {
  const CFG = window.PANURGOS || {};
  const box = document.getElementById('state');
  const token = new URLSearchParams(location.search).get('t') || '';
  if (token) history.replaceState(null, '', location.pathname);

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const show = (label, title, lede, actions = '') => {
    box.innerHTML = `<p class="label">// ${esc(label)}</p><h1>${title}</h1><p class="page-lede">${lede}</p>${actions ? `<div class="cta-row">${actions}</div>` : ''}`;
  };
  const again = '<a class="btn btn-fire btn-lg" href="../#download">Request a new link</a>';

  if (!token) return show('NO LINK', 'Nothing to open<span class="fire">.</span>', 'This page opens the download link we email you. Request one from the homepage.', again);
  if (!CFG.api) return show('OFFLINE', 'Downloads open soon<span class="fire">.</span>', 'The download service isn\'t live yet. Please try again shortly.', '<a class="btn btn-ghost btn-lg" href="../">Back to PanUrgos</a>');

  fetch(CFG.api + '/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
    .then(async (res) => ({ res, body: await res.json().catch(() => ({})) }))
    .then(({ res, body }) => {
      if (res.status === 410 || res.status === 400) return show('EXPIRED', 'This link has closed<span class="fire">.</span>', esc(body.message || 'It expired or was already used.') + ' Links work once, for 30 minutes.', again);
      if (!res.ok || !body.ok) return show('ERROR', 'Something went wrong<span class="fire">.</span>', esc(body.message || 'Please try again in a moment.'), again);

      if (!body.available) {
        return show('VERIFIED', 'You\'re on the list<span class="fire">.</span>',
          `Your email is confirmed. PanUrgos Studio for ${esc(body.platformName)} isn't released yet. If you asked to be told, we'll email you once when it ships.`,
          '<a class="btn btn-ghost btn-lg" href="../">Back to PanUrgos</a>');
      }
      const url = `${CFG.api}/file/${encodeURIComponent(body.ticket)}`;
      show('VERIFIED', 'Your download is starting<span class="fire">.</span>',
        `PanUrgos Studio ${esc(body.version)} for ${esc(body.platformName)} (<code>${esc(body.file)}</code>). If nothing happens, use the button below. It works for 15 minutes.`,
        `<a class="btn btn-fire btn-lg" href="${esc(url)}">Download again</a><a class="btn btn-ghost btn-lg" href="../#studio">What's inside</a>`);
      setTimeout(() => { location.href = url; }, 600);
    })
    .catch(() => show('OFFLINE', 'Couldn\'t reach the gate<span class="fire">.</span>', 'Check your connection, then open the link from your email again. It still works until it expires.'));
})();
