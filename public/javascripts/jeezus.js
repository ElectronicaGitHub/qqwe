$(document).ready(function() {

	var rand = Math.floor(Math.random() * 5);
	if (rand == 0) { $('html').css('background-image', 'url("/images/v1.jpg")'); }
	if (rand == 1) { $('html').css('background-image', 'url("/images/v2.jpg")'); }
	if (rand == 2) { $('html').css('background-image', 'url("/images/v3.jpg")'); }
	if (rand == 3) { $('html').css('background-image', 'url("/images/v4.jpg")'); }
	if (rand == 4) { $('html').css('background-image', 'url("/images/v5.jpg")'); }
	
	var mic = true;	
	$('#opener').click(function() {
		if (mic) {
			$('#opener').removeClass('li-outer').addClass('li-outer-open');
			$('.li-inner').css('display', 'block');
			mic = false;
		} else {
			$('.li-inner').css('display','none');
			$('#opener').removeClass('li-outer-open').addClass('li-outer');
			mic = true;
		}
	});

	var $container = $('.content');
	var msnry = $container.data('masonry');
	// initialize
	$container.imagesLoaded(function(){
		$container.masonry({
			columnWidth: 274,
			itemSelector: '.new-min',
			isResizable: true,
			isAnimated: true,
	        	animationOptions: { 
	        	queue: false, 
	        	duration: 500 
	        	}
		});
	});

});


function fcbk() { window.location.assign("http://www.facebook.com") }
function vk() { window.location.assign("http://www.vk.com") }
function twtr() { window.location.assign("http://www.twitter.com") }
function nstgr() { window.location.assign("http://www.instagram.com") }
function youtb() { window.location.assign("http://www.youtube.com") }
