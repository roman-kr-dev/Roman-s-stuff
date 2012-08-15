var ScreenSaver = (function () {
	var config = {
		};
	
	return Class.extend({
		init:function () {
			$.when(getPictures()).then(function () {
				/*initScreenUnits();
				initPictures();
				//initAnimation();*/
			});
		}
	});

	function getPictures() {
		picturesData = [
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/208969_10150948846765139_2137780753_o.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/475277_389088041129065_548300253_o.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/2608_64830262259_2238363_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/577922_10150891711022269_693742183_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/6291_100671013280327_6298611_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-prn1/38525_422461037459_3427540_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/487155_10151085778051294_627539601_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc7/425061_10151053430206692_861376128_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/575270_10150950457235139_1975904854_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/547929_414756971893840_1959452198_n.jpg'
		].sort(function() {return 0.5 - Math.random()});

		return true;
	}
})();

$(function () {
	var saver = new ScreenSaver();
});