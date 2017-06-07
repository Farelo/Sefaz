'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var route = mongoose.model('Route');
/**
 * Create a Category
 */
exports.route_create = function(req, res) {
    	route.create(req.body)
           .then(success => res.json({code:200, message: "OK", response: success}))
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Show the current Category
 */
exports.route_read = function(req, res) {
      route.findOne({_id: req.swagger.params.route_id.value})
           .populate('plant_factory')
           .populate('plant_supplier')
           .populate('supplier')
           .then(route => res.json({code:200, message: "OK", data: route}))
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.route_update = function(req, res) {
    route.update( {_id: req.swagger.params.route_id.value }, req.body, { upsert: true})
         .then(success => res.json({code:200, message: "OK", response: success}))
         .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Delete an Category
 */
exports.route_delete = function(req, res) {
     route.remove({_id : req.swagger.params.route_id.value})
          .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
          .then(success => res.json({code:200, message: "OK", response: success}));
};
/**
 * List of Categories
 */
exports.route_list_all = function(req, res) {
	   route.find({})
          .populate('plant_factory')
          .populate('plant_supplier')
          .populate('supplier')
          .then(routes => res.json({code:200, message: "OK", data: routes}))
          .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.route_list_pagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var routeList = route.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .populate('plant_factory')
        .populate('plant_supplier')
        .populate('supplier')
        .sort({_id: 1});

    var count = route.find({}).count();
    Promise.all([count,routeList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "routes": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
