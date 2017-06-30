// ==UserScript==
// @name	Ukryj Wykop poleca
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Ukrywa znaleziska polecane i sponsorowane.
// @include	http://*.wykop.pl/*
// @include	https://*.wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkryjWykopPoleca.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkryjWykopPoleca.user.js
// @version	2.4.1
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    $.ukryj = function () {
        // Ukrywanie reklam w urwisku
        $("#dyingLinksBox a[href*='/market']").each(function () {
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
                $prev.find(".prev-link").remove();
                $prev.find(".next-link").remove();
            }
        });

        // Ukrywanie znalezisk poleconych oraz sponsorowanych
        $("a[href$='/reklama']").closest('li.link').remove();
        $("a[href$='/reklama/']").closest('li.link').remove();
        $("a[href^='/paylink']").closest('li.link').remove();
        window.wykop.floatRightAd=function(){};
        $('#fixedBox').remove();
        $('#fixedBoxIdent').remove();
        $("div[id*=bmone2n]").remove();
        $("body").removeClass("screening");
        $(".payentry").remove();
        $(".logoallegro").closest("li").remove();
        if (!$("#relatedList").find("li").length) {
            $("#relatedList").remove();
        }

        // Ukrywanie trackerów
        $('img[src*="wykop.pl/tracker/emiter"]').remove();
        $('a[href*="wykop.pl/tracker/"]').remove();

        // Ukrywanie reklamy appki wykopu
        $('.baner-mobile').parent().remove();

        // Dla niezalogowanych
        $("#dfp-sponsorowany_top").closest('li.link').remove();
        var GA = $(".adsbygoogle");
        GA.closest('li.link').remove();
        GA.remove();
        $("[class^='dfp-']").remove();
        $(".screening-displace").remove();
        $("[id^=banner_rectangle]").remove();
    };

    if ($.isFunction($.ukryj)) {
        $.ukryj();
    }
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
