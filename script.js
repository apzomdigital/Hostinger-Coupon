// Copy-to-clipboard for the coupon buttons. The code stays visible and
// selectable without JavaScript; the buttons only appear when this runs.
(function () {
  var RESET_MS = 2500;

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function selectCode(card) {
    var code = card && card.querySelector('.coupon-code');
    if (!code || !window.getSelection) return;
    var range = document.createRange();
    range.selectNodeContents(code);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(text); }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    var card = btn.closest('.coupon-card');
    var status = card && card.querySelector('.coupon-status');
    var timer;
    btn.hidden = false;

    btn.addEventListener('click', function () {
      copy(btn.getAttribute('data-copy')).then(function (ok) {
        clearTimeout(timer);
        if (ok) {
          btn.textContent = 'Copied!';
          btn.classList.add('is-copied');
          if (status) status.textContent = 'HARSHILBAROT copied. Paste it into Hostinger’s coupon field.';
        } else {
          selectCode(card);
          if (status) status.textContent = 'Copy blocked by your browser. The code is selected; press Ctrl+C or ⌘C.';
        }
        timer = setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('is-copied');
          if (status) status.textContent = '';
        }, RESET_MS);
      });
    });
  });
})();
