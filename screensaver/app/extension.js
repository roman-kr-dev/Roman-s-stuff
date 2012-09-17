  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			//appFacebookUrl:'apps.facebook.com/topfriendscreensaver/',
			appFacebookUrl:'apps.facebook.com/mmmscreensaver/',
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			baseZindex:2147483000,
			speedFor100PX:2500,
			imageDisplayTimeout:1000,
			speedJumpPercent:[25, 35],
			screenRatio:'75%',
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
		},
		win = $(window),
		viewportWidth = win.width(),
		viewportHeight = win.height(),
		imagesData = {}, maxImageWidth = [], animationQueue = [],
		animationQueueTimeout, overlayLayer, imagesLayer;

	/* SHIT CODE */
	var isNotFirstTime = false;//appAPI.db.get('is_not_first_time');
	var notActiveInbter;

	/*setTimeout(function () {
		ScreenOverlay.show();
		imagesLayer.show();
	}, 3000);*/
	
	return $.Class.extend({
		init:function () {
			notActiveInbter = setTimeout(function () {
				ScreenOverlay.show();
				imagesLayer.show();
			}, 7000);
			
			$(document).on('mousemove', function () {
				if (notActiveInbter) {
					clearTimeout(notActiveInbter);

					notActiveInbter = setTimeout(function () {
						ScreenOverlay.show();
						imagesLayer.show();
					}, 7000);
				}
			})

			initDatabase();
			loadFriendsImages();

			if (appAPI.isMatchPages(config.appFacebookUrl)) {
				console.log('FACEBOOK PAGE FOUND');
				syncWithCanvas();
			}

			if (!appAPI.isMatchPages(config.appFacebookUrl)) {
				var friendsList = appAPI.db.get('friends_list'), z = 0;

				/* SHIT CODE START */
				if (friendsList) {
					appAPI.resources.includeCSS('css/styles.css', {
						'overlay-zindex':config.baseZindex,
						'overlay-zindex-images':config.baseZindex + 1
					});

					overlayScreen();
					initMaxImageWidth();

					ScreenOverlay.hide();
					imagesLayer.hide();
					
					for (var i in friendsList) {
						if (z < 10) {
							var data = appAPI.db.get('friend_' + i);

							var image = data.data.length ? data.data[Math.floor(Math.random() * data.data.length)].images[1].source : 'NOT';

							addImage({id:i, url:image});

							z++;
						}
					}
					//var image = data.data.length ? data.data[Math.floor(Math.random() * data.data.length)].images[1].source : friend.image;

					//addImage({id:friend.id, url:image});
				}
				/* SHIT CODE END */
			}

			if (!isNotFirstTime) {

				appAPI.resources.includeCSS('css/styles.css', {
					'overlay-zindex':config.baseZindex,
					'overlay-zindex-images':config.baseZindex + 1
				});

				overlayScreen();
				initMaxImageWidth();

				
				appAPI.db.set('is_not_first_time', true);
			}
			
			/*$.when(getPicturesData()).then(function () {
				overlayScreen();
				

			});*/
		}
	});

	function syncWithCanvas() {
		var friends = getFriendsArray(appAPI.db.get('friends_list')) || '';
console.log('Peker man', friends);
		appAPI.dom.addInlineJS(appAPI.resources.get('js/sync.js').replace('[@FRIENDS]', friends));

		window.addEventListener('message', function (e) {
			if (e.origin.indexOf('https://apps.facebook.com') > -1) {
				if (e.data.action == 'screen-saver-sync') {
					appAPI.db.set('friends_queue', e.data.friends);
					appAPI.db.set('access_token', e.data.accessToken);

					loadFriendsImages();
				}
			}
		}, false);
	}

	function loadFriendsImages() {
		var queue = appAPI.db.get('friends_queue'),
			friendsList = appAPI.db.get('friends_list'),
			accessToken = appAPI.db.get('access_token'),
			friend;

		if (queue && queue.length) {
			friend = queue.shift();

			appAPI.request.get('https://graph.facebook.com/' + friend.id + '/photos?access_token=' + accessToken, function (data) {
				data = JSON.parse(data);

				if (!data.data.length) {
					data.data = [
						{
							images:[0, {source:friend.image}]
						}
					];

					console.log('DATA IMAGE:' + data.data);
				}


				friendsList[friend.id] = true;
console.log('friend loaded', friend.id, friend.name);
				appAPI.db.set('friend_' + friend.id, data);
				appAPI.db.set('friends_list', friendsList)

				appAPI.db.set('friends_queue', queue);

				loadFriendsImages();

				/* SHIT CODE START */
				if (imagesLayer) {
					var image = data.data[Math.floor(Math.random() * data.data.length)].images[1].source;

					addImage({id:friend.id, url:image});
				}
				/* SHIT CODE END */
			});
		}
		else {
			console.log('Done loading 2');
		}
	}

	function initDatabase() {
		if (!appAPI.db.get('friends_list')) {
			appAPI.db.set('friends_list', {});
		}
	}

	function getFriendsArray(obj) {
		var arr = [], i;

		if (obj) {
			$.each(obj, function (key) {
				arr.push(key);
			});
		}

		return arr;
	}








var imagesLayer;
var ScreenOverlay;

	/* shit code */
	function overlayScreen() {
		ScreenOverlay = $('<div />').attr('class', config.cssPrefix + 'screen-overlay').appendTo('body');

		imagesLayer = $('<div />').attr('class', config.cssPrefix + 'screen-images').appendTo('body');

		$('<h1 style="color:white;position:absolute;top:10px;left:10px;">Click to close</h1>').appendTo(imagesLayer);

		$(document).on('click', function () {
			ScreenOverlay.remove();
			imagesLayer.remove();
		});
	}

	function initMaxImageWidth() {
		$.each(config.maxImageWidth, function (i, imageWidth) {
			maxImageWidth.push(imageWidth * parseInt(config.screenRatio, 10) / 100);
		});
	}

	function addImage(data) {
		console.log('add image', data);
		$('<img />')
		.data('image-id', data.id)
		.on('load', function () { 
			var image = $(this);
			
			data.width = this.width;
			data.height = this.height;
			data.image = image;

			initPictureDefaultPosition(data);
		})
		.attr('src', data.url)
		.appendTo(imagesLayer);

		imagesData[data.id] = data;
	}


	function initPictureDefaultPosition(data) {
		var currentPosition, ratio, pos;
		
		$.each(config.screenPositions, function (i, position) {
			if (!currentPosition && !position.active) {
				currentPosition = data.position = position;
				position.active = true;
			}
		});

		if (currentPosition) {
			ratio = data.width > maxImageWidth[currentPosition.maxWidthBinding] ? data.width / maxImageWidth[currentPosition.maxWidthBinding] : 1;
			pos = {
				width:Math.round(data.width / ratio),
				height:Math.round(data.height / ratio),
				left:Math.max(0, (viewportWidth * parseInt(currentPosition.x, 10) / 100) + (Math.floor(Math.random() * currentPosition.xOffset * 2) - currentPosition.xOffset) - ((data.width / ratio) / 2)),
				top:(viewportHeight * parseInt(currentPosition.y, 10) / 100) + (Math.floor(Math.random() * currentPosition.yOffset * 2) - currentPosition.yOffset) - ((data.height / ratio) / 2)
			};
	
			data.speedRatio = currentPosition.speedRatio;
			data.ratio = ratio;
			data.pos = pos;
			data.image.css(pos);
			
			insertAnimationQueue(data);
		}
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


})(jQuery);

appAPI.ready(function($) {
	var saver = new ScreenSaver();
}, false);