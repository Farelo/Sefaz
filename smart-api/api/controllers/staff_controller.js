'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const staff                      = mongoose.model('Staff');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Staff
 */
exports.staff_create = function(req, res) {
  staff.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create staff'))
    .then(_.partial(successHandler, res));
};

/**
 * Show the current Staff
 */
exports.staff_read = function(req, res) {
  staff.findOne({
      _id: req.swagger.params.staff_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to create staff'));
};

/**
 * Update a Staff
 */
exports.staff_update = function(req, res) {  
  staff.update( {
      _id: req.swagger.params.staff_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update staff')); 
};
/**
 * Delete an Staff
 */
exports.staff_delete = function(req, res) { 
  staff.remove({
      _id: req.swagger.params.staff_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete staff'));

};
/**
 * List of all staff
 */
exports.staff_list = function(req, res) { 
  staff.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all staff'));
};
/**
 * List of all staff by pagination
 */
exports.staff_listPagination = function(req, res) { 
  staff.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['profile'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list all of staff by pagination'));
};
