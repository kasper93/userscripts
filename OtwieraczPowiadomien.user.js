// ==UserScript==
// @name	Otwieracz powiadomień
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Otwiera wszystkie nieprzeczytane powiadomienia w kartach.
// @include	http://*.wykop.pl/powiadomienia*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/OtwieraczPowiadomien.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/OtwieraczPowiadomien.user.js
// @version	1.1.0
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main() {
    var button = '<li><a class="open" title="otwórz powiadomienia w kartach" href="javascript: void(0)">otwórz powiadomienia w kartach</a></li>';
    $('.grid-main .nav > ul:first').prepend(button);

    $(".open").click(function () {
        $('.type-light-warning > p > a:last-of-type').each(function (i) {
            window.open($(this).attr('href'));
        });
    });
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