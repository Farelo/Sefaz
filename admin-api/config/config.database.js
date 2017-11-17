const mongoose 				 = require('mongoose');

module.exports  = {
	open : function(environment){
		mongoose.connect(`mongodb://${environment.urldatabase}/${environment.database}`);

		mongoose.connection.on('connected', function () {
			console.log('Mongoose default connection open to ');
		});

		mongoose.connection.on('disconnected', function () {
			console.log('Mongoose default connection disconnected');
		});

		mongoose.connection.on('error',function (err) {
			console.log('Mongoose default connection error: ' + err);
		});

		mongoose.connection.on('openUri', function () {
			console.log('Mongoose default connection is open');
		});

		// If the Node process ends, close the Mongoose connection
		process.on('SIGINT', function() {
		  mongoose.connection.close(function () {
		    console.log('Mongoose default connection disconnected through app termination');
		    process.exit(0);
		  });
		});
	},
	close: function(database){

		mongoose.connection.close();
		mongoose.connection.on('close', function () {
			console.log('Mongoose close connection ');
			this.open(database);
		});
	}

}

require('../api/mocks/users');
