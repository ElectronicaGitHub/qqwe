$(document).ready(function() {

	$('img').parent().css('width', '100%').css('margin', '0px 0px');
	$('iframe').parent().css('width', '100%').css('margin', '0px 0px');

	var rand = Math.floor(Math.random() * 7) + 1;
	var urled = "/images/" + rand + ".jpg";
	$('html').css('background-image' , 'url(' + urled + ')');

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

	if ( (navigator.userAgent.match(/iPhone/i)) 
   	  || (navigator.userAgent.match(/iPod/i)) 
      || (navigator.userAgent.match(/iPad/i)) ) 
		{
      		$(".signin").on('touchstart', function(){
      			var styles = {
      				'top': '75px',
					'display': 'block',
					'opacity': 1,
					'z-index': 100
    			};
      			$(".form").css( styles );
      		});

      		$container.imagesLoaded(function(){
				$container.masonry({
					columnWidth: 480,
					itemSelector: '.new-min',
					isResizable: true,
					isAnimated: true,
		        	animationOptions: { 
		        	queue: false, 
		        	duration: 500 
	        		}
				});
			});
   		}
});


function fcbk()  { window.location.assign("http://www.facebook.com")  }
function vk()    { window.location.assign("http://www.vk.com")        }
function twtr()  { window.location.assign("http://www.twitter.com")   }
function nstgr() { window.location.assign("http://www.instagram.com") }
function youtb() { window.location.assign("http://www.youtube.com")   }
