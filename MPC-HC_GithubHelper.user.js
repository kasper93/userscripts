// ==UserScript==
// @name	MPC-HC Github Helper
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Converts ticket number to link to the trac.
// @include	https://github.com/*/mpc-hc*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @version	2.0.1
// @grant	none
// @run-at	document-end
// ==/UserScript==

function replace_ticket_number_with_link() {
    var elems = document.querySelectorAll('.commit-desc, .commit-title, .comment-content');
    for (var i = 0; i < elems.length; ++i) {
        elems[i].innerHTML = elems[i].innerHTML.replace(/#(\d{1,4})\b(?![^<]*?<\/a>)/gi, '<a target="_blank" href="https://trac.mpc-hc.org/ticket/$1">$&</a>');
    }
}

window.onload = replace_ticket_number_with_link;
window.addEventListener('pjax:complete', replace_ticket_number_with_link, false);
