var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var mongoose = require('./libs/mongoose');
var log = require('./libs/log')(module);
var passport = require('passport');

require('./routes/passportfb');
require('./routes/passportvk');
require('./routes/passporttwitter');

var app = express();
app.set('port', config.get('port'));

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')))
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());


var MongoStore = require('connect-mongo')(express);

app.use(express.session( {
	secret : config.get('session:secret'),
	key : config.get('session:key'),
	cookie : config.get('session:cookie'),
	store: new MongoStore({mongoose_connection : mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(function (req, res, next) {
// 	req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
// 	res.send("Visits: " + req.session.numberOfVisits);
// });

app.use(app.router);

require('./routes')(app);
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (err, req, res, next) {
	if (app.get('env') == 'development') {
		var errorHandler = express.errorHandler();
		errorHandler(err, req, res, next); 
	} else {
		res.send(500);
	}
	// error sender
});

http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});


