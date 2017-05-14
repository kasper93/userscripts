// ==UserScript==
// @name	Wykop pokaż obrazki
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Umożliwia załadowanie wszystkich obrazków/filmików w komentarzach/wpisach za pomoca tylko jednego przycisku. 
// @include	http://*.wykop.pl/link*
// @include	http://*.wykop.pl/mikroblog*
// @include	http://*.wykop.pl/wpis*
// @include	http://*.wykop.pl/tag*
// @include	https://*.wykop.pl/link*
// @include	https://*.wykop.pl/mikroblog*
// @include	https://*.wykop.pl/wpis*
// @include	https://*.wykop.pl/tag*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopPokazObrazki.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopPokazObrazki.user.js
// @version	1.5.3
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    //ustawienia
    var bLoadImg = true;
    var bLoadVid = false;
    var bRemoveWatermark = true;
    var settings = "autoLoadImages";
    var auto = localStorage.getItem(settings);
    //koniec ustawień
    var buttons = '<ul><li><a class="btnAutoLadowanie" href="javascript: void(0)">auto</a></li><li><a class="btnZaladujObrazki" href="javascript: void(0)">pokaż obrazki</a></li></ul>';
    var button = '<li><a class="affect hide btnPokazObrazki" href="javascript: void(0)"><i class="fa fa-camera"></i> Pokaż obrazki</a></li>';
    $(".responsive-menu").append(button);
    $(".nav.bspace.rbl-block").prepend(buttons);

    // Ładujemy automatycznie?
    $(document).ready(function () {
        if ("on" == auto) {
            var $this = $('.comments-stream');
            $("a", $this).open();
            $(".btnAutoLadowanie").parent().addClass("active");
            linki($this);
        }
    });

    // Ładujemy obrazki z całej strony po kliknięciu na przycisk.
    $(".btnZaladujObrazki").click(function () {
        var $this = $(this).closest('.grid-main').find('.comments-stream');
        $("a", $this).open();
        linki($this);
    });

    // Ładujemy obrazki z danego wpisu po kliknięciu na 'v'.
    $(".btnPokazObrazki").on("click", function () {
        var $this = $(this).closest('div.dC');
        $("a", $this).open();
        $("a.show-more", $this).click();
        linki($this);
    });

    // ustawienia auto [on/off]
    $(".btnAutoLadowanie").click(function () {
        if ("on" == auto) {
            localStorage.setItem(settings, "off");
            auto = "off";
            $(this).parent().removeClass("active");
        } else {
            localStorage.setItem(settings, "on");
            auto = "on";
            $(this).parent().addClass("active");
        }
    });

    // magiczna funkcja zmuszająca funkcje wykopowe do rozwinięcia obrazka.
    $.fn.open = function () {
        $(this).filter(function () {
            var $th = $(this);
            return "undefined" != typeof $th.attr("href") && "lightbox[w]" !== $th.attr("rel") && (bLoadImg && $th.attr("href").match(/\.(jpg|jpeg|png|gif)/i) || bLoadVid && $th.attr("href").match(/(youtube\.|youtu\.be|vimeo\.com)/i));
        }).trigger({
            type: "click",
            which: 0
        });
    };
    // Zamieniamy src obrazków na źródłowe, timeout, żeby być pewnym, że się załadowało i będzie co zmieniać :)


    function linki($this) {
        window.setTimeout(function () {
            // zamianiamy zrodlo obrazka na oryginalne
            $('.media-content', $this).each(function () {
                var $this = $(this);
                $this.css('max-width', "99%");
                $this.css('max-height', .85 * $(window).height() + 26);
                $this.css('min-width', "0px");
                $this.css('min-height', "0px");
                $this.find('.description').css('position', 'static');
                $this.find('.description a:first-child').css('width', 'auto');
                var $img = $this.find('img');
                $img.removeClass('lazy');
                $img.css('max-height', .85 * $(window).height());
                $img.css('max-width', "99%");
                var src = $this.find('.description.light > a[target=_blank]').attr('href');
                if (bRemoveWatermark && "undefined" != typeof src) {
                    src = src.replace(/^(https?:\/\/\w\d+\.cdn\d+\.imgwykop\.pl\/.+),.+(\.\w{1,4})(.?)+$/, "$1$2");
                }
                $this.find('.expand').remove();
                $img.attr("src", src);
            });
        }, 500);
    }

    function gdzie(e) {
        return document.location.pathname.substring(0, 5) == "/" + e;
    }
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
