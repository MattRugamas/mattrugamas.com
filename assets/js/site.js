(function () {
  // Sequenced entrance animations — fade and float elements in on load.
  function unwrapForAnimation(container) {
    if (
      container.matches('.link-hub') ||
      (container.children.length > 1 && container.matches('section, div, article'))
    ) {
      return Array.prototype.slice.call(container.children);
    }
    return [container];
  }

  function collectEntranceItems() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return [];
    }

    var items = [];
    var nav = document.querySelector('header nav');
    if (nav) items.push(nav);

    var main = document.getElementById('mainContent');
    if (main) {
      var children = Array.prototype.slice.call(main.children).filter(function (el) {
        return !el.hasAttribute('aria-hidden') && el.tagName !== 'SCRIPT';
      });

      if (children.length === 1) {
        items = items.concat(unwrapForAnimation(children[0]));
      } else {
        children.forEach(function (child) {
          if (child.matches('.link-hub')) {
            items = items.concat(unwrapForAnimation(child));
          } else {
            items.push(child);
          }
        });
      }

      for (var i = 0; i < items.length; i++) {
        if (items[i].id !== 'blog-list') continue;
        var yearGroups = Array.prototype.slice.call(items[i].querySelectorAll(':scope > .year-group'));
        if (yearGroups.length) {
          items.splice.apply(items, [i, 1].concat(yearGroups));
        }
        break;
      }
    }

    var footer = document.querySelector('body > footer');
    if (footer) items.push(footer);

    return items;
  }

  function finishEntranceAnimation(el) {
    el.classList.remove('animate-item', 'animate-pending', 'animate-in', 'animate-fade-only');
  }

  function onEntranceAnimationEnd(el, event) {
    if (event.target !== el) return;
    if (
      event.animationName !== 'entrance-float-in' &&
      event.animationName !== 'entrance-float-in-nav' &&
      event.animationName !== 'entrance-fade-in'
    ) {
      return;
    }
    finishEntranceAnimation(el);
  }

  function runEntranceAnimations() {
    var items = collectEntranceItems();
    if (!items.length) return;

    items.forEach(function (el) {
      if (el.matches('.link-hub-section')) {
        el.classList.add('animate-fade-only');
      }
      el.classList.add('animate-item', 'animate-pending');
      el.addEventListener('animationend', function handler(event) {
        onEntranceAnimationEnd(el, event);
        if (
          event.target === el &&
          (event.animationName === 'entrance-float-in' ||
            event.animationName === 'entrance-float-in-nav' ||
            event.animationName === 'entrance-fade-in')
        ) {
          el.removeEventListener('animationend', handler);
        }
      });
    });

    window.setTimeout(function () {
      items.forEach(function (el, index) {
        window.setTimeout(function () {
          el.classList.remove('animate-pending');
          el.classList.add('animate-in');
        }, index * 200);
      });
    }, 100);

    // Fallback: strip animation classes if animationend never fires.
    window.setTimeout(function () {
      items.forEach(finishEntranceAnimation);
    }, 100 + items.length * 200 + 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntranceAnimations);
  } else {
    runEntranceAnimations();
  }

  // Resume timeline — reveal role cards as they enter the viewport.
  var timelineRoles = document.querySelectorAll('.cv-timeline .cv-role');
  if (
    timelineRoles.length &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var role = entry.target;
        role.classList.remove('tl-pending');
        role.classList.add('tl-in');
        role.addEventListener('transitionend', function onEnd(event) {
          if (event.target !== role || event.propertyName !== 'transform') return;
          role.classList.remove('tl-pending', 'tl-in');
          role.removeEventListener('transitionend', onEnd);
        });
        timelineObserver.unobserve(role);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

    Array.prototype.forEach.call(timelineRoles, function (role) {
      role.classList.add('tl-pending');
      timelineObserver.observe(role);
    });
  }

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
      var tc = next === 'dark' ? '#17181C' : '#F8F5EE';
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

  // Nav scroll choreography — strengthen the glass once the page scrolls.
  // A zero-height sentinel at the top of the body is observed instead of
  // listening to scroll events, so there's no per-frame work.
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
