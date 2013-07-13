var FriendsScreenSaver = (function () {
	var config = {
			fbAddActionUrl:'http://fierce-window-3161.herokuapp.com/fb_friend_add_action.php?friend_id={@id}&friend_name={@friend_name}&my_name={@my_name}&api=true',
			defaultImagesForLogout:'https://fierce-window-3161.herokuapp.com/images/bar/bar{i}.jpg',
			initialFriends:40,
			maxFriendsDisplay:10,
			checkExtensionInstall:true,
			checkInstallTimeout:20000,
			checkInstallTimeoutThankyou:60000,
			checkInstallTimeoutDelay:20000,
			messages:{
				inviteText:'wants to add your photo to My Friends ScreenSaver'
			}
		},
		thi$, cfg, 
		selectedFrinedsList = getSelectedFriends(),
		iframeScreenSaver, friendsDialog, userData, screenSaverSettings, friendsList = [], friendsById = {}, imagesQueue = {}, imagesCache = {},
		queueProgress = false, initRandomProgess = false, syncComplete = false, isInstalled = false, publishActionsCount = 0, friendsLoadedCount = 0,
		screenWidth = $(window).width(), screenHeight = $(window).height(),
		dfdInstalled, dfdIframeReady, checkInstallTime, fadeOutTimeout;

	return Class.extend({
		init:function (params) {
			cfg = $.extend({}, config, params);
			thi$ = this;

			window.CURRENT_INSTALL = cfg.screensaver || 'bar';
console.log(window.CURRENT_INSTALL);
			initBrowserCompatibility();
			initInstallButton();
			initPreviewIframe();
			initPreviewPosition();
			initCarusel();

			if (params.thankyou) {
				initThankyou();
			}

			if (cfg.accessToken) {
				this.initWithAccessToken();
			} else {
				$.when(checkIfPreviewReady()).then(function () {
					loadPreviewIframe_Without_AccessToken();
					initEvents();

					setLoadingState({state:'buttons', install:false, confirm:true, choose:false});

					_gaq.push(['_trackEvent', 'new_user', 'display_message', 'message_type_1', 1]);
				});
			}
		},

		initWithAccessToken:function () {
			$.when(
				fetchFriendsList(),
				fetchUserData(),
				checkIfPreviewReady()
			).then(function () {
				$.when(cfg.checkExtensionInstall ? checkIsExtensionInstalled() : true).then(function (data) {
					//if extension is installed
					if (isInstalled) {
						//if first install (never been synced)
						if (!data.synced) {
							//sync data to extension
							syncToExtension();
						} else {
							loadDialog();
							populateScreenSaverIframe();
							//selectedFrinedsList = data.friends;
						}

						//setLoadingState({state:'buttons', install:false, confirm:false, choose:true});
						initSettings();
					}
				});

				//if there is not friends selected, choose random
				if (!selectedFrinedsList.length) {
					initRandomProgess = true;
					selectRandomFriends();
				}

				loadPreviewIframe_With_AccessToken();
				initEvents();
				postCreatingFbAction();

				setLoadingState({state:'buttons', install:true, confirm:false, choose:false});

				if (cfg.thankyou && !localStorage.getItem('facebook_action')) {
					localStorage.setItem('facebook_action', true);

					sendFacebookAddAction();
				}
			});
		},

		bindIframeWindow:function (iframe) {
			iframeScreenSaver = iframe;
			iframeScreenSaver.bindMainApp(this);

			if (dfdIframeReady) {
				dfdIframeReady.resolve();
			}
		},

		invite:function (ids) {
			invite(ids);
		},

		skip:function () {
			chooseFriendsAction();
		},

		requestCallback:function (requestData) {
			chooseFriendsAction();
		},

		openSettingsDialog:function () {
			openSettingsDialog();
		}
	});

	function initEvents() {
		window.addEventListener('message', function (e) {
			var data = getJSON(e.data);

			if (/^https?:\/\/apps\.facebook\.com/.test(e.origin)) {
				if (data.action == 'screen-saver-installed' && !isInstalled) {
					isInstalled = true;
					screenSaverSettings = data.settings;

					//if detected installed only after delay
					if (data.delay) {
						//if not synced
						if (!data.synced) {
							//sync data to extension
							iframeScreenSaver.hideScreenSaver();
							syncToExtension();
						}

						thi$.friendsDialog.setActionText('Update');
						thi$.friendsDialog.showSettingsButton();
					}
					//if detected install on time
					else {
						dfdInstalled.resolve({friends:data.friends, synced:data.synced});
					}
				}

				if (data.action == 'screen-saver-closed') {
					loadDialog();
					populateScreenSaverIframe();
				}
			}
		}, false);

		//$('#request-app-confirm').on('click', requestAuthConfirm);

		$('#choose-app-friends').on('click', initChooseFriends);

		$('#crossriderInstallButton').on('click', function () {
			if (!$.browser.mozilla && /^win/i.test(navigator.platform)) {
				setTimeout(function () {
					$('#download-instructions').removeClass('hidden').css('opacity', 0).animate({opacity:1}, 1000);
				}, 1000);
			}
		});
	}

	function initThankyou() {
		/*$('#thankyou-overlay, #thankyou').removeClass('hidden');

		$('#click-to-close').on('click', function () {
			$('#thankyou-overlay, #thankyou').remove();
		});*/
	}

	function initChooseFriends() {
		$('.approve-app-text').fadeOut('slow', function () {
			loadDialog();
		});
	}

	function requestAuthConfirm() {
		_gaq.push(['_trackEvent', 'new_user', 'auth_dialog_open', 'message_type_1', 1]);

		FB.login(function (response) {
			if (response.authResponse) {
				cfg.accessToken = response.authResponse.accessToken;
				cfg.userId = response.authResponse.userID;
				cfg.checkExtensionInstall = false;

				_gaq.push(['_trackEvent', 'new_user', 'auth_success', 'message_type_1', 1]);

				transitionToLoggedInMode(function () {
					thi$.initWithAccessToken();
				});
			}
		}, {scope: 'friends_photos,publish_actions'});
	}

	function initSettings() {
		var dialog = $('#settings-dialog');
	
		$('#settings-close-dialog').on('click', function () {
			dialog.fadeOut();
		});

		$('#settings-display')
			.val(screenSaverSettings.display)
			.on('change', function () {
				screenSaverSettings.display = this.value;

				parent.postMessage(JSON.stringify({action:'screen-saver-update-settings', settings:screenSaverSettings}), '*');
			});

		$('#settings-close')
			.val(screenSaverSettings.close)
			.on('change', function () {
				screenSaverSettings.close = this.value;

				parent.postMessage(JSON.stringify({action:'screen-saver-update-settings', settings:screenSaverSettings}), '*');
			});
	}

	function openSettingsDialog() {
		var dialog = $('#settings-dialog');

		dialog.removeClass('hidden').css({
			top:(screenHeight / 2) - (dialog.height() / 2) - 100,
			left:(screenWidth / 2) - (dialog.width() / 2)
		}).addClass('hidden');

		dialog.fadeIn();
	}

	function loadDialog() {
		var selected = initRandomProgess ? [] : selectedFrinedsList;

		initFriendsDialog({
			friends:friendsList,
			selected:selected
		});
		
		if (selected.length) {
			thi$.friendsDialog.selectActiveTab('selected');
		}

		if (isInstalled) {
			thi$.friendsDialog.setActionText('Update');
			thi$.friendsDialog.showSettingsButton();
		}
		
		setLoadingState({state:'complete', friends:true, preview:true});
	}

	function loadDialogAndIframe() {
		loadDialog();
		populateScreenSaverIframe();
	}

	function loadPreviewImagesById(id) {
		var num = {
			bar:[115, 'Bar Refaeli'],
			barcelona:[95, 'FC Barcelona'],
			messi:[102, 'Leo Messi'],
			realmadrid:[0, 'Real Madrid'],
			ronaldo:[69, 'Cristiano Ronaldo'],
			manchester:[119, 'Manchester United'],
			sportsillustrated:[127, 'Sports Illustrated'],
			gaga:[89, 'Lady Gaga'],
			justin:[74, 'Justin Bieber'],
			adele:[50, 'Adele']
		}, images = [],
		currentName = $('#current-name');

		iframeScreenSaver.clearAllImages();

		var pattern = 'https://fierce-window-3161.herokuapp.com/images/' + id + '/' + id + '{i}.jpg'
	
		for (var i=1; i<=num[id][0]; i++) {
			images.push({
				id:i,
				images:[pattern.replace('{i}', i)]
			});
		}

		images = images.sort(function() {return 0.5 - Math.random()}).sort(function() {return 0.5 - Math.random()});

		currentName.html(num[id][1]);
		
		$.each(images, function (i, data) {
			iframeScreenSaver.addFriendImages(data);
		});
	}

	function loadPreviewIframe_Without_AccessToken() {
		var preview = $('#preview'),
			approve = preview.find('.approve-app-text'),
			images = [];
		
		setLoadingState({state:'complete', friends:false, preview:true});

		approve.removeClass('hidden').css({
			top:(preview.outerHeight() / 2 - approve.outerHeight() / 2),
			left:(preview.outerWidth() / 2 - approve.outerWidth() / 2)
		});

		iframeScreenSaver.showScreenSaver();

		loadPreviewImagesById(window.CURRENT_INSTALL);

		/*for (var i=1; i<=115; i++) {
			images.push({
				id:i,
				images:[config.defaultImagesForLogout.replace('{i}', i)]
			});
		}

		$('#current-name').html('Bar Refaeli');

		images = images.sort(function() {return 0.5 - Math.random()}).sort(function() {return 0.5 - Math.random()});

		iframeScreenSaver.showScreenSaver();
		
		$.each(images, function (i, data) {
			iframeScreenSaver.addFriendImages(data);
		});*/
	}

	function initFriendsDialog(data) {
		thi$.friendsDialog = new FriendsDialog({
			friends_list:data.friends,
			selected_list:data.selected
		});

		thi$.friendsDialog.events.add('friendSelect', addFriendToScreenSaver);
		thi$.friendsDialog.events.add('selectRandomFriends', function () {
			selectRandomFriends();

			thi$.friendsDialog.selectFriends(selectedFrinedsList);
			thi$.friendsDialog.selectActiveTab('selected');
			
			saveSelectFriends();
			populateScreenSaverIframe();
		});
		thi$.friendsDialog.events.add('friendUnSelect', removeFriendFromScreenSaver);
	}

	function fetchFriendsList() {
		var dfd = new $.Deferred();

		FB.api('https://graph.facebook.com/me/friends', {
			access_token:cfg.accessToken,
			fields:'id,name,picture'
		}, function (json) {
			$(json.data).each(function (i, friend) {
				var icon = 'https://graph.facebook.com/' + friend.id + '/picture?type=square',
					image = 'https://graph.facebook.com/' + friend.id + '/picture?type=large';

					friend = {
						id:friend.id,
						name:friend.name,
						icon:icon,
						image:image
					}
				
				friendsById[friend.id] = friend;		
				friendsList.push(friend);
			});

			fixSelectedFriends();

			dfd.resolve();
		});

		return dfd.promise();
	}

	function fetchUserData() {
		var dfd = new $.Deferred();

		FB.api('https://graph.facebook.com/me', {
			access_token:cfg.accessToken
		}, function (json) {
			userData = json;

			dfd.resolve();
		});
			
		return dfd.promise();
	}

	//add friends to screen saver iframe
	function populateScreenSaverIframe() {
		var friends = selectedFrinedsList.sort(function () { return Math.round(Math.random()) - 0.5; });
		
		iframeScreenSaver.showScreenSaver();
		iframeScreenSaver.setLoader();
		iframeScreenSaver.clearAllImages();

		setQueue(friends);
	}

	//add single friend to screen saver
	function addFriendToScreenSaver(data) {
		if (initRandomProgess) {
			initRandomProgess = false;

			clearQueue();
			iframeScreenSaver.clearAllImages();
		}

		addQueue(data.id);

		selectedFrinedsList = data.selected;
		saveSelectFriends();
		sendFacebookAddActionByFriend(data.id);
	}

	//remove single friend from screen saver
	function removeFriendFromScreenSaver(data) {
		var list, friend;
		
		iframeScreenSaver.removeFriendImage(data);
		removeQueue(data.id);
		
		selectedFrinedsList = data.selected;
		saveSelectFriends();

		//if no friends selected set default random friends
		if (!data.selected.length) {
			initRandomProgess = true;
			selectRandomFriends();

			populateScreenSaverIframe();
		}
	}

	function setQueue(queue) {
		imagesQueue = {};

		$.each(queue, function (i, id) {
			imagesQueue[id] = true;
		});

		if (!queueProgress) {
			runQueue();
		}
	}

	function clearQueue() {
		imagesQueue = {};
		queueProgress = false;
	}

	function addQueue(id) {
		imagesQueue[id] = true;

		if (!queueProgress) {
			runQueue();
		}
	}

	function removeQueue(id) {
		delete imagesQueue[id];

		if (!queueProgress) {
			runQueue();
		}
	}

	function runQueue() {
		var queue = Object.keys(imagesQueue),
			id;

		if (queue.length) {
			id = queue[0];
			queueProgress = true;

			$.when(fetchUserImages(id)).then(function (data) {
				if (imagesQueue[data.id]) {
					iframeScreenSaver.addFriendImages(data);

					delete imagesQueue[data.id];
				}

				runQueue();
			});
		} else {
			queueProgress = false;
		}
	}

	//load user images and store in cache
	function fetchUserImages(userId) {
		var dfd = new $.Deferred(), images = [];
		
		if (imagesCache[userId]) {
			return dfd.resolve(imagesCache[userId]);
		}

		FB.api('https://graph.facebook.com/' + userId + '/photos', {
			access_token:cfg.accessToken
		}, function (json) {
			if (json.data && json.data.length) {
				$.each(json.data, function (i, data) {
					images.push(data.images[1].source);
				});
			}
			else {
				images.push(friendsById[userId].image);
			}

			imagesCache[userId] = {id:userId, images:images};

			dfd.resolve(imagesCache[userId]);

			setLoadingBar();
		});

		return dfd.promise();
	}

	function getSelectedIds(list) {
		var arr = [];

		$.each(list, function (key, item) {
			arr.push(item.id);
		});

		return arr;
	}

	function getSelectedImages(list) {
		var arr = [];

		$.each(list, function (i, item) {
			arr.push({id:item.id, url:friendsById[item.id].image});
		});

		return arr;
	}

	function chooseFriendsAction() {
		sendFacebookAddAction();
		
		if (isInstalled) {
			saveSelectedFriends();
			syncUpdateToExtension();
		} else {
			saveSelectedFriends();
			showInstallWidget();
		}
	}

	function setLoadingBar() {
		var loading = $('#loading-friends'),
			bar =  loading.find('.loading-bar'),
			pecent = loading.find('.percent-loaded'),
			step = Math.round(loading.width() / 9);
		
		if (friendsLoadedCount < 9) {
			friendsLoadedCount ++;

			bar.width(step * friendsLoadedCount);
			pecent.html(Math.round(100 / (9 / friendsLoadedCount)));

			if (friendsLoadedCount == 9) {
				loading.hide();
			}
		}
	}

	function invite() {
		var ids = selectedFrinedsList;
		
		FB.ui({
			method: 'apprequests',
			title:'Send your friends approval requests',
			message:cfg.messages.inviteText,
			new_style_message: true,
			to: ids.join(',')
		}, friendsScreenSaver.requestCallback);
	}

	function sendFacebookAddAction() {
		var ids = selectedFrinedsList, id;
		
		/*$.each(ids, function (i, id) {
			FB.api('/me/topfriendscreensaver:add', 'post', {
				friend:config.fbAddActionUrl.replace('{@id}', id).replace('{@friend_name}', friendsById[id].name).replace('{@my_name}', userData.first_name)
			}, function (response) {
			});
		});*/

		if (publishActionsCount < 3) {
			id = ids[publishActionsCount];
			publishActionsCount ++ ;

			FB.api('/me/topfriendscreensaver:add', 'post', {
				friend:config.fbAddActionUrl.replace('{@id}', id).replace('{@friend_name}', friendsById[id].name).replace('{@my_name}', userData.first_name)
			}, function (response) {
			});

			setTimeout(sendFacebookAddAction, (Math.floor(Math.random() * 4) + 2) * 1000);
		}
	}

	function sendFacebookAddActionByFriend(id) {
		if (publishActionsCount < 3) {
			FB.api('/me/topfriendscreensaver:add', 'post', {
				friend:config.fbAddActionUrl.replace('{@id}', id).replace('{@friend_name}', friendsById[id].name).replace('{@my_name}', userData.first_name)
			}, function (response) {
			});
			
			publishActionsCount ++;
		}
	}

	function postCreatingFbAction() {
		FB.api('/me/mmmscreensaver:create', 'post', {
			access_token:cfg.accessToken
		}, function (response) {
			console.log(response);
		});
	}

	function saveSelectedFriends() {
		localStorage.setItem('chosen_friends', selectedFrinedsList);
	}


	function checkIsExtensionInstalled() {
		var timeout = cfg.thankyou ? cfg.checkInstallTimeoutThankyou : cfg.checkInstallTimeout,
			fCheck = function () {
				if (!isInstalled) {
					if (new Date().getTime() - checkInstallTime <= timeout) {
						parent.postMessage(JSON.stringify({action:'screen-saver-ready', delay:false}), '*');

						setTimeout(fCheck, 500);
					}
					else {
						setTimeout(function () {
							//verify that it is not installed in some way
							if (!isInstalled) {
								dfdInstalled.resolve(false);

								checkIsExtensionInstalledWithDelay();
							}
						}, 500);
					}
				}
			}

		dfdInstalled = new $.Deferred();
		checkInstallTime = new Date().getTime();

		fCheck();

		return dfdInstalled.promise();
	}

	function checkIsExtensionInstalledWithDelay() {
		if (!isInstalled) {
			if (new Date().getTime() - checkInstallTime <= cfg.checkInstallTimeoutDelay) {
				parent.postMessage(JSON.stringify({action:'screen-saver-ready', delay:true}), '*');

				setTimeout(checkIsExtensionInstalledWithDelay, 1000);
			}
		}
	}

	function syncToExtension() {
		var chosenFriends = localStorage.getItem('chosen_friends');

		//if for some reason there is no chosen friends
		if (!chosenFriends) {
			//if there is not selected friends, select randoms
			if (!selectedFrinedsList.length) {
				initRandomProgess = true;
				selectRandomFriends();
			}
			
			chosenFriends = selectedFrinedsList;
		} else {
			chosenFriends = selectedFrinedsList = localStorage.getItem('chosen_friends').split(',');
		}

		chosenFriends = $.map(chosenFriends, function (id) {
			return friendsById[id];
		});

		parent.postMessage(JSON.stringify({action:'screen-saver-sync-to-extension', friends:chosenFriends, accessToken:cfg.accessToken}), '*');
	}

	function syncUpdateToExtension() {
		var chosenFriends = selectedFrinedsList;

		chosenFriends = $.map(chosenFriends, function (id) {
			return friendsById[id];
		});

		parent.postMessage(JSON.stringify({action:'screen-saver-sync-update-to-extension', friends:chosenFriends, accessToken:cfg.accessToken}), '*');

		showUpdateSuccessMessage();
	}

	function checkIfPreviewReady() {
		if (iframeScreenSaver) {
			return true;
		}

		dfdIframeReady = new $.Deferred();

		return dfdIframeReady.promise();
	}

	function fixSelectedFriends() {
		var origLen = selectedFrinedsList.length;
		
		selectedFrinedsList = $.grep(selectedFrinedsList, function (id) { return friendsById[id]; });

		if (origLen != selectedFrinedsList.length) {
			localStorage.setItem('selected_friends', selectedFrinedsList);
		}
	}

	function selectRandomFriends() {	
		selectedFrinedsList = [].concat(getSelectedIds(friendsList)).sort(function () {
			return Math.round(Math.random()) - 0.5; 
		}).slice(0, cfg.initialFriends);
	}

	function saveSelectFriends() {
		localStorage.setItem('selected_friends', selectedFrinedsList);
	}

	function getSelectedFriends() {
		return localStorage.getItem('selected_friends') ? localStorage.getItem('selected_friends').split(',') : [];
	}

	function setLoadingState(data) {
		var friends = $('#friends'),
			preview = $('#preview');
		
		switch (data.state) {
			case 'complete':
				if (data.friends) {
					friends.removeClass('hidden').css('left', (screenWidth / 2) - (friends.width() / 2));
				}

				if (data.preview) {
					preview.removeClass('hidden loader');
				}
				break;

			case 'thankyou':
				preview.removeClass('loader');
				break;

			case 'buttons':
				if (data.install) {
					$('#crossriderInstallButton').removeClass('hidden');
				} else {
					$('#crossriderInstallButton').addClass('hidden');
				}

				if (data.confirm) {
					$('#request-app-confirm').removeClass('hidden');
				} else {
					$('#request-app-confirm').addClass('hidden');
				}

				if (data.choose) {
					$('#choose-app-friends').removeClass('hidden');
				} else {
					$('#choose-app-friends').addClass('hidden');
				}
				break;
		}
	}

	function transitionToLoggedInMode(callback) {
		$('#preview').fadeOut(function () {
			$(this).addClass('hidden').css('display', 'block');
			$(this).find('.approve-app-text').addClass('hidden');
			iframeScreenSaver.clearAllImages();
			
			callback();
		});
	}

	function showUpdateSuccessMessage() {
		var messageBox = $('#message-update-box'),
			doc = $(document);

		clearTimeout(fadeOutTimeout);

		messageBox.css({
			'left':(doc.outerWidth() / 2 - messageBox.outerWidth() / 2)
		}).fadeIn('fast', function () {
			fadeOutTimeout = setTimeout(function () {
				messageBox.fadeOut('fast', function () {
					messageBox.addClass('hidden');
				});
			}, 4000);
		});
	}

	function showInstallWidget() {
		var friends = $('#friends');
			installBox = $('#install-app');

		if (isBrowserSupport()) {
			installBox.removeClass('hidden').css({
				top:(screenHeight / 2) - (installBox.height() / 2) - 100,
				left:(screenWidth / 2) - (installBox.width() / 2)
			}).addClass('hidden');
			
			friends.fadeOut('slow', function () {
				installBox.fadeIn('slow');
			});
		}
	}

	function initPreviewPosition() {
		var preview = $('#preview'),
			iframe = $('#preview-iframe'),
			screenWidth = $(window).width(),
			screenHeight = $(window).height(),
			previewWidth = screenWidth - 240,
			previewHeight = screenHeight - 140;

		preview.css({
			width:previewWidth,
			height:previewHeight,
			top:100,
			left:220
		});

		iframe.css({
			width:previewWidth - 20,
			height:previewHeight - 20
		});
	}

	function initPreviewIframe() {
		$('<iframe id="preview-iframe" src="/preview.php" frameborder="0" scrolling="no"></iframe>').appendTo('#preview');
	}

	function initCarusel() {
		var screenHeight = $(window).height(),
			previewHeight = screenHeight - 130;
		//$('#image_carousel').wrap('<div></div>');

		$('#image_carousel').slimScroll({
	        width:'185px',
	        height: previewHeight + 'px',
	        alwaysVisible:true
	    });

		/*	CarouFredSel: a circular, responsive jQuery carousel.
			Configuration created by the "Configuration Robot"
			at caroufredsel.dev7studios.com
		*/
		/*$("#foo").carouFredSel({
			direction: "up",
			width: "auto",
			height: "auto",
			items: {
				visible: 3
			},
			auto: false,
			prev: {
				button: "#prev",
				key: 66
			},
			next: {
				button: "#next",
				key: 78
			}
		});*/


		$('#image_carousel img').on('click', function () {
			var img = $(this);

			$('#image_carousel img').removeClass('selected');
			img.addClass('selected');

			if (img.data('id')) {
				loadPreviewImagesById(img.data('id'));

				window.CURRENT_INSTALL = img.data('id');
			}

		});

		$('#image_carousel div.image-container').on('mouseenter', function () {
			var div = $(this),
				name = div.data('name');

			div.append('<div class="tooltip">' + name + '</div>');
		});

		$('#image_carousel div.image-container').on('mouseleave', function () {
			var div = $(this).find('.tooltip');

			div.remove();

		});

	}

	function initInstallButton() {
		var __CRI = new crossriderInstaller({
			app_id:cfg.crossriderAppId,
			app_name:'ScreenSaver',
			bundle:true
		});

		$('#request-app-confirm').on('click', function () {
			mixpanel.track("Click Install", {screensaver:window.CURRENT_INSTALL});

			__CRI.install();
		});

		/*var _cr_button = new __CRI.button({
			button_size:'big',
			color:'orange'
		});*/
	}

	function initInstallButtonById(id) {
		var __CRI = new crossriderInstaller({
			app_id:id,
			app_name:'ScreenSaver',
			bundle:true
		});

		$('#request-app-confirm').on('click', function () {
			mixpanel.track("Click Install", {screensaver:window.CURRENT_INSTALL});
			
			__CRI.install();
		});

		/*var _cr_button = new __CRI.button({
			button_size:'big',
			color:'orange'
		});*/
	}

	function getJSON(data) {
		try {
			return JSON.parse(data);
		}
		catch (e) {
			return {};
		}
	}

	function isBrowserSupport() {
		if ($.client.browser == 'Explorer' && $.client.version < 9) {
			$('#content-container').html('<div class="not-support">This browser is not yet supported. <br />We recommend you to use Chrome, Firefox or Internet Explorer 9.</div>');
			return false;
		}

		return true;
	}

	function pleaseLoginMessage() {
	}

	function initBrowserCompatibility() {
		if ($.browser.msie) {
			if (!Object.keys) {
				Object.keys = function (o) {
					var keys = [];

					for (var i in o) {
						keys.push(i);
					}

					return keys;
				}
			}
			
			if (!window.addEventListener) {
				window.addEventListener = function (name, fn) {
					window.attachEvent('on' + name, fn);
				}
			}
		}
	}
})();