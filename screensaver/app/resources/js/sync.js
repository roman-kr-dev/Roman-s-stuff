(function (friends) {
	var iframeWin, screenSaverReady = false;

	window.addEventListener('message', function (e) {
		if (e.origin.indexOf('fierce-window-3161.herokuapp.com') > -1) {
		//if (e.origin.indexOf('localhost') > -1) {
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