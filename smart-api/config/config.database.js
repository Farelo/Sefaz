const mongoose 				 = require('mongoose');
const constants        = require('../api/helpers/constants');

function tryReconect(dbURI){
	setTimeout(function() {
            mongoose.connect(dbURI,constants.database_options);
        },
        5000
    );
}

module.exports  = {
	open : function(environment){

		const dbURI  = `mongodb://${environment.urldatabase}/${environment.database}`;

		mongoose.connect(dbURI,constants.database_options);

		mongoose.connection.on('error', function(e){
			 console.log("db: mongodb error " + e);
			 // reconnect here
			 mongoose.connection.close();
			 tryReconect(dbURI);

	 });

	 mongoose.connection.on('connected', function(e){
			 console.log('db: mongodb is connected: ' + dbURI);
	 });

	 mongoose.connection.on('disconnecting', function(){
			 console.log('db: mongodb is disconnecting!!!');
	 });

	 mongoose.connection.on('disconnected', function(){
			 console.log('db: mongodb is disconnected!!!');
	 });

	 mongoose.connection.on('reconnected', function(){
			 console.log('db: mongodb is reconnected: ' + dbURI);
	 });

	 mongoose.connection.on('timeout', function(e) {
			 console.log("db: mongodb timeout "+e);
			 mongoose.connection.close();
			 tryReconect(dbURI);
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
require('../api/mocks/staff_supplier');
require('../api/mocks/admin_client');
require('../api/mocks/staff');
require('../api/mocks/historic_packings');
require('../api/mocks/alerts');
require('../api/mocks/gc16');
