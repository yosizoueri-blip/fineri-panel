/* FINERI v2 — ARC CORE */
(function () {
  'use strict';
  const VERSION = '3.5';
  const CHANGELOG = [
    { v: '3.5', d: '2026-11-21', items: ['下のバーに X と GAMES を追加（GAMES の中身はこれから）'] },
    { v: '3.4', d: '2026-11-21', items: ['歯車の歯を中くらいの高さの台形に。縁にふちどりと影を入れて立体的に', 'ボタンを押すと、ボタンが真ん中で大きくなってからページが開くように'] },
    { v: '3.3', d: '2026-11-21', items: ['ボタンは中だけガラスに。外の歯車と縁は金属に戻した', '歯車の歯を高く、角を立てた'] },
    { v: '3.2', d: '2026-11-21', items: ['中央のオプティマスの点を小さく、さらに暗く', 'ボタンをほぼ透明なガラスに'] },
    { v: '3.1', d: '2026-11-21', items: ['中央のオプティマスと地球・太陽・月をさらに薄く'] },
    { v: '3.0', d: '2026-11-21', items: ['地球・太陽・月を薄くして背景になじませた（メイン画面 完成）'] },
    { v: '2.9', d: '2026-11-21', items: [
      '地球をNASAの衛星写真ベースに（山の陰影、雲、夜側の街の灯り）',
      '月を本物の月面写真ベースに',
      'コアの光る輪を縦軸で回転。外側と内側が逆向き',
      '中央のオプティマスを控えめに',
      '筆記体をやめて元の字体に'] },
    { v: '2.8', d: '2026-11-21', items: [
      '地球・太陽・月をリアルに。地球は本物の海岸線と雲、太陽は地球の左うしろ、月は右手前で本物の満ち欠け',
      '太陽と月はスマホ幅の4分の1くらいの大きさで、データパネルの裏',
      '文字を筆記体に（数字は読みやすいまま）',
      'コアの内側にも光る輪を足して、外側と逆向きに回転',
      '中央の宝石＝fineri。オプティマスの線が宝石につながり、光が届くと宝石が明るくなる'] },
    { v: '2.7', d: '2026-11-21', items: ['太陽を地球の左、月を右に。空に出ている方が明るく光る（月は満ち欠けつき、満月は赤）', '天気で太陽と月がぼやける'] },
    { v: '2.6', d: '2026-11-21', items: [
      '頭の中のオプティマスを紅色に。肌の下で動いて見えるように',
      '中央コアのまわりのオプティマスを復活。頭の中と同じ光が走る（奥の脳が手前に映る）',
      '下の時計とボタンを、中心に向かって少し上向きに傾けた',
      '地球に本物の大陸と山脈。1時間で1回転',
      '中央の宝石をブリリアントカットに。中から光って、時々きらっと光が走る。まわりを2本の軌道が回る'] },
    { v: '2.5', d: '2026-11-21', items: [
      'スクロールなしで1画面に収まるように',
      '顔の絵を大きく、頭が画面の上に来るように。オプティマスは頭（脳）の中で光る',
      'fin の絵を外した',
      '太陽の輪郭をなくして天気に連動。曇りはぼやけて、晴れは太陽の方から光が差す。雨は細い雨すじ',
      '下の時計とボタンもデータパネル風に。ボタンは英語に',
      '相場のダブりを解消（相場は左のパネルだけ）',
      '色は右上の COLOR ボタンから選ぶ形に'] },
    { v: '2.4', d: '2026-11-21', items: [
      '斜めに浮かぶデータパネルを追加（英語だけ）：相場 BTC／N225／KIOXIA／SPACEX、来週の重賞、動くテレメトリ',
      '左上の4つと日付もデータパネルに',
      '下地の絵をもっと濃く。肌のところは少し透けるように'] },
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
    const st = sunTimes(n), hm = h => pad(Math.floor(h)) + ':' + pad(Math.round(h % 1 * 60) % 60); $('date').textContent = 'RISE ' + hm(st[0]) + '  SET ' + hm(st[1]);
    nuClock(n);
    $('sDate').textContent = n.getUTCFullYear() + '.' + pad(n.getUTCMonth() + 1) + '.' + pad(n.getUTCDate()) + ' ' + ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][n.getUTCDay()];
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
    b.style.background = t[2] ? '#eef4fa' : 'hsl(' + t[1] + ' 100% 60%)'; b.addEventListener('click', () => { setTone(i); tone.hidden = true; }); tone.append(b);
  });
  setTone(load('fineri.tone2', 0));
  $('toneBtn').addEventListener('click', () => { tone.hidden = !tone.hidden; $('toneBtn').setAttribute('aria-expanded', String(!tone.hidden)); });
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
  const field = $('field'), fx = field.getContext('2d'), faceEl = document.querySelector('.backdrop .face');
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
    lay = new Array(N); ring = new Array(N);
    ids.forEach((i, k) => { const A = (aR[k] + .5) / ids.length * TAU + (rnd() - .5) * .15, j = rnd() - .5, ph = rnd() * TAU, sp = .3 + rnd() * .5;
      const Rb = .18 + Math.sqrt((dR[k] + .5) / ids.length) * .8 + j * .04, Rr = .31 + dR[k] / ids.length * .27 + j * .03;
      lay[i] = { x: Math.cos(A) * Rb, y: Math.sin(A) * Rb, ph, sp }; ring[i] = { x: Math.cos(A) * Rr, y: Math.sin(A) * Rr, ph, sp }; });
    lay[GRAPH.hub] = ring[GRAPH.hub] = { x: 0, y: 0, ph: 0, sp: 0 };
    dust = []; for (let i = 0; i < 40; i++) dust.push({ x: rnd(), y: rnd(), ph: rnd() * TAU });
  }
  let ring = [], gemFlash = 0;
  const brainCv = $('brain'), bx = brainCv.getContext('2d'), linkCv = $('links'), lx = linkCv.getContext('2d');
  const crim = (a, l) => 'hsla(350,82%,' + (l || 40) + '%,' + a + ')';
  // one graph, two places: the brain under the skin (crimson) and the ring around the core (base colour).
  // The same pulses run through both, so the core mirrors what moves in the head.
  function drawGraph(g, d, P, sc, RAD, colour, t, nodeK = 1) {
    const hubP = P[GRAPH.hub], waveLit = (x, y) => { let v = 0; waves.forEach(w => { const k = (t - w) / 2200, r = k * 1.1 * RAD, dd = Math.abs(Math.hypot(x - hubP[0], y - hubP[1]) - r); v = Math.max(v, Math.max(0, 1 - dd / (RAD * .12)) * (1 - k)); }); return v; };
    g.lineCap = 'round';
    GRAPH.e.forEach(([a, b]) => {
      const A = P[a], B = P[b], w = (deg[a] + deg[b]) / (2 * maxDeg), lit = waveLit((A[0] + B[0]) / 2, (A[1] + B[1]) / 2);
      g.strokeStyle = colour(.10 + .18 * lit); g.lineWidth = (4 + 3 * w) * d * sc; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
      g.strokeStyle = colour(.34 + .3 * w + .4 * lit, 72); g.lineWidth = (1 + .9 * w) * d * sc; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
    });
    g.globalCompositeOperation = 'lighter';
    pulses.forEach(p => {
      const A = P[p.a], B = P[p.e[0] === p.a ? p.e[1] : p.e[0]], x = A[0] + (B[0] - A[0]) * p.k, y = A[1] + (B[1] - A[1]) * p.k;
      const k0 = Math.max(0, p.k - .22), tx = A[0] + (B[0] - A[0]) * k0, ty = A[1] + (B[1] - A[1]) * k0;
      const gr = g.createLinearGradient(tx, ty, x, y); gr.addColorStop(0, colour(0)); gr.addColorStop(1, colour(.95, 82));
      g.strokeStyle = gr; g.lineWidth = 2.4 * d * sc; g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
      g.fillStyle = colour(1, 92); g.shadowColor = colour(1); g.shadowBlur = 14 * d * nodeK; g.beginPath(); g.arc(x, y, 2.4 * d * sc * nodeK, 0, TAU); g.fill(); g.shadowBlur = 0;
    });
    lay.forEach((n, i) => {
      const w = deg[i] / maxDeg, x = P[i][0], y = P[i][1], lit = waveLit(x, y), r = (1.8 + 5 * Math.sqrt(w)) * d * sc * nodeK, br = .55 + .25 * Math.sin(t * .002 + n.ph) + .3 * lit;
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 4.5); gr.addColorStop(0, colour(.35 * br + .2 * w)); gr.addColorStop(1, colour(0));
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 4.5, 0, TAU); g.fill();
      g.fillStyle = colour(Math.min(1, .6 + .4 * br), 80); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    });
    g.globalCompositeOperation = 'source-over';
  }
  const place = (L, cx0, cy0, RX, RY, rot, t) => { const cs = Math.cos(rot), sn = Math.sin(rot);
    return L.map(n => { const wob = .02, x = n.x + Math.sin(t * .0004 * n.sp + n.ph) * wob, y = n.y + Math.cos(t * .00035 * n.sp + n.ph) * wob;
      return [cx0 + (x * cs - y * sn) * RX, cy0 + (x * sn + y * cs) * RY]; }); };
  function drawField(t) {
    const d = fit(field), W = field.width, H = field.height; fx.clearRect(0, 0, W, H);
    fit(brainCv); bx.clearRect(0, 0, brainCv.width, brainCv.height);
    dust.forEach(p => { fx.fillStyle = col(.08 + .06 * Math.sin(t * .001 + p.ph)); fx.beginPath(); fx.arc(p.x * W, p.y * H, 1 * d, 0, TAU); fx.fill(); });
    if (!lay.length) return;
    // shared heartbeat + pulses
    if (!reduce && t > nextWave) { waves.push(t); nextWave = t + 4200; }
    waves = waves.filter(w => t - w < 2200);
    if (!reduce && GRAPH.e.length) for (let k = 0; k < 2; k++) if (Math.random() < .2 && pulses.length < 26) { const e = GRAPH.e[(Math.random() * GRAPH.e.length) | 0]; pulses.push({ a: e[Math.random() < .5 ? 0 : 1], e, k: 0, v: .008 + Math.random() * .008 }); }
    for (let i = pulses.length - 1; i >= 0; i--) { const p = pulses[i]; p.k += p.v; if (p.k >= 1) { if ((p.e[0] === p.a ? p.e[1] : p.e[0]) === GRAPH.hub) gemFlash = 1; pulses.splice(i, 1); } }
    const rot = reduce ? 0 : t * .00004;
    // 1) the brain, under the skin of the face
    const fr = faceEl.getBoundingClientRect(), RX = fr.width * .24 * d, RY = fr.height * .12 * d;
    drawGraph(bx, d, place(lay, (fr.left + fr.width * .5) * d, (fr.top + fr.height * .245) * d, RX, RY, rot, t), Math.max(.7, Math.min(1.4, (RX + RY) / 2 / (110 * d))), (RX + RY) / 2, crim, t);
    // 2) its reflection: the ring around the core, wired into the crystal (the crystal is fineri, the hub note)
    const ld = fit(linkCv), LW = linkCv.width, lc = LW / 2; lx.clearRect(0, 0, LW, LW);
    lx.save(); lx.beginPath(); lx.rect(0, 0, LW, LW); lx.arc(lc, lc, LW * .085, 0, TAU, true); lx.clip();
    lx.globalAlpha = .12;
    drawGraph(lx, ld, place(ring, lc, lc, LW, LW, rot * .6, t), Math.max(.7, Math.min(1.2, LW / ld / 380)), LW * .45, col, t, .5);
    lx.globalAlpha = 1; lx.restore();
  }

  /* ---------- sky: globe, sun, moon ---------- */
  const sky = $('sky'), sx = sky.getContext('2d');
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
    const [rise, set] = sunTimes(n); const sf = (hr - rise) / (set - rise);
    // weather: drifting cloud veils and a few rain streaks, only as strong as the sky really is
    if (wx.cloud > .3) for (let i = 0; i < 5; i++) {
      const cx = ((i * .27 + t * .000008 * (1 + i * .3)) % 1.3 - .15) * W, cy = H * (.18 + (i % 3) * .14), rw = W * (.22 + (i % 2) * .1);
      const g = sx.createRadialGradient(cx, cy, 0, cx, cy, rw); g.addColorStop(0, 'rgba(150,170,195,' + (.16 * (wx.cloud - .3) / .7) + ')'); g.addColorStop(1, 'rgba(150,170,195,0)');
      sx.fillStyle = g; sx.save(); sx.translate(cx, cy); sx.scale(1, .32); sx.translate(-cx, -cy); sx.beginPath(); sx.arc(cx, cy, rw, 0, TAU); sx.fill(); sx.restore();
    }
    if (wx.rain && !reduce) { sx.strokeStyle = 'rgba(170,200,230,.22)'; sx.lineWidth = 1 * d; sx.beginPath();
      for (let i = 0; i < 26; i++) { const x = ((i * 97.3 + t * .05) % W), y = ((i * 53.1 + t * .6) % (H * 1.1)) - H * .05; sx.moveTo(x, y); sx.lineTo(x - 3 * d, y + 12 * d); } sx.stroke(); }
  }
  /* sunlight: when the sky is clear a warm light falls across the panel from the sun's side */
  let sunAt = null, lightN = 0; const lightEl = document.querySelector('.sunlight');
  function lightTick(up) {
    if (++lightN % 20) return;
    const k = up && sunAt ? (1 - wx.cloud) * (wx.rain ? .3 : 1) : 0;
    lightEl.style.opacity = (k * .9).toFixed(2);
    if (sunAt) { lightEl.style.setProperty('--sx', sunAt[0] + 'px'); lightEl.style.setProperty('--sy', sunAt[1] + 'px'); }
  }
  /* weather (Open-Meteo, free, no key). Tokyo by default. */
  const wx = { cloud: 0, rain: false, code: 0 };
  const WX_CODE = c => c === 0 ? 'CLEAR' : c <= 2 ? 'FAIR' : c === 3 ? 'OVERCAST' : c <= 48 ? 'FOG' : c <= 67 ? 'RAIN' : c <= 77 ? 'SNOW' : c <= 82 ? 'SHOWERS' : 'STORM';
  async function weather() {
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.77&current=cloud_cover,precipitation,weather_code,temperature_2m&timezone=Asia%2FTokyo', { cache: 'no-store' });
      const c = (await r.json()).current; wx.cloud = Math.min(1, (c.cloud_cover || 0) / 100); wx.rain = (c.precipitation || 0) > 0 || (c.weather_code >= 51 && c.weather_code <= 99); wx.code = c.weather_code;
      $('sWx').textContent = WX_CODE(c.weather_code) + ' ' + Math.round(c.temperature_2m) + '°C';
    } catch (e) { $('sWx').textContent = 'NO SIGNAL'; }
  }
  weather(); setInterval(weather, 15 * 60e3);

  /* ---------- earth (bottom, under the buttons) ---------- */
  const earthCv = $('earth'), ex = earthCv.getContext('2d');
  // realistic earth, sun and moon. Textures are made from Natural Earth coastlines (earth) and a procedural near-side map (moon).
  const tex = {}; function loadTex(name, src) { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0); tex[name] = g.getImageData(0, 0, im.width, im.height); earthCache.at = -1e9; moonCache.at = -1e9; }; im.src = src; }
  loadTex('earth', 'earth-tex.jpg'); loadTex('clouds', 'earth-clouds.webp'); loadTex('moon', 'moon-tex.webp'); loadTex('night', 'earth-night.webp');
  const earthCache = { at: 0, cv: document.createElement('canvas'), key: '' }, moonCache = { at: 0, cv: document.createElement('canvas'), key: '' };
  const LIGHT = (() => { const v = [-.78, .3, .55], m = Math.hypot(...v); return v.map(x => x / m); })(); // the sun sits to the upper left
  function renderEarth(R, top, H) {
    const E = tex.earth, C = tex.clouds; if (!E) return;
    const size = Math.ceil(R * 2), rows = Math.min(size, Math.ceil(H - top) + 2), cv = earthCache.cv; cv.width = size; cv.height = rows;
    const g = cv.getContext('2d'), img = g.createImageData(size, rows), o = img.data;
    const rot = (Date.now() / 3600e3 % 1) * TAU, drift = (Date.now() / 5400e3 % 1) * TAU, tilt = .12, ct = Math.cos(tilt), st = Math.sin(tilt);
    for (let py = 0; py < rows; py++) { const Y = 1 - (py + .5) / R;
      for (let px = 0; px < size; px++) { const X = (px + .5) / R - 1, r2 = X * X + Y * Y; if (r2 > 1) continue;
        const Z = Math.sqrt(1 - r2), y = Y * ct + Z * st, z = -Y * st + Z * ct, lat = Math.asin(Math.max(-1, Math.min(1, y)));
        let lon = Math.atan2(X, z) - rot; lon = ((lon + Math.PI) % TAU + TAU) % TAU;
        const tx = (lon / TAU * E.width) | 0, ty = Math.min(E.height - 1, ((Math.PI / 2 - lat) / Math.PI * E.height) | 0), i4 = (ty * E.width + tx) * 4;
        let r = E.data[i4], gg = E.data[i4 + 1], b = E.data[i4 + 2];
        const cxp = ((((lon + drift) % TAU) / TAU * C.width) | 0) % C.width, cy = Math.min(C.height - 1, ((Math.PI / 2 - lat) / Math.PI * C.height) | 0), ca = C.data[(cy * C.width + cxp) * 4] / 255 * .9;
        const dl = X * LIGHT[0] + Y * LIGHT[1] + Z * LIGHT[2], diff = Math.max(0, dl), lit = .035 + 1.1 * Math.pow(diff, .8);
        const N = tex.night, nightK = N ? Math.max(0, Math.min(1, (.08 - dl) * 8)) * N.data[(((ty / E.height * N.height) | 0) * N.width + ((tx / E.width * N.width) | 0)) * 4] / 255 : 0;
        // ocean glint
        const ocean = b > r + 25 ? 1 : 0, hx = LIGHT[0], hy = LIGHT[1], hz = LIGHT[2] + 1, hm = Math.hypot(hx, hy, hz), spec = ocean * Math.pow(Math.max(0, (X * hx + Y * hy + Z * hz) / hm), 60) * 160 * (1 - ca);
        r = r * (1 - ca) + 235 * ca; gg = gg * (1 - ca) + 240 * ca; b = b * (1 - ca) + 245 * ca;
        const k = (py * size + px) * 4, edge = Math.min(1, (1 - Math.sqrt(r2)) * 40);
        const nl = nightK * (1 - ca * .8) * 230; o[k] = Math.min(255, r * lit + spec + nl); o[k + 1] = Math.min(255, gg * lit + spec + nl * .78); o[k + 2] = Math.min(255, b * lit + spec + nl * .45 + 6 * (1 - diff)); o[k + 3] = 255 * edge; } }
    g.putImageData(img, 0, 0);
  }
  function renderMoon(D, age, full) {
    const M = tex.moon; if (!M) return;
    const size = Math.ceil(D), cv = moonCache.cv; cv.width = cv.height = size; const g = cv.getContext('2d'), img = g.createImageData(size, size), o = img.data;
    const ph = age / 29.530588853 * TAU, L = [Math.sin(ph), 0, -Math.cos(ph)];
    for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
      const X = (px + .5) / size * 2 - 1, Y = (py + .5) / size * 2 - 1, r2 = X * X + Y * Y; if (r2 > 1) continue;
      const Z = Math.sqrt(1 - r2), diff = Math.max(0, X * L[0] - Y * L[1] + Z * L[2]), term = Math.min(1, diff * 6);
      const a = M.data[(((py / size * M.height) | 0) * M.width + ((px / size * M.width) | 0)) * 4] / 255, v = a * (.035 + 1.1 * Math.pow(diff, .7) * term) * 255;
      const k = (py * size + px) * 4; o[k] = Math.min(255, v * (full ? 1.15 : 1)); o[k + 1] = Math.min(255, v * (full ? .5 : 1)); o[k + 2] = Math.min(255, v * (full ? .5 : 1.03));
      o[k + 3] = 255 * Math.min(1, (1 - Math.sqrt(r2)) * size * .5); }
    g.putImageData(img, 0, 0);
  }
  function drawEarth(t) {
    const d = fit(earthCv), W = earthCv.width, H = earthCv.height; ex.clearRect(0, 0, W, H);
    const R = Math.min(W * .43, H * 1.05), gx = W / 2, gy = H * .3 + R, top = gy - R;
    const n = jst(), hr = n.getUTCHours() + n.getUTCMinutes() / 60 + n.getUTCSeconds() / 3600, cl = wx.cloud;
    const [rise, set] = sunTimes(n), sunUp = hr > rise && hr < set;
    const age = moonAge(Date.now()), transit = 12 + age * 24 / 29.530588853, mf = ((hr - (transit - 6.2)) % 24 + 24) % 24 / 12.4, moonUp = mf > 0 && mf < 1;
    const full = Math.abs(age - 14.77) < 1.0;
    $('stSky').textContent = full ? 'FULL MOON' : 'MOON ' + age.toFixed(1);
    const D = Math.min(innerWidth * .25 * d, R * .62), ang = Math.PI * .84;
    const sun = [gx + Math.cos(ang) * R * .97, gy - Math.sin(ang) * R * .97], moon = [gx - Math.cos(ang) * R * .97, gy - Math.sin(ang) * R * .97];
    // sun (behind the earth): corona, limb-darkened disc; clouds soften it
    { const [x, y] = sun, r = D / 2, on = sunUp ? 1 : .25, soft = 1 + cl * 2.2;
      const co = ex.createRadialGradient(x, y, r * .6, x, y, r * 4.5 * soft); co.addColorStop(0, 'rgba(255,236,190,' + .55 * on + ')'); co.addColorStop(.25, 'rgba(255,200,120,' + .18 * on + ')'); co.addColorStop(1, 'rgba(255,170,80,0)');
      ex.fillStyle = co; ex.beginPath(); ex.arc(x, y, r * 4.5 * soft, 0, TAU); ex.fill();
      const a = (1 - cl * .5) * (sunUp ? 1 : .35), disc = ex.createRadialGradient(x - r * .1, y - r * .1, 0, x, y, r * (1 + cl * .8));
      disc.addColorStop(0, 'rgba(255,255,245,' + a + ')'); disc.addColorStop(.55, 'rgba(255,240,190,' + a + ')'); disc.addColorStop(Math.max(.6, .93 - cl * .3), 'rgba(255,190,90,' + a + ')'); disc.addColorStop(1, 'rgba(255,170,60,0)');
      ex.fillStyle = disc; ex.beginPath(); ex.arc(x, y, r * (1 + cl * .8), 0, TAU); ex.fill();
      const br = earthCv.getBoundingClientRect(); sunAt = [x / d + br.left, y / d + br.top]; lightTick(sunUp); }
    // earth
    if (tex.earth && tex.clouds) {
      const key = Math.round(R) + 'x' + Math.round(H - top);
      if (performance.now() - earthCache.at > 1500 || earthCache.key !== key) { renderEarth(R, top, H); earthCache.at = performance.now(); earthCache.key = key; }
      ex.drawImage(earthCache.cv, gx - R, top);
    }
    const atm = ex.createRadialGradient(gx, gy, R * .97, gx, gy, R * 1.08); atm.addColorStop(0, 'rgba(120,180,255,.5)'); atm.addColorStop(1, 'rgba(120,180,255,0)');
    ex.fillStyle = atm; ex.beginPath(); ex.arc(gx, gy, R * 1.08, 0, TAU); ex.fill();
    // moon (in front of the earth): real phase; red at full moon
    { const [x, y] = moon, on = moonUp ? 1 : .45, key = Math.round(D) + ':' + age.toFixed(2);
      if (performance.now() - moonCache.at > 60e3 || moonCache.key !== key) { renderMoon(D, age, full); moonCache.at = performance.now(); moonCache.key = key; }
      const glow = full ? 'rgba(255,70,80,' : 'rgba(210,225,255,', gr = ex.createRadialGradient(x, y, D * .45, x, y, D * (1.4 + cl));
      gr.addColorStop(0, glow + (moonUp ? (full ? .55 : .3) : .08) * (1 - cl * .5) + ')'); gr.addColorStop(1, glow + '0)');
      ex.fillStyle = gr; ex.beginPath(); ex.arc(x, y, D * (1.4 + cl), 0, TAU); ex.fill();
      ex.globalAlpha = on * (1 - cl * .35); ex.drawImage(moonCache.cv, x - D / 2, y - D / 2, D, D); ex.globalAlpha = 1; }
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
  // brilliant-cut crystal: table, crown, girdle and a long pavilion, lit from inside, with a passing glint
  function gem(c, cy, R, rot, fillFor, t) {
    const n = 12, table = [], crown = [], gird = [], top = cy - R * .78, bot = [c, cy + R * 1.35];
    for (let i = 0; i < n; i++) { const a = rot + i * TAU / n, s = Math.sin(a);
      table.push([c + Math.cos(a) * R * .42, top + s * R * .09, s]);
      crown.push([c + Math.cos(a + Math.PI / n) * R * .78, cy - R * .42 + Math.sin(a + Math.PI / n) * R * .16, Math.sin(a + Math.PI / n)]);
      gird.push([c + Math.cos(a) * R, cy - R * .18 + s * R * .2, s]); }
    const L = (a, k) => k + (1 - k) * (.5 + .5 * Math.cos(a - 2.3));
    const faces = [];
    for (let i = 0; i < n; i++) { const j = (i + 1) % n, a = rot + (i + .5) * TAU / n, z = Math.sin(a);
      faces.push({ p: [gird[i], gird[j], bot], z: z - .02, l: L(a, .2) * .8 });
      faces.push({ p: [table[i], table[j], crown[i]], z: z + .02, l: L(a, .45) });
      faces.push({ p: [table[j], crown[j], crown[i]], z: z + .015, l: L(a + .3, .35) });
      faces.push({ p: [crown[i], gird[j], gird[i]], z: z + .01, l: L(a - .2, .3) * .9 });
      faces.push({ p: [crown[i], crown[j], gird[j]], z: z + .012, l: L(a + .2, .3) }); }
    faces.sort((x, y) => x.z - y.z);
    cx.lineJoin = 'round';
    faces.forEach(f => { if (f.z < -.2) return; cx.beginPath(); f.p.forEach((q, k) => k ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.closePath();
      cx.fillStyle = fillFor(Math.max(.12, f.l)); cx.fill(); cx.strokeStyle = 'rgba(255,255,255,' + (.18 + .3 * Math.max(0, f.z)) + ')'; cx.lineWidth = .7; cx.stroke(); });
    // table (flat top)
    cx.beginPath(); table.forEach((q, k) => k ? cx.lineTo(q[0], q[1]) : cx.moveTo(q[0], q[1])); cx.closePath();
    cx.fillStyle = fillFor(.95); cx.globalAlpha = .55; cx.fill(); cx.globalAlpha = 1; cx.strokeStyle = 'rgba(255,255,255,.6)'; cx.stroke();
    // inner fire
    cx.globalCompositeOperation = 'lighter';
    const fire = cx.createRadialGradient(c, cy - R * .1, 0, c, cy - R * .1, R * .9); fire.addColorStop(0, 'rgba(255,255,255,.55)'); fire.addColorStop(.35, fillFor(.9).replace(/[\d.]+\)$/, '.35)')); fire.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = fire; cx.beginPath(); cx.arc(c, cy - R * .1, R * .9, 0, TAU); cx.fill();
    // passing glint: a four-point star that slides across the crown every few seconds
    const g = ((t || 0) % 5200) / 5200;
    if (g < .3 && !reduce) { const k = g / .3, x = c - R * .7 + R * 1.4 * k, y = cy - R * .55 + Math.sin(k * Math.PI) * -R * .15, s = Math.sin(k * Math.PI) * R * .55;
      cx.fillStyle = 'rgba(255,255,255,.9)'; cx.beginPath(); cx.moveTo(x, y - s); cx.lineTo(x + s * .12, y - s * .12); cx.lineTo(x + s, y); cx.lineTo(x + s * .12, y + s * .12);
      cx.lineTo(x, y + s); cx.lineTo(x - s * .12, y + s * .12); cx.lineTo(x - s, y); cx.lineTo(x - s * .12, y - s * .12); cx.closePath(); cx.fill(); }
    cx.globalCompositeOperation = 'source-over';
  }
  // two thin orbits with beads circling the crystal (back half drawn before the gem, front half after)
  function orbits(c, cy, R, t, front) {
    [[1.55, .28, .5, t * .0009], [1.35, .2, -.6, -t * .0012]].forEach(([k, f, tilt, ph]) => {
      cx.save(); cx.translate(c, cy); cx.rotate(tilt); cx.strokeStyle = col(front ? .55 : .25); cx.lineWidth = 1;
      cx.beginPath(); cx.ellipse(0, 0, R * k, R * k * f, 0, front ? 0 : Math.PI, front ? Math.PI : TAU); cx.stroke();
      const a = ph % TAU, inFront = Math.sin(a) > 0;
      if (inFront === front) { cx.fillStyle = col(1, 88); cx.shadowColor = col(1); cx.shadowBlur = 10; cx.beginPath(); cx.arc(Math.cos(a) * R * k, Math.sin(a) * R * k * f, 2.6, 0, TAU); cx.fill(); cx.shadowBlur = 0; }
      cx.restore(); });
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
    // glowing segment rings spinning about the vertical axis, outer and inner in opposite directions
    const segRot = reduce ? 0 : t * .00003, spin = reduce ? .5 : t * .0005;
    const ring3d = (R, n, gap, phi, w, a0, glow) => {
      const cp = Math.cos(phi), sp = Math.sin(phi);
      const segs = [];
      for (let k = 0; k < n; k++) { const s0 = k * TAU / n + segRot + gap, s1 = (k + 1) * TAU / n + segRot - gap, pts = []; let z = 0;
        for (let j = 0; j <= 14; j++) { const q = s0 + (s1 - s0) * j / 14, ca = Math.cos(q); pts.push([c + R * ca * cp, cy + R * Math.sin(q)]); z += ca * sp; }
        segs.push({ pts, z: z / 15 }); }
      segs.sort((p, q) => p.z - q.z).forEach(sg => { const k = .35 + .65 * (sg.z + 1) / 2;
        cx.lineCap = 'butt'; cx.shadowColor = col(1); cx.shadowBlur = glow * k;
        cx.lineWidth = w; cx.strokeStyle = col(a0 * k); cx.beginPath(); sg.pts.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.stroke();
        cx.shadowBlur = 0; cx.lineWidth = w * .25; cx.strokeStyle = 'rgba(255,255,255,' + (.55 * k) + ')'; cx.stroke(); });
    };
    ring3d(118 * u, 8, .07, spin, 12 * u, .95, 18 * u);
    ring3d(92 * u, 6, .1, -spin + Math.PI / 2, 7 * u, .85, 14 * u);
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
    gemFlash *= .94; const pulse = (mode ? (.75 + .25 * Math.sin(t * .006)) : (.85 + .15 * Math.sin(t * .002))) * (1 + gemFlash * .7);
    const halo = (m) => { const g = cx.createRadialGradient(c, cy, 0, c, cy, 86 * u); g.addColorStop(0, glowCol(.55 * pulse, m)); g.addColorStop(.6, glowCol(.15, m)); g.addColorStop(1, glowCol(0, m)); return g; };
    if (mode === 'split') {
      cx.save(); cx.beginPath(); cx.rect(0, 0, c, W); cx.clip(); cx.fillStyle = halo('up'); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); cx.restore();
      cx.save(); cx.beginPath(); cx.rect(c, 0, c, W); cx.clip(); cx.fillStyle = halo('down'); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); cx.restore();
    } else { cx.fillStyle = halo(mode); cx.beginPath(); cx.arc(c, cy, 86 * u, 0, TAU); cx.fill(); }
    // crystal
    const rot = reduce ? .4 : t * .0005, bob = reduce ? 0 : Math.sin(t * .0015) * 3 * u;
    const fillFor = m => l => { const h = hueOf(m); return h === null ? (white ? 'hsla(205,40%,' + (40 + 50 * l) + '%,.92)' : 'hsla(' + hue + ',100%,' + (28 + 50 * l) + '%,.92)') : 'hsla(' + h + ',100%,' + (25 + 45 * l) + '%,.94)'; };
    if (!reduce) orbits(c, cy + bob, 46 * u, t, false);
    cx.shadowColor = glowCol(1, mode === 'split' ? '' : mode); cx.shadowBlur = 30 * u;
    if (mode === 'split') {
      cx.save(); cx.beginPath(); cx.rect(0, 0, c, W); cx.clip(); gem(c, cy + bob, 46 * u, rot, fillFor('up'), t); cx.restore();
      cx.save(); cx.beginPath(); cx.rect(c, 0, c, W); cx.clip(); gem(c, cy + bob, 46 * u, rot, fillFor('down'), t); cx.restore();
      cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 1.5 * u; cx.beginPath(); cx.moveTo(c, cy - 60 * u + bob); cx.lineTo(c, cy + 50 * u + bob); cx.stroke();
    } else gem(c, cy + bob, 46 * u, rot, fillFor(mode), t);
    if (!reduce) orbits(c, cy + bob, 46 * u, t, true);
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
  const LABELS = [['talk', 'MUMEI'], ['market', 'MARKET'], ['keiba', 'RACING'], ['tasks', 'TASKS'], ['memory', 'MEMORY'], ['forest', 'FOREST']];
  const BTNS = [];
  let usage = load('fineri.usage', {});
  const gearPath = (() => { const n = 16, pts = []; for (let i = 0; i < n * 4; i++) { const k = i % 4, a = (Math.floor(i / 4) + [0, .12, .4, .52][k]) / n * TAU, r = (k === 1 || k === 2) ? 50 : 44; pts.push((50 + r * Math.cos(a)).toFixed(2) + '% ' + (50 + r * Math.sin(a)).toFixed(2) + '%'); } return 'polygon(' + pts.join(',') + ')'; })();
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
  const TITLES = { talk: ['COMMS', '無名と話す'], market: ['MARKET', '相場'], keiba: ['KEIBA', '競馬'], tasks: ['TASKS', 'やること'], memory: ['MEMORY', '記憶庫'], forest: ['FOREST', 'エルフの森'], games: ['GAMES', 'ゲーム'], updates: ['UPDATES', '更新履歴'] };
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
    const o = e.target.closest('[data-open]');
    if (o && o.classList.contains('gbtn') && !reduce) { zoomOpen(o); return; }
    if (o) { openMod(o.dataset.open, o); return; }
    const h = e.target.closest('[data-href]'); if (h) { location.href = h.dataset.href; }
  });
  // press a round button: it flies to the centre and grows until it fills the screen, then the page opens
  let zooming = false;
  function zoomOpen(b) {
    if (zooming) return; zooming = true;
    const r = b.getBoundingClientRect(), dx = innerWidth / 2 - (r.left + r.width / 2), dy = innerHeight / 2 - (r.top + r.height / 2);
    const k = Math.max(innerWidth, innerHeight) / r.width * 1.6;
    b.style.zIndex = 50; b.style.transition = 'transform .5s cubic-bezier(.5,0,.75,0), opacity .5s ease-in';
    b.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(' + k + ')'; b.style.opacity = '0';
    document.body.classList.add('zooming');
    setTimeout(() => { openMod(b.dataset.open, b);
      b.style.transition = 'none'; b.style.transform = ''; b.style.opacity = ''; b.style.zIndex = '';
      requestAnimationFrame(() => { b.style.transition = ''; document.body.classList.remove('zooming'); zooming = false; }); }, 480);
  }
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
    $('iTasks').textContent = tasks.filter(t => !t.done).length + ' OPEN';
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
      const sp = p.slice(-72).filter((_, i) => i % 3 === 0).map(q => q[1]); dq('qBTC', '¥' + (last[1] / 1e6).toFixed(2) + 'M', pct, sp);
    } catch (e) { $('iBtc').textContent = '取得できず'; }
  }
  async function nikkei() {
    try {
      const r = await fetch('https://raw.githubusercontent.com/yosizoueri-blip/fineri-panel/data/market.json?t=' + Date.now(), { cache: 'no-store' });
      const j = await r.json(); const n = j.nikkei; if (!n || !n.price) throw 0;
      signal.nk = n.age_min <= 90 ? n.change_1h : 0;
      show('iNk', 'mNk', 'mNkC', n.price, n.change_1h, '');
      dq('qN225', Math.round(n.price).toLocaleString('en-US'), n.change_1h, n.spark, n.market_open === false);
      const k = j.kioxia; if (k && k.price) dq('qKIOX', '¥' + Math.round(k.price).toLocaleString('en-US'), k.change_1h, k.spark, k.market_open === false);
      const x = j.spacex; if (x && x.price) dq('qSPX', '$' + x.price.toFixed(2), x.change_1h, x.spark, x.market_open === false); else dq('qSPX', 'PRE-IPO', null, null);
      if (n.market_open === false) { const s = document.createElement('span'); s.textContent = ' 休場'; s.style.color = 'var(--mut)'; $('iNk').append(s); }
    } catch (e) { $('iNk').textContent = '準備中'; }
  }
  function dq(id, price, pct, spark, closed) {
    const row = $(id); if (!row) return;
    row.querySelector('.p').textContent = price;
    const c = row.querySelector('.c');
    if (pct === null || pct === undefined) { c.textContent = '—'; c.className = 'c'; }
    else { c.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%' + (closed ? ' CL' : ''); c.className = 'c ' + (pct >= 0 ? 'up' : 'down'); }
    const pl = row.querySelector('polyline');
    if (spark && spark.length > 1) { const lo = Math.min(...spark), hi = Math.max(...spark), r = hi - lo || 1;
      pl.setAttribute('points', spark.map((v, i) => (i / (spark.length - 1) * 40).toFixed(1) + ',' + (9.5 - (v - lo) / r * 9).toFixed(1)).join(' ')); }
    else pl.setAttribute('points', '0,5 40,5');
  }
  /* races: graded races of the coming week (next Monday → Sunday) */
  fetch('races.json', { cache: 'no-store' }).then(r => r.json()).then(j => {
    const n = jst(), day = n.getUTCDay(), today = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
    const mon = today + ((8 - day) % 7 || 7) * 864e5, sun = mon + 6 * 864e5;
    let list = j.races.filter(r => { const t = Date.parse(r.date); return t >= mon && t <= sun; });
    if (!list.length) list = j.races.filter(r => Date.parse(r.date) >= today).slice(0, 3);
    const box = $('raceList'); box.innerHTML = '';
    list.slice(0, 4).forEach(r => { const d = new Date(Date.parse(r.date)), row = document.createElement('div'); row.className = 'row';
      row.innerHTML = '<span class="g' + r.grade.slice(1) + '"></span><b></b><span class="n"></span>';
      row.children[0].textContent = r.grade; row.children[1].textContent = pad(d.getUTCMonth() + 1) + '.' + pad(d.getUTCDate()); row.children[2].textContent = r.name;
      row.children[1].style.minWidth = '30px'; row.title = r.course; box.append(row); });
  }).catch(() => {});
  /* meaningless-but-alive telemetry */
  const bars = $('tBars'); for (let i = 0; i < 14; i++) bars.append(document.createElement('i'));
  const hexBox = $('hexList'), boot = Date.now(), hex = () => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  for (let i = 0; i < 4; i++) { const r = document.createElement('div'); r.className = 'row'; hexBox.append(r); }
  function telemetry() {
    $('tFlux').textContent = (97 + Math.random() * 2.9).toFixed(2) + ' %';
    $('tSyn').textContent = (pulses.length * 3.7 + Math.random() * 4).toFixed(1) + ' Hz';
    const s = ((Date.now() - boot) / 1000) | 0; $('tUp').textContent = pad((s / 3600) | 0) + ':' + pad(((s / 60) | 0) % 60) + ':' + pad(s % 60);
    bars.querySelectorAll('i').forEach(b => b.style.height = (2 + Math.random() * 12) + 'px');
    const rows = hexBox.children; for (let i = rows.length - 1; i > 0; i--) rows[i].textContent = rows[i - 1].textContent;
    rows[0].textContent = hex() + ' ' + hex() + ' ' + hex();
  }
  telemetry(); setInterval(telemetry, reduce ? 5000 : 700);
  btc(); nikkei(); setInterval(btc, 5 * 60e3); setInterval(nikkei, 5 * 60e3);

  /* ---------- boot ---------- */
  fetch('graph.json', { cache: 'no-store' }).then(r => r.json()).then(g => { GRAPH = g; layout(); $('stMem').textContent = g.n + 'N / ' + g.e.length + 'L'; }).catch(() => { $('stMem').textContent = '-'; });
  tick(); setInterval(tick, 1000);
  function frame(t) { drawField(t); drawSky(t); drawEarth(t); drawCore(t); if (!reduce) requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
  if (reduce) setInterval(() => frame(performance.now()), 30000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
