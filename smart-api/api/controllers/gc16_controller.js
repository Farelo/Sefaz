'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const gc16                       = mongoose.model('GC16');
const packing                    = mongoose.model('Packing');
const ObjectId                   = require('mongoose').Types.ObjectId;
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a GC16
 */
exports.gc16_create = function(req, res) {
  gc16.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create gc16 register'))
    .then(_.partial(successHandler, res));

};
/**
 * Show the current GC16
 */
exports.gc16_read = function(req, res) {

  gc16.findOne({
      _id: req.swagger.params.id.value
    })
    .populate('supplier')
    .populate('project')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read gc16 register'));
};
/**
 * Update a GC16
 */
exports.gc16_update = function(req, res) {  
  gc16.update( {
      _id: req.swagger.params.id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update gc16 register'));
};
/**
 * Delete an GC16
 */
exports.gc16_delete = function(req, res) { 

  packing.update({gc16: new ObjectId(req.swagger.params.id.value)}, {$unset: {gc16: 1}}, {upsert: true,multi: true})
         .then(() => gc16.remove({_id: req.swagger.params.id.value}))
         .then(_.partial(successHandler, res))
         .catch(_.partial(errorHandler, res, 'Error to delete gc16 register'));

};
/**
 * List of GC16's
 */
exports.gc16_list = function(req, res) { 
  gc16.find({})
    .populate('supplier')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers'));
};
/**
 * List of GC16's by pagination
 */
exports.gc16_list_pagination = function(req, res) { 
  gc16.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier','project'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers by pagination'));

};
