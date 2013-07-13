<?php
if (isset($_GET['fb_action_types']) && $_GET['fb_action_types'] == 'topfriendscreensaver:add') {
	header('Location:https://apps.facebook.com/topfriendscreensaver/?ref=topfriendscreensaver:add');
	die();
}
?>
<html>

	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# mmmscreensaver: http://ogp.me/ns/fb/mmmscreensaver#">
		<meta property="fb:app_id" content="103821159765711" /> 
		<meta property="og:type"   content="mmmscreensaver:screensaver" /> 
		<meta property="og:url"    content="Put your own URL to the object here" /> 
		<meta property="og:title"  content="Sample Screensaver" /> 
		<meta property="og:image"  content="http://www.nikitastudios.com/images/logo128x128.png" /> 	
	</head>

	<body
	</body>

 </html>