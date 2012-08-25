var FriendsScreenSaver = (function () {
	var config = {
			accessToken:'AAABebL9ZAFs8BAFL2bq1Fc28ZAP7zHcXpfUCaZCvBTInlZC0ZAZB6Dhmh4RNXSHAGhWaQZCpgt4jMfESMY0c5fJ9eri7vOSTBoyHrHEKcWyEQZDZD',
			userId:'775015138',
			initialFriends:40
		},
		thi$, iframeScreenSaver, friendsDialog, friendsList = [], defaultFriendsList = [], imagesById = {}, imagesCache = [], friendsState = 'default';

	return Class.extend({
		init:function () {
			thi$ = this;
			
			$.when(fetchFriendsList()).then(function () {
				initInstallButton();
				initPreviewIframe();
				selectInitalFriends();

				thi$.friendsDialog = new FriendsDialog({
					friends_list:friendsList
				});

				initEvents();
			});
		},

		bindIframeWindow:function (iframe) {
			iframeScreenSaver = iframe;
			iframeScreenSaver.bindMainApp(this);

			thi$.events.fire('iframeReady');
		},

		invite:function (ids) {
			invite(ids);
		},

		skip:function () {
			showInstallWidget();
		},

		requestCallback:function (requestData) {
			if (requestData) {
				showInstallWidget();
			}
		}
	});

	function initEvents() {
		$('#choose-friends').on('click', chooseFriends);

		thi$.events.add('iframeReady', populateFriendsIframe);
		
		thi$.friendsDialog.events.add('friendSelect', addFriendToIframe);
	}

	function fetchFriendsList() {
		var dfd = new $.Deferred();
		
		//$.getJSON('https://graph.facebook.com/' + config.userId + '/friends?access_token=' + config.accessToken + '&fields=id,name,picture', function (json) {
		$.getJSON('http://localhost/roman/screensaver/fb/ajax/friends.php', function (json) {
			$(json.data).each(function (i, friend) {
				imagesById[friend.id] = friend.picture.data.url.replace('_q.jpg', '_n.jpg');

				friendsList.push(friend);
			});

			dfd.resolve();
		});

		return dfd;
	}

	function addFriendToIframe(data) {
		if (friendsState == 'default') {
			iframeScreenSaver.clearAllImages();
		}
		
		console.log(data.selected);
	}

	function fetchUserImages(userId) {
		var dfd = new $.Deferred();
		
		if (imagesCache[userId]) return dfd.resolve(imagesCache[userId]);

		//$.getJSON('https://graph.facebook.com/' + userId + '/photos?access_token=' + config.accessToken, function (json) {
		$.getJSON('http://localhost/roman/screensaver/fb/ajax/images.php', function (json) {
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
		defaultFriendsList = [].concat(friendsList).sort(function () {
			return Math.round(Math.random()) - 0.5; 
		}).slice(0, config.initialFriends);
	}

	function populateFriendsIframe() {
		var friends = defaultFriendsList.slice(0, 10);

		$.each(friends, function (i, friend) {
			$.when(fetchUserImages(friend.id)).then(function (image) {
				iframeScreenSaver.addImage({id:friend.id, url:image});

				imagesCache[friend.id] = {id:friend.id, url:image};
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
		var ids = ids.length ? ids : getSelectedIds(defaultFriendsList);

		ids = ['762152935', '741788813'];

		FB.ui({method: 'apprequests',
			message: 'Requesting your confimation to add you to My Friends screen saver',
			to: ids.join(',')
		}, friendsScreenSaver.requestCallback);
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
})();

var friendsScreenSaver = new FriendsScreenSaver();