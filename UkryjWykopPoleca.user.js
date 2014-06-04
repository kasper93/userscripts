// ==UserScript==
// @name	Ukryj Wykop poleca
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Ukrywa znaleziska polecane i sponsorowane.
// @include	http://*.wykop.pl/*
// @include	https://*.wykop.pl/*
// @icon	http://img7.imagebanana.com/img/jl5vqqxv/ico.png
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkryjWykopPoleca.user.js
// @version	2.0.2
// @run-at	document-end
// ==/UserScript==

function main() {
    $.ukryj = function () {
        // Ukrywanie znalezisk poleconych oraz sponsorowanych
        $("a[href*='wykop.pl/reklama']").closest('li.link').remove();
        $(".paylink").closest('li.link').remove();
        $("div[id*=adocean]").closest('div.rbl-block').parent('#fixedBox').remove();
        $("div[id*=adocean]").closest('div.rbl-block').remove();

        // Ukrywanie reklam w urwisku
        $("#dyingLinksBox a[href*='wykop.pl/market']").each(function () {
            var $parent = $(this).closest('li');
            var $prev;
            if ($parent.prev().length > 0) {
                $prev = $parent.prev();
            } else {
                $prev = $parent.closest('ul').children(':last');
            }
            $prev.show();
            $parent.remove();
            if ($prev.closest("#dyingLinksBox").children().length == 1) {
                $prev.closest("#dyingLinksBox").remove();
            }
        });

        // Ukrywanie trackerów
        $('img[src*="wykop.pl/tracker/emiter"]').remove();
        $('a[href*="wykop.pl/tracker/"]').remove();

        // Ukrywanie reklamy appki wykopu
        $('.baner-mobile').parent('#fixedBox').remove();
    };

    if ($.isFunction($.ukryj)) {
        $.ukryj();
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
