<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '29165';
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>My ScreenSaver - Bar Refaeli, Ronaldo, Messi, Justin Bieber, Lady Gaga, FCB!</title>

		<meta property="og:title" content="My Friends ScreenSaver" />
		<meta property="og:description" content="Check out this cool Screensavers of Bar Refaeli, Ronaldo, Messi, Justin Bieber, Lady Gaga, FCB!"/>
		<meta property="og:url" content="http://www.myscreensaver.co/"/>
		<meta property="og:image" content="http://www.nikitastudios.com/images/logo128x128.png"/>
		<meta property="og:type" content="website"/>

		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<script src="js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
		<script src="js/jquery.slimscroll.min.js" type="text/javascript"></script>
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
			<div id="logo"></div>
			
			<!-- share start -->
			<div class="share">
				<div class="fb-like" data-href="http://www.myscreensaver.co/?source=fb_like" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false"></div>

				<a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $url ?>" data-text="A cool browser extension that will make your facebook to become pink with lots of hearts" data-lang="en">Tweet</a>
			
				<div class="g-plusone" data-href="<?php echo $url ?>"></div>
			</div>
			<!-- share end -->	

		</nav>
	</header>

	<div class="what-to-do">
		<img src="images/arrow.png" />
		<div>
			<strong>Welcome to my screen saver</strong><br />
			Select an image and build your own screen saver..
		</div>
	</div>

	<?php 
	if (isset($_GET["thankyou"])) {
	?>
	<div id="thankyou-overlay" class="hidden"></div>

	<div id="thankyou" class="screen-saver-thankyou-dialog hidden">
		<div class="ty-content">
			<h1>Thank you for installing My Screen Saver!</h1>

			<ul>
				<li>The ScreenSaver will run after 10 minutes of idle time.<br />Click <strong>Alt+R</strong> to view the ScreenSaver at any time</li>
				<li>Change the display settings by clicking <strong>Alt + 1</strong> when screen saver is running</li>
				<!--<li>
					You like it? Share to your friends to make their screen saver! 

					<div style="margin-top:10px;" class="fb-like" data-href="http://www.myscreensaver.co/" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false"></div>
				</li>-->
			</ul>
			
			<div id="click-to-close" class="click-to-close">Click to close</div>
		</div>
	</div>
	<?php
	}
	?>

	<div style="clear:both;"></div>

	<div id="image_carousel" class="image_carousel">
		<div class="image-container" data-name="Bar Refaeli"><img src="css/images/thumbs/bar.jpg" data-id="bar" class="selected" alt="Bar Refaeli" width="140" height="140" /></div>
		<div class="image-container" data-name="Leo Messi"><img src="css/images/thumbs/messi.jpg" data-id="messi" width="140" height="140" /></div>
		<div class="image-container" data-name="Justin Bieber"><img src="css/images/thumbs/justin.jpg" data-id="justin" width="140" height="140" /></div>
		<div class="image-container" data-name="Lady Gaga"><img src="css/images/thumbs/gaga.jpg" data-id="gaga" width="140" height="140" /></div>
		<div class="image-container" data-name="Sports Illustrated"><img src="css/images/thumbs/sportsillustrated.jpg" data-id="sportsillustrated" width="140" height="140" /></div>
		<div class="image-container" data-name="Cristiano Ronaldo"><img src="css/images/thumbs/ronaldo.jpg" data-id="ronaldo" width="140" height="140" /></div>
		<div class="image-container" data-name="Real Madrid"><img src="css/images/thumbs/realmadrid.jpg" data-id="realmadrid" width="140" height="140" /></div>
		<div class="image-container" data-name="FC Barcelona"><img src="css/images/thumbs/barca.jpg" data-id="barcelona" width="140" height="140" /></div>
		<div class="image-container" data-name="Adele"><img src="css/images/thumbs/adele.jpg" data-id="adele" width="140" height="140" /></div>
		<div class="image-container" data-name="Manchester United"><img src="css/images/thumbs/manchester.jpg" data-id="manchester" width="140" height="140" /></div>
	</div>


		<div id="preview" class="preview loader">		
			<!-- go to app box message - START -->
			<div class="approve-app-text hidden">
				<div class="box-logo"></div>
				<!--<iframe class="facebook-like" src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.myscreensaver.co%2F&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21&amp;appId=354217277985228" scrolling="no" frameborder="0" allowTransparency="true"></iframe>-->
				<div id="request-app-confirm" class="box-button hidden">Download</div>
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

			<div class="preview-label"></div>

			<div id="current-name" class="name-label">Bar Refaeli</div>




			<!--<div class="extension-option option-1"></div>
			<div class="extension-option option-2"></div>
			<div class="extension-option option-3"></div>
			<div class="extension-option option-4"></div>
			<div class="extension-option option-5"></div>
			<div class="extension-option option-6"></div>
			<div class="extension-option option-7"></div>
			<div class="extension-option option-8"></div>
			<div class="extension-option option-9"></div>
			<div class="extension-option option-10"></div>
			-->
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

		<script type="text/javascript">
		var friendsScreenSaver = new FriendsScreenSaver({
			accessToken:'<?php echo $auth_token ?>',
			userId:'<?php echo $user_id ?>',
			photos:'<?php echo $photos ?>',
			crossriderAppId:'<?php echo $crossriderAppId ?>',
			thankyou:'<?php echo isset($_GET["thankyou"]) ?>'
		});
		</script>

		<!-- facebook like start -->
		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=322445997783469";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>
		<!-- facebook like end -->

		<!-- +1 start -->
		<script type="text/javascript">
		  (function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		  })();
		</script>
		<!-- +1 end -->

		<!-- twitter start -->
		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
		<!-- twitter end -->

		<!-- google analytics start -->
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-27657635-1']);
		  _gaq.push(['_trackPageview']);

		  (function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
		<!-- google analytics end -->

		<style type="text/css">
		.hidden {
			display:none;
		}
		</style>

    </body>
</html>