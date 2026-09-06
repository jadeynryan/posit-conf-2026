/* Deck footer: the two logos as one lockup (WSDA | IndieVisual), bottom-right, on every slide. One element appended to
 * .slides (so it scales with the deck), tinted by CSS to the slide beneath it
 * (light on dark slides, dark on light ones) and hidden on the title slide, which
 * carries its own larger logos. See brand.scss "deck footer". */
(function () {
  function boot() {
    const slides = document.querySelector('.reveal .slides');
    if (!slides || slides.querySelector('.deck-footer')) return;
    const el = document.createElement('div');
    el.className = 'deck-footer'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<img src="images/logo-wsda.png" alt=""><span class="deck-footer__sep"></span><img src="images/logo-indievisual.png" alt="">';
    slides.appendChild(el);
  }
  function whenReady(fn) {
    if (window.Reveal && Reveal.isReady && Reveal.isReady()) fn();
    else if (window.Reveal && Reveal.on) Reveal.on('ready', fn);
    else window.addEventListener('load', () => whenReady(fn));
  }
  whenReady(boot);
})();
