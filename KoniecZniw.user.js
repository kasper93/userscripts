// ==UserScript==
// @name	Koniec zniw
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Zakopuje zboze
// @include	*wykop.pl/szukaj/*zboze*
// @include	*wykop.pl/szukaj/*zboże*
// @include	*wykop.pl/szukaj/*zbo%C5%BCe*
// @include	*wykop.pl/szukaj/*beton*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/KoniecZniw.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/KoniecZniw.user.js
// @version	2.2.1
// @run-at	document-end
// ==/UserScript==

// http://www.wykop.pl/szukaj/zboże/?search[what]=upcoming&search[sort]=new
// http://www.wykop.pl/szukaj/zboze/?search[what]=upcoming&search[sort]=new
// http://www.wykop.pl/szukaj/beton/?search[what]=upcoming&search[sort]=new

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		var hash = unsafeWindow.hash;
		var logged = unsafeWindow.logged;
		var www_base = unsafeWindow.www_base;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera
	main();
}

function main() {
	$('.diggbox > a').filter(function() { return logged && $(this).attr('href'); }).each(function () {
		var url = www_base + 'ajax/link/bury/type/5/link/' + $(this).closest('article').data().id + '/hash/' + hash;
		$.getJSON(url, {}, function (r) {
			if (r.error) {
				alert(r.error);
				return;
			}
			console.log('zakopano ' + r.id + ' [' + r.vote + '/' + r.bury + ']');
		});
	});
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}