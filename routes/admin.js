var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var escape   = require('escape-html');

var uuidString = function() {
  return Math.random().toString(36).substring(7)
};

exports.get = function (req,res,err) {
	if (passi == undefined && breedi == undefined) {
		if (req.user == undefined) {
			res.end('You got no permission');
		} else {
			if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {
				var hello = "Привет " + req.user.name.givenName + ", подтверди что это действительно ты";
				res.render('admin', {
					name: req.user._json.name
				});
			} else res.end('You got no permission');
		}	
	} 
};

exports.post = function (req, res, next) {
	if (req.user == undefined) {
		res.end('You got no permission'); 
	}
	else if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {

	var _id          = uuidString();
	var type         = req.body.type;
	var name         = req.body.name;
	var surname      = req.body.surname;	
	var title_in     = escape(req.body.title_in);
	var content      = req.body.content;
	var url_in_list  = escape(req.body.url_in_list);
	var text_in_list = escape(req.body.text_in_list);
	var url_in_top   = escape(req.body.url_in_top);
	var text_in_top  = escape(req.body.text_in_top);
	var top_random   = req.body.top_random;
	var post_date    = new Date();
	var quantity;
	
    mongoose.connection.on('open', function (err) {
    	if (err) throw err;
    });
	var New = require('../models/news').New;

	var news = new New ({
	    _id          : _id,
	    top_random   : top_random,
		type         : type,
		name         : name,
		surname      : surname,
		title_in     : title_in,
		content      : content,
		url_in_list  : url_in_list,
		text_in_list : text_in_list,
		url_in_top   : url_in_top,
		text_in_top  : text_in_top,
		post_date    : post_date,
		quantity     : quantity
	});

	if  ((_id          != '') &&
	     (top_random   != '') &&
		 (type         != '') &&
		 (name         != '') &&
		 (surname      != '') &&
		 (title_in     != '') &&
		 (content      != '') &&
		 (url_in_list  != '') &&
		 (text_in_list != '') &&
		 (post_date    != '') ) {

			news.save(function (err) {
				if (err) return next(err);
				console.log('Новость сохранена');
				res.render('admin', {
					name: req.user._json.name
				});
			})	
		} else { 
			console.log('Не все поля заполнены');
			res.statusCode = 201;
			console.log(res.statusCode);
			res.end('');
		}; 
	} 
};

exports.change = function (req, res, next) {
	if (req.user == undefined) {
		res.end('You got no permission'); 
	}
	else if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {

	var _id          = req.params.id;
	var type         = req.body.type;
	var name         = req.body.name;
	var surname      = req.body.surname;	
	var title_in     = escape(req.body.title_in);
	var content      = req.body.content;
	var url_in_list  = escape(req.body.url_in_list);
	var text_in_list = escape(req.body.text_in_list);
	var url_in_top   = escape(req.body.url_in_top);
	var text_in_top  = escape(req.body.text_in_top);
	var top_random   = req.body.top_random;
	var post_date    = req.body.post_date;
	var quantity;
	
    mongoose.connection.on('open', function (err) {
    	if (err) throw err;
    });
	var New = require('../models/news').New;

	if  ((_id          != '') &&
	     (top_random   != '') &&
		 (type         != '') &&
		 (name         != '') &&
		 (surname      != '') &&
		 (title_in     != '') &&
		 (content      != '') &&
		 (url_in_list  != '') &&
		 (text_in_list != '') &&
		 (post_date    != '') ) {

			New.find({'_id' : req.params.id}, function (err,newschange) {
				if (err) return next(err);

				var news = new New ({
				    _id          : newschange[0]._id,
				    top_random   : top_random,
					type         : type,
					name         : name,
					surname      : surname,
					title_in     : title_in,
					content      : content,
					url_in_list  : url_in_list,
					text_in_list : text_in_list,
					url_in_top   : url_in_top,
					text_in_top  : text_in_top,
					post_date    : newschange[0].post_date,
					quantity     : quantity
				});

				console.log('Было', newschange[0]);
				console.log('Стало', news);

				New.update({'_id' : news._id}, {
											    'top_random'   : news.top_random,
												'type'         : news.type,
												'name'         : news.name,
												'surname'      : news.surname,
												'title_in'     : news.title_in,
												'content'      : news.content,
												'url_in_list'  : news.url_in_list,
												'text_in_list' : news.text_in_list,
												'url_in_top'   : news.url_in_top,
												'text_in_top'  : news.text_in_top,
												'post_date'    : newschange[0].post_date
				} , function (err) {
					console.log(err);
					console.log('Новость изменена');
					res.render('admin', {
						name: req.user._json.name
					});
				})	
			})	
		} else { 
			console.log('Не все поля заполнены');
			res.statusCode = 201;
			console.log(res.statusCode);
			res.end('');
		};
	}
}