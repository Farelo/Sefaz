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
    .catch(_.partial(errorHandler, res, 'Error to create supplier'))
    .then(_.partial(successHandler, res));
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
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read supplier'));
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
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read supplier by duns'));
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
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update supplier'));
};
/**
 * Delete an Supplier
 */
exports.supplier_delete = function(req, res) { 
  supplier.remove({
      _id: req.swagger.params.supplier_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete supplier'));
};

/**
 * List of Suppliers by pagination
 */
exports.supplier_list_pagination = function(req, res) { 
  supplier.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile', 'plant'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list suppliers by pagination'));
};

/**
 * List of all Suppliers
 */
exports.supplier_list_all = function(req, res) {
  // supplier.aggregate(query.queries.group)
  supplier.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all suppliers'));
};
// /**
//  * List of all Suppliers by duns refatorar isso
//  */
// exports.list_all_by_duns = function(req, res) { 
//   var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
//   var supplierList = supplier.aggregate(query.queries.supplierListByDuns(req.swagger.params.supplier_id.value))
//     .skip(value).limit(parseInt(req.swagger.params.limit.value))
//     .sort({
//       _id: 1
//     });
//
//   var count = supplier.find({}).count();
//
//   Promise.all([count, supplierList])
//     .then(result => res.json({
//       code: 200,
//       message: "OK",
//       "count": result[0],
//       "suppliers": result[1]
//     }))
//     .catch(err => res.status(404).json({
//       code: 404,
//       message: "ERROR",
//       response: err
//     }));
//
//
// };
