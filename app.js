/* FINERI v2 — ARC CORE */
(function () {
  'use strict';
  const VERSION = '2.3';
  const CHANGELOG = [
    { v: '2.3', d: '2026-11-21', items: ['下地の絵を濃くして、はっきり見えるように'] },
    { v: '2.2', d: '2026-11-21', items: [
      '地球を下へ移動。ボタンの下で回る、軌道リングつき',
      'ぬーちゃんが画像ごと跳ねるのをやめた。かわりにホログラムが時々ゆらぐ',
      '色を16色に（緑と赤は水晶の合図用にとっておく）',
      'ガラスの下に fineri の絵2枚をうっすら写し込んだ'] },
    { v: '2.1', d: '2026-11-21', items: [
      'オプティマスのつながりを中央コアのまわりに集めて、目立つように',
      'よくつながっているメモほど大きく光る。線の上を光が走り、数秒ごとに中心から脈が広がる',
      'つながりを今のオプティマスに更新（37ノート／100リンク）'] },
    { v: '2.0', d: '2026-11-21', items: [
      '映画風の ARC CORE に作り直し',
      '中央に光る水晶。ビットコインか日経平均が1時間で±5%動くと、上がる=緑、下がる=赤（逆に動いたら半分ずつ）',
      'まわりのボタンを立体の八角形＋歯車に。よく使うボタンほど中央に寄る',
      '画面の上に地球。太陽と月が時刻に合わせて動く。満月の日は月が赤く光る',
      '背景全体にオプティマスのつながりが動く',
      'ぬーちゃんはホログラムに。押した時と毎日12時〜13時は元の姿',
      '色は シアン／アンバー／パープル／ブルー／ホワイト（緑と赤は水晶の合図用にとっておく）',
      '前のデザインは「見本一覧」の v1 で見られる'] },
    { v: '1.2', d: '2026-11-21', items: ['右上に「↻ 更新」ボタンを追加', '更新履歴（このページ）を追加'] },
    { v: '1.1', d: '2026-11-21', items: ['「無名と話す」に「いつもの部屋で話す」を追加', 'アプリが古い画面のままにならないよう修正'] },
    { v: '1.0', d: '2026-11-21', items: ['FINERI パネル誕生。ホーム画面からアプリとして使えるように'] }
  ];
  const load = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const TAU = Math.PI * 2;

  /* ---------- time (JST) ---------- */
  const jst = () => new Date(Date.now() + 9 * 3600e3);
  const pad = n => String(n).padStart(2, '0');
  const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  function tick() {
    const n = jst();
    $('time').textContent = pad(n.getUTCHours()) + ':' + pad(n.getUTCMinutes()) + ':' + pad(n.getUTCSeconds());
    $('date').textContent = n.getUTCFullYear() + '.' + pad(n.getUTCMonth() + 1) + '.' + pad(n.getUTCDate()) + ' (' + DAYS[n.getUTCDay()] + ')';
    nuClock(n);
  }

  /* ---------- tone ---------- */
  // 16 base colours. Pure green and red stay reserved for the crystal's market signal.
  const TONES = [['シアン', 195], ['アクア', 184], ['ティール', 172], ['スカイ', 206], ['ブルー', 222], ['インディゴ', 238], ['バイオレット', 254], ['パープル', 268],
    ['マゼンタ', 288], ['ピンク', 314], ['ローズ', 332], ['オレンジ', 24], ['アンバー', 38], ['ゴールド', 48], ['レモン', 62], ['ホワイト', 205, true]];
  let hue = 195, white = false;
  const tone = document.querySelector('.tone');
  function setTone(i) {
    const t = TONES[i] || TONES[0]; i = TONES.indexOf(t); hue = t[1]; white = !!t[2];
    root.style.setProperty('--h', hue);
    if (white) { root.style.setProperty('--c', 'hsl(205 40% 88%)'); root.style.setProperty('--c2', '#ffffff'); }
    else { root.style.removeProperty('--c'); root.style.removeProperty('--c2'); }
    tone.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    save('fineri.tone2', i);
  }
  TONES.forEach((t, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'ベース色 ' + t[0]);
    b.style.background = t[2] ? '#eef4fa' : 'hsl(' + t[1] + ' 100% 60%)'; b.addEventListener('click', () => setTone(i)); tone.append(b);
  });
  setTone(load('fineri.tone2', 0));
  const col = (a, l) => white ? 'hsla(205,45%,' + (l || 88) + '%,' + a + ')' : 'hsla(' + hue + ',100%,' + (l || 64) + '%,' + a + ')';

  /* ---------- canvases ---------- */
  function fit(cv) {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    const w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    return d;
  }

  /* ---------- Optimus synapse cluster (around the core) ---------- */
  // Real vault structure (graph.json: counts + links only). Laid out like Obsidian's graph,
  // centred on the core, so the connections read as a living brain behind the panel.
  let GRAPH = { n: 0, hub: 0, g: [], e: [] };
  const field = $('field'), fx = field.getContext('2d'), stageEl = $('stage');
  let lay = [], deg = [], maxDeg = 1, pulses = [], waves = [], dust = [], nextWave = 0;
  function layout() {
    const N = GRAPH.n; let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    deg = new Array(N).fill(0); GRAPH.e.forEach(([a, b]) => { deg[a]++; deg[b]++; }); maxDeg = Math.max(1, ...deg);
    const p = []; for (let i = 0; i < N; i++) { const a = rnd() * TAU, r = .2 + rnd() * .8; p.push([Math.cos(a) * r, Math.sin(a) * r]); }
    p[GRAPH.hub] = [0, 0];
    for (let it = 0; it < 420; it++) {
      const f = p.map(() => [0, 0]), k = .16;
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1], d2 = dx * dx + dy * dy + 1e-4, F = k * k / d2 * .9;
        f[i][0] += dx * F; f[i][1] += dy * F; f[j][0] -= dx * F; f[j][1] -= dy * F;
      }
      GRAPH.e.forEach(([a, b]) => { const dx = p[a][0] - p[b][0], dy = p[a][1] - p[b][1], d = Math.hypot(dx, dy) + 1e-4, F = d / k * .06;
        f[a][0] -= dx * F; f[a][1] -= dy * F; f[b][0] += dx * F; f[b][1] += dy * F; });
      const cool = .06 * (1 - it / 420) + .004;
      for (let i = 0; i < N; i++) { if (i === GRAPH.hub) continue;
        f[i][0] -= p[i][0] * .05; f[i][1] -= p[i][1] * .05; // gravity
        const m = Math.hypot(f[i][0], f[i][1]) || 1, st = Math.min(m, cool);
        p[i][0] += f[i][0] / m * st; p[i][1] += f[i][1] / m * st; }
    }
    // spread into a ring around the core: keep each note's direction order and its near/far order from the layout,
    // but even them out so the whole ring is used and nothing hides behind the core
    const ids = [...Array(N).keys()].filter(i => i !== GRAPH.hub);
    const ang = ids.map(i => Math.atan2(p[i][1], p[i][0])), dis = ids.map(i => Math.hypot(p[i][0], p[i][1]));
    const byA = ids.map((_, k) => k).sort((x, y) => ang[x] - ang[y]), byD = ids.map((_, k) => k).sort((x, y) => dis[x] - dis[y]);
    const aR = [], dR = []; byA.forEach((k, r) => aR[k] = r); byD.forEach((k, r) => dR[k] = r);
    lay = new Array(N);
    ids.forEach((i, k) => { const A = (aR[k] + .5) / ids.length * TAU + (rnd() - .5) * .12, R = .31 + dR[k] / ids.length * .27 + (rnd() - .5) * .03;
      lay[i] = { x: Math.cos(A) * R, y: Math.sin(A) * R, ph: rnd() * TAU, sp: .3 + rnd() * .5 }; });
    lay[GRAPH.hub] = { x: 0, y: 0, ph: 0, sp: 0 };
    dust = []; for (let i = 0; i < 40; i++) dust.push({ x: rnd(), y: rnd(), ph: rnd() * TAU });
  }
  function drawField(t) {
    const d = fit(field), W = field.width, H = field.height; fx.clearRect(0, 0, W, H);
    // faint far-away dust over the whole screen
    dust.forEach(p => { fx.fillStyle = col(.08 + .06 * Math.sin(t * .001 + p.ph)); fx.beginPath(); fx.arc(p.x * W, p.y * H, 1 * d, 0, TAU); fx.fill(); });
    if (!lay.length) return;
    const sr = stageEl.getBoundingClientRect(), cx0 = (sr.left + sr.width / 2) * d, cy0 = (sr.top + sr.height / 2) * d;
    const RAD = sr.width * d, rot = reduce ? 0 : t * .000025, cs = Math.cos(rot), sn = Math.sin(rot);
    const P = lay.map(n => { const wob = .008, x = n.x + Math.sin(t * .0004 * n.sp + n.ph) * wob, y = n.y + Math.cos(t * .00035 * n.sp + n.ph) * wob;
      return [cx0 + (x * cs - y * sn) * RAD, cy0 + (x * sn + y * cs) * RAD]; });
    // heartbeat: a wave leaves the hub every few seconds and lights the links it reaches
    if (!reduce && t > nextWave) { waves.push(t); nextWave = t + 4200; }
    waves = waves.filter(w => t - w < 2200);
    const hubP = P[GRAPH.hub], waveLit = (x, y) => { let v = 0; waves.forEach(w => { const r = (.24 + (t - w) / 2200 * .42) * RAD, dd = Math.abs(Math.hypot(x - hubP[0], y - hubP[1]) - r); v = Math.max(v, Math.max(0, 1 - dd / (RAD * .06)) * (1 - (t - w) / 2200)); }); return v; };
    // keep the crystal chamber clear: draw only outside it
    fx.save(); fx.beginPath(); fx.rect(0, 0, W, H); fx.arc(cx0, cy0, sr.width * .26 * d, 0, TAU, true); fx.clip();
    // links: glow underlay + bright core line
    fx.lineCap = 'round';
    GRAPH.e.forEach(([a, b]) => {
      const A = P[a], B = P[b], w = (deg[a] + deg[b]) / (2 * maxDeg), lit = waveLit((A[0] + B[0]) / 2, (A[1] + B[1]) / 2);
      fx.strokeStyle = col(.10 + .18 * lit); fx.lineWidth = (4 + 3 * w) * d; fx.beginPath(); fx.moveTo(A[0], A[1]); fx.lineTo(B[0], B[1]); fx.stroke();
      fx.strokeStyle = col(.34 + .3 * w + .4 * lit, 72); fx.lineWidth = (1 + .9 * w) * d; fx.beginPath(); fx.moveTo(A[0], A[1]); fx.lineTo(B[0], B[1]); fx.stroke();
    });
    // light running along the links (comet with a tail)
    if (!reduce && GRAPH.e.length) for (let k = 0; k < 2; k++) if (Math.random() < .2 && pulses.length < 26) { const e = GRAPH.e[(Math.random() * GRAPH.e.length) | 0]; pulses.push({ a: e[Math.random() < .5 ? 0 : 1], e, k: 0, v: .008 + Math.random() * .008 }); }
    fx.globalCompositeOperation = 'lighter';
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]; p.k += p.v; if (p.k >= 1) { pulses.splice(i, 1); continue; }
      const A = P[p.a], B = P[p.e[0] === p.a ? p.e[1] : p.e[0]], x = A[0] + (B[0] - A[0]) * p.k, y = A[1] + (B[1] - A[1]) * p.k;
      const k0 = Math.max(0, p.k - .22), tx = A[0] + (B[0] - A[0]) * k0, ty = A[1] + (B[1] - A[1]) * k0;
      const g = fx.createLinearGradient(tx, ty, x, y); g.addColorStop(0, col(0)); g.addColorStop(1, col(.95, 82));
      fx.strokeStyle = g; fx.lineWidth = 2.4 * d; fx.beginPath(); fx.moveTo(tx, ty); fx.lineTo(x, y); fx.stroke();
      fx.fillStyle = col(1, 92); fx.shadowColor = col(1); fx.shadowBlur = 14 * d; fx.beginPath(); fx.arc(x, y, 2.4 * d, 0, TAU); fx.fill(); fx.shadowBlur = 0;
    }
    // nodes: size and glow by how many links they have
    lay.forEach((n, i) => {
      const w = deg[i] / maxDeg, x = P[i][0], y = P[i][1], lit = waveLit(x, y), r = (1.8 + 5 * Math.sqrt(w)) * d, br = .55 + .25 * Math.sin(t * .002 + n.ph) + .3 * lit;
      const g = fx.createRadialGradient(x, y, 0, x, y, r * 4.5); g.addColorStop(0, col(.35 * br + .2 * w)); g.addColorStop(1, col(0));
      fx.fillStyle = g; fx.beginPath(); fx.arc(x, y, r * 4.5, 0, TAU); fx.fill();
      fx.fillStyle = col(Math.min(1, .6 + .4 * br), 80); fx.beginPath(); fx.arc(x, y, r, 0, TAU); fx.fill();
    });
    fx.globalCompositeOperation = 'source-over'; fx.restore();
  }

  /* ---------- sky: globe, sun, moon ---------- */
  const sky = $('sky'), sx = sky.getContext('2d');
  const land = []; { let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // clustered points on a sphere → continents-like specks
    for (let c = 0; c < 9; c++) { const lat0 = (r() - .5) * 2.2, lon0 = r() * TAU; for (let k = 0; k < 60; k++) land.push([lat0 + (r() - .5) * .7, lon0 + (r() - .5) * 1.1]); } }
  function moonAge(date) { const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); return (((date - ref) / 864e5) % syn + syn) % syn; }
  function sunTimes(n) { // Tokyo, hours JST
    const start = Date.UTC(n.getUTCFullYear(), 0, 0), N = Math.floor((n - start) / 864e5);
    const decl = 23.44 * Math.sin(TAU * (284 + N) / 365) * Math.PI / 180, lat = 35.68 * Math.PI / 180;
    const H = Math.acos(Math.max(-1, Math.min(1, -Math.tan(lat) * Math.tan(decl)))) * 180 / Math.PI / 15;
    const noon = 11.68; return [noon - H, noon + H];
  }
  function drawSky(t) {
    const d = fit(sky), W = sky.width, H = sky.height; sx.clearRect(0, 0, W, H);
    const n = jst(), hr = n.getUTCHours() + n.getUTCMinutes() / 60 + n.getUTCSeconds() / 3600;
    const arcY = f => H * .92 - Math.sin(Math.PI * f) * H * .78;
    const arcX = f => W * (.06 + .88 * f);
    // sun
    const [rise, set] = sunTimes(n); const sf = (hr - rise) / (set - rise);
    if (sf > 0 && sf < 1) {
      const x = arcX(sf), y = arcY(sf), r = 13 * d;
      const g = sx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(255,240,200,.9)'); g.addColorStop(.25, 'rgba(255,200,120,.35)'); g.addColorStop(1, 'rgba(255,180,80,0)');
      sx.fillStyle = g; sx.beginPath(); sx.arc(x, y, r * 4, 0, TAU); sx.fill();
      sx.fillStyle = '#fff6dc'; sx.beginPath(); sx.arc(x, y, r, 0, TAU); sx.fill();
      sx.strokeStyle = 'rgba(255,220,150,.5)'; sx.lineWidth = 1 * d; sx.setLineDash([2 * d, 4 * d]);
      sx.beginPath(); sx.arc(x, y, r * 1.9, t * .0004, t * .0004 + TAU); sx.stroke(); sx.setLineDash([]);
    }
    // moon
    const age = moonAge(Date.now()), transit = 12 + age * 24 / 29.530588853;
    let mf = ((hr - (transit - 6.2)) % 24 + 24) % 24 / 12.4;
    const full = Math.abs(age - 14.77) < 1.0;
    $('stSky').textContent = full ? '満月' : '月齢 ' + age.toFixed(1);
    if (mf > 0 && mf < 1) {
      const x = arcX(mf), y = arcY(mf), r = 11 * d;
      const glow = full ? 'rgba(255,60,70,' : 'rgba(200,225,255,';
      const g = sx.createRadialGradient(x, y, 0, x, y, r * (full ? 5 : 3.2)); g.addColorStop(0, glow + (full ? '.75)' : '.45)')); g.addColorStop(1, glow + '0)');
      sx.fillStyle = g; sx.beginPath(); sx.arc(x, y, r * (full ? 5 : 3.2), 0, TAU); sx.fill();
      // phase: lit disc, then shade the dark side
      const ph = age / 29.530588853, k = Math.cos(ph * TAU), waxing = ph < .5;
      const lit = full ? '#ff5a62' : '#e8f0ff', dark = 'rgba(8,16,30,.96)';
      sx.fillStyle = lit; sx.beginPath(); sx.arc(x, y, r, 0, TAU); sx.fill();
      sx.fillStyle = dark; sx.beginPath(); sx.arc(x, y, r, Math.PI / 2, -Math.PI / 2, !waxing); sx.fill();
      sx.fillStyle = k > 0 ? dark : lit; sx.beginPath(); sx.ellipse(x, y, Math.abs(k) * r + .01, r, 0, 0, TAU); sx.fill();
    }
  }

  /* ---------- earth (bottom, under the buttons) ---------- */
  const earthCv = $('earth'), ex = earthCv.getContext('2d');
  function drawEarth(t) {
    const d = fit(earthCv), W = earthCv.width, H = earthCv.height; ex.clearRect(0, 0, W, H);
    const R = Math.min(W * .43, H * 1.05), gx = W / 2, gy = H * .3 + R; // dome rising from below
    // orbit rings around the planet
    ex.lineWidth = 1 * d;
    [[1.5, .2, .22], [1.28, .16, .3], [1.75, .26, .14]].forEach(([k, f, a], i) => {
      ex.strokeStyle = col(a); if (i === 2) ex.setLineDash([3 * d, 6 * d]);
      ex.beginPath(); ex.ellipse(gx, gy - R * .62, R * k, R * k * f, 0, 0, TAU); ex.stroke(); ex.setLineDash([]); });
    const sweep = reduce ? 0 : (t * .0006) % TAU;
    ex.fillStyle = col(.9, 85); ex.beginPath(); ex.arc(gx + Math.cos(sweep) * R * 1.5, gy - R * .62 + Math.sin(sweep) * R * 1.5 * .2, 2 * d, 0, TAU); ex.fill();
    ex.save();
    const halo = ex.createRadialGradient(gx, gy, R * .9, gx, gy, R * 1.12); halo.addColorStop(0, col(0)); halo.addColorStop(.5, col(.35)); halo.addColorStop(1, col(0));
    ex.fillStyle = halo; ex.beginPath(); ex.arc(gx, gy, R * 1.12, 0, TAU); ex.fill();
    const body = ex.createRadialGradient(gx, gy - R * .6, 0, gx, gy, R); body.addColorStop(0, col(.22, 30)); body.addColorStop(1, 'rgba(0,4,10,.95)');
    ex.fillStyle = body; ex.beginPath(); ex.arc(gx, gy, R, 0, TAU); ex.fill();
    ex.beginPath(); ex.arc(gx, gy, R, 0, TAU); ex.clip();
    const rot = reduce ? 0 : t * .00004, tilt = .42;
    const proj = (lat, lon) => { const x = Math.cos(lat) * Math.sin(lon + rot), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon + rot);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt); return [gx + x * R, gy - y2 * R, z2]; };
    ex.lineWidth = 1 * d;
    for (let lo = 0; lo < 12; lo++) { ex.strokeStyle = col(.18); ex.beginPath(); let pen = false;
      for (let la = -1.5; la <= 1.5; la += .06) { const p = proj(la, lo * Math.PI / 6); if (p[2] < 0) { pen = false; continue; } pen ? ex.lineTo(p[0], p[1]) : ex.moveTo(p[0], p[1]); pen = true; } ex.stroke(); }
    for (let la = -60; la <= 60; la += 20) { ex.strokeStyle = col(.15); ex.beginPath(); let pen = false;
      for (let lo = 0; lo <= TAU + .05; lo += .05) { const p = proj(la * Math.PI / 180, lo); if (p[2] < 0) { pen = false; continue; } pen ? ex.lineTo(p[0], p[1]) : ex.moveTo(p[0], p[1]); pen = true; } ex.stroke(); }
    land.forEach(([la, lo]) => { const p = proj(la, lo); if (p[2] < .05) return; ex.fillStyle = col(.25 + .55 * p[2], 72); ex.fillRect(p[0], p[1], 1.6 * d, 1.6 * d); });
    ex.restore();
    ex.strokeStyle = col(.8); ex.lineWidth = 1.5 * d; ex.shadowColor = col(1); ex.shadowBlur = 14 * d;
    ex.beginPath(); ex.arc(gx, gy, R, Math.PI * 1.1, Math.PI * 1.9); ex.stroke(); ex.shadowBlur = 0;
  
  }

  /* ---------- core: rings + crystal ---------- */
  const core = $('core'), cx = core.getContext('2d');
  let signal = { btc: 0, nk: 0, test: null };
  function crystalMode() {
    if (signal.test !== null) return signal.test;
    const s = [signal.btc, signal.nk].filter(v => Math.abs(v) >= 5);
    if (!s.length) return '';
    const up = s.some(v => v > 0), down = s.some(v => v < 0);
    return up && down ? 'split' : up ? 'up' : 'down';
  }
  function gem(c, cy, R, rot, fillFor) {
    const ring = [], top = [c, cy - R * 1.25], bot = [c, cy + R * 1.05], crown = [];
    for (let i = 0; i < 8; i++) { const a = rot + i * TAU / 8; ring.push([c + Math.cos(a) * R * .78, cy - R * .1 + Math.sin(a) * R * .2, Math.sin(a)]);
      crown.push([c + Math.cos(a) * R * .42, cy - R * .62 + Math.sin(a) * R * .1, Math.sin(a)]); }
    const faces = [];
    for (let i = 0; i < 8; i++) { const j = (i + 1) % 8, z = (ring[i][2] + ring[j][2]) / 2;
      faces.push({ p: [crown[i], crown[j], ring[j], ring[i]], z, l: .55 + .45 * Math.cos(rot + (i + .5) * TAU / 8 - 2.2) });
      faces.push({ p: [ring[i], ring[j], bot], z: z - .01, l: .35 + .4 * Math.cos(rot + (i + .5) * TAU / 8 - 2.2) });
      faces.push({ p: [crown[i], crown[j], top], z: z + .01, l: .6 + .4 * Math.cos(rot + (i + .5) * TAU / 8 - 2.6) }); }
    faces.sort((a, b) => a.z - b.z);
    faces.forEach(f => { cx.beginPath(); f.p.forEach((q, k) => k ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.closePath();
      cx.fillStyle = fillFor(Math.max(.15, f.l)); cx.fill(); cx.strokeStyle = 'rgba(255,255,255,.35)'; cx.lineWidth = .8; cx.stroke(); });
  }
  function drawCore(t) {
    const d = fit(core), W = core.width, c = W / 2, cy = W / 2, u = W / 540; cx.clearRect(0, 0, W, W);
    // outer gear
    cx.strokeStyle = col(.4); cx.lineWidth = 1.5 * u; cx.beginPath();
    const teeth = 44, rr = 146, rot0 = t * .00004;
    for (let k = 0; k < teeth * 2; k++) { const a1 = rot0 + k * Math.PI / teeth, a2 = rot0 + (k + 1) * Math.PI / teeth, r = (k % 2 ? rr : rr + 6) * u; cx.arc(c, cy, r, a1, a2); }
    cx.closePath(); cx.stroke();
    // ticks
    for (let k = 0; k < 120; k++) { const a = k * TAU / 120 - t * .00006, r1 = 132 * u, r2 = (k % 10 ? 136 : 141) * u;
      cx.strokeStyle = col(k % 10 ? .25 : .6); cx.lineWidth = 1 * u; cx.beginPath(); cx.moveTo(c + r1 * Math.cos(a), cy + r1 * Math.sin(a)); cx.lineTo(c + r2 * Math.cos(a), cy + r2 * Math.sin(a)); cx.stroke(); }
    // slow rotating glowing segments (thick, beveled look)
    const segRot = reduce ? 0 : t * .00007;
    for (let k = 0; k < 8; k++) { const s = k * TAU / 8 + segRot;
      cx.lineCap = 'butt'; cx.shadowColor = col(1); cx.shadowBlur = 18 * u;
      cx.lineWidth = 12 * u; cx.strokeStyle = col(.95); cx.beginPath(); cx.arc(c, cy, 118 * u, s + .07, s + TAU / 8 - .07); cx.stroke();
      cx.shadowBlur = 0; cx.lineWidth = 3 * u; cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.beginPath(); cx.arc(c, cy, 122 * u, s + .09, s + TAU / 8 - .09); cx.stroke(); }
    // counter ring
    cx.setLineDash([4 * u, 6 * u]); cx.strokeStyle = col(.5); cx.lineWidth = 1.2 * u; cx.beginPath(); cx.arc(c, cy, 100 * u, -t * .00012, -t * .00012 + TAU); cx.stroke(); cx.setLineDash([]);
    // inner metal bezel (3D)
    const bz = cx.createLinearGradient(c - 92 * u, cy - 92 * u, c + 92 * u, cy + 92 * u);
    bz.addColorStop(0, col(.9, 80)); bz.addColorStop(.35, col(.6, 35)); bz.addColorStop(.7, 'rgba(0,8,18,1)'); bz.addColorStop(1, col(.6, 40));
    cx.lineWidth = 10 * u; cx.strokeStyle = bz; cx.beginPath(); cx.arc(c, cy, 90 * u, 0, TAU); cx.stroke();
    // bolts on the bezel
    for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + Math.PI / 6; const bx = c + 90 * u * Math.cos(a), by = cy + 90 * u * Math.sin(a);
      const bg = cx.createRadialGradient(bx - 1 * u, by - 1 * u, 0, bx, by, 4 * u); bg.addColorStop(0, '#fff'); bg.addColorStop(1, col(.8, 30));
      cx.fillStyle = bg; cx.beginPath(); cx.arc(bx, by, 3.4 * u, 0, TAU); cx.fill(); }
    // chamber glow
    const mode = crystalMode();
    const hueOf = m => m === 'up' ? 145 : m === 'down' ? 352 : null;
    const glowCol = (a, m) => { const h = hueOf(m); return h === null ? col(a) : 'hsla(' + h + ',100%,60%,' + a + ')'; };
    const pulse = mode ? (.75 + .25 * Math.sin(t * .006)) : (.85 + .15 * Math.sin(t * .002));
    const halo = (m) => { const g = cx.createRadialGradient(c, cy, 0, c, cy, 86 * u); g.addColorStop(0, glowCol(.55 * pulse, m)); g.addColorStop(.6, glowCol(.15, m)); g.addColorStop(1, glowCol(0, m)); return g; };
    if (mode === 'split') {
      cx.save(); cx.beginPath(); cx.rect(0, 0, c, W); cx.clip(); cx.fillStyle = halo('up'); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); cx.restore();
      cx.save(); cx.beginPath(); cx.rect(c, 0, c, W); cx.clip(); cx.fillStyle = halo('down'); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); cx.restore();
    } else { cx.fillStyle = halo(mode); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); }
    // crystal
    const rot = reduce ? .4 : t * .0005, bob = reduce ? 0 : Math.sin(t * .0015) * 3 * u;
    const fillFor = m => l => { const h = hueOf(m); return h === null ? (white ? 'hsla(205,40%,' + (40 + 50 * l) + '%,.92)' : 'hsla(' + hue + ',100%,' + (28 + 50 * l) + '%,.92)') : 'hsla(' + h + ',100%,' + (25 + 45 * l) + '%,.94)'; };
    cx.shadowColor = glowCol(1, mode === 'split' ? '' : mode); cx.shadowBlur = 30 * u;
    if (mode === 'split') {
      cx.save(); cx.beginPath(); cx.rect(0, 0, c, W); cx.clip(); gem(c, cy + bob, 46 * u, rot, fillFor('up')); cx.restore();
      cx.save(); cx.beginPath(); cx.rect(c, 0, c, W); cx.clip(); gem(c, cy + bob, 46 * u, rot, fillFor('down')); cx.restore();
      cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 1.5 * u; cx.beginPath(); cx.moveTo(c, cy - 60 * u + bob); cx.lineTo(c, cy + 50 * u + bob); cx.stroke();
    } else gem(c, cy + bob, 46 * u, rot, fillFor(mode));
    cx.shadowBlur = 0;
    // sparkle
    const sp = (Math.sin(t * .003) + 1) / 2; cx.fillStyle = 'rgba(255,255,255,' + (.3 + .6 * sp) + ')';
    cx.beginPath(); cx.arc(c - 14 * u, cy - 30 * u + bob, 2.2 * u, 0, TAU); cx.fill();
    // connectors to buttons
    cx.strokeStyle = col(.28); cx.lineWidth = 1 * u;
    BTNS.forEach(b => { const a = b.ang, r = b.r / 100 * 540; cx.beginPath(); cx.moveTo(c + 150 * u * Math.cos(a), cy + 150 * u * Math.sin(a)); cx.lineTo(c + (r - 50) * u * Math.cos(a), cy + (r - 50) * u * Math.sin(a)); cx.stroke(); });
  }

  /* ---------- gear buttons (move inward with use) ---------- */
  const ICONS = {
    talk: '<path d="M4 6h16v10H10l-5 4v-4H4z"/>',
    market: '<path d="M3 20h18M4 16l5-5 4 3 7-8"/><path d="M16 6h4v4"/>',
    keiba: '<path d="M6 20c1-5 3-8 6-9l-1-4 3 2 2-3 1 4c2 1 3 3 3 6l-2 1-2-2-2 2v3"/>',
    tasks: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M8 10l2 2 4-4M8 16h8"/>',
    memory: '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="6" r="1.6"/><circle cx="6" cy="19" r="1.6"/><circle cx="18" cy="18" r="1.6"/><path d="M6.3 7.2l4 3.3M17.7 7.2l-3.9 3.3M7.2 17.8l3.2-3.8M16.8 16.8l-3-2.9"/>',
    forest: '<path d="M12 3l-6 9h4l-6 8h16l-6-8h4z"/>'
  };
  const LABELS = [['talk', '無名'], ['market', '相場'], ['keiba', '競馬'], ['tasks', 'やること'], ['memory', '記憶庫'], ['forest', 'エルフの森']];
  const BTNS = [];
  let usage = load('fineri.usage', {});
  const gearPath = (() => { const n = 16, pts = []; for (let i = 0; i < n * 4; i++) { const a = i / (n * 4) * TAU, r = (i % 4 < 2) ? 50 : 45.5; pts.push((50 + r * Math.cos(a)).toFixed(2) + '% ' + (50 + r * Math.sin(a)).toFixed(2) + '%'); } return 'polygon(' + pts.join(',') + ')'; })();
  const stage = $('stage');
  LABELS.forEach(([key, label], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'gbtn'; b.dataset.open = key; b.setAttribute('aria-label', label);
    b.innerHTML = '<span class="gear" style="clip-path:' + gearPath + ';-webkit-clip-path:' + gearPath + '"></span><span class="rim"></span><span class="face"><svg viewBox="0 0 24 24">' + ICONS[key] + '</svg><span>' + label + '</span></span>';
    stage.append(b); BTNS.push({ el: b, key, ang: i * TAU / 6 - Math.PI / 2, r: 41 });
  });
  function placeButtons() {
    const max = Math.max(1, ...LABELS.map(([k]) => usage[k] || 0));
    BTNS.forEach(b => { const u = (usage[b.key] || 0) / max; b.r = 41 - 7 * Math.sqrt(u);
      b.el.style.left = (50 + b.r * Math.cos(b.ang)) + '%'; b.el.style.top = (50 + b.r * Math.sin(b.ang)) + '%'; });
  }
  placeButtons();

  /* ---------- sheet ---------- */
  const sheet = $('sheet'), veil = $('veil');
  const TITLES = { talk: ['COMMS', '無名と話す'], market: ['MARKET', '相場'], keiba: ['KEIBA', '競馬'], tasks: ['TASKS', 'やること'], memory: ['MEMORY', '記憶庫'], forest: ['FOREST', 'エルフの森'], updates: ['UPDATES', '更新履歴'] };
  let lastFocus = null;
  function openMod(name, from) {
    lastFocus = from || null;
    document.querySelectorAll('.mod').forEach(m => { m.hidden = m.dataset.mod !== name; });
    $('sheetEn').textContent = TITLES[name][0]; $('sheetJa').textContent = TITLES[name][1];
    sheet.classList.add('open'); veil.classList.add('open'); $('closeBtn').focus({ preventScroll: true });
    if (TITLES[name] && name !== 'updates') { usage[name] = (usage[name] || 0) + 1; save('fineri.usage', usage); setTimeout(placeButtons, 400); }
  }
  function closeMod() { sheet.classList.remove('open'); veil.classList.remove('open'); if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) { openMod(o.dataset.open, o); return; }
    const h = e.target.closest('[data-href]'); if (h) { location.href = h.dataset.href; }
  });
  $('closeBtn').addEventListener('click', closeMod); veil.addEventListener('click', closeMod);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheet.classList.contains('open')) closeMod(); });

  /* ---------- memos, tasks ---------- */
  ['memo-market', 'memo-keiba'].forEach(id => { const el = $(id); if (!el) return; el.value = load('fineri.' + id, ''); el.addEventListener('input', () => save('fineri.' + id, el.value)); });
  let tasks = load('fineri.tasks', [{ id: 't1', text: '例: 週末の重賞をチェック', done: false }]);
  function renderTasks() {
    const ul = $('tasks'); ul.textContent = '';
    tasks.slice().sort((a, b) => a.done - b.done).forEach(t => {
      const li = document.createElement('li'); if (t.done) li.className = 'done';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = t.done; cb.id = 'task-' + t.id; cb.setAttribute('aria-label', t.text);
      cb.addEventListener('change', () => { t.done = cb.checked; save('fineri.tasks', tasks); renderTasks(); if (cb.checked) nuSay('やったね！'); });
      const sp = document.createElement('span'); sp.textContent = t.text;
      const del = document.createElement('button'); del.type = 'button'; del.className = 'ghost'; del.textContent = '消す';
      del.addEventListener('click', () => { tasks = tasks.filter(x => x !== t); save('fineri.tasks', tasks); renderTasks(); });
      li.append(cb, sp, del); ul.append(li);
    });
    $('iTasks').textContent = 'やること ' + tasks.filter(t => !t.done).length + '件';
  }
  $('addTask').addEventListener('submit', e => { e.preventDefault(); const v = $('newTask').value.trim(); if (!v) return; tasks.push({ id: 't' + Date.now(), text: v, done: false }); save('fineri.tasks', tasks); $('newTask').value = ''; renderTasks(); });
  renderTasks();

  /* ---------- changelog + refresh ---------- */
  $('ver').textContent = VERSION; $('ver2').textContent = VERSION;
  CHANGELOG.forEach(e => { const li = document.createElement('li'); li.className = 'card'; const h = document.createElement('h3'); h.textContent = 'v' + e.v + '　' + e.d;
    const ul = document.createElement('ul'); e.items.forEach(x => { const i = document.createElement('li'); i.textContent = x; ul.append(i); }); li.append(h, ul); $('changelog').append(li); });
  async function hardRefresh(btn) {
    btn.disabled = true;
    try { if ('caches' in window) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); }
      if (navigator.serviceWorker) { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map(r => r.update().catch(() => {}))); } } catch (e) {}
    location.replace(location.pathname + '?r=' + Date.now());
  }
  ['refreshBtn', 'refreshBtn2', 'refreshBtn3'].forEach(id => { const b = $(id); if (b) b.addEventListener('click', e => hardRefresh(e.currentTarget)); });
  document.querySelectorAll('[data-test]').forEach(b => b.addEventListener('click', () => { signal.test = b.dataset.test === '' ? null : b.dataset.test; closeMod(); }));

  /* ---------- ぬーちゃん ---------- */
  const nu = $('nu'), say = $('nuSay'); let realUntil = 0, sayTimer = 0;
  function nuSay(text, ms) { say.textContent = text; say.classList.add('show'); clearTimeout(sayTimer); sayTimer = setTimeout(() => say.classList.remove('show'), ms || 2600); }
  function nuClock(n) { const h = n.getUTCHours(); nu.classList.toggle('is-real', h === 12 || Date.now() < realUntil); }
  nu.addEventListener('click', () => { realUntil = Date.now() + 6000; nuClock(jst()); nuSay(jst().getUTCHours() === 12 ? 'お昼はこの姿でいるね' : '……ちょっとだけ、本当の姿'); });
  const lines = ['きゅー', '森の見回り中', '……（しっぽふりふり）', 'fineri、あそぼ', 'ねむい……'];
  (function idle() { if (!reduce && !sheet.classList.contains('open')) { nu.classList.remove('glitch'); void nu.offsetWidth; nu.classList.add('glitch'); if (Math.random() < .4) nuSay(lines[(Math.random() * lines.length) | 0]); } setTimeout(idle, 8000 + Math.random() * 9000); })();
  const h0 = jst().getUTCHours();
  setTimeout(() => nuSay(h0 < 5 ? 'まだ起きてるの？' : h0 < 11 ? 'おはよ' : h0 < 18 ? 'おかえり' : 'おつかれ'), 1200);

  /* ---------- markets ---------- */
  const fmtPct = v => (v > 0 ? '+' : '') + v.toFixed(2) + '%';
  function show(idInfo, idSheetV, idSheetC, price, pct, unit) {
    const cls = pct >= 0 ? 'up' : 'down';
    $(idInfo).innerHTML = ''; const s = document.createElement('span'); s.className = cls; s.textContent = fmtPct(pct) + ' /1h'; $(idInfo).append(s);
    $(idSheetV).textContent = unit + Math.round(price).toLocaleString('ja-JP'); $(idSheetC).textContent = fmtPct(pct); $(idSheetC).className = cls;
  }
  async function btc() {
    try {
      const r = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=jpy&days=1', { cache: 'no-store' });
      const j = await r.json(); const p = j.prices; const last = p[p.length - 1]; const target = last[0] - 3600e3;
      let prev = p[0]; for (const q of p) { if (q[0] <= target) prev = q; else break; }
      const pct = (last[1] / prev[1] - 1) * 100; signal.btc = pct; show('iBtc', 'mBtc', 'mBtcC', last[1], pct, '¥');
    } catch (e) { $('iBtc').textContent = '取得できず'; }
  }
  async function nikkei() {
    try {
      const r = await fetch('https://raw.githubusercontent.com/yosizoueri-blip/fineri-panel/data/market.json?t=' + Date.now(), { cache: 'no-store' });
      const j = await r.json(); const n = j.nikkei; if (!n || !n.price) throw 0;
      signal.nk = n.age_min <= 90 ? n.change_1h : 0;
      show('iNk', 'mNk', 'mNkC', n.price, n.change_1h, '');
      if (n.market_open === false) { const s = document.createElement('span'); s.textContent = ' 休場'; s.style.color = 'var(--mut)'; $('iNk').append(s); }
    } catch (e) { $('iNk').textContent = '準備中'; }
  }
  btc(); nikkei(); setInterval(btc, 5 * 60e3); setInterval(nikkei, 5 * 60e3);

  /* ---------- boot ---------- */
  fetch('graph.json', { cache: 'no-store' }).then(r => r.json()).then(g => { GRAPH = g; layout(); $('stMem').textContent = g.n + ' NOTES / ' + g.e.length + ' LINKS'; }).catch(() => { $('stMem').textContent = '-'; });
  tick(); setInterval(tick, 1000);
  function frame(t) { drawField(t); drawSky(t); drawEarth(t); drawCore(t); if (!reduce) requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  if (reduce) setInterval(() => frame(performance.now()), 30000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
