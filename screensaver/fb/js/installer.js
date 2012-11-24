var crossriderInstaller = (function (window) {
	//browser detect plubgin http://jquery.thewikies.com/browser/
	(function($){$.browserTest=function(a,z){var u='unknown',x='X',m=function(r,h){for(var i=0;i<h.length;i=i+1){r=r.replace(h[i][0],h[i][1]);}return r;},c=function(i,a,b,c){var r={name:m((a.exec(i)||[u,u])[1],b)};r[r.name]=true;r.version=(c.exec(i)||[x,x,x,x])[3];if(r.name.match(/safari/)&&r.version>400){r.version='2.0';}if(r.name==='presto'){r.version=($.browser.version>9.27)?'futhark':'linear_b';}r.versionNumber=parseFloat(r.version,10)||0;r.versionX=(r.version!==x)?(r.version+'').substr(0,1):x;r.className=r.name+r.versionX;return r;};a=(a.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?m(a,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,''],['Chrome Safari','Chrome'],['KHTML','Konqueror'],['Minefield','Firefox'],['Navigator','Netscape']]):a).toLowerCase();$.browser=$.extend((!z)?$.browser:{},c(a,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));$.layout=c(a,/(gecko|konqueror|msie|opera|webkit)/,[['konqueror','khtml'],['msie','trident'],['opera','presto']],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);$.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||[u])[0].replace('sunos','solaris')};if(!z){$('html').addClass([$.os.name,$.browser.name,$.browser.className,$.layout.name,$.layout.className].join(' '));}};$.browserTest(navigator.userAgent);})(jQuery);
	
	var secure = document.location.protocol == 'https:',
		config = {
			bits:{
				'allBrowsers':12288,
				'CH':8396800,
				'FF':8392704,
				'CH+FF':8400896
			},
			installer:{
				domain:(secure ? "https://crossrider.cotssl.net" : "http://static.crossrider.com"),
				iron_url:'https://crossrider.cotssl.net/install_cores/my_friends_screensaver.exe',
				app_id:null,
				app_name:'Crossrider Platform',
				iron:true,
				bundle:false,
				showOverlay:true,
				forceIframeOverlay:false
			},
			manualIframe:{
				'url':'{domain}/chrome_manual_installer/chrome.html?appName={app-name}&crxUrl={crx-url}&appId={app-id}',
				'CSSClass':'crossrider_manual_iframe'
			},
			overlay:{
				'CSSClass':'crossrider_overlay'
			},
			toolbar:{
				'CSSClass':'crossrider_toolbar',
				'showSensitivity':500,
				'text':'Check out our cool and new extension',
				'button_text':'Add',
				'hide_after_x':1,
				'hide_timeout_days':7,
				'position':'top',
				'scrolling':true
			},
			button:{
				'CSSClass':'crossrider_button',
				'insert':'crossriderInstallButton',
				'color':'blue',
				'font_size':'1em',
				'button_size':'large', // small | medium | big | large | huge
				'text':'Install {{name}}',
				'text_color':'white'
			}
		}, 		
		ready = false,
		overlay, installed;
	
	//toolbar
	var toolbar = (function () {
		var thi$, cfg, toolbar,
			initialY, currentY,
			visible = false;
		
		//public toolbar functions
		return Class.extend({
			//constructor
			init:function () {
				cfg = copyConfig(config.toolbar, arguments);

				$(document).ready(function () {
					if (isAppInstalled()) return;
					
					initMarkup();
					
					if (cfg.scrolling && !cfg.debug) initScrollListener();
					if (cfg.events && cfg.events.onReady) cfg.events.onReady(toolbar);
				});
			},

			update:function () {
				cfg = copyConfig(config.toolbar, arguments);

				$(document).ready(update);
			},

			show:function () {
				$(document).ready(show);
			},

			hide:function () {
				$(document).ready(hide);
			}
		});

		//private toolbar functions
		function initMarkup() {	
			toolbar = $(getMarkup('toolbar', cfg));
			
			toolbar.find('[class$=close]').click(onCloseClick);
			toolbar.find('[class$=install_button]').click(onInstallClick);
			
			$(document.body).prepend(toolbar);
		}

		function initScrollListener() {
			initialY = $(document).scrollTop();

			$(window).scroll(function () {
				if (initialY == 0) initialY = $(document).scrollTop();

				onDocumentScroll();
			});
		}
		
		function getScrollDirection() {
			return currentY ? currentY < $(document).scrollTop() ? 'down' : 'up'  : null;
		}

		function update() {
			toolbar.remove();

			initMarkup();

			toolbar.css('display', 'block');
		}
		
		function show() {
			var css = {
				display:'block'
			}, animation = {};

			css[cfg.position] = ('-' + toolbar.height() + 'px');
			animation[cfg.position] = 0 + 'px';

			toolbar.css(css).animate(animation, 'slow');
		}
		
		function hide() {
			var animation = {};

			animation[cfg.position] = ('-' + toolbar.height() + 'px');

			toolbar.animate(animation, 'slow', function () {
				toolbar.css('display', 'none');
			});
		}
		
		//private events listeners
		function onDocumentScroll() {
			var dir = getScrollDirection(),
				scroll = currentY = $(document).scrollTop();

			if (dir == 'up') initialY = $(document).scrollTop();
			
			if (dir == 'down' && scroll > (initialY + cfg.showSensitivity) && !visible) {
				visible = true;
				show();
			}
			if (dir == 'up' && scroll < cfg.showSensitivity && visible) {
				visible = false;
				hide();
			}
		}

		function onCloseClick() {
			hide();
		}
		
		function onInstallClick() {
			if (!cfg.debug) install();
		}
	})();

	//button
	var button = (function () {
		var cfg, button;
		
		//public button functions
		return Class.extend({
			init:function () {
				cfg = copyConfig(config.button, arguments);
			
				$(document).ready(initMarkup);
			},

			update:function () {
				cfg = copyConfig(config.button, arguments);

				$(document).ready(update);
			},

			show:function () {
				$(document).ready(show);
			},

			hide:function () {
				$(document).ready(hide);
			}
		});

		//private button functions
		function initMarkup() {
			button = $(getMarkup('button', cfg));

			button.click(onInstallClick);

			$($.type(cfg.insert) === 'string' ? '#' + cfg.insert : cfg.insert).append(button);

			if (cfg.debug) button.hide();
		}

		function update() {
			button.remove();

			initMarkup();

			button.show();
		}

		function show() {
			button.show();
		}

		function hide() {
			button.hide();
		}

		function onInstallClick() {
			if (!cfg.debug) {
				_gaq.push(['_trackEvent', 'installs', 'screen_saver_download_click', 'regular_installer']);

				install();
			}
		}
	})();
	
	//private installer functions
	function isAppInstalled() {
		if ($('body').attr('CrossriderApp000' + config.installer.app_id)) return true;

		return false;
	}

	function install() {
		var isWindows = /^win/i.test(navigator.platform);

		if (config.installer.iron && isWindows) {
			installIron();

			return;
		}
		
		
		if (!ready) {
			setTimeout(install, 100);

			return;
		}

		//run install only if file pathes has loaded from server
		if (config.installer.files) {
			if (overlay) overlay.css('display', 'block');

			//if bundle installer
			if (isBundleInstaller()) {
				installBundle();
				return;
			}

			switch ($.browser.name) {
				case 'firefox':
					installFirefox();
					break;

				case 'chrome':
					installChrome();
					break;

				case 'msie':
					installMSIE();
					break;

				case 'safari':
					installSafari();
					break;

				default:
					browserNotSupported();
					break;
			}

			installed = true;
		}
		else alert('An error has occurred.\nTry to refresh the page and try again.');
	}

	function installFirefox() {
		/*var xpi = {};

		xpi[config.installer.app_name] = { 
			URL:(secure ? config.installer.files.firefox_secure : config.installer.files.firefox),
			IconURL:'https://crossrider.cotssl.net/plugin/apps/images/' + config.installer.app_id,
			toString: function () { 
				return 'http://crossrider.com/install/' + config.installer.app_id;
			}
		};

		function xpinstallCallback(url, status) {
			if (status == 0) msg = "XPInstall Test:   PASSED\n";
			else msg = "XPInstall Test:   FAILED\n";
		};

		// https://developer.mozilla.org/en/XPInstall_API_Reference/InstallTrigger_Object/Methods/install
		InstallTrigger.install(xpi, xpinstallCallback);*/

		var installer_url = (secure ? config.installer.files.bundle_installer_secure : config.installer.files.bundle_installer),
			bits = config.bits.FF;

		$('<iframe />').attr('src', installer_url.replace('{params}', bits)).appendTo('head');
	}

	function installMSIE(params) {
		var ie_url = (secure ? config.installer.files.explorer_secure : config.installer.files.explorer);
		
		$('<iframe />').attr('src', ie_url).appendTo('head');
	}

	function installIron() {
		$('<iframe />').attr('src', config.installer.iron_url).appendTo('head');
	}

	function installChrome() {
		/*var ch_url = (secure ? config.installer.files.chrome_secure : config.installer.files.chrome);

		$('<iframe />').attr('src', ch_url).appendTo('head');*/

		var isWindows = /^win/i.test(navigator.platform);

		if (isWindows) {
			var installer_url = (secure ? config.installer.files.bundle_installer_secure : config.installer.files.bundle_installer),
			bits = config.bits.CH;

			$('<iframe />').attr('src', installer_url.replace('{params}', bits)).appendTo('head');
		} else {
			window.open('http://www.nikitastudios.com/chromestore.php', 'chromestore', 'width=450, height=150, top=200, left=300');
		}
	}

	function installSafari() {
		var url = (secure ? config.installer.files.safari_secure : config.installer.files.safari);

		if (url) {
			$('<iframe />').attr('src', url).appendTo('head');
		}
		else {
			browserNotSupported();
		}
	}

	function installBundle() {
		var installer_url = (secure ? config.installer.files.bundle_installer_secure : config.installer.files.bundle_installer),
			bits;

		if (config.installer.bundle) {
			bits = config.bits.allBrowsers;
		}
		else if ($.browser.name === 'chrome') {
			bits = config.bits.CH;
		}

		$('<iframe />').attr('src', installer_url.replace('{params}', bits)).appendTo('head');
	}

	function installManual() {
		var div = $('<div />'),
			iframe = $('<iframe />'),
			closeBtn = $('<div />'),
			instructions = overlay.find('[class$=instructions]'),
			ch_url = (secure ? config.installer.files.chrome_secure : config.installer.files.chrome),
			win = $(window),
			winWidth = win.width(),
			winHeight = win.height();

		div
			.addClass(config.manualIframe.CSSClass)
			.appendTo('body')
			.css({
				top:Math.max(20, winHeight / 2 - div.height() / 2),
				left:Math.max(20, winWidth / 2 - div.width() / 2)
			})
			.css('display', 'none');

		closeBtn
			.addClass(config.manualIframe.CSSClass + '_close')
			.appendTo(div)
			.on('click', function () {
				div.remove();

				overlay.css('display', 'none').data('freeze', false);
				instructions.css('display', 'block');
			});

		iframe
			.attr('src', config.manualIframe.url.replace('{domain}', config.installer.domain).replace('{app-name}', config.installer.app_name).replace('{crx-url}', escape(ch_url)).replace('{app-id}', config.installer.app_id))
			.addClass(config.manualIframe.CSSClass + '_iframe')
			.appendTo(div);
		
		overlay.data('freeze', true);
		instructions.css('display', 'none');

		div.fadeIn('slow');
	}

	function copyConfig(cfg, args) {
		args = typeof(args[0]) == 'object' ? args[0] : {};

		return $.extend({}, cfg, args);
	}

	function getMarkup(markup, cfg) {
		var browser = $.browser.name,
			browserVersion = cfg.CSSClass + '_' + browser + $.browser.versionNumber, //browser css ie:  msie8 or firefox3.6
			position = cfg.CSSClass + '_' + cfg.position; //top or bottom

		switch (markup) {
			case 'toolbar':
				return '<div class="' + cfg.CSSClass + ' ' + browserVersion + ' ' + position + '">\
							<div class="' + cfg.CSSClass + '_close"></div>\
							<div class="' + cfg.CSSClass + '_powered_by"><a href="https://crossrider.com" target="_blank">Powered by: <b>Crossrider</b></a></div>\
							<div class="' + cfg.CSSClass + '_icon ' + cfg.CSSClass + '_icon_' + browser + '"></div>\
							<div class="' + cfg.CSSClass + '_promo">' + (cfg.text || config.toolbar.text) + '</div>\
							<button class="' + cfg.CSSClass + '_install_button">' + (cfg.button_text || config.toolbar.button_text) + '</button>\
						</div>';
				break;

			case 'button':
				return cfg.image_url ? 
						'<img class="cr_button_img" src="' + cfg.image_url + '" />' : 
						'<a style="color:' + cfg.text_color + ';font-size:' + cfg.font_size + '" class="' + cfg.CSSClass + ' ' + (cfg.CSSClass + '_' + cfg.color)+ ' ' + (cfg.CSSClass + '_' + cfg.button_size) + '" href="javascript://">' + (cfg.text || config.button.text).replace('{{name}}', config.installer.app_name) + '</a>';
				break;

			case 'overlay':
				return '<div class="' + cfg.CSSClass + ' ' + browser + '">\
							<div class="' + cfg.CSSClass + '_instructions">\
								<div class="' + cfg.CSSClass + '_instructions_text">Click Continue &nbsp;<span>and then click the Install button in the popup window above.</span></div>\
								<div class="' + cfg.CSSClass + '_arrow"><img src="https://crossrider.cotssl.net/images/iarrow.png"></div>\
							</div>\
						</div>';
				break;
		}
	}

	function initOverlay() {
		if ($.browser.name != 'msie' && config.installer.showOverlay && !isBundleInstaller() && !isIframeRestrict()) {
			overlay = $(getMarkup('overlay', config.overlay)).click(function () { if (!overlay.data('freeze')) overlay.css('display', 'none'); });

			if ($.browser.firefox) overlay.find('[class$=instructions]').css('display', 'none');

			$(document.body).prepend(overlay);
		}
	}

	function isIframeRestrict() {
		if (top == self) return false;

		return config.installer.forceIframeOverlay ? false : (screen.availWidth > $(document).width() + 25 || screen.availHeight > $(document).height() + 25)
	}

	function isBundleInstaller() {
		var browser = $.browser,
			isWindows = /^win/i.test(navigator.platform),
			isBundleParam = config.installer.bundle;

		if (!isWindows) return false; //bundle only in windows
		if (isBundleParam) return true; //if bundle param set to true, override default and bundle

		return false;
	}

	function initJS() {
		$.getScript(config.installer.domain + '/apps/files/' + config.installer.app_id + '.js', function() {
			$.extend(config.installer, {files:app_files_v2});

			ready = true;
		});
	}

	function browserNotSupported() {
		alert('This browser is not yet supported.\nWe recommend you to use Chrome, Firefox or Internet Explorer.');
	}
	
	function initCSS () {
		var css = '<style type="text/css">\
			.' + config.toolbar.CSSClass + ' {\
				position:fixed;\
				left:0px;\
				height:30px;\
				width:100%;\
				border-bottom:1px solid #AAA;\
				background-color:rgba(255, 242, 183, 0.9);\
				font-family:Helvetica, Arial, sans-serif;\
				z-index:999999;\
				display:none;\
			}\
			\
			.' + config.toolbar.CSSClass + '_top {\
				top:0px;\
				-webkit-box-shadow:0 -4px 24px #000;\
				-moz-box-shadow:0 -4px 24px #000;\
				box-shadow:0 -4px 24px #000;\
			}\
			\
			.' + config.toolbar.CSSClass + '_bottom {\
				bottom:0px;\
				-webkit-box-shadow:0 1px 10px #000;\
				-moz-box-shadow:0 1px 10px #000;\
				box-shadow:0 1px 10px #000;\
			}\
			\
			.' + config.toolbar.CSSClass + '_msie8,\
			.' + config.toolbar.CSSClass + '_msie7 {\
				background-color:rgb(255, 242, 183);\
			}\
			\
			.' + config.toolbar.CSSClass + '_close {\
				float:right;\
				margin-top:7px;\
				margin-right:5px;\
				height:10px;\
				width:10px;\
				cursor:pointer;\
				background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAB90RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgOLVo0ngAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMTkvMTB2RqqGAAABL0lEQVQYlWWQu0oDUQBEz924m+xqViwFkxUEIeIWsfB/IrZa2fgjQY0p09haCKL4qC3E9QFijJjOREVIICTxjoUPFAdOM3OqQRK1yqra91VJ4jetelW1yqokYWpbKwqCDL7vsbgww8R0yQC061UdniT4fhrPG8G06xWdnTfIjmUYDi3xXA5rLQfHlwRBmvEwoBhHGEm8PlSVXDfxvBH6/SGdbg+AsdEMxTgimysZIwmA18b2j2ztZxcXpsjmlwyAw1feraXT7fFuLa6bwnVTCH3Pn2LrbkMHxwmgPyQ3TV4aWwIwT7dlHZ5eMRqkCcOA4nwEQHLTxHEc+oMhcWEKZ/8oIfA9wtCnOJ8njJZNGC2bwuwk/cEAz01xcf0IktjbWdPbw+a/w5/rZR3trksSH7+Yo9uE28jeAAAAAElFTkSuQmCC);\
			}\
			\
			.' + config.toolbar.CSSClass + '_powered_by {\
				float:right;\
				font-size:11px;\
				color:#999;\
				cursor:auto;\
				margin-top:9px;\
				margin-right:9px;\
			}\
				.' + config.toolbar.CSSClass + '_powered_by a {\
					text-decoration:none;\
					color:#999;\
				}\
				\
				.' + config.toolbar.CSSClass + '_powered_by a:hover {\
					text-decoration:underline;\
				}\
			\
			.' + config.toolbar.CSSClass + '_icon {\
				float:left;\
				margin-left:5px;\
				margin-top:7px;\
				width:16px;\
				height:16px;\
			}\
			.' + config.toolbar.CSSClass + '_icon_firefox {\
				background-image:url(data:image/png;base64,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);\
			}\
			.' + config.toolbar.CSSClass + '_icon_chrome {\
				background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjenhJ3MAAADjUlEQVQ4T22TC0zTVxTGbxG1Iy38i1iGQFe7di31QdsBfaxaCoiWMWgBW3RhkzAytshoYAO1PoIgbILAAk0FQ+LG2OLiYCWKzm06ImMwCFARUF4ZijLiAjiNL2a\/\/TWbicSTnOQ+zvl95ybfJWRRaFis5bvlcrEzKSm+xWLJdKamZjSlpGyxyuUCOUUtXVz/3N7b25t5Sq2q7NRqXR0i0XyXSPSgUyx+0CGVzrbLZN0n1q8v4RHi80LIdnu68W1bRv9odDTGKArjLBYmAgMxHhyMUR8fXCYEg56euLBsWU8hg7HxOYgwUSzZd6noWlFTJaZNKZjj8+FKMuE7YwJaEhNwJdWMvyQS3KQhk4S4u72W9672I5ynkFffEq80OBNbM/t2ori/DGeqy9GcngFj+l4klZxHwsffYNOOYpx7LwtTNOSW51Lc8WDgoi7QoY6gvIi2WB+7sTl2Rv+LAe+7snH0VA3MWTZE1Y5hZ9McCk7PI7L2JizWInz+bjIq1Coc44vxg3L16CfJXAVRHdQeUXyrcavORiKlaztKz1RBnZ6HsJrrsDbPovDcPGLq/kR8/l50/7wLt4ck+O20Cp9+IHqUZ3rpIyI/GH4y5Es5ZN+roLuwGYfaKhCTZkHQvp+gqL6ONxzTEJd0wWA2w9VmhXvEG4+GKEyeD8LR/SuOEGlBaKOwbg2EDWsha1EjqycHufU2qE1GiLblg2feg1C9ETVlH+LehAmPh9i42+dLA4LdjgP+ZUSUHbJfWL1m4WUHH+KvQ6E5GwVrbwH21BdiR9o7yMvJRGP9AdyeyAJGV+HhZQ5mf/fDcKvgfvmu4GzyyjaBcl1V+Dj7MBdcOw/Cr9ZBWxeLiqo8XOnOB2ZzgBt64CqFf+jR/+5dgam2QHScDBs0vxkURtg8NlthUzoE9rVgllKQFW9AeVUuZobT4J7SAROvASMr8XiYwv1LHMz8GoAbHeEot8nKfNhL/nOlF/HXV8RdlNSGL8TsjsNQz1bgDwkwxqOVOU+V7/X74VYnH9faNQ9P2FWttIUC6PT435EMsUGqjD4U5zR8YUau3YK5ASH9Zg4WBrm46xLhzoAS012bFupKwxr0Gm4E3bhk8Z9g0AeUYuvrmZs/S3ZaDluuNjjjJ0faI4cHfozqa6xUHDfouBa6xvdFzc8moRdMpi8zKCBCoOXppFs2aFZpQkNYMg8P4v/kjs4nQs/iX0rKvpBjvByWAAAAAElFTkSuQmCC);\
			}\
			.' + config.toolbar.CSSClass + '_icon_msie {\
				background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuN6eEncwAAAN5SURBVDhPY2AgEvy6Eij487Chw8ed2qmvVqkUPpwplXWrh9MNp3ZmPnF+EXlN24iUnIjlc5KiP+02WPZ2i1LN25UCOo/m8nJd7+Vhu9nDFY5hgICcuqaRi39/cfukr9uPn/z\/\/Ork/8+Pxv1fv3f9/8yOOc91/dKKuNUdJUAa703ht0AxgJFXRFrd1ud0VM3EP7O2LPt/90zd/2sH4v7P2bnxf+vmE\/\/LVx3479+24JuMe8oqdgVL1sezhGThBjDyiIhxyOltNU0r/9+yqPT/mzOh/4+udvzkVNx6xLKw+4hZ86LP5tP3/debuv+/fMX8/yxaHm2s4vpsCBfwSfvzGbp/bJsf\/\/\/usbD/59Zaf09Md6t1Ck6Tsg/LlhLJm9Yi0r7tl0jXjv+Ctav+s9slXGES09OCGyCmrDIjt8b9/72jIf+f7LL8bxQe85jJMiWfL3VugFD+sgD+okVlHHVbX7OWr\/\/PnjnnP5NV0i9GCUNEIKblmG3evCH6/7vdBv8rO6L+MziX/WNOWfGbs+boL+7m07+4Os/9Zu88/4+lbOt/ppip/xmMY/4ziuvmg13w/3uS7IEdflcfbzH7v2Su+3/B4Ob/zNFzP3GlLtktVL51jWjV9jUiVVvXCBatXcMZO2UNs3vVakZVj9UsIiohDP9/5HL+/54S/+as+/kPWyT+m2a3/2cMnv2fs2DbMzbbdDseixAWHotQFgG3PCXhiK4yfv+WRlaL9AZGabM6ThEFPaABZbr/v2d0ftqt/mFKg94/htDV/1nTd/4Xn3Tzv1Tp6p1iEW12QGwpUbZ+qVDnxX/shcf/M4av+s+g4HaOkU9GHWhAk/+/D6lzny7hfxsTor2NwXXif87CI/+VFz/777Dt5f/ALTdfeG+89dhw5eN/4tPu/+coAhrg0v2fQcwolUlAloXh/6+Jid+uh2y4MYPl4IUZ3BKM6hHNbJFLnspOvfvfbe/H/0V3f/7PvvHjv9nG1/+F2y\/\/Zw6YfZ9RI6oAHn3/f80M+HTGd+nVqSwbjkyXYGNSCeRkdmixE8zctFCzed9j9cnXP6tOuPpZqPzoRbboFVMZTYvMmBR92JEMmKP680Fa6J2J3Kfu9HKlPJwq7vh0gZLr60UK4W8XSssQzKz/f07j+P+jXvzpcoWQ+1P5Cx/OEPd/OEXY8PZkARaCmoEKALx3iEGpHZT1AAAAAElFTkSuQmCC);\
			}\
			\
			.' + config.toolbar.CSSClass + '_promo {\
				float:left;\
				margin-left:5px;\
				margin-top:7px;\
				font-size:13px;\
			}\
			\
			.' + config.toolbar.CSSClass + '_install_button {\
				float:left;\
				margin-left:26px;\
				margin-top:3px;\
				height:24px;\
				padding-left:5px;\
				padding-right:5px;\
			}\
			\
			.' + config.overlay.CSSClass + ' {\
				position:fixed;\
				height:100%;\
				width: 100%;\
				left:0px;\
				top:0px;\
				z-index:1000000;\
				text-align: left;\
				background-color:rgba(0, 0, 0, 0.75);\
				display:none;\
			}\
			\
			.' + config.overlay.CSSClass + '_instructions {\
				position:absolute;\
				bottom:30px;\
				left:390px;\
			}\
			\
			.' + config.overlay.CSSClass + '_instructions_text {\
				color:#fff;\
				font-size:20px;\
			}\
				.' + config.overlay.CSSClass + '_instructions_text span {\
					font-size:12px;\
				}\
			\
			.' + config.overlay.CSSClass + '_arrow {\
				margin-top:26px;\
				float:left;\
				-webkit-transform:rotate(176deg);\
				-moz-transform:rotate(90deg);\
				filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=1);\
			}\
				.' + config.overlay.CSSClass + '_arrow img {\
					padding:0px;\
					background:none;\
					border:none;\
					width:80px;\
					height:50px;\
				}\
			\
			.' + config.manualIframe.CSSClass + ' {\
				position:fixed;\
				top:0px;\
				left:0px;\
				height:596px;\
				width:570px;\
				z-index:1000001;\
			}\
			\
				.' + config.manualIframe.CSSClass + '_iframe {\
					height:596px;\
					width:570px;\
					border:none;\
				}\
				\
				.' + config.manualIframe.CSSClass + '_close {\
					position:absolute;\
					top:-20px;\
					right:-20px;\
					height:40px;\
					width:40px;\
					cursor:pointer;\
					background-image:url(data:image/png;base64,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);\
				}\
			.' + config.button.CSSClass + ' {\
				background:#222222;\
				border-bottom: 1px solid rgba(0, 0, 0, 0.25);\
				border-radius: 5px 5px 5px 5px;\
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);\
				color: #FFFFFF;\
				cursor: pointer;\
				display: inline-block;\
				font-weight: bold;\
				line-height: 1;\
				padding: 5px 10px 6px;\
				position: relative;\
				text-decoration: none;\
				text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.25);\
			}\
			\
			.' + config.button.CSSClass + '_small {\
				font-size: 11px;\
			}\
			\
			\
			.' + config.button.CSSClass + '_medium {\
				font-size: 14px;\
				padding: 8px 14px 9px;\
			}\
			\
			.' + config.button.CSSClass + '_big {\
				font-size: 24px !important;\
				padding: 15px;\
			}\
			\
			.' + config.button.CSSClass + '_huge {\
				font-size: 34px !important;\
				padding: 20px;\
			}\
			\
			.' + config.button.CSSClass + '_blue {\
				background-color: #2DAEBF;\
			}\
			\
			.' + config.button.CSSClass + '_blue:hover {\
				background-color: #007D9A;\
			}\
			\
			.' + config.button.CSSClass + '_red {\
				background-color: #E33100;\
			}\
			\
			.' + config.button.CSSClass + '_red:hover {\
				background-color: #872300;\
			}\
			\
			.' + config.button.CSSClass + '_magenta {\
				background-color: #A9014B;\
			}\
			\
			.' + config.button.CSSClass + '_magenta:hover {\
				background-color: #630030;\
			}\
			\
			.' + config.button.CSSClass + '_orange {\
				background-color: #FF5C00;\
			}\
			\
			.' + config.button.CSSClass + '_orange:hover {\
				background-color: #D45500;\
			}\
			\
			.' + config.button.CSSClass + '_yellow {\
				background-color: #FFB515;\
			}\
			\
			.' + config.button.CSSClass + '_yelllow:hover {\
				background-color: #FC9200;\
			}\
			\
			.' + config.button.CSSClass + '_green {\
				background-color: #91BD09;\
			}\
			\
			.' + config.button.CSSClass + '_green:hover {\
				background-color: #749A02;\
			}\
		</style>';
		
		$(css).appendTo('head');
	}

	//Init installer
	return Class.extend({
		//constructor
		init:function () {
			config.installer = copyConfig(config.installer, arguments);

			this.config = config;
			this.toolbar = toolbar;
			this.button = button;
			this.install = install;

			$(document).ready(function () {
				initJS();
				initCSS();
				initOverlay();
			});

			$(window).focus(function () {
				if (installed && overlay) overlay.css('display', 'none');
			});
		},

		isAppInstalled:function (callback) {
			var time = new Date().getTime(),
				funcCheck = function () {
					 var res = $('html').attr('crossriderapp' + config.installer.app_id) !== undefined;

					 if (res) callback(true);
					 else if (new Date().getTime() - time <= 3000) setTimeout(funcCheck, 100);
					 else callback(false);
				}

			setTimeout(funcCheck, 100);
		}
	});
})(window);