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
			speedJumpPercent:[25, 35],
			screenRatio:'35%',
			animationTopOffset:20,
			animationBottomOffset:[20, 120],
			maxImageWidth:[700, 500, 300],
			screenPositions:[
				{
					x:'25%',
					xOffset:25,
					y:'50%',
					yOffset:50,
					maxWidthBinding:0,
					speedRatio:1
				}, {
					x:'75%',
					xOffset:25,
					y:'50%',
					yOffset:50,
					maxWidthBinding:0,
					speedRatio:1
				}, {
					x:'25%',
					xOffset:20,
					y:'25%',
					yOffset:40,
					maxWidthBinding:1,
					speedRatio:2
				}, {
					x:'75%',
					xOffset:20,
					y:'75%',
					yOffset:40,
					maxWidthBinding:1,
					speedRatio:2
				}, {
					x:'50%',
					xOffset:20,
					y:'50%',
					yOffset:40,
					maxWidthBinding:1,
					speedRatio:2
				}, {
					x:'50%',
					xOffset:20,
					y:'100%',
					yOffset:40,
					maxWidthBinding:1,
					speedRatio:2
				}, {
					x:'15%',
					xOffset:20,
					y:'50%',
					yOffset:40,
					maxWidthBinding:2,
					speedRatio:3
				}, {
					x:'55%',
					xOffset:20,
					y:'55%',
					yOffset:40,
					maxWidthBinding:2,
					speedRatio:3
				}, {
					x:'22%',
					xOffset:20,
					y:'150%',
					yOffset:40,
					maxWidthBinding:2,
					speedRatio:3
				}, {
					x:'88%',
					xOffset:20,
					y:'150%',
					yOffset:40,
					maxWidthBinding:2,
					speedRatio:3
				}
			]
		}, mainApp, thi$, viewportWidth, viewportHeight, 
		imagesData = {}, maxImageWidth = [], animationQueue = [],
		animationQueueTimeout, overlayLayer, imagesLayer, zIndex = 100;
	
	return Class.extend({
		init:function () {
			thi$ = this;

			initMaxImageWidth();
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

	function initMaxImageWidth() {
		$.each(config.maxImageWidth, function (i, imageWidth) {
			maxImageWidth.push(imageWidth * parseInt(config.screenRatio, 10) / 100);
		});
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

	function initPictureDefaultSlot(data) {
		$.each(config.screenPositions, function (i, position) {
			if (!data.position && !position.active) {
				data.position = position;
				
				position.active = true;
			}
		});

		return data.position;
	}
	
	function initPictureDefaultPosition(data) {
		var ratio, pos;
		
		ratio = data.width > maxImageWidth[data.position.maxWidthBinding] ? data.width / maxImageWidth[data.position.maxWidthBinding] : 1;
		pos = {
			width:Math.round(data.width / ratio),
			height:Math.round(data.height / ratio),
			left:Math.max(0, (viewportWidth * parseInt(data.position.x, 10) / 100) + (Math.floor(Math.random() * data.position.xOffset * 2) - data.position.xOffset) - ((data.width / ratio) / 2)),
			top:(viewportHeight * parseInt(data.position.y, 10) / 100) + (Math.floor(Math.random() * data.position.yOffset * 2) - data.position.yOffset) - ((data.height / ratio) / 2)
		};

		data.speedRatio = data.position.speedRatio;
		data.ratio = ratio;
		data.pos = pos;
		data.image.css(pos);
		
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
		
		if (initPictureDefaultSlot(data)) {
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