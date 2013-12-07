var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
	_id: {
		type: String,
		unique: true
	},
	title: {
		type: String,
	},
	description: {
		type: String, 
	},
	picture_url: {
		type: String, 
	},
	price: {
		type: String, 
	},
	dates: {
		type: String, 
	},
	adress: {
		type: String,
	},
	event_url : {
		type : String
	}
});
exports.Event = mongoose.model('Event', schema);