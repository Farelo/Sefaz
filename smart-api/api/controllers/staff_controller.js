'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var staff = mongoose.model('Staff');
/**
 * Create a Category
 */
exports.staff_create = function(req, res) {
    staff.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.staff_read = function(req, res) {
    staff.findOne({
            _id: req.swagger.params.staff_id.value
        })
        .then(staff => res.json({code:200, message: "OK", data: staff}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.staff_update = function(req, res) {  
    staff.update( {
            _id: req.swagger.params.staff_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.staff_delete = function(req, res) { 
    staff.remove({
            _id: req.swagger.params.staff_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.staff_list = function(req, res) { 
    company.find({})
        .then(staffs => res.json({code:200, message: "OK", data: staffs}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.staff_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var staffList = staff.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});

    var count = staff.find({}).count();

    Promise.all([count,staffList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "staffs": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
