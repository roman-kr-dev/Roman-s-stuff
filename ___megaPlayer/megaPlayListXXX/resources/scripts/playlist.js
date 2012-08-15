MegaPlayListXXX.PlayList = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.PlayList,
		songManager, actionsRouter, playerIframe;

	return Class.extend({
		init:function () {
			songManager = new MegaPlayListXXX.SongManager.Manager();
			actionsRouter = new MegaPlayListXXX.ActionsRouter();

			initEvents();
			initPlaylistIframe();
		}
	});

	function initEvents() {
		window.addEventListener('message', function(e){
			if (e.origin !== config.iframePlayerBaseUrl && config.messageRegExp.test(e.data.action)) {
				actionsRouter.route(RegExp.$1, e);
			}
		}, false);
	}

	function initPlaylistIframe() {
		playerIframe = $('<iframe id="' + config.iframePlayerId + '" src="' + config.iframePlayerUrl + '" class="' + baseCSS + 'player-iframe' + '" />').appendTo('body');
	}
})(jQuery);