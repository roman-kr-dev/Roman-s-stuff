
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="text/html;charset=iso-8859-1" />
		<meta name="robots" content="index,follow" />

		<meta name="description" content="A circular, responsive carousel plugin built using the jQuery library: carouFredSel. It can scroll any HTML element, one or multiple items simultaneously, horizontal or vertical, automatically, by pressing buttons or keys on the keyboard. Responsively!" />
		<meta name="keywords" content="carousel, jquery, plugin, infinite, circular, circulair, carousel, responsive, scroll, fade, crossfade, cover, uncover, imagescroller, contentslider" />
				
		<title>Circular, Responsive jQuery Carousel - CarouFredSel</title>
		<link rel="shortcut icon" type="images/ico" href="/favicon.ico" />
		
		<link rel="stylesheet" type="text/css" media="all" href="http://caroufredsel.dev7studios.com/css/basis.css" />
		<link rel="stylesheet" type="text/css" media="all" href="css/gui.css" />
		<link rel="stylesheet" type="text/css" media="all" href="http://caroufredsel.dev7studios.com/css/examples.css" />

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
	</head>

	<body>
		<div id="placeholder">
			<div id="wrapper" class="container">
				<div class="logo"></div>

				<p class="no_marg">A non-circular, non-infinite carousel scrolled by <strong>user interaction</strong>:<br />
					press the &quot;previous&quot; and &quot;next&quot; buttons, the &quot;left&quot; and &quot;right&quot; keys on your keyboard or use the pagination.</p>


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
					<div class="image_carousel">
						GINAT ME
						<div style="height:500px;width:200px;background:red;"></div>
					</div> <!-- /image_carousel -->
				</div> <!-- /transparent -->


				<div class="half">
					<div class="left">


					<h4>More examples</h4>
					<ul>
						<li><a href="/examples/basic-carousels.php" title="Basic carousels">Basic carousels.</a></li>
						<li><a href="/examples/user-interaction.php" title="Carousels scrolled by user interaction">Carousels scrolled by user interaction.</a></li>
						<li><a href="/examples/variable-visible-variable-size.php" title="Variable item-sizes + variable number of visible items">Variable item-sizes + variable number of visible items.</a></li>
						<li><a href="/examples/responsive-carousels.php" title="Responsive / fluid carousels">Responsive / fluid carousels.</a></li>
						<li><a href="/examples/continuously-scrolling.php" title="Continuously scrolling carousels">Continuously scrolling carousels.</a></li>
						<li><a href="/examples/callback-functions.php" title="Using the callback functions">Using the callback functions.</a></li>
						<li><a href="/examples/custom-events.php" title="Using the custom events">Using the custom events.</a></li>
						<li><a href="/examples/intermediate-carousels.php" title="Intermediate carousel examples">Intermediate carousel examples.</a></li>
						<li><a href="/examples/add-remove-items.php" title="Dynamically add and remove items">Dynamically add and remove items.</a></li>
						<li><a href="/examples/get-set-configuration.php" title="GET and (re)SET the configuration options">GET and (re)SET the configuration options.</a></li>
						<li><a href="/examples/carousel-lightbox-tooltip.php" title="Carousels in combination with lightbox- and tooltip-plugins">Carousels in combination with lightbox- and tooltip-plugins.</a></li>
						<li><a href="http://coolcarousels.frebsite.nl" title="inspiration slideshows and carousels" target="_blank">Cool Carousel examples (inspiration)</a></li>
					</ul>
					</div>
					<div class="right">


						<h4>Need some help?</h4>
						<p>When you're in desperate need of help, you might want to visit the <a href="/examples">examples-pages</a> or have a peak at the <a href="/support/tips-and-tricks.php">tips &amp; tricks</a> and maybe the <a href="/support/known-issues.php">known issues</a>. Or -if everything else fails- try the <a href="http://support.dev7studios.com/discussions/caroufredsel">support forum</a>.</p>
						<p>Looking for inspiration? Check out these <a href="http://coolcarousels.frebsite.nl" title="cool carousels" target="_blank">cool carousel examples</a>!</p>
						<h4 style="margin: 50px 0 0 0;">Feedback</h4>
						<div id="feedback-donate" style="margin-top: 20px;">
						<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
							<input type="hidden" name="cmd" value="_s-xclick" />
							<input type="hidden" name="hosted_button_id" value="H8NTUKK9ZBXVG" />
							<input type="image" src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
							<img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1" />
						</form>
						</div>
						<p>Any kind of feedback is more than welcome in <a href="http://support.dev7studios.com/discussions/caroufredsel">this forum-topic</a>.<br />
							<strong>Thank you!</strong></p>
					</div>
					<div class="clearfix"></div>
				</div> <!-- /half -->


			</div> <!-- /wrapper -->
			<br />
		</div> <!-- /placeholder -->
	</body>
</html>