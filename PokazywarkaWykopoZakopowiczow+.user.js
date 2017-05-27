// ==UserScript==
// @name    Pokazywarka wykopo i zakopowiczów +
// @namespace   https://github.com/kasper93/
// @author  kasper93, oparte na pomyśle i wykonaniu przez owczareknietrzymryjski
// @description Skrypt pokazuje przy komentarzach czy ktoś zakopał / wykopał dane znalezisko
// @include     http://*wykop.pl/link/*
// @include     https://*wykop.pl/link/*
// @downloadURL https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @updateURL   https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @version 1.3.0
// @grant   none
// @run-at  document-end
// ==/UserScript==

function main($) {
    const wykop_ = wykop || unsafeWindow.wykop;

    const createMap = function(r, s) {
        const ret = new Map();
        let m;
        while (m = r.exec(s)) {
            ret.set(m[1], m[2]);
        }
        return ret;
    };

    const createSet = function(r, s) {
        const ret = new Set();
        let m;
        while (m = r.exec(s)) {
            ret.add(m[1]);
        }
        return ret;
    };

    const ajaxCall = function(url, action, $this) {
        if (!url.match(/hash\//)) {
            if (url.match(/\?/)) {
                url = url.replace("?", '/hash/' + wykop_.params.hash + "?")
            } else {
                url += '/hash/' + wykop_.params.hash;
            }
        }

        $.ajax(url, {
            dataType: 'json',
            dataFilter: (data) => (data.startsWith('for(;;);') ? data.substring(8) : data),
            success: (r) => {
                if (r.error)
                    return;
                switch (action) {
                case 0: {
                    const w_set = createSet(/<b>(.*)<\/b>/g, r.operations[2].html);
                    $this.filter(function() { return w_set.has(this.textContent) })
                         .closest('.author')
                         .append('<b class="small color-0">(wykopał)</b>');
                    break;
                }
                case 1: {
                    const z_map = createMap(
                        /<b>(.*)<\/b>\s*<\/span>\s*<span class="info">\s*([^<]*)<br>/g, r.operations[2].html);
                    $this.each(function() {
                        if (z_map.has(this.textContent))
                            $(this).closest('.author')
                                   .append(`<b class="small color-2">(${z_map.get(this.textContent)})</b>`);
                    });
                    break;
                }
                }
            }
        });
    };

    const id = /link\/(\d+)\//.exec(document.location.pathname)[1];
    const $this = $('div[data-type="comment"] .showProfileSummary b', '.comments-stream');
    ajaxCall(`//www.wykop.pl/ajax2/links/Upvoters/${id}`, 0, $this);
    ajaxCall(`//www.wykop.pl/ajax2/links/Downvoters/${id}`, 1, $this);
};

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;var wykop=unsafeWindow.wykop;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
