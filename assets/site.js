/* ==========================================================================
   Word Structures — shared public-site behaviour
   WEB-SLICE-1 preview foundation.

   Two enhancements only. Both are additive: with JavaScript disabled the page
   stays complete and navigable, so nothing here may be load-bearing for
   content. Native elements do the work — <details>/<summary> for the mobile
   navigation, <button> for the reveal — so keyboard support is inherited
   rather than reimplemented.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation ------------------------------------------------------- */
  /* The markup ships <details open>, so with JS off the links are simply
     visible at every width. Here we collapse it at narrow widths only, and
     re-open it when the viewport grows — otherwise the summary would be
     hidden by CSS while the list stayed closed, leaving no visible nav. */

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav || typeof window.matchMedia !== 'function') return;

    var wide = window.matchMedia('(min-width: 48em)');

    function sync() { nav.open = wide.matches; }

    sync();

    if (typeof wide.addEventListener === 'function') {
      wide.addEventListener('change', sync);
    } else if (typeof wide.addListener === 'function') {
      wide.addListener(sync); // older Safari
    }
  }

  /* --- "See the structure" reveal --------------------------------------- */
  /* Three deterministic states. No randomness, no drag, no canvas, no hover.
     State 0 -> counts -> the name, then back to 0. */

  var LABELS = ['Count the letters', 'What is this called?', 'Start over'];

  function initReveal() {
    var root = document.querySelector('[data-reveal]');
    if (!root) return;

    var button = root.querySelector('[data-reveal-btn]');
    var stepsRoot = root.querySelector('[data-reveal-steps]');
    if (!button || !stepsRoot) return;

    var steps = Array.prototype.slice.call(
      stepsRoot.querySelectorAll('[data-step]')
    );
    if (!steps.length) return;

    /* Announce revealed content: it appears below the button without moving
       focus, and there is no native equivalent for that. This is the only
       ARIA on the page. */
    stepsRoot.setAttribute('aria-live', 'polite');

    var state = 0;

    function render() {
      steps.forEach(function (step) {
        var n = Number(step.getAttribute('data-step'));
        step.hidden = n > state;
      });
      button.textContent = LABELS[state];
    }

    button.hidden = false;
    render();

    button.addEventListener('click', function () {
      state = (state + 1) % LABELS.length;
      render();
    });
  }

  function init() {
    initNav();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
