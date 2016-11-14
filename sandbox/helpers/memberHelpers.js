window.STANDAPP = window.STANDAPP || {};
(function(APP) {
  'use strict';
  APP.memberHelpers = {

    loadMemberList: function() {
      let members = APP.els.members = document.querySelectorAll('#ghx-work .ghx-swimlane');
      APP.els.leftPanel.members = [];

      members.forEach(function(memberEl, index) {
        let el = members[index];
        let li = APP.els.leftPanel.members[index] = this.helpers.createElement('li', 'member');

        el.originalEl = memberEl.cloneNode(true);
        li.innerHTML = this.templates.member({
          name: memberEl.querySelector('.ghx-heading span[role="button"]').innerText,
          description: memberEl.querySelector('.ghx-heading .ghx-description').innerText
        });

        APP.els.leftPanel.appendChild(li);
      }.bind(this));
    },

    resetMemberBoard: function() {
      if (this.activeMemberIndex !== undefined) {
        APP.els.modal.classList.add('standby');
        APP.els.main.querySelector('.ghx-swimlane').remove();
        APP.els.leftPanel.members[this.activeMemberIndex].classList.remove('active');
      }
      this.timerHelpers.reset();
    },

    loadMemberBoard: function(memberIndex) {
      this.resetMemberBoard();
      this.activeMemberIndex = memberIndex || 0;
      let activeMember = APP.els.members[this.activeMemberIndex];
      APP.els.leftPanel.members[this.activeMemberIndex].classList.add('active');
      APP.els.main.appendChild(activeMember);
      APP.els.headerName.innerText = activeMember.querySelector('.ghx-heading span[role=button]').innerText;
    },

    getMember: function(direction) {
      switch(direction) {
        case 'next':
          return (this.activeMemberIndex + 1) % APP.els.members.length;
        case 'previous':
          return (this.activeMemberIndex - 1) % APP.els.members.length;
      }
    }

  };
})(window.STANDAPP);
