var FriendsScreenSaver = (function () {
	var config = {
			initialFriends:40,
			maxFriendsDisplay:10,
			checkInstallTimeout:3000,
			checkInstallTimeoutDelay:20000,
			inviteText:'I want to add your photo to My Friends ScreenSaver'
		},
		thi$, iframeScreenSaver, friendsDialog, friendsList = [], defaultFriendsList,
		selectedFrinedsList = [], imagesById = {}, friendsById = {}, imagesCache = [], friendsState = 'default',
		syncComplete = false, isInstalled = false, dfdInstalled, dfdIframeReady, checkInstallTime;

	return Class.extend({
		init:function (cfg) {
			thi$ = this;

			config.accessToken = cfg.accessToken;
			config.userId = cfg.userId;
			
			$.when(fetchFriendsList()).then(function () {
				initInstallButton();
				initPreviewIframe();

				thi$.friendsDialog = new FriendsDialog({
					friends_list:friendsList
				});

				initEvents();

				$.when(checkIsExtensionInstalled()).then(function () {
					console.log('app installed done checking', isInstalled);
					$.when(checkIfPreviewReady()).then(function () {
						console.log('iframe ready');
						selectInitalFriends();
						populateFriendsIframe();
						syncWithExtension();
					});
				});
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
			storeCookieData();
			showInstallWidget();
		},

		requestCallback:function (requestData) {
			console.log(requestData)
			if (requestData) {
				storeCookieData();
				showInstallWidget();
			}
		}
	});

	function initEvents() {
		$('#choose-friends').on('click', chooseFriends);
		
		thi$.friendsDialog.events.add('friendSelect', addFriendToIframe);

		window.addEventListener('message', function (e) {
			if (e.origin.indexOf('https://apps.facebook.com') > -1) {
				if (e.data.action == 'screen-saver-sync-complete' && !syncComplete) {
					$.cookie('store_friends', null, { path: '/' });

					syncComplete = true;
				}

				if (e.data.action == 'screen-saver-installed' && !isInstalled) {
					isInstalled = true;

					defaultFriendsList = e.data.friends;
					thi$.friendsDialog.selectFriends(defaultFriendsList);

					dfdInstalled.resolve(true);
					console.log('big banana', e.data.friends);
				}
			}
		}, false);
	}

	function fetchFriendsList() {
		var dfd = new $.Deferred();
		
		$.getJSON('https://graph.facebook.com/' + config.userId + '/friends?access_token=' + config.accessToken + '&fields=id,name,picture', function (json) {
		//$.getJSON('http://localhost/roman/screensaver/fb/ajax/friends.php', function (json) {
			$(json.data).each(function (i, friend) {
				//var image = friend.picture.data.url.replace('_q.jpg', '_n.jpg'),
				var image = friend.picture.replace('_q.jpg', '_n.jpg'),
					friend = {
						id:friend.id,
						name:friend.name,
						icon:friend.picture,
						image:image
					}
				
				imagesById[friend.id] = image;
				friendsById[friend.id] = friend;
			
				friendsList.push(friend);
			});

			dfd.resolve();
		});

		return dfd;
	}

	function addFriendToIframe(data) {
		if (friendsState == 'default') {
			iframeScreenSaver.clearAllImages();

			friendsState = 'user';
		}
		
		if (data.selected.length <= config.maxFriendsDisplay) {
			$.when(fetchUserImages(data.id)).then(function (image) {
				iframeScreenSaver.addImage({id:data.id, url:image});

				imagesCache[data.id] = {id:data.id, url:image};
			});
		}

		selectedFrinedsList = data.selected;
	}

	function fetchUserImages(userId) {
		var dfd = new $.Deferred();
		
		if (imagesCache[userId]) return dfd.resolve(imagesCache[userId]);

		$.getJSON('https://graph.facebook.com/' + userId + '/photos?access_token=' + config.accessToken, function (json) {
		//$.getJSON('http://localhost/roman/screensaver/fb/ajax/images.php', function (json) {
			if (json.data.length) {
				dfd.resolve(json.data[Math.floor(Math.random() * json.data.length)].images[1].source);
			}
			else {
				dfd.resolve(imagesById[userId]);
			}
		});

		return dfd.promise();
	}

	function chooseFriends() {
		FB.ui({method: 'apprequests',
		message: 'My Great Request',
	  }, requestCallback);
	}

	function selectInitalFriends() {	
		defaultFriendsList = (defaultFriendsList || [].concat(getSelectedIds(friendsList))).sort(function () {
			return Math.round(Math.random()) - 0.5; 
		}).slice(0, config.initialFriends);
	}

	function populateFriendsIframe() {
		var friends = defaultFriendsList.slice(0, config.maxFriendsDisplay);

		$.each(friends, function (i, id) {
			$.when(fetchUserImages(id)).then(function (image) {
				iframeScreenSaver.addImage({id:id, url:image});

				imagesCache[id] = {id:id, url:image};
			});
		});
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
			arr.push({id:item.id, url:imagesById[item.id]});
		});

		return arr;
	}

	function invite(ids) {
		var ids = ids.length ? ids : defaultFriendsList;
console.log('ginat', ids);
		ids = ['762152935', '741788813'];
		
		FB.ui({method: 'apprequests',
			message:config.inviteText,
			to: ids.join(',')
		}, friendsScreenSaver.requestCallback);
	}

	function storeCookieData() {
		var friends = selectedFrinedsList.length ? selectedFrinedsList : defaultFriendsList;

		$.cookie('store_friends', friends.join(','), { expires: 365, path: '/' });
	}

	function showInstallWidget() {
		$('#friends').fadeOut('slow', function () {
			$('#crossriderInstallButton').fadeIn('slow');
		});
	}

	function initPreviewIframe() {
		$('<iframe src="preview.html" frameborder="0" scrolling="no"></iframe>').appendTo('#preview');
	}

	function initInstallButton() {
		var __CRI = new crossriderInstaller({
			app_id:13460,
			app_name:'ScreenSaver'
		});

		var _cr_button = new __CRI.button({
			button_size:'big',
			color:'green'
		});
	}

	function checkIsExtensionInstalled() {
		var fCheck = function () {
			if (!isInstalled) {
				if (new Date().getTime() - checkInstallTime <= config.checkInstallTimeout) {
					parent.postMessage({action:'screen-saver-ready'}, '*');
console.log('check is install');
					setTimeout(fCheck, 200);
				}
				else {
console.log('not installed');
					dfdInstalled.resolve(false);

					checkIsExtensionInstalledWithDelay();
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
			if (new Date().getTime() - checkInstallTime <= config.checkInstallTimeoutDelay) {
				parent.postMessage({action:'screen-saver-ready'}, '*');
console.log('check is install after delay');
				setTimeout(checkIsExtensionInstalledWithDelay, 1000);
			}
			else {
console.log('not installed even after delay');
			}
		}
	}

	function syncWithExtension() {
		var storeFriends = $.cookie('store_friends');

		if (storeFriends && !syncComplete) {console.log('Start Synking');
			storeFriends = $.map(storeFriends.split(','), function (id) {
				return friendsById[id * 1] || null;
			});

			parent.postMessage({action:'screen-saver-sync', friends:storeFriends, accessToken:config.accessToken}, '*');
		}
	}

	function checkIfPreviewReady() {
		if (iframeScreenSaver) {
			return true;
		}

		dfdIframeReady = new $.Deferred();

		return dfdIframeReady.promise();
	}
})();