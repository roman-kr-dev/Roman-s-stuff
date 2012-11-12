  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			cssPrefix:'screen-saver-',
			baseZindex:2147483000,
			speedFor100PX:1500,
			//speedFor100PX:100,
			imageDisplayTimeout:500,
			//imageDisplayTimeout:10,
			imageHideTimeout:400,
			shuffleTime:3000,
			waitToShuffle:1200
		}, mainApp, thi$,
		imagesData = {}, currentImagesDisplay = {}, currentSlotsTaken = {}, displayQueue = [], animationQueue = [], screenSlots = [],
		screenWidth = $(window).width(), screenHeight = $(window).height(), maxImageWidth, slotWidth, slotHeight, animationSpeed,
		isReadyForAnimation = false, displayQueueTimeout, animationCompleteCount, animationLoopCount = 0, animationsEffects, overlayLayer, imagesLayer, zIndex = 100;
	
	return Class.extend({
		init:function () {
			thi$ = this;

			initDefaultDimms();
			initMarkup();
			initMainWindow();
		},

		bindMainApp:function (app) {
			mainApp = app;
		},

		addFriendImages:function (data) {
			addFriendImages(data);
		},

		removeImage:function (data) {
			removeImage(data);
		},

		clearAllImages:function () {
			clearAllImages();
		},

		setLoader:function () {
			imagesLayer.addClass('loader');
		}
	});

	function initDefaultDimms() {
		slotWidth = Math.round(screenWidth / 3);
		slotHeight = Math.round(screenHeight / 2);
		maxImageWidth = Math.round(slotWidth * 0.85);
		animationSpeed = slotHeight / 100 * config.speedFor100PX;
	}

	function initMainWindow() {
		parent.friendsScreenSaver.bindIframeWindow(thi$);
	}

	function initMarkup() {
		overlayLayer = $('<div />')
			.addClass(config.cssPrefix + 'overlay')
			.appendTo('body');

		imagesLayer = $('<div />')
			.html('<div class="' + config.cssPrefix + 'logo"></div>')
			.addClass(config.cssPrefix + 'images loader')
			.appendTo('body');

		viewportWidth = imagesLayer.width();
		viewportHeight = imagesLayer.height();
	}

	function addFriendImages(data) {
		imagesData[data.id] = data;

		runImages();
	}

	function resetAllData() {
		currentImagesDisplay = {};
		currentSlotsTaken = {};
		displayQueue = [];
		animationQueue = [];
		displayQueueTimeout = null;
		isReadyForAnimation = false;
		animationLoopCount = 0;
	}

	function removeImage(data) {
		var imageData = imagesData[data.id];
		
		if (imageData) {
			if (imageData.image) {
				imageData.image.stop().remove();
			}

			delete imagesData[data.id];
		}
	}

	function clearAllImages() {
		$.each(imagesData, function (i, data) {
			if (data.image) {
				data.image.stop();
			}
		});
		
		imagesLayer.html('');
		imagesData = {};
		resetAllData();
	}

	//choose images and display up to 9 images at each time
	function runImages() {
		var image, url;

		if (getPropertyCount(currentImagesDisplay) < 9) {
			var Images = makeArray(imagesData).sort(function() {return 0.5 - Math.random()}),
				isNegative = Math.floor(Math.random() * 2),
				deg = 3 + Math.floor(Math.random() * 7);

			$.each(Images, function(i, data) {
				if (!currentImagesDisplay[data.id] && getPropertyCount(currentImagesDisplay) < 9) {
					currentImagesDisplay[data.id] = data;
	
					url = data.images[Math.floor(Math.random() * data.images.length)];

					image = data.image = $('<img />')
						.css('max-width', maxImageWidth)
						.css('max-height', slotHeight)
						.transform({rotate:(isNegative ? '-' : '') + deg + 'deg'});
					image.on('load', function () { 
						var image = $(this);

						if (currentImagesDisplay[data.id]) {	
							data.width = image.width();
							data.height = image.height();

							initPictureDefaultPosition(data);

							imagesLayer.removeClass('loader');
						}
					});
					image.attr('src', url);
					image.appendTo(imagesLayer);
				}
			});
		}
	}
	
	function initPictureDefaultPosition(data) {
		var emptySlot = null,
			counter = 0,
			left, top;

		for (var i=0; i<9 && emptySlot === null; i++) {
			if (!currentSlotsTaken[i]) {
				emptySlot = i;
			}
		}
		
		for (var i=0; i<3; i++) {
			for (var z=0; z<3; z++) {
				if (counter == emptySlot) {
					currentSlotsTaken[emptySlot] = true;

					left = (slotWidth / 2) - (data.width / 2) + (z * slotWidth);
					top = (slotHeight / 2) - (data.height / 2) + (i * slotHeight);

					data.row = i;
					data.col = z;
					data.top = top;
					data.left = left;
					data.slot = emptySlot;
					data.image.css({
						left:left,
						top:top
					});

					insertDisplayQueue(data);
				}

				counter ++;
			}
		}
	}

	function insertDisplayQueue(data) {
		displayQueue.push(data);

		if (!displayQueueTimeout) {
			initDisplayQueue();
		}
	}

	function initDisplayQueue() {
		var data;
		
		if (displayQueue.length) {
			data = displayQueue.shift();

			if (data.row < 2) {
				data.image.show('explode', function () {
					insertAnimationQueue(data);
				});

				displayQueueTimeout = setTimeout(initDisplayQueue, config.imageDisplayTimeout);
			} else {
				data.image.show();
				insertAnimationQueue(data);

				initDisplayQueue();
			}
		}
		else {
			displayQueueTimeout = null;
		}
	}

	
	//HIDE IMAGES - START
	function insertHideQueue(data) {
		displayQueue.push(data);

		if (displayQueue.length == 9) {
			initHideQueue();
		}
	}

	function initHideQueue() {
		var data, effect;
		
		if (displayQueue.length) {
			data = displayQueue.shift();

			if (data.row < 2) {
				data.image.hide('explode', function () {
					data.image.remove();
				});

				displayQueueTimeout = setTimeout(initHideQueue, config.imageHideTimeout);
			} else {
				data.image.hide();
				data.image.remove();

				initHideQueue();
			}
		}
		else {
			resetAllData();
			runImages();
		}
	}
	//HIDE IMAGES - END

	function insertAnimationQueue(data) {
		animationQueue.push(data);

		isReadyForAnimation = animationQueue.length == 9;

		if (isReadyForAnimation) {
			animationCompleteCount = 0;
			animationLoopCount ++;
			setAnimationsEffects();
			
			$.each(animationQueue, function (i, data) {
				initPictureAnimation(data);
			});

			animationQueue = [];
		}
	}

	function initPictureAnimation(data) {
		var image = data.image,
			currentTop = data.top;
			animSpeed = (animationSpeed - 500) + (Math.floor(Math.random() * 1000));

		image.animate({
			top:currentTop - slotHeight,
		}, animSpeed, animationsEffects[data.col], $.proxy(function() {
			var data = this,
				image = data.image,
				row = data.row - 1 < 0 ? 2 : data.row - 1,
				top = (slotHeight / 2) - (data.height / 2) + (row * slotHeight),
				isNegative = Math.floor(Math.random() * 2),
				deg = Math.floor(Math.random() * 10),
				effect;

			data.row = row;
			data.top = top;
			image.css('top', top);
			
			if (row == 2) {
				image.transform({rotate:(isNegative ? '-' : '') + deg + 'deg'});
			}

			if (animationLoopCount == 2) {
				insertHideQueue(data);
			} else {
				animationCompleteCount ++;
				if (animationCompleteCount == 9) {				
					setTimeout(function () {
						shuffleImages();
					}, config.waitToShuffle);
				}
			}
		}, data));
	}

	//shuffle start
	function shuffleImages() {
		var positions = [], pos, top, left;
		
		for (var i=0; i<3; i++) {
			for (var z=0; z<3; z++) {
				positions.push([i, z]);
			}
		}

		positions = positions.sort(function () { return (Math.round(Math.random())-0.5); }).sort(function () { return (Math.round(Math.random())-0.5); });

		$.each(currentImagesDisplay, function (i, data) {
			pos = $.grep(positions, function (p) { return !(p[0] == data.row && p[1] == data.col); });
			pos = pos.length ? pos[0] : positions[0];
			positions = $.grep(positions, function (p) { return !(p[0] == pos[0] && p[1] == pos[1]); });
			
			data.row = pos[0];
			data.col = pos[1];

			top = (slotHeight / 2) - (data.height / 2) + (data.row * slotHeight);
			left = (slotWidth / 2) - (data.width / 2) + (data.col * slotWidth);

			data.top = top;

			data.image.animate({
				top:top,
				left:left,
			}, config.shuffleTime, 'easeOutBounce', $.proxy(function() {
				insertAnimationQueue(this);
			}, data));
		});
	}
	//shuffle end

	//randomize an animations effect type of each row
	function setAnimationsEffects() {
		var types = ['linear', 'easeInBack', 'easeOutExpo'];
		
		animationsEffects = {
			0:types[Math.floor(Math.random() * types.length)],
			1:types[Math.floor(Math.random() * types.length)],
			2:types[Math.floor(Math.random() * types.length)]
		}
	}

	//count utility
	function getPropertyCount(obj) {
		var count = 0,
			key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				count++;
			}
		}

		return count;
	}

	//make array from object utility
	function makeArray(obj) {
		var arr = [];

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				arr.push(obj[key]);
			}
		}

		return arr;
	}
})(jQuery);