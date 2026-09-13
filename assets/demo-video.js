/* Demo slide (sections/06-app.qmd #app-demo): clicker-driven playback.
 * The slide arrives on the recording's first frame. The next press reveals the .demo-play fragment,
 * which starts the video; pressing back hides the fragment and pauses it; leaving the slide stops it.
 * Nothing to configure. */
(function () {
  function videoFor(fragment) {
    var section = fragment.closest('section');
    return section && section.querySelector('video.demo-video');
  }
  function boot() {
    Reveal.on('fragmentshown', function (e) {
      if (!e.fragment.classList.contains('demo-play')) return;
      var v = videoFor(e.fragment);
      if (!v) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});   // a blocked autoplay is not an error worth surfacing
    });
    Reveal.on('fragmenthidden', function (e) {
      if (!e.fragment.classList.contains('demo-play')) return;
      var v = videoFor(e.fragment);
      if (v) v.pause();
    });
    Reveal.on('slidechanged', function (e) {
      if (!e.previousSlide) return;
      e.previousSlide.querySelectorAll('video.demo-video').forEach(function (v) { v.pause(); v.currentTime = 0; });
    });
  }
  function whenReady(fn) {
    if (window.Reveal && Reveal.isReady && Reveal.isReady()) fn();
    else if (window.Reveal && Reveal.on) Reveal.on('ready', fn);
    else window.addEventListener('load', function () { whenReady(fn); });
  }
  whenReady(boot);
})();
