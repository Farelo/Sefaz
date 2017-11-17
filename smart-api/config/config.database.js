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

require('../api/mocks/plant');
require('../api/mocks/project');
require('../api/mocks/profile');
require('../api/mocks/admin');
require('../api/mocks/logistic_operator');
require('../api/mocks/supplier');
require('../api/mocks/department');
require('../api/mocks/packing');
require('../api/mocks/route');
require('../api/mocks/tag');
require('../api/mocks/checkpoint');
require('../api/mocks/staff_supplier');
require('../api/mocks/admin_client');
require('../api/mocks/staff');
require('../api/mocks/historic_packings');
require('../api/mocks/alerts');
require('../api/mocks/gc16');
