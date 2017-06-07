'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var company = mongoose.model('Company');

/**
 * Create a Category
 */
exports.company_create = function(req, res) {

    company.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))

};

/**
 * Show the current Category
 */
exports.company_read = function(req, res) {
    company.findOne({
            _id: req.swagger.params.company_id.value
        })
        .then(company => res.json({code:200, message: "OK", data: company}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.company_update = function(req, res) {  
    company.update( {
            _id: req.swagger.params.company_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.company_delete = function(req, res) { 
    company.remove({
            _id: req.swagger.params.company_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.company_list = function(req, res) { 
    company.find({})
        .then(companies => res.json({code:200, message: "OK", data: companies}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};


exports.company_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var projectList = company.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = company.find({}).count();

    Promise.all([count,projectList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "companies": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
