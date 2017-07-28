'use strict';
/**
 * Module dependencies.
 */
 const successHandler             = require('../helpers/responses/successHandler');
 const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
 const errorHandler               = require('../helpers/responses/errorHandler');
 const query                      = require('../helpers/queries/complex_queries_supplier');
 const mongoose                   = require('mongoose');
 const supplier                   = mongoose.model('Supplier');
 const _                          = require("lodash");
 mongoose.Promise                 = global.Promise;
/**
 * Create a Supplier
 */
exports.supplier_create = function(req, res) {

    supplier.create(req.body)
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(function(success){

          res.send({code:200, message: "OK", response: success});

        } );
};

/**
 * Show the current Supplier
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
 * Show the current Supplier by DUNS
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
 * Update a Supplier
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
 * Delete an Supplier
 */
exports.supplier_delete = function(req, res) { 
    supplier.remove({
            _id: req.swagger.params.supplier_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));
};

/**
 * List of Suppliers by pagination
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

/**
 * List of all Suppliers
 */
exports.supplier_list_all = function(req, res) { 
    supplier.find({})
        .populate('profile')
        .populate('plant')
        .then(suppliers => res.json({code:200, message: "OK", data: suppliers}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};


/**
 * List of all Suppliers by duns
 */
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
