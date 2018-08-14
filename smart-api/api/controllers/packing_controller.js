'use strict';
/**
 * Module dependencies.
 */
const responses = require('../helpers/responses/index');
const schemas = require('../schemas/require_schemas');
const query = require('../helpers/queries/complex_queries_packing');
const query_inventory = require('../helpers/queries/complex_queries_inventory');
const query_plant = require('../helpers/queries/complex_queries_plants');
const loka_api = require('../helpers/request/loka-api');
const _ = require('lodash');
const token = require('../helpers/request/token');
const evaluate = require('../helpers/utils/evaluate_packing');
const ObjectId = schemas.ObjectId;

function object() {
  return {
    _id: {
      code: '',
      plant: '',
      supplier: '',
      project: '',
    },
    code: '',
    supplier: {
      _id: '',
      name: '',
      duns: '',
      plant: '',
      cnpj: '',
      profile: '',
      __v: 0,
    },
    actual_plant: {
      local: '',
    },
    project: {
      _id: '',
      name: '',
      __v: 0,
    },
    quantityTotal: 0,
    quantityTraveling: 0,
    quantityIncorrectLocal: 0,
    quantityMissing: 0,
    quantityInFactory: 0,
    quantityInSupplier: 0,
    quantityLate: 0,
    quantityIncontida: 0,
    all_plants: [],
    all_alerts: []
  };
}

const generatePromise = (supplier_id, package_code, options) => {
  return new Promise((resolve, reject) => {
    schemas.packing.aggregatePaginate(
      schemas.packing.aggregate(
        query.queries.detailed_inventory(supplier_id, package_code),
      ),
      options,
      (err, results, pageCount, count) => {
        resolve({ results, pageCount, count });
      },
    );
  });
};

const buildDetailedInvetoryArray = async (
  supplier_id,
  package_code,
  options,
) => {
  let arrayToAgroup = [];
  let aggregate = null;
  try {
    if (!options.limit) {
      aggregate = await schemas.packing.aggregate(
        query.queries.detailed_inventory(supplier_id, package_code),
      );
    } else {
      let aggregatePaginate = await generatePromise(
        supplier_id,
        package_code,
        options,
      );

      aggregate = aggregatePaginate.results;
      aggregate.pageCount = aggregatePaginate.pageCount;
      aggregate.count = aggregatePaginate.count;
    }

    let aggregatePlantList = await Promise.all(
      aggregate.map(item =>
        schemas.packing.aggregate(
          query.queries.detailed_inventory_by_plant(
            item.supplier._id,
            item.code,
          ),
        ),
      ),
    );
    let aggregateAlertList = await Promise.all(
      aggregate.map(item =>
        schemas.alert.aggregate(
          query.queries.detailed_inventory_by_alert(item.supplier._id),
        ),
      ),
    );

    console.log('====================================');
    console.log(aggregateAlertList);
    console.log('====================================');

    arrayToAgroup = aggregate.map((item, index) => {
      let obj = object();
      // console.log('====================================');
      // console.log(item.code);
      // console.log('====================================');

      obj._id.code = item._id.code;
      obj._id.plant = item._id.plant;
      obj._id.supplier = item._id.supplier;
      obj._id.project = item._id.project;

      obj.code = item.code;

      obj.supplier._id = item.supplier._id;
      obj.supplier.name = item.supplier.name;
      obj.supplier.duns = item.supplier.duns;
      obj.supplier.plant = item.supplier.plant;
      obj.supplier.cnpj = item.supplier.cnpj;
      obj.supplier.profile = item.supplier.profile;
      obj.supplier.__v = item.supplier.__v;

      obj.actual_plant = item.actual_plant;

      obj.project._id = item.project._id;
      obj.project.name = item.project.name;
      obj.project.__v = item.project.__v;

      obj.quantityTotal = item.quantityTotal;
      obj.quantityTraveling = item.quantityTraveling;
      obj.quantityIncorrectLocal = item.quantityIncorrectLocal;
      obj.quantityMissing = item.quantityMissing;
      obj.quantityInFactory = item.quantityInFactory;
      obj.quantityInSupplier = item.quantityInSupplier;
      obj.quantityLate = item.quantityLate;

      obj.all_plants = aggregatePlantList[index];

      for (let alert of aggregateAlertList[index]) {
        if (item.code === alert.packageCode) obj.all_alerts.push(alert);
      }

      // obj.all_alerts = aggregateAlertList[index][0]

      return obj;
    });
  } catch (error) {
    console.error(error);
  }

  return arrayToAgroup;
};

