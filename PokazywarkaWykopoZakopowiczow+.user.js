// ==UserScript==
// @name	Pokazywarka wykopo i zakopowiczów +
// @namespace	https://github.com/kasper93/
// @author	kasper93, oparte na pomyśle i wykonaniu przez owczareknietrzymryjski
// @description	Skrypt pokazuje przy komentarzach czy ktoś zakopał / wykopał dane znalezisko 
// @include     http://*wykop.pl/link/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/PokazywarkaWykopoZakopowiczow+.user.js
// @version	1.1.1
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
    wykop._ajaxCall2 = function (url, action) {
        if (!url.match(/hash\//)) {
            if (url.match(/\?/)) {
                url = url.replace("?", '/hash/' + wykop.params.hash + "?")
            } else {
                url += '/hash/' + wykop.params.hash;
            }
        }
        $.ajax(url, {
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {},
            data: {},
            type: "GET",
            dataType: 'json',
            dataFilter: function (data, type) {
                if (type != 'json' && type != 'jsonp') {
                    return data;
                }
                var prefix = 'for(;;);';
                pos = data.indexOf(prefix);
                if (pos === 0) {
                    return data.substring(prefix.length);
                }
                return data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Napisz do @kasper93 jak się będzie powtarzać.");
            },
            success: function (r, textStatus, jqXHR) {
                var $this = $('div[data-type="comment"] .showProfileSummary b', '.comments-stream');
                switch (action) {
                case 'zakopy':
                    var reason = [];
                    var people = szukaj(/<b>(.*)<\/b>/g, r.operations[2].html);
                    var reasons = szukaj(/([a-zęść ]+)<br>/g, r.operations[2].html);
                    console.log(people);
                    console.log(reasons);
                    $this.filter(function () {
                        var n = people.indexOf($(this).text());
                        if (n != -1) {
                            reason.push(reasons[n]);
                            return true;
                        }
                    }).closest('.author').each(function (i) {
                        $(this).append('<b class="small color-2">(' + reason[i] + ')</b>');
                    });
                    break;
                case 'wykopy':
                    var people = szukaj(/<b>(.*)<\/b>/g, r.operations[2].html);
                    $this.filter(function () {
                        return people.indexOf($(this).text()) != -1;
                    }).closest('.author').append('<b class="small color-0">(wykopał)</b>');
                    break;
                }
            }
        });
    }

    $(function () {
        var id = /link\/(\d*)\//.exec(document.location.pathname)[1];
        wykop._ajaxCall2("http://www.wykop.pl/ajax2/links/Upvoters/" + id, "wykopy");
        wykop._ajaxCall2("http://www.wykop.pl/ajax2/links/Downvoters/" + id, "zakopy");
    });

    function szukaj(r, s) {
        var a = [], m;
        while (m = r.exec(s)) {
            a.push(m[1]);
        }
        return a;
    };
};

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;var wykop=unsafeWindow.wykop;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
