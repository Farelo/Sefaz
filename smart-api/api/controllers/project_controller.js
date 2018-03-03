'use strict';
/**
 * Module dependencies.
 */
const responses                  = require('../helpers/responses/index')
const schemas                    = require("../../config/database/require_schemas")
const _                          = require("lodash");
/**
 * Create a Project
 */
exports.project_create = function (req, res) {
  schemas.project().create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create a project'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Create a Project
 */
exports.project_create_array = function (req, res) {
  schemas.project().create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create a project'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Project
 */
exports.project_read = function (req, res) {
  schemas.project().findOne({
    _id: req.swagger.params.project_id.value
  })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read project'));
};
/**
 * Update a Project
 */
exports.project_update = function (req, res) {
  schemas.project().update( {
    _id: req.swagger.params.project_id.value
  }, req.body, {
      upsert: true
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update project'));
};
/**
 * Delete an Project
 */
exports.project_delete = function (req, res) {
  schemas.project().findOne({
    _id: req.swagger.params.project_id.value
  }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete project'));
};
/**
 * List of Projets by pagination
 */
exports.project_listPagination = function (req, res) {
  schemas.project().paginate(req.swagger.params.attr.value ? { "name": req.swagger.params.attr.value } : {}, {
    page: parseInt(req.swagger.params.page.value),
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of all Projets
 */
exports.project_list = function (req, res) {

  schemas.project().find({})
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all projects'));
};
