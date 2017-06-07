'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var admin_client = mongoose.model('AdminClient');
/**
 * Create a Category
 */
exports.admin_client_create = function(req, res) {
    admin_client.create(req.body)
           .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))

};
/**
 * Show the current Category
 */
exports.admin_client_read = function(req, res) {

    admin_client.findOne({
            _id: req.swagger.params.admin_client_id.value
        })
        .populate('profile')
        .then(admin_client => res.json({code:200, message: "OK", data: admin_client}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.admin_client_update = function(req, res) {  
    admin_client.update( {
            _id: req.swagger.params.admin_client_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.admin_client_delete = function(req, res) { 
    admin_client.remove({
            _id: req.swagger.params.admin_client_id.value
        })
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.admin_client_list = function(req, res) { 
    admin_client.find({})
        .populate('profile')
        .then(admin_clients => res.json({code:200, message: "OK", data: admin_clients}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};



exports.admin_client_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var admin_clientList = admin_client.find({})
        .populate('profile')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = admin_client.find({}).count();

    Promise.all([count,admin_clientList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "adminclients": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
