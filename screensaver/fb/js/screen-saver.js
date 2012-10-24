  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			cssPrefix:'screen-saver-',
			baseZindex:2147483000,
			speedFor100PX:2000,
			//speedFor100PX:100,
			imageDisplayTimeout:500,
			//imageDisplayTimeout:1,
			imageHideTimeout:500
		}, mainApp, thi$,
		imagesData = {}, currentImagesDisplay = {}, currentSlotsTaken = {}, displayQueue = [], animationQueue = [], screenSlots = [],
		screenWidth = $(window).width(), screenHeight = $(window).height(), maxImageWidth, slotWidth, slotHeight, animationSpeed,
		isReadyForAnimation = false, displayQueueTimeout, overlayLayer, imagesLayer, zIndex = 100;
	
	return Class.extend({
		init:function () {
			thi$ = this;

			initDefaultDimms();
			initMainWindow();
		},

		initScreenSaver:function () {
			initMarkup();
		},

		bindMainApp:function (app) {
			mainApp = app;
		},

		addImage:function (data) {
			addImage(data);
		},

		removeImage:function (data) {
			removeImage(data);
		},

		clearAllImages:function () {
			clearAllImages();
		},

		getActiveImages:function () {
			return imagesData;
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
			.addClass(config.cssPrefix + 'images loader')
			.appendTo('body');

		viewportWidth = imagesLayer.width();
		viewportHeight = imagesLayer.height();
	}

	function addImage(data) {
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
	}

	function removeImage(data) {
		var imageData = imagesData[data.id];
		
		if (imageData) {
			imageData.image.stop().remove();

			delete imagesData[data.id];

			resetAllData();
			runImages();
		}
	}

	function clearAllImages() {
		$.each(imagesData, function (i, imageData) {
			imageData.image.stop().remove();

			delete imagesData[i];
		});

		resetAllData();
	}

	//choose images and display up to 9 images at each time
	function runImages() {
		var image;
console.log('getPropertyCount(currentImagesDisplay)', getPropertyCount(currentImagesDisplay));		
		if (getPropertyCount(currentImagesDisplay) <= 9) {
			var Images = makeArray(imagesData).sort(function() {return 0.5 - Math.random()}),
				isNegative = Math.floor(Math.random() * 2),
				deg = 3 + Math.floor(Math.random() * 7);

			$.each(Images, function(i, data) {
				if (!currentImagesDisplay[data.id]) {
					currentImagesDisplay[data.id] = true;

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
					image.attr('src', data.url);
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

		if (!displayQueueTimeout) {
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

		console.log( animationQueue, animationQueue.length );

		if (isReadyForAnimation) {
			$.each(animationQueue, function (i, data) {
				data.animations = 0;

				initPictureAnimation(data);
			});

			animationQueue = [];
		}
	}

	function initPictureAnimation(data) {
		var image = data.image,
			currentTop = data.top;

		image.animate({
			top:currentTop - slotHeight,
		}, animationSpeed, 'linear', $.proxy(function() {
			var data = this,
				image = data.image,
				row = data.row - 1 < 0 ? 2 : data.row - 1,
				top = (slotHeight / 2) - (data.height / 2) + (row * slotHeight),
				isNegative = Math.floor(Math.random() * 2),
				deg = Math.floor(Math.random() * 10),
				effect;

			data.row = row;
			data.top = top;
			data.animations = data.animations + 1;
			image.css('top', top);
			if (row == 2) image.transform({rotate:(isNegative ? '-' : '') + deg + 'deg'});


			if (data.animations < 3) {
				initPictureAnimation(data);
			} else {
				insertHideQueue(data);
			}
		}, data));
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