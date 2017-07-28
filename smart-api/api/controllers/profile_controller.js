'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const profile                    = mongoose.model('Profile');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Profile
 */
exports.profile_create = function(req, res) {
  profile.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create Profile'))
    .then(_.partial(successHandler, res));
};

/**
 * Show the current Profile
 */
exports.profile_read = function(req, res) {
  profile.findOne({
      _id: req.swagger.params.profile_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read profile'));
};

/**
 * Update a Profile
 */
exports.profile_update = function(req, res) {  
  profile.update( {
      _id: req.swagger.params.profile_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update profile'));
};
/**
 * Delete an Profile
 */
exports.profile_delete = function(req, res) { 
  profile.remove({
      _id: req.swagger.params.profile_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete profile'));

};
/**
 * List of all Profiles
 */
exports.profile_list = function(req, res) { 
  profile.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all profiles'));
};
/**
 * List of all Profiles by pagination
 */
exports.profile_listPagination = function(req, res) { 
  profile.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list all profiles by pagination'));
};
