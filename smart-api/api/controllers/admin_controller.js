'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var admin = mongoose.model('Admin');
/**
 * Create a Category
 */
exports.admin_create = function(req, res) {
    admin.create(req.body)
           .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))

};
/**
 * Show the current Category
 */
exports.admin_read = function(req, res) {

    admin.findOne({
            _id: req.swagger.params.admin_id.value
        })
        .populate('profile')
        .then(admin => res.json({code:200, message: "OK", data: admin}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.admin_update = function(req, res) {  
    admin.update( {
            _id: req.swagger.params.admin_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.admin_delete = function(req, res) { 
    admin.remove({
            _id: req.swagger.params.admin_id.value
        })
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.admin_list = function(req, res) { 
    admin.find({})
        .then(admins => res.json({code:200, message: "OK", data: admins}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};

exports.admin_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var adminList = admin.find({})
        .populate('profile')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = admin.find({}).count();

    Promise.all([count,adminList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "admins": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
