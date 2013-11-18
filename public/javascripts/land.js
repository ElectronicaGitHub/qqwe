$(document).ready(function() {

				if (screen.width >= 1000) {
					console.log('bigger 1000');
					var rand = Math.floor(Math.random() * 7) + 1;
					var urled ="/images/land/landone" + rand + ".jpg";
					$('body').css('background-image' , 'url(' + urled + ')');
				} else {
					console.log('lower 1000');
					var rand = Math.floor(Math.random() * 3) + 1;
					var urled ="/images/land/iphone" + rand + ".jpg";
					$('body').css('background-image' , 'url(' + urled + ')');
				}
			
			$('a').on('mouseover',function() {
					$('.fader').addClass('faded');
			});
			$('a').on('mouseout',function() {
					$('.fader').removeClass('faded');
			});
		})