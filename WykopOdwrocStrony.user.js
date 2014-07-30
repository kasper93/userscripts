// ==UserScript==
// @name	Wykop odwróć strony
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Odwraca numeracje stron na wykopie.
// @include http://*.wykop.pl/*
// @exclude	/^http://www\.wykop\.pl/(info|regulamin|reklama|polityka-prywatnosci|pomoc|kontakt|osiagniecia|grupy|developers|gry)//
// @exclude	/^http://[a-z]+\.wykop\.pl/(ramka|link|dodaj)/*/
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopOdwrocStrony.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopOdwrocStrony.user.js
// @version	1.0.5
// @grant	none
// @run-at	document-end
// ==/UserScript==


function main($) {
	var ostatniastrona = $('.pager .button').not(':contains("następna"), :contains("poprzednia")').last().html();
	$('.pager .button').not(':contains("następna"), :contains("poprzednia")').each(function (index) {
		$(this).html(ostatniastrona - $(this).html() + 1);
	});
}

if (document.getElementsByClassName('pager').length > 0) {
	// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
	function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
}
