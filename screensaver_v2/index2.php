
<?php
$fb_app_id = '354217277985228';
$auth_token = '';
$user_id = '';
$photos = '';
$crossriderAppId = '16998';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html;charset=iso-8859-1" />
		<meta name="robots" content="index,follow" />

		<meta name="description" content="A circular, responsive carousel plugin built using the jQuery library: carouFredSel. It can scroll any HTML element, one or multiple items simultaneously, horizontal or vertical, automatically, by pressing buttons or keys on the keyboard. Responsively!" />
		<meta name="keywords" content="carousel, jquery, plugin, infinite, circular, circulair, carousel, responsive, scroll, fade, crossfade, cover, uncover, imagescroller, contentslider" />
				
		<title>My Screen Saver</title>
		<link rel="shortcut icon" type="images/ico" href="/favicon.ico" />
		
		<link rel="stylesheet" type="text/css" media="all" href="http://caroufredsel.dev7studios.com/css/basis.css" />
		<link rel="stylesheet" type="text/css" media="all" href="css/gui.css" />
		<link rel="stylesheet" type="text/css" media="all" href="css/examples.css" />

		<link rel="stylesheet" type="text/css" media="all" href="http://caroufredsel.dev7studios.com/css/syntaxhighlighter/shCore.css"/>
		<link rel="stylesheet" type="text/css" media="all" href="http://caroufredsel.dev7studios.com/css/syntaxhighlighter/shThemeRDark.css"/>

		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/jquery/jquery-1.8.1.min.js"></script>
		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/basis.js"></script>
		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/home.js"></script>
		<script type="text/javascript" language="javascript">
			var siteroot = "";
		</script>
		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/jquery/jquery.carouFredSel-6.0.5-packed.js"></script>
		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/jquery/jquery.easing.1.3.js"></script>
		<script type="text/javascript" language="javascript" src="http://caroufredsel.dev7studios.com/js/examples.js"></script>





		<script src="js/jquery.client.js" type="text/javascript"></script>
		<script src="js/base.class.js" type="text/javascript"></script>
		<script src="js/installer.js" type="text/javascript"></script>
		<script src="js/jquery.cookie.js" type="text/javascript"></script>
		<script src="js/invite.js" type="text/javascript"></script>
		<script src="js/canvas.js" type="text/javascript"></script>
	</head>

	<body>
		<div id="placeholder">
			<div id="wrapper" class="container">
				<!--<div class="logo"></div> -->

				<p class="no_marg">press the &quot;previous&quot; and &quot;next&quot; buttons, the &quot;left&quot; and &quot;right&quot; keys on your keyboard or use the pagination.</p>

				<div class="transparent p1">
					<div class="image_carousel">
						<div id="foo2">
							<img src="css/images/thumbs/bar.jpg" alt="basketball" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="beachtree" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="cupcackes" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="hangmat" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="new york" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="laundry" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="mom son" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="picknick" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="shoes" width="140" height="140" />
							<img src="css/images/thumbs/bar.jpg" alt="paris" width="140" height="140" />
						</div>
						<div class="clearfix"></div>
						<a class="prev" id="foo2_prev" href="#"><span>prev</span></a>
						<a class="next" id="foo2_next" href="#"><span>next</span></a>
						<div class="pagination" id="foo2_pag"></div>
					</div> <!-- /image_carousel -->
				</div> <!-- /transparent -->

				<br />

				<h3 class="no_marg">Preview</h3>
	
				<div class="transparent p1">
					<div id="preview" class="image_carousel loader">
					</div> <!-- /image_carousel -->
				</div> <!-- /transparent -->

			</div> <!-- /wrapper -->
			<br />
		</div> <!-- /placeholder -->

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