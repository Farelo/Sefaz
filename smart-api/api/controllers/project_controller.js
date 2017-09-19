'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const project                    = mongoose.model('Project');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Project
 */
exports.project_create = function(req, res) {
  project.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create a project'))
    .then(_.partial(successHandler, res));
};
/**
 * Create a Project
 */
exports.project_create_array = function(req, res) {
  project.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create a project'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Project
 */
exports.project_read = function(req, res) {
  project.findOne({
      _id: req.swagger.params.project_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read project'));
};
/**
 * Update a Project
 */
exports.project_update = function(req, res) {  
  project.update( {
      _id: req.swagger.params.project_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update project'));
};
/**
 * Delete an Project
 */
exports.project_delete = function(req, res) { 
  project.findOne({
      _id: req.swagger.params.project_id.value
    }).exec()
    .then(doc => doc.remove())
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete project'));
};
/**
 * List of Projets by pagination
 */
exports.project_listPagination = function(req, res) { 
  project.paginate(req.swagger.params.attr.value ? {"name": req.swagger.params.attr.value} : {} , {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list gc16 registers by pagination'));
};
/**
 * List of all Projets
 */
exports.project_list = function(req, res) { 

  project.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all projects'));
};
