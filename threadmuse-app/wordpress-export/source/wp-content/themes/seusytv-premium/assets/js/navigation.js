(function () {
  var toggle = document.querySelector('.stv-menu-toggle');
  var nav = document.querySelector('.stv-primary-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
})();
