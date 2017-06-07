'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var staff_supplier = mongoose.model('StaffSupplier');
/**
 * Create a Category
 */
exports.staff_supplier_create = function(req, res) {
    staff_supplier.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.staff_supplier_read = function(req, res) {
    staff_supplier.findOne({
            _id: req.swagger.params.staff_supplier_id.value
        })
        .then(staff_supplier => res.json({code:200, message: "OK", data: staff_supplier}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.staff_supplier_update = function(req, res) {  
    staff_supplier.update( {
            _id: req.swagger.params.staff_supplier_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.staff_supplier_delete = function(req, res) { 
    staff_supplier.remove({
            _id: req.swagger.params.staff_supplier_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.staff_supplier_list = function(req, res) { 
    company.find({})
        .then(staff_suppliers => res.json({code:200, message: "OK", data: staff_suppliers}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.staff_supplier_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var staff_supplierList = staff_supplier.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});

    var count = staff_supplier.find({}).count();

    Promise.all([count,staff_supplierList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "staff_suppliers": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
