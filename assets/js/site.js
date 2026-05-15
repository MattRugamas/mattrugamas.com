(function () {
  // Theme toggle
  var btn = document.getElementById('theme-toggle');
  if (btn) {
    // Switch semantics: aria-checked === true means dark theme is active.
    function updateToggleState(isDark) {
      btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    }
    var attr = document.documentElement.getAttribute('data-theme');
    var isDark = attr === 'dark' || (!attr && !window.matchMedia('(prefers-color-scheme: light)').matches);
    updateToggleState(isDark);

    btn.addEventListener('click', function () {
      var attr = document.documentElement.getAttribute('data-theme');
      var isDark = attr === 'dark' || (!attr && !window.matchMedia('(prefers-color-scheme: light)').matches);
      var next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleState(next === 'dark');
      // Sync theme-color meta tags with the new theme
      var tc = next === 'dark' ? '#2A2D33' : '#F8F5EE';
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var j = 0; j < metas.length; j++) metas[j].setAttribute('content', tc);
      // Sync Giscus iframe theme if present
      var giscusFrame = document.querySelector('iframe.giscus-frame');
      if (giscusFrame) {
        giscusFrame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: next } } },
          'https://giscus.app'
        );
      }
    });
  }

  // Email link obfuscation
  var emailLinks = document.querySelectorAll('.js-email');
  for (var i = 0; i < emailLinks.length; i++) {
    var el = emailLinks[i];
    var u = el.getAttribute('data-u');
    var d = el.getAttribute('data-d');
    if (u && d) {
      el.setAttribute('href', 'ma' + 'il' + 'to:' + u + '@' + d);
      el.removeAttribute('data-u');
      el.removeAttribute('data-d');
    }
  }

  // Hamburger nav toggle
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    function closeNav() {
      var nav = document.querySelector('header nav');
      if (nav) nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
    }

    navToggle.addEventListener('click', function () {
      var nav = document.querySelector('header nav');
      if (!nav) return;
      var isOpen = nav.classList.toggle('open');
      this.setAttribute('aria-expanded', isOpen.toString());
      this.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    document.addEventListener('click', function (e) {
      var nav = document.querySelector('header nav');
      if (nav && nav.classList.contains('open') && !nav.contains(e.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var nav = document.querySelector('header nav');
      if (nav && nav.classList.contains('open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  var resumePrint = document.getElementById('resume-print-btn');
  if (resumePrint) {
    resumePrint.addEventListener('click', function () {
      window.print();
    });
  }
})();
