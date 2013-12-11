var User     = require('../models/user').User;
var New      = require('../models/news').New;
var Comment  = require('../models/comments').Comment;
var Information   = require('../models/information').Information;
var Event   = require('../models/events').Event;

var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var passport = require('passport');
var lodash   = require('lodash');
var device;  // для функции определение устройства
var currentQuantity = 0; // для представления администрации
var lastQuantity = 0;

var db = mongoose.connection.db;

module.exports = function (app) {

	// ЛЭНДИНГ 
	app.get('/', function (req, res, err) {
		res.render("land");
	});
	//////////////////////////////////

	// СТРАНИЦА РЕКЛАМЫ
	app.get('/advertise', function (req, res, err) {
		res.render("ads");
	});
	//////////////////////////////////

	

	// СТРАНИЦА О НАС
	app.get('/about', function (req, res, err) {
		res.render("about");
	});
	//////////////////////////////////

	// СТРАНИЦА ИНФОРМАЦИИ
	app.get('/info', function (req,res,next) {
		if (req.user == undefined) {
			res.render('error');
		} else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
			currentQuantity = 0;
			Comment.find({}, function (err, commentsAll) {
				if (err) return next(err);
				var commentsQuantity = commentsAll.length;
				New.find({}, function (err, newsAll) {
					if (err) return next(err);
					for (i in newsAll) {
						 currentQuantity += newsAll[i].quantity; 
					}
					var info = new Information ({
						Ident              : 'main',
						Number_of_Views    : currentQuantity,
						Number_of_Comments : commentsQuantity
					});
					Information.find({}, function (err, infoAll) {
						if (err) return next(err);
						if (infoAll[0] == undefined) {
							lastQuantity = 0;
							info.save(function (err){ 
								if (err) return next(err);
								console.log('info saved');
							})
						} else {
							lastQuantity = infoAll[0].Number_of_Views;
							Information.update({'Ident' : 'main'}, {	'Number_of_Views'    : currentQuantity,
																		'Number_of_Comments' : infoAll[0].Number_of_Comments

							}, function (err) {
								if (err) return next(err);
								console.log('info updated');
								console.log('currentQuantity',currentQuantity);
								console.log('lastQuantity', lastQuantity);
							})
						}				
					})
					var newsQuantity = newsAll.length;
					var averageNews  = currentQuantity / newsQuantity;
					var delta = currentQuantity - lastQuantity;

					res.render('info', {
						currentQuantity  : currentQuantity,
						newsQuantity     : newsQuantity,
						commentsQuantity : commentsQuantity,
						averageNews      : averageNews,
						delta            : delta
					});
				})
			})
		} else res.render('error');
	})
	//////////////////////////////////

	// ВСЕ КОММЕНТЫ
	app.get('/allcomments', function (req,res, next) {
		Comment.find({}, function (err, comments) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error');
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
				res.render('allcomments', {
					comments : comments
				})
			} else res.render('error');
		})
	})
	//////////////////////////////////////

	// ВСЕ СОБЫТИЯ
	app.get('/allevents', function (req,res, next) {
		Event.find({}, function (err, events) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error');
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {
				res.render('allevents', {
					events : events
				})
			} else res.render('error');
		})
	})
	////////////////////////////////////////

	//ГЛАВНАЯ
	app.get('/news', function (req, res, next) {
		New.find({}, function (err, news) {
			if (err) return next(err);
			deviceFinder(req);
			news.reverse();
			New.find({'top_random' : true}, function (err, newstop) {
				if (err) return next(err);
				var newsfinal = lodash.sample(newstop, 4);
				Event.find({}, function (err, events) {
					if (err) return next(err);
					res.render("index", {
						mark    : false,
						news    : news,
						events  : events,
						newstop : newsfinal,
						user    : req.user,
						device  : device
					});
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

	//АДМИНСКОЕ ПРЕДСТАВЛЕНИЕ НОВОСТИ
	app.get('/admin', require('./admin').get);
	app.post('/admin', require('./admin').post);
	app.post('/changed/:id', require('./admin').change);
	/////////////////////////////////////////

	// АДМИНСКОЕ ПРЕДСТАВЛЕНИЕ СОБЫТИЯ
	app.get('/admin_events', require('./admin-events').get);
	app.post('/admin_events', require('./admin-events').post);
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

	//УДАЛЕНИЕ СОБЫТИЯ
	app.get('/event/:id/delete', function (req, res, next) {
		Event.find({'_id':req.params.id}, function (err, n) {
			if (err) return next(err);
			if (req.user == undefined) {
				res.render('error');
			}
			else if ((req.user.id == 1584815370 && req.user.username == 'philip.antonov') || req.user.id == 1160344910 ) {

				if (n.length > 0) {
					Event.remove(n[0], function() {
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

	// ТОПИК "СОЗДАВАЙ"
	app.get('/made', function (req, res, next) {
		deviceFinder(req);
		New.find({'top_random' : true}, function (err, newstop) {
			if (err) return next(err);
			var message = 'R2D2 в процессе работы над разделом'
			var newsfinal = lodash.sample(newstop, 4);
			res.render("made", {
				mark    : true,
				// news    : news,
				newstop : newsfinal,
				user    : req.user,
				device  : device,
				message : message
			});
		});
	});
	////////////////////////////////////////

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
				Event.find({}, function (err, events) {
					if (err) return next(err);
					res.render("index", {
						mark    : true,
						news    : news,
						newstop : newsfinal,
						user    : req.user,
						device  : device,
						events  : events
					});
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