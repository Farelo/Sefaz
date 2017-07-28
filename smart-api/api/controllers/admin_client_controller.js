'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const admin_client               = mongoose.model('AdminClient');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a admin client
 */
exports.admin_client_create = function(req, res) {
  admin_client.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create admin client'))
    .then(_.partial(successHandler, res));

};
/**
 * Show the current admin client
 */
exports.admin_client_read = function(req, res) {

  admin_client.findOne({
      _id: req.swagger.params.admin_client_id.value
    })
    .populate('profile')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read admin client'));
};
/**
 * Update a admin client
 */
exports.admin_client_update = function(req, res) {  
  admin_client.update( {
      _id: req.swagger.params.admin_client_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update admin client'));
};
/**
 * Delete an admin client
 */
exports.admin_client_delete = function(req, res) { 
  admin_client.remove({
      _id: req.swagger.params.admin_client_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete admin client'));

};
/**
 * List of all admin client
 */
exports.admin_client_list = function(req, res) { 
  admin_client.find({})
    .populate('profile')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all admin client'));
};
/**
 * List of all admin client by pagination
 */
exports.admin_client_listPagination = function(req, res) { 
  admin_client.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all admin client by pagination'));
};
