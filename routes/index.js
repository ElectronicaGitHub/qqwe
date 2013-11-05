var User     = require('../models/user').User;
var New      = require('../models/news').New;
var Comment  = require('../models/comments').Comment;
var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var passport = require('passport');
var lodash   = require('lodash');

var db = mongoose.connection.db;

module.exports = function (app) {

	//ГЛАВНАЯ
	app.get('/', function (req, res, next) {
		New.find({}, function (err, news) {
			if (err) return next(err);
			news.reverse();
			New.find({'top_random' : true}, function (err, newstop) {
				var newsfinal = lodash.sample(newstop, 4);
				res.render("index", {
					mark    : false,
					news    : news,
					newstop : newsfinal,
					user    : req.user
				});

			});
		});
	});
	/////////////////////////////////////////


	// НОВОСТЬ НА СТРАНИЦЕ
	app.get('/news/:id', function (req, res, next) {
		New.findById(req.params.id, function (err, onenew) {
			// console.log(req.params);
			if (err) return next(err);
			New.find({'top_random' : true}, function (err, newstop) {
				if (err) return next(err);	
				var newsfinal = lodash.sample(newstop, 4);
				Comment.find({'_id_parent': req.params.id}, function (err, comments) {
					if (err) return next(err);	
					comments.reverse();
					onenew.quantity++;
					New.update({'_id' : onenew._id}, { 'quantity'     : onenew.quantity
					} , function (err) {
						console.log('Новость просмотрена');
						console.log(onenew.quantity);
					})	

					res.render('fullnew', {
						strftime : strftime,
						news     : newsfinal,
						onenew   : onenew,
						comments : comments,
						user     : req.user
					});
				});
				// res.json(news);
			});
		});
	});
	/////////////////////////////////////////


	//ДОБАВЛЕНИЕ КОММЕНТАРИЯ
	app.post('/added/:id', require('./comment').post);
	/////////////////////////////////////////


	//АДМИНСКОЕ ПРЕДСТАВЛЕНИЕ
	app.get('/admin', require('./admin').get);
	app.post('/admin', require('./admin').post);
	app.post('/changed/:id', require('./admin').change);
	/////////////////////////////////////////


	//АДМИНСКОЕ ПРЕДСТАВЛЕНИЕ - ВСЕ НОВОСТИ
	app.get('/allnews', function (req, res, next) {
		New.find({}, function (err, news) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.end('You got no permission'); 
			}
			else if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {
				res.render("allnews", {
					news : news
				});
			}
		})
	});
	/////////////////////////////////////////


	//УДАЛЕНИЕ НОВОСТИ
	app.get('/allnews/:id/delete', function (req, res, next) {
		New.find({'_id':req.params.id}, function (err, n) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.end('You got no permission'); 
			}
			else if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {

				if (n.length > 0) {
					New.remove(n[0], function() {
					});
					res.statusCode = 200;
					res.end('');
				} else {
					res.statusCode = 404;
					res.end(':c');
				}
			}
		});
	});
	/////////////////////////////////////////


	//ИЗМЕНЕНИЕ НОВОСТИ
	app.get('/allnews/:id/change', function (req, res, next) {
		New.find({'_id':req.params.id}, function (err, n) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.end('You got no permission'); 
			}
			else if (req.user.id == 1584815370 && req.user.username == 'philip.antonov') {

				res.render('changer', {
					news: n[0]
				});
			}
		});
	});
	/////////////////////////////////////////


	//АДРЕСАЦИЯ НА РЕГИСТРАЦИЮ
	app.get('/auth/facebook', passport.authenticate('facebook'), function (req, res){
	});
	///////////////////////////////////////// 


	//КОЛЛБЭК, ПЕРЕАДРЕСАЦИЯ НА САЙТ 
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), 
		function(req, res) {
	    	res.redirect('/');
	});
	/////////////////////////////////////////


	// ВЫХОД ИЗ АККАУНТА
	app.get('/logout', function (req, res){
	    req.logout();
	    res.redirect('/'); 
	});
	/////////////////////////////////////////

	
	//СОРТИРОВАННЫЕ НОВОСТИ
	app.get('/:type', function (req, res, next) {
		New.find({'type': req.params.type}, function (err, news) {
			if (err) return next(err);
			news.reverse();
			New.find({'top_random' : true}, function (err, newstop) {
				if (err) return next(err);
				var newsfinal = lodash.sample(newstop, 4);
				res.render("index", {
					mark    : true,
					news    : news,
					newstop : newsfinal,
					user    : req.user
				});
			});
		});
	});
	/////////////////////////////////////////


	//ФУНКЦИЯ ПРОВЕРКИ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
	};
	/////////////////////////////////////////
};



