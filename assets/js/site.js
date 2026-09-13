(function () {
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function themeColor(next) {
    return next === 'dark' ? '#141414' : '#FAFAFA';
  }

  function syncThemeColor(next) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', themeColor(next));
  }

  function syncGiscus(next) {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: next } } },
        'https://giscus.app'
      );
    } catch (err) {}
  }

  function clearArrive() {
    document.documentElement.removeAttribute('data-arrive');
  }

  if (document.documentElement.hasAttribute('data-arrive')) {
    var main = document.getElementById('mainContent');
    if (main) {
      var kids = Array.prototype.filter.call(main.children, function (el) {
        return el.tagName !== 'SCRIPT' && !el.hasAttribute('aria-hidden');
      });
      var last = kids[Math.min(kids.length, 8) - 1];
      if (last) {
        last.addEventListener('animationend', function (event) {
          if (event.target === last && event.animationName === 'arrive') clearArrive();
        });
      }
    }
    window.setTimeout(clearArrive, 1000);
  }

  var btn = document.getElementById('theme-toggle');
  if (btn) {
    function updateToggleState(isDark) {
      btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    }

    function currentIsDark() {
      var attr = document.documentElement.getAttribute('data-theme');
      return attr === 'dark' || (!attr && !window.matchMedia('(prefers-color-scheme: light)').matches);
    }

    function applyTheme(next) {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleState(next === 'dark');
      syncThemeColor(next);
      syncGiscus(next);
    }

    updateToggleState(currentIsDark());

    btn.addEventListener('click', function () {
      var next = currentIsDark() ? 'light' : 'dark';
      if (document.startViewTransition && !prefersReducedMotion()) {
        document.startViewTransition(function () {
          applyTheme(next);
        });
      } else {
        applyTheme(next);
      }
    });
  }

  var emailLinks = document.querySelectorAll('.js-email');
  for (var i = 0; i < emailLinks.length; i++) {
    var el = emailLinks[i];
    var u = el.getAttribute('data-u');
    var d = el.getAttribute('data-d');
    if (u && d) {
      var user = u.trim();
      var domain = d.trim();
      var isValidUser = /^[A-Za-z0-9._%+-]+$/.test(user);
      var isValidDomain = /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(domain);
      if (isValidUser && isValidDomain) {
        el.setAttribute(
          'href',
          'ma' + 'il' + 'to:' + encodeURIComponent(user) + '@' + encodeURIComponent(domain)
        );
        el.removeAttribute('data-u');
        el.removeAttribute('data-d');
      }
    }
  }

  var navBar = document.querySelector('header nav');
  if (navBar && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      navBar.classList.toggle('scrolled', !entries[0].isIntersecting);
    }, { rootMargin: '8px 0px 0px 0px' }).observe(sentinel);
  }

  var navList = document.querySelector('header nav ul');
  if (navList) {
    var syncNavScrollable = function () {
      navList.classList.toggle('is-scrollable', navList.scrollWidth > navList.clientWidth + 1);
    };
    syncNavScrollable();
    window.addEventListener('resize', syncNavScrollable);
  }

  var indicator = navList && navList.querySelector('.nav-indicator');
  if (navList && indicator) {
    // One pill: it rests on the current page and follows the pointer or focus.
    // The class tells CSS to drop the static fill on .current so the two never
    // stack; without JS that fill stays and marks the page on its own.
    navList.classList.add('has-indicator');

    var resting = navList.querySelector('a.current');
    var active = null;

    function moveIndicator(link, jump) {
      active = link;
      // No target, or a target hidden at this breakpoint (Home below tablet).
      if (!link || !link.offsetWidth) {
        indicator.style.opacity = '0';
        return;
      }
      // Jumping skips the slide, so the pill never animates in from x=0.
      if (jump) indicator.style.transition = 'none';
      indicator.classList.toggle('is-resting', link === resting);
      indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.opacity = '1';
      if (jump) {
        void indicator.offsetWidth;
        indicator.style.transition = '';
      }
    }

    function restIndicator() {
      moveIndicator(resting, false);
    }

    function trackEvent(event) {
      var link = event.target.closest && event.target.closest('a');
      if (link && navList.contains(link)) moveIndicator(link, false);
    }

    moveIndicator(resting, true);

    navList.addEventListener('pointerover', function (event) {
      if (event.pointerType === 'touch') return;
      trackEvent(event);
    });
    navList.addEventListener('pointerleave', function (event) {
      if (event.pointerType === 'touch') return;
      restIndicator();
    });
    navList.addEventListener('focusin', trackEvent);
    navList.addEventListener('focusout', restIndicator);

    window.addEventListener('resize', function () {
      moveIndicator(active, true);
    });
  }

  var resumePrint = document.getElementById('resume-print-btn');
  if (resumePrint) {
    resumePrint.addEventListener('click', function () {
      window.print();
    });
  }

  var postImages = document.querySelectorAll('article.blogpost figure img');
  for (var p = 1; p < postImages.length; p++) {
    postImages[p].setAttribute('loading', 'lazy');
  }

  if (window.navigation && typeof PageSwapEvent !== 'undefined') {
    window.addEventListener('pageswap', function (event) {
      if (!event.viewTransition || !event.activation || !event.activation.entry) return;
      try {
        var dest = new URL(event.activation.entry.url);
        if (dest.origin !== location.origin) return;
        var path = dest.pathname.replace(/\/$/, '') || '/';
        var clicked = document.querySelector('#blog-list h3 a[href="' + dest.pathname + '"]')
          || document.querySelector('#blog-list h3 a[href="' + path + '"]');
        // Name the heading, not the link: a link that wraps onto two lines is
        // a fragmented inline box and cannot be captured.
        var heading = clicked && clicked.closest('h3');
        if (heading) heading.style.viewTransitionName = 'post-title';
      } catch (err) {}
    });

    window.addEventListener('pagereveal', function (event) {
      if (!event.viewTransition) return;
      var title = document.getElementById('post-title');
      if (!title) return;
      title.style.viewTransitionName = 'post-title';
      event.viewTransition.finished.then(function () {
        title.style.viewTransitionName = '';
      }, function () {
        title.style.viewTransitionName = '';
      });
    });
  }
})();
