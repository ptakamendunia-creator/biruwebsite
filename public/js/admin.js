(function () {
  'use strict';
  // Konfirmasi hapus (CSP melarang atribut onsubmit inline).
  document.addEventListener('submit', function (e) {
    var msg = e.target.getAttribute && e.target.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) e.preventDefault();
  });
  // Optimasi gambar sebelum diunggah: perkecil ke maks. 1600 px dan ubah ke WebP di browser.
  // Bila gagal atau tidak lebih kecil, file asli tetap dikirim. GIF dibiarkan (bisa beranimasi).
  var up = document.getElementById('file');
  if (up && up.form && window.createImageBitmap && window.DataTransfer) {
    var MAX = 1600;
    up.form.addEventListener('submit', function (e) {
      var f = up.files && up.files[0];
      if (!f || !/^image\/(jpeg|png|webp)$/.test(f.type) || up.dataset.done) return;
      e.preventDefault();
      var form = up.form, submitBtn = form.querySelector('[type=submit]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Mengoptimalkan gambar...'; }
      var finish = function () { up.dataset.done = '1'; form.submit(); };
      createImageBitmap(f).then(function (bmp) {
        var scale = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
        var c = document.createElement('canvas');
        c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
        c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
        c.toBlob(function (blob) {
          if (blob && blob.type === 'image/webp' && (scale < 1 || blob.size < f.size)) {
            var dt = new DataTransfer();
            dt.items.add(new File([blob], f.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' }));
            up.files = dt.files;
          }
          finish();
        }, 'image/webp', 0.82);
      }).catch(finish);
    });
  }
  var btn = document.querySelector('.menu-btn');
  var side = document.getElementById('side');
  if (btn && side) {
    btn.addEventListener('click', function () {
      var open = side.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }
})();
