// ==UserScript==
// @name	Ukrywacz zer
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Ukrywa liczbę plusów gdy jest równa zero. Szczególnie te wszechobecne zera na mikroblogu... Dodatkowo ukrywa ikonkę plusa przy naszych wpisach i tak na własne nie można głosować.
// @include	http://*wykop.pl/*
// @include	https://*wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @version	1.1.5
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main() {
    $(function () {
        ukryjmikro();
    });

    $(document).ajaxComplete(function () {
        ukryjmikro();
    });

    $('div.recentPlaceHolder').on("click", function () {
        window.setTimeout(function () {
            ukryjmikro();
        }, 500);
    });

    function ukryjmikro() {
        $('#itemsStream .vC').filter(function () {
            var $this = $(this).find('b');
            if ($this.length == 2) {
                return $this.find('span').text() === '00';
            } else {
                return $this.find('span').text() === '0';
            }
        }).find('b').remove();
        //var nick = $('.quickpoint a[title="Przejdź do swojego profilu"]').text();
        //$('#activities-stream strong.fbold:contains(' + nick + ')').closest('blockquote').find('.icon.plus').remove();
        //$('a.showVoters').click();
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
