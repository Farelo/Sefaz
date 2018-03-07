'use strict';
/**
 * Module dependencies.
 */
const responses        = require('../helpers/responses/index')
const schemas          = require("../../config/database/require_schemas")
const constants        = require("../helpers/utils/constants")
const _                = require("lodash")
const hashPassword     = require('../helpers/utils/encrypt')
/**
 * Create a user
 */
exports.user_create = function(req, res) {

  schemas.user().create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create user'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current user
 */
exports.user_read = function(req, res) {
  schemas.user().findOne({
      _id: req.swagger.params.user_id.value
    })
    .then(data => {

      try {
        data.password = hashPassword.decrypt(data.password);
      } catch (error) {
        responses.successHandler(res, req.user.refresh_token, data);
      }

      responses.successHandler(res, req.user.refresh_token, data);

    })
    .catch(_.partial(responses.errorHandler, res, 'Error to read user'));
};
/**
 * Update a user
 */
exports.user_update = function(req, res) {  
  schemas.user().update( {
      _id: req.swagger.params.user_id.value
    },  req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update user'));
};
/**
 * Show the current user
 */
exports.user_auth = function(req, res) {

  var credentials = {
    email: req.swagger.params.email.value,
    password: hashPassword.encrypt(req.swagger.params.password.value)
  };

  if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {

    schemas.user().findOne({
        'password': credentials.password,
        'email': credentials.email
      })
      .then(_.partial(responses.authSuccess, res, credentials))
      .catch(_.partial(responses.authFail, res, 'Error to auth profile'));
  }
};
/**
 * Delete an user
 */
exports.user_delete = function(req, res) { 

  schemas.user().findOne({
      _id: req.swagger.params.user_id.value
    }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete user'));

};
/**
 * List of all users
 */
exports.user_list = function(req, res) { 
  schemas.user().find({})
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list of all users'));
};
/**
 * List of all users by pagination
 */
exports.user_listPagination = function(req, res) { 
  schemas.user().paginate(req.swagger.params.attr.value ? {
      "name": req.swagger.params.attr.value,
      'profile': constants.ADMIN
    } : {
      'profile': constants.ADMIN
    }, {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list users by pagination'));
};
