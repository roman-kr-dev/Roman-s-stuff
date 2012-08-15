var MegaPlayListXXX = {};

MegaPlayListXXX.Config = {
	baseCSS:'MegaPlayListXXX-',
	
	PlayList:{
		iframePlayerId:'MegaPlayListXXX-player',
		iframePlayerBaseUrl:'http://localhost/roman/',
		iframePlayerUrl:'http://localhost/roman/megaPlayer/megaPlayListXXX.web/player.html',
		messageRegExp:/^MegaPlayListXXX\.(.*)/
	},

	SongManager:{
		YouTube:{
			site:/https?:\/\/(?:www\.)?youtube\.com/i,
			siteVideo:'#watch-player'
		}
	},

	ActionsRouter:{
	}
};