'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var logistic_operator = mongoose.model('LogisticOperator');

/**
 * Create a Category
 */
exports.logistic_operator_create = function(req, res) {
    logistic_operator.create(req.body)
           .catch(err =>res.status(404).send({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))

};

/**
 * Show the current Category
 */
exports.logistic_operator_read = function(req, res) {
    logistic_operator.findOne({
            _id: req.swagger.params.logistic_operator_id.value
        })
        .populate('profile')
        .then(logistic_operator => res.json({code:200, message: "OK", data: logistic_operator}))
        .catch(err =>res.status(404).send({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.logistic_operator_update = function(req, res) {  
    logistic_operator.update( {
            _id: req.swagger.params.logistic_operator_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err =>res.status(404).send({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.logistic_operator_delete = function(req, res) { 
    logistic_operator.remove({
            _id: req.swagger.params.logistic_operator_id.value
        })
        .catch(err =>res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.logistic_operator_list = function(req, res) { 
    logistic_operator.find({})
        .populate('profile')
        .then(logistic_operators => res.json({code:200, message: "OK", data: logistic_operators}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};

exports.logistic_operator_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var adminList = logistic_operator.find({})
        .populate('profile')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = logistic_operator.find({}).count();

    Promise.all([count,adminList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "logistic_operators": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
