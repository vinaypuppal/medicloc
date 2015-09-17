"use strict";
var $ = jQuery;

$(document).ready(function(){

	// nice scroll
	if ( jQuery.browser.mobile !== true ) {
		$("html").niceScroll();
	}
});

$(window).load(function(){

	// hide the loader
	$('#loader').fadeOut();

	// count up statistic
	var $countNumb = $('.countNumb');

	if ( $countNumb.length > 0 ) {
		$countNumb.counterUp({
			delay: 15,
			time: 2000
		});
	}

	// Wow init
	new WOW({
		offset: 150,
		mobile: false
	}).init();

});