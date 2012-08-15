MegaPlayListXXX.SongManager = {};

MegaPlayListXXX.SongManager.Manager = (function ($) {
	var config = MegaPlayListXXX.Config.SongManager,
		providers = {};
	
	return Class.extend({
		init:function () {
			providers.YouTube = new MegaPlayListXXX.SongManager.YouTube();
		}
	});
})(jQuery);