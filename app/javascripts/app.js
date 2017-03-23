(function(document, window) {
  'use strict';
  window.STANDAPP = {
    init: function() {

      if (window.STANDAPP.boom) {
        return window.STANDAPP;
      }

      var app = window.STANDAPP = new App();
      app.loadMenu();
      console.log('boom');
    }
  };

  function App() {
    var tmp = window.STANDAPP;
    this.helpers   = tmp.helpers;
    this.NAMESPACE = tmp.NAMESPACE;
    this.options   = tmp.options;
    this.images    = tmp.images;
    this.templates = tmp.templates();
    this.els       = {};
    this.started   = false;
  }

  App.prototype.loadMenu = function() {
    this.els.menu = this.helpers.createElement('div', '', this.NAMESPACE + '_menu');
    this.els.menu.innerHTML = this.templates.menu();
    this.els.menu.openButton = this.els.menu.querySelector('.btn-open');
    this.els.menu.openButton.addEventListener('click', App.prototype.initialize.bind(this));
    document.body.appendChild(this.els.menu);
  };

  App.prototype.loadBaseTemplate = function() {
    var els             = this.els;
    var appEl = els.app = this.helpers.createElement('div', '', this.NAMESPACE);

    appEl.innerHTML      = this.templates.base(this.images);
    els.modal            = appEl.querySelector('.modal');
    els.header           = appEl.querySelector('.header #currentMember');
    els.headerName       = appEl.querySelector('.header #currentMember .name');
    els.timer            = appEl.querySelector('.header .timer');
    els.masterTimer      = appEl.querySelector('.header .master-timer');
    els.leftPanel        = appEl.querySelector('.left-panel');
    els.pauseOverlay     = appEl.querySelector('.pause-overlay');
    els.main             = appEl.querySelector('.main-board');
    els.toggleShuffle    = appEl.querySelector('#toggle-shuffle');

    return appEl;
  };

  App.prototype.loadMemberList = function() {
    var members = document.querySelectorAll('#ghx-work .ghx-swimlane');
    this.els.members = [];

    members.forEach(function(memberEl) {
      var li = this.helpers.createElement('li', 'member');
      li.setAttribute('data-swimlane-id', memberEl.getAttribute('swimlane-id'));
      // TODO: cloneNode disables draggable. Need to make draggable work
      // li.board = memberEl;
      li.board = memberEl.cloneNode(true);
      li.innerHTML = this.templates.member({
        name: memberEl.querySelector('.ghx-heading span[role="button"]').innerText,
        description: memberEl.querySelector('.ghx-heading .ghx-description').innerText
      });

      this.els.leftPanel.appendChild(li);
      this.els.members.push(li);
    }.bind(this));

    this.els.originalMembers = this.helpers.makeArray(this.els.members);
    this.activeMemberIndex = 0;
  };

  App.prototype.resetBoard = function() {
    if (this.els.activeMember !== undefined) {
      this.els.main.querySelector('.ghx-swimlane').remove();
      this.els.header.classList.add('hide');
      this.els.activeMember.classList.remove('active');
    }
  };

  App.prototype.loadMemberBoard = function(member) {
    if (!member) { return false };
    this.resetBoard();
    this.els.activeMember = member;
    member.classList.add('active');
    member.classList.add('gone');
    this.els.main.appendChild(member.board);
    this.els.headerName.innerText = member.querySelector('.ghx-heading span[role=button]').innerText;
    this.els.header.classList.remove('hide');
  };

  App.prototype.startTimer = function() {
    this.els.timer.classList.add('active');
    this.els.modal.classList.remove('standby');

    this.els.timer.setAttribute('data-state', 'on');

    if (!this.masterInterval) {
      this.masterInterval = setInterval(function() {
        var current = parseInt(this.els.masterTimer.getAttribute('data-seconds'));
        this.els.masterTimer.setAttribute('data-seconds', current + 1);
        this.els.masterTimer.innerHTML = this.formatTime(current + 1);
      }.bind(this), 1000);
    }

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(function() {
      var current = parseInt(this.els.timer.getAttribute('data-seconds'));
      this.els.timer.setAttribute('data-seconds', current + 1);
      this.els.timer.innerHTML = this.formatTime(current + 1);

      if (current > (this.options.timerLimitSeconds - 11)) {
        this.els.timer.classList.add('alert');
      }

      if (current >= this.options.timerLimitSeconds) {
        this.els.app.classList.add('overtime');
      }

      if (current >= (this.options.timerLimitSeconds + 9)) {
        this.els.app.classList.add('supertrooper');
      }

    }.bind(this), 1000);
  };

  App.prototype.stopTimer = function() {
    clearInterval(this.timerInterval);

    this.els.timer.classList.remove('active');
    this.els.timer.setAttribute('data-state', 'off');

    this.els.modal.classList.add('standby');
  };

  App.prototype.toggleTimer = function() {
    if (this.els.timer.getAttribute('data-state') === 'off') {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  };

  App.prototype.resetTimer = function() {
    this.els.timer.classList.remove('alert');
    this.els.app.classList.remove('overtime');
    this.els.app.classList.remove('supertrooper');

    this.els.timer.setAttribute('data-seconds', '0');
    this.els.timer.innerHTML = '00:00';
  };

  App.prototype.formatTime = function(seconds) {
    return [("0" + parseInt( seconds / 60 ) % 60).slice(-2),
            ("0" + seconds % 60).slice(-2)].join(':');
  };

  App.prototype.getMember = function(direction) {
    switch(direction) {
      case 'next':
        if ((this.activeMemberIndex + 1) >= this.els.members.length) {
          this.finish();
          return false;
        }
        this.activeMemberIndex = (this.activeMemberIndex + 1) % this.els.members.length;
        break;
      case 'previous':
        this.activeMemberIndex = (this.activeMemberIndex - 1) % this.els.members.length;
        break;
    }
    return this.els.members[this.activeMemberIndex];
  };

  App.prototype.finish = function() {
    this.stopTimer();
    clearInterval(this.masterInterval);
    this.resetBoard();
    this.els.app.classList.add('finished');
    document.body.onkeyup = null;
  };

  App.prototype.keyupDelegator = function(e) {
    switch(true) {
      case e.keyCode === 32:
        this.started = true;
        this.disableShuffle();
        if (!this.activeMemberIndex) {
          this.loadMemberBoard(this.els.members[0]);
        }
        this.toggleTimer();
        break;
      case e.keyCode === 39:
      case e.keyCode === 40:
        if (this.started) {
          this.loadMemberBoard(this.getMember('next'));
          this.resetTimer();
        }
        break;
      case e.keyCode === 37:
      case e.keyCode === 38:
        if (this.started) {
          this.loadMemberBoard(this.getMember('previous'));
          this.resetTimer();
        }
        break;
      default: //do nothing;
    }
  };

  App.prototype.toggleShuffle = function() {
    if (this.els.toggleShuffle.checked) {
      this.els.members = this.helpers.shuffle(this.helpers.makeArray(this.els.members));
    } else {
      this.els.members = this.helpers.makeArray(this.els.originalMembers);
    }
  };

  App.prototype.disableShuffle = function() {
    document.querySelector('.toggle-shuffle-wrap').classList.add('disabled');
    this.els.toggleShuffle.setAttribute('disabled', 'disabled');
    this.els.toggleShuffle.removeEventListener('change', this.toggleShuffle.bind(this));
  };

  App.prototype.bindEvents = function() {
    document.body.onkeyup = this.keyupDelegator.bind(this);
    this.els.toggleShuffle.addEventListener('change', this.toggleShuffle.bind(this));
  };

  App.prototype.initialize = function() {
    this.els.menu.remove();
    this.loadBaseTemplate();
    this.loadMemberList();
    this.toggleShuffle();
    this.bindEvents();

    document.body.appendChild(this.els.app);

    this.els.app.show();
  };

})(document, window);
