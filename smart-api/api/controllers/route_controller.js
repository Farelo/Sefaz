'use strict';
/**
 * Module dependencies.
 */
const successHandler            = require('../helpers/responses/successHandler');
const successHandlerPagination  = require('../helpers/responses/successHandlerPagination');
const errorHandler              = require('../helpers/responses/errorHandler');
const mongoose                  = require('mongoose');
const route                     = mongoose.model('Route');
const ObjectId                  = require('mongoose').Types.ObjectId;
const packing                   = mongoose.model('Packing');
const _                         = require("lodash");
mongoose.Promise                = global.Promise;
/**
 * Create a Route
 */
exports.route_create = function(req, res) {
  route.create(req.body)
    .then(result => packing.update({code: result.packing_code, supplier: new ObjectId(result.supplier), project: new ObjectId(result.project)},{$push: { "routes": result._id }},{multi: true}))
    .catch(_.partial(errorHandler, res, 'Error to create route'))
    .then(_.partial(successHandler, res));
};
/**
 * Create a Route
 */
exports.route_create_array = function(req, res) {
  route.create(req.body)
    .then(result => Promise.all(result.map(o => packing.update({code: o.packing_code, supplier: new ObjectId(o.supplier)},{$push: { "routes": o._id }},{multi: true}))))
    .catch(_.partial(errorHandler, res, 'Error to create route'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Route
 */
exports.route_read = function(req, res) {
  route.findOne({
      _id: req.swagger.params.route_id.value
    })
    .populate('plant_factory')
    .populate('plant_supplier')
    .populate('supplier')
    .populate('project')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read route'));
};
/**
 * Update a Route
 */
exports.route_update = function(req, res) {  
  route.update( {
      _id: req.swagger.params.route_id.value
    },  req.body)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update route'));
};
/**
 * Delete an Route
 */
exports.route_delete = function(req, res) { 
    route.findOne({_id: req.swagger.params.route_id.value}).exec()
          .then(doc => doc.remove())
          .then(_.partial(successHandler, res))
          .catch(_.partial(errorHandler, res, 'Error to delete route '));
};
/**
 * List of all Routes
 */
exports.route_list_all = function(req, res) { 
  route.find({})
    .populate('plant_factory')
    .populate('plant_supplier')
    .populate('supplier')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all routes'));
};
/**
 * List of all Routes pagination
 */
exports.route_list_pagination = function(req, res) { 
  route.paginate(req.swagger.params.attr.value ?  {"packing_code": req.swagger.params.attr.value} :  {}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['plant_factory', 'plant_supplier', 'supplier', 'project'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list routes by pagination'));
};
