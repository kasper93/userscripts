// ==UserScript==
// @name    Pokazywarka wykopo i zakopowiczów +
// @namespace   https://github.com/kasper93/
// @author  kasper93
// @description Skrypt pokazuje przy komentarzach czy ktoś zakopał / wykopał dane znalezisko
// @include     http://*wykop.pl/link/*
// @include     https://*wykop.pl/link/*
// @downloadURL https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @updateURL   https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @version 3.0.0
// @grant   none
// @run-at  document-end
// ==/UserScript==

(() => {
    const reasonMap = {
        'duplicate': 'duplikat',
        'spam': 'spam',
        'fake': 'informacja nieprawdziwa',
        'wrong': 'treść nieodpowiednia',
        'invalid': 'nie nadaje się',
    };

    const createMap = (s) => {
        const ret = new Map();
        s.forEach(entry => ret.set(entry.user.username, reasonMap[entry.reason]));
        return ret
    };

    const createSet = (s) => {
        const ret = new Set();
        s.forEach(entry => ret.add(entry.user.username));
        return ret
    };

    const getNames = (url, action) => {
        return new Promise((resolve, reject) => {
            fetch(url, {
                headers: {Authorization: `Bearer ${window.localStorage.getItem('token')}`}
            }).then(response => {
                if (!response.ok) {
                    reject(response.statusText);
                    return;
                }
                return response.json();
            }).then(r => {
                switch (action) {
                case 0:
                    resolve(createSet(r.data));
                    break;
                case 1:
                    resolve(createMap(r.data));
                    break;
                }
            }).catch((error) => reject(error.message));
        });
    };

    const id = /link\/(\d+)\//.exec(document.location.pathname)[1];
    Promise.all([
        getNames(`${document.location.origin}/api/v3/links/${id}/upvotes/up`, 0),
        getNames(`${document.location.origin}/api/v3/links/${id}/upvotes/down`, 1)
    ]).then(([upvotes, downvotes]) => {
        const comments = document.querySelectorAll('#link-comments .entry .username');
        for (const comment of comments) {
            const username = comment.textContent.trim();
            if (upvotes.has(username))
                comment.insertAdjacentHTML('afterend', ' <b class="green-profile" style="font-size: 13px">(wykopał)</b>');
            else if (downvotes.has(username))
                comment.insertAdjacentHTML('afterend', ` <b class="red-profile" style="font-size: 13px">(${downvotes.get(username)})</b>`);
        }
    }, error => console.error(`PokazywarkaWykopoZakopowiczow: ${error}`));
})();
