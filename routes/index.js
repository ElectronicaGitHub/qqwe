var User     = require('../models/user').User;
var New      = require('../models/news').New;
var Comment  = require('../models/comments').Comment;
var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var passport = require('passport');
var lodash   = require('lodash');
var device;  // для функции определение устройства

var db = mongoose.connection.db;

module.exports = function (app) {

	// ЛЭНДИНГ 
	app.get('/', function (req, res, err) {
		console.log('entered landing');
		res.render("land");
	});
	//////////////////////////////////

	// СТРАНИЦА РЕКЛАМЫ
	app.get('/advertise', function (req, res, err) {
		console.log('entered advertise');
		res.render("ads");
	});
	//////////////////////////////////

	//ГЛАВНАЯ
	app.get('/news', function (req, res, next) {
		New.find({}, function (err, news) {
			if (err) return next(err);
			deviceFinder(req);
			news.reverse();
			New.find({'top_random' : true}, function (err, newstop) {
				var newsfinal = lodash.sample(newstop, 4);
				res.render("index", {
					mark    : false,
					news    : news,
					newstop : newsfinal,
					user    : req.user,
					device  : device
				});

			});
		});	
	});
	/////////////////////////////////////////

	// НОВОСТЬ НА СТРАНИЦЕ
	app.get('/news/:id', function (req, res, next) {
		New.findById(req.params.id, function (err, onenew) {
			if (err) return next(err);
			if (onenew == (null || undefined)) {
				res.render('error');
			}
			deviceFinder(req);
			New.find({'top_random' : true}, function (err, newstop) {
				if (err) return next(err);
				
				try {
					var quantity = parseInt(onenew.quantity);
					New.update({'_id' : req.params.id}, { 'quantity' : ++quantity }, function (err) {
						if (err) return next(err);
						console.log('Новость просмотрена и кол-во просмотров равно ', quantity);
					});	
				} catch (e) {
					console.log('Не сработал quantity');
				}
				
				var newsfinal = lodash.sample(newstop, 4);
				Comment.find({'_id_parent': req.params.id}, function (err, comments) {
					if (err) return next(err);	
					comments.reverse();				

					res.render('fullnew', {
						strftime : strftime,
						news     : newsfinal,
						onenew   : onenew,
						comments : comments,
						user     : req.user,
						device   : device
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
				res.render('error');
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
				res.render("allnews", {
					news : news
				});
			} else res.render('error'); 
		})
	});
	/////////////////////////////////////////

	//УДАЛЕНИЕ НОВОСТИ
	app.get('/allnews/:id/delete', function (req, res, next) {
		New.find({'_id':req.params.id}, function (err, n) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error');
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {

				if (n.length > 0) {
					New.remove(n[0], function() {
					});
					res.statusCode = 200;
					res.end('');
				} else {
					res.statusCode = 404;
					res.end(':c');
				}
			} else res.render('error'); 
		});
	});
	/////////////////////////////////////////

	//УДАЛЕНИЕ КОММЕНТАРИЯ
	app.get('/comment/:id/delete', function (req, res, next) {
		console.log('del started');
		Comment.find({'_id':req.params.id}, function (err, n) {
			console.log(n[0]);
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error');

			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
				console.log('permission got');

				if (n.length > 0) {
					Comment.remove(n[0], function() {
					});
					res.statusCode = 200;
					res.end('');
				} else {
					res.statusCode = 404;
					res.end(':c');
				}
			} else res.render('error'); 
		});
	});
	/////////////////////////////////////////

	//ИЗМЕНЕНИЕ НОВОСТИ
	app.get('/allnews/:id/change', function (req, res, next) {
		New.find({'_id':req.params.id}, function (err, n) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error'); 
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {

				res.render('changer', {
					news: n[0]
				});
			} else res.render('error');
		});
	});
	/////////////////////////////////////////

	//АДРЕСАЦИЯ НА РЕГИСТРАЦИЮ
	app.get('/auth/facebook' , passport.authenticate('facebook') , function (req, res){
	});
	app.get('/auth/vkontakte', passport.authenticate('vkontakte'), function (req, res){
	});
	app.get('/auth/twitter'  , passport.authenticate('twitter')  , function (req, res){
	});
	///////////////////////////////////////// 

	//КОЛЛБЭК, ПЕРЕАДРЕСАЦИЯ НА САЙТ 
	app.get('/auth/facebook/callback' , passport.authenticate('facebook' , { failureRedirect: '/login' }), 
		function (req, res) {
	    	res.redirect('/news');
	});
	app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', { failureRedirect: '/login' }),
		function (req, res) {
    		res.redirect('/news');
  	});
  	app.get('/auth/twitter/callback'  , passport.authenticate('twitter'  , { failureRedirect: '/login' }),
		function(req, res) {
    		res.redirect('/news');
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
			if (news == (null || undefined)) {
				res.render('error');
			}
			deviceFinder(req);
			news.reverse();
			New.find({'top_random' : true}, function (err, newstop) {
				if (err) return next(err);
				var newsfinal = lodash.sample(newstop, 4);
				res.render("index", {
					mark    : true,
					news    : news,
					newstop : newsfinal,
					user    : req.user,
					device  : device
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

	// ПРОВЕРКА НА ДЕВАЙС //
	function deviceFinder(req) {
		var userAgent = req.headers['user-agent'];
		console.log(userAgent);
		if  ((userAgent.match(/iPhone/i)) ||
			 (userAgent.match(/iPod/i)))
			{
			device = 'iPhone';
			console.log('iPhone/iPod client');
		} else if (userAgent.match(/Android/i)) {
			device = 'Android';
			console.log('Android client');
		} else {
			device = 'PC';
			console.log('PC client');
		}
		return device;
	}
	///////////////////////////////////////////
};