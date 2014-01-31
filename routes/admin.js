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
				res.render('admin', {
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
	    mongoose.connection.on('open', function (err) {
	    	if (err) throw err;
	    });
		var New = require('../models/news').New;
		var news = new New ({
		    _id          : uuidString(),
			type         : req.body.type,
			name         : req.body.name,
			surname      : req.body.surname,
			content      : req.body.content,
			title_in     : escape(req.body.title_in),
			url_in_list  : escape(req.body.url_in_list),
			text_in_list : escape(req.body.text_in_list),
			url_in_top   : escape(req.body.url_in_top),
			text_in_top  : escape(req.body.text_in_top),
		    top_random   : req.body.top_random,
			post_date    : new Date(),
			quantity     : Math.floor(Math.random()*(200-80+1)+80),
			hash_tags    : req.body.hash_tags
		});
		if ((news._id          != '') && (news.top_random   != '') && (news.type         != '') && (news.name         != '') &&
			(news.surname      != '') && (news.title_in     != '') && (news.content      != '') && (news.url_in_list  != '') &&
			(news.text_in_list != '') && (news.post_date    != '') && (news.hash_tags    != '')) {

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
	} else res.render('error');
};
// CHANGE
exports.change = function (req, res, next) {
	if (req.user == undefined) {
		res.render('error');
	}
	else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
	
	    mongoose.connection.on('open', function (err) {
	    	if (err) throw err;
	    });
		var New = require('../models/news').New;

		if ((req.params.id                 != '') &&
			(req.body.type                 != '') &&
			(req.body.name                 != '') &&
			(req.body.surname              != '') &&
			(req.body.content              != '') &&
			(escape(req.body.title_in)     != '') &&
			(escape(req.body.url_in_list)  != '') &&
			(escape(req.body.text_in_list) != '') &&
		    (req.body.top_random           != '') &&
			(req.body.post_date            != '') &&
			(req.body.hash_tags            != '') ) {

			New.find({'_id' : req.params.id}, function (err,newschange) {
				if (err) return next(err);

				var news = new New ({
				    _id          : newschange[0]._id,
				    top_random   : req.body.top_random,
					type         : req.body.type,
					name         : req.body.name,
					surname      : req.body.surname,
					title_in     : escape(req.body.title_in),
					content      : req.body.content,
					url_in_list  : escape(req.body.url_in_list),
					text_in_list : escape(req.body.text_in_list),
					url_in_top   : escape(req.body.url_in_top),
					text_in_top  : escape(req.body.text_in_top),
					hash_tags    : req.body.hash_tags,
					post_date    : newschange[0].post_date,
					quantity     : newschange[0].quantity
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
					'post_date'    : newschange[0].post_date,
					'quantity'     : newschange[0].quantity,
					'hash_tags'    : news.hash_tags

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
	} else res.render('error');
}
