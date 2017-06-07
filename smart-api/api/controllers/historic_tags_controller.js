'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var historic_tags = mongoose.model('HistoricTags');
/**
 * Create a Category
 */
exports.historic_tags_create = function(req, res) {
    historic_tags.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.historic_tags_read = function(req, res) {
    historic_tags.findOne({
            _id: req.swagger.params.historic_tags_id.value
        })
        .populate('friendly_tag')
        .then(historic_tags => res.json({code:200, message: "OK", data: historic_tags}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.historic_tags_update = function(req, res) {  
    historic_tags.update( {
            _id: req.swagger.params.historic_tags_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.historic_tags_delete = function(req, res) { 
    historic_tags.remove({
            _id: req.swagger.params.historic_tags_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.historic_tags_list = function(req, res) { 
    historic_tags.find({})
        .populate('friendly_tag')
        .then(historic_tags => res.json({code:200, message: "OK", data: historic_tags}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.historic_tags_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var historic_tagsList = historic_tags.find({})
        .populate('friendly_tag')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});

    var count = historic_tags.find({}).count();

    Promise.all([count,historic_tagsList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "historic_tags": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
