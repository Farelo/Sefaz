'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var department = mongoose.model('Department');

/**
 * Create a Category
 */

exports.department_create = function(req, res) {

    department.create(req.body)
          .then(success => res.json({code:200, message: "OK", response: success}))
          .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Show the current Category
 */
exports.department_read = function(req, res) {
    department.findOne({
            _id: req.swagger.params.department_id.value
        })
        .then(department => res.json({code:200, message: "OK", data: department}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.department_read_by_name = function(req, res) {
    department.findOne({
            "name": req.swagger.params.department_name.value
        })
        .then(department => res.json({code:200, message: "OK", data: department}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.department_update = function(req, res) {  
    console.log(req.body);
    department.update( {
            _id: req.swagger.params.department_id.value
        },  req.body,   {
            upsert: true
        })
        .then(department => res.json({code:200, message: "OK", data: department}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.department_delete = function(req, res) { 
    department.remove({
            _id: req.swagger.params.department_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));
};
/**
 * List of Categories
 */
exports.department_list_pagination = function(req, res) { 
  var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
  var departmentlist = department.find({})
        .skip(value)
        .limit(parseInt(req.swagger.params.limit.value))
        .populate("plant");
  var count = department.find({}).count();
      Promise.all([count, departmentlist])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "departments": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.department_list_all = function(req, res) { 
  department.find({})
        .populate("plant")
        .then(departments => res.json({code:200, message: "OK", data: departments}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
