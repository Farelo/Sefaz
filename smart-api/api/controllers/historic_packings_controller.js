'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const historic_packings          = mongoose.model('HistoricPackings');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Historic
 */
exports.historic_packings_create = function(req, res) {
  historic_packings.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create Historic'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Historic
 */
exports.historic_packings_read = function(req, res) {
  historic_packings.findOne({
      packing: req.swagger.params.historic_packings_id.value
    })
    .populate('historic.plant')
    .populate('packing')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read Historic'));
};

/**
 * Update a Historic
 */
exports.historic_packings_update = function(req, res) {  
  historic_packings.update( {
      _id: req.swagger.params.historic_packings_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update Historic'));
};
/**
 * Delete an Historic
 */
exports.historic_packings_delete = function(req, res) { 
  historic_packings.remove({
      _id: req.swagger.params.historic_packings_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete Historic'));

};
/**
 * List of all Historics
 */
exports.historic_packings_list = function(req, res) { 
  historic_packings.find({})
    .populate('historic.plant')
    .populate('packing')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all Historics'));
};
/**
 * List of all Historics by pagination
 */
exports.historic_packings_listPagination = function(req, res) { 
  historic_packings.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['historic.plant', 'packing'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list historic by pagination'));

};
