// ==UserScript==
// @name	Koniec zniw
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Zakopuje wszystkie znaleziska na danej stronie. Nazwa skryptu pochodzi z pamietnej afery, ktora zainspirowala do jego stworzenia.
// @include	http://*wykop.pl/szukaj/*
// @include	http://*wykop.pl/tag/znaleziska/*
// @include	https://*wykop.pl/szukaj/*
// @include	https://*wykop.pl/tag/znaleziska/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/KoniecZniw.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/KoniecZniw.user.js
// @version	3.0.2
// @run-at	document-end
// ==/UserScript==

// Skrypt dziala na stronach:
// http://www.wykop.pl/szukaj/<cokolwiek>
// http://www.wykop.pl/tag/znaleziska/<cokolwiek>

function main($) {
	var c = $('.diggbox').not('.digout').length;
	if (c <= 0 || !wykop.params.logged || !confirm('Czy na pewno chcesz zakopać ' + c + ' znaleziska na tej stronie?'))
		return;

	$('.diggbox').not('.digout').each(function () {
 		var url = 'http://www.wykop.pl/ajax2/links/voteDown/' + $(this).closest('.article').data("id") + '/5/hash/' + wykop.params.hash;
 		$.getJSON(url, {}, function (r) {
 			if (r.error) {
 				alert(r.error);
 				return;
 			}
 			console.log('zakopano ' + r.id + ' [' + r.vote + '/' + r.bury + ']');
 		});
	});
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
