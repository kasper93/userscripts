// ==UserScript==
// @name	Ukrywacz zer
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Ukrywa liczbę plusów gdy jest równa zero. Szczególnie te wszechobecne zera na mikroblogu... Dodatkowo ukrywa ikonkę plusa przy naszych wpisach i tak na własne nie można głosować.
// @include	http://*wykop.pl/*
// @include	https://*wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @version	1.1.6
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
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

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
