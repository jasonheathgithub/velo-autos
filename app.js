/* app.js — VELO Landing Page */

(function() {
  'use strict';

  // =============================================
  // HEADER SCROLL BEHAVIOR
  // =============================================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function onScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // =============================================
  // MOBILE NAVIGATION
  // =============================================
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // =============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  // FADE-IN ANIMATION FALLBACK (IntersectionObserver)
  // =============================================
  if (!CSS.supports || !CSS.supports('animation-timeline', 'scroll()')) {
    var fadeElements = document.querySelectorAll('.fade-in');

    fadeElements.forEach(function(el) {
      el.classList.remove('fade-in');
      el.classList.add('fade-in--js');
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Stagger siblings in the same grid
          var parent = entry.target.parentElement;
          var siblings = parent ? Array.from(parent.querySelectorAll('.fade-in--js:not(.visible)')) : [];
          var idx = siblings.indexOf(entry.target);
          var delay = Math.max(0, idx) * 60;
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // =============================================
  // STAT COUNTER ANIMATION
  // =============================================
  var statValues = document.querySelectorAll('.stat-card__value');

  var statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statValues.forEach(function(el) {
    statsObserver.observe(el);
  });

  function animateValue(element) {
    var text = element.textContent;
    var prefix = '';
    var suffix = '';
    var target = 0;
    var decimals = 0;

    // Parse prefix ($ sign)
    if (text.charAt(0) === '$') {
      prefix = '$';
      text = text.substring(1);
    }

    // Parse suffix (x, %, +)
    if (text.indexOf('x') > -1) {
      suffix = 'x';
      text = text.replace('x', '');
    } else if (text.indexOf('%') > -1) {
      suffix = '%';
      text = text.replace('%', '');
    } else if (text.indexOf('+') > -1) {
      suffix = '+';
      text = text.replace('+', '');
    }

    target = parseFloat(text);
    if (text.indexOf('.') > -1) {
      decimals = text.split('.')[1].length;
    }

    var duration = 1200;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);

      // Easing: cubic-bezier(0.16, 1, 0.3, 1) approximation
      var t = progress;
      var eased = 1 - Math.pow(1 - t, 4);

      var current = eased * target;
      element.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // =============================================
  // FAQ ACCORDION — only one open at a time
  // =============================================
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    item.addEventListener('toggle', function() {
      if (this.open) {
        faqItems.forEach(function(other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

})();