'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const query                      = require('../helpers/queries/complex_queries_departments');
const mongoose                   = require('mongoose');
const ObjectId                   = require('mongoose').Types.ObjectId;
const department                 = mongoose.model('Department');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Department
 */
exports.department_create = function(req, res) {
  department.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create deparment'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Department
 */
exports.department_read = function(req, res) {
  department.findOne({
      _id: req.swagger.params.department_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read department'));
};
/**
 * Show the current Department by name
 */
exports.department_read_by_name = function(req, res) {
  department.findOne({
      "name": req.swagger.params.department_name.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read department by name'));
};
/**
 * Update a Department
 */
exports.department_update = function(req, res) {  
  department.update( {
      _id: req.swagger.params.department_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update department')); 
};
/**
 * Delete an Department
 */
exports.department_delete = function(req, res) { 
  department.remove({
      _id: req.swagger.params.department_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete department'));
};
/**
 * List of departments
 */
exports.department_list_pagination = function(req, res) { 
  department.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['plant'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of departments by plant
 */
exports.department_list_pagination_by_plant = function(req, res) { 
  department.paginate({plant: new ObjectId(req.swagger.params.id.value)}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['plant'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of all departments
 */
exports.department_list_all = function(req, res) { 
  department.find({})
    .populate("plant")
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all departments'));
};
/**
 * List of departments by plant
 */
exports.list_department_by_plant = function(req, res) {
  department.aggregate(query.queries.listDepartmentsByPlant)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all departments by plant'));
};
