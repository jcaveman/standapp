window.STANDAPP = window.STANDAPP || {};
(function(APP) {
  'use strict';
  APP.timerHelpers = {

    start: function() {
      APP.els.timer.classList.add('active');
      APP.els.modal.classList.remove('standby');

      APP.els.toggleTimer.setAttribute('data-state', 'pause');
      APP.els.toggleTimerLabel.innerText = 'Pause';

      this.timerInterval = setInterval(function() {
        let current = parseInt(APP.els.timer.getAttribute('data-seconds'));
        APP.els.timer.setAttribute('data-seconds', current + 1);
        APP.els.timer.innerHTML = this.formatTime(current + 1);

        if (current > (this.options.timerLimitSeconds - 11)) {
          APP.els.timer.classList.add('alert');
        }

        if (current >= this.options.timerLimitSeconds) {
          APP.els.app.classList.add('overtime');
        }

        if (current >= (this.options.timerLimitSeconds + 9)) {
          APP.els.app.classList.add('supertrooper');
        }

      }.bind(this), 1000);
    },

    stop: function() {
      clearInterval(this.timerInterval);

      APP.els.timer.classList.remove('active');
      APP.els.toggleTimer.setAttribute('data-state', 'start');
      APP.els.toggleTimerLabel.innerText = 'Start';

      APP.els.modal.classList.add('standby');
    },

    toggle: function() {
      if (APP.els.toggleTimer.getAttribute('data-state') === 'start') {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },

    reset: function() {
      APP.els.timer.classList.remove('alert');
      APP.els.app.classList.remove('overtime');
      APP.els.app.classList.add('supertrooper');

      APP.els.timer.setAttribute('data-seconds', '0');
      APP.els.timer.innerHTML = '00:00';
    },

    format: function(seconds) {
      return [("0" + parseInt( seconds / 60 ) % 60).slice(-2),
              ("0" + seconds % 60).slice(-2)].join(':');
    }

  };
})(window.STANDAPP);
