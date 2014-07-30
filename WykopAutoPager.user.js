// ==UserScript==
// @name	Wykop AutoPager
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Automatycznie ładuje kolejną stronę po osiągnięciu końca poprzedniej.
// @include	http://*.wykop.pl/*
// @exclude	/^http://www\.wykop\.pl/(info|regulamin|reklama|polityka-prywatnosci|pomoc|kontakt|osiagniecia|grupy|developers|gry)//
// @exclude	/^http://[a-z]+\.wykop\.pl/(ramka|link|dodaj)/*/
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopAutoPager.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopAutoPager.user.js
// @version	3.0.3
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    var nastepnaStronaButton = $("a.button:contains('następna')");
    if (nastepnaStronaButton.length) {
        var enabled = true;
        var footerHeight = 200;
        var pager = nastepnaStronaButton.closest('div');
        wykop.height = {
            window: $(window).innerHeight(),
            document: $(document).height()
        };
        $(window).resize(function () {
            wykop.height.window = $(window).innerHeight();
        });
        wykop.nextPageLoading = false;

        wykop.pobierzStrone = function (url) {
            $.ajax(url).done(function (data) {
                wykop.nowaStrona(data);
            });
        }

        wykop.nowaStrona = function (html) {
            var $html = $(html);
            $('#itemsStream').append($html.find('#itemsStream li.iC'));
            $('.grid-main').append($html.find('.grid-main div.addons'));
            $('.menu-list.notification').append($html.find('.grid-main .menu-list.notification li'));
            var pagerOld = pager;
            nastepnaStronaButton = $html.find("a.button:contains('następna')");
            pager = nastepnaStronaButton.closest('div');
            if (!nastepnaStronaButton.length) {
                // ostatnia strona, szykamy pagera po przycisku "poprzednia"
                pager = $html.find("a.button:contains('poprzednia')").closest('div');
            }
            pagerOld.replaceWith(pager);
            if ($.isFunction($.ukryj)) {
                $.ukryj();
            }
            $("#pageNum").text(pager.find("a.button.selected").text());
            wykop.height.document = $(document).height();
            wykop.bindLazy();
            wykop.nextPageLoading = false;
        }

        $(window).bind('scroll.pagination', function () {
            if (enabled && nastepnaStronaButton.length && !wykop.nextPageLoading && $(window).scrollTop() >= wykop.height.document - wykop.height.window - footerHeight) {
                wykop.nextPageLoading = true;
                wykop.pobierzStrone(nastepnaStronaButton.attr('href'));
            }
        });

        var rightFooter = '<div class="reset-decor reset-space dnone fixed right-footer" id="rightFooterBox" style="display: none;"><a href="#" class="button big"><div id="pageCounter"><span style="border-radius: 12px;height: 24px;line-height: 24px;margin: 0;padding: 0;right: -12px;text-align: center;top: -12px;vertical-align: middle;width: 24px;background: none repeat scroll 0 0 #e74c3c;bottom: 34px;color: #fff;display: inline-block;font-size: 10px;position: absolute;" id="pageNum"></span></div><i class="fa fa-chevron-up"></i></a><h4 class="clear-bottom tspace">Wykop.pl &copy; 2014 (<a href="http://www.wykop.pl/dodatki/pokaz/99/">Wykop Autopager</a> by <a href="http://www.wykop.pl/ludzie/kasper93/">kasper93</a>)</h4><ul class="sub-menu inline-list"><li><a id="autopager" title="Wyłącz paginację" href="javascript:void(0)">Wyłącz paginację</a><li><a title="idea wykopu" href="http://www.wykop.pl/info/">Idea Wykopu</a></li><li><a title="regulamin wykopu" href="http://www.wykop.pl/regulamin/">Regulamin</a></li><li><a title="nasza polityka prywatności" href="http://www.wykop.pl/polityka-prywatnosci/">Polityka prywatności</a></li><li><a title="pomoc i faq" href="http://www.wykop.pl/najczesciej-zadawane-pytania/">Pomoc i FAQ</a></li><li><a title="skontaktuj się z nami" href="http://www.wykop.pl/kontakt/">Kontakt</a></li><li><a href="http://www.wykop.pl/ranking/">Ranking użytkowników</a></li><li><a title="wykopowe osiągnięcia" href="http://www.wykop.pl/osiagniecia/">Osiągnięcia</a></li> <li><a title="tagi" href="http://www.wykop.pl/tagi/">Tagi</a></li><li><a title="dodatki" href="http://www.wykop.pl/dodatki/">Dodatki</a></li><li><a title="Wykopywarka, Widget i API" href="http://www.wykop.pl/dla-programistow/">Dla programistów</a></li></ul></div>';

        $('.grid-right').append(rightFooter);
        $("#pageNum").text(pager.find("a.button.selected").text());
        $('#autopager').click(function () {
            enabled = !($(this).attr("title") == "Wyłącz paginację");
            $(this).attr("title", (enabled ? 'Wyłącz' : 'Włącz') + " paginację");
            $(this).text((enabled ? 'Wyłącz' : 'Włącz') + " paginację");
        });
    }
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;var wykop=unsafeWindow.wykop;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
