(function (friends) {
	var iframeWin = document.getElementById('iframe_canvas').contentWindow;

	iframeWin.postMessage({action:'screen-saver-installed', friends:friends ? friends.split(',') : ''}, '*');

	/*window.addEventListener('message', function (e) {
		if (e.origin == 'http://localhost') {
			if (e.data.action == 'screen-saver-init') {
				iframeWin = e.source;
				
				iframeWin.postMessage({action:'screen-saver-installed', friends:friends ? friends.split(',') : ''}, '*');
			}

			if (e.data.action == 'screen-saver-sync') {
				iframeWin.postMessage({action:'screen-saver-sync-complete'}, '*');

				window.postMessage(e.data, '*');
			}
		}
	}, false);*/

})('[@FRIENDS]');