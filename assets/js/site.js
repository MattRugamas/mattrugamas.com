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

  var disclosures = document.querySelectorAll('details.disclosure');

  // Same curve the icon rotates on, kept in the stylesheet so the two cannot
  // drift apart.
  var easeExpand =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--ease-expand')
      .trim() || 'ease-out';

  var ZERO_PAD = ['0px', '0px'];

  function padding(el) {
    var style = getComputedStyle(el);
    return [style.paddingTop, style.paddingBottom];
  }

  function disclosureBody(details) {
    for (var d = 0; d < details.children.length; d++) {
      if (details.children[d].classList.contains('disclosure-body')) return details.children[d];
    }
    return null;
  }

  function setupDisclosure(details) {
    var summary = details.querySelector('summary');
    var body = disclosureBody(details);
    if (!summary || !body) return;
    var animation = null;

    function settle(closing) {
      animation = null;
      // Order matters: drop the open state first so the full-height content
      // never paints for a frame between clearing the height and closing.
      if (closing) details.open = false;
      body.style.height = '';
      body.style.overflow = '';
    }

    function slide(opening) {
      // A closed panel is zero tall by definition. It cannot be measured:
      // browsers hide it with content-visibility on the content slot, and a
      // descendant of that still reports its last laid-out size, so reading
      // the box here would return the open height and animate nothing.
      var from = details.open ? body.getBoundingClientRect().height : 0;
      // Read while the previous run is still applied, so interrupting one
      // picks the padding up where it is instead of snapping.
      var fromPad = details.open ? padding(body) : ZERO_PAD;
      if (animation) animation.cancel();
      // A closed <details> keeps its content out of layout, so it has to be
      // opened before there is anything to measure.
      if (opening) details.open = true;
      body.style.overflow = 'hidden';
      body.style.height = from + 'px';

      var to = opening ? body.scrollHeight : 0;
      // Read after the cancel above, so this is the stylesheet's padding and
      // not whatever an interrupted run had it at.
      var toPad = opening ? padding(body) : ZERO_PAD;
      if (from === to || prefersReducedMotion()) {
        settle(!opening);
        return;
      }

      // Most panels land on the floor, which keeps them feeling like one
      // control; only the ones far taller than the viewport get extra time,
      // and the ceiling keeps even a 3000px changelog entry from dragging.
      var duration = Math.min(560, Math.max(280, Math.abs(to - from) * 0.36));
      animation = body.animate(
        {
          height: [from + 'px', to + 'px'],
          // Padding travels with the height. These boxes are border-box, so
          // padding sets a floor the box cannot shrink under: animating
          // height alone leaves the panel visually stuck at its padding for
          // the first slice of the run, which reads as the motion stalling
          // before it starts.
          paddingTop: [fromPad[0], toPad[0]],
          paddingBottom: [fromPad[1], toPad[1]]
        },
        { duration: duration, easing: easeExpand }
      );
      animation.onfinish = function () {
        settle(!opening);
      };
    }

    summary.addEventListener('click', function (event) {
      event.preventDefault();
      slide(!details.open);
    });
  }

  for (var d = 0; d < disclosures.length; d++) setupDisclosure(disclosures[d]);

  var hints = document.querySelectorAll('.disclosure-hint[data-count]');
  for (var h = 0; h < hints.length; h++) {
    var hint = hints[h];
    var scope = hint.closest('details');
    var unit = hint.getAttribute('data-unit');
    if (!scope || !unit) continue;
    var total = scope.querySelectorAll(hint.getAttribute('data-count')).length;
    if (total) hint.textContent = total + ' ' + unit + (total === 1 ? '' : 's');
  }

  if (disclosures.length) {
    // Fragment navigation has to open the target and everything above it,
    // because a nested role is inside a section that may also be closed.
    function revealFromHash() {
      var id = location.hash.slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      for (var node = target; node && node !== document.body; node = node.parentElement) {
        if (node.tagName === 'DETAILS') node.open = true;
      }
      target.scrollIntoView();
    }

    revealFromHash();
    window.addEventListener('hashchange', revealFromHash);

    // Printing a half-collapsed résumé would drop most of it, so everything
    // opens for the dialog and goes back to how the reader left it.
    var printState = null;
    window.addEventListener('beforeprint', function () {
      printState = [];
      for (var i = 0; i < disclosures.length; i++) {
        printState.push(disclosures[i].open);
        disclosures[i].open = true;
      }
    });
    window.addEventListener('afterprint', function () {
      if (!printState) return;
      for (var i = 0; i < disclosures.length; i++) disclosures[i].open = printState[i];
      printState = null;
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
        var clicked = document.querySelector('.writing-row[href="' + dest.pathname + '"]')
          || document.querySelector('.writing-row[href="' + path + '"]');
        // Name the heading, not the row: the row also holds the date, which
        // has nowhere to morph to on the post page.
        var heading = clicked && clicked.querySelector('.writing-title');
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
