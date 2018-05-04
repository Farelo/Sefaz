'use strict';
/**
 * Module dependencies.
 */

const responses                  = require('../helpers/responses/index')
const schemas                    = require("../schemas/require_schemas")
const query                      = require('../helpers/queries/complex_queries_departments');
const _                          = require("lodash");
const ObjectId                   = schemas.ObjectId

/**
 * Create a Department
 */
exports.department_create = function (req, res) {
  schemas.department.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create deparment'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Create a Department with array
 */
exports.department_create_array = function (req, res) {
  schemas.department.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create deparment'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Department
 */
exports.department_read = function (req, res) {
  schemas.department.findOne({
    _id: req.swagger.params.department_id.value
  })
    .populate("plant")
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read department'));
};
/**
 * Show the current Department by name
 */
exports.department_read_by_name = function (req, res) {
  schemas.department.findOne({
    "name": req.swagger.params.department_name.value
  })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read department by name'));
};
/**
 * Update a Department
 */
exports.department_update = function (req, res) {
  schemas.department.findOne({
    _id: req.swagger.params.department_id.value
  }).exec()
    .then(doc => doc.update(req.body))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update department'));

};
/**
 * Delete an Department
 */
exports.department_delete = function (req, res) {

  schemas.department.findOne({
    _id: req.swagger.params.department_id.value
  }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete department'));
};
/**
 * List of departments
 */
exports.department_list_pagination = function (req, res) {
  schemas.department.paginate(req.swagger.params.attr.value ? { "name": req.swagger.params.attr.value } : {}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['plant'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of departments by plant
 */
exports.department_list_pagination_by_plant = function (req, res) {
  schemas.department.paginate({ plant: new ObjectId(req.swagger.params.id.value) }, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['plant'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of all departments
 */
exports.department_list_all = function (req, res) {
  schemas.department.find({})
    .populate("plant")
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all departments'));
};
/**
 * List of departments by plant
 */
exports.list_department_by_plant = function (req, res) {
  schemas.department.aggregate(query.queries.listDepartmentsByPlant)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all departments by plant'));
};
