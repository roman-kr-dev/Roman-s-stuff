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
	
		<link href="css/reset.css" rel="stylesheet" type="text/css" />
		<link href="css/styles.css" rel="stylesheet" type="text/css" />
		<link href="css/invite.css" rel="stylesheet" type="text/css" />

		<style>
		body {
			font-family:"lucida grande", tahoma, verdana, arial, sans-serif;
		}

		.hidden {
			display:none;
		}

		h1.header-title {
			margin-top:20px;
		}

		div.header-sub-title {
			font-size:12px;
			margin-top:4px;
			margin-bottom:10px;
		}

		div.friends {
			margin-top:10px;
			height:300px;
		}

		div.install {
			margin-top:10px;
			height:130px;
			text-align:center;
		}

			div.install a {
				margin-top:40px;
			}
		
		iframe.preview {
			width:738px;
			height:400px;
			border:1px solid #CCC;
			overflow:auto;
		}

			div.preview img {
				width:200px;
			}
		</style>

		<script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>
		<script type="text/javascript" src="https://crossrider.cotssl.net/javascripts/installer/installer.js"></script>

		<script type="text/javascript">
		var fbinvite;
		
		var FriendsScreenSaver = (function () {
			var config = {
					accessToken:'<?php echo $info["oauth_token"] ?>',
					userId:'<?php echo $info["user_id"] ?>',
					initialFriends:40
				},
				iframeScreenSaver, friendsDialog, friendsList = [], selectedFriendsList = [], imagesById = {};

			return Class.extend({
				init:function () {
					$.when(fetchFriendsList()).then(function () {
						friendsDialog = fbinvite = new FriendsDialog({
							friends_list:friendsList
						});

						initEvents();
						initInstallButton();
						selectInitalFriends();
					});
				},

				bindIframeWindow:function (screenSaver) {
					iframeScreenSaver = screenSaver;

					populateInitialFriendsIframe();

					return this;
				},

				invite:function (ids) {
					invite(ids);
				},

				skip:function () {
					showInstallWidget();
				},

				requestCallback:function (requestData) {
					if (requestData) {
						showInstallWidget();
					}
				}
			});

			function initEvents() {
				$('#choose-friends').on('click', chooseFriends);
				
				friendsDialog.events.add('friendSelect', fetchUserImages);
			}

			function initInstallButton() {
				var __CRI = new crossriderInstaller({
					app_id:13460,
					app_name:'ScreenSaver'
				});

				var _cr_button = new __CRI.button({
					button_size:'big',
					color:'green'
				});
			}

			function fetchFriendsList() {
				var dfd = new $.Deferred();
				
				$.getJSON('https://graph.facebook.com/' + config.userId + '/friends?access_token=' + config.accessToken + '&fields=id,name,picture', function (json) {
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

			function chooseFriends() {
				FB.ui({method: 'apprequests',
				message: 'My Great Request',
			  }, requestCallback);
			}

			function selectInitalFriends() {	
				selectedFriendsList = [].concat(friendsList).sort(function () {
					return Math.round(Math.random()) - 0.5; 
				}).slice(0, config.initialFriends);
			}

			function populateInitialFriendsIframe() {
				iframeScreenSaver.setBulkFriends(getSelectedImages(selectedFriendsList.slice(0, 10)));
			}

			function getSelectedIds(list) {
				var arr = [];

				$.each(list, function (key, item) {
					arr.push(item.id);
				});

				return arr;
			}

			function getSelectedImages(list) {
				var arr = [];

				$.each(list, function (i, item) {
					arr.push({id:item.id, url:imagesById[item.id]});
				});

				return arr;
			}

			function invite(ids) {
				var ids = ids.length ? ids : getSelectedIds(selectedFriendsList);

				//ids = ['762152935', '741788813'];

				FB.ui({method: 'apprequests',
					message: 'Requesting your confimation to add you to My Friends screen saver',
					to: ids.join(',')
				}, friendsScreenSaver.requestCallback);
			}

			function showInstallWidget() {
				$('#friends').fadeOut('slow', function () {
					$('#crossriderInstallButton').fadeIn('slow');
				});
			}
		})();

		var friendsScreenSaver = new FriendsScreenSaver();
		</script>
    </head>
    <body>
		<div style="width:740px;background:#fafafa;">
			<h1 class="header-title">Choose Your Friends!</h1>
			<div class="header-sub-title">This is a short description about the app and on what you need to do</div>

			<div id="crossriderInstallButton" class="install hidden"></div>
			<div id="friends" class="friends"></div>
			<iframe id="preview" class="preview" src="preview.html" frameborder="0" scrolling="no"></iframe>
		</div>

		<div id="fb-root"></div>
		<script src="https://connect.facebook.net/en_US/all.js"></script>

		<script type="text/javascript">
		FB.init({
			appId  :103821159765711
			//frictionlessRequests: true,
		});
		</script>
    </body>
</html>