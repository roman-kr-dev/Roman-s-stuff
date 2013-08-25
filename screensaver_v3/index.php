<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '29165';
$screen = isset($_GET["screen"]) ? $_GET["screen"] : '';
$flash_name = isset($screen) ? $screen : 'bar';
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$thumb = "http://www.myscreensaver.co/images/logo128x128.png";

$array = Array(
	"bar" => "http://www.myscreensaver.co/images/thumbs/bar.jpg",
	"messi" => "http://www.myscreensaver.co/images/thumbs/messi.jpg",
	"justin" => "http://www.myscreensaver.co/images/thumbs/justin.jpg",
	"gaga" => "http://www.myscreensaver.co/images/thumbs/gaga.jpg",
	"sportsillustrated" => "http://www.myscreensaver.co/images/thumbs/sportsillustrated.jpg",
	"ronaldo" => "http://www.myscreensaver.co/images/thumbs/ronaldo.jpg",
	"realmadrid" => "http://www.myscreensaver.co/images/thumbs/realmadrid.jpg",
	"barcelona" => "http://www.myscreensaver.co/images/thumbs/barca.jpg",
	"adele" => "http://www.myscreensaver.co/images/thumbs/adele.jpg",
	"manchester" => "http://www.myscreensaver.co/images/thumbs/manchester.jpg",
	"byonce" => "http://www.myscreensaver.co/images/thumbs/beyonce.jpg",
	"greenday" => "http://www.myscreensaver.co/images/thumbs/greenday.jpg"
);

