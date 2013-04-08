<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head>
  <title> New Document </title>
  <meta name="Generator" content="EditPlus">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">

  <script src="jquery-1.7.2.min.js"></script>
  <script>
  $(function () {
	  console.log('ttt');

var arr = [];

	  $.get('find.php', function (x) {
		  var rx = /http\:\/\/photos\.sparksites\.com(.*?)\.jpg/gi;

		  x.replace(rx, function ($) {
			  arr.push($);
		  });

			$.each(arr, function (i, img) {
				$('<img src="' + img + '" />').appendTo('body');
			});

			console.log('frff');
		  console.log(arr.length);
		  console.log('aiii');
	  });
  });
  </script>
 </head>

 <body>
  
 </body>
</html>