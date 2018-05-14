'use strict';
/**
 * Module dependencies.
 */
const responses                                 = require('../helpers/responses/index')
const schemas                                   = require("../schemas/require_schemas")
const query                                     = require('../helpers/queries/complex_queries_inventory');
const _                                         = require("lodash");
const token                                     = require('../helpers/request/token');
const loka_api                                  = require('../helpers/request/loka-api');
const ObjectId                                  = schemas.ObjectId


/*
 * list of general pagickings inventory
 **/
exports.general_inventory_packing = function (req, res) {
  let map = req.body.map(o => new ObjectId(o));

  let aggregate = schemas.packing.aggregate(query.queries.inventory_general(map));

  schemas.packing.aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * list of general pagickings inventory by location
 **/
exports.geraneral_inventory_packing_by_plant = function (req, res) {
  let aggregate = schemas.packing.aggregate(query.queries.inventory_general_by_plant(req.swagger.params.code.value, new ObjectId(req.swagger.params.supplier.value), new ObjectId(req.swagger.params.project.value)));

  schemas.packing.aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * list of quantity inventory
 **/
exports.quantity_inventory = function (req, res) {
  let map = req.body.map(o => new ObjectId(o));
  let aggregate = schemas.packing.aggregate(query.queries.quantity_inventory(req.swagger.params.code.value, map));

  schemas.packing.aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregateQuantity, res, req.user.refresh_token, req.swagger.params.code.value, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * List of packings analysis battery
 */
exports.inventory_battery = function (req, res) {
  let code = req.swagger.params.code.value;
  let map = req.body.map(o => new ObjectId(o));

  schemas.packing.paginate(
    code ? { "supplier": { "$in": map }, "code": code } : { "supplier": { "$in": map } },
    {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
      sort: {
        battery: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory battery by code'));
};
/**
 * List of packings analysis by permanence time
 */
exports.inventory_permanence = function (req, res) {
  let code = req.swagger.params.code.value;
  let map = req.body.map(o => new ObjectId(o));

  schemas.packing.paginate(
    { "supplier": { "$in": map }, "code": code },
    {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
      sort: {
        'permanence.amount_days': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * Historic of packings by serial
 */
exports.inventory_packing_absence = function (req, res) {
  let serial = req.swagger.params.serial.value;
  let code = req.swagger.params.code.value;
  let map = req.body.map(o => new ObjectId(o));

  schemas.historicPackings.paginate(
    { "supplier": { "$in": map }, "serial": serial, "packing_code": code },
    {
      page: parseInt(req.swagger.params.page.value),
      populate: query.queries.populate,
      sort: {
        'date': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * Historic of packings by serial
 */
exports.inventory_packing_historic = function (req, res) {
  let serial = req.swagger.params.serial.value;
  let code = req.swagger.params.code.value;
  let map = req.body.map(o => new ObjectId(o));

  schemas.historicPackings.paginate(
    { "supplier": { "$in": map }, "serial": serial, "packing_code": code },
    {
      page: parseInt(req.swagger.params.page.value),
      populate: query.queries.populate,
      sort: {
        'date': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * All packings inventory
 */
exports.inventory_packings = function (req, res) {
  let code = req.swagger.params.code.value;
  let map = req.body.map(o => new ObjectId(o));

  schemas.packing.paginate(code ? { "supplier": { "$in": map }, "code": code } : { "supplier": { "$in": map } }, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
    sort: {
      '_id': 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
