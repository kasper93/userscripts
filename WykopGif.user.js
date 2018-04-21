// ==UserScript==
// @name	WykopGif
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Loads GIF and HQ images on multimedia stream page.
// @include	http://*.wykop.pl/multimedia-tag/*
// @include	https://*.wykop.pl/multimedia-tag/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopGif.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/WykopGif.user.js
// @version	1.0.1
// @grant	none
// @run-at	document-end
// ==/UserScript==

(() => {
    const regex = /((?:x\w\.)?(?:cdn\d+\.imgwykop\.pl|wykop.pl\/cdn)\/c\d+\/[^,]+),[^.]+\./;

    const reloadImage = (img) => {
        const match = regex.exec(img.src);
        if (!match)
            return;
        const gif = new Image();
        gif.onload = () => img.parentNode.href = img.src = gif.src;
        gif.onerror = () => {
            const jpeg = new Image();
            jpeg.onload = () => img.src = jpeg.src;
            jpeg.src = `https://www.${match[1]}.jpg`;
        };
        gif.src = `https://www.${match[1]}.gif`;
    };

    const processMediaStream = (ms) => {
        if (ms.className !== 'mediaStream')
            return;
        for (const img of ms.getElementsByTagName('img'))
            reloadImage(img);
    };

    const processNewMediaStreams = (mutationsList) => {
        for(const mutation of mutationsList)
            if (mutation.type == 'childList')
                mutation.addedNodes.forEach(processMediaStream);
    };

    const mediaStreams = document.getElementsByClassName('mediaStream');
    const mediaStreamsParent = mediaStreams[0].parentNode;
    const observer = new MutationObserver(processNewMediaStreams);
    observer.observe(mediaStreamsParent, { childList: true });
    for (const ms of mediaStreams)
        processMediaStream(ms);
})();
