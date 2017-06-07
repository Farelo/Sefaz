'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var packing = mongoose.model('Packing');
// var route = mongoose.model('Route');

var query = require('../helpers/queries/complex_queries_packing');

exports.packing_create = function(req, res) {
    packing.create(req.body)
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}))
};
/**
 * Show the current Category
 */
exports.packing_read = function(req, res) {
    packing.findOne({
            _id: req.swagger.params.packing_id.value 
        })
        .populate('tag')
        .populate('actual_plant')
        .populate('department')
        .populate('supplier')
        .populate('project')
        .then(packing => res.json({code:200, message: "OK", data: packing}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/*
 * Update a Category
 */
exports.packing_update = function(req, res) {
    packing.update({
            _id: req.swagger.params.packing_id.value 
        }, req.body, {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/*
 * Update a Category
 */
exports.packing_update_all_by_route = function(req, res) {
    console.log(req.body);
    packing.update({
            code: req.swagger.params.code.value ,
            supplier: req.swagger.params.supplier.value
        }, req.body, {
            multi: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Delete an Category
 */
exports.packing_delete = function(req, res) {
    packing.remove({ 
            _id: req.swagger.params.packing_id.value 
        })
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}))
        .then(success => res.json({code:200, message: "OK", response: success}));

};
/**
 * List of Categories
 */
exports.packing_list_pagination = function(req, res) {
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var packinglist = packing.find({})
        .skip(value)
        .limit(parseInt(req.swagger.params.limit.value))
        .populate('tag')
        .populate('actual_plant')
        .populate('department')
        .populate('supplier')
        .populate('project');

    var count = packing.find({}).count();
        Promise.all([count, packinglist])
        .then(result =>  res.json({code:200, message: "OK", "count": result[0], "packings": result[1]}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * List of Categories
 */
exports.packing_list_all = function(req, res) {
    Packing.find({})
        .populate('tag')
        .populate('actual_plant')
        .populate('department')
        .populate('supplier')
        .populate('project')
        .then(result => res.json(result))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * List of Categories
 */
exports.list_packing_no_binded = function(req, res) {
    packing.aggregate(query.queries.listPackingsNoBinded)
        .then(packings =>res.json({code:200, message: "OK", data: packings}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/**
* list
**/
exports.packing_list_packing_no_binded_with_code = function(req, res) {
    packing.aggregate(query.queries.listPackingNoBindedWithCode(req.swagger.params.packing_code.value ))
        .then(results => res.json(results))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
//list by code
exports.list_by_code = function(req, res) {
      console.log(req.swagger.params.packing_code.value);
      var arrayOfPromises = [ packing.aggregate(query.queries.packingList(req.swagger.params.packing_code.value)),
      packing.aggregate(query.queries.quantityFound(req.swagger.params.packing_code.value)),
      packing.aggregate(query.queries.existingQuantity(req.swagger.params.packing_code.value)),
      packing.aggregate(query.queries.listPackingMissing(req.swagger.params.packing_code.value)),
      packing.aggregate(query.queries.listPackingProblem(req.swagger.params.packing_code.value))];

      Promise.all(arrayOfPromises)
      .then(result => res.json({code:200, message: "OK","packing_list":result[0],
                                "quantity_found": result[1],
                                "existing_quantity": result[2],
                                "list_packing_missing": result[3],
                                "list_packing_problem": result[4]}))
      .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));

};

//list by code
exports.list_all_inventory = function(req, res) {
      var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;

      var arrayOfPromises = [ packing.aggregate(query.queries.packingListNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
      packing.aggregate(query.queries.quantityFoundNoCode),
      packing.aggregate(query.queries.existingQuantityNoCode),
      packing.aggregate(query.queries.listPackingMissingNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
      packing.aggregate(query.queries.listPackingProblemNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
      packing.find(query.queries.countAll).count()];

      Promise.all(arrayOfPromises)
      .then(result => res.json({code:200, message: "OK","packing_list":result[0],
                                "quantity_found": result[1],
                                "existing_quantity": result[2],
                                "list_packing_missing": result[3],
                                "list_packing_problem": result[4],
                                "count": result[5]}))
      .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));

};
