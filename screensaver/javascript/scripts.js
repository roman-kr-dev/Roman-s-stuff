var ScreenSaver = (function () {
	var config = {
			numOfImages:12,
			baseImageWidth:350,
			baseZindex:2147483000,
			maxReductionPercent:70,
			screenUnitsX:4,
			screenUnitsY:3,
			screenUnitsHidden:2,
			screenUnitsGapPecent:15
		},
		screenUnits = [], unitDim = [], picturesData = [], picturesObj = [], picturePositions = [];
	
	return Class.extend({
		init:function () {
			$.when(getPictures()).then(function () {
				initScreenUnits();
				initPictures();
				//initAnimation();
			});
		}
	});

	function initScreenUnits() {
		var doc = $(document),
			docWidth = doc.width(),
			docHeight = doc.height(),
			gapWidth = (docWidth * config.screenUnitsGapPecent) / 100,
			gapHeight = (docHeight * config.screenUnitsGapPecent) / 100,
			unitWidth = docWidth / config.screenUnitsX - gapWidth,
			unitHeight = docHeight / config.screenUnitsY - gapHeight,
			unit, i, z, x, y;

		for (i=0; i<config.screenUnitsX; i++) {
			for (z=0; z<config.screenUnitsY; z++) {
				x = Math.max(0, unitWidth * i + gapWidth * i + (gapWidth / config.screenUnitsX) + (-30 + Math.floor((Math.random() * 60))));
				y = Math.max(0, unitHeight * z + gapHeight * z + (-30 + Math.floor((Math.random() * 60))));
				
				unit = $('<div />');
				unit.css({
					'position':'fixed',
					'top':y,
					'left':x,
					'width':unitWidth,
					'height':unitHeight,
					'border':'1px solid green'
				});
				unit.appendTo('body');
	
				screenUnits.push(unit);
				//screenUnits.push({x:[unitWidth * i + gapWidth * i, unitWidth * (i + 1) + gapWidth * i], y:[unitHeight * z + gapHeight * z, unitHeight * (z + 1) + gapHeight * z]});
			}
		}

		unitDim = [unitWidth, unitHeight];
	}

	function initPictures() {
		var doc = $(document),
			pos;
		
		picturesData = $.each(picturesData, function (i, img) {
			picturesData[i] = [img, Math.ceil(Math.random() * config.numOfImages)];
		});

		$.each(picturesData, function (i, data) {
			pos = getImagePosition(i);
			console.log(pos);
			img = $('<img class="XXX-picture" />');
			img.attr('src', data[0]);
			img.css({
				//'background':'rgba('+ (Math.floor(Math.random() * 256)) +', '+ (Math.floor(Math.random() * 256)) +', '+ (Math.floor(Math.random() * 256)) +', 0.5)',
				'z-index':config.baseZindex + data[1],
				'width':getImageWidth(i),
				'height':getImageWidth(i),
				'top':Math.floor(Math.random() * unitDim[1]),
				'left':Math.floor(Math.random() * unitDim[0])
			});
			img.appendTo(screenUnits[i]);

			picturesObj.push(img);
		});
	}

	function getPictures() {
		picturesData = [
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/208969_10150948846765139_2137780753_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/396523_10150565743729752_1180004412_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-snc6/38525_422461037459_3427540_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/547929_414756971893840_1959452198_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/487162_344215148990896_1975814851_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-prn1/528967_414737501895787_1086632360_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/600042_459503190735227_313109273_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/575270_10150950457235139_1975904854_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/555268_440456079315525_1422253745_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/404535_10150543744894752_1793061955_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash3/555268_440456079315525_1422253745_n.jpg',
			'https://fbcdn-sphotos-a.akamaihd.net/hphotos-ak-ash4/404535_10150543744894752_1793061955_n.jpg'
		].sort(function() {return 0.5 - Math.random()});

		return true;
	}

	function getImageWidth(index) {
		var reductionStep = config.maxReductionPercent / config.numOfImages,
			width = config.baseImageWidth * (100 - reductionStep * (10 - picturesData[index][1])) / 100

		return width;
	}

	function getImagePosition(index) {
		return;
		var unit = screenUnits[index];

		return {
			'x':Math.round(Math.floor(Math.random() * (unit.x[1] - unit.x[0])) + unit.x[0]),
			'y':Math.round(Math.floor(Math.random() * (unit.y[1] - unit.y[0])) + unit.y[0])
		}
	}
})();

$(function () {
	var saver = new ScreenSaver();
});