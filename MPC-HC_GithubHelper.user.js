// ==UserScript==
// @name	MPC-HC Github Helper
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Converts ticket number to link to the trac.
// @include	https://github.com/*/mpc-hc*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/MPC-HC_GithubHelper.user.js
// @version	1.3.1
// @grant	none
// @run-at	document-end
// ==/UserScript==


function main() {
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
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}