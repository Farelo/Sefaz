'use strict';
/**
 * Module dependencies.
 */
const responses                                 = require('../helpers/responses/index')
const schemas                                   = require("../../config/database/require_schemas")
const query                                     = require('../helpers/queries/complex_queries_profile');
const _                                         = require("lodash");
const hashPassword                              = require('../helpers/utils/encrypt')
const ObjectId                                  = schemas.ObjectId
/**
 * Create a Profile
 */
exports.profile_create = function (req, res) {

  schemas.profile().create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create Profile'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Profile
 */
exports.profile_read = function (req, res) {
  
  schemas.profile().findOne({
    _id: req.swagger.params.profile_id.value
  })
    .then(data => {
      console.log(data.password)
      try {
        data.password = hashPassword.decrypt(data.password);
      } catch (error) {
        responses.successHandler(res, req.user.refresh_token, data);
      }

      responses.successHandler(res, req.user.refresh_token, data);

    })
    .catch(_.partial(responses.errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_read_by_email = function (req, res) {
  let email = req.swagger.params.email.value;
  schemas.profile().find({
    "email": email
  })
    .then(data => {
      try {
        data.password = hashPassword.decrypt(data.password);
      } catch (error) {
        responses.successHandler(res, req.user.refresh_token, data);
      }

      responses.successHandler(res, req.user.refresh_token, data);
    })
    .catch(_.partial(responses.errorHandler, res, 'Error to read profile'));
};
/**
 * Show the current Profile
 */
exports.profile_auth = function (req, res) {

  var credentials = {
    email: req.swagger.params.email.value,
    password: hashPassword.encrypt(req.swagger.params.password.value)
  };

  if (credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {
    schemas.profile().aggregate(query.queries.login(credentials.password, credentials.email))
      .then(_.partial(responses.authSuccess, res, credentials))
      .catch(_.partial(responses.authFail, res));
  }
};
/**
 * Update a Profile
 */
exports.profile_update = function (req, res) {
  let id = req.swagger.params.profile_id.value;

  req.body.password = hashPassword.encrypt(req.body.password)

  schemas.profile().update( {
    _id: id
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update profile'));
};
/**
 * Delete an Profile
 */
exports.profile_delete = function (req, res) {
  let id = req.swagger.params.profile_id.value;

  schemas.profile().findOne({
    _id: id
  }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete profile'));

};
/**
 * List of all Profiles
 */
exports.profile_list = function (req, res) {
  schemas.profile().find({})
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list of all profiles'));
};
/**
 * List of all Profiles by pagination
 */
exports.profile_listPagination = function (req, res) {
  let aggregate = schemas.profile().aggregate(query.queries.profiles);

  schemas.profile().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * List of all Profiles by pagination
 */
exports.profile_listPagination_supplier = function (req, res) {
  let aggregate = schemas.profile().aggregate(query.queries.profiles_supplier(new ObjectId(req.swagger.params.supplier.value)));
  schemas.profile().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * List of all Profiles by pagination by logistic
 */
exports.profile_listPagination_logistic = function (req, res) {
  let aggregate = schemas.profile().aggregate(query.queries.profiles_logistic(new ObjectId(req.swagger.params.logistic.value)));
  schemas.profile().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
