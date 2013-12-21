var cluster = require('cluster');
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
} else {
	console.log('Hello from Worker ' + cluster.worker.id);
	process.env.NODE_ENV = 'production';

	var express = require('express');
	var csrf = require('csrf');
    var ips = ['127.0.0.1', '127.0.0.1/admin', '127.0.0.1/change'];
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
	// app.use(csrf(ips));
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

	var server = http.createServer(app);
	server.listen(config.get('port'), function(){
	    log.info('Express server listening on port ' + config.get('port'));
	});

}

