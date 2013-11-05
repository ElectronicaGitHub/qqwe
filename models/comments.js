var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
	user_photo : {
		type: String
	},
	_id_parent: {
		type: String
	},
	_id: {
		type: String,
		unique: true
	},
	content: {
		type: String, 
	},
	autor_name: {
		type: String, 
	}, 
	autor_surname: {
		type: String, 
	},
	post_date: {
		type: Date,
		default: Date.now
	}
});
exports.Comment = mongoose.model('Comment', schema);