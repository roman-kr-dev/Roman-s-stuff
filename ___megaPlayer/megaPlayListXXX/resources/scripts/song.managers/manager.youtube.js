MegaPlayListXXX.SongManager.YouTube = (function ($) {
	var baseCSS = MegaPlayListXXX.Config.baseCSS,
		config = MegaPlayListXXX.Config.SongManager.YouTube;
	
	return Class.extend({
		init:function () {
			initSaveButton();
		}
	});

	function initSaveButton() {
		if (config.site.test(top.location.href)) {
			$(config.siteVideo).append(getSaveButton());
		}
	}

	function getSaveButton() {
		var button = $('<div />');

		button.addClass(baseCSS + 'add-button');
	}
})(jQuery);