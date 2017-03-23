window.STANDAPP = window.STANDAPP || {};
(function(APP, d) {
  'use strict';
  Element.prototype.show = function (delay) {
    var self = this;
    setTimeout(function() {
      self.classList.add('show');
    }, delay || 10);
    return this;
  };

  Element.prototype.hide = function (delay) {
    var self = this;
    setTimeout(function() {
      self.classList.remove('show');
    }, delay || 10);
    return this;
  };

  APP.helpers = {
    makeArray: function(list) {
      return Array.prototype.slice.call(list);
    },

    shuffle: function(array) {
      var i, j, temp;

      for (i = array.length -1; i > 0; i --) {
        j = Math.floor(Math.random() * i);
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

      return array;
    },

    // get nearest parent element matching selector
    closest: function(el, selector) {
      var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
      while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
      }
      return el;
    },

    createElement: function(tagname, className, id) {
      var el = d.createElement(tagname);
      if (id) { el.id = id; }
      el.className = className;
      return el;
    },

    injectStyles: function (styles) {
      var styleEl = d.createElement('style', '', APP.STYLES_ID);
      styleEl.type = 'text/css';
      styleEl.innerHTML = styles;
      return d.getElementsByTagName('head')[0].appendChild(styleEl);
    }
  };
})(window.STANDAPP, document);
