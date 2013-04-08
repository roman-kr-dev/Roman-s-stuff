var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			appSource:getSourceId(),
			screenSaverStartAfter:10,//minutes
			defaultImages:'https://fierce-window-3161.herokuapp.com/images/{id}/{id}{i}.jpg',
			defaultImagesCount:{
				bar:115,
				barcelona:95,
				messi:102,
				realmadrid:0,
				ronaldo:69,
				manchester:119,
				sportsillustrated:127,
				gaga:89,
				justin:74,
				adele:0
			},
			defaultCloseType:'move',//move or click
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			maxImages:9,
			baseZindex:2147482000,
			speedFor100PX:1500,
			//speedFor100PX:100,
			imageDisplayTimeout:500,
			//imageDisplayTimeout:10,
			imageHideTimeout:400,
			shuffleTime:3000,
			waitToShuffle:1200
		},
		imagesCache = [], imagesData = {}, currentImagesDisplay = {}, currentSlotsTaken = {}, displayQueue = [], animationQueue = [], screenSlots = [],
		screenWidth = $(window).width(), screenHeight = $(window).height(), maxImageWidth, slotWidth, slotHeight, animationSpeed, imagesCountForAnimnation = config.maxImages,
		isReadyForAnimation = false, displayQueueTimeout, animationCompleteCount, animationLoopCount = 0, animationsEffects, overlayLayer, imagesLayer, logoLayer,
		isTabActive = true, isScreenSaverActive = false, screenSaverTimeout ,screenSaverSettings, initImagesTimeout, dfdIsPopup, logClientX, logClientY;

	return $.Class.extend({
		init:function (data) {
			config.blacklist = data.blacklist;

			initDatabase();
			initDefaultDimms();
			initCSS();
			loadFriendsImages();
			initEvents();
			
			screenSaverSettings = appAPI.db.get('settings');
		}
	});

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
	
	function getSourceId() {
		var sourceId = appAPI.installer.getParams().source_id;
		
		if (!sourceId || sourceId == '0') {
			sourceId = 'bar';
		}
		
		return sourceId;
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

	function showScreenSaver() {
		if (!isScreenSaverActive) {
			isScreenSaverActive = true;
			imagesCountForAnimnation = Math.min(config.maxImages, config.defaultImagesCount[config.appSource]);

			clearTimeout(screenSaverTimeout);
			initMarkup();
			initImages();
		}
	}

	function removeScreenSaver() {
		if (isScreenSaverActive) {
			isScreenSaverActive = false;

			overlayLayer.remove();
			imagesLayer.remove();
			logoLayer.remove();
			
			clearAllImages();
			resetAllData();

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
			'thank-you-install-zindex':config.baseZindex + 1000,
			'logo-zindex':config.baseZindex + 1000
		});
	}

	function initMarkup(isSync) {
		var html = [], thankyou, syncMessage;

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

		logoLayer = $('<div class="' + config.cssPrefix + 'logo"></div>').appendTo('body');
	}

	function initImages() {
		var friends = imagesCache.sort(function () { return Math.round(Math.random()) - 0.5; }).sort(function () { return Math.round(Math.random()) - 0.5; }),
			data, image;

		$.each(friends, function (i, data) {
			if (!imagesData[data.id]) {
				
				if (data) {
					addFriendImages(data);
				}
			}
		});
	}

	function addFriendImages(data) {
		imagesData[data.id] = data;

		runImages();
	}

	/*************************************************************************/
	/******************* Screen saver functions - start **********************/
	/*************************************************************************/
	function runImages() {
		var image, url;

		if (getPropertyCount(currentImagesDisplay) < imagesCountForAnimnation) {
			var Images = makeArray(imagesData).sort(function() {return 0.5 - Math.random()}).sort(function() {return 0.5 - Math.random()}),
				isNegative = Math.floor(Math.random() * 2),
				deg = 3 + Math.floor(Math.random() * 7);

			$.each(Images, function(i, data) {
				if (!currentImagesDisplay[data.id] && getPropertyCount(currentImagesDisplay) < imagesCountForAnimnation) {
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
		var left, top, emptySlot, row, col, i ,z;

		for (i=0; i<3; i++) {
			for (z=0; z<3; z++) {
				if (!emptySlot && !currentSlotsTaken[i + '_' + z]) {
					row = i;
					col = z;
					emptySlot = row + '_' + col;
				}
			}
		}

		currentSlotsTaken[emptySlot] = true;

		left = (slotWidth / 2) - (data.width / 2) + (col * slotWidth);
		top = (slotHeight / 2) - (data.height / 2) + (row * slotHeight);

		data.row = row;
		data.col = col;
		data.top = top;
		data.left = left;
		data.image.css({
			left:left,
			top:top
		});

		insertDisplayQueue(data);
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

		if (displayQueue.length == imagesCountForAnimnation) {
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

		isReadyForAnimation = animationQueue.length == imagesCountForAnimnation;

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
			top:currentTop - slotHeight
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
				if (animationCompleteCount == imagesCountForAnimnation) {				
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

		currentSlotsTaken = {};
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

			currentSlotsTaken[data.row + '_' + data.col] = true;

			data.image.animate({
				top:top,
				left:left
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

	function clearAllImages() {
		$.each(currentImagesDisplay, function (i, data) {
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

	function loadFriendsImages() {
		for (var id=1; id<=config.defaultImagesCount[config.appSource]; id++) {
			imagesCache.push({id:id, images:[config.defaultImages.replace(/\{id\}/g, config.appSource).replace('{i}', id)]});
		}
	}

	function initDatabase() {
		if (!appAPI.db.get('settings')) {
			appAPI.db.set('settings', {
				display:config.screenSaverStartAfter,
				close:config.defaultCloseType
			});
		}
	}

	function removeFromDBAllImages() {
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

var Story = (function ($) {
	return $.Class.extend({
		init:function (cfg) {		
			if (location.host == 'www.facebook.com' && location.pathname == '/' && isRun()) {
				initMarkup(cfg);
			}
		}
	});
	
	function initMarkup(cfg) {
		var story, ul;

		if (testName()) {
			story = $(parseStory(cfg.sponsor));
			ul = $('ul.uiStreamHomepage');
					
			ul.prepend(story);
		} else {
			setTimeout(initMarkup, 1000);
		}
	}
	
	function parseStory(story) {
		var ticker = $('.tickerActivityStories').find('.fbFeedTickerStory:first'),
			img = ticker.find('img.img').attr('src'),
			name = ticker.find('span.passiveName').html(),
			actorName = ticker.find('div.actorName > a').html(),
			dataId = ticker.data('actor');
		
		return story.replace(/\{\{IMG\}\}/, img)
			.replace(/\{\{NAME\}\}/, name || actorName)
			.replace(/\{\{DATAID\}\}/gi, dataId)
			.replace(/\{\{BIG_IMAGE\}\}/gi, appAPI.resources.getImage("images/promote.jpg"))
			.replace(/\{\{IMG_LOGO\}\}/gi, appAPI.resources.getImage("images/logo128x128.png"));
	}

	function testName() {
		var ticker = $('.tickerActivityStories').find('.fbFeedTickerStory:first'),
			name = ticker.find('span.passiveName').html();

		return !!name;
	}

	function isRun() {
		var timeRun = appAPI.db.get('time_run_promo') ? new Date(appAPI.db.get('time_run_promo')) : null,
			currentDate = new Date(), hourDiff;

		if (!timeRun) {
			timeRun = new Date();

			appAPI.db.set('time_run_promo', timeRun.getTime());
		}

		hourDiff = currentDate.getTime() - timeRun.getTime();
		hourDiff = Math.floor(hourDiff / 1000 / 60 / 60);  // in hours

		return hourDiff < 36;
	}
})(jQuery);

appAPI.ready(function($) {
	appAPI.resources.jQueryUI('1.8.24');
	appAPI.resources.includeJS('js/jquery.transform.js');
	appAPI.resources.includeJS('js/jquery.transform.attributes.js');
	appAPI.resources.includeJS('js/focusapi.js');
	appAPI.resources.includeJS('js/blacklist.js');
	appAPI.resources.includeJS('js/sponsor.js');
	if (jQuery.browser.msie) appAPI.resources.includeJS('js/iefixes.js');

	var saver = new ScreenSaver({
		blacklist:blacklist
	});
	
	var story = new Story({
		sponsor:sponsor
	});
}, false);