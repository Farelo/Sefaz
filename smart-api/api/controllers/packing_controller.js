'use strict';
/**
 * Module dependencies.
 */
const successHandler                            = require('../helpers/responses/successHandler');
const successHandlerPagination                  = require('../helpers/responses/successHandlerPagination');
const successHandlerPaginationAggregate         = require('../helpers/responses/successHandlerPaginationAggregate');
const successHandlerPaginationAggregateQuantity = require('../helpers/responses/successHandlerPaginationAggregateQuantity');
const errorHandler                              = require('../helpers/responses/errorHandler');
const query                                     = require('../helpers/queries/complex_queries_packing');
const mongoose                                  = require('mongoose');
const ObjectId                                  = require('mongoose').Types.ObjectId;
const packing                                   = mongoose.model('Packing');
const plant                                     = mongoose.model('Plant');
const historic                                  = mongoose.model('HistoricPackings');
const alert                                     = mongoose.model('Alerts');
const gc16                                      = mongoose.model('GC16');
const route                                     = mongoose.model('Route');
const _                                         = require("lodash");
mongoose.Promise                                = global.Promise;
/**
 * Create the current Packing
 */
exports.packing_create = function(req, res) {
  packing.create(req.body)
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to create packing'))
};
/**
 * Show the current Packing
 */
