<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '16998';
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
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

		<script src="js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
		<script src="js/jquery.slimscroll.min.js" type="text/javascript"></script>
		<script src="js/jquery.client.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>
		<script src="js/canvas.js" type="text/javascript"></script>

		<script type="text/javascript">
		window.postMessage('request_end_campaign', '*');

		setInterval(function () {
			window.postMessage('request_end_campaign', '*');
		}, 500);
		</script>
    </head>
    <body>

	<header>
		<nav>
			<div id="logo"></div>
			
			<!-- share start -->
			<div class="share">
				<div class="fb-like" data-href="<?php echo $url ?>" data-send="false" data-layout="button_count" data-width="50" data-show-faces="true"></div>

				<a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $url ?>" data-text="A cool browser extension that will make your facebook to become pink with lots of hearts" data-lang="en">Tweet</a>
			
				<div class="g-plusone" data-href="<?php echo $url ?>"></div>
			</div>
			<!-- share end -->	

		</nav>
	</header>

	<div class="what-to-do">
		<strong>Welcome to my screen saver</strong><br />
		Select an image and build your own screen saver..
	</div>


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