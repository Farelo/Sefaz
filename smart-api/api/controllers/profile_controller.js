'use strict';
/**
 * Module dependencies.
 */
const successHandler                            = require('../helpers/responses/successHandler');
const successHandlerPagination                  = require('../helpers/responses/successHandlerPagination');
const successHandlerPaginationAggregate         = require('../helpers/responses/successHandlerPaginationAggregate');
const errorHandler                              = require('../helpers/responses/errorHandler');
const query                                     = require('../helpers/queries/complex_queries_profile');
const mongoose                                  = require('mongoose');
const profile                                   = mongoose.model('Profile');
const _                                         = require("lodash");
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
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_read_by_email = function(req, res) {
  profile.find({
      email: req.swagger.params.email.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_auth = function(req, res) {
  profile.aggregate(query.queries.login(req.swagger.params.password.value,req.swagger.params.email.value))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};
/**
 * Update a Profile
 */
exports.profile_update = function(req, res) {  
  profile.update( {
      _id: req.swagger.params.profile_id.value
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

  profile.findOne({
      _id: req.swagger.params.profile_id.value
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
    _.partial(successHandlerPaginationAggregate, res));
};
