'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var plant = mongoose.model('Plant');

/**
 * Create a Category
 */
exports.plant_create = function(req, res) {

    plant.create(req.body)
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};

/**
 * Show the current Category
 */
exports.plant_read = function(req, res) {

    plant.findOne({
            _id: req.swagger.params.plant_id.value
        })
        .then(plant => res.json({code:200, message: "OK", data: plant}))
        .catch(err => res.status(404).send({code:404, message: "ERROR", response: err}));
};

/**
 * Update a Category
 */
exports.plant_update = function(req, res) {  
    plant.update( {
            _id: req.swagger.params.plant_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err})); 
};
/**
 * Delete an Category
 */
exports.plant_delete = function(req, res) { 
    plant.remove({
            _id: req.swagger.params.plant_id.value
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.list_all = function(req, res) { 
    plant.find({})
        .then(plants => res.json({code:200, message: "OK", data: plants}))
        .catch(err => res.send({code:404, message: "ERROR", response: err}));
};

exports.plant_listPagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var plantList = plant.find({})
        .skip(value).limit(parseInt(req.swagger.params.limit.value))
        .sort({_id: 1});
    var count = plant.find({}).count();

    Promise.all([count,plantList])
        .then(result => res.json({code:200, message: "OK", "count": result[0], "plants": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
 * List of Categories
 */
// exports.listallByFactory = function(req, res) { 
//     plant.find({})
//         .populate({
//           path: 'factory',
//           match: { name:  req.params.factory_name}}
//         )
//         .then(plant => res.json(plant.filter(o => o.factory !=  null)))
//         .catch(err => res.send(err));
// };
