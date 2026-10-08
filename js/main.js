/* ==========================================================================
   QUANTUM CAT - main.js (no build step, no dependencies)
   config binding, launch-gated links/CA/chart, svg inliner (theme recolor),
   wave-interference + particle canvas, observe/collapse, ghost flicker,
   reveal, parallax, tilt, magnetic, marquee, gallery + lightbox, floaters.
   ========================================================================== */
(() => {
  const S = window.SITE || {};
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;
  const launched = Boolean(S.launched);
  const sym = "$" + S.symbol;
  const tpl = (t) => String(t || "").replaceAll("{symbol}", sym).replaceAll("{name}", S.name);
  const esc = (t) => String(t || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- toast ---------- */
  const toast = $("#toast");
  const showToast = (m) => { if (!toast) return; toast.textContent = m; toast.classList.add("show"); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove("show"), 2000); };

  /* ---------- 1. Bind config ---------- */
  const bind = { description: S.description, aboutLong: S.aboutLong, chainName: S.chainName, dexName: S.dexName, contract: launched ? S.contract : "Coming soon" };
  $$("[data-bind]").forEach((el) => { const v = bind[el.dataset.bind]; if (v) el.textContent = v; else if (el.dataset.bind === "aboutLong") el.remove(); });
  const yr = $("[data-year]"); if (yr) yr.textContent = new Date().getFullYear();
  if (S.slots) Object.entries(S.slots).forEach(([k, src]) => { if (src) $$(`[data-slot="${k}"]`).forEach((img) => (img.src = src)); });

  // links: X always live; buy / dexscreener switch on once CA is set in config.js
  $$("[data-link]").forEach((el) => {
    const key = el.dataset.link, url = (S.links || {})[key];
    if (url) { el.href = url; el.hidden = false; el.classList.remove("is-pending"); return; }
    if (key === "telegram") { el.hidden = true; return; }
    el.removeAttribute("href"); el.classList.add("is-pending"); el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (e) => { e.preventDefault(); showToast(`${sym} has not launched yet. Stay tuned on X.`); });
  });

  // stats
  const stats = $("[data-stats]");
  if (stats && S.stats) stats.innerHTML = S.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join("");

  // steps (image header + official mark badge)
  const steps = $("[data-steps]");
  if (steps && S.steps) {
    steps.innerHTML = S.steps.map((st, i) => `
      <article class="step reveal tilt-soft" data-delay="${i * 120}">
        <div class="step-media">${st.img ? `<img src="${st.img}" alt="" loading="lazy" width="1280" height="720">` : ""}<span class="step-num">step 0${i + 1}</span></div>
        <span class="step-icon">${st.icon ? `<span class="svg-icon" data-svg="${st.icon}" data-mono></span>` : ""}</span>
        <div class="step-body"><h3>${esc(tpl(st.title))}</h3><p>${esc(tpl(st.text))}</p></div>
      </article>`).join("");
  }
  const partners = $("[data-partners]");
  if (partners) {
    const list = S.partners || [S.icons.chain, S.icons.wallet, S.icons.dex, "assets/icons/dexscreener.svg", "assets/icons/x.svg"];
    partners.innerHTML = list.map((p) => `<span class="svg-icon" data-svg="${p}" data-mono></span>`).join("");
  }

  // marquee
  const mq = $("[data-marquee]");
  if (mq) {
    const words = S.marquee || [S.name, sym];
    const run = Array(4).fill(words).flat().map((w) => `<span>${esc(w)}</span>`).join("");
    mq.innerHTML = run + run;
  }

  // gallery + lightbox
  const gal = $("[data-gallery]");
  const items = (S.gallery || []).map((g) => (typeof g === "string" ? { src: g } : g));
  if (gal && items.length) {
    gal.innerHTML = items.map((it, i) => `
      <figure class="g-item reveal tilt-soft" data-delay="${(i % 2) * 120}" data-index="${i}" tabindex="0" role="button" aria-label="Open ${esc(it.caption || "image")}">
        <img src="${it.src}" alt="${esc(it.caption || S.name)}" loading="lazy" width="1280" height="720">
        ${it.caption ? `<figcaption><b>${esc(it.caption)}</b>${it.text ? `<small>${esc(it.text)}</small>` : ""}</figcaption>` : ""}
      </figure>`).join("");
  }
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  let lbIdx = 0;
  function openLb(i) {
    lbIdx = (i + items.length) % items.length; const it = items[lbIdx];
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbImg.src = it.src; lbImg.alt = it.caption || S.name;
    lbCap.innerHTML = `${it.caption ? `<b>${esc(it.caption)}</b>` : ""}${esc(it.text || "")}`;
    if (lb.hidden) { lb.hidden = false; requestAnimationFrame(() => lb.classList.add("open")); document.body.style.overflow = "hidden"; }
  }
  function closeLb() { lb.classList.remove("open"); setTimeout(() => (lb.hidden = true), 300); document.body.style.overflow = ""; }
  if (lb && gal) {
    gal.addEventListener("click", (e) => { const f = e.target.closest(".g-item"); if (f) openLb(+f.dataset.index); });
    gal.addEventListener("keydown", (e) => { const f = e.target.closest(".g-item"); if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openLb(+f.dataset.index); } });
    $(".lb-close", lb).addEventListener("click", closeLb);
    $(".lb-prev", lb).addEventListener("click", () => openLb(lbIdx - 1));
    $(".lb-next", lb).addEventListener("click", () => openLb(lbIdx + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
    addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") openLb(lbIdx - 1); if (e.key === "ArrowRight") openLb(lbIdx + 1); });
    let sx = 0; lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) openLb(lbIdx + (dx < 0 ? 1 : -1)); });
  }

  // hero floaters (transparent cutouts); the leaping cat gets ghost trails (superposition)
  const fl = $(".hero-floaters");
  if (fl && S.floaters && S.floaters.length) {
    fl.innerHTML = S.floaters.map((f) => {
      const it = typeof f === "string" ? { src: f, cls: "" } : f;
      const main = `<img class="floater ${it.cls || ""}" src="${it.src}" alt="" data-parallax="0.12">`;
      if (it.cls === "fl-leap") return [0.6, 1.2].map((d) => `<img class="floater fl-leap trail" src="${it.src}" alt="" style="animation-delay:-${d}s">`).join("") + main.replace('class="floater fl-leap"', 'class="floater fl-leap" style="animation-delay:0s"');
      return main;
    }).join("");
  }

  // chart: DexScreener embed only, once CA is set
  const ifr = $("#dexscreener-embed"), pending = $("#chart-pending");
  if (ifr && S.dexscreenerEmbed) {
    if (pending) pending.remove();
    ifr.hidden = false;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { ifr.src = S.dexscreenerEmbed; io.disconnect(); } }, { rootMargin: "400px" });
    io.observe(ifr);
  } else if (pending && !reduced) {
    // animated interfering waves while the chart is in superposition
    const pa = $("#wave-a"), pb = $("#wave-b"); let t = 0;
    const wave = (ph, k, amp) => { let d = "M0 60"; for (let x = 0; x <= 600; x += 6) d += ` L${x} ${(60 + Math.sin(x * k + ph) * amp * Math.sin(x / 600 * Math.PI)).toFixed(1)}`; return d; };
    (function loop() { t += 0.035; pa.setAttribute("d", wave(t, 0.03, 40)); pb.setAttribute("d", wave(-t * 1.3, 0.022, 34)); requestAnimationFrame(loop); })();
  }

  /* ---------- 2. SVG inliner: official marks recolored via CSS color ---------- */
  const svgCache = {};
  async function inlineSvgs(root = document) {
    for (const el of $$("[data-svg]", root)) {
      const src = el.dataset.svg; if (!src || el.dataset.done) continue;
      try {
        svgCache[src] = svgCache[src] || fetch(src).then((r) => r.text());
        let txt = await svgCache[src];
        txt = txt.replace(/<\?xml[^>]*>/, "").replace(/<!DOCTYPE[^>]*>/i, "").replace(/<title>.*?<\/title>/s, "");
        if (el.hasAttribute("data-mono") && !/metamask/i.test(src)) {
          txt = txt.split(/(<mask[\s\S]*?<\/mask>)/).map((part) => part.startsWith("<mask") ? part :
            part.replace(/(fill|stroke|stop-color|flood-color)="(?!none)[^"]*"/g, '$1="currentColor"')
                .replace(/(fill|stroke|stop-color):\s*(?!none)[^;"]+/g, "$1:currentColor")).join("")
            .replace(/<svg(?![^>]*\sfill=)/, '<svg fill="currentColor"');
        }
        const uid = "s" + Math.random().toString(36).slice(2, 7);
        txt = txt.replace(/id="([^"]+)"/g, `id="${uid}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${uid}-$1)`).replace(/href="#([^"]+)"/g, `href="#${uid}-$1"`);
        el.innerHTML = txt; el.dataset.done = 1;
      } catch (e) { /* ignore */ }
    }
  }
  inlineSvgs();

  /* ---------- 3. Copy CA (switches on when CA is set) ---------- */
  $$("[data-copy-ca]").forEach((box) => {
    const btn = $(".ca-copy", box);
    if (!launched) { box.classList.add("is-pending"); btn.textContent = "Soon"; }
    btn && btn.addEventListener("click", async () => {
      if (!launched) return showToast("Contract address drops at launch");
      const ca = S.contract;
      try { await navigator.clipboard.writeText(ca); } catch { const t = document.createElement("textarea"); t.value = ca; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
      btn.textContent = "Copied"; showToast("Contract address copied"); setTimeout(() => (btn.textContent = "Copy"), 1600);
    });
  });

  /* ---------- 4. Observe / collapse the wavefunction ---------- */
  const pill = $("#state-pill"), stateText = $("#state-text"), probA = $('[data-prob="a"]'), probB = $('[data-prob="b"]');
  const states = ["here", "everywhere", "awake", "asleep", "on Solana", "in every reality"];
  let collapseT;
  function observe(e) {
    const s = states[(Math.random() * states.length) | 0];
    pill.classList.add("collapsed"); stateText.textContent = "observed: " + s;
    const f = document.createElement("div"); f.className = "collapse-flash";
    if (e && e.clientX) { f.style.setProperty("--fx", e.clientX + "px"); f.style.setProperty("--fy", e.clientY + "px"); }
    document.body.appendChild(f); setTimeout(() => f.remove(), 800);
    const a = Math.random() < 0.5 ? 1 : 0; probA.textContent = a.toFixed(2); probB.textContent = (1 - a).toFixed(2);
    clearTimeout(collapseT);
    collapseT = setTimeout(() => { pill.classList.remove("collapsed"); stateText.textContent = "superposition"; }, 3200);
    if (window.__qburst) window.__qburst(e);
  }
  pill && pill.addEventListener("click", observe);
  const ob = $("#observe-btn"); ob && ob.addEventListener("click", observe);
  // probabilities drift while unobserved
  if (probA && !reduced) setInterval(() => {
    if (pill.classList.contains("collapsed")) return;
    const a = 0.5 + Math.sin(Date.now() / 1400) * 0.35 + (Math.random() - 0.5) * 0.06;
    probA.textContent = Math.min(0.99, Math.max(0.01, a)).toFixed(2); probB.textContent = Math.min(0.99, Math.max(0.01, 1 - a)).toFixed(2);
  }, 260);

  // nav ticker flicker between "both states"
  const nt = $("[data-flicker]");
  if (nt && !reduced) { const [a, b] = nt.dataset.flicker.split("|"); setInterval(() => { nt.textContent = b; setTimeout(() => (nt.textContent = a), 90); }, 4200); }

  /* ---------- 5. Nav ---------- */
  const nav = $("#nav"), links = $("#nav-links"), tog = $("#nav-toggle");
  tog && tog.addEventListener("click", () => links.classList.toggle("open"));
  $$("#nav-links a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

  /* ---------- 6. Reveal, parallax, progress ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { const d = +e.target.dataset.delay || 0; setTimeout(() => e.target.classList.add("in"), d); revealIO.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => revealIO.observe(el));
  const prog = $(".scroll-progress");
  let ticking = false;
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav && nav.classList.toggle("scrolled", y > 20);
    if (prog) prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    if (!reduced && y < innerHeight * 1.5) $$("[data-parallax]").forEach((el) => { el.style.translate = `0 ${y * +el.dataset.parallax}px`; });
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- 7. Tilt + magnetic ---------- */
  if (!touch && !reduced) {
    $$(".tilt, .tilt-soft").forEach((el) => {
      const max = el.classList.contains("tilt-soft") ? 6 : 14;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) scale(1.015)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }
  const glow = $(".cursor-glow");
  if (glow && !touch) addEventListener("pointermove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });

  /* ---------- 8. Canvas: two-source wave interference field + quantum particles ---------- */
  const cv = $("#fx-canvas");
  if (cv && !reduced) {
    const ctx = cv.getContext("2d");
    const cfg = Object.assign({ count: 80, speed: 0.3 }, S.particles || {});
    const COLORS = ["#3cdcff", "#8b6cff", "#ff4fd8", "#68c3f9", "#ffcf5c"];
    let W, H, DPR, P = [], bursts = [], t = 0, gap;
    const mouse = { x: -9999, y: -9999 };
    function resize() {
      DPR = Math.min(devicePixelRatio || 1, 1.5); W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
      gap = (innerWidth < 700 ? 26 : 22) * DPR;
      const n = Math.round(cfg.count * Math.min(1, innerWidth / 1300) + 24);
      P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * cfg.speed * DPR, vy: (Math.random() - 0.5) * cfg.speed * DPR, r: (Math.random() * 1.8 + 0.5) * DPR, c: COLORS[(Math.random() * COLORS.length) | 0], ph: Math.random() * 6.28 }));
    }
    window.__qburst = (e) => {
      const x = (e && e.clientX ? e.clientX : innerWidth / 2) * DPR, y = (e && e.clientY ? e.clientY : innerHeight / 2) * DPR;
      for (let i = 0; i < 60; i++) { const a = Math.random() * 6.28, s = (Math.random() * 6 + 2) * DPR; bursts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: COLORS[i % COLORS.length] }); }
    };
    function tick() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      // interference field: dots brighten where waves from two moving sources add up
      const s1x = W * (0.3 + 0.12 * Math.sin(t * 0.21)), s1y = H * (0.35 + 0.1 * Math.cos(t * 0.17));
      const s2x = mouse.x > -999 ? mouse.x * DPR : W * (0.72 + 0.1 * Math.cos(t * 0.19)), s2y = mouse.x > -999 ? mouse.y * DPR : H * (0.6 + 0.12 * Math.sin(t * 0.23));
      const k = 0.045 / DPR, w = t * 2.2;
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          const d1 = Math.hypot(x - s1x, y - s1y), d2 = Math.hypot(x - s2x, y - s2y);
          const v = (Math.sin(d1 * k - w) + Math.sin(d2 * k - w)) * 0.5; // -1..1
          const a = v * v * v * v; if (a < 0.08) continue;
          ctx.globalAlpha = a * 0.5;
          ctx.fillStyle = v > 0 ? "#3cdcff" : "#8b6cff";
          ctx.fillRect(x - DPR, y - DPR, 2 * DPR * (0.6 + a), 2 * DPR * (0.6 + a));
        }
      }
      // particles that flicker between two positions (superposition) and link up
      const ld = 120 * DPR;
      for (const p of P) {
        const dx = p.x - mouse.x * DPR, dy = p.y - mouse.y * DPR, d2 = dx * dx + dy * dy;
        if (d2 < 16000 * DPR * DPR) { const f = 0.5 / Math.sqrt(d2 + 1); p.vx += dx * f * 0.05; p.vy += dy * f * 0.05; }
        p.vx *= 0.985; p.vy *= 0.985; if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.06;
        p.x += p.vx; p.y += p.vy; p.ph += 0.03;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const flick = Math.sin(p.ph) > 0.92;
        ctx.globalAlpha = 0.9; ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 8 * DPR;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill();
        if (flick) { ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.arc(p.x + 14 * DPR, p.y - 8 * DPR, p.r, 0, 6.29); ctx.fill(); }
      }
      ctx.shadowBlur = 0; ctx.lineWidth = DPR * 0.6;
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j], dx = a.x - b.x, dy = a.y - b.y; if (Math.abs(dx) > ld || Math.abs(dy) > ld) continue;
        const d = Math.hypot(dx, dy);
        if (d < ld) { ctx.globalAlpha = (1 - d / ld) * 0.22; ctx.strokeStyle = a.c; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      // observe bursts
      bursts = bursts.filter((b) => (b.life -= 0.018) > 0);
      for (const b of bursts) { b.x += b.vx; b.y += b.vy; b.vx *= 0.96; b.vy *= 0.96; ctx.globalAlpha = b.life; ctx.fillStyle = b.c; ctx.beginPath(); ctx.arc(b.x, b.y, 2.2 * DPR, 0, 6.29); ctx.fill(); }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
    resize(); tick();
  }
})();
