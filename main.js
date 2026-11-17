// panurgos.com — all effects run locally. No tracking, no network requests.
(() => {
  // Links and the download API live in config.js.
  const CFG = window.PANURGOS || {};
  const LINKS = { instagram: CFG.instagram || '', email: CFG.email || '' };

  const HIERO = [...'𓂀𓋹𓆣𓇳𓊽𓁹𓅃𓆄𓋴𓏏𓂋𓈖𓊪𓃭𓅓𓉐𓆓𓇋𓄿𓎛𓐍𓇯𓆑𓂝𓃀𓅱𓍿𓌳𓊹𓋞'];
  const RUNES = [...'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'];
  const NOISE = [...HIERO, ...RUNES, ...'ΣΩΨΦΔΞλπ01アカサタナハマヤラワ#*<>/'];
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const store = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };

  // ------------------------------------------------------------------ links, OS, clock
  for (const a of $$('[data-link]')) {
    const v = LINKS[a.dataset.link];
    if (v) { a.href = a.dataset.link === 'email' ? `mailto:${v}` : v; a.hidden = false; }
  }
  const ua = navigator.userAgent;
  const os = /Mac/i.test(ua) && !/iPhone|iPad/i.test(ua) ? 'mac' : /Win/i.test(ua) ? 'win' : /Linux|X11/i.test(ua) && !/Android/i.test(ua) ? 'linux' : null;
  if (os) {
    const label = $('[data-os-label]');
    if (label) label.textContent = `Download for ${{ win: 'Windows', mac: 'macOS', linux: 'Linux' }[os]}`;
    $(`.dl-card[data-os="${os}"]`)?.classList.add('mine');
  }
  const year = $('[data-year]'); if (year) year.textContent = String(new Date().getFullYear());
  const clock = $('[data-clock]');
  const tick = () => { if (clock) clock.textContent = new Date().toISOString().slice(11, 19) + ' UTC'; };
  tick(); setInterval(tick, 1000);

  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // ------------------------------------------------------------------ the gate
  const gate = $('#gate');
  let started = false;
  function begin() {
    if (started) return; started = true;
    document.body.classList.remove('locked');
    startHero();
  }
  function enter(ceremony) {
    store.set('pn-awake', '1');
    if (!gate || gate.classList.contains('hidden')) return begin();
    if (ceremony && !reduced) {
      gate.classList.add('gone');
      setTimeout(() => { gate.classList.add('hidden'); }, 850);
      setTimeout(begin, 500);
    } else { gate.classList.add('hidden'); begin(); }
  }
  if (gate && !store.get('pn-awake') && !reduced) {
    document.body.classList.add('locked');
    const sw = $('#gate-switch');
    sw.addEventListener('click', () => {
      if (sw.getAttribute('aria-checked') === 'true') return;
      sw.setAttribute('aria-checked', 'true');
      setTimeout(() => enter(true), 450);
    });
    addEventListener('keydown', function k(e) { if (e.key === 'Escape') { removeEventListener('keydown', k); enter(false); } });
    setTimeout(() => sw.focus({ preventScroll: true }), 700);
  } else {
    gate?.classList.add('hidden');
    queueMicrotask(begin); // after the rest of this script has initialised
  }

  // ------------------------------------------------------------------ reveal on scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .06 }) : null;
  const heroReveals = $$('.hero .reveal');
  $$('.reveal').forEach((n) => { if (!heroReveals.includes(n)) io ? io.observe(n) : n.classList.add('in'); });

  function startHero() {
    heroReveals.forEach((n) => n.classList.add('in'));
    drawPhoenix();
    embers($('#embers'));
  }

  // ------------------------------------------------------------------ phoenix (generated, drawn in fire)
  function drawPhoenix() {
    const svg = $('#phoenix'); const bird = $('#bird'); const ticks = $('#ticks');
    if (!svg || bird.childElementCount) return;
    const NS = 'http://www.w3.org/2000/svg';
    const add = (parent, tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };
    const f = (n) => n.toFixed(1);

    add(svg.querySelector('defs'), 'path', { id: 'glyph-orbit', d: 'M400 270 m-262 0 a262 262 0 1 1 524 0 a262 262 0 1 1 -524 0' });
    const ringText = add(ticks.parentNode, 'text', { class: 'glyph-ring' });
    const tp = add(ringText, 'textPath', { href: '#glyph-orbit' });
    tp.textContent = Array.from({ length: 3 }, () => HIERO.join(' ')).join('  ·  ');
    for (let i = 0; i < 72; i++) {
      const a = i / 72 * Math.PI * 2; const r1 = 232; const r2 = i % 6 ? 238 : 248;
      add(ticks, 'line', { class: 'tick', x1: f(400 + Math.cos(a) * r1), y1: f(270 + Math.sin(a) * r1), x2: f(400 + Math.cos(a) * r2), y2: f(270 + Math.sin(a) * r2) });
    }

    const cx = 400, sy = 262, parts = [];
    // Wings: two fans of leaf-shaped feathers, raised.
    const N = 15;
    for (const side of [-1, 1]) {
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const ang = (-14 + t * 98) * Math.PI / 180;
        const len = 120 + 230 * Math.sin(Math.PI * (t * .82 + .1));
        const sx = cx + side * (14 + (1 - t) * 26), s0 = sy - t * 10;
        const ex = sx + side * len * Math.cos(ang), ey = s0 - len * Math.sin(ang);
        const mx = (sx + ex) / 2, my = (s0 + ey) / 2;
        const px = side * Math.sin(ang), py = Math.cos(ang);
        const c1x = mx + px * len * .2, c1y = my + py * len * .2;
        const c2x = mx + px * len * .07, c2y = my + py * len * .07;
        parts.push({ cls: 'feather stroke', d: `M${f(sx)} ${f(s0)} Q${f(c1x)} ${f(c1y)} ${f(ex)} ${f(ey)} Q${f(c2x)} ${f(c2y)} ${f(sx)} ${f(s0)}Z`, delay: .3 + (1 - t) * .9 + (side > 0 ? .05 : 0) });
      }
    }
    // Tail: flames falling away in S-curves.
    for (let j = -4; j <= 4; j++) {
      const ex = cx + j * 34, ey = 560 + (4 - Math.abs(j)) * 10;
      parts.push({ cls: 'stroke', d: `M${cx} 372 C${f(cx + j * 6)} 430 ${f(cx + j * 44)} 470 ${f(cx + j * 22)} 505 S${f(ex - j * 6)} 545 ${f(ex)} ${f(ey)}`, delay: 1.2 + Math.abs(j) * .08 });
    }
    // Body, head, crest.
    parts.push({ cls: 'body stroke', d: `M${cx} 206 C${cx + 26} 252 ${cx + 22} 330 ${cx} 384 C${cx - 22} 330 ${cx - 26} 252 ${cx} 206Z`, delay: .1 });
    parts.push({ cls: 'body stroke', d: `M${cx} 168 C${cx + 12} 178 ${cx + 11} 196 ${cx} 210 C${cx - 11} 196 ${cx - 12} 178 ${cx} 168Z`, delay: .05 });
    for (const k of [-1, 0, 1]) parts.push({ cls: 'stroke', d: `M${cx} 170 Q${cx + k * 16} 140 ${cx + k * 34} ${k ? 118 : 104}`, delay: 1.6 });

    for (const p of parts) {
      const el = add(bird, 'path', { class: p.cls, d: p.d });
      if (reduced) continue;
      const L = el.getTotalLength();
      el.style.strokeDasharray = `${L} ${L}`; el.style.strokeDashoffset = L;
      el.style.transition = `stroke-dashoffset 2.2s cubic-bezier(.6,0,.2,1) ${p.delay}s, fill-opacity 2.4s ease ${p.delay + 1.2}s`;
    }
    add(bird, 'circle', { class: 'eye', cx, cy: 186, r: 2.2 });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$('path', bird).forEach((p) => (p.style.strokeDashoffset = 0));
      setTimeout(() => svg.classList.add('lit'), reduced ? 0 : 1600);
    }));
  }

  // ------------------------------------------------------------------ embers rising
  function embers(canvas) {
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, ps = [], raf = 0, visible = true;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(140, w / 9));
      ps = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: w / 2 + (Math.random() - .5) * w * (Math.random() < .6 ? .5 : 1.1), y: anywhere ? rand(0, h) : h + 10,
      vy: rand(.25, 1.1), sway: rand(.002, .01), ph: rand(0, 6.28), r: rand(.6, 2.2), life: rand(.4, 1),
      hue: Math.random() < .08 ? 'cream' : Math.random() < .5 ? 'gold' : 'ember'
    });
    const col = { cream: '255,236,200', gold: '246,206,130', ember: '255,110,50' };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }).observe(canvas);
    function draw(t) {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        p.y -= p.vy; p.x += Math.sin(t * p.sway * .1 + p.ph) * .35;
        const fade = Math.min(1, p.y / h * 1.6) * p.life;
        if (p.y < -10 || fade <= 0.01) { Object.assign(p, spawn(false)); continue; }
        const flick = .65 + .35 * Math.sin(t * .01 + p.ph * 7);
        const a = fade * flick;
        ctx.fillStyle = `rgba(${col[p.hue]},${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(${col[p.hue]},${a * .12})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    raf = requestAnimationFrame(draw);
  }

  // ------------------------------------------------------------------ manifesto: words light up with scroll
  const scrub = $('[data-scrub]');
  if (scrub) {
    const HOT = /^(own|computer|stay|with|you\.|see\.)$/i;
    scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map((w) => `<span class="w${HOT.test(w) ? ' h' : ''}">${w}</span>`).join(' ');
    const words = $$('.w', scrub);
    const update = () => {
      const r = scrub.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .82 - r.top) / (r.height + innerHeight * .35)));
      const n = reduced ? words.length : Math.round(p * words.length);
      words.forEach((w, i) => { w.classList.toggle('on', i < n); w.classList.toggle('hot', i < n && w.classList.contains('h')); });
    };
    update(); addEventListener('scroll', update, { passive: true }); addEventListener('resize', update);
  }

  // ------------------------------------------------------------------ sovereign graph (pixel field)
  const EVENTS = [
    { time: '09:12', who: 'M. REYES · LEGAL', q: '“Summarise the change-of-control risks in term sheet v7.”', ok: true, r: 'Answered on-prem in 2.4 s', tags: [['p', 'M. Reyes · Level III'], ['', 'Term sheet v7'], ['', 'Board · SECRET']], foot: '0 bytes left the network' },
    { time: '09:31', who: 'A. OKAFOR · SECURITY', q: '“Where does payments-core decrypt card numbers?”', ok: true, r: 'Traced to vault.py, line 31', tags: [['p', 'A. Okafor · Level IV'], ['', 'payments-core'], ['', 'RESTRICTED']], foot: '412k lines indexed locally' },
    { time: '09:40', who: 'UNKNOWN DEVICE · 10.4.19.77', q: '“POST /v1/chat/completions”', ok: false, r: 'Denied at the perimeter. Not cleared.', tags: [['x', 'Unmanaged device'], ['x', 'No identity']], foot: 'Logged · 0 bytes served' },
    { time: '09:52', who: 'CLOUD AI PROVIDER', q: '“Requesting conversation data for model improvement.”', ok: false, r: 'No route. There is nothing to send.', tags: [['x', 'Outside the network']], foot: 'Telemetry: none' },
    { time: '10:05', who: 'M. REYES · LEGAL', q: '“Which Q4 numbers are material before earnings?”', ok: true, r: 'Answered on-prem in 3.1 s', tags: [['p', 'M. Reyes · Level III'], ['', 'Q4 forecast'], ['', 'MNPI']], foot: '0 bytes left the network' },
    { time: '10:18', who: 'J. LINDQVIST · RESEARCH', q: '“Find adverse events in cohort Q3 over age 65.”', ok: true, r: '41 records matched. PHI stays on-site.', tags: [['p', 'J. Lindqvist · Level II'], ['', 'Cohort Q3'], ['', 'PHI']], foot: '18,204 records · never uploaded' },
    { time: '10:26', who: 'VENDOR SUPPORT', q: '“Need remote access to debug the model server.”', ok: false, r: 'Denied. Vendors hold no clearance.', tags: [['x', 'Third party'], ['x', 'Access revoked 14 Nov']], foot: 'Logged · 0 bytes served' }
  ];

  const viewport = $('#graph-viewport');
  const graph = $('#graph');
  if (viewport && graph) setupGraph();

  function setupGraph() {
    const W = 1200, H = 640, CELL = 4;
    const canvas = $('#graph-canvas'); const ctx = canvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fit = () => {
      const small = innerWidth <= 760;
      const s = small ? viewport.clientHeight / H : viewport.clientWidth / W;
      graph.style.transform = `scale(${s})`;
      if (small) { graph.style.width = W + 'px'; viewport.querySelector('.graph').style.marginRight = `${W * s - W}px`; viewport.scrollLeft = (W * s - viewport.clientWidth) * .42; }
      else graph.style.marginRight = '';
    };
    fit(); addEventListener('resize', fit);

    // Cells keyed by grid position; each has a base brightness, a distance (for pulses), a kind and an owner.
    const cells = new Map();
    const put = (x, y, base, d, kind, owner = -1) => {
      const gx = Math.round(x / CELL), gy = Math.round(y / CELL);
      if (gx < 0 || gy < 0 || gx * CELL > W || gy * CELL > H) return;
      const k = gx * 1000 + gy; const c = cells.get(k);
      if (c) { c.base = Math.min(1, Math.max(c.base, base) + .06); if (owner >= 0 && c.owner < 0) c.owner = owner; return; }
      cells.set(k, { x: gx * CELL, y: gy * CELL, base, d, kind, owner });
    };

    const core = $('#g-core');
    const CX = parseFloat(core.style.getPropertyValue('--x')), CY = parseFloat(core.style.getPropertyValue('--y'));
    const PERIM = parseFloat($('.g-perimeter').style.getPropertyValue('--x'));

    // Beams: every chip streams into the core.
    const chips = $$('.g-chip', graph);
    for (const chip of chips) {
      const x0 = chip.offsetLeft + chip.offsetWidth, y0 = chip.offsetTop + chip.offsetHeight / 2;
      const tx = CX - 30, ty = CY + rand(-22, 22);
      const L = Math.hypot(tx - x0, ty - y0), steps = Math.ceil(L / CELL);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps, x = x0 + (tx - x0) * t, y = y0 + (ty - y0) * t + Math.sin(t * Math.PI) * 6;
        const b = .4 + .55 * t;
        if (Math.random() < .85) put(x, y, b, i * CELL, 'beam');
        const spread = (1 - t) * 3 + 1;
        for (let k = 0; k < spread; k++) if (Math.random() < .35 * (1 - t * .6)) put(x + rand(-4, 4), y + rand(-6 * (1 - t) - 2, 6 * (1 - t) + 2), b * .5, i * CELL, 'beam');
      }
    }
    // Haze around the core where beams converge.
    for (let i = 0; i < 500; i++) {
      const a = rand(Math.PI * .5, Math.PI * 1.5), r = Math.pow(Math.random(), 1.8) * 120;
      put(CX - 30 + Math.cos(a) * r, CY + Math.sin(a) * r * .9, .5 * (1 - r / 130), 400 - r, 'beam');
    }

    // Tree: random walks from the core to every node inside the perimeter, with twigs.
    const nodes = $$('.g-node', graph);
    const walk = (x, y, tx, ty, owner, base0, thick, budget = 900) => {
      let d = 0;
      for (let s = 0; s < budget; s++) {
        const dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
        if (dist < CELL * 1.5) break;
        let ax = dx / dist + rand(-.9, .9), ay = dy / dist + rand(-.9, .9);
        const m = Math.hypot(ax, ay); x += ax / m * CELL; y += ay / m * CELL; d += CELL;
        const b = Math.max(.5, base0 - d / 1100);
        put(x, y, b, d, 'tree', owner);
        const th = Math.max(0, thick - d / 90);
        for (let k = 0; k < th; k++) put(x + rand(-5, 5), y + rand(-5, 5), b * .8, d, 'tree', owner);
        if (Math.random() < .07) twig(x, y, d, owner);
      }
    };
    const twig = (x, y, d0, owner) => {
      const ang = rand(-Math.PI / 2, Math.PI / 2) + (Math.random() < .2 ? Math.PI : 0); const len = rand(4, 22);
      let a = ang;
      for (let i = 0; i < len; i++) {
        a += rand(-.4, .4); x += Math.cos(a) * CELL; y += Math.sin(a) * CELL;
        put(x, y, rand(.18, .4), d0 + i * CELL, 'tree', owner);
      }
    };
    nodes.forEach((n, i) => {
      const nx = parseFloat(n.style.getPropertyValue('--x')), ny = parseFloat(n.style.getPropertyValue('--y'));
      n._xy = [nx, ny]; n._i = i;
      if (n.classList.contains('outside')) {
        // Outsiders reach for the core and die at the perimeter.
        let x = nx - 8, y = ny, d = 0;
        while (x > PERIM + 4) {
          const dx = CX - x, dy = CY - y, m = Math.hypot(dx, dy);
          x += (dx / m + rand(-.5, .5)) * CELL; y += (dy / m + rand(-.8, .8)) * CELL; d += CELL;
          if (Math.random() < .7) put(x, y, .35 + Math.random() * .15, d, 'out', i);
        }
        for (let k = 0; k < 26; k++) put(PERIM + rand(2, 10), y + rand(-14, 14), rand(.3, .8), d + 4, 'out', i);
      } else {
        walk(CX + 30, CY + rand(-12, 12), nx, ny, i, .95, 3);
        if (Math.random() < .6) walk(CX + 30, CY + rand(-20, 20), nx + rand(-30, 30), ny + rand(-30, 30), i, .7, 1, 300);
      }
    });
    for (let i = 0; i < 26; i++) walk(CX + 30, CY + rand(-20, 20), rand(620, 880), rand(90, 600), -1, .55, 1, rand(20, 70) | 0);
    // Unsorted dust across the field.
    for (let i = 0; i < 700; i++) put(rand(580, 890), rand(70, 610), rand(.05, .16), rand(0, 600), 'dust');
    for (let i = 0; i < 260; i++) put(rand(20, 520), rand(60, 610), rand(.03, .09), rand(0, 600), 'dust');

    const list = [...cells.values()];
    const linkCount = Math.round(list.filter((c) => c.kind === 'tree').length / 4.3);

    // Render loop.
    let hover = -1, raf = 0, visible = false, born = 0;
    const COLORS = { beam: [255, 106, 43], tree: [255, 120, 52], out: [255, 60, 50], dust: [190, 90, 50] };
    const draw = (now) => {
      if (!visible) { raf = 0; return; }
      raf = requestAnimationFrame(draw);
      if (!born) born = now;
      const t = (now - born) / 1000;
      const grow = reduced ? 1e9 : t * 520; // px of distance revealed per second
      ctx.clearRect(0, 0, W, H);
      for (const c of list) {
        let v = c.base;
        if (c.kind === 'beam') { if (c.d > grow) continue; v *= .72 + .5 * Math.pow(Math.max(0, Math.sin(c.d * .035 - t * 3.4)), 6) * 1.8; }
        else if (c.kind === 'tree') { if (c.d > grow - 380) continue; v *= .78 + .4 * Math.pow(Math.max(0, Math.sin(c.d * .03 - t * 2.6)), 5) * 1.9; }
        else if (c.kind === 'out') { if (grow < 900) continue; v *= .45 + .55 * Math.pow(Math.max(0, Math.sin(c.d * .05 - t * 3)), 4) * 1.6; }
        else v *= .7 + .3 * Math.sin(t * 2 + c.x * .07 + c.y * .05);
        if (hover >= 0) v = c.owner === hover ? 1 : v * .55;
        if (v <= .02) continue;
        let r, g, b;
        if (v > .82 && c.kind !== 'out') { r = 255; g = 230; b = 196; } else [r, g, b] = COLORS[c.kind];
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, v)})`;
        ctx.fillRect(c.x, c.y, CELL - 1, CELL - 1);
      }
      if (grow > 1100 && !graph.classList.contains('grown')) graph.classList.add('grown');
    };

    const links = $('[data-links]');
    let counted = false;
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        graph.classList.add('live');
        if (!raf) raf = requestAnimationFrame(draw);
        if (!counted) {
          counted = true; const t0 = performance.now();
          const step = (n) => { const p = Math.min(1, (n - t0) / 2600); links.textContent = Math.round(linkCount * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(step); };
          requestAnimationFrame(step);
        }
      }
    }, { threshold: .15 }).observe(viewport);

    // Event card: cycles on its own, follows hover.
    const card = $('#g-card');
    let ev = 0, timer = 0;
    const show = (i, node) => {
      const e = EVENTS[i];
      card.classList.add('swap');
      setTimeout(() => {
        $('[data-c-time]', card).textContent = e.time;
        $('[data-c-who]', card).textContent = e.who;
        $('[data-c-q]', card).textContent = e.q;
        const r = $('[data-c-r]', card); r.textContent = e.r; r.className = `g-card-r ${e.ok ? 'ok' : 'no'}`;
        $('[data-c-tags]', card).innerHTML = e.tags.map(([c, s]) => `<span class="${c}">${s}</span>`).join('');
        $('[data-c-foot]', card).textContent = e.foot;
        card.classList.remove('swap');
      }, 220);
      nodes.forEach((n) => n.classList.toggle('active', n === node));
    };
    const nodeFor = (i) => nodes.find((n) => +n.dataset.ev === i && !n.classList.contains('active')) || nodes.find((n) => +n.dataset.ev === i);
    const cycle = () => { ev = (ev + 1) % EVENTS.length; const n = nodeFor(ev); hover = n ? n._i : -1; show(ev, n); };
    const auto = () => { clearInterval(timer); timer = setInterval(cycle, 4200); };
    show(0, nodeFor(0)); hover = -1;
    setTimeout(() => { const n = nodeFor(0); if (n) { hover = n._i; n.classList.add('active'); } }, 2600);
    auto();
    for (const n of nodes) {
      const on = () => { clearInterval(timer); hover = n._i; ev = +n.dataset.ev; show(ev, n); };
      n.addEventListener('mouseenter', on); n.addEventListener('focus', on); n.addEventListener('click', on);
      n.addEventListener('mouseleave', auto); n.addEventListener('blur', auto);
    }
  }

  // ------------------------------------------------------------------ the four laws (auto-cycling tabs)
  const laws = $('#laws-ui');
  if (laws) {
    const tabs = $$('.law-tab', laws), panels = $$('.law-panel', laws);
    const DUR = 7000; let cur = 0, timer = 0, inView = false;
    laws.style.setProperty('--dur', DUR / 1000 + 's');
    const select = (i, focus) => {
      cur = i;
      tabs.forEach((t, k) => {
        const on = k === i; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
        const bar = $('.bar i', t); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      });
      panels.forEach((p, k) => (p.hidden = k !== i));
      if (focus) tabs[i].focus();
      schedule();
    };
    const schedule = () => { clearTimeout(timer); if (inView && !laws.classList.contains('paused') && !reduced) timer = setTimeout(() => select((cur + 1) % tabs.length), DUR); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { laws.classList.add('paused'); select(i); });
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); laws.classList.add('paused'); select((cur + d + tabs.length) % tabs.length, true); }
      });
    });
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) select(cur); else clearTimeout(timer); }, { threshold: .3 }).observe(laws);
  }
  // ------------------------------------------------------------------ flipping headline (languages + ciphers)
  const WORDS = [
    ['Think.', 'english · think'], ['Σκέψου.', 'ελληνικά · think'],['Guvax.', 'rot13 · think'],
    ['Create.', 'english · create'], ['創造。', '日本語 · create'], ['Xivzgv.', 'atbash · create'], ['Erschaffe.', 'deutsch · create'],
    ['Privacy.', 'english · privacy'], ['隐私。', '中文 · privacy'], ['Sulydfb.', 'caesar +3 · privacy'], ['Приватность.', 'русский · privacy'],
    ['Build.', 'english · build'],['Construye.', 'español · build'],
    ['Command.', 'english · command'], ['Impera.', 'latina · command'], ['명령.', '한국어 · command'],
    ['Own it.', 'english · own'], ['𓋹 𓂀 𓆣', 'hieroglyphs · life · sight · becoming']
  ];
  const flip = $('#flip');
  if (flip) {
    let wi = 0, timer = 0, running = false;
    const escC = (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c);
    const fit = () => {
      flip.style.fontSize = '';
      const max = flip.parentElement.clientWidth * 0.96;
      if (flip.scrollWidth > max) flip.style.fontSize = (parseFloat(getComputedStyle(flip).fontSize) * max / flip.scrollWidth) + 'px';
    };
    const scramble = (to, done) => {
      const target = [...to]; const from = [...flip.textContent];
      const len = Math.max(target.length, from.length);
      const frames = 22; let f = 0;
      const step = () => {
        f++;
        let html = '';
        for (let i = 0; i < len; i++) {
          const settle = Math.floor((i / len) * frames * 0.7) + Math.floor(frames * 0.3);
          if (f >= settle) { if (i < target.length) html += escC(target[i]); }
          else if (i < target.length || f < settle - 3) {
            const g = NOISE[(Math.random() * NOISE.length) | 0];
            html += HIERO.includes(g) ? '<i class="g">' + g + '</i>' : escC(g);
          }
        }
        flip.innerHTML = html; fit();
        if (f < frames) setTimeout(step, 34); else { flip.textContent = to; fit(); if (done) done(); }
      };
      step();
    };
    const next = () => {
      wi = (wi + 1) % WORDS.length;
      scramble(WORDS[wi][0]);
      timer = setTimeout(next, 2600);
    };
    const still = /[?&]still\b/.test(location.search); // ?still keeps "Think." (used for the link-preview image)
    const start = () => { if (running || reduced || still) return; running = true; timer = setTimeout(next, 2200); };
    const stop = () => { running = false; clearTimeout(timer); };
    fit(); addEventListener('resize', fit);
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(flip);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }

  // ------------------------------------------------------------------ hieroglyph friezes
  for (const track of $$('[data-frieze]')) {
    const line = [...HIERO].sort(() => Math.random() - 0.5).join('') + [...HIERO].sort(() => Math.random() - 0.5).join('');
    const unit = '<span>' + line + '</span><span class="sep">PANURGOS · ΠΑΝΟΥΡΓΟΣ</span>';
    track.innerHTML = unit.repeat(6);
  }
  // ------------------------------------------------------------------ signup panel (download gate)
  const dlg = $('#dlg');
  if (dlg) {
    const form = $('#dlg-form'), done = $('#dlg-done'), msg = $('#dlg-msg'), note = $('#dlg-note');
    const emailIn = $('#dlg-email'), consent = $('#dlg-consent'), notify = $('#dlg-notify'), submit = $('#dlg-submit');
    const radios = $$('input[name="platform"]', form);
    let lastFocus = null;

    if (!CFG.api) {
      // Service not live yet: keep the cards honest.
      for (const c of $$('.dl-card[data-dl-open]')) { c.classList.add('soon'); c.disabled = true; const em = $('em', c); if (em) em.textContent = 'Opening soon'; }
    }
    const setPlatform = (p) => {
      const r = radios.find((x) => x.value === p) || radios[0]; r.checked = true;
      note.hidden = r.value === 'win';
      submit.textContent = r.value === 'win' ? 'Send my link' : 'Verify my email';
    };
    radios.forEach((r) => r.addEventListener('change', () => setPlatform(r.value)));

    const open = (platform) => {
      if (!CFG.api) { location.hash = '#download'; return; }
      lastFocus = document.activeElement;
      form.hidden = false; done.hidden = true; msg.textContent = '';
      setPlatform(platform || os || 'win');
      dlg.hidden = false; document.body.classList.add('locked');
      requestAnimationFrame(() => { dlg.classList.add('open'); emailIn.focus(); });
    };
    const close = () => {
      dlg.classList.remove('open'); document.body.classList.remove('locked');
      setTimeout(() => { dlg.hidden = true; }, 250);
      lastFocus?.focus?.();
    };
    for (const b of $$('[data-dl-open]')) b.addEventListener('click', (e) => { if (!CFG.api && b.tagName === 'A') return; e.preventDefault(); open(b.dataset.os); });
    for (const b of $$('[data-dl-close]', dlg)) b.addEventListener('click', close);
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = $$('a[href], button:not([disabled]), input:not([disabled])', dlg).filter((n) => n.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    });

    // Google / GitHub: same panel choices, then a top-level redirect through the download service.
    const login = CFG.login || {};
    const oauthBtns = $$('[data-oauth]', dlg).filter((b) => login[b.dataset.oauth]);
    oauthBtns.forEach((b) => { b.hidden = false; });
    if (oauthBtns.length) {
      $('.oauth-or', dlg).hidden = false;
      $('.dlg-sub', form).textContent = 'Sign in with ' + oauthBtns.map((b) => (b.dataset.oauth === 'google' ? 'Google' : 'GitHub')).join(' or ') + ', or get a one-time link by email. No password, no tracking.';
    }
    for (const b of oauthBtns) b.addEventListener('click', () => {
      msg.textContent = '';
      if (!consent.checked) { msg.textContent = 'Please agree to the privacy terms to continue.'; consent.focus(); return; }
      const platform = radios.find((r) => r.checked).value;
      const q = new URLSearchParams({ platform, notify: notify.checked ? '1' : '0', consent: '1' });
      b.disabled = true; b.querySelector('span').textContent = 'Opening ' + (b.dataset.oauth === 'google' ? 'Google' : 'GitHub') + '…';
      location.href = `${CFG.api}/auth/${b.dataset.oauth}?${q}`;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const email = emailIn.value.trim();
      if (!emailIn.checkValidity() || !email) { msg.textContent = 'Enter a valid email address.'; emailIn.focus(); return; }
      if (!consent.checked) { msg.textContent = 'Please agree to the privacy terms to continue.'; consent.focus(); return; }
      const platform = radios.find((r) => r.checked).value;
      submit.disabled = true; const label = submit.textContent; submit.textContent = 'Sending…';
      try {
        const res = await fetch(CFG.api + '/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, platform, notify: notify.checked, consent: true })
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) { msg.textContent = body.message || 'Something went wrong. Please try again.'; return; }
        $('#dlg-sent-to').textContent = email;
        form.hidden = true; done.hidden = false; $('button', done).focus();
      } catch {
        msg.textContent = "Couldn't reach the download service. Check your connection and try again.";
      } finally { submit.disabled = false; submit.textContent = label; }
    });
  }
})();
