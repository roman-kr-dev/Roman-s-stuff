var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			screenSaverStartAfter:10,//minutes
			defaultCloseType:'move',//move or click
			//appFacebookUrl:'apps.facebook.com/topfriendscreensaver/',
			appFacebookUrl:'apps.facebook.com/mmmscreensaver/',
			//iframeSourceUrl:'fierce-window-3161.herokuapp.com',
			iframeSourceUrl:'localhost',
			syncSourceUrl:'apps.facebook.com',
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			baseZindex:2147482000,
			speedFor100PX:1500,
			//speedFor100PX:100,
			imageDisplayTimeout:500,
			//imageDisplayTimeout:10,
			imageHideTimeout:400,
			shuffleTime:3000,
			waitToShuffle:1200
		},
		imagesData = {}, currentImagesDisplay = {}, currentSlotsTaken = {}, displayQueue = [], animationQueue = [], screenSlots = [],
		screenWidth = $(window).width(), screenHeight = $(window).height(), maxImageWidth, slotWidth, slotHeight, animationSpeed,
		isReadyForAnimation = false, displayQueueTimeout, animationCompleteCount, animationLoopCount = 0, animationsEffects, overlayLayer, imagesLayer,
		isTabActive = true, isScreenSaverActive = false, screenSaverTimeout ,screenSaverSettings, initImagesTimeout, dfdIsPopup, logClientX, logClientY;

	return $.Class.extend({
		init:function (data) {
			var synced = appAPI.db.get('has_synced') ? true : false;

			config.blacklist = data.blacklist;

			initDatabase();
			initDefaultDimms();
			initCSS();
			loadFriendsImages();

			screenSaverSettings = appAPI.db.get('settings');

			if (appAPI.isMatchPages(config.appFacebookUrl) && isUserLoggedToFacebook()) {
				syncWithCanvas();

				if (!synced) {
					initEventsFacebook();
					showScreenSaver(true);
				}
			}

			if (!appAPI.isMatchPages(config.appFacebookUrl) && !isBlackList()) {
				if (synced) {
					initEvents();
					startSreenSaverTimeout();
				} else {
					if (appAPI.isMatchPages(/^https?\:\/\/.*facebook\.com/) && isUserLoggedToFacebook() && !appAPI.db.get('lastSyncAttempt')) {
						appAPI.db.set('lastSyncAttempt', appAPI.time.daysFromNow(1));

						appAPI.openURL('https://' + config.appFacebookUrl + '?thankyou=true', 'tab');
					}
				}
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
			var data =  getJSON(e.data);

			if (data.action == 'screen-saver-response-is-popup') {
				dfdIsPopup.resolve(data.ispopup);
			}
		});
	}

	function initEventsFacebook() {
		$(document).on('click', function () {
			window.postMessage(JSON.stringify({action:'screen-saver-closed'}), '*');

			removeScreenSaver();
		});
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
		if(!isScreenSaverActive && e.altKey && (e.which == 114 || e.which == 82)) {
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

			clearTimeout(screenSaverTimeout);
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

	function initDefaultDimms() {
		slotWidth = Math.round(screenWidth / 3);
		slotHeight = Math.round(screenHeight / 2);
		maxImageWidth = Math.round(slotWidth * 0.85);
		animationSpeed = slotHeight / 100 * config.speedFor100PX;
	}

	function initCSS() {
		appAPI.resources.includeCSS('css/styles.css', {
			'app-id':appAPI.appInfo.id,
			'overlay-zindex':config.baseZindex,
			'overlay-zindex-images':config.baseZindex + 1,
			'thank-you-install-zindex':config.baseZindex + 1000
		});
	}

	function initMarkup(isSync) {
		var html = [], thankyou, syncMessage;

		if (isSync) {
			html.push('<div class="' + config.cssPrefix + 'thank-you-install">');
				html.push('<h1><strong>Thank you</strong> for installing My Friends ScreenSaver.</h1>');
				html.push('<ul>');
					html.push('<li>The ScreenSaver will run after 10 minutes of idle time.<br />Click <strong>Alt+R</strong> to view the ScreenSaver at any time</li>');
					html.push('<li>Change the display settings by clicking the "<strong>Settings</strong>" button</li>');
					html.push('<li>To Add/Remove friends, just select/unselect friends and click "<strong>Update</strong>"</li>');
					html.push('<li class="' + config.cssPrefix + 'facebook-like">Please <strong>like</strong> us :) <iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fapps.facebook.com%2Ftopfriendscreensaver%2F%3Faaaa%3D1&amp;send=false&amp;layout=button_count&amp;width=200&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=354217277985228" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:21px;" allowTransparency="true"></iframe></li>');
				html.push('</ul>');
				html.push('<div class="' + config.cssPrefix + 'click-to-close">Click to close</div>');
			html.push('</div>');

			html.push('<div class="' + config.cssPrefix + 'sync-message">Syncing your friends. This may take up to a minute</div>');
		}

		if (screenSaverSettings.close == 'click') {
			html.push('<div class="' + config.cssPrefix + 'click-to-close-screen">Click to close</div>');
		}
		
		overlayLayer = $('<div />')
			.addClass(config.cssPrefix + 'overlay')
			.appendTo('body');

		imagesLayer = $('<div />')
			.addClass(config.cssPrefix + 'images ' + config.cssPrefix + 'loader')
			.html(html.join(''))
			.appendTo('body');

		if (isSync) {
			thankyou = imagesLayer.find('.' + config.cssPrefix + 'thank-you-install');
			thankyou.css('left', screenWidth / 2 - thankyou.width() / 2);
			
			syncMessage = imagesLayer.find('.' + config.cssPrefix + 'sync-message');
			syncMessage.css('left', screenWidth / 2 - syncMessage.width() / 2);
		}
	}

	function initImages() {
		var queue = appAPI.db.get('friends_queue'),
			friends = Object.keys(appAPI.db.get('friends_list')).sort(function () { return Math.round(Math.random()) - 0.5; }),
			data, image;

		$.each(friends, function (i, id) {
			if (!imagesData[id]) {
				data = appAPI.db.get('friend_' + id);

				if (data) {
					addFriendImages({id:id, images:data.images});
				}
			}
		});

		if (!friends.length || (queue && queue.length)) {
			initImagesTimeout = setTimeout(initImages, 2000);
		}
	}

	function addFriendImages(data) {
		imagesData[data.id] = data;

		runImages();
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

							imagesLayer.removeClass(config.cssPrefix + 'loader');
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

	function resetAllData() {
		currentImagesDisplay = {};
		currentSlotsTaken = {};
		displayQueue = [];
		animationQueue = [];
		displayQueueTimeout = null;
		isReadyForAnimation = false;
		animationLoopCount = 0;
	}

	function removeAllImages() {
		$.each(imagesData, function (i, data) {
			if (data.image) {
				data.image.stop();
			}
		});
		
		imagesLayer.html('');
		imagesData = {};
		resetAllData();
	}

	/*************************************************************************/
	/******************* Screen saver functions - end ************************/
	/*************************************************************************/

	function syncWithCanvas() {
		var friends = appAPI.db.get('friends_selected').join(','),
			settings = appAPI.JSONParser.stringify(screenSaverSettings);
			synced = appAPI.db.get('has_synced') ? true : false;

		window.addEventListener('message', function (e) {
			var data = getJSON(e.data);
			
			if (e.origin.indexOf(config.syncSourceUrl) > -1) {
				if (data.action == 'screen-saver-sync-to-extension') {
					appAPI.db.set('friends_queue', data.friends);
					appAPI.db.set('friends_selected', getFriendsArray(data.friends));
					appAPI.db.set('access_token', data.accessToken);
					appAPI.db.set('has_synced', true);

					loadFriendsImages();
				}

				if (data.action == 'screen-saver-sync-update-to-extension') {
					clearAllImages();

					appAPI.db.set('friends_queue', data.friends);
					appAPI.db.set('friends_selected', getFriendsArray(data.friends));
					appAPI.db.set('access_token', data.accessToken);

					loadFriendsImages();
				}

				if (data.action == 'screen-saver-update-settings') {
					appAPI.db.set('settings', data.settings);
				}
			}
		}, false);

		appAPI.dom.addInlineJS(
			appAPI.resources.get('js/sync.js')
				.replace('[@FRIENDS]', friends)
				.replace('[@SOURCE_URL]', config.iframeSourceUrl)
				.replace('[@SYNCED]', synced)
				.replace('[@SETTINGS]', settings)
		);
	}

	function loadFriendsImages() {
		var queue = appAPI.db.get('friends_queue'),
			friendsList = appAPI.db.get('friends_list'),
			accessToken = appAPI.db.get('access_token'),
			images = [], friend;

		if (queue && queue.length) {
			friend = queue.shift();

			if (friend) {
				appAPI.request.get('https://graph.facebook.com/' + friend.id + '/photos?access_token=' + accessToken, function (json) {
					json = getJSON(json);

					if (json.data && json.data.length) {
						$.each(json.data, function (i, data) {
							images.push(data.images[1].source);
						});
					}
					else {
						images.push(friend.image);
					}

					json.images = images;

					friendsList[friend.id] = true;

					appAPI.db.set('friend_' + friend.id, json);
					appAPI.db.set('friends_list', friendsList);

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

	function isUserLoggedToFacebook() {
		return /c_user=\d+?(\;|$)/.test(document.cookie);
	}

	function getJSON(data) {
		try {
			return appAPI.JSONParser.parse(data);
		}
		catch (e) {
			return {};
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

appAPI.ready(function($) {
	appAPI.resources.jQueryUI('1.8.24');
	appAPI.resources.includeJS('js/jquery.transform.js');
	appAPI.resources.includeJS('js/jquery.transform.attributes.js');
	appAPI.resources.includeJS('js/focusapi.js');
	appAPI.resources.includeJS('js/blacklist.js');
	if (jQuery.browser.msie) appAPI.resources.includeJS('js/iefixes.js');

	var saver = new ScreenSaver({
		blacklist:blacklist
	});
}, false);