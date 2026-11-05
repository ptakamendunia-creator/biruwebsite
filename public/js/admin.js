(function () {
  'use strict';
  // Konfirmasi hapus (CSP melarang atribut onsubmit inline).
  document.addEventListener('submit', function (e) {
    var msg = e.target.getAttribute && e.target.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) e.preventDefault();
  });
  var btn = document.querySelector('.menu-btn');
  var side = document.getElementById('side');
  if (btn && side) {
    btn.addEventListener('click', function () {
      var open = side.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }
})();
