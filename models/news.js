var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
	_id: {
		type: String,
		// required: true,
		unique: true
	},
	type: {
		type: String,
		// required : true
	},
	top_random: {
		type: Boolean,
		// required : true
	},
	title_in: {
		type: String,
		// required : true
	},
	content: {
		type: String, 
		// required: true
	},
	url_in_list: {
		type: String, 
		// required: true
	},
	text_in_list: {
		type: String, 
		// required: true
	},
	url_in_top: {
		type: String, 
		// required: true
	},
	text_in_top: {
		type: String, 
		// required: true
	},
	post_date: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String, 
		// required: true
	}, 
	surname: {
		type: String, 
		// required: true
	}, 
	quantity : {
		type : Number
	}
});
exports.New = mongoose.model('New', schema);