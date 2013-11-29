var mongoose = require('../libs/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
	Ident : {
		type: String
	},
	Number_of_Views : {
		type: Number
	},
	Number_of_Comments: {
		type: Number
	}
});
exports.Information = mongoose.model('Information', schema);