/**
 * Create the current Packing
 */
exports.packing_create = function (req, res) {
  schemas.settings
    .find({})
    .then(settings => {
      if (!settings[0].register_gc16.enable) {
        //se o gc16  estiver habilitado realiza o passo de verificação
        req.body[0].gc16 = settings[0].register_gc16.id;
        return schemas.packing.create(req.body);
      } else {
        return schemas.packing.create(req.body);
      }
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to create packing'));
};

/**
 * Create the current Packing
 */
exports.packing_create_array = function (req, res) {
  schemas.packing
    .create(req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to create array packing'),
  );
};

/**
 * Show the current Packing
 */
exports.packing_read_by_codeAndSerial = function (req, res) {
  schemas.packing
    .find({
      code: req.swagger.params.code.value,
      serial: req.swagger.params.serial.value,
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to retrieve packings'),
  );
};

/**
 * evaluate if exist the any packing with this code and serial on the system
 */
exports.packing_read = function (req, res) {
  schemas.packing
    .findOne({
      _id: req.swagger.params.packing_id.value,
    })
    .populate('project')
    .populate('supplier')
    .populate('tag')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to retrieve packings'),
  );
};

/**
 * Show the positions by LOKA-API about the Packing
 */
exports.packing_position = function (req, res) {
  let initial_date = req.swagger.params.initial_date.value;
  let final_date = req.swagger.params.final_date.value;
  token()
    .then(token =>
      loka_api.positions(
        token,
        req.swagger.params.code.value,
        initial_date,
        final_date,
      ),
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to retrive position by loka-api about the packing',
      ),
  );
};

/**
 * Show the current Packing
 */
exports.packing_read_by_supplierAndcodeAndProject = function (req, res) {
  schemas.packing
    .findOne({
      supplier: req.swagger.params.supplier.value,
      code: req.swagger.params.code.value,
      project: req.swagger.params.project.value,
    })
    .populate('project')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to retrieve packings'),
  );
};

/**
 * Show the current Packing by departmnet
 */
exports.list_packing_department = function (req, res) {
  schemas.packing
    .paginate(
      {
        department: new ObjectId(req.swagger.params.department.value),
        missing: false,
        traveling: false,
      },
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          serial: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by department',
      ),
  );
};

/*
 * Update a Packing
 */
exports.packing_update = function (req, res) {
  schemas.packing
    .findOne({
      code: req.body.code,
      supplier: new ObjectId(req.body.supplier._id),
      project: new ObjectId(req.body.project._id),
    })
    .then(result =>
      evaluate.searching(req.body, result, req.swagger.params.packing_id.value),
  )
    .then(() =>
      evaluate.existAncestor(req.body.gc16, req.body.routes, req.body),
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update packings'));
};

/*
 * Update a Packing by code
 */
exports.packing_update_by_code = function (req, res) {
  schemas.packing
    .update(
      {
        code: req.swagger.params.code.value,
        supplier: new ObjectId(req.swagger.params.supplier.value),
        project: new ObjectId(req.swagger.params.project.value),
      },
      req.body,
      {
        multi: true,
      },
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to update packings by code',
      ),
  );
};

/*
 * Update a Packing unset gc16
 */
exports.packing_update_unset_by_code = function (req, res) {
  schemas.packing
    .update(
      {
        code: req.swagger.params.packing_code.value,
      },
      {
        $unset: {
          gc16: 1,
        },
      },
      {
        multi: true,
      },
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to update packings unset yout gc16',
      ),
  );
};

