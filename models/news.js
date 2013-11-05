var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
	_id: {
		type: String,
		unique: true
	},
	type: {
		type: String,
	},
	top_random: {
		type: Boolean,
	},
	title_in: {
		type: String,
	},
	content: {
		type: String, 
	},
	url_in_list: {
		type: String, 
	},
	text_in_list: {
		type: String, 
	},
	url_in_top: {
		type: String, 
	},
	text_in_top: {
		type: String, 
	},
	post_date: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String, 
	}, 
	surname: {
		type: String, 
	}, 
	quantity : {
		type : Number
	}
});
exports.New = mongoose.model('New', schema);