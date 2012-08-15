var tooltipDir = true,
	CRI = new crossriderInstaller({
		app_id:2231,
		app_name:'pink facebook'
	});

function animatePiggmTooltip() {
	$('div.footer div.tooltip').animate({
		bottom:tooltipDir ? 170 : 210
	}, 2000, function () {
		tooltipDir = !tooltipDir;

		animatePiggmTooltip();
	})
}

$(document).ready(function () {
	$('#slider').SexySlider({
		control       : '#control',    // #id of div to place control buttons.
		width         : 511,  // width of panel
		height        : 409,  // height of panel
		strips        : 20,   // number of strips
		auto          : true, // autoslider
		autopause     : false, // stop autoslider after click
		delay         : 3000, // delay between images in ms
		stripSpeed    : 500,  // delay beetwen strips in ms
		titleOpacity  : 0.7,  // opacity of title
		titleSpeed    : 1000, // speed of title appereance in ms
		titlePosition : 'bottom', // top, right, bottom, left
		titleStyle    : 'auto', // 'auto', false 
		direction     : 'alternate', // left, right, alternate, random
		effect        : 'random' // curtain, zipper, wave, fountain, cascade, fade, random
	});

	$('div.footer div.contact span').click(function () {
		var mail = ['cadoogi', ['gm', 'ail', '.', 'com'].join('')];

		alert('Please send an email to: ' + mail.join('@'));
	});

	$('#install').click(CRI.install);
	
	animatePiggmTooltip();
});