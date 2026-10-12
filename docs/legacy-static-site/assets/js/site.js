(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  // Theme toggle
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('hiver-theme', next);
    });
  }

  // Mobile navigation
  var menu = document.querySelector('.menu-toggle');
  if (menu) {
    menu.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-nav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  // Header border on scroll
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Project enquiry form: opens the visitor's mail client with a prefilled message.
  // Replace with a server endpoint when form routing is set up.
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var subject = 'Project enquiry — ' + (d.get('focus') || 'General') + ' — ' + d.get('name');
      var body = [
        'Name: ' + d.get('name'),
        'Email: ' + d.get('email'),
        'Phone / WhatsApp: ' + (d.get('phone') || '—'),
        'Organisation: ' + (d.get('company') || '—'),
        'Focus: ' + (d.get('focus') || '—'),
        'Stage: ' + (d.get('stage') || '—'),
        '',
        d.get('summary')
      ].join('\n');
      window.location.href = 'mailto:' + form.dataset.to +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = form.querySelector('.form-status');
      if (status) status.textContent = 'Your email app should open with the enquiry ready to send.';
    });
  }
})();
