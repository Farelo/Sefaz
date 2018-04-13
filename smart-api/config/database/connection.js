'use strict';

const mongoose    = require('mongoose');
const constants   = require('../../api/helpers/utils/constants');
const schemas     = require('../database/import_schemas');



module.exports = {
	open: function (environment) {
		let dbURI = `mongodb://${environment.urldatabase}/${environment.database}`;
		console.log(process.env.DATABASE)
		console.log(process.env.DATABASE_SERVICE)
		if (process.env.NODE_ENV === 'production') {//verifica se esta em produção
			if (process.env.DATABASE && process.env.DATABASE_SERVICE){//se sim avalia se os dados foram inserido corretamente
				dbURI = `mongodb://${process.env.DATABASE_SERVICE}/${process.env.DATABASE}`;
			}//caso contrario utiliza as variaveis default
		}

		mongoose.set('bufferCommands', false);
		mongoose.connect(dbURI, constants.database_options);

		mongoose.connection.on('error', function (e) {
			console.log("db: mongodb error " + e);
		});

		mongoose.connection.on('connected', function (e) {
			console.log('db: mongodb is connected: ' + dbURI);
		});

		mongoose.connection.on('disconnecting', function () {
			console.log('db: mongodb is disconnecting!!!');
		});

		mongoose.connection.on('disconnected', function () {
			console.log('db: mongodb is disconnected!!!');
		});

		mongoose.connection.on('reconnected', function () {
			console.log('db: mongodb is reconnected: ' + dbURI);
		});

		mongoose.connection.on('timeout', function (e) {
			console.log("db: mongodb timeout " + e);
		});


		// If the Node process ends, close the Mongoose connection
		process.on('SIGINT', function () {
			mongoose.connection.close(function () {
				console.log('Mongoose default connection disconnected through app termination');
				process.exit(0);
			});
		});


	},
	close: function (database) {

		mongoose.connection.close();
		mongoose.connection.on('close', function () {
			console.log('Mongoose close connection ');
			this.open(database);
		});
	}

}

schemas();