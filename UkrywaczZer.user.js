// ==UserScript==
// @name	Ukrywacz zer
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Ukrywa liczbę plusów gdy jest równa zero. Szczególnie te wszechobecne zera na mikroblogu... Dodatkowo ukrywa ikonkę plusa przy naszych wpisach i tak na własne nie można głosować.
// @include	http://*wykop.pl/*
// @include	https://*wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/UkrywaczZer.user.js
// @version	2.0.0
// @grant	none
// @run-at	document-end
// ==/UserScript==

'use strict';

(() => {
    const remove = b => b && b.textContent === '0' && b.remove();
    const incrementalRemove = root => {
        root.tagName == 'P' && root.querySelectorAll(':scope > b').forEach(remove);
        root.tagName == 'LI' && root.querySelectorAll(':scope .vC > b').forEach(remove);
    };

    const itemsStream = document.getElementById('itemsStream');
    if (itemsStream) {
        itemsStream.querySelectorAll(':scope .vC > b').forEach(remove);

        const observer = new MutationObserver(mutationsList => {
            for(const mutation of mutationsList)
                if (mutation.type == 'childList')
                    mutation.addedNodes.forEach(incrementalRemove);
        });
        observer.observe(itemsStream, { childList: true, subtree: true });
    }
})();
