var $ = jQuery;


// for get max height
(function(){
	$.fn.getMaxHeight = function() {
		var _array = [];
		$(this).each(function(){
			_array.push( $(this).height() );
		});
		return Math.max.apply(Math,_array);
	};
}());


// for aspect ratio
(function(){
	var ratio = "16:9";
	$.fn.setAspectRatio = function(ratioNew) {
		if ( ratioNew ) {
			ratio = ratioNew;
		}

		var rationLn = ratio.split(":");

		$(this).each(function(){
			var item = $(this);
			if ( item.length > 0 ) {
				var itemWidth = item.width();
				var aspectHeight = ( itemWidth * rationLn[1]/rationLn[0] );
				item.height(aspectHeight);
			}
		});
	};
}());

// for scrolling to targeted sections
(function(){
	$.fn.scrollingTo = function( opts ) {
		var defaults = {
			animationTime : 1000,
			easing : '',
			callbackBeforeTransition : function(){},
			callbackAfterTransition : function(){}
		};

		var config = $.extend( {}, defaults, opts );

	    $(this).click(function(e){
	    	var eventVal = e;
	    	e.preventDefault();

	    	var $section = $(document).find( $(this).data('section') );
	    	if ( $section.length < 1 ) {
	    		return false;
	    	}

	        if ( $('html, body').is(':animated') ) {
	            $('html, body').stop( true, true );
	        }

	        var scrollPos = $section.offset().top;

	        if ( $(window).scrollTop() == scrollPos ) {
	        	return false;
	        }

	        config.callbackBeforeTransition(eventVal, $section);

	        $('html, body').animate({
	            'scrollTop' : (scrollPos+'px' )
	        }, config.animationTime, config.easing, function(){
	        	config.callbackAfterTransition(eventVal, $section);
	        });

	        return $(this);
	    });
	};
}());

// callback after ready the document
$(document).ready(function(){

	// setting the post thumb height depend on aspect ratio 16:9
	$('.blog-post-thumb-container.videoPost').setAspectRatio();


	// jwplayer video post
	(function(){
		$('.player').each(function(){
			var $this = $(this),
			defaults = {
				fileSrc : '',
				imageSrc : '',
				id : '',
				width : '100%',
				height : '100%',
				aspectratio : ''
			},
			config = {
				fileSrc : $(this).data('file-sec') || defaults.fileSrc,
				imageSrc : $(this).data('image-src') || defaults.imageSrc,
				id : $(this).attr('id'),
				width : $(this).data('width') || defaults.width,
				height : $(this).data('height') || defaults.height,
				aspectratio : $(this).data('aspectratio') || defaults.aspectratio
			};

			jwplayer(config.id).setup({
				file: config.fileSrc,
				image: config.imageSrc,
				width: config.width,
				height: config.height,
				aspectratio : config.aspectratio
			});
		});
	}());


	// nice scroll
	if ( jQuery.browser.mobile !== true ) {
		$("html").niceScroll({
			cursorwidth: '10px',
			zindex: '999999999'
		});
	}


	// blog Mesonary
	if ( $('#blog-posts').length > 0 ) {
		window.blogMsnry = $('#blog-posts').isotope({
			itemSelector: '.single-post',
			isInitLayout: false,
			layoutMode: 'masonry'
		});
	}

});

// callback after loading the window
$(window).load(function(){

	// hide the loader
	(function(){
		var loader = $('#loader');
		if ( loader.length > 0 ) {
			$('#loader').fadeOut(function(){
				$('#home .overlay-content').removeClass('fadeOut').addClass('fadeInUpSmall');
				$('#home .overlay-content .animated').removeClass('fadeOut').addClass('bounceInDown');
			});
		}
	}());


	// favorite maker
	(function(){
		var lovedText = "You already love this", loveText = "Love this", loveClass = "active";
		$('.js-favorite').on('click', function(e){
			e.preventDefault();
			var favoriteNumb = parseInt( $(this).find('.numb').text(), 10 );
			if ( $(this).hasClass(loveClass) ) {
				$(this).removeClass(loveClass).attr('title', loveText);
				--favoriteNumb;
				$(this).find('.numb').text( favoriteNumb );
			} else {
				$(this).addClass(loveClass).attr('title', lovedText);
				++favoriteNumb;
				$(this).find('.numb').text( favoriteNumb );
			}
		});
	}());

	
	// blog post slider
	(function(){
		var $blog_post_slider  = $('.thumb-slides-container');
		if ( $blog_post_slider.length > 0 ) {

			$blog_post_slider.each(function(){
				$(this).owlCarousel({
					singleItem : true,
				    autoPlay : true,
				    stopOnHover : true,
					slideSpeed : 800,
					pagination : false
				});
			});



			$('.thumb-slides-controller a').click(function(e){
				e.preventDefault();

				var blog_post_slider_data = $(this).closest('.blog-post-thumb-container').children('.thumb-slides-container').data('owlCarousel');

				if ( $(this).hasClass('left-arrow') ) {
					blog_post_slider_data.prev();
				} else {
					blog_post_slider_data.next();
				}
			});
		}
	}());


	// Wow init
	new WOW({
		offset: 150,
		mobile: false
	}).init();


	// Contact toggle
	$('.contact-location-toggle-btn').scrollingTo({
		easing : 'easeOutQuart',
		callbackBeforeTransition : function(e){
			$('.contact-content-wrapper').slideToggle(600,'easeOutQuart');
		}
	});
	

	// Blog masonry re layout
	if ( typeof blogMsnry !== "undefined" ) {
		blogMsnry.isotope('layout');
	}


});


// callback after resize the window
$(window).resize(function(){

	// setting the post thumb height depend on aspect ratio 16:9
	$('.blog-post-thumb-container.videoPost').setAspectRatio();
	

	// Blog masonry re layout
	if ( typeof blogMsnry !== "undefined" ) {
		blogMsnry.isotope('layout');
	}

});



// mobile menu plugin

if ( $('.not-home').length > 0 ) {
	var mobileMenu = {
		bar : $('.header-mobile-screen .bar-area'),
		menu : $('.header-mobile-screen .menu'),
		hideMenu : function(){
			if ( !mobileMenu.bar.is(':visible') ) { return false; }
			mobileMenu.bar.find('a.close-menu').hide().siblings('a').show();
			mobileMenu.menu.slideUp();
			return this;
		},
		showMenu : function(){
			if ( !mobileMenu.bar.is(':visible') ) { return false; }
			mobileMenu.bar.find('a.open-menu').hide().siblings('a').show();
			mobileMenu.menu.slideDown();
			return this;
		},
		init : function(){
			mobileMenu.bar.find('a').click(function(e){
				e.preventDefault();
				if ( $(this).hasClass('open-menu') ) {
					mobileMenu.showMenu();
				} else {
					mobileMenu.hideMenu();
				}
			});

			mobileMenu.menu.find('.has-sub a').click(function(e){
				e.preventDefault();
				$(this).parent('li').toggleClass('active');
				$(this).siblings('.sub-menu').slideToggle();
			});

			$(window).bind('resize', function(){
				mobileMenu.hideMenu();
			});
		}
	};

	mobileMenu.init();
}