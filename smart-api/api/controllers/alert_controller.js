'use strict';
/**
 * Module dependencies.
 */
const responses            = require('../helpers/responses/index')
const schemas              = require("../../config/database/require_schemas")
const query                = require('../helpers/queries/complex_queries_alerts');
const _                    = require("lodash");
const ObjectId             = schemas.ObjectId
/**
 * Create a Alert
 */
exports.alert_create = function (req, res) {
  schemas.alert()
    .create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create alert '))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};

/**
 * Show the current Alert
 */
exports.alert_read_by_packing = function (req, res) {
  let packing_id = req.swagger.params.packing_id.value;
  let status = req.swagger.params.status.value;

  schemas.alert().findOne({
    packing: packing_id,
    status: status
  })
    .populate('actual_plant.plant')
    .populate('department')
    .populate('routes')
    .populate({
      path: 'routes',
      populate: {
        path: 'plant_factory',
        model: 'Plant'
      }
    })
    .populate({
      path: 'routes',
      populate: {
        path: 'plant_supplier',
        model: 'Plant'
      }
    })
    .populate({
      path: 'routes',
      populate: {
        path: 'supplier',
        model: 'Supplier'
      }
    })
    .populate('packing')
    .populate('supplier')
    .populate({
      path: 'supplier',
      populate: {
        path: 'plant',
        model: 'Plant'
      }
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read alert'));
};

/**
 * Update a Alert
 */
exports.alert_update = function (req, res) {
  let id = req.swagger.params.alert_id.value;

  schemas.alert().update( {
    _id: id
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update alert'));
};

/**
 * Delete an Alert
 */
exports.alert_delete = function (req, res) {
  let id = req.swagger.params.alert_id.value;

  schemas.alert().remove({
    _id: id
  })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete alert'));
};

/**
 * List of Alerts pagination by hashing
 */
exports.alert_list_hashing = function (req, res) {
  let project = req.swagger.params.project.value;
  let code = req.swagger.params.code.value;
  let supplier = req.swagger.params.supplier.value;
  let status = req.swagger.params.status.value;
  let attr = req.swagger.params.attr.value;
  let page = req.swagger.params.page.value;
  let limit = req.swagger.params.limit.value;

  let aggregate = schemas.alert()
    .aggregate(query.queries.packing_list(
      code,
      new ObjectId(project),
      new ObjectId(supplier),
      parseInt(status, attr)));

  schemas.alert().aggregatePaginate(aggregate,
    { page: parseInt(page), limit: parseInt(limit) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, page, limit));
};

/**
 * List of Alerts pagination by hashing
 */
exports.alert_list_hashing_logistic = function (req, res) {
  let project = req.swagger.params.project.value;
  let code = req.swagger.params.code.value;
  let supplier = req.swagger.params.supplier.value;
  let status = req.swagger.params.status.value;
  let page = req.swagger.params.page.value;
  let limit = req.swagger.params.limit.value;

  let map = req.body.map(o => new ObjectId(o));

  let aggregate = schemas.alert().aggregate(query.queries.packing_list_logistic(code,
    new ObjectId(project),
    new ObjectId(supplier),
    parseInt(status), map));

  schemas.alert().aggregatePaginate(aggregate,
    { page: parseInt(page), limit: parseInt(limit) },
    _.partial(responses.responses.successHandlerPaginationAggregate, res, req.user.refresh_token, page, limit));
};

/**
 * List of Alerts pagination
 */
exports.alert_list_pagination = function (req, res) {
  let attr = req.swagger.params.attr.value
  let page = req.swagger.params.page.value;
  let limit = req.swagger.params.limit.value;

  let aggregate = schemas.alert().aggregate(query.queries.listAlerts(attr));

  schemas.alert().aggregatePaginate(aggregate,
    { page: parseInt(page), limit: parseInt(limit) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, page, limit));
};

/**
 * List of Alerts pagination
 */
exports.alert_list_pagination_logistic = function (req, res) {
  let page = req.swagger.params.page.value;
  let limit = req.swagger.params.limit.value;
  let map = req.body.map(o => new ObjectId(o));

  let aggregate = schemas.alert().aggregate(query.queries.listAlertsLogistic(map));

  schemas.alert().aggregatePaginate(aggregate,
    { page: parseInt(page), limit: parseInt(limit) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, page, limit));
};
