(function (friends, sourceUrl, synced, settings) {
	var friends = friends.split(','),
		iframeWin;

	window.addEventListener('message', function (e) {
		var data = JSON.parse(e.data);

		if (e.origin.indexOf(sourceUrl) > -1) {
			if (data.action == 'screen-saver-ready') {
				iframeWin = e.source;
				iframeWin.postMessage(JSON.stringify({action:'screen-saver-installed', friends:friends, synced:synced, delay:data.delay, settings:settings}), '*');
			}

			if (data.action == 'screen-saver-sync-to-extension') {
				window.postMessage(e.data, '*');
			}

			if (data.action == 'screen-saver-sync-update-to-extension') {
				window.postMessage(e.data, '*');
			}

			if (data.action == 'screen-saver-update-settings') {
				window.postMessage(e.data, '*');
			}
		}
	}, false);

})('[@FRIENDS]', '[@SOURCE_URL]', [@SYNCED], [@SETTINGS]);