exports.packing_read = function(req, res) {
packing.findOne({
      _id: req.swagger.params.packing_id.value 
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to retrieve packings'));
};

/**
 * Show the current Packing
 */
exports.packing_read_by_supplierAndcode = function(req, res) {
packing.findOne({
      supplier: req.swagger.params.supplier.value,
      code: req.swagger.params.code.value,
    })
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
    }, {
      $unset: {
        gc16: 1
      }
    }, {
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
  alert.remove({packing: req.swagger.params.packing_id.value})
        .then( () => historic.remove({packing: req.swagger.params.packing_id.value}))
        .then( () => packing.findOne({  _id: req.swagger.params.packing_id.value}))
        .then( p => removePacking(p,req.swagger.params.packing_id.value))
        .then( p => evaluete(Promise.all([packing.find({gc16: p.gc16}), packing.find({route: p.route })]), p))
        .catch(_.partial(errorHandler, res, 'Error to delete packing'))
        .then(_.partial(successHandler, res));
};

function removePacking(p, id){
  return new Promise(function(resolve, reject) {
      packing.remove({ _id: id }).then(() => resolve(p));
  });
}

function evaluete(promise,p){

  return new Promise(function(resolve, reject) {
    promise.then(result => {
      if(result[0].length === 0 && result[1].length === 0){
        gc16.remove({_id: p.gc16})
            .then(() => route.remove({_id: p.route }))
            .then(() => resolve(p));
      }else if(result[0].length === 0){
        gc16.remove({_id: p.gc16}).then(() => resolve(p));
      }else if(result[1].length === 0){
        route.remove({_id: p.route}).then(() => resolve(p));
      }else{
        resolve(p);
      }
    });
  });
}
/**
 * List of packings by pagination
 */
exports.packing_list_pagination = function(req, res) {
  packing.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        serial: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by pagination by plant
 */
exports.packing_list_pagination_by_plant = function(req, res) {
  packing.paginate({actual_plant: new ObjectId(req.swagger.params.id.value)}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        serial: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by pagination by serial and code
 */
exports.packing_list_pagination_by_code_serial = function(req, res) {
  packing.paginate({
      "$or": [{
        "code": req.swagger.params.attr.value
      }, {
        "serial": req.swagger.params.attr.value
      }]
    }, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        serial: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
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

  packing.aggregate(query.queries.listPackingBySupplier(new ObjectId(req.swagger.params.id.value)))
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings no binded
 */
exports.list_packing_no_binded = function(req, res) {
  packing.aggregate(query.queries.listPackingsNoBinded(new ObjectId(req.swagger.params.supplier.value)))
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
/**
 * list of general pagickings inventory
 **/
exports.geraneral_inventory_packing = function(req, res) {
  let aggregate = packing.aggregate(query.queries.inventory_general);

  packing.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res));
};
/**
 * list of general pagickings inventory by location
 **/
exports.geraneral_inventory_packing_by_plant = function(req, res) {
  let aggregate = packing.aggregate(query.queries.inventory_general_by_plant(req.swagger.params.code.value,new ObjectId(req.swagger.params.supplier.value)));

  packing.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res));
};
/**
 * list of supplier inventory
 **/
exports.supplier_inventory = function(req, res) {
  let aggregate = packing.aggregate(query.queries.supplier_inventory(new ObjectId(req.swagger.params.supplier.value)));

  packing.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregate, res));
};
/**
 * list of quantity inventory
 **/
exports.quantity_inventory = function(req, res) {

  let aggregate = packing.aggregate(query.queries.quantity_inventory(req.swagger.params.code.value));

  packing.aggregatePaginate(aggregate,
    { page : parseInt(req.swagger.params.page.value), limit : parseInt(req.swagger.params.limit.value)},
    _.partial(successHandlerPaginationAggregateQuantity, res, req.swagger.params.code.value));
};

/**
 * List of packings analysis battery
 */
exports.inventory_battery = function(req, res) {
  packing.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        battery: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list inventory battery'));
};

/**
 * List of packings analysis battery
 */
exports.inventory_battery_by_code = function(req, res) {
  packing.paginate({
    "code": req.swagger.params.code.value
  }, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        battery: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list inventory battery by code'));
};
/**
 * List of packings analysis by permanence time
 */
exports.inventory_permanence = function(req, res) {
  packing.paginate({ "code": req.swagger.params.code.value}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant', 'department', 'gc16'],
      sort: {
        'permanence.amount_days': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * Historic of packings by serial
 */
exports.inventory_packing_historic = function(req, res) {
  historic.paginate({
      "serial": req.swagger.params.serial.value
    }, {
      page: parseInt(req.swagger.params.page.value),
      populate: query.queries.populate,
      sort: {
        'date': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list inventory permanence'));
};





exports.createEstrategy = function(req, res) {
  packing.find({}).then( packings => {
    plant.find({}).then( plant => {
      packings.forEach(o => {
        let temp = template();
        temp.packing = o._id;
        temp.serial = o.serial;
        for(var i = 1 ; i <  Math.floor(Math.random() * 10); i++){
            temp.plant =  plant[Math.floor(Math.random() * plant.length)]._id;
            temp.date =  randomDate(new Date(2012, 0, 1), new Date());
            temp.temperature =  Math.floor(Math.random() * 100);
            temp.permanence_time =  Math.floor(Math.random() * 20);
            historic.create(temp).then(result => console.log("OK"))
        }
        o.temperature =  Math.floor(Math.random() * 100);
        o.actual_plant = plant[Math.floor(Math.random() * plant.length)]._id;
        packing.update({
            _id: o._id
          },o, {
            upsert: true,
            multi: true
          }).then(result => console.log("OK"));
      });
    });
  });
};

exports.createAlerts = function(req, res) {
  var alerts1 = [1,2,4];
  var alerts2 = [3,5];
  packing.find({}).then( packings => {
    plant.find({}).then( plant => {
      packings.forEach(o => {
        let temp = template();
        temp.actual_plant = plant[Math.floor(Math.random() * plant.length)]._id;;
        temp.correct_plant_factory = plant[Math.floor(Math.random() * plant.length)]._id;
        temp.correct_plant_supplier = plant[Math.floor(Math.random() * plant.length)]._id;
        temp.packing = o._id;
        temp.serial = o.serial;
        temp.supplier = o.supplier;
        temp.status = alerts1[Math.floor(Math.random() * alerts1.length)];
        temp.hashpacking = o.supplier + o.code;
        temp.date = randomDate(new Date(2012, 0, 1), new Date());
        alert.create(temp).then(result => console.log("OK"));
        temp = template();
        temp.actual_plant = plant[Math.floor(Math.random() * plant.length)]._id;;
        temp.correct_plant_factory = plant[Math.floor(Math.random() * plant.length)]._id;
        temp.correct_plant_supplier = plant[Math.floor(Math.random() * plant.length)]._id;
        temp.packing = o._id;
        temp.serial = o.serial;
        temp.supplier = o.supplier;
        temp.status = alerts2[Math.floor(Math.random() * alerts2.length)];
        temp.hashpacking = o.supplier + o.code;
        temp.date = randomDate(new Date(2012, 0, 1), new Date());
        alert.create(temp).then(result => console.log("OK"));

      });
    });
  });
};

function template(){
//   return {
//     plant: String,
//     date: Number,
//     temperature: Number,
//     permanence_time: Number,
//     serial: String,
//     packing: String
// };

  return {
    actual_plant: String,
    correct_plant_factory: String,
    correct_plant_supplier: String,
    packing: String,
    supplier: String,
    status: Number,
    serial: String,
    date: Number,
    hashpacking : String
  }
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
}






// //DAQUI PRA BAIXO, ARRANJAR UMA MANEIRA DE ATUALIZAR ESSA COISA
// //list by code used to inventory
// exports.list_by_code = function(req, res) {
//
//   var arrayOfPromises = [packing.aggregate(query.queries.packingList(req.swagger.params.packing_code.value)),
//     packing.aggregate(query.queries.quantityFound(req.swagger.params.packing_code.value)),
//     packing.aggregate(query.queries.existingQuantity(req.swagger.params.packing_code.value)),
//     packing.aggregate(query.queries.listPackingMissing(req.swagger.params.packing_code.value)),
//     packing.aggregate(query.queries.listPackingProblem(req.swagger.params.packing_code.value))
//   ];
//
//   Promise.all(arrayOfPromises)
//     .then(result => res.json({
//       code: 200,
//       message: "OK",
//       "packing_list": result[0],
//       "quantity_found": result[1],
//       "existing_quantity": result[2],
//       "list_packing_missing": result[3],
//       "list_packing_problem": result[4]
//     }))
//     .catch(err => res.status(404).json({
//       code: 404,
//       message: "ERROR",
//       response: err
//     }));
//
// };
//
// //list all inventory  --- ISO AQUI TEM QUE MUDAR
// exports.list_all_inventory = function(req, res) {
//   var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
//
//   var arrayOfPromises = [packing.aggregate(query.queries.packingListNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
//     packing.aggregate(query.queries.quantityFoundNoCode),
//     packing.aggregate(query.queries.existingQuantityNoCode),
//     packing.aggregate(query.queries.listPackingMissingNoCodeNoRoute).skip(value).limit(parseInt(req.swagger.params.limit.value)),
//     packing.aggregate(query.queries.listPackingMissingNoCodeRoute).skip(value).limit(parseInt(req.swagger.params.limit.value)),
//     packing.aggregate(query.queries.listPackingProblemNoCode).skip(value).limit(parseInt(req.swagger.params.limit.value)),
//     packing.find(query.queries.countAll).count()
//   ];
//
//   Promise.all(arrayOfPromises)
//     .then(result => res.json({
//       code: 200,
//       message: "OK",
//       "packing_list": result[0],
//       "quantity_found": result[1],
//       "existing_quantity": result[2],
//       "list_packing_missing_no_route": result[3],
//       "list_packing_missing_route": result[4],
//       "list_packing_problem": result[5],
//       "count": result[6]
//     }))
//     .catch(err => res.status(404).json({
//       code: 404,
//       message: "ERROR",
//       response: err
//     }));
//
// };
