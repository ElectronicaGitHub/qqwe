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
		// required: true,
		unique: true
	},
	content: {
		type: String, 
		// required: true
	},
	autor_name: {
		type: String, 
		// required: true
	}, 
	autor_surname: {
		type: String, 
		// required: true
	},
	post_date: {
		type: Date,
		default: Date.now
	}
});
exports.Comment = mongoose.model('Comment', schema);