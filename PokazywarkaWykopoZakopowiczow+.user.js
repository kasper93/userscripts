// ==UserScript==
// @name    Pokazywarka wykopo i zakopowiczów +
// @namespace   https://github.com/kasper93/
// @author  kasper93
// @description Skrypt pokazuje przy komentarzach czy ktoś zakopał / wykopał dane znalezisko
// @include     http://*wykop.pl/link/*
// @include     https://*wykop.pl/link/*
// @downloadURL https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @updateURL   https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @version 2.0.0
// @grant   none
// @run-at  document-end
// ==/UserScript==

const wykop_ = wykop || unsafeWindow.wykop;

const createMap = (r, s) => {
    const ret = new Map();
    let m;
    while ((m = r.exec(s)))
        ret.set(m[1], m[2]);
    return ret;
};

const createSet = (r, s) => {
    const ret = new Set();
    let m;
    while ((m = r.exec(s)))
        ret.add(m[1]);
    return ret;
};

const getNames = (url, action) => {
    return new Promise((resolve, reject) => {
        if (!url.match(/hash\//))
            if (url.match(/\?/))
                url = url.replace('?', `/hash/${wykop_.params.hash}?`);
            else
                url += `/hash/${wykop_.params.hash}`;

        fetch(url, {
            headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})
        }).then(response => {
            if (!response.ok) {
                reject(response.statusText);
                return;
            }
            return response.text();
        }).then(text => {
            const r = JSON.parse(text.startsWith('for(;;);') ? text.substring(8) : text);
            if (r.error) {
                reject('Wykop responded with error.');
                return;
            }
            switch (action) {
            case 0:
                resolve(createSet(/<b>(.*)<\/b>/g, r.operations[2].html));
                break;
            case 1:
                resolve(createMap(/<b>(.*)<\/b>\s*<\/span>\s*<span class="info">\s*([^<]*)<br>/g, r.operations[2].html));
                break;
            }
        }).catch((error) => reject(error.message));
    });
};

const id = /link\/(\d+)\//.exec(document.location.pathname)[1];
Promise.all([
    getNames(`//www.wykop.pl/ajax2/links/Upvoters/${id}`, 0),
    getNames(`//www.wykop.pl/ajax2/links/Downvoters/${id}`, 1)
]).then(([upvotes, downvotes]) => {
    const comments = document.querySelectorAll('.comments-stream div[data-type="comment"] .showProfileSummary b');
    let comment;
    for (comment of comments) {
        const username = comment.textContent;
        if (upvotes.has(username))
            comment.closest('.author').insertAdjacentHTML('beforeend', '<b class="small color-0">(wykopał)</b>');
        else if (downvotes.has(username))
            comment.closest('.author').insertAdjacentHTML('beforeend', `<b class="small color-2">(${downvotes.get(username)})</b>`);
    }
}, error => console.error(`PokazywarkaWykopoZakopowiczow: ${error}`));
