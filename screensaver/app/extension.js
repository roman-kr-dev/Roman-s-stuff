var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			maxFriendsDisplay:10,
			screenSaverStartAfter:10,//minutes
			defaultCloseType:'move',//move or click
			appFacebookUrl:'apps.facebook.com/topfriendscreensaver/',
			//appFacebookUrl:'apps.facebook.com/mmmscreensaver/',
			iframeSourceUrl:'fierce-window-3161.herokuapp.com',
			//iframeSourceUrl:'localhost',
			syncSourceUrl:'apps.facebook.com',
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			baseZindex:2147482000,
			speedFor100PX:2500,
			imageDisplayTimeout:1000,
			speedJumpPercent:[25, 35],
			screenRatio:'75%',
			animationTopOffset:20,
			animationBottomOffset:[20, 120],
			maxImageWidth:[600, 420, 250],
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
		isTabActive = true, isScreenSaverActive = false,
		screenSaverTimeout, animationQueueTimeout, initImagesTimeout, screenSaverSettings, overlayLayer, imagesLayer, dfdIsPopup, logClientX, logClientY;
	
	return $.Class.extend({
		init:function (data) {
			var synced = appAPI.db.get('has_synced') ? true : false;

			config.blacklist = data.blacklist;

			initDatabase();
			initMaxImageWidth();
			loadFriendsImages();

			screenSaverSettings = appAPI.db.get('settings');

			if (appAPI.isMatchPages(config.appFacebookUrl)) {
				syncWithCanvas();

				if (!synced) {
					initEventsFacebook();
					showScreenSaver(true);
				}
			}

			if (!appAPI.isMatchPages(config.appFacebookUrl) && !isBlackList()) {
				initEvents();
				startSreenSaverTimeout();
			}
		}
	});

	/*************************************************************************/
	/****************** Screen saver functions - start ***********************/
	/*************************************************************************/
	function initEvents() {
		$(document).on('mousemove', screenSaverMouseMove);
		$(document).on('click', screenSaverMouseClick);
		$(document).on('keydown', screenSaverKeyboardPress);
		$(document).on('scroll', screenSaverRemoveOrRestart);
		
		$(window).on('resize', screenSaverRemoveOrRestart);
		$(window).on('screenSaverFocusChange', function (e, type) {
			if (isScreenSaverActive) {
				removeScreenSaver();
			}
			
			isTabActive = type == 'visible';
		});
		window.addEventListener('message', function (e) {
			if (e.data.action == 'screen-saver-response-is-popup') {
				dfdIsPopup.resolve(e.data.ispopup);
			}
		});
	}

	function initEventsFacebook() {
		$(document).on('click', removeScreenSaver);
	}

	function screenSaverMouseMove(e) {
		var isMouseMove = false;
		
		//detect mouse move
		if (e.type == 'mousemove') {
			if (e.clientX != logClientX || e.clientY != logClientY) {
				isMouseMove = true;
			}

			logClientX = e.clientX;
			logClientY = e.clientY;
		}

		//if mouse move detected
		if (isMouseMove) {
			screenSaverRemoveOrRestart();
		}
	}

	function screenSaverMouseClick() {
		if (isScreenSaverActive && screenSaverSettings.close == 'click') {
			removeScreenSaver();
		} else {
			startSreenSaverTimeout();
		}
	}

	function screenSaverKeyboardPress(e) {
		if(!isScreenSaverActive && e.altKey && e.which == 83) {
			showScreenSaver();
		} else {
			screenSaverRemoveOrRestart();
		}
	}

	function screenSaverRemoveOrRestart() {
		if (isScreenSaverActive && screenSaverSettings.close == 'move') {
			removeScreenSaver();
		} else {
			startSreenSaverTimeout();
		}
	}

	function startSreenSaverTimeout() {
		if (!isScreenSaverActive) {
			clearTimeout(screenSaverTimeout);

			screenSaverTimeout = setTimeout(function () {
				$.when(requestIsPopup()).then(function (isPopup) {
					if (
						!isPopup && //do not open in popups
						isTabActive //open only if the tab is active
					) {
						showScreenSaver();
					}
				});
			}, screenSaverSettings.display * 60 * 1000);
		}
	}

	function showScreenSaver(isSync) {
		if (!isScreenSaverActive) {
			isScreenSaverActive = true;

			initMarkup(isSync);
			initImages();
		}
	}

	function removeScreenSaver() {
		if (isScreenSaverActive) {
			isScreenSaverActive = false;

			overlayLayer.remove();
			imagesLayer.remove();
			
			removeAllImages();
			startSreenSaverTimeout();
		}
	}

	function requestIsPopup() {
		dfdIsPopup = new $.Deferred();

		appAPI.resources.addInlineJS('js/ispopup.js');

		return dfdIsPopup.promise();
	}

	function initMaxImageWidth() {
		$.each(config.maxImageWidth, function (i, imageWidth) {
			maxImageWidth.push(imageWidth * parseInt(config.screenRatio, 10) / 100);
		});
	}

	function initMarkup(isSync) {
		var html = [], thankyou;

		if (isSync) {
			html.push('<div class="' + config.cssPrefix + 'thank-you-install">');
				html.push('<h1>Thank you for installing My Friends ScreenSaver</h1>');
				html.push('<ul>');
					html.push('<li>This screen server will be shown after 15 minutes of idle time.<br />Press Alt + s to view the Screen Saver immediately</li>');
					html.push('<li>Change the display settings by clicking the "Settings" button</li>');
					html.push('<li>To change friends just select a new onces and click Update</li>');
				html.push('</ul>');
				html.push('<div class="' + config.cssPrefix + 'click-to-close">Click to close</div>');
			html.push('</div>');
		}

		if (screenSaverSettings.close == 'click') {
			html.push('<div class="' + config.cssPrefix + 'click-to-close-screen">Click to close</div>');
		}
		
		appAPI.resources.includeCSS('css/styles.css', {
			'app-id':appAPI.appInfo.id,
			'overlay-zindex':config.baseZindex,
			'overlay-zindex-images':config.baseZindex + 1,
			'thank-you-install-zindex':config.baseZindex + 1000
		});
		
		overlayLayer = $('<div />')
			.addClass(config.cssPrefix + 'overlay')
			.appendTo('body');

		imagesLayer = $('<div />')
			.addClass(config.cssPrefix + 'images ' + config.cssPrefix + 'loader')
			.html(html.join(''))
			.appendTo('body');

		viewportWidth = imagesLayer.width();
		viewportHeight = imagesLayer.height();

		thankyou = imagesLayer.find('.' + config.cssPrefix + 'thank-you-install');
		thankyou.css({
			left:viewportWidth / 2 - thankyou.width() / 2
		});
	}

	function initImages() {
		var friends = Object.keys(appAPI.db.get('friends_list')).sort(function () { return Math.round(Math.random()) - 0.5; }).slice(0, config.maxFriendsDisplay),
			data, image;

		$.each(friends, function (i, id) {
			if (!imagesData[id]) {
				data = appAPI.db.get('friend_' + id);

				if (data) {
					image = data.data[Math.floor(Math.random() * data.data.length)].images[1].source;

					addImage({id:id, url:image});
				}
			}
		});

		if (friends.length < config.maxFriendsDisplay) {
			initImagesTimeout = setTimeout(initImages, 2000);
		}
	}

	function addImage(data) {
		$('<img />')
		.data('image-id', data.id)
		.on('load', function () { 
			var image = $(this);

			//it may been removed already
			if (imagesData[data.id]) {
				data.width = this.width;
				data.height = this.height;
				data.image = image;

				initPictureDefaultPosition(data);
			}
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

		imagesLayer.removeClass(config.cssPrefix + 'loader');
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

	function removeAllImages() {
		clearTimeout(initImagesTimeout);
		initImagesTimeout = null;
		
		clearTimeout(animationQueueTimeout);
		animationQueueTimeout = null;

		animationQueue = [];

		$.each(imagesData, function (id, image) {
			if (image.position) {
				image.position.active = false;
			}

			delete imagesData[id];
		});
	}

	/*************************************************************************/
	/******************* Screen saver functions - end ************************/
	/*************************************************************************/

	function syncWithCanvas() {
		var friends = appAPI.db.get('friends_selected').join(','),
			settings = appAPI.JSONParser.stringify(screenSaverSettings),
			synced = appAPI.db.get('has_synced') ? true : false;

		appAPI.dom.addInlineJS(
			appAPI.resources.get('js/sync.js')
				.replace('[@FRIENDS]', friends)
				.replace('[@SOURCE_URL]', config.iframeSourceUrl)
				.replace('[@SYNCED]', synced)
				.replace('[@SETTINGS]', settings)
		);

		window.addEventListener('message', function (e) {
			if (e.origin.indexOf(config.syncSourceUrl) > -1) {
				if (e.data.action == 'screen-saver-sync-to-extension') {
					appAPI.db.set('friends_queue', e.data.friends);
					appAPI.db.set('friends_selected', getFriendsArray(e.data.friends));
					appAPI.db.set('access_token', e.data.accessToken);
					appAPI.db.set('has_synced', true);

					loadFriendsImages();
				}

				if (e.data.action == 'screen-saver-sync-update-to-extension') {
					clearAllImages();

					appAPI.db.set('friends_queue', e.data.friends);
					appAPI.db.set('friends_selected', getFriendsArray(e.data.friends));
					appAPI.db.set('access_token', e.data.accessToken);

					loadFriendsImages();
				}

				if (e.data.action == 'screen-saver-update-settings') {
					appAPI.db.set('settings', e.data.settings);
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

			if (friend) {
				appAPI.request.get('https://graph.facebook.com/' + friend.id + '/photos?access_token=' + accessToken, function (data) {
					data = JSON.parse(data);

					if (!data.data.length) {
						data.data = [
							{
								images:[0, {source:friend.image}]
							}
						];
					}


					friendsList[friend.id] = true;

					appAPI.db.set('friend_' + friend.id, data);
					appAPI.db.set('friends_list', friendsList)

					appAPI.db.set('friends_queue', queue);

					loadFriendsImages();
				});
			}
		}
	}

	function initDatabase() {
		if (!appAPI.db.get('friends_list')) {
			appAPI.db.set('friends_list', {});
		}

		if (!appAPI.db.get('friends_selected')) {
			appAPI.db.set('friends_selected', []);
		}

		if (!appAPI.db.get('settings')) {
			appAPI.db.set('settings', {
				display:config.screenSaverStartAfter,
				close:config.defaultCloseType
			});
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

		$.each(obj, function (i, friend) {
			arr.push(friend.id);
		});

		return arr;
	}

	function isBlackList() {
		var host = top.location.host.toLowerCase(),
			href = top.location.href.toLowerCase(),
			isBlacklist = false;

		$.each(config.blacklist.hostKeyword, function (i, key) {
			if (host.indexOf(key.toLowerCase()) > -1) {
				isBlacklist = true;
			}
		});

		$.each(config.blacklist.locationkeyword, function (i, key) {
			if (href.indexOf(key.toLowerCase()) > -1) {
				isBlacklist = true;
			}
		});

		return isBlacklist;
	}
})(jQuery);

appAPI.ready(function($) {
	appAPI.resources.includeJS('js/focusapi.js');
	appAPI.resources.includeJS('js/blacklist.js');

	var saver = new ScreenSaver({
		blacklist:blacklist
	});
}, false);