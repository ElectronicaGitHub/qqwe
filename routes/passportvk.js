var passport = require('passport');
var VkontakteStrategy = require('passport-vkontakte').Strategy;

var VKONTAKTE_APP_ID = "3982949";
var VKONTAKTE_APP_SECRET = "f8CAHPMzeemw8717k4ps";

passport.serializeUser(function(user, done) { done(null, user ); } );
passport.deserializeUser(function(obj, done) { done(null, obj ); } );

passport.use(new VkontakteStrategy({
    clientID     : VKONTAKTE_APP_ID,
    clientSecret : VKONTAKTE_APP_SECRET,
    callbackURL  : "http://castmag.ru/auth/vkontakte/callback"
	},
  	function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function () {
    		return done(null, profile);
    	});
  	}
));
