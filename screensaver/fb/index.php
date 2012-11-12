<?php
function parse_signed_request($signed_request, $secret) {
  list($encoded_sig, $payload) = explode('.', $signed_request, 2); 

  // decode the data
  $sig = base64_url_decode($encoded_sig);
  $data = json_decode(base64_url_decode($payload), true);

  if (strtoupper($data['algorithm']) !== 'HMAC-SHA256') {
    error_log('Unknown algorithm. Expected HMAC-SHA256');
    return null;
  }

  // check sig
  $expected_sig = hash_hmac('sha256', $payload, $secret, $raw = true);
  if ($sig !== $expected_sig) {
    error_log('Bad Signed JSON signature!');
    return null;
  }

  return $data;
}

function base64_url_decode($input) {
  return base64_decode(strtr($input, '-_', '+/'));
}

$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';

if (isset($_POST['signed_request'])) {
	if ($_SERVER['HTTP_HOST'] == 'fierce-window-3161.herokuapp.com') {
		$secret = 'e4531c9277859d46b03cccd93ebba160';
		$crossriderAppId = '16998';	
	}
	else {
		$secret = '08a3511adc38b815682f815cd7de6e94';
		$crossriderAppId = '16999';
		$fb_app_id = '103821159765711';
	}

	$info = parse_signed_request($_POST['signed_request'], $secret);

	if (isset($info["oauth_token"])) {
		$user_id = $info["user_id"];
		$auth_token = $info["oauth_token"];
	}
}

if (isset($_GET['photos'])) {
	$photos = $_GET['photos'];
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>facebook invite</title>

		<meta property="og:title" content="My Friends ScreenSaver" />
		<meta property="og:description" content="See the latest photos of your friends and family on this first ever social screensaver"/>
		<meta property="og:url" content="http://apps.facebook.com/topfriendscreensaver/"/>
		<meta property="og:image" content="http://www.nikitastudios.com/images/logo200x200.png"/>

		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css?x=<?php echo rand() ?>" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
		<script src="js/jquery.client.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/invite.js?x=<?php echo rand() ?>" type="text/javascript"></script>
		<script src="js/canvas.js?x=<?php echo rand() ?>" type="text/javascript"></script>
    </head>
    <body>
		<div id="preview" class="preview">
			<!-- <div class="title">Preview</div> -->
			
			<!-- go to app box message - START -->
			<div class="approve-app-text hidden">
				<div class="box-logo"></div>
				<div class="box-message">It takes only one minute</div>
				<div id="request-app-confirm" class="box-button">Next Step</div>
			</div>
			<!-- go to app box message - END -->
		</div>

		<!-- go to app box message - START -->
		<div id="install-app" class="install-app-box hidden">
			<div class="box-logo"></div>	
			<div id="crossriderInstallButton" class="install"></div>
		</div>
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