// ==UserScript==
// @name	Naprawiacz pasków
// @namespace	https://github.com/kasper93/
// @author	kasper93
// @description	Zmienia kolor paska pod awatarem osobom, które mają źle ustawiona pleć w profilu.
// @include	http://*wykop.pl/*
// @include	https://*wykop.pl/*
// @downloadURL	https://raw.githubusercontent.com/kasper93/userscripts/master/NaprawiaczPaskow.user.js
// @updateURL	https://raw.githubusercontent.com/kasper93/userscripts/master/NaprawiaczPaskow.user.js
// @version	2.1.0
// @grant	none
// @run-at	document-end
// ==/UserScript==

function main($) {
	var roz = ['ppj', 'dziadekwie', 'kasiknocheinmal', 'Faf', 'imyodda', 'fir3fly', 'Aerials', 'spojrz', 'xyz23', 'mozaika', 'evesia', 'ZgubilemRodzicow'];
	var nieb = ['PanBulka', 'MasterSoundBlaster', 'kokaina', 'Kozzi', 'Baron_Al_von_PuciPusia', 'plusbear', 'nie_daje_rady', 'jaras2', 'keram244', 'lecho', 'Grzesiu_Lato', 'grimes997', 'sarge', 'EtaCarinae', '-PPP-', 'zakowskijan72', 'Misieq84', 'Yossarian82', 'MarZam', 'funk', 'CzekoladowyRambo', 'Nrb', 'konfafal', 'tomasz_B', 'Drzwi', 'zwirz'];

	$(function() {
		naprawPasek($('.user-profile').data('id'), $('.user-profile .photo > .avatar'));
		znajdz();
	});

	$(document).ajaxComplete(function() {
		znajdz();
	});

	function naprawPasek(nick, avatar) {
		if (nieb.indexOf(nick) != -1) {
			avatar.removeClass('female').addClass('male');
		} else if (roz.indexOf(nick) != -1) {
			avatar.removeClass('male').addClass('female');
		}
	}

	function znajdz() {
		$('.profile').each(function () {
			var arr = $(this).attr("href").split('/')
			naprawPasek(arr[arr.length-2], $(this).children('.avatar'));
		});
		$('.summary.user').each(function () {
			naprawPasek($(this).data('login'), $(this).find('.avatar'));
		});
	}
}

// jQueryLoader, see https://github.com/kasper93/userscripts for unminified version.
function a(){this.message="unsafeWindow failed!";this.name="Exception"}try{main(jQuery)}catch(b){console.log(b.message);try{if("undefined"===typeof unsafeWindow.jQuery)throw new a;main(unsafeWindow.jQuery)}catch(c){console.log(c.message);try{var d=document.createElement("script");d.textContent="("+main.toString()+")(window.jQuery);";document.body.appendChild(d)}catch(e){console.log(e.message)}}};
