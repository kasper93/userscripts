// ==UserScript==
// @name	MPC-HC Github Helper
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Converts ticket number to link to the trac.
// @include	https://github.com/*/mpc-hc*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @version	1.3.2
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    try {
        $(function () {
            replace();

            $(document).on('pjax:complete', function () {
                replace();
            });
        });

        function replace() {
            $('.commit-desc, .commit-title, .comment-content').each(function () {
                $(this).html($(this).html().replace(/#(\d{1,4})\b(?![^<]*?<\/a>)/gi, '<a target="_blank" href="https://trac.mpc-hc.org/ticket/$1">$&</a>'));
            });
        }
    } catch (e) {
        prompt("Something went wrong, report this issue on https://github.com/kasper93/userscripts/issues", e.message);
    }
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
