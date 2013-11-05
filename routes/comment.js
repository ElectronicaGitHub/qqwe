var mongoose = require('../libs/mongoose');
var strftime = require('strftime');
var escape   = require('escape-html');
var Comment  = require('../models/comments').Comment;
var New      = require('../models/news').New;

var uuidString = function() {
  return Math.random().toString(36).substring(7)
};

exports.post = function (req, res, next) {
	New.findById(req.params.id, function (err, onenew) {
		if (err) return next(err);
		console.log(req.user);

		var user_photo    = 'https://graph.facebook.com/' + req.user.username + '/picture';
		var _id_parent    = onenew._id;
		var _id           = uuidString();
		var autor_name    = req.user.name.givenName;
		var autor_surname = req.user.name.familyName;	
		var content       = req.body.comment_text_add;
		var post_date     = new Date();

		console.log('parent_id: ', _id_parent);
		console.log(content);
		
	    mongoose.connection.on('open', function (err) {
	    	if (err) throw err;
	    });

		var comment = new Comment ({
			user_photo    : user_photo, 
			_id_parent    : _id_parent,
		    _id           : _id,
			autor_name    : autor_name,
			autor_surname : autor_surname,
			content       : content,
			post_date     : post_date
		});
		New.find({'top_random' : true}, function (err, newstop) {
			if (err) return next(err);	
			var newsfinal =[];
			var exist = [9999];
			var flg;
			var rnd;
			for ( ; newsfinal.length < 4; ) {
				rnd = Math.floor(Math.random() * newstop.length);
				flg = false;
				for (q in exist) {
					if (rnd == exist[q]) { flg = true }
				}
				if (!flg) { 
					exist.push(rnd);
					newsfinal.push(newstop[rnd]);
				}
			}
			Comment.find({'_id_parent': req.params.id}, function (err, comments) {
				if (err) return next(err);
				if  ((_id_parent   != '') &&
					 (_id          != '') &&
					 (autor_name   != '') &&
					 (autor_surname!= '') &&
					 (content      != '') &&
					 (post_date    != '') ) {

					comment.save(function (err) {
						if (err) return next(err);
						console.log('Комментарий сохраненен');
						res.json(comment);
						// res.render('fullnew', {
						// 	strftime: strftime,
						// 	news : newsfinal,
						// 	onenew : onenew,
						// 	comments : comments,
						// 	user : req.user
						// });
					})	
				} else { 
					console.log('Не все поля заполнены');
					res.statusCode = 201;
					console.log(res.statusCode);
					res.end('');
				};

			});	
		});
	}); 
};