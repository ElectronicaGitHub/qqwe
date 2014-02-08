$(document).ready(function() {

	var urled = "/images/1.jpg";
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
   		};

  	$(".menu-starter").on('click', function(){

  		$('html, body').animate({
   			scrollTop: $(".menu-starter").offset().top
			}, 100);
			setTimeout(function() {
				$('.sidebar-top').animate({ 'min-height': "700px"}, 100);
			}, 200);
			setTimeout(function() {
   			$('.sidebar-top').addClass('visible');
      	}, 500);
   	});
});


function fcbk()      { window.location.assign("https://www.facebook.com/castmag") }
function vk()        { window.location.assign("http://vk.com/castmag")            }
function twtr()      { window.location.assign("https://twitter.com/CASTMAGRU")    }
function nstgr()     { window.location.assign("http://instagram.com/castmag_ru")  }
function youtb()     { window.location.assign("https://vimeo.com/castmag")        }
function advertise() { window.location.assign('/advertise')                       }