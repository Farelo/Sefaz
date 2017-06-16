'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var alert = mongoose.model('Alerts');
var query = require('../helpers/queries/complex_queries_alerts');
/**
 * Create a Category
 */
exports.alert_create = function(req, res) {
    alert.create(req.body)
           .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};
/**
 * Show the current Category
 */
exports.alert_read_by_packing = function(req, res) {

    alert.findOne({
            packing: req.swagger.params.packing_id.value
        })
        .populate('actual_plant')
        .populate('department')
        .populate('correct_plant_supplier')
        .populate('correct_plant_factory')
        .populate('packing')
        .populate('supplier')
        .then(alert => res.json({code:200, message: "OK", data: alert}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.alert_update = function(req, res) {  
    alert.update( {
            _id: req.swagger.params.alert_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.alert_delete = function(req, res) { 
    alert.remove({
            _id: req.swagger.params.alert_id.value
        })
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.alert_list_hashing = function(req, res) { 
  var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
  var alertList = alert.find(  {"hashpacking": req.swagger.params.hashing.value,"status": req.swagger.params.status.value})
      .populate("packing")
      .skip(value).limit(parseInt(req.swagger.params.limit.value))
      .sort({_id: 1});
  var count = alert.find({}).count();

  Promise.all([count,alertList])
      .then(result => res.json({code:200, message: "OK", "count": result[0], "data": result[1]}))
      .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};



exports.alert_list_pagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var alertList = alert.aggregate(query.queries.listAlerts)
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = alert.find({}).count();

    Promise.all([count,alertList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "data": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
