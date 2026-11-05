(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
    });
  }

  // Dropdown layanan (klik/ketuk + Escape)
  var sub = document.querySelector('.has-sub');
  if (sub) {
    var btn = sub.querySelector('.sub-toggle');
    btn.addEventListener('click', function () {
      var open = sub.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) { if (!sub.contains(e.target)) { sub.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sub.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  }

  // Progres scroll
  var bar = document.querySelector('.progress span');
  if (bar) {
    var ticking = false;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Reveal saat scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // Filter portofolio
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.toggle('is-active', x === f); });
        var cat = f.getAttribute('data-filter');
        document.querySelectorAll('#work-grid .work-card').forEach(function (c) {
          c.hidden = !(cat === 'all' || c.getAttribute('data-cat') === cat);
        });
      });
    });
  }

  // Form kontak
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var submit = form.querySelector('button[type=submit]');
    var setErr = function (name, msg) {
      var el = form.querySelector('.err[data-for="' + name + '"]');
      var input = form.elements[name];
      if (el) el.textContent = msg || '';
      if (input) input.classList.toggle('invalid', !!msg);
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ['name', 'email', 'phone', 'message'].forEach(function (n) { setErr(n, ''); });
      status.className = 'form-status'; status.textContent = '';
      var bad = false;
      if (form.name.value.trim().length < 2) { setErr('name', 'Nama minimal 2 karakter.'); bad = true; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) { setErr('email', 'Format email tidak valid.'); bad = true; }
      if (form.message.value.trim().length < 10) { setErr('message', 'Pesan minimal 10 karakter.'); bad = true; }
      if (bad) { var first = form.querySelector('.invalid'); if (first) first.focus(); return; }

      submit.disabled = true;
      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }); })
        .then(function (res) {
          if (res.body.ok) {
            status.className = 'form-status ok';
            status.textContent = res.body.message + ' ';
            if (res.body.whatsapp) {
              var a = document.createElement('a');
              a.href = res.body.whatsapp; a.target = '_blank'; a.rel = 'noopener noreferrer';
              a.textContent = 'Lanjutkan lewat WhatsApp';
              status.appendChild(a);
            }
            form.reset();
          } else if (res.body.errors) {
            Object.keys(res.body.errors).forEach(function (k) { setErr(k, res.body.errors[k]); });
          } else {
            status.className = 'form-status bad'; status.textContent = res.body.error || 'Gagal mengirim pesan.';
          }
        })
        .catch(function () { status.className = 'form-status bad'; status.textContent = 'Tidak dapat terhubung ke server. Coba lagi.'; })
        .then(function () { submit.disabled = false; });
    });
  }
})();
