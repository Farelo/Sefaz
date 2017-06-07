'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var historic_packings = mongoose.model('HistoricPackings');
/**
 * Create a Category
 */
exports.historic_packings_create = function(req, res) {
    historic_packings.create(req.body)
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
           .then(success => res.json({code:200, message: "OK", response: success}))
};

/**
 * Show the current Category
 */
exports.historic_packings_read = function(req, res) {
    historic_packings.findOne({
            packing: req.swagger.params.historic_packings_id.value
        })
        .populate('historic.plant')
        .populate('packing')
        .then(historic_packings => res.json({code:200, message: "OK", data: historic_packings}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.historic_packings_update = function(req, res) {  
    historic_packings.update( {
            _id: req.swagger.params.historic_packings_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.historic_packings_delete = function(req, res) { 
    historic_packings.remove({
            _id: req.swagger.params.historic_packings_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.historic_packings_list = function(req, res) { 
    historic_packings.find({})
        .populate('historic.plant')
        .populate('packing')
        .then(historic_packings => res.json({code:200, message: "OK", data: historic_packings}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.historic_packings_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var historic_packingsList = historic_packings.find({})
        .populate('historic.plant')
        .populate('packing')
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});

    var count = historic_packings.find({}).count();

    Promise.all([count,historic_packingsList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "historic_packings": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
