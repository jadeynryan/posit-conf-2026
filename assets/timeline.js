/* Timeline tape for the hook slides (Ruth · cookbook · grocery).
 *
 * One overlay is appended to .slides, so it inherits reveal's scaling and is
 * laid out in 1920×1080 slide px, and it persists while the three slides
 * change underneath it. A fixed cursor sits at the centre; a calendar strip
 * scrolls under it to whichever stop the current slide names in
 * data-milestone ("1930-08" for a month stop, "1955" for a year stop). While the strip is moving, a speed-driven
 * fisheye bulges the labels near the cursor; at rest it relaxes to linear.
 *
 *   arriving from another hook slide  →  scroll there, hold the slide's
 *                                        content until the strip is nearly
 *                                        home, then let it fade in
 *   arriving from anywhere else       →  snap, show the content at once
 *   leaving the hook slides           →  the overlay fades out
 *
 * The strip is hidden for PDF export and in overview (assets/timeline.css);
 * each slide carries a plain .tl-static rail for the PDF instead.
 */
(function () {
  const SPACING   = 120;    // px between neighbouring stops at rest
  const FISH_X    = 280;    // px multiplier for the compressed (fisheye) x position
  const EASE      = 2.4;    // 1/s; approach rate toward the target stop (lower = slower travel)
  const FISH_EASE = 6.3;    // 1/s; how quickly fisheye intensity follows strip speed
  const FISH_GAIN = 0.053;  // intensity per (stop/s) of strip speed
  const REVEAL_AT = 2;      // stops from home at which the slide content starts fading in
  const SETTLE    = 0.015;  // stops; closer than this, and with no fisheye left, counts as home

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = (y) => Array.from({ length: 12 }, (_, i) => ({ year: y, month: i + 1 }));
  // months in the years that carry a month-level milestone, bare years everywhere else.
  // 1930→1938 crosses 21 stops; 1938→1955 crosses 19, so the long gap reads as years
  // flicking past rather than a longer wait (the ease is exponential, so travel time
  // barely depends on distance)
  const years = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => ({ year: a + i }));
  const SCHEMA = [
    ...months(1930),
    ...years(1931, 1937),
    ...months(1938),
    ...years(1939, 1955),
  ];
  const keyOf = (s) => (s.month ? `${s.year}-${String(s.month).padStart(2, '0')}` : `${s.year}`);

  function boot() {
    const sections = [...document.querySelectorAll('.reveal .slides section[data-milestone]')];
    const slidesEl = document.querySelector('.reveal .slides');
    if (!sections.length || !slidesEl || !window.Reveal) return;

    const milestones = new Set(sections.map((s) => s.dataset.milestone));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- build ---- */
    const overlay = document.createElement('div');
    overlay.className = 'tl-overlay is-hidden';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="tl-axis"></div><div class="tl-stage"></div>' +
      '<div class="tl-cursor"><span class="tl-cursor__tick"></span><span class="tl-cursor__ring"></span></div>';
    const stageEl = overlay.querySelector('.tl-stage');

    const indexOf = {};
    const nodes = SCHEMA.map((s, i) => {
      const key = keyOf(s);
      indexOf[key] = i;
      const isYear = !s.month;
      const isEvent = milestones.has(key);
      // month stops show the full year beneath the month so "Aug" can never read as 2030
      const label = isYear ? String(s.year)
        : `${MONTHS[s.month - 1]}<span class="tl-year">${s.year}</span>`;

      const el = document.createElement('div');
      el.className = 'tl-node' + (isYear ? ' is-year' : '') + (isEvent ? ' has-event' : '');
      el.innerHTML = `<span class="tl-dot"></span><span class="tl-label-wrap"><span class="tl-label">${label}</span></span>`;
      stageEl.appendChild(el);
      return { i, el, dot: el.firstChild, wrap: el.lastChild };
    });
    slidesEl.appendChild(overlay);

    /* ---- state ---- */
    let cur = 0, target = 0, intensity = 0;
    let holding = null;     // section whose content is waiting for the strip to land
    let running = false, lastT = null;
    let raf = 0;            // handle of the queued frame, so a snap can cancel it

    function render() {
      for (const n of nodes) {
        const delta = n.i - cur;
        const a = Math.abs(delta);
        const opacity = Math.max(0, 1 - a * 0.15);
        if (opacity === 0) { n.el.style.opacity = '0'; continue; }

        const x = delta * SPACING * (1 - intensity) + Math.sign(delta) * Math.atan(a * 0.35) * FISH_X * intensity;
        const scale = Math.max(0.35, 1.25 - a * 0.15) * (1 - intensity) + Math.max(0.15, 2.2 / (1 + a * 0.5)) * intensity;

        n.el.style.opacity = opacity;
        n.el.style.transform = `translate(${x}px,0)`;
        n.dot.style.transform = `scale(${scale})`;
        n.wrap.style.transform = `scale(${scale})`;
        n.el.classList.toggle('is-center', a < 0.25);
      }
    }

    function release() {
      if (holding) { holding.classList.remove('tl-hold'); holding = null; }
    }

    function frame(t) {
      raf = 0;
      // a second frame landing on the same timestamp (two loops sharing one clock) would
      // divide by zero and poison every value with NaN, freezing the strip for good
      const dt = lastT == null ? 1 / 60 : Math.min(0.05, (t - lastT) / 1000);
      if (!(dt > 0)) { raf = requestAnimationFrame(frame); return; }
      lastT = t;
      const diff = target - cur;
      const step = diff * (1 - Math.exp(-EASE * dt));
      cur += step;
      const speed = Math.abs(step) / dt;                                   // stops per second
      intensity += (Math.min(1, speed * FISH_GAIN) - intensity) * (1 - Math.exp(-FISH_EASE * dt));
      render();

      if (holding && Math.abs(diff) < REVEAL_AT) release();
      if (Math.abs(diff) < SETTLE && intensity < 0.02) {
        cur = target; intensity = 0; render(); release();
        running = false; lastT = null;
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function run() { if (!running) { running = true; lastT = null; raf = requestAnimationFrame(frame); } }

    // a snap must also drop any frame still queued, or the next run() starts a second loop
    function snapTo(idx) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      target = cur = idx; intensity = 0; running = false; lastT = null; render();
    }

    /* ---- drive from reveal ---- */
    function show(section, animate) {
      const idx = indexOf[section.dataset.milestone];
      if (idx == null) return;
      overlay.classList.remove('is-hidden');
      release();
      if (animate && !reduced) {
        holding = section;
        section.classList.add('tl-hold');
        target = idx;
        run();
      } else {
        snapTo(idx);
      }
    }
    function hide() {
      release();
      overlay.classList.add('is-hidden');
    }

    Reveal.on('slidechanged', (e) => {
      const to = e.currentSlide, from = e.previousSlide;
      if (to && to.dataset.milestone) show(to, !!(from && from.dataset.milestone));
      else hide();
    });

    // reveal rescales .slides on resize, fullscreen and leaving overview; rewriting the
    // transforms then forces the browser to redraw the stops at the new scale
    Reveal.on('resize', render);
    Reveal.on('overviewhidden', render);

    const now = Reveal.getCurrentSlide();
    if (now && now.dataset.milestone) show(now, false);
  }

  function whenReady(fn) {
    if (window.Reveal && Reveal.isReady && Reveal.isReady()) fn();
    else if (window.Reveal && Reveal.on) Reveal.on('ready', fn);
    else window.addEventListener('load', () => whenReady(fn));
  }
  whenReady(boot);
})();
