// Enterprise call booking: shows open 30-minute slots in the visitor's timezone and books one.
(() => {
  const CFG = window.PANURGOS || {};
  const $ = (id) => document.getElementById(id);
  const when = $('bk-when'), form = $('bk-form'), done = $('bk-done');
  if (!when) return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const dayName = new Intl.DateTimeFormat(undefined, { timeZone: tz, weekday: 'short' });
  const dayNum = new Intl.DateTimeFormat(undefined, { timeZone: tz, day: 'numeric', month: 'short' });
  const timeFmt = new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: 'numeric', minute: '2-digit' });
  const fullFmt = new Intl.DateTimeFormat(undefined, { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });

  let slots = [], byDay = new Map(), picked = null, minutes = 30;

  const showStep = (step) => { for (const s of [when, form, done]) s.hidden = s !== step; };
  const button = (cls, label, onClick, sel) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.innerHTML = label; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', sel ? 'true' : 'false');
    b.addEventListener('click', onClick); return b;
  };

  function renderDays(activeKey) {
    const days = $('bk-days'); days.innerHTML = '';
    for (const [key, list] of byDay) {
      const d = new Date(list[0]);
      days.append(button(`day${key === activeKey ? ' on' : ''}`, `<span>${dayName.format(d)}</span><b>${dayNum.format(d)}</b>`, () => { renderDays(key); renderTimes(key); }, key === activeKey));
    }
  }
  function renderTimes(key) {
    const times = $('bk-times'); times.innerHTML = '';
    for (const iso of byDay.get(key) || []) {
      times.append(button('time', timeFmt.format(new Date(iso)), () => pick(iso)));
    }
  }
  function pick(iso) {
    picked = iso;
    $('bk-picked').textContent = `${fullFmt.format(new Date(iso))} · ${minutes} minutes`;
    $('bk-msg').textContent = '';
    showStep(form);
    $('bk-name').focus();
  }

  async function load() {
    if (!CFG.api) { $('bk-tz').textContent = 'Booking opens soon.'; $('bk-empty').hidden = false; return; }
    try {
      const r = await fetch(CFG.api + '/slots');
      const body = await r.json();
      minutes = body.slotMinutes || 30;
      slots = body.slots || [];
    } catch { $('bk-tz').textContent = "Couldn't load times. Check your connection and reload."; return; }
    byDay = new Map();
    for (const iso of slots) { const k = dayKey.format(new Date(iso)); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(iso); }
    $('bk-tz').textContent = `Times in your timezone (${tz.replace(/_/g, ' ')})`;
    if (!byDay.size) { $('bk-empty').hidden = false; return; }
    const first = byDay.keys().next().value;
    renderDays(first); renderTimes(first);
  }

  $('bk-back').addEventListener('click', () => { showStep(when); load(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = $('bk-msg'); msg.textContent = '';
    const v = (id) => $(id).value.trim();
    if (!v('bk-name')) { msg.textContent = 'Please enter your name.'; return $('bk-name').focus(); }
    if (!$('bk-email').checkValidity() || !v('bk-email')) { msg.textContent = 'Enter a valid work email address.'; return $('bk-email').focus(); }
    if (!v('bk-company')) { msg.textContent = 'Please enter your company.'; return $('bk-company').focus(); }
    if (!$('bk-consent').checked) { msg.textContent = 'Please agree to the privacy terms to continue.'; return $('bk-consent').focus(); }
    const submit = $('bk-submit'); submit.disabled = true; submit.textContent = 'Booking…';
    try {
      const res = await fetch(CFG.api + '/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: picked, tz, name: v('bk-name'), email: v('bk-email'), company: v('bk-company'), size: $('bk-size').value || null, topic: v('bk-topic'), consent: true })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        msg.textContent = body.message || 'Something went wrong. Please try again.';
        if (body.error === 'slot' || body.error === 'taken') { setTimeout(() => { showStep(when); load(); }, 1600); }
        return;
      }
      $('bk-done-text').textContent = `Your call is booked for ${fullFmt.format(new Date(body.start))}. A confirmation with a calendar invite is on its way to ${v('bk-email')}.`;
      showStep(done);
    } catch {
      msg.textContent = "Couldn't reach the booking service. Check your connection and try again.";
    } finally { submit.disabled = false; submit.textContent = 'Book the call'; }
  });

  load();
})();
