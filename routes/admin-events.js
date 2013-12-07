var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var escape   = require('escape-html');

var uuidString = function() {
  return Math.random().toString(36).substring(7)
};

exports.get = function (req,res,err) {
		if (req.user == undefined) {
			res.render('error');
		} else {
			if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
				res.render('admin-events', {
					name: req.user._json.name
				});
			} else res.render('error');
		}	
};

// ADD
exports.post = function (req, res, next) {
	if (req.user == undefined) {
		res.render('error'); 
	}
	else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {

	var _id         = uuidString();
	var title       = escape(req.body.title);
	var description = escape(req.body.description);
	var picture_url = escape(req.body.picture_url);	
	var price       = escape(req.body.price);
	var dates       = escape(req.body.dates);
	var adress      = escape(req.body.adress);
	var event_url   = escape(req.body.event_url);
	
    mongoose.connection.on('open', function (err) {
    	if (err) throw err;
    });
	var Event = require('../models/events').Event;

	var events = new Event ({
	    _id          : _id,
	    title        : title,
		description  : description,
		picture_url  : picture_url,
		price        : price,
		dates        : dates,
		adress       : adress,
		event_url    : event_url  
	});

	if  ((_id         != '') &&
	      (title       != '') &&
		  (description != '') &&
		  (picture_url != '') &&
		  (price       != '') &&
		  (dates       != '') &&
		  (adress      != '') &&
		  (event_url   != '') ) {

			events.save(function (err) {
				if (err) return next(err);
				console.log('Событие сохранено');
				res.render('admin-events', {
					name: req.user._json.name
				});
			})	
		} else { 
			console.log('Не все поля заполнены');
			res.statusCode = 201;
			console.log(res.statusCode);
			res.end('');
		}; 
	} else res.render('error');
};