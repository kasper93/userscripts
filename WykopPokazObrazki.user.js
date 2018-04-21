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
// @version	2.0.1
// @grant	none
// @run-at	document-idle
// ==/UserScript==

(() => {
    const bLoadImg = true;
    const bLoadVid = false;
    const bRemoveWatermark = true;

    const settings = 'autoLoadImages';
    let auto = localStorage.getItem(settings) === 'true' || false;

    const processMediaContent = (mc) => {
        if (!mc.classList.contains('media-content'))
            return;

        const desc = mc.getElementsByClassName('description')[0];

        mc.style.maxWidth = '99%';
        mc.style.maxHeight = `${0.85 * window.innerHeight + desc.getBoundingClientRect().height}px`;

        const a = desc.getElementsByTagName('a')[0];
        a.style.width = 'auto';

        const expand = mc.getElementsByClassName('expand')[0];
        if (expand)
            expand.remove();
        mc.classList.remove('too-long-pic');

        const gif = mc.querySelectorAll('p.icon-media.gif')[0];
        if (gif)
            gif.remove();

        let src = a.href;
        if (bRemoveWatermark && typeof src !== 'undefined')
            src = src.replace(/^(https?:\/\/\w\d+\.cdn\d+\.imgwykop\.pl\/.+),.+(\.\w{1,4})(.?)+$/, '$1$2');

        const img = mc.getElementsByTagName('img')[0];
        img.style.maxWidth = '99%';
        img.style.maxHeight = `${0.85 * window.innerHeight}px`;
        img.classList.remove('lazy');
        img.src = src;
    };

    const isInteresting = (a) => a.rel !== 'lightbox[w]'
            && (bLoadImg && /\.(jpg|jpeg|png|gif)/i.test(a.href)
                || bLoadVid && /(youtube\.|youtu\.be|vimeo\.com)/i.test(a.href));
    const clickMCEntry = (a) => isInteresting(a) && a.click();
    const clickMCEntries = (root) => [...root.querySelectorAll('.iC .media-content > a:first-child')].forEach(clickMCEntry);

    const hookMCEntry = (mc) => {
        // Separate observer for each element so we can disconnect them later.
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList)
                if (mutation.type == 'childList')
                    mutation.addedNodes.forEach(processMediaContent);
            observer.disconnect();
        });
        observer.observe(mc.parentNode, { childList: true });
        if (auto)
            clickMCEntry(mc.getElementsByTagName('a')[0]);
    };
    const hookMCEntries = (root) => [...root.querySelectorAll('.iC .media-content')].forEach(hookMCEntry);

    const nav = document.querySelectorAll('.nav.bspace.rbl-block')[0] || document.querySelectorAll('.nav.fix-b-border')[0];
    if (nav)
        nav.insertAdjacentHTML('afterbegin', '<ul><li><a id="btnAutoLoad" href="javascript: void(0)">auto</a></li><li><a id="btnLoadImg" href="javascript: void(0)">pokaż obrazki</a></li></ul>');

    const btnAutoLoad = document.getElementById('btnAutoLoad');
    if (auto)
        btnAutoLoad.parentNode.classList.add('active');
    btnAutoLoad.onclick = (e) => {
        auto = e.target.parentNode.classList.toggle('active');
        localStorage.setItem(settings, auto);
    };

    document.getElementById('btnLoadImg').onclick = (e) => clickMCEntries(e.target.closest('div.grid-main'));

    for (const mc of document.querySelectorAll('.iC .media-content')) {
        // Separate observer for each element so we can disconnect them later.
        hookMCEntry(mc);
    }

    const itemsStream = document.getElementById('itemsStream');
    if (itemsStream) {
        const observer = new MutationObserver((mutationsList) => {
            for(const mutation of mutationsList)
                if (mutation.type == 'childList')
                    mutation.addedNodes.forEach((el) => hookMCEntries(el));
        });
        observer.observe(itemsStream, { childList: true });
    }
})();
