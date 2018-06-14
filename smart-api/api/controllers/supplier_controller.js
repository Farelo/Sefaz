'use strict';
/**
 * Module dependencies.
 */
const responses                   = require('../helpers/responses/index')
const schemas                     = require("../schemas/require_schemas")
const _                           = require("lodash");
const hashPassword                = require('../helpers/utils/encrypt')
/**
 * Create a Supplier
 */
exports.supplier_create = function (req, res) {

  schemas.supplier.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create supplier'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Show the current Supplier
 */
exports.supplier_read = function (req, res) {


  schemas.supplier.findOne({
    _id: req.swagger.params.supplier_id.value
  })
    .populate('profile')
    .populate('plant')

    .then(data => {
     
      try {
        data.profile.password = hashPassword.decrypt(data.profile.password);
      } catch (error) {
        responses.successHandler(res, req.user.refresh_token, data);
      }

      responses.successHandler(res, req.user.refresh_token, data);

    })
    .catch(_.partial(responses.errorHandler, res, 'Error to read supplier'));
};
/**
 * Show the current Supplier by DUNS
 */
exports.supplier_read_by_duns = function (req, res) {
  schemas.supplier.findOne({
    "duns": req.swagger.params.supplier_duns.value
  })
    .populate('profile')
    .populate('plant')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read supplier by duns'));
};
/**
 * Show the current Supplier by DUNS and supplier
 */
exports.supplier_read_by_dunsAndSupplier = function (req, res) {
  schemas.supplier.find({
    "duns": req.swagger.params.duns.value,
    "name": req.swagger.params.name.value,
  })
    .populate('profile')
    .populate('plant')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read supplier by duns and supplier'));
};
/**
 * Update a Supplier
 */
exports.supplier_update = function (req, res) {
  schemas.supplier.update( {
    _id: req.swagger.params.supplier_id.value
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update supplier'));
};
/**
 * Delete an Supplier
 */
exports.supplier_delete = function (req, res) {

  schemas.supplier.findOne({
    _id: req.swagger.params.supplier_id.value
  }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete supplier'));
};

/**
 * List of Suppliers by pagination
 */
exports.supplier_list_pagination = function (req, res) {
  schemas.supplier.paginate({}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['profile', 'plant'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list suppliers by pagination'));
};

/**
 * List of all Suppliers
 */
exports.supplier_list_all = function (req, res) {

  schemas.supplier.find({}).populate('plant')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list all suppliers'));
};
