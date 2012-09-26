(function (friends, sourceUrl, synced, settings) {
	var friends = friends.split(','),
		iframeWin;

	window.addEventListener('message', function (e) {
		if (e.origin.indexOf(sourceUrl) > -1) {
			if (e.data.action == 'screen-saver-ready') {
				iframeWin = e.source;
				iframeWin.postMessage({action:'screen-saver-installed', friends:friends, synced:synced, delay:e.data.delay, settings:settings}, '*');
			}

			if (e.data.action == 'screen-saver-sync-to-extension') {
				window.postMessage(e.data, '*');
			}

			if (e.data.action == 'screen-saver-sync-update-to-extension') {
				window.postMessage(e.data, '*');
			}

			if (e.data.action == 'screen-saver-update-settings') {
				window.postMessage(e.data, '*');
			}
		}
	}, false);

})('[@FRIENDS]', '[@SOURCE_URL]', [@SYNCED], [@SETTINGS]);