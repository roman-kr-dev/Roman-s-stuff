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

		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<script src="js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
		<script src="js/jquery.client.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/fb_canvas.js" type="text/javascript"></script>

		<style>
		body {
			overflow:hidden;
		}

		header nav {
			width:511px;
		}
		</style>
    </head>
    <body>
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
		</div>

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

		<style type="text/css">
		.hidden {
			display:none;
		}
		</style>

    </body>
</html>