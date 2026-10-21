/* Guidiny · animations à l'apparition.
   Les blocs situés plus bas que l'écran apparaissent en douceur quand on y arrive.
   Rien n'est caché si JavaScript est désactivé, si le navigateur ne connaît pas
   IntersectionObserver, ou si le visiteur a demandé de réduire les animations. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = [
    '.sec-head', '.about-copy', '.value', '.svc-big', '.dept-tile', '.case',
    '.step', '.offer', '.other', '.faq-list details', '.closing', '.foot-card'
  ].join(',');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.addEventListener('transitionend', cleanup);
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.04 });

  // Once shown, give the element back its own hover transitions.
  function cleanup(event) {
    if (event.target !== this || event.propertyName !== 'opacity') return;
    this.classList.remove('reveal', 'in');
    this.style.transitionDelay = '';
    this.removeEventListener('transitionend', cleanup);
  }

  var fold = window.innerHeight;
  document.querySelectorAll(SELECTOR).forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) return; // already on screen: leave it alone
    // Siblings in the same grid arrive one after another.
    var index = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = (index % 4) * 60 + 'ms';
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

/* Bouton « Retour »: revient à la page précédente du site; sinon suit son lien vers l'accueil. */
document.querySelectorAll('[data-back]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    var fromSite = false;
    try { fromSite = document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
    if (fromSite && history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
});
