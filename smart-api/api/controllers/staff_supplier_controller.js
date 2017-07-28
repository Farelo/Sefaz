'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const staff_supplier             = mongoose.model('StaffSupplier');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Staff Supplier
 */
exports.staff_supplier_create = function(req, res) {
  staff_supplier.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create staff supplier'))
    .then(_.partial(successHandler, res));
};
/**
 * Show the current Staff Supplier
 */
exports.staff_supplier_read = function(req, res) {
  staff_supplier.findOne({
      _id: req.swagger.params.staff_supplier_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read staff supplier'));
};
/**
 * Update a Staff Supplier
 */
exports.staff_supplier_update = function(req, res) {  
  staff_supplier.update( {
      _id: req.swagger.params.staff_supplier_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update staff supplier'));
};
/**
 * Delete an Staff Supplier
 */
exports.staff_supplier_delete = function(req, res) { 
  staff_supplier.remove({
      _id: req.swagger.params.staff_supplier_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete staff supplier'));

};
/**
 * List of all staff suppliers
 */
exports.staff_supplier_list = function(req, res) { 
  staff_supplier.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all staff supplier'));
};
/**
 * List of all staff suppliers
 */
exports.staff_supplier_listPagination = function(req, res) { 
  staff_supplier.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all staff supplier pagination'));
};
