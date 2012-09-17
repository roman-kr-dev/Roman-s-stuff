(function (friends, sourceUrl) {
	var friends = friends.split(','),
		iframeWin;

	window.addEventListener('message', function (e) {
		if (e.origin.indexOf(sourceUrl) > -1) {
			if (e.data.action == 'screen-saver-ready') {
				iframeWin = e.source;
				iframeWin.postMessage({action:'screen-saver-installed', friends:friends ?  : ''}, '*');
			}

			/*if (e.data.action == 'screen-saver-sync') {
				iframeWin.postMessage({action:'screen-saver-sync-complete'}, '*');

				window.postMessage(e.data, '*');
			}*/
		}
	}, false);

})('[@FRIENDS]', '[@SOURCE_URL]');