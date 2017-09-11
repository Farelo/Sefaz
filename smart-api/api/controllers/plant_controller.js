'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const plant                      = mongoose.model('Plant');
const route                      = mongoose.model('Route');
const route_controller           = require('./route_controller');
const _                          = require("lodash");
const query                      = require('../helpers/queries/complex_queries_plants');
mongoose.Promise                 = global.Promise;
/**
 * Create a Plant
 */
exports.plant_create = function(req, res) {
  plant.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create plant'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Plant
 */
exports.plant_read = function(req, res) {

  plant.findOne({
      _id: req.swagger.params.plant_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read plant'));
};

/**
 * Update a Plant
 */
exports.plant_update = function(req, res) {  
  plant.update( {
      _id: req.swagger.params.plant_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update plant'));
};
/**
 * Delete an Plant
 */
exports.plant_delete = function(req, res) { 

  plant.findOne({
      _id: req.swagger.params.plant_id.value
    }).exec()
    .then(doc => doc.remove())
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete plant'));
};
/**
 * List of all Plants without supplier and logistic_operator
 */
exports.list_all = function(req, res) { 
  plant.find({
    "supplier": { $exists: false },
    "logistic_operator": { $exists: false }
  })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants without supplier and logistic_operator no binded with route
 */
exports.list_all_nobinded = function(req, res) { 
  plant.aggregate(query.queries.plant_filter(req.swagger.params.code.value, req.swagger.params.supplier.value))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants
 */
exports.list_all_general = function(req, res) { 
  plant.find()
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants by pagination
 */
exports.plant_listPagination = function(req, res) { 
  plant.paginate({
      "supplier": { $exists: false },
      "logistic_operator": { $exists: false }}, {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers by pagination'));
};
