// ==UserScript==
// @name	Otwieracz powiadomień
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Otwiera wszystkie nieprzeczytane powiadomienia w kartach.
// @include	http://*wykop.pl/*
// @include	https://*wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/OtwieraczPowiadomien.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/OtwieraczPowiadomien.user.js
// @version	1.2.4
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    var button = '<li><a class="open" title="otwórz powiadomienia w kartach" href="javascript: void(0)">otwórz powiadomienia w kartach</a></li>';
    var button1 = '<a title="otwiera nieprzeczytanie powiadomienia w kartach" href="javascript: void(0)" class="openFromNotificationsPopup">otwórz</a>';
    if ($('.grid-main .nav p:contains("Powiadomienia")').length) {
        $('.grid-main .nav > ul:first').prepend(button);
    }

    $(document).ajaxComplete(function () {
        $('.notificationsContainer .menu-list .buttons') .filter(function() { return !$(this).find('.openFromNotificationsPopup').length; }).append(button1);
    });

    $('.notification').on('click', '.openFromNotificationsPopup', function() {
        $(this).closest('.menu-list').find('li.type-light-warning p a:last-child').each(function (i) {
            window.open($(this).attr('href'));
        });
    });

    $(".open").click(function () {
        $('.type-light-warning > p > a:last-of-type').each(function (i) {
            window.open($(this).attr('href'));
        });
    });
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