/*
 * Update all Packings by route
 */
exports.packing_update_all_by_route = function (req, res) {
  schemas.packing
    .update(
      {
        code: req.swagger.params.code.value,
        supplier: req.swagger.params.supplier.value,
      },
      req.body,
      {
        multi: true,
      },
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to update all packings by route',
      ),
  );
};

exports.packing_list_by_code = function (req, res) {
  schemas.packing
    .paginate(
      { code: req.swagger.params.code.value },
      {
        page: parseInt(req.swagger.params.page.value),
        limit: parseInt(req.swagger.params.limit.value),
        populate: ['project', 'supplier'],
      },
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to retrieve packings'),
  );
};

/**
 * Delete an Packing
 */
exports.packing_delete = function (req, res) {
  schemas.packing
    .findOne({ _id: req.swagger.params.packing_id.value })
    .exec()
    .then(doc => doc.remove())
    .catch(_.partial(responses.errorHandler, res, 'Error to delete packing'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};

/**
 * List of packings by pagination
 */
exports.packing_list_pagination = function (req, res) {
  schemas.packing
    .paginate(
      req.swagger.params.attr.value
        ? {
          $or: [
            { code: req.swagger.params.attr.value },
            { serial: req.swagger.params.attr.value },
          ],
        }
        : {},
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          serial: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by Supplier',
      ),
  );
};

/**
 * List of packings by pagination by plant
 */
exports.packing_list_pagination_by_plant = function (req, res) {
  schemas.packing
    .paginate(
      { 'actual_plant.plant': new ObjectId(req.swagger.params.id.value) },
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          serial: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by Supplier',
      ),
  );
};

/**
 * List of all packings
 */
exports.packing_list_all = function (req, res) {
  schemas.packing
    .find({})
    .populate('tag')
    .populate('actual_plant.plant')
    .populate('department')
    .populate('supplier')
    .populate('project')
    .populate('gc16')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by Supplier',
      ),
  );
};

/**
 * List of all distinct packings
 */
exports.packing_list_distinct = function (req, res) {
  schemas.packing
    .aggregate(query.queries.listPackingDistinct)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to list distinct packings'),
  );
};

/**
 * List of all distinct packings by suppliers
 */
exports.packing_list_distinct_by_supplier = function (req, res) {
  let supplier = req.swagger.params.supplier.value;
  schemas.packing
    .aggregate(query.queries.listPackingDistinctBySupplier(supplier))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list distinct packings by supplier',
      ),
  );
};

/**
 * List of all distinct packings by logistic
 */
exports.packing_list_distinct_by_logistic = function (req, res) {
  let map = req.body.map(o => new ObjectId(o));

  schemas.packing
    .aggregate(query.queries.listPackingDistinctByLogistic(map))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list distinct packings by supplier',
      ),
  );
};

/**
 * List of all equals packings
 */
exports.packing_list_equals = function (req, res) {
  let project = req.swagger.params.project.value;
  let supplier = req.swagger.params.supplier.value;
  let code = req.swagger.params.code.value;

  schemas.packing
    .find({
      project: project,
      supplier: supplier,
      code: code,
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(responses.errorHandler, res, 'Error to list distinct packings'),
  );
};

/**
 * List of packings by supplier
 */
exports.packing_list_by_supplier = function (req, res) {
  schemas.packing
    .aggregate(
      query.queries.listPackingBySupplier(
        new ObjectId(req.swagger.params.id.value),
      ),
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by Supplier',
      ),
  );
};

/**
 * List of packings no binded
 */
exports.list_packing_no_binded = function (req, res) {
  schemas.packing
    .aggregate(
      query.queries.listPackingsNoBinded(
        new ObjectId(req.swagger.params.supplier.value),
      ),
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings no binded',
      ),
  );
};

/**
 * list of packings no binded by code
 **/
exports.packing_list_packing_no_binded_with_code = function (req, res) {
  schemas.packing
    .aggregate(
      query.queries.listPackingNoBindedWithCode(
        req.swagger.params.packing_code.value,
      ),
  )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list packings by Supplier',
      ),
  );
};

