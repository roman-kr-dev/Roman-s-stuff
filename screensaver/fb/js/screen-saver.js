  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			cssPrefix:'screen-saver-',
			baseZindex:2147483000,
			speedFor100PX:2500,
			imageDisplayTimeout:1000,
			slots:{
				rows:3,
				cols:3
			}
		}, mainApp, thi$, viewportWidth, viewportHeight, 
		imagesData = {}, animationQueue = [], screenSlots = [],
		screenWidth = $(window).width(), screenHeight = $(window).height(),
		animationQueueTimeout, overlayLayer, imagesLayer, zIndex = 100;
	
	return Class.extend({
		init:function () {
			thi$ = this;

			//initMaxImageWidth();
			initSlots();
			initMainWindow();
		},

		initScreenSaver:function () {
			initMarkup();
		},

		bindMainApp:function (app) {
			mainApp = app;
		},

		addImage:function (data) {
			//addImage(data);
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

	function initSlots() {
		var slotWidth = screenWidth / config.slots.cols,
			slotHeight = screenHeight / config.slots.rows;

		console.log('placa', slotWidth, slotHeight, screenWidth, $(window).width());
	}

	function initMaxImageWidth() {
		config.maxImageWidth = (config.maxImageWidth * parseInt(config.screenRatio, 10) / 100);
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
	
	function initPictureDefaultPosition(data) {
		var ratio, pos;
console.log('indf');
		ratio = data.width > config.maxImageWidth ? data.width / config.maxImageWidth : 1;
		pos = {
			width:Math.round(data.width / ratio),
			height:Math.round(data.height / ratio),
			left:0,
			top:0
		};

		data.ratio = ratio;
		data.pos = pos;
		data.image.css(pos);
console.log('nigger kushen', data);		
		insertAnimationQueue(data);
	}

	function insertAnimationQueue(data) {
		animationQueue.push(data);

		if (!animationQueueTimeout) {
			initAnimationQueue();
		}
	}

	function initAnimationQueue() {
		var data;
		
		if (animationQueue.length) {
			data = animationQueue.shift();
console.log('banan', data.image);
			data.image.fadeIn(function () {
				initPictureAnimation(data);
			});

			animationQueueTimeout = setTimeout(initAnimationQueue, config.imageDisplayTimeout);
		}
		else {
			animationQueueTimeout = null;
		}
	}

	function initPictureAnimation(data, topOffset) {
		var image = data.image,
			top = data.pos.height + config.animationTopOffset,
			distance = (topOffset ? topOffset : data.pos.top) + top,
			speed = calculateAnimationSpeed(distance, data.speedRatio);
	
			image.animate({
				top:'-' + top,
			}, speed, 'linear', $.proxy(function() {
				var bottomOffset = Math.floor(Math.random() * (config.animationBottomOffset[1] - config.animationBottomOffset[0])) + config.animationBottomOffset[0],
					topOffset = viewportHeight + bottomOffset,
					data = this;

				data.image.css('top', topOffset);
				
				initPictureAnimation(data, topOffset);
			}, data));
	}

	function calculateAnimationSpeed(distance, speedRatio) {
		var jumpPercent = Math.floor(Math.random() * (config.speedJumpPercent[1] - config.speedJumpPercent[0])) + config.speedJumpPercent[0],
			speed = distance / 100 * config.speedFor100PX,
			adjustSpeed = speed * (100 - jumpPercent * (speedRatio - 1)) / 100;

		return speed = speed + (speed - adjustSpeed);
	}
	
	function addImage(data) {
		var image;
		
		image = $('<img />');

		data.image = image;
		
		image.data('image-id', data.id)
		.on('load', function () { 
			var image = $(this);
			
			data.width = image.width();
			data.height = image.height();

			initPictureDefaultPosition(data);

			imagesLayer.removeClass('loader');
		})
		.attr('src', data.url)
		.appendTo(imagesLayer);

		imagesData[data.id] = data;
	}

	function removeImage(data) {
		var imageData = imagesData[data.id];
		
		if (imageData) {
			imageData.image.stop().remove();
			imageData.position.active = false;

			delete imagesData[data.id];
		}
	}

	function clearAllImages() {
		$.each(imagesData, function (i, imageData) {
			imageData.image.stop().remove();
			imageData.position.active = false;

			delete imagesData[i];
		});
	}
})(jQuery);