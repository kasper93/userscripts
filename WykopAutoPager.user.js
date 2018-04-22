// ==UserScript==
// @name	Wykop AutoPager
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Automatycznie ładuje kolejną stronę po osiągnięciu końca poprzedniej.
// @include	http://*.wykop.pl/*
// @include	https://*.wykop.pl/*
// @exclude	/^http://www\.wykop\.pl/(info|regulamin|reklama|polityka-prywatnosci|pomoc|kontakt|osiagniecia|grupy|developers|gry)//
// @exclude	/^http://[a-z]+\.wykop\.pl/(ramka|link|dodaj)/*/
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopAutoPager.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopAutoPager.user.js
// @version	4.0.0
// @grant	none
// @run-at	document-idle
// ==/UserScript==

(() => {
    let pager = document.querySelector('.pager');
    if (!pager) return;
    let nextPageButton = pager.querySelector('a.button:last-child');
    let nextPageAvailable = nextPageButton.innerText === 'następna';
    if (!nextPageAvailable) return;

    const wykop_ = wykop || unsafeWindow.wykop;
    const $_ = jQuery || unsafeWindow.jQuery;
    let enabled = true;

    const rightFooter = `
        <div id="rightFooterBox" class=" reset-decor reset-space dnone">
            <a class="button big" href="#">
                <span id="pageNum" class="active-counter"></span>
                <i class="fa fa-chevron-up"></i>
            </a>
            <h4 class="clear-bottom tspace">
                Wykop.pl © 2018
                    (<a href="http://www.wykop.pl/dodatki/pokaz/99/">Wykop Autopager</a>
                    by <a href="http://www.wykop.pl/ludzie/kasper93/">kasper93</a>)
            </h4>
            <ul class="sub-menu inline-list">
                <li><a id="autopager" title="Wyłącz paginację" href="javascript:void(0)">${enabled ? 'Wyłącz' : 'Włącz'} paginację</a></li>
                <li><a href="https://www.wykop.pl/info/" title="idea wykopu">Idea Wykopu</a></li>
                <li><a href="https://www.wykop.pl/regulamin/" title="regulamin wykopu">Regulamin</a></li>
                <li><a href="https://www.wykop.pl/polityka-prywatnosci/" title="nasza polityka prywatności">Polityka prywatności</a></li>
                <li><a href="https://www.wykop.pl/najczesciej-zadawane-pytania/" title="pomoc i faq">Pomoc i FAQ</a></li>
                <li><a href="https://www.wykop.pl/kontakt/" title="skontaktuj się z nami">Kontakt</a></li>
                <li><a href="https://www.wykop.pl/ranking/">Ranking użytkowników</a></li>
                <li><a href="https://www.wykop.pl/osiagniecia/" title="wykopowe osiągnięcia">Osiągnięcia</a></li>
                <li><a href="https://www.wykop.pl/tagi/" title="tagi">Tagi</a></li>
                <li><a href="https://www.wykop.pl/dodatki/" title="dodatki">Dodatki</a></li>
                <li><a href="https://www.wykop.pl/dla-programistow/" title="Wykopywarka, Widget i API">Dla programistów</a></li>
            </ul>
        </div>
    `;

    const footerHeight = 200;
    const itemsStream = document.getElementById('itemsStream');
    const notifications = document.querySelector('.menu-list.notification');
    let addons = document.querySelector('.grid-main > div.addons');
    addons = addons && addons.parentNode;

    let pageNum = null;
    const grid_right = document.getElementsByClassName('grid-right')[0];
    if (grid_right) {
        grid_right.insertAdjacentHTML('beforeend', rightFooter);
        pageNum = document.getElementById('pageNum');
        pageNum.innerText = pager.querySelector('a.button.selected').innerText;
        wykop_.turnOnRightFooter();
        document.getElementById('autopager').onclick = (e) => {
            enabled = !enabled;
            e.target.title = e.target.innerText = `${enabled ? 'Wyłącz' : 'Włącz'} paginację`;
        };
    }

    const newPage = (doc) => {
        const appendChildren = (parent, children) =>
            children.forEach((c) => parent.appendChild(c));
        const append = (parent, selector) =>
            parent && appendChildren(parent, doc.querySelectorAll(selector));

        let itemsStreamElems = null;
        if (itemsStream) {
            itemsStreamElems = doc.querySelectorAll('#itemsStream > li.iC');
            appendChildren(itemsStream, itemsStreamElems);
        }
        append(notifications, '.menu-list.notification > li');
        append(addons, '.grid-main > div.addons');

        const pagerOld = pager;
        pager = doc.querySelector('.pager');
        nextPageButton = pager.querySelector('a.button:last-child');
        nextPageAvailable = nextPageButton.innerText === 'następna';
        pageNum && (pageNum.innerText = pager.querySelector('a.button.selected').innerText);
        if (addons) {
            pagerOld.remove();
            addons.appendChild(pager);
        } else {
            pagerOld.replaceWith(pager);
        }
        if ($_ && typeof $_.ukryj == 'function')
            $_.ukryj();
        wykop_.height.document = document.documentElement.getBoundingClientRect().height;
        itemsStreamElems && $_ && wykop_.bindSurveyForm($_('div.survey', itemsStreamElems));
        wykop_.bindLazy();
        wykop_.nextPageLoading = false;
    };

    window.onscroll = () => {
        if (enabled && nextPageAvailable && !wykop_.nextPageLoading
            && document.documentElement.scrollTop >= wykop_.height.document - wykop_.height.window - footerHeight) {
            wykop_.nextPageLoading = true;
            fetch(nextPageButton.href, { credentials: 'same-origin' })
            .then((resp) => resp.text())
            .then((resp) => newPage((new DOMParser()).parseFromString(resp, 'text/html')));
        }
    };
})();