/**
 * TODO a quantidade de embalagens por planta
 */
exports.packing_per_plant = function (req, res) {
  let aggregate = schemas.packing.aggregate(
    query_plant.queries.packings_per_plant,
  );

  schemas.plant.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
    },
    _.partial(
      responses.successHandlerPaginationAggregate,
      res,
      req.user.refresh_token,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * TODO a quantiade de embalagens por condição
 */
exports.packing_quantity_per_condition = function (req, res) {

    Promise.all([
      schemas.packing.find({}).count(),
      schemas.packing.find({ missing: true }).count(),
      schemas.packing.find({ problem: true }).count(),
      schemas.packing.find({ traveling: true }).count(),
      schemas.packing.find({ 'permanence.time_exceeded': true }).count(),
      schemas.packing.find({ 'trip.time_exceeded': true }).count()
    ])

    .then(data => {
      responses.successHandler(
        res,
        req.user.refresh_token,
        evaluate.createObject(data),
      );
    })
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to calculate packings quantity',
      ),
  );
};

/*
 * list of general pagickings by supplier or by packing
 * created by Sérgio Santos, 15/02/2018
 **/
exports.detailed_inventory = (req, res) => {
  let supplier_id = req.swagger.params.supplier_id.value;
  let package_code = req.swagger.params.package_code.value;
  let options = {
    limit: parseInt(req.swagger.params.limit.value),
    page: parseInt(req.swagger.params.page.value),
  };

  buildDetailedInvetoryArray(supplier_id, package_code, options)
    .then(data =>
      responses.successHandlerPaginationAggregate(
        res,
        req.user.refresh_token,
        options.page,
        options.limit,
        _,
        data,
      ),
  )
    .catch(error =>
      responses.errorHandler(
        res,
        'Não foi possível construir o array para o invetário geral',
        error,
      ),
  );
};

exports.detailed_inventory_csv = (req, res) => {
  let supplier_id = req.swagger.params.supplier_id.value;
  let package_code = req.swagger.params.package_code.value;
  let options = {
    limit: null,
    page: null,
  };

  buildDetailedInvetoryArray(supplier_id, package_code, options)
    .then(data => responses.successHandler(res, req.user.refresh_token, data))
    .catch(error =>
      responses.errorHandler(
        res,
        'Não foi possível completar a requisição',
        error,
      ),
  );
};

/**
 * list of general pagickings inventory
 **/
