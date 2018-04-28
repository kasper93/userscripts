// ==UserScript==
// @name	Wykop pokaż obrazki
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Umożliwia załadowanie wszystkich obrazków/filmików w komentarzach/wpisach za pomoca tylko jednego przycisku.
// @include	http://*.wykop.pl/*
// @include	https://*.wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopPokazObrazki.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopPokazObrazki.user.js
// @version	2.0.3
// @grant	none
// @run-at	document-idle
// ==/UserScript==

'use strict';

(() => {
    const bLoadImg = true;
    const bLoadVid = false;
    const bUseExternalSourceUrl = false;

    const settings = 'autoLoadImages';
    let auto = localStorage.getItem(settings) === 'true' || false;

    const processMediaContent = (mc) => {
        if (!mc.classList.contains('media-content'))
            return;

        const expand = mc.getElementsByClassName('expand')[0];
        if (expand)
            expand.remove();
        mc.classList.remove('too-long-pic');

        const gif = mc.querySelector('p.icon-media.gif');
        if (gif)
            gif.remove();

        const a = mc.querySelector(':scope > .description > a');
        a.style.width = 'auto';

        const img = mc.getElementsByTagName('img')[0];
        img.style.maxWidth = '99%';
        img.style.maxHeight = '85vh';
        img.classList.remove('lazy');

        const setCleanSrc = (str) => {
            const m = /^(https?:\/\/(?:www\.)?wykop\.pl\/[^,]+)(?:,\w+)*(\.\w+)$/.exec(str);
            if (!m)
                return false;
            img.src = m.slice(1).join('');
            return true;
        };

        if (!setCleanSrc(a.href)) {
            if (bUseExternalSourceUrl) {
                const load = new Image();
                load.onload = () => img.parentNode.href = img.src = load.src;
                load.onerror = () => setCleanSrc(img.src);
                load.src = a.href;
            } else {
                setCleanSrc(img.src);
            }
        }
    };

    const isInteresting = (a) => a.rel !== 'lightbox[w]'
            && (bLoadImg && /\.(jpg|jpeg|png|gif)/i.test(a.href)
                || bLoadVid && /(youtube\.|youtu\.be|vimeo\.com)/i.test(a.href));
    const clickMCEntry = (a) => isInteresting(a) && a.click();
    const clickMCEntries = (root) => [...root.querySelectorAll(':scope .iC .media-content > a:first-child')].forEach(clickMCEntry);

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
    const hookMCEntries = (root) => [...root.getElementsByClassName('media-content')].forEach(hookMCEntry);

    const nav = document.querySelector('.nav.bspace.rbl-block') || document.querySelector('.nav.fix-b-border');
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

    hookMCEntries(document);
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
