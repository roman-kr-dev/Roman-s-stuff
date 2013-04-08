<?php
$messages = Array(
	"1" => "Doble rainbow song, Is it possible? <a href='http://www.youtube.com/watch?v=MX0D4oZwCsA' target='_blank'>See on YouTube</a>",
	"2" => "How much deeper would the ocean be if sponges didn't grow in it?",
	"3" => "I LOVE Kids React on YouTube, Try it out :) <a href='http://www.youtube.com/watch?v=1DDwh1iKi-0' target='_blank'>See on YouTube</a>",
	"4" => "If you think about fruits before going to sleep, Your dreams will be full of colors.. try it out :)",
	"5" => "Do siamese twins pay for one ticket or two tickets when they go to movies and concerts?",
	"6" => "Never put off the work till tomorrow what you can put off today.",
	"7" => "I LOVE Nyan Cat, It is sooo cute :) <a href='http://www.youtube.com/watch?v=QH2-TGUlwu4' target='_blank'>See on YouTube</a>",
	"8" => "Mr. Piggm's <a href='http://2.bp.blogspot.com/_cQuNB4oopsY/S7yUp58oL1I/AAAAAAAAAGU/EEWdtXZkzQU/s1600/pig.png' target='_blank'>brother</a> says he loves you :)",
	"9" => "Do the English people eat English muffins, or are they just called muffins?",
	"10" => "Don't forget to tell your friends about <a href='http://pinkfacebook.cadoogi.com/' target='_blank' />pink facebook</a> :)"
);

$description = "It will make your facebook to become pink with lots of hearts";
$image = "/roman/pinkfacebook/images/hearts.png";
$message = "";
$url = "http://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

if (isset($_GET['message'])) {
	$message = $messages[ $_GET['message'] ];
	$image = "/roman/pinkfacebook/images/piggm.png";
	$description = "See Mr. Piggm's daily wisdom, Its smart and funny :) | Also make your facebook to become pink with lots of hearts";
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Pink Facebook</title>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<meta property="og:title" content="Pink Facebook" />
		<meta property="og:description" content="<?php echo $description ?>"/>
		<meta property="og:url" content="<?php echo $url ?>"/>
		<meta property="og:image" content="<?php echo $image ?>"/>

		<link rel="stylesheet" href="/roman/pinkfacebook/css/reset.css" />
		<link rel="stylesheet" href="/roman/pinkfacebook/css/styles.css?ver=1" />
		
		<script type="text/javascript" src="https://crossrider.cotssl.net/javascripts/installer/installer.js"></script>

		<script type="text/javascript" src="/roman/pinkfacebook/javascript/jquery-1.7.min.js"></script>
		<script type="text/javascript" src="/roman/pinkfacebook/javascript/jquery.tools.tooltip.js"></script>
		<script type="text/javascript" src="/roman/pinkfacebook/javascript/jquery.sexyslider.min.js"></script>
		<script type="text/javascript" src="/roman/pinkfacebook/javascript/scripts.js"></script>
	</head>

	<body>
		<div class="pink-facebook">
			<!-- share start -->
			<div class="share">
				<div class="fb-like" data-href="<?php echo $url ?>" data-send="false" data-layout="button_count" data-width="50" data-show-faces="true"></div>

				<a href="https://twitter.com/share" class="twitter-share-button" data-url="<?php echo $url ?>" data-text="A cool browser extension that will make your facebook to become pink with lots of hearts" data-lang="en">Tweet</a>
			
				<div class="g-plusone" data-href="<?php echo $url ?>"></div>
			</div>
			<!-- share end -->

			<!-- message start -->
			<?php if ($message != "") { ?>
			<div class="message">
				<div class="message-title">Mr. Piggm's words of wisdom:</div>
				<div class="message-container">
					<div class="message-content"><?php echo $message;?></div>
				</div>
			</div>
			<?php } ?>
			<!-- message end -->

			<!-- header start -->
			<div class="site-content">
				<div class="header">
					<div class="strip">
						<div class="see-comments"><a href="#comments">see comments below</a></div>
					</div>
					<div class="promo">
						<h1 class="logo">Pink Facebook</h1>
						<div class="about">
							<ul>
								<li><h2>Make your facebook to become pink with lots of hearts <img src="/roman/pinkfacebook/images/tinyheart.gif" /></h2></li>
								<li><h2>Add Mr. Piggm to be your friend</h2></li>
								<li><h2>Tell all your friends about your new cute facebook look</h2></li>
							</ul>
						</div>
						<div id="install" class="install"></div>
					</div>

					<div class="hearts"></div>
				</div>
				<!-- header end -->

				<!-- preview start -->
				<div class="preview">
					<div class="top"></div>
					<div class="box">
						<div class="box-top"></div>
						<div class="box-bg"></div>
						<div class="box-bottom"></div>

						<div class="box-content">
							<div id="slider">
								<img src="/roman/pinkfacebook/images/screen/screen1.png" />
								<img src="/roman/pinkfacebook/images/screen/screen2.png" />
								<img src="/roman/pinkfacebook/images/screen/screen3.png" />
							</div>

							<div id="control"></div>
						</div>
					</div>
					<div class="bottom"></div>
				</div>
				<!-- preview end -->

				<!-- comments - start -->
				<div class="comments">
					<a name="comments"></a>
					<div class="fb-comments" data-href="/roman/pinkfacebook" data-num-posts="5" data-width="559"></div>
				</div>
				<!-- comments - end -->

				<div class="filler"></div>
			</div>
		</div>

		<!-- footer start -->
		<div class="footer">
			<div class="piggm" title="Mr. Piggm"></div>
			<div class="caption">I just love pink Facebook!</div>

			<div class="contact"><span href="/contact.htm">&#8680; Contact Us</span></div>

			<!-- mr piggm's tooltip start -->
			<div class="tooltip">
				<div>Mr Piggm :)</div>
			</div>
			<!-- mr piggm's tooltip end -->
		</div>
		<!-- footer end -->

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
		<script type="text/javascript">
		  (function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		  })();
		</script>
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

		<!-- facebook comments start -->
		<div id="fb-root"></div>
		<script>(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=322445997783469";
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));</script>
		<!-- facebook comments end -->
	</body>
</html>
