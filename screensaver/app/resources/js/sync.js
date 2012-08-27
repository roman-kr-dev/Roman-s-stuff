(function (friends) {
	var iframeWin, screenSaverReady = false;

	window.addEventListener('message', function (e) {
		if (e.origin == 'http://localhost') {
			if (e.data.action == 'screen-saver-ready') {
				iframeWin = e.source;
				iframeWin.postMessage({action:'screen-saver-installed', friends:friends ? friends.split(',') : ''}, '*');
			}

			if (e.data.action == 'screen-saver-sync') {
				iframeWin.postMessage({action:'screen-saver-sync-complete'}, '*');

				window.postMessage(e.data, '*');
			}
		}
	}, false);

})('[@FRIENDS]');