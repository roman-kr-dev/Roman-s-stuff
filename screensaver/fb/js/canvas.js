var FriendsScreenSaver = (function () {
	var config = {
			fbAddActionUrl:'http://fierce-window-3161.herokuapp.com/fb_action.php?friend_id={@id}&friend_name={@friend_name}&my_name={@my_name}&api=true',
			defaultImagesForLogout:'https://fierce-window-3161.herokuapp.com/images/photos/{i}.jpeg',
			initialFriends:40,
			maxFriendsDisplay:10,
			checkExtensionInstall:true,
			checkInstallTimeout:4000,
			checkInstallTimeoutThankyou:60000,
			checkInstallTimeoutDelay:20000,
			messages:{
				inviteText:'wants to add your photo to My Friends ScreenSaver'
			},
			ABTesting:{
				confirmApp:null
			}
		},
		thi$, cfg, 
		selectedFrinedsList = getSelectedFriends(),
		iframeScreenSaver, friendsDialog, userData, screenSaverSettings, friendsList = [], friendsById = {}, imagesQueue = {}, imagesCache = {},
		queueProgress = false, initRandomProgess = false, syncComplete = false, isInstalled = false, 
		dfdInstalled, dfdIframeReady, checkInstallTime, fadeOutTimeout;

	return Class.extend({
		init:function (params) {
			cfg = $.extend({}, config, params);
			thi$ = this;

			initBrowserCompatibility();
			initInstallButton();
			initPreviewIframe();

			if (cfg.accessToken) {
				console.log('initWithAccessToken');
				this.initWithAccessToken();
			} else {
				console.log('Not access token');
				$.when(checkIfPreviewReady()).then(function () {
					cfg.ABTesting.confirmApp = Math.floor(Math.random() * 2) + 1;
					
					loadIframe();
					initEvents();

					_gaq.push(['_trackEvent', 'new_user', 'display_message', 'message_type_' + cfg.ABTesting.confirmApp, 1]);
				});
			}
		},

		initWithAccessToken:function () {
			$.when(
				fetchFriendsList(),
				fetchUserData()
			).then(function () {
				$.when(cfg.checkExtensionInstall ? checkIsExtensionInstalled() : true).then(function (data) {
					$.when(checkIfPreviewReady()).then(function () {
						//if extension is installed
						if (isInstalled) {
							//if first install (never been synced)
							if (!data.synced) {
								//sync data to extension
								syncToExtension();

								//init friends dialog and screen saver iframe
								loadDialogAndIframe();
							} else {
								selectedFrinedsList = data.friends;

								//init friends dialog and screen saver iframe
								loadDialogAndIframe();
							}

							initSettings();
						}
						//if extension is not installed
						else {
							initFriendsDialog({
								friends:friendsList,
								selected:selectedFrinedsList
							});
							
							setLoadingState({state:'complete', friends:true, preview:true});

							//if there is not friends selected, choose random
							if (!selectedFrinedsList.length) {
								initRandomProgess = true;
								selectRandomFriends();
							} else {
								thi$.friendsDialog.selectActiveTab('selected');
							}

							populateScreenSaverIframe();
						}
					});
				});

				initEvents();
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
			if (requestData) {
				chooseFriendsAction();
			}
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
			}
		}, false);

		$('#preview .approve-app').on('click', requestAuthConfirm);
	}

	function requestAuthConfirm() {
		_gaq.push(['_trackEvent', 'new_user', 'auth_dialog_open', 'message_type_' + cfg.ABTesting.confirmApp, 1]);

		FB.login(function (response) {
			if (response.authResponse) {
				cfg.accessToken = response.authResponse.accessToken;
				cfg.userId = response.authResponse.userID;
				cfg.checkExtensionInstall = false;

				_gaq.push(['_trackEvent', 'new_user', 'auth_success', 'message_type_' + cfg.ABTesting.confirmApp, 1]);

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

		dialog.fadeIn();
	}

	function loadDialogAndIframe() {
		initFriendsDialog({
			friends:friendsList,
			selected:selectedFrinedsList
		});
		
		thi$.friendsDialog.selectActiveTab('selected');

		if (isInstalled) {
			thi$.friendsDialog.setActionText('Update');
			thi$.friendsDialog.showSettingsButton();
		}
		
		setLoadingState({state:'complete', friends:true, preview:true});

		populateScreenSaverIframe();
	}

	function loadIframe() {
		setLoadingState({state:'complete', friends:false, preview:true});

		$('#preview').find('.title').addClass('hidden');
		//$('#preview').find('.approve-app-text-' + cfg.ABTesting.confirmApp).removeClass('hidden');

		for (var i=1; i<=1; i++) {
			iframeScreenSaver.addImage({
				id:i,
				url:config.defaultImagesForLogout.replace('{i}', i)
			});
		}
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
	}

	//remove single friend from screen saver
	function removeFriendFromScreenSaver(data) {
		var list, friend;
		
		iframeScreenSaver.removeImage(data);
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
			activeImages = Object.keys(iframeScreenSaver.getActiveImages()), 
			id;

		if (queue.length && activeImages.length < config.maxFriendsDisplay) {
			id = queue[0];
			queueProgress = true;

			$.when(fetchUserImages(id)).then(function (data) {
				if (imagesQueue[data.id]) {
					iframeScreenSaver.addImage(data);

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
		var dfd = new $.Deferred(), image;
		
		if (imagesCache[userId]) {
			return dfd.resolve(imagesCache[userId]);
		}

		FB.api('https://graph.facebook.com/' + userId + '/photos', {
			access_token:cfg.accessToken
		}, function (json) {
			if (json.data && json.data.length) {
				image = json.data[Math.floor(Math.random() * json.data.length)].images[1].source;
			}
			else {
				image = friendsById[userId].image;
			}

			imagesCache[userId] = {id:userId, url:image};

			dfd.resolve(imagesCache[userId]);
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
		var ids = selectedFrinedsList,
			id = ids[0];
		
		/*$.each(ids, function (i, id) {
			FB.api('/me/topfriendscreensaver:add', 'post', {
				friend:config.fbAddActionUrl.replace('{@id}', id).replace('{@friend_name}', friendsById[id].name).replace('{@my_name}', userData.first_name)
			}, function (response) {
			});
		});*/

		FB.api('/me/topfriendscreensaver:add', 'post', {
			friend:config.fbAddActionUrl.replace('{@id}', id).replace('{@friend_name}', friendsById[id].name).replace('{@my_name}', userData.first_name)
		}, function (response) {
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
		var container = $('#content-container'),
			content = $('#content'),
			friends = $('#friends'),
			preview = $('#preview');
		
		switch (data.state) {
			case 'complete':
				container.removeClass('loader');
				content.removeClass('hidden');

				if (data.friends) friends.removeClass('hidden');
				if (data.preview) preview.removeClass('hidden');

				iframeScreenSaver.initScreenSaver();
				break;
		}
	}

	function transitionToLoggedInMode(callback) {
		$('#preview').fadeOut(function () {
			$(this).addClass('hidden').css('display', 'block');
			$(this).find('.approve-app-text-' + cfg.ABTesting.confirmApp).addClass('hidden');
			$(this).find('.title').removeClass('hidden');
			
			callback();
		});
		$('#content-container').addClass('loader');
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
		if (isBrowserSupport()) {
			$('#friends').fadeOut('slow', function () {
				$('#crossriderInstallButton').fadeIn('slow');
			});
		}
	}

	function initPreviewIframe() {
		$('<iframe src="preview.php" frameborder="0" scrolling="no"></iframe>').appendTo('#preview');
	}

	function initInstallButton() {
		var __CRI = new crossriderInstaller({
			app_id:cfg.crossriderAppId,
			app_name:'ScreenSaver',
			bundle:true
		});

		var _cr_button = new __CRI.button({
			button_size:'big',
			color:'green'
		});
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