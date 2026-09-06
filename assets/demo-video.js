/* Demo slide (sections/06-app.qmd): the placeholder tag over the poster goes away once the
 * <video> has a source it can actually load. Nothing to configure; drop the recording in images/. */
(function () {
  function boot() {
    document.querySelectorAll('.browser--demo').forEach(function (frame) {
      var video = frame.querySelector('video');
      if (!video) return;
      var mark = function () { frame.classList.add('has-video'); };
      if (video.readyState >= 1) mark();
      video.addEventListener('loadedmetadata', mark, { once: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
