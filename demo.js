/* terraLens demo tour. Loaded by index.html when the address has ?demo.
   It drives the real controls (taps, drags, sliders) with a pointer marker and captions,
   using video clips as the camera. Two ways to run it:
   - by hand: open /?demo, choose one or more short video clips, press Play tour
   - recorded: a script (Playwright) exposes window.needClip(i) to load clip i, then calls window.__runDemo()
   Add &speed=1.5 for a faster tour, &notitle to skip the title card. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const D = window.__demo;
  if (!D) return;
  const q = new URLSearchParams(location.search);
  const SPEED = Math.max(0.25, parseFloat(q.get("speed")) || 1);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms / SPEED));
  const raf = () => new Promise((r) => requestAnimationFrame(r));

  // ---------------- overlay ----------------
  const css = document.createElement("style");
  css.textContent = `
  .dm-cap { position: fixed; left: 50%; top: calc(env(safe-area-inset-top, 0px) + 74px); transform: translate(-50%, -8px); z-index: 9998; max-width: min(88vw, 640px);
    background: #E5F15C; color: #17321B; padding: 12px 20px; border-radius: 16px; font: 600 clamp(17px, 4.6vw, 28px)/1.25 Inter, system-ui, sans-serif; text-align: center;
    box-shadow: 0 8px 28px rgba(0,0,0,.35); opacity: 0; transition: opacity .3s ease, transform .3s ease; pointer-events: none; }
  .dm-cap.on { opacity: 1; transform: translate(-50%, 0); }
  .dm-cap small { display: block; font-weight: 500; font-size: .62em; letter-spacing: .12em; text-transform: uppercase; opacity: .65; margin-bottom: 3px; }
  .dm-cur { position: fixed; left: 0; top: 0; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; z-index: 9999; pointer-events: none;
    border: 3px solid #E83B68; background: rgba(232,59,104,.22); transform: translate(50vw, 60vh); transition: transform .7s cubic-bezier(.45,.05,.25,1), opacity .3s ease; opacity: 0; }
  .dm-cur.on { opacity: 1; }
  .dm-rip { position: fixed; z-index: 9999; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; border: 3px solid #E83B68; pointer-events: none; animation: dmrip .6s ease-out forwards; }
  @keyframes dmrip { from { transform: scale(.6); opacity: .9; } to { transform: scale(2.4); opacity: 0; } }
  .dm-card { position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; align-content: center; gap: 14px; text-align: center; padding: 24px;
    background: #17321B; color: #E5F15C; font-family: Inter, system-ui, sans-serif; opacity: 0; transition: opacity .5s ease; pointer-events: none; }
  .dm-card.on { opacity: 1; }
  .dm-card b { font-size: clamp(38px, 11vw, 84px); letter-spacing: -.02em; }
  .dm-card span { font-size: clamp(16px, 4.4vw, 30px); color: #fff; max-width: 20em; }
  .dm-card i { font-style: normal; font-size: clamp(14px, 3.6vw, 22px); color: #66CCCC; letter-spacing: .12em; text-transform: uppercase; }
  .dm-panel { position: fixed; left: 12px; right: 12px; top: 12px; z-index: 10001; background: #17321B; color: #fff; border: 1px solid #E5F15C; border-radius: 14px; padding: 14px; font: 15px Inter, system-ui, sans-serif; display: grid; gap: 10px; }
  .dm-panel button { min-height: 44px; border-radius: 10px; border: 0; background: #E5F15C; color: #17321B; font: 600 16px inherit; }
  `;
  document.head.appendChild(css);
  const mk = (cls, parent = document.body) => { const e = document.createElement("div"); e.className = cls; parent.appendChild(e); return e; };
  const capEl = mk("dm-cap"), cur = mk("dm-cur"), card = mk("dm-card");
  let capT = 0;
  const cap = (text, tag) => {
    console.log("CAP " + (tag || "") + ": " + text);
    clearTimeout(capT);
    capEl.classList.remove("on");
    capT = setTimeout(() => { capEl.innerHTML = (tag ? `<small>${tag}</small>` : "") + text; capEl.classList.add("on"); }, 120);
  };
  const capOff = () => { clearTimeout(capT); capEl.classList.remove("on"); };
  const showCard = async (title, sub, tag, ms) => {
    card.innerHTML = `${tag ? `<i>${tag}</i>` : ""}<b>${title}</b><span>${sub || ""}</span>`;
    card.classList.add("on"); await wait(ms); card.classList.remove("on"); await wait(600);
  };

  // ---------------- pointer marker and gestures ----------------
  let cx = innerWidth / 2, cy = innerHeight * 0.6;
  const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const point = async (x, y, ms = 700) => {
    cur.classList.add("on");
    cur.style.transitionDuration = ms / SPEED + "ms";
    x = Math.min(Math.max(x, 24), innerWidth - 24); y = Math.min(Math.max(y, 24), innerHeight - 24);
    cx = x; cy = y; cur.style.transform = `translate(${x}px, ${y}px)`;
    await wait(ms + 60);
  };
  const ripple = () => { const r = mk("dm-rip"); r.style.left = cx + "px"; r.style.top = cy + "px"; setTimeout(() => r.remove(), 700); };
  const pointAt = async (el, ms) => { const [x, y] = center(el); await point(x, y, ms); };
  const tap = async (el, after = 500) => { if (typeof el === "string") el = $(el) || document.querySelector(el); await pointAt(el); ripple(); el.click(); await wait(after); };

  const stage = $("stage");
  stage.setPointerCapture = () => {}; // the tour's pointer events are synthetic
  const ptr = (type, x, y) => stage.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 77, pointerType: "touch", isPrimary: true, clientX: x, clientY: y }));
  const drag = async (x0, y0, x1, y1, ms = 1400) => {
    await point(x0, y0); ripple(); ptr("pointerdown", x0, y0);
    const n = Math.round(ms / 33);
    for (let i = 1; i <= n; i++) { const t = i / n, e = t * t * (3 - 2 * t); const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e; cur.style.transitionDuration = "0ms"; cur.style.transform = `translate(${x}px, ${y}px)`; ptr("pointermove", x, y); await wait(33); }
    ptr("pointerup", x1, y1); cx = x1; cy = y1; await wait(300);
  };
  const longPress = async (x, y, nudge = [0, 0]) => {
    await point(x, y); ripple(); ptr("pointerdown", x, y);
    await wait(750);
    for (let i = 1; i <= 12; i++) { ptr("pointermove", x + nudge[0] * i / 12, y + nudge[1] * i / 12); cur.style.transitionDuration = "0ms"; cur.style.transform = `translate(${x + nudge[0] * i / 12}px, ${y + nudge[1] * i / 12}px)`; await wait(40); }
    ptr("pointerup", x + nudge[0], y + nudge[1]); await wait(500);
  };

  // ---------------- menu helpers ----------------
  const more = () => document.querySelector(".more");
  const reveal = (el) => { try { el.scrollIntoView({ block: "center", behavior: "instant" }); } catch (e) { el.scrollIntoView(); } };
  const openMenu = async () => { if (!D.isOpen()) await tap("grab", 700); };
  const closeMenu = async () => { if (D.isOpen()) await tap("styleBar", 700); };
  const group = async (id) => { const g = $(id); await openMenu(); if (!g.open) { reveal(g); await wait(200); await tap(g.querySelector("summary"), 600); } reveal(g); await wait(300); };
  const slide = async (id, to, ms = 1500, hold = 800) => {
    const inp = $(id); reveal(inp.closest(".ctl")); await wait(300);
    const r = inp.getBoundingClientRect(), mn = +inp.min, mx = +inp.max, from = +inp.value;
    const px = (v) => r.left + 14 + (r.width - 28) * (v - mn) / (mx - mn);
    await point(px(from), r.top + r.height / 2); ripple();
    inp.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }));
    await wait(250);
    const n = Math.round(ms / 40);
    for (let i = 1; i <= n; i++) {
      const t = i / n, e = t * t * (3 - 2 * t), v = from + (to - from) * e;
      inp.value = v; inp.dispatchEvent(new Event("input", { bubbles: true }));
      cur.style.transitionDuration = "0ms"; cur.style.transform = `translate(${px(+inp.value)}px, ${r.top + r.height / 2}px)`;
      await wait(40);
    }
    cx = px(to);
    await wait(hold);
    inp.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(500);
  };
  const radio = async (id, after = 900) => { const l = document.querySelector(`label[for="${id}"]`); reveal(l); await wait(200); await tap(l, after); };
  const mode = async (name, after = 1500) => {
    await closeMenu();
    const l = document.querySelector(`label[for="m-${name}"]`), r = l.getBoundingClientRect();
    if (r.left > 20 && r.right < innerWidth - 20) await tap(l, after);
    else { await point(innerWidth * 0.5, r.top + 70); ripple(); l.click(); await wait(after); }
  };
  const swipeStrip = async (dx, ms = 1000) => {
    const s = document.querySelector(".modes"), r = s.getBoundingClientRect();
    await point(innerWidth * 0.72, r.top + 70); ripple();
    s.dispatchEvent(new Event("touchstart"));
    const start = s.scrollLeft, n = Math.round(ms / 33);
    for (let i = 1; i <= n; i++) { const t = i / n, e = t * t * (3 - 2 * t); s.scrollLeft = start + dx * e; cur.style.transitionDuration = "0ms"; cur.style.transform = `translate(${innerWidth * (0.72 - 0.4 * e * Math.sign(dx))}px, ${r.top + 70}px)`; await wait(33); }
    s.dispatchEvent(new Event("touchend")); await wait(1200);
  };
  const useClip = async (i, hold = 1200) => { if (window.needClip) await window.needClip(i); else if (files.length) await D.loadClip(files[i % files.length]); await wait(hold); };
  const setColour = async (id, value) => {
    const inp = $(id), l = inp.closest("label"); reveal(l); await wait(200); await pointAt(l); ripple();
    inp.value = value; inp.dispatchEvent(new Event("input", { bubbles: true })); await wait(900);
  };

  // ---------------- the tour ----------------
  async function tour() {
    $("hint").hidden = true;
    document.querySelector(".top").style.opacity = "";
    if (!q.has("notitle")) await showCard("terraLens", "Turn the camera into plotter-ready line art", "by terraPen", 3200);
    await useClip(0, 1500);

    cap("Point the camera at anything. Here a short clip stands in for the live camera", "Live camera");
    await wait(3500);

    cap("Twenty styles. Swipe the carousel and the picture redraws as you go", "Styles");
    await swipeStrip(520); await swipeStrip(520);
    for (const [m, nm] of [["contour", "Contour"], ["ridges", "Ridges"], ["flow", "Flow"], ["blobs", "Blobs"], ["voronoi", "Voronoi"], ["subdiv", "Subdivision"], ["hatch", "Hatch"], ["technical", "Technical"], ["duotone", "Duotone"], ["engrave", "Engrave"]]) {
      cap(`${nm}`, "Tap any tile"); await mode(m, 1700);
    }
    await mode("wave", 1200);

    cap("Tap the picture to hide the menu. The carousel stays so you can keep browsing", "Clean view");
    await point(innerWidth * 0.5, innerHeight * 0.4); ripple(); D.toggleClean(); await wait(1800);
    await swipeStrip(900); await swipeStrip(900);
    await swipeStrip(-1800, 1400);
    cap("Tap again to bring the controls back", "Clean view");
    await point(innerWidth * 0.5, innerHeight * 0.4); ripple(); D.toggleClean(); await wait(1500);

    cap("Drag sideways on the picture to change the line spacing", "Gestures");
    await drag(innerWidth * 0.3, innerHeight * 0.4, innerWidth * 0.75, innerHeight * 0.4, 1800);
    cap("Drag up or down for contrast", "Gestures");
    await drag(innerWidth * 0.5, innerHeight * 0.5, innerWidth * 0.5, innerHeight * 0.25, 1500);
    await drag(innerWidth * 0.5, innerHeight * 0.3, innerWidth * 0.5, innerHeight * 0.38, 900);

    cap("Freeze the frame when you like the shot", "Shutter");
    await tap("shutter", 2500);
    cap("Resume to go live again", "Shutter");
    await tap("shutter", 1500);
    await useClip(1, 1500);

    cap("Open the menu for every setting", "Menu");
    await openMenu(); await wait(1200);
    cap("Line spacing", "Settings"); await slide("spacing", 6, 1600);
    await slide("spacing", 2.2, 1800, 500);
    cap("Wave height", "Settings"); await slide("amp", 170, 1500); await slide("amp", 60, 1300, 400);
    cap("Contrast and brightness", "Settings"); await slide("contrast", 2.2, 1400); await slide("bright", 0.18, 1200, 400);
    cap("Pen width, matched to your pen", "Settings"); await slide("pen", 0.7, 1300); await slide("pen", 0.3, 1000, 300);
    cap("Line wobble gives a hand-drawn look", "Settings"); await slide("jitLine", 85, 1800, 1200); await slide("jitLine", 20, 1200, 500);
    cap("Lost the balance? Reset sliders", "Settings"); await tap("btnReset", 1800);

    cap("Voronoi: choose how the cells are filled", "Cell fills");
    await mode("voronoi", 1000); await openMenu(); await wait(800);
    await slide("vorSmooth", 70, 1500, 1000);
    for (const [id, nm] of [["cf-hatch", "Hatch"], ["cf-cross", "Cross-hatch"], ["cf-grid", "Grid"], ["cf-iso", "Isometric"], ["cf-zig", "Zigzag"], ["cf-stipple", "Stipple"]]) { cap(`${nm} fill`, "Cell fills"); await radio(id, 1700); }
    await slide("jitHatch", 70, 1500, 900);
    await radio("cf-none", 400); await slide("vorSmooth", 0, 900, 200);

    cap("Blobs with a zigzag fill", "Fills");
    await mode("blobs", 800); await openMenu(); await wait(500);
    reveal($("blobFillRow")); await radio("bf-zig", 1800); await radio("bf-cross", 1500); await radio("bf-hatch", 800);

    cap("Hatch lines clip cleanly to every outline", "Hatch");
    await mode("hatch", 1500);

    await mode("wave", 800);
    cap("Background culling: cut the background out of the capture", "Background");
    await group("cullSec"); await radio("cu-radial", 1200);
    await slide("cullAt", 45, 1600, 900); await slide("cullSoft", 70, 1200, 600);
    cap("Move the centre anywhere", "Background"); await slide("cullX", 25, 1300, 500); await slide("cullY", 70, 1300, 900);
    await radio("cu-dark", 1500); await radio("cu-off", 800);

    cap("Colour bands: a gradient of pens across the sheet", "Colour bands");
    await group("bandSec"); await radio("bd-linear", 1500);
    await slide("bandAngle", 60, 1500, 900);
    cap("Edge blend scatters strokes so the bands melt together", "Colour bands");
    await slide("bandBlend", 90, 1500, 1200);
    cap("Or radial bands, moved wherever you like", "Colour bands");
    await radio("bd-radial", 1400); await slide("bandX", 70, 1300, 400); await slide("bandY", 30, 1300, 1000);
    await slide("bandN", 4, 900, 900);
    await radio("bd-off", 600);

    cap("Place a focal point: long-press the picture", "Focal point");
    await closeMenu(); await mode("hatch", 800);
    await longPress(innerWidth * 0.5, innerHeight * 0.52, [0, 24]); await wait(1400);
    cap("Lines converge on it. Thin zone stops them saturating the paper", "Focal point");
    await group("focusSec");
    await slide("clipZone", 0, 1100, 900); await slide("clipZone", 55, 1600, 1400);
    await slide("clipKeep", 30, 1000, 900);
    await radio("fp-repel", 1500); await radio("fp-attract", 900);
    await tap("btnFocusOff", 1200);

    cap("Choose a colour for each pen layer", "Layer colours");
    await mode("duotone", 800); await group("penSec");
    await setColour("pen0", "#0b3d91"); await setColour("pen1", "#ff7a1a");
    await setColour("pen0", "#17321b"); await setColour("pen1", "#e83b68");

    cap("Plot on any paper: preview the colour of the sheet", "Paper");
    await group("paperSec");
    cap("From A0 down to A6 postcards, portrait, landscape or square", "Paper");
    await wait(300);
    const sel = $("paperSize"); await pointAt(sel); ripple();
    for (const v of ["a5", "a6"]) { sel.value = v; sel.dispatchEvent(new Event("change", { bubbles: true })); await wait(1500); }
    await radio("sh-l", 1500); await radio("sh-p", 700);
    cap("Kraft, grey, cream or black paper", "Paper");
    for (const c of ["#cdb18a", "#17321b", "#111111"]) { const b = document.querySelector(`#paperSwatches button[data-c="${c}"]`); reveal(b); await tap(b, 1500); }
    await tap(document.querySelector('#paperSwatches button[data-c="#cdb18a"]'), 800);

    cap("Save one SVG with a coloured layer for every pen", "Export");
    await group("exportSec");
    await closeMenu(); await wait(300);
    await pointAt($("btnSave")); ripple(); await wait(2600);

    capOff();
    await showCard("Free in your browser", "terrapen.xyz", "terraLens", 4200);
    await wait(500);
  }

  let files = [];
  window.__runDemo = async () => { try { await tour(); } finally { window.__demoDone = true; } };
  window.__demoDone = false;

  if (!window.needClip) { // hand-run: pick the clips, then press play
    const p = mk("dm-panel");
    p.innerHTML = `<b>Demo tour</b><span>Choose one or more short video clips (MP4 or WebM). They stand in for the camera.</span>
      <input type="file" id="dmFiles" accept="video/*" multiple><button id="dmGo" type="button">Play tour</button>`;
    p.querySelector("#dmFiles").addEventListener("change", (e) => { files = [...e.target.files]; });
    p.querySelector("#dmGo").addEventListener("click", () => { p.remove(); window.__runDemo(); });
  }
})();
