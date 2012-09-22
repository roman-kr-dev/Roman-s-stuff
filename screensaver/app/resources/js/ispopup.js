(function () {
	window.postMessage({
		action:'screen-saver-response-is-popup',
		ispopup:window.opener != undefined
	}, '*');
})();