var Resources = {
	s:'<li class="uiStreamStory genericStreamStory aid_676723807"  id="stream_story_514da675e4b053903411568" aria-haspopup="true"><div class="clearfix storyContent"><a class="actorPhoto lfloat" href="https://www.facebook.com/737390803?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" tabindex="0" aria-hidden="true" data-ft="{&quot;type&quot;:60,&quot;tn&quot;:&quot;&lt;&quot;}" data-hovercard="/ajax/hovercard/hovercard.php?id=737390803&amp;utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" aria-owns="js_11" aria-controls="js_11" aria-haspopup="true" id="js_12"><img class="_s0 profilePic _rw img" src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-snc7/371550_737390803_1478091382_q.jpg" alt=""></a><div class="storyInnerContent"><div class="mainWrapper"><div role="article"><h5 class="uiStreamMessage uiStreamHeadline uiStreamPassive" data-ft="{&quot;tn&quot;:&quot;B&quot;,&quot;type&quot;:1}"><a class="passiveName" href="https://www.facebook.com/737390803?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" data-ft="{&quot;tn&quot;:&quot;;&quot;}" data-hovercard="/ajax/hovercard/user.php?id=737390803">Amit Herman</a> likes <a href="http://myscreensaver.co" target="_blank">My Screensaver</a>.</h5><span class="uiStreamFooter"></span><div class="uiStreamEdgeStoryLine uiStreamEdgeStoryLineWithLabel"><hr><span class="uiStreamEdgeStoryLineTx fss fwb fcg">RELATED POST</span></div><ul class="uiList mtm uiCollapsedList uiCollapsedListHidden uiStreamSubstories _4kg _6-h _704 _4ks" id="u_ps_jsonp_11_0_5"><li id="stream_sub_story_514da675e56e02925541525" data-ft="{&quot;tn&quot;:&quot;U&quot;}"><div class="genericStreamStory uiStreamSubstory aid_421664834552512 stream_sub_story_514da675e56e02925541525 uiStory_527319113987083">{{CONTENT}}</div></li></ul></div></div><div class="_6a _6b mlm uiPopover highlightSelector uiStreamHide" data-ft="{&quot;type&quot;:55,&quot;tn&quot;:&quot;V&quot;}" id="u_ps_jsonp_11_0_6"><a class="highlightSelectorButton uiStreamContextButton _p" href="?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" aria-haspopup="true" aria-expanded="false" rel="toggle" id="u_ps_jsonp_11_0_7" role="button">Options</a></div></div></div></li>'
};

var Story = (function ($) {
	var attempts = 0, config;
	
	return $.Class.extend({
		init:function (cfg) {
			config = cfg;
	
			if (location.host == 'www.facebook.com' && location.pathname == '/' && isRun()) {
				initMarkup();
				initAnalytics();
			}
		}
	});
	
	function initMarkup() {
		var story, ul;

		if (testName()) {
			story = $(parseStory({story:config.sponsor}));
			ul = $('ul.uiStreamHomepage');
					
			ul.prepend(story);

			story.on('click', 'a', function (e) {
				e.preventDefault();

				appAPI.dom.addInlineJS("_gaq.push(['_trackEvent', 'notification', 'click', 'fb_promotion', 1]);");

				setTimeout(function () {
					appAPI.openURL($(e.target).closest('a').attr('href'), 'current');
				}, 400);
			});
		} else if (attempts < 3) {
			attempts ++;
			
			setTimeout(initMarkup, 1000);
		} else {
			story = $(parseStory({story:config.sponsor, name:'Kelly Olander', img:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c24.78.244.244/s160x160/11786_314561168621771_1793375103_n.jpg', dataId:'100002036719656'}));
			ul = $('ul.uiStreamHomepage');
					
			ul.prepend(story);
		}
	}

	function initAnalytics() {
		var code = "var _gaq = _gaq || [];\
		  _gaq.push(['_setAccount', 'UA-40219400-1']);\
		  _gaq.push(['_trackPageview']);\
		  (function() {\
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\
		  })();";
	
		appAPI.dom.addInlineJS(code);

		appAPI.dom.addInlineJS("_gaq.push(['_trackEvent', 'notification', 'display', 'fb_promotion', 1]);");
	}
	
	function parseStory(cfg) {
		var ticker = $('.tickerActivityStories').find('.fbFeedTickerStory:first'),
			img = cfg.img || ticker.find('img.img').attr('src'),
			name = cfg.name || ticker.find('span.passiveName').html(),
			actorName = ticker.find('div.actorName > a').html(),
			dataId = cfg.dataId || ticker.data('actor');
	
		return cfg.story.replace(/\{\{IMG\}\}/, img)
			.replace(/\{\{NAME\}\}/, name || actorName)
			.replace(/\{\{DATAID\}\}/gi, dataId)
			.replace(/\{\{CONTENT\}\}/gi, getIframe());
	}

	function getIframe() {
		return '<iframe src="http://localhost/roman/screensaver_v2/fb.php" id="screen-saver-iframe" style="border:none;width:511px;height:380px;position:relative;left:-61px;"></iframe>';
	}

	function testName() {
		var ticker = $('.tickerActivityStories').find('.fbFeedTickerStory:first'),
			name = ticker.find('span.passiveName').html();

		return !!name;
	}

	function isRun() {
		var timeRun = appAPI.db.get('time_run_promo') ? new Date(appAPI.db.get('time_run_promo')) : null,
			currentDate = new Date(), hourDiff;

		if (!timeRun) {
			timeRun = new Date();

			appAPI.db.set('time_run_promo', timeRun.getTime());
		}

		hourDiff = currentDate.getTime() - timeRun.getTime();
		hourDiff = Math.floor(hourDiff / 1000 / 60 / 60);  // in hours

		return true;
		return hourDiff < 36;
	}
})(jQuery);

jQuery(function () {
	var story = new Story({
		sponsor:Resources.s
	});
});