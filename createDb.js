// var User = require('./models/user').User;

// var user = new User( {
//     username: "Tester5",
//     password: "secret"
// });

// user.save(function (err, user, affected) {
//     if (err) throw err;

//     User.find({username: "Tester"}, function(err, tester) {
//         console.log(tester);
//     });
// })

var mongoose = require('./libs/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function (err) {
    console.log(arguments);
    mongoose.disconnect();
});

function open(callback) {
    mongoose.connection.on('open', callback);
}
function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback)
}
function requireModels(callback) {
    // require('./models/user');
    require('./models/news');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
    console.log('required USER');
}
function createUsers(callback) {
    var news = [
        { title_in: 'Уличный хуй дождик нарисовал машину на дороге', content: 'qwerty'},
        { title_in: 'Настя', content: 'ytrewq'},
        { title_in: 'Анатолик', content: '123123'},
        { title_in: 'Московский регги андерграунд Selfplayers делятся опытом', content: '123123'}
    ];

    // var news = {
    //     id : '123123',
    //     title_in : 'Привет пидарасы'
    // };

    // async.each(users, function (userData, callback) {
    //     var user = new mongoose.models.User(userData);
    //     user.save(callback);
    // }, callback);   

    async.each(news, function (userData, callback) {
        var newc = new mongoose.models.New(userData);
        newc.save(callback);
    }, callback); 
}