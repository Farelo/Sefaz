'use strict';
/**
 * Module dependencies.
 */
const responses                  = require('../helpers/responses/index')
const schemas                    = require("../schemas/require_schemas")
const _                          = require("lodash");

/**
 * Create a Historic
 */
exports.historic_packings_create = function (req, res) {
  schemas.historicPackings.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create Historic'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Historic
 */
exports.historic_packings_read = function (req, res) {
  schemas.historicPackings.findOne({
    packing: req.swagger.params.historic_packings_id.value
  })
    .populate('historic.plant')
    .populate('packing')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read Historic'));
};

/**
 * Update a Historic
 */
exports.historic_packings_update = function (req, res) {
  schemas.historicPackings.update( {
    _id: req.swagger.params.historic_packings_id.value
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update Historic'));
};
/**
 * Delete an Historic
 */
exports.historic_packings_delete = function (req, res) {
  schemas.historicPackings.remove({
    _id: req.swagger.params.historic_packings_id.value
  })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete Historic'));

};
/**
 * List of all Historics
 */
exports.historic_packings_list = function (req, res) {
  schemas.historicPackings.find({})
    .populate('historic.plant')
    .populate('packing')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all Historics'));
};
/**
 * List of all Historics by pagination
 */
exports.historic_packings_listPagination = function (req, res) {
  schemas.historicPackings.paginate({}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['historic.plant', 'packing'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list historic by pagination'));

};
