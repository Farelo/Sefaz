'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const query                      = require('../helpers/queries/complex_queries_tag');
const request                    = require('request');
const token                      = require('../helpers/request/token');
const loka_api                   = require('../helpers/request/loka-api');
const mongoose                   = require('mongoose');
const tags                       = mongoose.model('Tags');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create a Tags
 */
exports.tags_create = function(req, res) {

    token()
    .then(token => loka_api.confirmDevice(token,req.body.code))
    .then(() => tags.create(req.body))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to create tags'))

};
/**
 * Create a Tags a lot
 */
exports.tags_create_array = function(req, res) {

    token()
    .then(token => Promise.all(req.body.map(o => loka_api.confirmDevice(token,o.code))))
    .then(() => tags.create(req.body))
    .catch(_.partial(errorHandler, res, 'Error to create tags'))
    .then(_.partial(successHandler, res))

};
/**
 * Show the current Tags
 */
exports.tags_read = function(req, res) {
    tags.findOne({
            _id: req.swagger.params.tags_id.value
        })
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to read tags'));
};
/**
 * Show the current Tags by mac
 */
exports.tags_read_by_mac = function(req, res) {
    tags.findOne({
            mac: req.swagger.params.tags_mac.value
        })
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to read tags by mac'));
};
/**
 * Update a Tags
 */
exports.tags_update = function(req, res) {  
      token()
        .then(token => confirmDevice(token,req.body.code))
        .then(() => tags.update({_id: req.swagger.params.tags_id.value}, req.body,{upsert: true}))
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to update tags'));
};
/**
 * Delete an Tags
 */
exports.tags_delete = function(req, res) { 
   tags.findOne({_id: req.swagger.params.tags_id.value}).exec()
        .then(doc => doc.remove())
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to delete tags'));

};
/**
 * List of all tags
 */
exports.tags_list_all = function(req, res) { 
    tags.find({})
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list of all tags'));
};
/**
 * List of tags's by pagination
 */
exports.tags_list_all_no_binded = function(req, res) { 

    tags.aggregate(query.queries.listTagsNoBinded)
        .then(_.partial(successHandler, res))
        .catch(_.partial(errorHandler, res, 'Error to list all tags no binded'));

};
/**
 * List of tags's by pagination
 */
exports.tags_list_pagination = function(req, res) {

  tags.paginate(req.swagger.params.attr.value ? {"code": req.swagger.params.attr.value} : {}, {
      page: parseInt(req.swagger.params.page.value),
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list tags by pagination'));
};
