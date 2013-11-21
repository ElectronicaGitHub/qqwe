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

	if ( (navigator.userAgent.match(/iPhone/i)) 
   	  || (navigator.userAgent.match(/iPod/i)) 
      || (navigator.userAgent.match(/Android/i)) ) 
		{

      		$(".signin").on('touchstart', function(){
      			var styles = {
      				'top': '120px',
					'display': 'block',
					'opacity': 1,
					'z-index': 100
    			};
      			$(".form").css( styles );
      		});
      		var $container = $('.content');
			var msnry = $container.data('masonry');

      		$container.imagesLoaded(function(){
				$container.masonry({
					columnWidth: 486,
					itemSelector: '.new-min',
					isResizable: true,
					isAnimated: true,
		        	animationOptions: { 
		        	queue: false, 
		        	duration: 500 
	        		}
				});
			});
   		} else {

   			var $container = $('.content');
			var msnry = $container.data('masonry');

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
   		};
   		$(".menu-starter").swipe( {
	        swipeRight:function(event, direction, distance, duration, fingerCount) {
	          	$('.sidebar-top').addClass('visible');
	          	$('.header').css('display','none');
	          	$('.slider-all').css('display','none');
	          	$('.content').css('display','none');
	          	$('.footer').css('display','none');
	        },
	        threshold:0
	    });
    
});


function fcbk()  { window.location.assign("https://www.facebook.com/castmag") }
function vk()    { window.location.assign("http://vk.com/castmag1")           }
function twtr()  { window.location.assign("https://twitter.com/CASTMAGRU")    }
function nstgr() { window.location.assign("http://www.instagram.com")         }
function youtb() { window.location.assign("https://vimeo.com/castmag")        }
