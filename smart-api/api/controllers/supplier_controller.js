'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var supplier = mongoose.model('Supplier');
var query = require('../helpers/queries/complex_queries_supplier');
/**
 * Create a Category
 */

exports.supplier_create = function(req, res) {
    console.log(req.body);
    supplier.create(req.body)
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(function(success){

          res.send({code:200, message: "OK", response: success});

        } );
};

/**
 * Show the current Category
 */
exports.supplier_read = function(req, res) {
    supplier.findOne({
            _id: req.swagger.params.supplier_id.value
        })
        .populate('profile')
        .populate('plant')
        .then(supplier => res.json({code:200, message: "OK", data: supplier}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Show the current Category by DUNS
 */
exports.supplier_read_by_duns = function(req, res) {
    supplier.findOne({
            "duns": req.swagger.params.supplier_duns.value
        })
        .populate('profile')
        .populate('plant')
        .then(supplier => res.json({code:200, message: "OK", data: supplier}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.supplier_update = function(req, res) {  
    supplier.update( {
            _id: req.swagger.params.supplier_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Delete an Category
 */
exports.supplier_delete = function(req, res) { 
    supplier.remove({
            _id: req.swagger.params.supplier_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));
};

/**
 * List of Categories
 */
exports.supplier_list_pagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var supplierList = supplier.find({})
        .populate('profile')
        .populate('plant')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = supplier.find({}).count();
    Promise.all([count,supplierList])
        .then(result =>res.json({code:200, message: "OK", "count": result[0], "suppliers": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.supplier_list_all = function(req, res) { 
    supplier.find({})
        .populate('profile')
        .populate('plant')
        .then(suppliers => res.json({code:200, message: "OK", data: suppliers}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.list_all_by_duns = function(req, res) { 
  var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
  var supplierList = supplier.aggregate(query.queries.supplierListByDuns(req.swagger.params.supplier_id.value))
      .skip(value).limit(parseInt(req.swagger.params.limit.value))
      .sort({_id: 1});

  var count = supplier.find({}).count();

  Promise.all([count,supplierList])
        .then(result =>res.json({code:200, message: "OK", "count": result[0], "suppliers": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));


};
