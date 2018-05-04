'use strict';
/**
 * Module dependencies.
 */
const responses                 = require('../helpers/responses/index')
const schemas                   = require("../schemas/require_schemas")
const _                         = require("lodash");
const ObjectId                  = schemas.ObjectId
/**
 * Create a Route
 */
exports.route_create = function (req, res) {
  schemas.route.create(req.body)
    .then(result => schemas.packing.update({ code: result.packing_code, supplier: new ObjectId(result.supplier), project: new ObjectId(result.project) }, { $push: { "routes": result._id } }, { multi: true }))
    .catch(_.partial(responses.errorHandler, res, 'Error to create route'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Create a Route
 */
exports.route_create_array = function (req, res) {
  schemas.route.create(req.body)
    .then(result => Promise.all(result.map(o => schemas.packing.update({ code: o.packing_code, supplier: new ObjectId(o.supplier) }, { $push: { "routes": o._id } }, { multi: true }))))
    .catch(_.partial(responses.errorHandler, res, 'Error to create route'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Route
 */
exports.route_read = function (req, res) {
  schemas.route.findOne({
    _id: req.swagger.params.route_id.value
  })
    .populate('plant_factory')
    .populate('plant_supplier')
    .populate('supplier')
    .populate('project')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read route'));
};
/**
 * Update a Route
 */
exports.route_update = function (req, res) {
  schemas.route.update( {
    _id: req.swagger.params.route_id.value
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update route'));
};
/**
 * Delete an Route
 */
exports.route_delete = function (req, res) {
  schemas.route.findOne({ _id: req.swagger.params.route_id.value }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete route '));
};
/**
 * List of all Routes
 */
exports.route_list_all = function (req, res) {
  schemas.route.find({})
    .populate('plant_factory')
    .populate('plant_supplier')
    .populate('supplier')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all routes'));
};
/**
 * List of all Routes pagination
 */
exports.route_list_pagination = function (req, res) {
  schemas.route.paginate(req.swagger.params.attr.value ? { "packing_code": req.swagger.params.attr.value } : {}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['plant_factory', 'plant_supplier', 'supplier', 'project'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list routes by pagination'));
};
