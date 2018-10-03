
/**
 * Module dependencies.
 */
const _ = require('lodash');
const responses = require('../helpers/responses/index');
const schemas = require('../schemas/require_schemas');
const query = require('../helpers/queries/complex_queries_plants');

const ObjectId = schemas.ObjectId;
/**
 * Create a Plant
 */
exports.plant_create = function (req, res) {
  schemas.plant
    .create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create plant'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Create a Plant
 */
exports.plant_create_array = function (req, res) {
  schemas.plant
    .create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create plant'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Plant
 */
exports.plant_read = function (req, res) {
  schemas.plant
    .findOne({
      _id: req.swagger.params.plant_id.value,
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};
/**
 * Show the current Plant by name
 */
exports.plant_read_by_name = function (req, res) {
  schemas.plant
    .find({
      plant_name: req.swagger.params.plant_name.value,
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};

/**
 * Update a Plant
 */
exports.plant_update = function (req, res) {
  schemas.plant
    .update(
      {
        _id: req.swagger.params.plant_id.value,
      },
      req.body,
    )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update plant'));
};
/**
 * Delete an Plant
 */
exports.plant_delete = function (req, res) {
  schemas.plant
    .findOne({
      _id: req.swagger.params.plant_id.value,
    })
    .exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete plant'));
};
/**
 * List of all Plants without supplier and logistic_operator
 */
exports.list_all = function (req, res) {
  schemas.plant
    .find({
      supplier: { $exists: false },
      logistic_operator: { $exists: false },
    })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};

/**
 * List of all Plants without supplier and logistic_operator no binded with route
 */
exports.list_all_nobinded = function (req, res) {
  schemas.plant
    .aggregate(
      query.queries.plant_filter(
        req.swagger.params.code.value,
        req.swagger.params.supplier.value,
        req.swagger.params.project.value,
      ),
    )
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants
 */
exports.list_all_general = function (req, res) {
  const attr = req.swagger.params.attr.value;

  schemas.plant
    .find(attr ? { supplier: new ObjectId(attr) } : {})
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants
 */
exports.list_all_general_logistic = function (req, res) {
  const map = req.body.map(o => new ObjectId(o));
  const logistic_id = req.swagger.params.logistic_id.value;

  schemas.plant
    .find({ $or: [{ supplier: { $in: map } }, { logistic_operator: logistic_id }] })
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read plant'));
};
/**
 * List of all Plants by pagination
 */
exports.plant_listPagination = function (req, res) {
  schemas.plant
    .paginate(
      req.swagger.params.attr.value
        ? {
          name: req.swagger.params.attr.value,
          supplier: { $exists: false },
          logistic_operator: { $exists: false },
        }
        : { supplier: { $exists: false }, logistic_operator: { $exists: false } },
      {
        page: parseInt(req.swagger.params.page.value),
        sort: {
          _id: 1,
        },
        limit: parseInt(req.swagger.params.limit.value),
      },
    )
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list plant registers by pagination'));
};
