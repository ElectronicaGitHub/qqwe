var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var TWITTER_CONSUMER_KEY = "WvWoOsNWCCjksaHjVgFQg";
var TWITTER_CONSUMER_SECRET = "7cIlUxYJEl3nTN9vQ1wYUtawNPEKszCVO16BKg";

passport.serializeUser(function(user, done) { done(null, user ); } );
passport.deserializeUser(function(obj, done) { done(null, obj ); } );

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://castmag.ru/auth/twitter/callback"
  },
  	function(accessToken, refreshToken, profile, done) {
    	process.nextTick(function () {
    		return done(null, profile);
    	});
  	}
));

