(function () {
  var GISCUS_ORIGIN = 'https://giscus.app';
  var RECOVERABLE_ERRORS = [
    'Discussion not found',
    'Bad credentials',
    'Invalid state value',
    'State has expired',
  ];

  var comments = document.currentScript.parentNode;

  function hideComments() {
    comments.hidden = true;
    comments.setAttribute('aria-hidden', 'true');
  }

  function isRecoverableError(message) {
    for (var i = 0; i < RECOVERABLE_ERRORS.length; i++) {
      if (message.indexOf(RECOVERABLE_ERRORS[i]) !== -1) return true;
    }
    return false;
  }

  function onGiscusMessage(event) {
    if (event.origin !== GISCUS_ORIGIN) return;
    if (!(typeof event.data === 'object' && event.data.giscus)) return;

    var message = event.data.giscus.error;
    if (!message || isRecoverableError(message)) return;

    hideComments();
    window.removeEventListener('message', onGiscusMessage);
  }

  window.addEventListener('message', onGiscusMessage);

  var stored = localStorage.getItem('theme');
  var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  var s = document.createElement('script');
  s.src = GISCUS_ORIGIN + '/client.js';
  s.setAttribute('data-repo', 'mattrugamas/mattrugamas.com');
  s.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkxNjA2NDAzNjU=');
  s.setAttribute('data-category', 'Announcements');
  s.setAttribute('data-category-id', 'DIC_kwDOCZMtbc4C6mWJ');
  s.setAttribute('data-mapping', 'pathname');
  s.setAttribute('data-strict', '0');
  s.setAttribute('data-reactions-enabled', '1');
  s.setAttribute('data-emit-metadata', '0');
  s.setAttribute('data-input-position', 'top');
  s.setAttribute('data-theme', isDark ? 'dark' : 'light');
  s.setAttribute('data-lang', 'en');
  s.setAttribute('crossorigin', 'anonymous');
  s.async = true;
  s.onerror = function () {
    hideComments();
    window.removeEventListener('message', onGiscusMessage);
  };
  document.currentScript.parentNode.appendChild(s);
})();
