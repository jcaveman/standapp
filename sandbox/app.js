window.STANDAPP = window.STANDAPP || {};
(function(APP, d, w) {
  var styleEl,
      overlayEl,
      superTrooperEl,
      modalEl,
      header,
      currentMemberNameEl,
      mainWrapEl,
      boardParts,
      activeMember,
      timerEl,
      timerToggleEl,
      timerInterval,
      mainBoardEl,
      leftPanel,
      standbyOverlay;

      styleEl = d.querySelector('#' + APP.STYLES_ID) || injectStyles(styles);

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

      function makeArray(list) {
        return Array.prototype.slice.call(list);
      }

      function shuffle (array) {
        var i, j, temp;

        for (i = array.length -1; i > 0; i --) {
          j = Math.floor(Math.random() * i);
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }

        return array;
      }

      // get nearest parent element matching selector
      function closest(el, selector) {
        var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        while (el) {
          if (matchesSelector.call(el, selector)) {
              break;
          }
          el = el.parentElement;
        }
        return el;
      }

      function createElement(tagname, className, id) {
        var el = d.createElement(tagname);
        if (id) { el.id = id; }
        el.className = className;
        return el;
      }

      function injectStyles(styles) {
        styleEl = d.createElement('style', '', APP.STYLES_ID);
        styleEl.type = 'text/css';
        styleEl.innerHTML = styles;
        d.getElementsByTagName('head')[0].appendChild(styleEl);
      }

      function getBoardParts() {
        var result = {};

        result.toggleShuffleWrapEl = createElement('div', 'toggle-shuffle-wrap');
        result.toggleShuffleWrapEl.innerHTML = [
          '<input type="checkbox" id="toggle-shuffle" name="toggle-shuffle" />',
          '<label for="toggle-shuffle">',
            '<i class="check">&#10004</i> Shuffle',
          '</label>'
        ].join('');
        result.toggleShuffleWrapEl.querySelector('label[for="toggle-shuffle"]').addEventListener('click', shuffleToggle);
        result.originalBoard = d.querySelector('#ghx-work');
        result.members = getMemberList(result.originalBoard.querySelectorAll('.ghx-swimlane'));
        result.boardHeader = result.originalBoard.querySelector('.ghx-column-headers');

        return result;
      }

      function getMemberList(memberEls) {
        var members = createElement('ul', 'left-panel members');
        memberEls.forEach(function(memberEl, index) {
          var activeClass = (index === 0) ? ' active': '';
          var li = createElement('li', 'member' + activeClass);
          var member = memberEl.querySelector('.ghx-heading').cloneNode(true);
          li.board = memberEl.cloneNode(true);
          // li.board = memberEl;
          li.appendChild(member);
          members.appendChild(li);
        });

        return members;
      }

      function setActiveBoard(member, members) {
        if (activeMember) { resetBoard(activeMember); }

        activeMember = member || members.querySelector('.member');
        activeMember.classList.add('active');

        mainBoardEl.appendChild(activeMember.board);
        currentMemberNameEl = currentMemberNameEl || header.querySelector('.name');
        currentMemberNameEl.innerText = activeMember.querySelector('.ghx-heading span[role=button]').innerText;
      }

      function resetBoard(activeMember) {
        modalEl.classList.add('standby');
        activeMember.classList.remove('active');
        var previousBoard = mainBoardEl.querySelector('.ghx-swimlane');
        if (previousBoard) {
          previousBoard.remove();
        }
        resetTimer();
      }

      function changeBoard(direction, boardParts, activeMember) {
        if (direction === 'next') {
          nextMember = activeMember.nextElementSibling;
          if (nextMember) {
            setActiveBoard(nextMember);
          }
        }

        if (direction === 'previous') {
          nextMember = activeMember.previousElementSibling;
          if (nextMember) {
            setActiveBoard(nextMember);
          }
        }
      }

      function getHeader() {
        header = createElement('div', 'header');
        header.innerHTML = [
            '<h1 id="currentMember">',
              'It\'s your turn <strong class="name">Jon Caveman</strong>',
            '</h1>'
        ].join('');
        return header;
      }

      function getStandbyOverlay() {
        standbyOverlay = createElement('div', 'standby-overlay');
        standbyOverlay.innerHTML = [
          '<h2 class="headline">Paused</h2>',
          '<h3 class="subheadline"><img src="' + APP.images.iconSpaceSrc + '" alt="space" /> to start</h3>',
          '<h3 class="subheadline"><img src="' + APP.images.iconArrowRightSrc + '" alt="space" /> for next person</h3>',
          '<h3 class="subheadline"><img src="' + APP.images.iconArrowLeftSrc + '" alt="space" /> for previous person</h3>',
          '</h3>',
        ].join('');
        return standbyOverlay;
      }

      function resetTimer() {
        timerEl.classList.remove('alert');
        overlayEl.classList.remove('overtime');
        superTrooperEl.classList.remove('show');

        timerEl = d.querySelector('#' + APP.NAMESPACE + ' .modal .main .control-panel .timer');
        timerToggleEl = d.querySelector('#' + APP.NAMESPACE + ' .modal .main .control-panel .timer-toggle');

        timerEl.setAttribute('data-seconds', '0');
        timerEl.innerHTML = '00:00';
        timerEl.classList.remove('active');
        clearInterval(timerInterval);

        if (timerToggleEl.getAttribute('data-state') === 'pause') {
          timerToggle(timerToggleEl);
        }
      }

      function formatTime(seconds) {
        return [("0" + parseInt( seconds / 60 ) % 60).slice(-2),
               ("0" + seconds % 60).slice(-2)].join(':');
      }

      function shuffleToggle() {
        mainWrapEl = d.querySelector('#' + APP.NAMESPACE + ' .modal .main.wrap');
        var members = d.querySelectorAll('#ghx-work .ghx-swimlane');
        var shuffledMembers = shuffle(makeArray(members));
        var newMemberListEL = getMemberList(shuffledMembers);
        var currentMemberListEL = mainWrapEl.querySelector('.left-panel.members');
        setActiveBoard(null, newMemberListEL);
        if (currentMemberListEL) {
          mainWrapEl.replaceChild(newMemberListEL, currentMemberListEL);
        } else {
          mainWrapEl.appendChild(newMemberListEL);
        }
      }

      function timerToggle(timerToggleEl) {
        if (timerToggleEl.getAttribute('data-state') === 'start') {

          timerEl.classList.add('active');
          timerInterval = setInterval(function() {
            var current = parseInt(timerEl.getAttribute('data-seconds'));
            timerEl.setAttribute('data-seconds', current + 1);
            timerEl.innerHTML = formatTime(current + 1);

            if (current > (APP.options.timerLimitSeconds - 11)) {
              timerEl.classList.add('alert');
            }

            if (current >= APP.options.timerLimitSeconds) {
              overlayEl.classList.add('overtime');
            }

            if (current >= (APP.options.timerLimitSeconds + 9)) {
              superTrooperEl.classList.add('show');
            }

          }, 1000);

          timerToggleEl.setAttribute('data-state', 'pause');
          timerToggleEl.innerHTML = getTimerToggleButtonMarkup('pause');
          modalEl.classList.remove('standby');
        } else {
          clearInterval(timerInterval);
          timerToggleEl.setAttribute('data-state', 'start');
          timerEl.classList.remove('active');
          timerToggleEl.innerHTML = getTimerToggleButtonMarkup('start');
          modalEl.classList.add('standby');
        }
      }

      function controlClickDelegator(e) {
        switch(true) {
          case !!closest(e.target, '.timer-toggle'):
            timerToggle(timerToggleEl);
            break;
          default:
            // do nothing
        }
      }

      function getTimerToggleButtonMarkup(state) {
        if (state === 'start') {
          return [
            '<span class="label">Start</label>',
            '<i class="arrow-right"></i>'
          ].join('');
        }

        if (state === 'pause') {
          return [
            '<span class="label">Pause</label>',
            '<i class="pause"></i>'
          ].join('');
        }
      }

      function getControls() {
        var controls = createElement('div', 'control-panel');
        controls.innerHTML = [
            '<div class="timer" data-seconds=0>00:00</div>',
            '<button class="timer-toggle" data-state="start">',
              getTimerToggleButtonMarkup('start'),
            '</button>'
        ].join('');
        controls.addEventListener('click', controlClickDelegator);
        timerEl = controls.querySelector('.timer');
        timerToggleEl = controls.querySelector('.timer-toggle');
        return controls;
      }

      overlayEl = createElement('div', '', APP.NAMESPACE);

      superTrooperEl = createElement('img', '', 'superTrooper');
      superTrooperEl.src = APP.images.superTrooper;
      overlayEl.appendChild(superTrooperEl);

      boardParts = getBoardParts();
      modalEl = createElement('div', 'modal standby');
      mainWrapEl = createElement('div', 'main wrap');
      mainBoardEl = createElement('section', 'main-board');

      modalEl.appendChild(mainWrapEl);
      modalEl.appendChild(getHeader());
      mainWrapEl.appendChild(boardParts.members);
      mainBoardEl.appendChild(getControls());
      mainBoardEl.appendChild(boardParts.boardHeader);
      mainBoardEl.appendChild(getStandbyOverlay());
      mainWrapEl.appendChild(mainBoardEl);
      modalEl.appendChild(mainWrapEl);
      modalEl.appendChild(boardParts.toggleShuffleWrapEl);

      setActiveBoard(null, boardParts.members);

      overlayEl.appendChild(modalEl);
      d.body.appendChild(overlayEl);
      overlayEl.show();

      document.body.onkeyup = function(e){
        switch(true) {
          case e.keyCode == 32:
            timerToggle(timerToggleEl);
            break;
          case e.keyCode == 39:
          case e.keyCode == 40:
            changeBoard('next', boardParts, activeMember);
            break;
          case e.keyCode == 37:
          case e.keyCode == 38:
            changeBoard('previous', boardParts, activeMember);
            break;
          default: //do nothing;
        }
      };

    })(window.STANDAPP, document, window);
