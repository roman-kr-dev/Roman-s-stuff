MegaPlayListXXX.ActionsRouter = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.ActionsRouter;

	return Class.extend({
		route:function (action, e) {
			switch (action) {
				case 'player.stop':
					postToBackground(action);
					break;

				case 'request.playlist':
					postToIframe('response.playlist', [
						{
							id: 1,
							name: "Romania",
							created: new Date(2012,6,21),
							songs: // thumbnail property is not required
							[	
								{id: 500, playListId: 1, name: "CRBL feat. Helen - KBoom (Radio Edit)", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=0Sy3J7O5bxM"}}},
								{id: 501, playListId: 1, name: "BALADA BOA GUSTTAVO LIMA NOVO DVD", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=5NNi4JIwsCo&feature=related"}}},
								{id: 502, playListId: 1, name: "Euphoria", source: {type: "youtube", model: {href: "http://www.youtube.com/watch?v=t5qURKt4maw"}}},
							],
							hasSongs: true
						}
					]);
					break;
			}
		}
	});

	function postToBackground(action) {
		appAPI.message.toBackground({
			action:action
		});
	}

	function postToIframe(action, data) {
		window.postMessage({action:'MegaPlayListXXX.' + action, data:data}, '*');
	}
})(jQuery);