// ==UserScript==
// @name	MikroMirror
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Lustrowanie
// @include	https://*.wykop.pl/mikroblog*
// @include	https://*.wykop.pl/wpis*
// @include	https://*.wykop.pl/tag*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MikroMirror.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MikroMirror.user.js
// @version	1.0.1
// @grant	none
// @run-at	document-end
// ==/UserScript==

(() => {
    for (const rm of document.getElementsByClassName('responsive-menu')) {
        rm.insertAdjacentHTML('beforeend', '<li><a class="affect hide btnMirror" href="javascript: void(0)"><i class="fa fa-camera"></i> Zrób mirror</a></li>');
        rm.lastChild.lastChild.onclick = (e) =>
              window.open(`http://web.archive.org/save/https://www.wykop.pl/wpis/${e.target.closest('.entry').querySelectorAll('[data-type="entry"]')[0].dataset.id}/`);
    }
})();
