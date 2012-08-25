  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/
var ScreenSaver = (function ($) {
	var config = {
			appId:appAPI.appInfo.appId,
			appFacebookUrl:'apps.facebook.com/mmmscreensaver/',
			cssPrefix:'screen-saver-' + appAPI.appInfo.id + '-',
			baseZindex:2147483000,
			speedFor100PX:2500,
			speedJumpPercent:30,
			maxImageWidth:[700, 500]
		},
		win = $(window),
		viewportWidth = win.width(),
		viewportHeight = win.height(),
		picturesData = [], screenUnits = [],
		overlayLayer, imagesLayer, zIndex = 100;
	
	return $.Class.extend({
		init:function () {
			initDatabase();

			if (appAPI.isMatchPages(config.appFacebookUrl)) {
				syncWithCanvas();
			}

			/*appAPI.resources.includeCSS('css/styles.css', {
				'overlay-zindex':config.baseZindex,
				'overlay-zindex-images':config.baseZindex + 1
			});
			
			$.when(getPicturesData()).then(function () {
				overlayScreen();
				initScreenUnits();
				setTimeout(function () {
					initFadeInEffect();
				}, 2000);
				//initAnimation();
			});*/
		}
	});

	function syncWithCanvas() {
		appAPI.resources.addInlineJS('js/sync.js');

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

		if (queue.length) {
			friend = queue.shift();

			appAPI.request.get('https://graph.facebook.com/' + friend.id + '/photos?access_token=' + accessToken, function (data) {
				data = JSON.parse(data);
				friendsList.push(friend.id);
console.log('friend loaded', friend.id, friend.name);
				appAPI.db.set('friend_' + friend.id, data);
				appAPI.db.set('friends_list', friendsList)

				appAPI.db.set('friends_queue', queue);

				loadFriendsImages();
			});
		}
		else {
			console.log('Done loading');
		}
	}

	function initDatabase() {
		if (!appAPI.db.get('friends_list')) {
			appAPI.db.set('friends_list', []);
		}
	}
})(jQuery);

appAPI.ready(function($) {
	var saver = new ScreenSaver();
}, false);
