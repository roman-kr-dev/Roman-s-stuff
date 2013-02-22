(function () {
	window.postMessage(JSON.stringify({
		action:'screen-saver-response-is-popup',
		ispopup:window.opener != undefined
	}), '*');
})();