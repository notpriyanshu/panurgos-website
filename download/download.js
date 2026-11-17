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

  const err = new URLSearchParams(location.search).get('e');
  if (err) history.replaceState(null, '', location.pathname);
  const ERR = {
    denied: ['CANCELLED', 'Sign-in cancelled<span class="fire">.</span>', 'No problem. Choose another way to get your download.'],
    expired: ['EXPIRED', 'That took too long<span class="fire">.</span>', 'Sign-in requests last 10 minutes. Please start again.'],
    noemail: ['NO EMAIL', 'We couldn\'t get a verified email<span class="fire">.</span>', 'Your account didn\'t share a verified email address. Try another sign-in option, or use your email instead.'],
    unavailable: ['UNAVAILABLE', 'That sign-in option is off right now<span class="fire">.</span>', 'Please use another option, or your email.'],
    busy: ['BUSY', 'Too many requests<span class="fire">.</span>', 'Please wait a minute and try again.'],
    failed: ['ERROR', 'Sign-in failed<span class="fire">.</span>', 'Something went wrong on the way back. Please try again.']
  };
  if (err && !token) { const [l, t, d] = ERR[err] || ERR.failed; return show(l, t, d, again); }
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
      const variants = Array.isArray(body.variants) ? body.variants.filter((v) => v.id !== 'default') : [];
      if (variants.length > 1) {
        // macOS (Apple Silicon / Intel) and Linux (AppImage / .deb): let the visitor pick the right file.
        const buttons = variants.map((v, i) =>
          `<a class="btn ${i === 0 ? 'btn-fire' : 'btn-ghost'} btn-lg" href="${esc(url + '?v=' + encodeURIComponent(v.id))}">${esc(v.label)}</a>`).join('');
        const hints = variants.filter((v) => v.hint).map((v) => `<b>${esc(v.label)}</b>: ${esc(v.hint)}`).join('<br>');
        const mac = body.platform === 'mac'
          ? '<br><br>First launch: macOS will say it can\'t verify the developer. Open <b>System Settings → Privacy &amp; Security</b> and click <b>Open Anyway</b> once.'
          : '';
        return show('VERIFIED', 'Choose your download<span class="fire">.</span>',
          `PanUrgos Studio ${esc(body.version)} for ${esc(body.platformName)}. Links work for 15 minutes.<br><br>${hints}${mac}`, buttons);
      }
      show('VERIFIED', 'Your download is starting<span class="fire">.</span>',
        `PanUrgos Studio ${esc(body.version)} for ${esc(body.platformName)} (<code>${esc(body.file)}</code>). If nothing happens, use the button below. It works for 15 minutes.`,
        `<a class="btn btn-fire btn-lg" href="${esc(url)}">Download again</a><a class="btn btn-ghost btn-lg" href="../#studio">What's inside</a>`);
      setTimeout(() => { location.href = url; }, 600);
    })
    .catch(() => show('OFFLINE', 'Couldn\'t connect<span class="fire">.</span>', 'Check your connection, then open the link from your email again. It still works until it expires.'));
})();
