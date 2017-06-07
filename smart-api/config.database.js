var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports  = function(){
	var connection = mongoose.connect('mongodb://localhost/reciclopac');
	autoIncrement.initialize(connection);

	mongoose.connection.on('connected', function () {
		console.log('Mongoose default connection open to ');
	});

	mongoose.connection.on('error',function (err) {
		console.log('Mongoose default connection error: ' + err);
	});

	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose default connection disconnected');
	});

	mongoose.connection.on('open', function () {
		console.log('Mongoose default connection is open');
	});
}
