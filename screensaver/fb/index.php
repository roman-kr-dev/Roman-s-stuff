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



$info = parse_signed_request($_POST['signed_request'], 'e4531c9277859d46b03cccd93ebba160');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>facebook invite</title>
	
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>
		<script src="js/canvas.js" type="text/javascript"></script>
    </head>
    <body>
		<div style="width:760px;background:#fafafa;">
			<h1 class="header-title">Choose Your Friends!</h1>
			<div class="header-sub-title">This is a short description about the app and on what you need to do</div>

			<div id="crossriderInstallButton" class="install hidden"></div>
			<div id="friends" class="friends"></div>
			<div id="preview" class="preview"></div>
		</div>

		<div id="fb-root"></div>
		<script src="https://connect.facebook.net/en_US/all.js"></script>

		<script type="text/javascript">
		FB.init({
			appId  :103821159765711,
			frictionlessRequests:false //true
		});

		var friendsScreenSaver = new FriendsScreenSaver({
			accessToken:'<?php echo $info["oauth_token"] ?>',
			userId:'<?php echo $info["user_id"] ?>'
		});
		</script>
    </body>
</html>