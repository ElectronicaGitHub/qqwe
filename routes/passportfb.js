var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "123344407840562";
var FACEBOOK_APP_SECRET = "b34eadb31a10f99d5ce6b8b8a51db8fc";

passport.serializeUser(function(user, done) { done(null, user ); } );
passport.deserializeUser(function(obj, done) { done(null, obj ); } );

passport.use(new FacebookStrategy({
    clientID     : FACEBOOK_APP_ID,
    clientSecret : FACEBOOK_APP_SECRET,
    callbackURL  : "http://localhost:3000/auth/facebook/callback"
	},
  	function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function () {
    		return done(null, profile);
    	});
  	}
));