exports.general_inventory_packing = function (req, res) {
  let aggregate = schemas.packing.aggregate(
    query.queries.inventory_general(req.swagger.params.attr.value),
  );

  schemas.packing.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
    },
    _.partial(
      responses.successHandlerPaginationAggregate,
      res,
      req.user.refresh_token,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * list of general pagickings inventory by location
 **/
exports.geraneral_inventory_packing_by_plant = function (req, res) {
  let aggregate = schemas.packing.aggregate(
    query.queries.inventory_general_by_plant(
      req.swagger.params.code.value,
      new ObjectId(req.swagger.params.supplier.value),
      new ObjectId(req.swagger.params.project.value),
    ),
  );

  schemas.packing.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
    },
    _.partial(
      responses.successHandlerPaginationAggregate,
      res,
      req.user.refresh_token,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * list of supplier inventory
 **/
exports.supplier_inventory = function (req, res) {
  let aggregate = schemas.packing.aggregate(
    query.queries.supplier_inventory(
      new ObjectId(req.swagger.params.supplier.value),
    ),
  );

  schemas.packing.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
    },
    _.partial(
      responses.successHandlerPaginationAggregate,
      res,
      req.user.refresh_token,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * list of quantity inventory
 **/
exports.quantity_inventory = function (req, res) {
  let aggregate = schemas.packing.aggregate(
    query.queries.quantity_inventory(
      req.swagger.params.code.value,
      req.swagger.params.supplier_id.value
    ),
  );

  schemas.packing.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
    },
    _.partial(
      responses.successHandlerPaginationAggregateQuantity,
      res,
      req.user.refresh_token,
      req.swagger.params.code.value,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * List of packings analysis battery
 */
exports.inventory_battery = function (req, res) {
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing
    .paginate(
      attr && code
        ? { supplier: new ObjectId(attr), code: code }
        : attr
          ? { supplier: new ObjectId(attr) }
          : code
            ? { code: code }
            : {},
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          battery: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list inventory battery by code',
      ),
  );
};

/**
 * List of packings analysis by permanence time
 */
exports.inventory_permanence = function (req, res) {
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing
    .paginate(
      attr && code
        ? { supplier: new ObjectId(attr), code: code }
        : attr
          ? { supplier: new ObjectId(attr) }
          : code
            ? { code: code }
            : {},
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          'permanence.amount_days': -1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list inventory permanence',
      ),
  );
};

/**
 * List of packings analysis by permanence time
 */
exports.inventory_absence = function (req, res) {
  let code = req.swagger.params.code.value;
  let undef;
  let page = req.swagger.params.page.value;
  let limit = req.swagger.params.limit.value;
  let _serial = req.swagger.params.serial.value;
  let _time = req.swagger.params.time.value;
  let _plant = req.swagger.params.plant.value
    ? req.swagger.params.plant.value
    : undefined;

  let aggregate = schemas.packing.aggregate(
    query_inventory.queries.absence_general(
      req.swagger.params.code.value == 'Todos' ? undef : code,
      _serial,
      _time,
      _plant,
    ),
  ); //projeto, fornecedor, equipamento, serial, time, local

  schemas.packing.aggregatePaginate(
    aggregate,
    {
      page: parseInt(req.swagger.params.page.value),
      limit: parseInt(req.swagger.params.limit.value),
      allowDiskUse: true,
    },
    _.partial(
      responses.successHandlerPaginationAggregate,
      res,
      req.user.refresh_token,
      req.swagger.params.page.value,
      req.swagger.params.limit.value,
    ),
  );
};

/**
 * Historic of packings by serial
 */
exports.inventory_packing_historic = function (req, res) {
  let serial = req.swagger.params.serial.value;
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.historicPackings
    .paginate(
      attr
        ? { supplier: new ObjectId(attr), serial: serial, packing_code: code }
        : { serial: serial, packing_code: code },
      {
        page: parseInt(req.swagger.params.page.value),
        populate: query.queries.populate,
        sort: {
          date: -1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list inventory permanence',
      ),
  );
};

/**
 * Historic of packings by serial
 */
exports.inventory_packing_absence = function (req, res) {
  let serial = req.swagger.params.serial.value;
  let code = req.swagger.params.code.value;
  let attr = req.swagger.params.attr.value;

  schemas.historicPackings
    .paginate(
      attr
        ? { supplier: new ObjectId(attr), serial: serial, packing_code: code }
        : { serial: serial, packing_code: code },
      {
        page: parseInt(req.swagger.params.page.value),
        populate: query.queries.populate,
        sort: {
          date: -1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list inventory permanence',
      ),
  );
};

/**
 * All packings inventory
 */
exports.inventory_packings = function (req, res) {
  let code = req.swagger.params.code.value;
  let code_packing = req.swagger.params.code_packing.value;
  let attr = req.swagger.params.attr.value;

  schemas.packing
    .paginate(
      attr && code
        ? { supplier: new ObjectId(attr), code_tag: code }
        : attr
          ? { supplier: new ObjectId(attr) }
          : code
            ? { code_tag: code }
            : code_packing
              ? { code: code_packing }
              : {},
      {
        page: parseInt(req.swagger.params.page.value),
        populate: [
          'supplier',
          'project',
          'tag',
          'actual_plant.plant',
          'department',
          'gc16',
        ],
        sort: {
          _id: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
  )
    .then(
      _.partial(
        responses.successHandlerPagination,
        res,
        req.user.refresh_token,
      ),
  )
    .catch(
      _.partial(
        responses.errorHandler,
        res,
        'Error to list inventory permanence',
      ),
  );
};