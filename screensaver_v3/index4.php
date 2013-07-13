<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '29165';
$screen = isset($_GET["screen"]) ? $_GET["screen"] : '';
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
$thumb = "http://www.nikitastudios.com/images/logo128x128.png";

$array = Array(
	"bar" => "http://www.nikitastudios.com/images/css/images/thumbs/bar.jpg",
	"messi" => "http://www.nikitastudios.com/images/css/images/thumbs/messi.jpg",
	"justin" => "http://www.nikitastudios.com/images/css/images/thumbs/justin.jpg",
	"gaga" => "http://www.nikitastudios.com/images/css/images/thumbs/gaga.jpg",
	"sportsillustrated" => "http://www.nikitastudios.com/images/css/images/thumbs/sportsillustrated.jpg",
	"ronaldo" => "http://www.nikitastudios.com/images/css/images/thumbs/ronaldo.jpg",
	"realmadrid" => "http://www.nikitastudios.com/images/css/images/thumbs/realmadrid.jpg",
	"barcelona" => "http://www.nikitastudios.com/images/css/images/thumbs/barca.jpg",
	"adele" => "http://www.nikitastudios.com/images/css/images/thumbs/adele.jpg",
	"manchester" => "http://www.nikitastudios.com/images/css/images/thumbs/manchester.jpg",
	"byonce" => "http://www.nikitastudios.com/images/css/images/thumbs/beyonce.jpg",
	"greenday" => "http://www.nikitastudios.com/images/css/images/thumbs/greenday.jpg"
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

		<meta property="og:title" content="My ScreenSaver" />
		<meta property="og:description" content="Check out this cool Screensavers of Bar Refaeli, Ronaldo, Messi, Justin Bieber, Lady Gaga, FCB!"/>
		<meta property="og:url" content="<?php echo $url ?>"/>
		<meta property="og:image" content="<?php echo $thumb ?>"/>
		<meta property="og:type" content="website"/>

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

	<div class="site-background">
		<div class="header">
			<div class="logo">
				<a href="http://myscreensaver.co/"><img src="images/logo_strip.png" /></a>
			</div>
		</div>
	</div>

	<div class="site-container">
		<div class="site-text"></div>

		<div class="site-content">
			<div class="slider-box">
				<div class="slider-box-header"></div>
				<div class="slider-box-content" id="slider"></div>
				<div class="slider-box-footer"></div>
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
			</div>
		</div>

		<div class="bottom-shadows">
			<div class="shadow-left"></div>
			<div class="shadow-right"></div>
		</div>
	</div>

	<div class="footer"></div>

	<script type="text/javascript">
	var friendsScreenSaver = new FriendsScreenSaver({
		accessToken:'',
		userId:'',
		photos:'',
		crossriderAppId:'29165',
		thankyou:'',
		screensaver:''
	});
	</script>

	<script type="text/javascript">
	var screenHeight = $(window).height(),
		screenWidth = $(window).width();

	$('#slider').height(screenHeight - 440);
	$('#screensaver-container').height(screenHeight - 321).width(screenWidth * .9 - 220);
	$('#screensaver-table').width(screenWidth * .9 - 220 - 44);

	initPreviewIframe();

	function initPreviewIframe() {
		var iframe = $('<iframe id="preview-iframe" src="/preview.php" frameborder="0" scrolling="no"></iframe>'),
			preview = $('#preview');
		
		iframe.width(preview.width()).height(preview.height()).appendTo(preview);
	}
	</script>

	</body>
</html>