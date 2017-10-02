'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const logistic_operator          = mongoose.model('LogisticOperator');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Logistc Operator
 */
exports.logistic_operator_create = function(req, res) {

  logistic_operator.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create Logistic Operator'))
    .then(_.partial(successHandler, res));

};

/**
 * Show the current Logistc Operator
 */
exports.logistic_operator_read = function(req, res) {
  logistic_operator.findOne({
      _id: req.swagger.params.logistic_operator_id.value
    })
    .populate('profile')
    .populate('suppliers')
    .populate('plant')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read Logistic Operator'));
};

/**
 * Update a Logistc Operator
 */
exports.logistic_operator_update = function(req, res) {  
  logistic_operator.update( {
      _id: req.swagger.params.logistic_operator_id.value
    },  req.body)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update Logistic Operator')); 
};
/**
 * Delete an Logistc Operator
 */
exports.logistic_operator_delete = function(req, res) { 
  logistic_operator.findOne({_id: req.swagger.params.logistic_operator_id.value}).exec()
        .then(doc => doc.remove())
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to delete Logistic Operator'))
};
/**
 * List of all Logistics Operator
 */
exports.logistic_operator_list = function(req, res) { 
  logistic_operator.find({})
    .populate('profile')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all Logistic Operator'));
};
/**
 * List of all Logistics Operator by pagination
 */
exports.logistic_operator_listPagination = function(req, res) { 
  logistic_operator.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list admins by pagination'));
};
