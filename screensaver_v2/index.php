<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '16998';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>facebook invite</title>

		<meta property="og:title" content="My Friends ScreenSaver" />
		<meta property="og:description" content="See the latest photos of your friends and family on this first ever social screensaver"/>
		<meta property="og:url" content="http://apps.facebook.com/topfriendscreensaver/"/>
		<meta property="og:image" content="http://www.nikitastudios.com/images/logo128x128.png"/>

		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
		<script src="js/jquery.carouFredSel-6.2.0-packed.js" type="text/javascript"></script>
		<script src="js/jquery.client.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>
		<script src="js/canvas.js" type="text/javascript"></script>
    </head>
    <body>

	<header>
		<nav>
			<img id="logo" src="img/pixel.png" alt="Color my Facebook" title="Thanks to Color My Facebook, my Facebook's pages are customized!" itemprop="image"/>
			<div id="buttons">			
				<iframe src="http://iwebya.fr/test/fb.html" style="width: 650px;height: 37px;border: none;overflow: hidden;position: absolute;top: -8px;left: 0px;z-index: 1;"></iframe>
				<div id="otherButtons" style="margin-left: 150px;width: 880px;z-index: 2;">
					<a href="https://twitter.com/share" class="twitter-share-button" data-text="Goodbye blue! I changed my Facebook color! #goodbyeBlue" data-url="http://colormyfacebook.com/">Tweet</a>				
					<div class="g-plusone" data-size="medium" data-href="http://colormyfacebook.com/"></div>
					<div style="display: inline-block;">
						<div style="position: absolute;top: -20px;">
							<a target=_blank href="http://pinterest.com/pin/create/button/?url=http%3A%2F%2Fiwebya.fr%2Fcolor-my-fb%2F&media=http%3A%2F%2Fiwebya.fr%2Fcolor-my-fb%2Fimg%2Fslide4.png&description=No%20more%20blue%20on%20Facebook%2C%20thanks%20to%20Color%20My%20Facebook!" class="pin-it-button" count-layout="horizontal"><img border="0" src="http://assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>
						</div>
					</div>
				</div>
				<div id="fb-root"></div>
			</div>
		</nav>
	</header>

		<div id="preview" class="preview loader">		
			<!-- go to app box message - START -->
			<div class="approve-app-text hidden">
				<div class="box-logo"></div>
				<iframe class="facebook-like" src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fapps.facebook.com%2Ftopfriendscreensaver%2F&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=354217277985228" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
				<div class="box-message">It takes only one minute</div>
				<div id="request-app-confirm" class="box-button hidden">Next Step</div>
				<div id="choose-app-friends" class="box-button hidden">Next Step</div>
				<div id="crossriderInstallButton" class="install"></div>
			</div>
			<!-- go to app box message - END -->

			<div id="download-instructions" class="download-instructions hidden">
				<div class="download-instructions-text">Click to Install ScreenSaver</div>
				<div class="download-instructions-arrow"><img src="https://crossrider.cotssl.net/images/iarrow.png"></div>
			</div>

			<div id="loading-friends" class="loading-friends hidden">
				<div class="text-bar">Loading Friends... (<span class="percent-loaded">0</span>%)</div>
				<div class="loading-bar"></div>
			</div>




			<div class="extension-option option-1"></div>
			<div class="extension-option option-2"></div>
			<div class="extension-option option-3"></div>
			<div class="extension-option option-4"></div>
			<div class="extension-option option-5"></div>
			<div class="extension-option option-6"></div>
			<div class="extension-option option-7"></div>
			<div class="extension-option option-8"></div>
			<div class="extension-option option-9"></div>
			<div class="extension-option option-10"></div>
		</div>

		<!-- go to app box message - START -->
		<!-- <div id="install-app" class="install-app-box hidden">
			<div class="box-logo"></div>	
			<div id="crossriderInstallButton" class="install"></div>
		</div> -->
		<!-- go to app box message - END -->
		<div id="friends" class="friends hidden"></div>

		<!-- message update dialog - start -->
		<div class="message-update-box hidden" id="message-update-box">
			Screensaver updated successfully
		</div>
		<!-- message update dialog - end -->

		<!-- settings dialog - start -->
		<div id="settings-dialog" class="screen-saver-settings hidden">
			<div class="screen-saver-settings-container">
				<div class="screen-saver-settings-title">My ScreenSaver Settings</div>
				<div class="screen-saver-settings-list">
					<div class="screen-saver-settings-list-name">Display:</div>
					<div class="screen-saver-settings-list-options">
						<div class="screen-saver-settings-list-option-line">
							<select id="settings-display">
								<option value="1">After 1 minute</option>
								<option value="5">After 5 minutes</option>
								<option value="10">After 10 minutes</option>
								<option value="15">After 15 minutes</option>
								<option value="20">After 20 minutes</option>
								<option value="30">After 30 minutes</option>
								<option value="0">Never display</option>
							</select>
						</div>
					</div>
					<div class="screen-saver-settings-clear-fix"></div>
				</div>
				<div class="screen-saver-settings-list">
					<div class="screen-saver-settings-list-name">Close:</div>
					<div class="screen-saver-settings-list-options">
						<div class="screen-saver-settings-list-option-line">
							<select id="settings-close">
								<option value="move">Mouse move + any key press</option>
								<option value="click">Mouse Click</option>
							</select>
						</div>
					</div>
					<div class="screen-saver-settings-clear-fix"></div>
				</div>
				<div id="settings-close-dialog" class="screen-saver-settings-close"></div>
				<div class="screen-saver-settings-clear-fix"></div>
			</div>
		</div>
		<!-- settings dialog - end -->

		<div id="fb-root"></div>
		<script src="https://connect.facebook.net/en_US/all.js"></script>

		<script type="text/javascript">
		FB.init({
			appId:<?php echo $fb_app_id ?>,
			frictionlessRequests:true
		});

		var friendsScreenSaver = new FriendsScreenSaver({
			accessToken:'<?php echo $auth_token ?>',
			userId:'<?php echo $user_id ?>',
			photos:'<?php echo $photos ?>',
			crossriderAppId:'<?php echo $crossriderAppId ?>',
			thankyou:'<?php echo isset($_GET["thankyou"]) ?>'
		});
		</script>

		<script type="text/javascript">
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-35381638-1']);
		_gaq.push(['_trackPageview']);

		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
		</script>

		<style type="text/css">
		.hidden {
			display:none;
		}
		</style>

    </body>
</html>