'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var friendly_tag = mongoose.model('FriendlyTag');
/**
 * Create a Category
 */
exports.friendly_tag_create = function(req, res) {
    friendly_tag.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.friendly_tag_read = function(req, res) {
    friendly_tag.findOne({
            _id: req.swagger.params.friendly_tag_id.value
        })
        .then(friendly_tag => res.json({code:200, message: "OK", data: friendly_tag}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.friendly_tag_update = function(req, res) {  
    friendly_tag.update( {
            _id: req.swagger.params.friendly_tag_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.friendly_tag_delete = function(req, res) { 
    friendly_tag.remove({
            _id: req.swagger.params.friendly_tag_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.friendly_tag_list = function(req, res) { 
    friendly_tag.find({})
        .then(friendly_tags => res.json({code:200, message: "OK", data: friendly_tags}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.friendly_tag_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var friendly_tagList = friendly_tag.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});

    var count = friendly_tag.find({}).count();

    Promise.all([count,friendly_tagList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "friendly_tags": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
