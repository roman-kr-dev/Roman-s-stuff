(function () {
	var iframeWin;

	window.addEventListener('message', function (e) {
		if (e.origin == 'http://localhost') {
			iframeWin = e.source;
			
			if (e.data.action == 'screen-saver-sync') {
				iframeWin.postMessage('screen-saver-sync-complete', '*');

				window.postMessage(e.data, '*');
			}
		}
	}, false);

})();