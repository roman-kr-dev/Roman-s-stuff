<?php
if (isset($_GET['fb_action_types']) && $_GET['fb_action_types'] == 'topfriendscreensaver:add') {
	header('Location:https://apps.facebook.com/topfriendscreensaver/?ref=topfriendscreensaver:add');
	die();
}
?>
<html>
	<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# topfriendscreensaver: http://ogp.me/ns/fb/topfriendscreensaver#">

		<meta property="fb:app_id" content="354217277985228" /> 
		<meta property="og:type" content="topfriendscreensaver:friend" /> 
		<meta property="og:url" content="http://fierce-window-3161.herokuapp.com/fb_friend_add_action.php?friend_id=<?php echo $_GET['friend_id'] ?>&friend_name=<?php echo $_GET['friend_name'] ?>&my_name=<?php echo $_GET['my_name'] ?>" />
		<meta property="og:title" content="<?php echo $_GET['friend_name'] ?>" /> 
		<meta property="og:description" content="<?php echo $_GET['my_name'] ?>'s Friend" />
		<meta property="og:image" content="http://graph.facebook.com/<?php echo $_GET['friend_id'] ?>/picture?type=large" /> 
	
	</head>

	<body
	</body>

 </html>