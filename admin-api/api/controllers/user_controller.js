'use strict';
/**
 * Module dependencies.
 */
const successHandler                            = require('../helpers/responses/successHandler');
const successHandlerPagination                  = require('../helpers/responses/successHandlerPagination');
const errorHandler                              = require('../helpers/responses/errorHandler');
const constants                                 = require('../helpers/constants');
const mongoose                                  = require('mongoose');
const user                                      = mongoose.model('User');
const _                                         = require("lodash");
mongoose.Promise                                = global.Promise;
/**
 * Create a user
 */
exports.user_create = function(req, res) {

  user.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create user'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current user
 */
exports.user_read = function(req, res) {
  user.findOne({
      _id: req.swagger.params.user_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read user'));
};
/**
 * Update a user
 */
exports.user_update = function(req, res) {  
  user.update( {
      _id: req.swagger.params.user_id.value
    },  req.body)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update user'));
};
/**
 * Show the current user
 */
exports.user_auth = function(req, res) {
  user.findOne({'password': req.swagger.params.password.value,'email': req.swagger.params.email.value})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Delete an user
 */
exports.user_delete = function(req, res) { 

  user.findOne({
      _id: req.swagger.params.user_id.value
    }).exec()
    .then(doc => doc.remove())
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete user'));

};
/**
 * List of all users
 */
exports.user_list = function(req, res) { 
  user.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all users'));
};
/**
 * List of all users by pagination
 */
exports.user_listPagination = function(req, res) { 
  user.paginate(req.swagger.params.attr.value ? {"name": req.swagger.params.attr.value, 'profile': constants.ADMIN } : {'profile': constants.ADMIN } , {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list users by pagination'));
};
