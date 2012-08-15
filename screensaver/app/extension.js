  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			baseZindex:2147483000,
			speedFor100PX:2500,
			speedJumpPercent:30,
			maxImageWidth:[700, 500]
		},
		win = $(window),
		viewportWidth = win.width(),
		viewportHeight = win.height(),
		picturesData = [], screenUnits = [],
		overlayLayer, imagesLayer, zIndex = 100;
	
	return $.Class.extend({
		init:function () {
			if (!/google\.com\/?$/.test(top.location.href)) return;

			appAPI.resources.includeCSS('css/styles.css', {
				'overlay-zindex':config.baseZindex,
				'overlay-zindex-images':config.baseZindex + 1
			});
			
			$.when(getPicturesData()).then(function () {
				overlayScreen();
				initScreenUnits();
				setTimeout(function () {
					initFadeInEffect();
				}, 2000);
				//initAnimation();
			});
		}
	});

	function initScreenUnits() {
		var data, pos, ratio;

		//left big unit
		data = picturesData[0];
		ratio = data.width > config.maxImageWidth[0] ? data.width / config.maxImageWidth[0] : 1;
		pos = {
			x:(viewportWidth / 2 / 2) + (-75 + Math.floor(Math.random() * 150)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2) + (-200 + Math.floor(Math.random() * 400)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 1, 1);

		//right big unit
		data = picturesData[1];
		ratio = data.width > config.maxImageWidth[0] ? data.width / config.maxImageWidth[0] : 1;
		pos = {
			x:(viewportWidth / 2) + (viewportWidth / 2 / 2) + (-75 + Math.floor(Math.random() * 150)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2) + (-200 + Math.floor(Math.random() * 400)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 1, 2);

		//4 small units center screen
		data = picturesData[2];
		ratio = data.width > config.maxImageWidth[1] ? data.width / config.maxImageWidth[1] : 1;
		pos = {
			x:(viewportWidth / 2 / 2) + (-50 + Math.floor(Math.random() * 100)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2 / 2) + (-50 + Math.floor(Math.random() * 100)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 2, 3);

		data = picturesData[3];
		ratio = data.width > config.maxImageWidth[1] ? data.width / config.maxImageWidth[1] : 1;
		pos = {
			x:(viewportWidth / 2) + (viewportWidth / 2 / 2) + (-50 + Math.floor(Math.random() * 100)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2 / 2) + (-50 + Math.floor(Math.random() * 100)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 2, 4);

		/*data = picturesData[1];
		ratio = data.width > config.maxImageWidth ? data.width / config.maxImageWidth : 1;
		pos = {
			x:(viewportWidth / 2) + (viewportWidth / 2 / 2) + (-75 + Math.floor(Math.random() * 150)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2) + (-200 + Math.floor(Math.random() * 400)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 1);

		data = picturesData[0];
		ratio = data.width > config.maxImageWidth ? data.width / config.maxImageWidth : 1;
		pos = {
			x:(viewportWidth / 2 / 2) + (-75 + Math.floor(Math.random() * 150)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2) + (-200 + Math.floor(Math.random() * 400)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 1);

		data = picturesData[1];
		ratio = data.width > config.maxImageWidth ? data.width / config.maxImageWidth : 1;
		pos = {
			x:(viewportWidth / 2) + (viewportWidth / 2 / 2) + (-75 + Math.floor(Math.random() * 150)) - ((data.width / ratio) / 2),
			y:(viewportHeight / 2) + (-200 + Math.floor(Math.random() * 400)) - ((data.height / ratio) / 2)
		};

		createImage(pos, data, ratio, 1);*/
	}

	function createImage(pos, data, ratio, level, speedFactor) {
		var img;
//pos.y = 500;
		img = $('<img class="' + config.cssPrefix + 'screen-picture-'+ level +'" />');
		img.attr('src', data.url);
		img.css({
			'top':pos.y,
			'left':pos.x,
			'z-index':config.baseZindex + (zIndex --)
		});
		img.data('data', {
			x:pos.x,
			y:pos.y,
			w:data.width / ratio,
			h:data.height / ratio,
			speedFactor:speedFactor
		});

		/*console.log({
			x:pos.x,
			y:pos.y,
			w:data.width / ratio,
			h:data.height / ratio,
			level:level
		});*/

		img.appendTo(imagesLayer);

		screenUnits.push(img);
	}

	/*function getPicture() {
		var img, ratio, unit;
		
		$.each(picturesData, function (i, data) {
			unit = screenUnits['1-' + i];
			ratio = data.width > config.maxImageWidth ? data.width / config.maxImageWidth : 1;
			
			img = $('<img class="' + config.cssPrefix + 'screen-picture" />');
			img.attr('src', data.url)
			img.css({
				'top': - ((data.height / ratio) / 2),
				'left': - ((data.width / ratio) / 2)
			});

			unit.x = unit.x - ((data.width / ratio) / 2);
			unit.y = unit.y - ((data.height / ratio) / 2);
			
			if (i <= 1) {
				img.appendTo(unit.el);
			}
		});
	}*/

	function getPicturesData() {
		/*picturesData = [
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/208969_10150948846765139_2137780753_o.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/475277_389088041129065_548300253_o.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/2608_64830262259_2238363_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/577922_10150891711022269_693742183_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/6291_100671013280327_6298611_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-prn1/38525_422461037459_3427540_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/487155_10151085778051294_627539601_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc7/425061_10151053430206692_861376128_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/575270_10150950457235139_1975904854_n.jpg'},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/547929_414756971893840_1959452198_n.jpg'}
		].sort(function() {return 0.5 - Math.random();});*/
		
		picturesData = [
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/208969_10150948846765139_2137780753_o.jpg', width:545, height:674},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/475277_389088041129065_548300253_o.jpg', width:2048, height:1365},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/2608_64830262259_2238363_n.jpg', width:500, height:375},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/577922_10150891711022269_693742183_n.jpg', width:540, height:689},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/6291_100671013280327_6298611_n.jpg', width:400, height:264},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-prn1/38525_422461037459_3427540_n.jpg', width:720, height:540},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/487155_10151085778051294_627539601_n.jpg', width:200, height:200},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc7/425061_10151053430206692_861376128_n.jpg', width:403, height:403},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/575270_10150950457235139_1975904854_n.jpg', width:960, height:717},
			{url:'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/547929_414756971893840_1959452198_n.jpg', width:700, height:427}
		].sort(function(a, b) {
			return b.width * b.height - a.width * a.height;
		});
		
		/*for (var i=0;i<picturesData.length;i++ ) {
			$('<img />')
			.attr('index', i)
			.on('load', function () { console.log(this.getAttribute('index'), '{url:' + (picturesData[this.getAttribute('index') * 1].url) + ', width:' + this.width + ', height:' + this.height + '},'); })
			.attr('src', picturesData[i].url)
			.appendTo('body');
		}
		*/

		return true;
	}
	
	function overlayScreen() {
		overlayLayer = $('<div />')
			.addClass(config.cssPrefix + 'screen-overlay')
			.appendTo('body');

		imagesLayer = $('<div />')
			.addClass(config.cssPrefix + 'screen-images')
			.appendTo('body');
	}

	function calcSpeed(distance, speedFactor) {
		var speed = distance / 100 * config.speedFor100PX,
			adjustSpeed = speed * (100 - config.speedJumpPercent * (speedFactor - 1)) / 100;

		return speed = speed + (speed - adjustSpeed);
	}

	function initFadeInEffect() {
		var i = screenUnits.length - 1,
			fadeIn = function () {
				screenUnits[i].fadeIn(1200, function () {
					i--;

					if (i >= 0) {
						setTimeout(function () {
							fadeIn();
						}, 500);
					}
					else {
						setTimeout(function () {
							initAnimation();
						}, 500);
					}
				});
			}

		fadeIn();

		
		/*$.each(screenUnits, function (i, unit) {
			unit.animate({
				'opacity':1,
			}, 2000, 'linear', $.proxy(function() {
			}, unit));
			unit.fadeIn();
		});*/
	}

	function initAnimation() {
		var data, speed, adjustSpeed;
		
		$.each(screenUnits, function (i, unit) {
			var data = unit.data('data'),
				targetTop = data.h + 20,
				distance = data.y + targetTop,
				speed = calcSpeed(distance, data.speedFactor);

			console.log(data.speedFactor + ' * ' + speed);
			/*data = unit.data('data')
			speed = (data.y + data.h) / 100 * config.speedFor100PX;
			adjustSpeed = speed * (100 - config.speedJumpPercent * (data.level - 1)) / 100;
			speed = speed + (speed - adjustSpeed);
			//console.log('b', unit, speed);*/
		

			runAnimation(unit, targetTop, speed);
		});
	}

	function runAnimation(unit, top, speed) {
		unit.animate({
			top:'-' + top,
		}, speed, 'linear', $.proxy(function() {
			var unit = this,
				data = unit.data('data'),
				targetTop = data.h + 20,
				newTop = viewportHeight + 10,
				distance = newTop + targetTop,
				speed = calcSpeed(distance, data.speedFactor);
console.log('done', speed);
			unit.css('top', newTop);
			runAnimation(unit, targetTop, speed);
		}, unit));
	}
})(jQuery);

appAPI.ready(function($) {
    var saver = new ScreenSaver();
}, false);
