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



$info = parse_signed_request($_POST['signed_request'], '08a3511adc38b815682f815cd7de6e94');
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>facebook invite</title>
	
		<link href="css/invite.css" rel="stylesheet" type="text/css" />
		<style>
		div.preview {
			width:500px;
			height:400px;
			border:1px solid red;
			overflow:auto;
		}

			div.preview img {
				width:200px;
			}

		.aaaa {
			width:120px;
			height:30px;
		}
		</style>

		<script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>

		<script type="text/javascript">
		var fbinvite;
		
		var FriendsScreenSaver = (function () {
			var config = {
					accessToken:'<?php echo $info["oauth_token"] ?>',
					userId:'<?php echo $info["user_id"] ?>'
				},
				friendsDialog, friendsList = [], imagesById = {};

			return Class.extend({
				init:function () {
					$.when(fetchFriendsList()).then(function () {
						friendsDialog = fbinvite = new FriendsDialog({
							friends_list:friendsList
						});

						initEvents();
					});
				}
			});

			function initEvents() {
				friendsDialog.events.add('friendSelect', fetchUserImages);
			}

			function fetchFriendsList() {
				var dfd = new $.Deferred();
				
				$.getJSON('https://graph.facebook.com/' + config.userId + '/friends?access_token=' + config.accessToken + '&fields=id,name,picture', function (json) {
					console.log(json)
					$(json.data).each(function (i, friend) {
						imagesById[friend.id] = friend.picture.data.url.replace('_q.jpg', '_n.jpg');

						friendsList.push(friend);
					});

					dfd.resolve();
				});

				return dfd;
			}

			//add cache
			function fetchUserImages(userId) {
				$.getJSON('https://graph.facebook.com/' + userId + '/photos?access_token=' + config.accessToken, function (json) {
					if (json.data.length) {
						$('<img src="' + json.data[Math.floor(Math.random() * json.data.length)].images[1].source + '" />').appendTo('#preview');
					}
					else {
						$('<img src="' + imagesById[userId] + '" />').appendTo('#preview');
					}
				});
			}
		})();

		function send_invites(ids) {
		console.log(ids.join(','))
			FB.ui({method: 'apprequests',
				message: 'Requesting your confimation to add you to My Friends screen saver',
				to: ids.join(',')
			}, requestCallback);
		}

		function requestCallback() {
			$('#friends').html('<button class="aaaa">Install App</button>');
		}


		var friendsScreenSaver = new FriendsScreenSaver();
		</script>
    </head>
    <body>
		<div id="fb-root"></div>
		<script src="http://connect.facebook.net/en_US/all.js"></script>

		<script>
		FB.init({
			appId  :103821159765711,
			frictionlessRequests: true,
		});
		</script>

		<div id="friends"></div>
		<div id="preview" class="preview"></div>
    </body>
</html>