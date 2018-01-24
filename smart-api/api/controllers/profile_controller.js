'use strict';
/**
 * Module dependencies.
 */
const successHandler                            = require('../helpers/responses/successHandler');
const successHandlerPagination                  = require('../helpers/responses/successHandlerPagination');
const successHandlerPaginationAggregate         = require('../helpers/responses/successHandlerPaginationAggregate');
const errorHandler                              = require('../helpers/responses/errorHandler');
const query                                     = require('../helpers/queries/complex_queries_profile');
const authSuccess                               = require('../helpers/responses/authSuccess');
const authFail                                  = require('../helpers/responses/authFail');
const mongoose                                  = require('mongoose');
const ObjectId                                  = require('mongoose').Types.ObjectId;
const profile                                   = mongoose.model('Profile');
const _                                         = require("lodash");
const hashPassword                              = require('../helpers/utils/encrypt')
mongoose.Promise                                = global.Promise;
/**
 * Create a Profile
 */
exports.profile_create = function(req, res) {

  profile.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create Profile'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Profile
 */
exports.profile_read = function(req, res) {
  profile.findOne({
      _id: req.swagger.params.profile_id.value
    })
    .then( data => {
      data.password = hashPassword.decrypt(data.password);
      successHandler(res, data);
    })
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_read_by_email = function(req, res) {
  let email = req.swagger.params.email.value;
  profile.find({
      "email":email
    })
    .then( data => {
      data.password = hashPassword.decrypt(data.password);
      successHandler(res, data);
    })
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_auth = function(req, res) {

  var credentials = {
    email: req.swagger.params.email.value,
    password: hashPassword.encrypt(req.swagger.params.password.value)
  };

  if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {
    profile.aggregate(query.queries.login(credentials.password,credentials.email))
      .then(_.partial(authSuccess, res, credentials))
      .catch(_.partial(authFail, res));
  }
};
/**
 * Update a Profile
 */
exports.profile_update = function(req, res) {  
  let id = req.swagger.params.profile_id.value;

  req.body.password = hashPassword.encrypt(req.body.password)

  profile.update( {
      _id: id
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update profile'));
};
/**
 * Delete an Profile
 */
exports.profile_delete = function(req, res) { 
  let id = req.swagger.params.profile_id.value;

  profile.findOne({
      _id: id
    }).exec()
    .then(doc => doc.remove())
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete profile'));

};
/**
 * List of all Profiles
 */
exports.profile_list = function(req, res) { 
  profile.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all profiles'));
};
/**
 * List of all Profiles by pagination
 */
exports.profile_listPagination = function(req, res) { 
  let aggregate = profile.aggregate(query.queries.profiles);

  profile.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * List of all Profiles by pagination
 */
exports.profile_listPagination_supplier = function(req, res) { 
  let aggregate = profile.aggregate(query.queries.profiles_supplier(new ObjectId(req.swagger.params.supplier.value)));
  profile.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * List of all Profiles by pagination by logistic
 */
exports.profile_listPagination_logistic = function(req, res) { 
  let aggregate = profile.aggregate(query.queries.profiles_logistic(new ObjectId(req.swagger.params.logistic.value)));
  profile.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res, req.swagger.params.page.value, req.swagger.params.limit.value));
};
