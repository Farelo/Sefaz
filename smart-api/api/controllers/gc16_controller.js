'use strict';
/**
 * Module dependencies.
 */
const responses                  = require('../helpers/responses/index')
const schemas                    = require("../schemas/require_schemas")
const _                          = require("lodash");

/**
 * Create a GC16
 */
exports.gc16_create = function (req, res) {
  schemas.GC16.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create gc16 register'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));

};
/**
 * Show the current GC16
 */
exports.gc16_read = function (req, res) {

  schemas.GC16.findOne({
    _id: req.swagger.params.id.value
  })
    .populate('supplier')
    .populate('project')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read gc16 register'));
};
/**
 * Update a GC16
 */
exports.gc16_update = function (req, res) {
  schemas.GC16.update( {
    _id: req.swagger.params.id.value
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update gc16 register'));
};
/**
 * Delete an GC16
 */
exports.gc16_delete = function (req, res) {

  schemas.GC16.findOne({ _id: req.swagger.params.id.value }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete gc16 register'));

};
/**
 * List of GC16's
 */
exports.gc16_list = function (req, res) {
  schemas.GC16.find({})
    .populate('supplier')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list gc16 registers'));
};

/**
 * List of GC16's by pagination
 */
exports.gc16_list_pagination = function (req, res) {
  schemas.GC16.paginate(req.swagger.params.attr.value ? { "packing": req.swagger.params.attr.value } : {}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['supplier', 'project'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list gc16 registers by pagination'));

};
