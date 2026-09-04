/* Three Levels of Adoption: reveal.js-aware version of the concentric-rings build.
 *
 * Stages are driven by reveal fragments (three invisible <span class="fragment rings-trigger">
 * elements in sections/03-playbook.qmd), so the down/right arrow advances a ring and the
 * left arrow walks it back. Figures are positioned in slide pixels (1920×1080) inside an
 * overlay that covers the slide, so they land correctly no matter how reveal scales the deck.
 *
 *   stage 1  →  the creator (one figure in the core)
 *   stage 2  →  other coders (ring of figures) + ring outline
 *   stage 3  →  everyone (outer ring) + ring outline + quote
 *
 * Every keypress lands at once: a new stage first fast-forwards whatever is still walking,
 * the ring outline and level text switch on at the start of the stage (not after the last
 * straggler), and a whole stage lands within STAGE_MAX ms however many figures it has.
 * Figures spawn just outside the outer ring and walk straight in, so they never cross the
 * title or the text column.
 */
(function () {
  const SLIDE_W = 1920, SLIDE_H = 1080;
  const STAGE_MAX = 1200;             // ms; a stage has fully landed this long after the keypress
  const WALK_MIN = 450, WALK_MAX = 850;   // ms; one figure's walk
  const FADE_OUT = 350;               // ms; walking a stage back

  function boot() {
    const section = document.getElementById('three-levels');
    if (!section || !window.Reveal) return;

    const stage    = section.querySelector('.rings-stage');
    const diagram  = section.querySelector('.rings-diagram');
    const tpl      = section.querySelector('#rings-figure-template');
    const ringCore = section.querySelector('#ring-core');
    const ring2    = section.querySelector('#ring-2');
    const ring3    = section.querySelector('#ring-3');
    const quote    = section.querySelector('.rings-quote');
    const levels   = [null, 1, 2, 3].map((n) => (n ? section.querySelector('#level-' + n) : null));
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cx, cy, R1, R2, R3, SPAWN_R;
    function measure() {
      const s = Reveal.getScale ? Reveal.getScale() : 1;
      const sb = stage.getBoundingClientRect();
      const db = diagram.getBoundingClientRect();
      const size = db.width / s;
      cx = (db.left - sb.left) / s + size / 2;
      cy = (db.top - sb.top) / s + size / 2;
      R1 = size * 0.11;
      R2 = size * 0.34;
      R3 = size * 0.47;
      SPAWN_R = size * 0.62;          // just beyond the outer ring
    }

    let current = 0;                                  // stage currently rendered
    const figures = { 1: [], 2: [], 3: [] };
    const timers = new Set();                         // every pending timeout, so a new press can fast-forward
    const leaving = new Set();                        // figures fading out
    function later(fn, ms) {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
    }

    // fast-forward: everything still walking lands, everything still fading is gone
    function settle() {
      timers.forEach(clearTimeout); timers.clear();
      for (const lvl of [1, 2, 3]) for (const el of figures[lvl]) {
        el.style.transition = 'none';
        el.style.left = el.dataset.tx + 'px';
        el.style.top = el.dataset.ty + 'px';
        el.classList.remove('walking');
      }
      leaving.forEach((el) => el.remove()); leaving.clear();
    }

    // a point just outside the outer ring, roughly on the ray through the target,
    // so the figure walks inward and never crosses the text
    function spawnPoint(tx, ty) {
      const base = (tx === cx && ty === cy) ? Math.random() * Math.PI * 2 : Math.atan2(ty - cy, tx - cx);
      const a = base + (Math.random() - 0.5) * 1.1;
      return { x: cx + SPAWN_R * Math.cos(a), y: cy + SPAWN_R * Math.sin(a) };
    }

    function makeFigure(tx, ty, level, animate) {
      const el = document.createElement('div');
      el.className = 'figure l' + level;
      el.appendChild(tpl.content.cloneNode(true));
      el.dataset.tx = tx; el.dataset.ty = ty;
      stage.appendChild(el);
      figures[level].push(el);

      if (!animate || reduced) {
        el.style.left = tx + 'px';
        el.style.top = ty + 'px';
        return;
      }
      const start = spawnPoint(tx, ty);
      el.style.left = start.x + 'px';
      el.style.top = start.y + 'px';
      if (tx < start.x) el.classList.add('flip');

      const dist = Math.hypot(tx - start.x, ty - start.y);
      const duration = Math.min(WALK_MAX, Math.max(WALK_MIN, dist * 1.1));
      const delay = Math.random() * (STAGE_MAX - duration);   // everyone is home by STAGE_MAX
      later(() => {
        el.classList.add('walking');
        void el.offsetWidth;
        el.style.transition = `left ${duration}ms cubic-bezier(.3,.55,.25,1), top ${duration}ms cubic-bezier(.3,.55,.25,1)`;
        el.style.left = tx + 'px';
        el.style.top = ty + 'px';
        later(() => el.classList.remove('walking'), duration);
      }, delay);
    }

    function ringPositions(n, r, offset) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = offset + (i / n) * Math.PI * 2;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      return pts;
    }
    const ringCount = (r) => Math.max(5, Math.round((2 * Math.PI * r) / 40));

    function showRing(el, r) {
      el.style.width = r * 2 + 'px';
      el.style.height = r * 2 + 'px';
      requestAnimationFrame(() => el.classList.add('show'));
    }

    function removeFigures(level, animate) {
      const list = figures[level];
      figures[level] = [];
      list.forEach((el) => {
        if (!animate || reduced) { el.remove(); return; }
        el.classList.remove('walking');
        leaving.add(el);
        el.style.transition = `opacity ${FADE_OUT}ms ease, top ${FADE_OUT}ms ease`;
        el.style.opacity = '0';
        el.style.top = parseFloat(el.style.top) + 26 + 'px';
        later(() => { el.remove(); leaving.delete(el); }, FADE_OUT + 20);
      });
    }

    // advance exactly one stage; the ring and the level text switch on at once
    function stepUp(animate) {
      measure();
      const next = current + 1;
      if (next === 1) {
        showRing(ringCore, R1);
        makeFigure(cx, cy, 1, animate);
      } else if (next === 2) {
        showRing(ring2, R2);
        ringPositions(ringCount(R2), R2, -Math.PI / 2).forEach((p) => makeFigure(p.x, p.y, 2, animate));
      } else if (next === 3) {
        showRing(ring3, R3);
        const n = ringCount(R3);
        ringPositions(n, R3, -Math.PI / 2 + Math.PI / n).forEach((p) => makeFigure(p.x, p.y, 3, animate));
        quote.classList.add('show');
      }
      levels[next].classList.add('active');
      current = next;
    }

    function stepDown(animate) {
      const gone = current;
      removeFigures(gone, animate);
      levels[gone].classList.remove('active');
      if (gone === 1) ringCore.classList.remove('show');
      if (gone === 2) ring2.classList.remove('show');
      if (gone === 3) { ring3.classList.remove('show'); quote.classList.remove('show'); }
      current = gone - 1;
    }

    // go to a stage now: whatever is mid-flight lands first, then the change happens
    function setStage(target, animate) {
      target = Math.max(0, Math.min(3, target));
      if (target === current) return;
      settle();
      while (current < target) stepUp(animate);
      while (current > target) stepDown(animate);
    }

    // how many fragments are currently shown on this slide → stage number
    function stageFromIndices() {
      const idx = Reveal.getIndices();
      return Math.max(0, Math.min(3, (idx.f == null ? -1 : idx.f) + 1));
    }
    const onThisSlide = () => Reveal.getCurrentSlide() === section;

    Reveal.on('fragmentshown', (e) => {
      if (!onThisSlide()) return;
      const s = e.fragment && e.fragment.dataset.stage;
      if (s) setStage(+s, true);
    });
    Reveal.on('fragmenthidden', (e) => {
      if (!onThisSlide()) return;
      const s = e.fragment && e.fragment.dataset.stage;
      if (s) setStage(+s - 1, true);
    });
    // entering the slide (forward or backward): render whatever state reveal says, instantly
    Reveal.on('slidechanged', (e) => {
      if (e.currentSlide === section) setStage(stageFromIndices(), false);
      else if (e.previousSlide === section) setStage(0, false);
    });
    Reveal.on('resize', () => { if (onThisSlide() && current > 0) { const s = current; setStage(0, false); setStage(s, false); } });

    if (onThisSlide()) setStage(stageFromIndices(), false);
  }

  function whenReady(fn) {
    if (window.Reveal && Reveal.isReady && Reveal.isReady()) fn();
    else if (window.Reveal && Reveal.on) Reveal.on('ready', fn);
    else window.addEventListener('load', () => whenReady(fn));
  }
  whenReady(boot);
})();
