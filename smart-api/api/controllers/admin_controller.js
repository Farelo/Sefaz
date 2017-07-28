'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const admin                      = mongoose.model('Admin');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Admin
 */
exports.admin_create = function(req, res) {
  admin.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create admin'))
    .then(_.partial(successHandler, res));

};
/**
 * Show the current Admin
 */
exports.admin_read = function(req, res) {

  admin.findOne({
      _id: req.swagger.params.admin_id.value
    })
    .populate('profile')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read admin'));
};
/**
 * Update a Admin
 */
exports.admin_update = function(req, res) {  
  admin.update( {
      _id: req.swagger.params.admin_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update admin')); 
};
/**
 * Delete an Admin
 */
exports.admin_delete = function(req, res) { 
  admin.remove({
      _id: req.swagger.params.admin_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete admin'));

};
/**
 * List of all Admin's
 */
exports.admin_list = function(req, res) { 
  admin.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all admin'));
};
/**
 * List of all Admin's by pagination
 */
exports.admin_listPagination = function(req, res) { 
  admin.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list admins by pagination'));
};
