'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const query                      = require('../helpers/queries/complex_queries_packing');
const mongoose                   = require('mongoose');
const ObjectId                   = require('mongoose').Types.ObjectId;
const packing                    = mongoose.model('Packing');
const _                          = require("lodash");
mongoose.Promise                 = global.Promise;
/**
 * Create the current Packing
 */
exports.packing_create = function(req, res) {
  packing.create(req.body)
    .catch(_.partial(errorHandler, res, 'Error to create packing'))
    .then(_.partial(successHandler, res))
};
/**
 * Show the current Packing
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
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to retrieve packings'));
};
/**
 * Show the current Packing by departmnet
 */
exports.list_packing_department = function(req, res) {

  packing.find({
      department: new ObjectId(req.swagger.params.department.value)
    })
    .populate('tag')
    .populate('actual_plant')
    .populate('department')
    .populate('supplier')
    .populate('project')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by department'));
};
/*
 * Update a Packing
 */
exports.packing_update = function(req, res) {

  packing.update({
        _id: req.swagger.params.packing_id.value
    }, req.body, {
      upsert: true,
      multi: true
    })
    .then(_.partial(successHandler, res))
    .then(result => successHandler(res, result))
    .catch(_.partial(errorHandler, res, 'Error to update packings by department'));
};
/*
 * Update a Packing by code
 */
exports.packing_update_by_code = function(req, res) {

  packing.update({
        code: req.swagger.params.packing_code.value
    }, req.body, {
      upsert: true,
      multi: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update packings by code'));
};
/*
 * Update a Packing unset gc16
 */
exports.packing_update_unset_by_code = function(req, res) {

  packing.update({
        code: req.swagger.params.packing_code.value
    }, {$unset: {gc16:1}}, {
      upsert: true,
      multi: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update packings unset yout gc16'));
};

/*
 * Update all Packings by route
 */
exports.packing_update_all_by_route = function(req, res) {

  packing.update({
      code: req.swagger.params.code.value ,
      supplier: req.swagger.params.supplier.value
    }, req.body, {
      multi: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update all packings by route'));
};
/**
 * Delete an Packing
 */
exports.packing_delete = function(req, res) {
  packing.remove({ 
      _id: req.swagger.params.packing_id.value 
    })
    .catch(_.partial(errorHandler, res, 'Error to delete packing'))
    .then(_.partial(successHandler, res));
};
/**
 * List of packings by pagination
 */
exports.packing_list_pagination = function(req, res) {
  packing.paginate({},
    { page: parseInt(req.swagger.params.page.value) ,
      populate: ['supplier','project','tag', 'actual_plant', 'department','gc16'],
      sort: { serial: 1 },
      limit: parseInt(req.swagger.params.limit.value)})
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by pagination by serial and code
 */
exports.packing_list_pagination_by_code_serial = function(req, res) {
  packing.paginate({"$or": [{
        "code": req.swagger.params.attr.value
    }, {
        "serial": req.swagger.params.attr.value
    }]},
    { page: parseInt(req.swagger.params.page.value) ,
      populate: ['supplier','project','tag', 'actual_plant', 'department','gc16'],
      sort: { serial: 1 },
      limit: parseInt(req.swagger.params.limit.value)})
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of all packings
 */
exports.packing_list_all = function(req, res) {
  Packing.find({})
    .populate('tag')
    .populate('actual_plant')
    .populate('department')
    .populate('supplier')
    .populate('project')
    .populate('gc16')
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by supplier
 */
exports.packing_list_by_supplier = function(req, res) {
  packing.aggregate(query.queries.listPackingBySupplier(req.swagger.params.id.value))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings no binded
 */
exports.list_packing_no_binded = function(req, res) {
  packing.aggregate(query.queries.listPackingsNoBinded)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings no binded'));
};

/**
 * list of packings no binded by code
 **/
exports.packing_list_packing_no_binded_with_code = function(req, res) {
  packing.aggregate(query.queries.listPackingNoBindedWithCode(req.swagger.params.packing_code.value ))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};

//DAQUI PRA BAIXO, ARRANJAR UMA MANEIRA DE ATUALIZAR ESSA COISA
//list by code used to inventory
exports.list_by_code = function(req, res) {

  var arrayOfPromises = [packing.aggregate(query.queries.packingList(req.swagger.params.packing_code.value)),
    packing.aggregate(query.queries.quantityFound(req.swagger.params.packing_code.value)),
    packing.aggregate(query.queries.existingQuantity(req.swagger.params.packing_code.value)),
    packing.aggregate(query.queries.listPackingMissing(req.swagger.params.packing_code.value)),
    packing.aggregate(query.queries.listPackingProblem(req.swagger.params.packing_code.value))
  ];

  Promise.all(arrayOfPromises)
    .then(result => res.json({
      code: 200,
      message: "OK",
      "packing_list": result[0],
      "quantity_found": result[1],
      "existing_quantity": result[2],
      "list_packing_missing": result[3],
      "list_packing_problem": result[4]
    }))
    .catch(err => res.status(404).json({
      code: 404,
      message: "ERROR",
      response: err
    }));

};

//list all inventory  --- ISO AQUI TEM QUE MUDAR
exports.list_all_inventory = function(req, res) {
  var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;

  var arrayOfPromises = [packing.aggregate(query.queries.packingListNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
    packing.aggregate(query.queries.quantityFoundNoCode),
    packing.aggregate(query.queries.existingQuantityNoCode),
    packing.aggregate(query.queries.listPackingMissingNoCodeNoRoute).skip(value).limit(parseInt(req.swagger.params.limit.value)),
    packing.aggregate(query.queries.listPackingMissingNoCodeRoute).skip(value).limit(parseInt(req.swagger.params.limit.value)),
    packing.aggregate(query.queries.listPackingProblemNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
    packing.find(query.queries.countAll).count()
  ];

  Promise.all(arrayOfPromises)
    .then(result => res.json({
      code: 200,
      message: "OK",
      "packing_list": result[0],
      "quantity_found": result[1],
      "existing_quantity": result[2],
      "list_packing_missing_no_route": result[3],
      "list_packing_missing_route": result[4],
      "list_packing_problem": result[5],
      "count": result[6]
    }))
    .catch(err => res.status(404).json({
      code: 404,
      message: "ERROR",
      response: err
    }));

};
