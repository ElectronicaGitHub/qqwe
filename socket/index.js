var log = require('../libs/log')(module);

module.exports = function(server) {
var io = require('socket.io').listen(server);

	// io.set('origins', 'localhost:*');
	io.set('logger', log);
	
	count = 0;

	io.sockets.on('connection', function (socket) {
		count++;
	    io.sockets.emit('count', {
	        data: count
	    });

		// ОТПРАВКА СООБЩЕНИЯ В ЧАТ
		socket.on('message', function (text, cb) {
			socket.broadcast.emit('message', text);
			cb(text);
		});

		// ОТПРАВКА СТАТОВ НА ЗАХОД ПОЛЬЗОВАТЕЛЯ
		socket.on('stat', function (stat, cb) {
			socket.broadcast.emit('stat', stat);
			cb(stat);
		});
		
	 	socket.on('disconnect', function () {
 	        count--;
 	        io.sockets.emit('count', {
 	            data: count
 	        });
 	    });
		   

		   

	});
}