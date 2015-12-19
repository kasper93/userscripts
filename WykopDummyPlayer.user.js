// ==UserScript==
// @name        Wykop Dummy Player
// @namespace   https://github.com/kasper93/
// @author      kasper93
// @description Podmienia wykopowy player na oryginalny
// @include     http://*wykop.pl/*
// @include     https://*wykop.pl/*
// @downloadURL https://raw.githubusercontent.com/kasper93/userscripts/master/WykopDummyPlayer.user.js
// @updateURL   https://raw.githubusercontent.com/kasper93/userscripts/master/WykopDummyPlayer.user.js
// @version     1.0.0
// @grant       none
// @run-at      document-start
// ==/UserScript==

window.jwplayer = function() {
    this.setup = this.remove = function() {}
    this.on = function(name, callback) {
        if (name === "setupError")
            callback();
    }
    return this
}
