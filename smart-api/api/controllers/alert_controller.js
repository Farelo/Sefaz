'use strict';
/**
 * Module dependencies.
 */
const successHandler                      = require('../helpers/responses/successHandler');
const successHandlerPagination            = require('../helpers/responses/successHandlerPagination');
const successHandlerPaginationAggregate   = require('../helpers/responses/successHandlerPaginationAggregate');
const errorHandler                        = require('../helpers/responses/errorHandler');
const query                               = require('../helpers/queries/complex_queries_alerts');
const mongoose                            = require('mongoose');
const alert                               = mongoose.model('Alerts');
const _                                   = require("lodash");
const ObjectId                            = require('mongoose').Types.ObjectId;
mongoose.Promise                          = global.Promise;
/**
 * Create a Alert
 */
exports.alert_create = function(req, res) {
  alert.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create alert '))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Alert
 */
exports.alert_read_by_packing = function(req, res) {

  alert.findOne({
      packing: req.swagger.params.packing_id.value,
      status: req.swagger.params.status.value
    })
    .populate('actual_plant.plant')
    .populate('department')
    .populate('routes')
    .populate({path: 'routes',
      populate: {
        path: 'plant_factory',
        model: 'Plant'
      }})
    .populate({path: 'routes',
      populate: {
        path: 'plant_supplier',
        model: 'Plant'
      }})
    .populate({path: 'routes',
      populate: {
        path: 'supplier',
        model: 'Supplier'
      }})
    .populate('packing')
    .populate('supplier')
    .populate({path: 'supplier',
      populate: {
        path: 'plant',
        model: 'Plant'
      }})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read alert'));
};
/**
 * Update a Alert
 */
exports.alert_update = function(req, res) {  
  alert.update( {
      _id: req.swagger.params.alert_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update alert')); 
};
/**
 * Delete an Alert
 */
exports.alert_delete = function(req, res) { 
  alert.remove({
      _id: req.swagger.params.alert_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete alert'));
};
/**
 * List of Alerts pagination by hashing
 */
exports.alert_list_hashing = function(req, res) { 

  let aggregate = alert.aggregate(query.queries.packing_list(req.swagger.params.code.value,
    new ObjectId(req.swagger.params.project.value),
    new ObjectId(req.swagger.params.supplier.value),
    parseInt(req.swagger.params.status.value,
    req.swagger.params.attr.value)));

  alert.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res))
};
/**
 * List of Alerts pagination by hashing
 */
exports.alert_list_hashing_logistic = function(req, res) { 
  let map = req.body.map(o => new ObjectId(o));
  console.log(map);
  let aggregate = alert.aggregate(query.queries.packing_list_logistic(req.swagger.params.code.value,
    new ObjectId(req.swagger.params.project.value),
    new ObjectId(req.swagger.params.supplier.value),
    parseInt(req.swagger.params.status.value),map));

  alert.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res))
};
/**
 * List of Alerts pagination
 */
exports.alert_list_pagination = function(req, res) { 

  let aggregate = alert.aggregate(query.queries.listAlerts(req.swagger.params.attr.value));

  alert.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res))


};
/**
 * List of Alerts pagination
 */
exports.alert_list_pagination_logistic = function(req, res) { 
  let map = req.body.map(o => new ObjectId(o));
  let aggregate = alert.aggregate(query.queries.listAlertsLogistic(map));

  alert.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res))


};
