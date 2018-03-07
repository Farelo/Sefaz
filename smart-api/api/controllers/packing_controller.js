'use strict';
/**
 * Module dependencies.
 */
const responses                                 = require('../helpers/responses/index')
const schemas                                   = require("../../config/database/require_schemas")
const query                                     = require('../helpers/queries/complex_queries_packing');
const _                                         = require("lodash");
const token                                     = require('../helpers/request/token');
const ObjectId                                  = schemas.ObjectId
/**
 * Create the current Packing
 */
exports.packing_create = function (req, res) {
  schemas.packing().create(req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to create packing'))
};
/**
 * Create the current Packing
 */
exports.packing_create_array = function (req, res) {
  schemas.packing().create(req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to create array packing'))
};
/**
 * Show the current Packing
 */
exports.packing_read_by_codeAndSerial = function (req, res) {
  schemas.packing().find({
    code: req.swagger.params.code.value,
    serial: req.swagger.params.serial.value,
  })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to retrieve packings'));
};
/**
 * evaluate if exist the any packing with this code and serial on the system
 */
exports.packing_read = function (req, res) {
  schemas.packing().findOne({
    _id: req.swagger.params.packing_id.value
  })
    .populate("project")
    .populate("supplier")
    .populate("tag")
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to retrieve packings'));
};
/**
 * Show the positions by LOKA-API about the Packing
 */
exports.packing_position = function (req, res) {
  token()
    .then(token => loka_api.positions(token, req.swagger.params.code.value))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to retrive position by loka-api about the packing'))
};

/**
 * Show the current Packing
 */
exports.packing_read_by_supplierAndcodeAndProject = function (req, res) {
  schemas.packing().findOne({
    supplier: req.swagger.params.supplier.value,
    code: req.swagger.params.code.value,
    project: req.swagger.params.project.value
  })
    .populate('project')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to retrieve packings'));
};
/**
 * Show the current Packing by departmnet
 */
exports.list_packing_department = function (req, res) {

  schemas.packing().paginate({ "department": new ObjectId(req.swagger.params.department.value), "missing": false, "traveling": false }, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
    sort: {
      serial: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by department'));
};
/*
 * Update a Packing
 */
exports.packing_update = function (req, res) {
  schemas.packing().findOne({
    "code": req.body.code,
    "supplier": new ObjectId(req.body.supplier._id),
    "project": new ObjectId(req.body.project._id)
  }
  )
    .then(result => {

      if (result === null) {
        let partial = Object.assign({}, req.body);
        partial.routes = [];
        delete partial.gc16;
        delete partial.actual_gc16;
        return schemas.packing().update({
          _id: req.swagger.params.packing_id.value
        }, { $unset: { actual_gc16: 1, gc16: 1 }, $set: partial });
      } else if (result.gc16 && result.routes) {
        let partial = Object.assign({}, req.body);
        partial.gc16 = result.gc16;
        partial.routes = result.routes;
        return schemas.packing().update({
          _id: req.swagger.params.packing_id.value
        }, partial);
      } else if (result.gc16) {
        let partial = Object.assign({}, req.body);
        partial.gc16 = result.gc16;
        partial.routes = [];
        return schemas.packing().update({
          _id: req.swagger.params.packing_id.value
        }, { $set: partial });
      } else if (result.routes) {
        let partial = Object.assign({}, req.body);
        partial.routes = result.routes;
        delete partial.gc16;
        delete partial.actual_gc16;
        return schemas.packing().update({
          _id: req.swagger.params.packing_id.value
        }, { $unset: { actual_gc16: 1, gc16: 1 }, $set: partial });
      }

    })
    .then(() => {

      return evaluete(Promise.all([schemas.packing().find({ gc16: new ObjectId(req.body.gc16) }), packing.find({ routes: { $in: req.body.routes } })]), req.body);
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update packings'));
};

function evaluete(promise, p) {

  return promise.then(result => {

    if (result[0].length === 0 && result[1].length === 0) {
      return schemas.GC16().remove({
        _id: p.gc16
      })
        .then(() => schemas.route().remove({
          _id: {
            $in: p.routes
          }
        }));
    } else if (result[0].length === 0) {
      return schemas.GC16().remove({
        _id: p.gc16
      });
    } else if (result[1].length === 0) {
      return schemas.route().remove({
        _id: {
          $in: p.routes
        }
      });
    } else {
      return schemas.packing().findOne({ _id: p._id });
    }
  });
}
/*
 * Update a Packing by code
 */
exports.packing_update_by_code = function (req, res) {
  schemas.packing().update({
    code: req.swagger.params.code.value,
    supplier: new ObjectId(req.swagger.params.supplier.value),
    project: new ObjectId(req.swagger.params.project.value)
  }, req.body, {
      upsert: true,
      multi: true
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update packings by code'));
};
/*
 * Update a Packing unset gc16
 */
exports.packing_update_unset_by_code = function (req, res) {

  schemas.packing().update({
    code: req.swagger.params.packing_code.value
  }, {
      $unset: {
        gc16: 1
      }
    }, {
      upsert: true,
      multi: true
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update packings unset yout gc16'));
};

/*
 * Update all Packings by route
 */
exports.packing_update_all_by_route = function (req, res) {

  schemas.packing().update({
    code: req.swagger.params.code.value ,
    supplier: req.swagger.params.supplier.value
  }, req.body, {
      multi: true
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update all packings by route'));
};
/**
 * Delete an Packing
 */
exports.packing_delete = function (req, res) {
  schemas.packing().findOne({ _id: req.swagger.params.packing_id.value }).exec()
    .then(doc => doc.remove())
    .catch(_.partial(responses.errorHandler, res, 'Error to delete packing'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * List of packings by pagination
 */
exports.packing_list_pagination = function (req, res) {
  schemas.packing().paginate(req.swagger.params.attr.value ? { "$or": [{ "code": req.swagger.params.attr.value }, { "serial": req.swagger.params.attr.value }] } : {}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
    sort: {
      serial: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by pagination by plant
 */
exports.packing_list_pagination_by_plant = function (req, res) {
  schemas.packing().paginate({ 'actual_plant.plant': new ObjectId(req.swagger.params.id.value) }, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
    sort: {
      serial: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of all packings
 */
exports.packing_list_all = function (req, res) {
  schemas.packing().find({})
    .populate('tag')
    .populate('actual_plant.plant')
    .populate('department')
    .populate('supplier')
    .populate('project')
    .populate('gc16')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings by supplier
 */
exports.packing_list_by_supplier = function (req, res) {

  schemas.packing().aggregate(query.queries.listPackingBySupplier(new ObjectId(req.swagger.params.id.value)))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by Supplier'));
};
/**
 * List of packings no binded
 */
exports.list_packing_no_binded = function (req, res) {
  schemas.packing().aggregate(query.queries.listPackingsNoBinded(new ObjectId(req.swagger.params.supplier.value)))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings no binded'));
};

/**
 * list of packings no binded by code
 **/
exports.packing_list_packing_no_binded_with_code = function (req, res) {
  schemas.packing().aggregate(query.queries.listPackingNoBindedWithCode(req.swagger.params.packing_code.value ))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list packings by Supplier'));
};

/**
 * list of general pagickings inventory
 **/
exports.general_inventory_packing = function (req, res) {
  let aggregate = schemas.packing().aggregate(query.queries.inventory_general(req.swagger.params.attr.value));

  schemas.packing().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * list of general pagickings inventory by location
 **/
exports.geraneral_inventory_packing_by_plant = function (req, res) {
  let aggregate = schemas.packing().aggregate(query.queries.inventory_general_by_plant(req.swagger.params.code.value, new ObjectId(req.swagger.params.supplier.value), new ObjectId(req.swagger.params.project.value)));

  schemas.packing().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * list of supplier inventory
 **/
exports.supplier_inventory = function (req, res) {
  let aggregate = schemas.packing().aggregate(query.queries.supplier_inventory(new ObjectId(req.swagger.params.supplier.value)));

  schemas.packing().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregate, res, req.user.refresh_token, req.swagger.params.page.value, req.swagger.params.limit.value));
};
/**
 * list of quantity inventory
 **/
exports.quantity_inventory = function (req, res) {

  let aggregate = schemas.packing().aggregate(query.queries.quantity_inventory(req.swagger.params.code.value, req.swagger.params.attr.value));

  schemas.packing().aggregatePaginate(aggregate,
    { page: parseInt(req.swagger.params.page.value), limit: parseInt(req.swagger.params.limit.value) },
    _.partial(responses.successHandlerPaginationAggregateQuantity, res, req.user.refresh_token, req.swagger.params.code.value));
};
/**
 * List of packings analysis battery
 */
exports.inventory_battery = function (req, res) {
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing().paginate(
    attr && code ? { "supplier": new ObjectId(attr), "code": code } :
      (attr ? { "supplier": new ObjectId(attr) } :
        (code ? { "code": code } : {}))
    , {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
      sort: {
        battery: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory battery by code'));
};
/**
 * List of packings analysis by permanence time
 */
exports.inventory_permanence = function (req, res) {
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing().paginate(attr && code ? { "supplier": new ObjectId(attr), "code": code } :
    (attr ? { "supplier": new ObjectId(attr) } :
      (code ? { "code": code } : {})),
    {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
      sort: {
        'permanence.amount_days': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * Historic of packings by serial
 */
exports.inventory_packing_historic = function (req, res) {
  let serial = req.swagger.params.serial.value;
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  console.log(serial);
  console.log(code);

  schemas.historicPackings().paginate(
    attr ? { "supplier": new ObjectId(attr), "serial": serial, "packing_code": code } : { "serial": serial, "packing_code": code },
    {
      page: parseInt(req.swagger.params.page.value),
      populate: query.queries.populate,
      sort: {
        'date': -1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
/**
 * All packings inventory
 */
exports.inventory_packings = function (req, res) {
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing().paginate(attr && code ? { "supplier": new ObjectId(attr), "code": code } :
    (attr ? { "supplier": new ObjectId(attr) } :
      (code ? { "code": code } : {})), {
      page: parseInt(req.swagger.params.page.value),
      populate: ['supplier', 'project', 'tag', 'actual_plant.plant', 'department', 'gc16'],
      sort: {
        '_id': 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
};
