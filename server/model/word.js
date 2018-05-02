const mongoose = require('mongoose');

// Words Schema
const wordSchema = mongoose.Schema({
	no:Number,
	value:String
});

const Word = module.exports = mongoose.model('Word', wordSchema,'words');

// Get A Word
module.exports.getAWord = (search, callback) => {
	Word.findOne({'no': search}, 'value' , function(err, res) {
		callback(res);
	});
}

module.exports.getWordsCount = (callback) => {
	Word.count({}, function(err, count){
		callback(count);
	});
}