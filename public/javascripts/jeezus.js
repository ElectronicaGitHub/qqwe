$(document).ready(function() {

	// $('.all').ready(function() {
	// 	var ah = $('.all').height();
	// 	console.log(ah);
	// 	$('.sidebar').height(ah);
	// });
	// $('.content-full').ready(function() {
	// 	var ah = $(this).height() + 7;
	// 	console.log(ah);
	// 	$('.sidebar').height(ah);
	// });

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