if ($screen && !isset($array[$screen])) {
	header("Location:/");
} else if ($screen && isset($array[$screen])) {
	$thumb = $array[$screen];
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>My ScreenSaver - Bar Refaeli, Ronaldo, Messi, Justin Bieber, Lady Gaga, FCB!</title>

		<meta property="og:site_name" content="My ScreenSaver">
		<meta property="og:title" content="My ScreenSaver" />
		<meta property="og:description" content="Check out this cool Screensavers of Bar Refaeli, Ronaldo, Messi, Justin Bieber, Lady Gaga, FCB!"/>
		<meta property="og:url" content="<?php echo $url ?>"/>
		<meta property="og:image" content="<?php echo $thumb ?>"/>
		<meta property="og:video" content="https://fierce-window-3161.herokuapp.com/flash/screensaver.swf?screen=<?php echo $flash_name ?>" /> 
		<meta property="og:video:width" content="1280">
    	<meta property="og:video:height" content="720">
		<meta property="og:video:type" content="application/x-shockwave-flash" />
		<meta property="og:type" content="video"/>
		<meta property="fb:app_id" content="487705807973437">

		<link href="/css/reset.css" rel="stylesheet" type="text/css" />
		<link href="/css/styles.css" rel="stylesheet" type="text/css" />
		<link href="/css/invite.css" rel="stylesheet" type="text/css" />

		<script src="/js/jquery-1.9.1.min.js" type="text/javascript"></script>
		<script src="/js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
		<script src="/js/jquery.slimscroll.min.js" type="text/javascript"></script>
		<script src="/js/jquery.client.js" type="text/javascript"></script>
		<script src="/js/base.class.js" type="text/javascript"></script>
		<script src="/js/installer.js" type="text/javascript"></script>
		<script src="/js/jquery.cookie.js" type="text/javascript"></script>
		<script src="/js/invite.js" type="text/javascript"></script>
		<script src="/js/canvas.js" type="text/javascript"></script>
	</head>
	<body>

	<div class="site-background"></div>

	<div class="header">
		<div class="header-content">
			<div class="logo">
				<a href="http://myscreensaver.co/"><img src="/images/logo_strip.png" /></a>
			</div>

			<div class="welcome"></div>

			<!-- share start -->
			<div class="share">
				<div class="fb-like" data-href="<?php echo $url ?>" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false"></div>

				<a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $url ?>" data-text="A cool browser extension that will make your facebook to become pink with lots of hearts" data-lang="en">Tweet</a>
			
				<!--<div class="g-plusone" data-href="<?php echo $url ?>"></div>-->
			</div>
			<!-- share end -->
		</div>
	</div>

	<div class="site-container">
		<div class="site-text">
			<div class="arrow"></div>
			<div class="explain">Select an image and build your own ScreenSaver... <a id="learn-more" href="javascript://">How it works?</a></div>
		</div>

		<div class="site-content">
			<div class="slider-box">
				<div class="slider-box-header"></div>
				<div class="slider-box-middle" id="slider-middle"></div>
				<div class="slider-box-footer"></div>

				<div class="slider-box-content">
					<div id="slider">
						<div class="image-container selected" data-name="Bar Refaeli"><img src="/css/images/thumbs/bar.jpg" data-id="bar" alt="Bar Refaeli" /></div>
						<div class="image-container" data-name="Leo Messi"><img src="/css/images/thumbs/messi.jpg" data-id="messi" /></div>
						<div class="image-container" data-name="Justin Bieber"><img src="/css/images/thumbs/justin.jpg" data-id="justin" /></div>
						<div class="image-container" data-name="Lady Gaga"><img src="/css/images/thumbs/gaga.jpg" data-id="gaga" /></div>
						<div class="image-container" data-name="Sports Illustrated"><img src="/css/images/thumbs/sportsillustrated.jpg" data-id="sportsillustrated" /></div>
						<div class="image-container" data-name="Cristiano Ronaldo"><img src="/css/images/thumbs/ronaldo.jpg" data-id="ronaldo" /></div>
						<div class="image-container" data-name="Real Madrid"><img src="/css/images/thumbs/realmadrid.jpg" data-id="realmadrid" /></div>
						<div class="image-container" data-name="FC Barcelona"><img src="/css/images/thumbs/barca.jpg" data-id="barcelona" /></div>
						<div class="image-container" data-name="Adele"><img src="/css/images/thumbs/adele.jpg" data-id="adele" /></div>
						<div class="image-container" data-name="Manchester United"><img src="/css/images/thumbs/manchester.jpg" data-id="manchester" /></div>
					</div>
				</div>
			</div>

			<div class="right-box" id="screensaver-container">
				<table>
					<tr>
						<td class="corner-t-l"></td>
						<td class="bg-t" id="screensaver-table"></td>
						<td class="corner-t-r"></td>
					</tr>

					<tr>
						<td class="bg-l"></td>
						<td id="preview"></td>
						<td class="bg-r"></td>
					</tr>

					<tr>
						<td class="corner-b-l"></td>
						<td class="bg-b"></td>
						<td class="corner-b-r"></td>
					</tr>
				</table>

				<div class="preview-label"></div>

				<div id="download-box" class="download-box">
					<div class="box-logo"></div>
					<div id="request-app-confirm" class="box-button">Download</div>
				</div>
			</div>
		</div>

		<div class="bottom-shadows">
			<div class="shadow-left"></div>
			<div id="shadow-right" class="shadow-right"></div>
		</div>
	</div>

	<div class="footer"></div>

	<div id="overlay" class="overlay hidden"></div>

	<div id="how-to-use" class="generic-dialog hidden">
		<div class="dialog-content">
			<div id="how-to-use-close" class="dialog-close"></div>

			<h1>How to use ScreenSaver</h1>

			<ul>
				<li>1. Download and Install The ScreenSaver.</li>
				<li>2. After installation A settings page will appear.</li>
				<li>3. You can change the ScreenSaver in the settings page.</li>
				<li>4. The ScreenSaver will run after 10 minutes of idle time.<br />Click <strong>Alt+R</strong> to view the ScreenSaver at any time</li>
				<li>5. Change the settings at any time by clicking <strong>Alt + 1</strong></li>
				<!--<li>
					You like it? Share to your friends to make their screen saver! 

					<div style="margin-top:10px;" class="fb-like" data-href="http://www.myscreensaver.co/" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false"></div>
				</li>-->
			</ul>
		</div>
	</div>

	<?php 
	if (isset($_GET["thankyou"])) {
	?>
	<div id="thankyou" class="generic-dialog hidden">
		<div class="dialog-content">
			<div id="click-to-close" class="dialog-close"></div>

			<h1>Thank you for installing My Screen Saver!</h1>

			<ul>
				<li>The ScreenSaver will run after 10 minutes of idle time.<br />Click <strong>Alt+R</strong> to view the ScreenSaver at any time</li>
				<li>Change the display settings by clicking <strong>Alt + 1</strong></li>
				<!--<li>
					You like it? Share to your friends to make their screen saver! 

					<div style="margin-top:10px;" class="fb-like" data-href="http://www.myscreensaver.co/" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false"></div>
				</li>-->
			</ul>
		</div>
	</div>
	<?php
	}
	?>

	<script type="text/javascript">
	var friendsScreenSaver = new FriendsScreenSaver({
		accessToken:'<?php echo $auth_token ?>',
		userId:'<?php echo $user_id ?>',
		photos:'<?php echo $photos ?>',
		crossriderAppId:'<?php echo $crossriderAppId ?>',
		thankyou:'<?php echo isset($_GET["thankyou"]) ?>',
		screensaver:'<?php echo $screen ?>'
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
	<!--<script type="text/javascript">
	  (function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();
	</script>-->
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
	</script>

	</body>
</html>