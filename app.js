/* FINERI v2 — ARC CORE */
(function () {
  'use strict';
  const VERSION = '2.6';
  const CHANGELOG = [
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
  let ring = [];
  const brainCv = $('brain'), bx = brainCv.getContext('2d'), stageEl = $('stage');
  const crim = (a, l) => 'hsla(350,82%,' + (l || 40) + '%,' + a + ')';
  // one graph, two places: the brain under the skin (crimson) and the ring around the core (base colour).
  // The same pulses run through both, so the core mirrors what moves in the head.
  function drawGraph(g, d, P, sc, RAD, colour, t) {
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
      g.fillStyle = colour(1, 92); g.shadowColor = colour(1); g.shadowBlur = 14 * d; g.beginPath(); g.arc(x, y, 2.4 * d * sc, 0, TAU); g.fill(); g.shadowBlur = 0;
    });
    lay.forEach((n, i) => {
      const w = deg[i] / maxDeg, x = P[i][0], y = P[i][1], lit = waveLit(x, y), r = (1.8 + 5 * Math.sqrt(w)) * d * sc, br = .55 + .25 * Math.sin(t * .002 + n.ph) + .3 * lit;
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
    for (let i = pulses.length - 1; i >= 0; i--) { pulses[i].k += pulses[i].v; if (pulses[i].k >= 1) pulses.splice(i, 1); }
    const rot = reduce ? 0 : t * .00004;
    // 1) the brain, under the skin of the face
    const fr = faceEl.getBoundingClientRect(), RX = fr.width * .24 * d, RY = fr.height * .12 * d;
    drawGraph(bx, d, place(lay, (fr.left + fr.width * .5) * d, (fr.top + fr.height * .245) * d, RX, RY, rot, t), Math.max(.7, Math.min(1.4, (RX + RY) / 2 / (110 * d))), (RX + RY) / 2, crim, t);
    // 2) its reflection: the ring around the core
    const sr = stageEl.getBoundingClientRect(), cx0 = (sr.left + sr.width / 2) * d, cy0 = (sr.top + sr.height / 2) * d, RAD = sr.width * d;
    fx.save(); fx.beginPath(); fx.rect(0, 0, W, H); fx.arc(cx0, cy0, sr.width * .26 * d, 0, TAU, true); fx.clip();
    drawGraph(fx, d, place(ring, cx0, cy0, RAD, RAD, rot * .6, t), Math.max(.7, Math.min(1.2, sr.width / 380)), RAD * .45, col, t);
    fx.restore();
  }

  /* ---------- sky: globe, sun, moon ---------- */
  const sky = $('sky'), sx = sky.getContext('2d');
  // land: 2° equirectangular bitmap built from Natural Earth (world-atlas land-110m), 90 rows × 180 cols, hex per row
  const LAND = ["000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000","0000000000017fe01ffe0000000000000000000000000","00000000003ffffffffff0000000600000e0000000000","00000000277ffdffffff8001fc000000007c000000000","0000000750f7e3ffffff800060000010000fc00000000","00000001f8bfc007ffff00000000038007ffe001c8000","0000001fcdf7f003ffff000000000c043fffffe0c0000","803c000dfcb7ff03fffe000003800c1fffffffffff800","01fffffffefddf81fff800003ff800fffffffffffffff","f0ffffffffff87e1ff8000007ffefffffffffffffffff","b3ffffffffff9fc0fc03e000fbfffffffffffffffffff","09fffffffff8c3c0f8000007e7fffffffffffffffffff","01ffffffffe01e007800000fe7ffffffffffffffff3f8","007a07ffffe01f4000000007e3fffffffffffffff6300","003001fffff81fe000000183c7ffffffffffffff00f00","000000ffffffbff8000003c3bffffffffffffffc01e00","0000017fffffbffc000006efffffffffffffffffc0c00","0000003ffffffffc000001ffffffffffffffffffc0000","0000001fffffffe7000000ffffffffffffffffff40000","0000000fffffffc30000007fffffffffffffffff40000","0000000fffffffe00000007fffb7cffffffffffe40000","0000000ffffffe00000007f9bf03cffffffffff8e0000","0000000ffffffe00000007e2ffffe7ffffffffe080000","0000000ffffff800000007c22dffe7fffffffcc080000","00000007fffff0000000039f44ffe7fffffffe6380000","00000007fffff000000001ff002ffffffffffc6f00000","00000001ffffc000000007ff881ffffffffffe1800000","00000000ffffc000000007fffffffffffffffe0000000","00000000ffe0c00000000fffffffdffffffffe0000000","000000005fc0400000001fffffefeffffffffc0000000","000000002f80400000003ffffffff6fffffffe0000000","000000000780c00000003ffffff7ff0ffffff20000000","0000000007c6180000007ffffffbff07fcffc00000000","0008000003ec170000003ffffffbfe03f87e800000000","0000000000fc000000003ffffff9fc01e07f020000000","00000000001f000000007ffffffdf001c01f820000000","000000000007800000007fffffff8001c01f830000000","0000000000010fa000003fffffff7000c013018000000","000000000000fff000001fffffffe000e010018000000","0000000000001ff800000fffffffe0002008018000000","0000000000001fff000007cfffffc000002c1c0000000","0000000000001fff80000001ffffc000003c380000000","0000000000003fff80000003ffff0000001cfb2000000","0000000000007fffe0000003fffe0000000c7e1800000","0000000000003ffffc000001fffc00000006762f80000","0000000000007fffff000000fffc000000020303e4000","0000000000003fffff800000fffc00000001e001f0000","0000000000003fffff000000fffc000000000680d8200","0000000000001fffff0000007ffc00000000000000000","0000000000001ffffe000000fffe20000000001c40000","0000000000000ffffe000000fffc6000000000fc60000","00000000000003fffe000000fffce000000001ffe0001","00000000000001fffc000000fff0e000000003fff0000","00000000000001fffc0000007ff0c00000000ffff8080","00000000000001fff80000007ff0c00000001ffffc000","00000000000001ffc00000007fe0c00000001ffffc000","00000000000003ffc00000007fe0000000001ffffe000","00000000000003ffc00000003fc0000000001ffffe000","00000000000003ff800000001f80000000001ffffe000","00000000000003ff000000001f00000000000f87fc000","00000000000003fe000000000000000000000c03fc000","00000000000007fc000000000000000000000000f8004","00000000000007f000000000000000000000000040006","00000000000007e00000000000000000000000003000c","00000000000007c000000000000000000000000010018","000000000000078000000000000000000000000000030","0000000000000f8000000000000000000000000000020","0000000000000f8000000000000000080000000000000","0000000000000f0000000000000000000000000000000","000000000000070000000000000000000000000000000","000000000000038000000000000000000000000000000","000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000","000000000000000000000000000000000000000000000","000000000000002000000000000000000000000000000","00000000000000c00000000000003f001fffffffe0000","00000000000002c000000000003bfff87fffffffff800","00000000000007e0000003fffffffff3fffffffffffe0","0000000003fe07f000003ffffffffffffffffffffffe0","00005fffffffffc000007ffffffffffffffffffffff80","001ffffffffffe00001ffffffffffffffffffffffff00","00cffffffffff00070fffffffffffffffffffffffff80","0007fffffffffff1f3ffffffffffffffffffffffffe00","0007fffffffffffffffffffffffffffffffffffffffc0","fffffffffffffffffffffffffffffffffffffffffffff","fffffffffffffffffffffffffffffffffffffffffffff","fffffffffffffffffffffffffffffffffffffffffffff"];
  const land = []; LAND.forEach((h, row) => { const bits = h.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    for (let col_ = 0; col_ < 180; col_++) if (bits[col_] === '1') land.push([(89 - row * 2) * Math.PI / 180, (col_ * 2 - 179) * Math.PI / 180]); });
  // mountain ranges (lon, lat): drawn as brighter ridges
  const RANGES = [[[73,35],[78,33],[82,30],[86,28],[90,28],[95,28]], [[70,38],[75,36],[80,36]], [[-75,10],[-77,0],[-77,-10],[-70,-18],[-69,-25],[-70,-33],[-71,-40],[-73,-50]],
    [[-150,62],[-135,59],[-122,52],[-115,47],[-110,42],[-107,37],[-105,32]], [[6,45],[10,46.5],[14,47]], [[60,68],[59,60],[58,55],[58,51]], [[-8,31],[0,34],[8,36]],
    [[40,43.5],[47,41.5]], [[145,-15],[147,-25],[150,-32],[148,-37]], [[37,13],[38,5],[36,-3],[35,-10]], [[45,36],[50,32],[56,27]], [[100,35],[104,30],[100,25]]];
  const ridge = []; RANGES.forEach(r => { for (let i = 0; i < r.length - 1; i++) for (let k = 0; k < 8; k++) { const f = k / 8;
    ridge.push([(r[i][1] + (r[i + 1][1] - r[i][1]) * f) * Math.PI / 180, (r[i][0] + (r[i + 1][0] - r[i][0]) * f) * Math.PI / 180]); } });
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
      const cl = wx.cloud, haze = r * (1 + cl * 3.2);
      const g = sx.createRadialGradient(x, y, 0, x, y, r * 4 + haze); g.addColorStop(0, 'rgba(255,240,200,' + (.9 - cl * .45) + ')'); g.addColorStop(.25, 'rgba(255,200,120,' + (.35 - cl * .15) + ')'); g.addColorStop(1, 'rgba(255,180,80,0)');
      sx.fillStyle = g; sx.beginPath(); sx.arc(x, y, r * 4 + haze, 0, TAU); sx.fill();
      // the disc itself softens and fades as the sky clouds over
      const disc = sx.createRadialGradient(x, y, 0, x, y, r * (1 + cl * 1.6)); disc.addColorStop(0, 'rgba(255,246,220,' + (1 - cl * .55) + ')');
      disc.addColorStop(Math.max(.05, .92 - cl * .85), 'rgba(255,246,220,' + (1 - cl * .55) + ')'); disc.addColorStop(1, 'rgba(255,246,220,0)');
      sx.fillStyle = disc; sx.beginPath(); sx.arc(x, y, r * (1 + cl * 1.6), 0, TAU); sx.fill();
      sunAt = [x / d + sky.getBoundingClientRect().left, y / d + sky.getBoundingClientRect().top];
    }
    // moon
    const age = moonAge(Date.now()), transit = 12 + age * 24 / 29.530588853;
    let mf = ((hr - (transit - 6.2)) % 24 + 24) % 24 / 12.4;
    const full = Math.abs(age - 14.77) < 1.0;
    $('stSky').textContent = full ? 'FULL MOON' : 'MOON ' + age.toFixed(1);
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
    // weather: drifting cloud veils and a few rain streaks, only as strong as the sky really is
    if (wx.cloud > .3) for (let i = 0; i < 5; i++) {
      const cx = ((i * .27 + t * .000008 * (1 + i * .3)) % 1.3 - .15) * W, cy = H * (.18 + (i % 3) * .14), rw = W * (.22 + (i % 2) * .1);
      const g = sx.createRadialGradient(cx, cy, 0, cx, cy, rw); g.addColorStop(0, 'rgba(150,170,195,' + (.16 * (wx.cloud - .3) / .7) + ')'); g.addColorStop(1, 'rgba(150,170,195,0)');
      sx.fillStyle = g; sx.save(); sx.translate(cx, cy); sx.scale(1, .32); sx.translate(-cx, -cy); sx.beginPath(); sx.arc(cx, cy, rw, 0, TAU); sx.fill(); sx.restore();
    }
    if (wx.rain && !reduce) { sx.strokeStyle = 'rgba(170,200,230,.22)'; sx.lineWidth = 1 * d; sx.beginPath();
      for (let i = 0; i < 26; i++) { const x = ((i * 97.3 + t * .05) % W), y = ((i * 53.1 + t * .6) % (H * 1.1)) - H * .05; sx.moveTo(x, y); sx.lineTo(x - 3 * d, y + 12 * d); } sx.stroke(); }
    lightTick(sf > 0 && sf < 1);
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
    const rot = (Date.now() / 3600e3 % 1) * TAU, tilt = .42; // one turn per hour
    const proj = (lat, lon) => { const x = Math.cos(lat) * Math.sin(lon + rot), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon + rot);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt); return [gx + x * R, gy - y2 * R, z2]; };
    ex.lineWidth = 1 * d;
    for (let lo = 0; lo < 12; lo++) { ex.strokeStyle = col(.18); ex.beginPath(); let pen = false;
      for (let la = -1.5; la <= 1.5; la += .06) { const p = proj(la, lo * Math.PI / 6); if (p[2] < 0) { pen = false; continue; } pen ? ex.lineTo(p[0], p[1]) : ex.moveTo(p[0], p[1]); pen = true; } ex.stroke(); }
    for (let la = -60; la <= 60; la += 20) { ex.strokeStyle = col(.15); ex.beginPath(); let pen = false;
      for (let lo = 0; lo <= TAU + .05; lo += .05) { const p = proj(la * Math.PI / 180, lo); if (p[2] < 0) { pen = false; continue; } pen ? ex.lineTo(p[0], p[1]) : ex.moveTo(p[0], p[1]); pen = true; } ex.stroke(); }
    const dot = Math.max(1.2 * d, R / 70);
    land.forEach(([la, lo]) => { const p = proj(la, lo); if (p[2] < .02) return; ex.fillStyle = col(.18 + .5 * p[2], 62); ex.fillRect(p[0] - dot / 2, p[1] - dot / 2, dot, dot); });
    ex.shadowColor = col(1); ex.shadowBlur = 6 * d;
    ridge.forEach(([la, lo]) => { const p = proj(la, lo); if (p[2] < .02) return; ex.fillStyle = col(.4 + .6 * p[2], 88); ex.beginPath(); ex.arc(p[0], p[1], dot * .75, 0, TAU); ex.fill(); });
    ex.shadowBlur = 0;
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
