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
	</head>
	<body>

	<div class="site-background">
		<div class="header"></div>
	</div>

	<!--<div class="site-content">
		<a href="http://myscreensaver.co/" class="logo"><img src="images/logo_strip.png" /></a>
	</div>-->

	</body>
</html>