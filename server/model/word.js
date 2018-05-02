const mongoose = require('mongoose');

// Words Schema
const wordSchema = mongoose.Schema({
	no:Number,
	value:String
});

const Word = module.exports = mongoose.model('Word', wordSchema,'words');

// Get A Word
module.exports.getAllWords = (callback) => {
	Word.find({}, 'value' , function(err, res) {
		callback(res);
	});
}