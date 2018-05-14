'use strict';
/**
 * Module dependencies.
 */
const responses                  = require('../helpers/responses/index')
const schemas                    = require("../schemas/require_schemas")
const _                          = require("lodash");
const hashPassword               = require('../helpers/utils/encrypt')
/**
 * Create a Logistc Operator
 */
exports.logistic_operator_create = function (req, res) {

  schemas.logisticOperator.create(req.body)
    .catch(_.partial(responses.errorHandler, res, 'Error to create Logistic Operator'))
    .then(_.partial(responses.successHandler, res, req.user.refresh_token));

};

/**
 * Show the current Logistc Operator
 */
exports.logistic_operator_read = function (req, res) {
  schemas.logisticOperator.findOne({
    _id: req.swagger.params.logistic_operator_id.value
  })
    .populate('profile')
    .populate('suppliers')
    .populate('plant').then(data => {
      
      try {
        data.profile.password = hashPassword.decrypt(data.profile.password);
      } catch (error) {
        responses.successHandler(res, req.user.refresh_token, data);
      }

      responses.successHandler(res, req.user.refresh_token, data);

    }).then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to read Logistic Operator'));
};

/**
 * Update a Logistc Operator
 */
exports.logistic_operator_update = function (req, res) {
  schemas.logisticOperator.update( {
    _id: req.swagger.params.logistic_operator_id.value
  }, req.body)
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to update Logistic Operator'));
};
/**
 * Delete an Logistc Operator
 */
exports.logistic_operator_delete = function (req, res) {
  schemas.logisticOperator.findOne({ _id: req.swagger.params.logistic_operator_id.value }).exec()
    .then(doc => doc.remove())
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to delete Logistic Operator'))
};
/**
 * List of all Logistics Operator
 */
exports.logistic_operator_list = function (req, res) {
  schemas.logisticOperator.find({})
    .populate('profile')
    .then(_.partial(responses.successHandler, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list of all Logistic Operator'));
};
/**
 * List of all Logistics Operator by pagination
 */
exports.logistic_operator_listPagination = function (req, res) {
  schemas.logisticOperator.paginate({}, {
    page: parseInt(req.swagger.params.page.value),
    populate: ['profile'],
    sort: {
      _id: 1
    },
    limit: parseInt(req.swagger.params.limit.value)
  })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list admins by pagination'));
};
