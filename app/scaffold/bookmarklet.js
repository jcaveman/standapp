// javascript:
(function(document) {
  var el = document.createElement('script');
  document.body.appendChild(el);
  el.onload = function() { STANDAPP.init(); };
  el.src='//localhost:4443/build/standapp.min.js?nocache=' + Date.now();
})(document);
