  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			maxFriendsDisplay:10,
			//appFacebookUrl:'apps.facebook.com/topfriendscreensaver/',
			appFacebookUrl:'apps.facebook.com/mmmscreensaver/',
			//iframeSourceUrl:'fierce-window-3161.herokuapp.com',
			iframeSourceUrl:'localhost',
			syncSourceUrl:'apps.facebook.com',
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
	
	return $.Class.extend({
		init:function () {
			var synced = appAPI.db.get('has_synced') ? true : false;

			initDatabase();
			loadFriendsImages();
			
			/*notActiveInbter = setTimeout(function () {
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
			})*/

			if (appAPI.isMatchPages(config.appFacebookUrl)) {
				console.log('FACEBOOK PAGE FOUND');
				syncWithCanvas();

				if (!synced) {
					showScreenSaver();
				}
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

			/*if (synced) return;

			if (!isNotFirstTime) {

				appAPI.resources.includeCSS('css/styles.css', {
					'overlay-zindex':config.baseZindex,
					'overlay-zindex-images':config.baseZindex + 1
				});

				overlayScreen();
				initMaxImageWidth();

				
				appAPI.db.set('is_not_first_time', true);
			}*/
			
			/*$.when(getPicturesData()).then(function () {
				overlayScreen();
				

			});*/
		}
	});

	/*************************************************************************/
	/****************** Screen saver functions - start ***********************/
	/*************************************************************************/
	function showScreenSaver() {
		console.log('SHOW SCREEN SAVER');
		initMaxImageWidth();
		initMarkup();
		initImages();
	}

	function initMaxImageWidth() {
		$.each(config.maxImageWidth, function (i, imageWidth) {
			maxImageWidth.push(imageWidth * parseInt(config.screenRatio, 10) / 100);
		});
	}

	function initMarkup() {
		appAPI.resources.includeCSS('css/styles.css', {
			'app-id':appAPI.appInfo.id,
			'overlay-zindex':config.baseZindex,
			'overlay-zindex-images':config.baseZindex + 1
		});
		
		overlayLayer = $('<div />')
			.addClass(config.cssPrefix + 'overlay')
			.appendTo('body');

		imagesLayer = $('<div />')
			.addClass(config.cssPrefix + 'images ' + config.cssPrefix + 'loader')
			.appendTo('body');

		viewportWidth = imagesLayer.width();
		viewportHeight = imagesLayer.height();
	}

	function initImages() {
		var friends = Object.keys(appAPI.db.get('friends_list')).sort(function () { return Math.round(Math.random()) - 0.5; }).slice(0, config.maxFriendsDisplay),
			data, image;
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', friends);		
		$.each(friends, function (i, id) {
			if (!imagesData[id]) {
				data = appAPI.db.get('friend_' + id);
				console.log('##########################', data, id)
				image = data.data[Math.floor(Math.random() * data.data.length)].images[1].source;

				addImage({id:id, url:image});
			}
		});

		if (friends.length < config.maxFriendsDisplay) {
			setTimeout(initImages, 2000);
		}
	}

	/*************************************************************************/
	/******************* Screen saver functions - end ************************/
	/*************************************************************************/

	function syncWithCanvas() {
		var friends = getFriendsArray(appAPI.db.get('friends_list')).join(','),
			synced = appAPI.db.get('has_synced') ? true : false;

		appAPI.dom.addInlineJS(
			appAPI.resources.get('js/sync.js')
				.replace('[@FRIENDS]', friends)
				.replace('[@SOURCE_URL]', config.iframeSourceUrl)
				.replace('[@SYNCED]', synced)
		);

		window.addEventListener('message', function (e) {
			if (e.origin.indexOf(config.syncSourceUrl) > -1) {
				if (e.data.action == 'screen-saver-sync-to-extension') {
					appAPI.db.set('friends_queue', e.data.friends);
					appAPI.db.set('access_token', e.data.accessToken);
					appAPI.db.set('has_synced', true);

					loadFriendsImages();
				}

				if (e.data.action == 'screen-saver-sync-update-to-extension') {
					clearAllImages();

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

	function clearAllImages() {
		var friends = appAPI.db.get('friends_list');

		$.each(friends, function (id) {
			appAPI.db.remove('friend_' + id);
		});

		appAPI.db.set('friends_list', {});
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


	/* shit code */


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