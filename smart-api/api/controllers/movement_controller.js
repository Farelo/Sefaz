/**
 * Module dependencies.
 */
const _ = require('lodash');
const responses = require('../helpers/responses/index');
const schemas = require('../schemas/require_schemas');
const cleanObject = require('../helpers/utils/cleanObject');

const ObjectId = schemas.ObjectId;

/**
 * List of hitory moviment with pagination to especific parameters
 */
function historicMovementList(req, res) {
  const packing_code = req.swagger.params.packing_code.value;
  const supplier = req.swagger.params.supplierId.value
    ? new ObjectId(req.swagger.params.supplierId.value)
    : undefined;
  const serial = req.swagger.params.serial.value;
  const status = req.swagger.params.status.value;
  const packing = req.swagger.params.packingId.value
    ? new ObjectId(req.swagger.params.packingId.value)
    : undefined;
  const page = req.swagger.params.page.value;
  const limit = req.swagger.params.limit.value;
  const accuracy = req.swagger.params.accuracy.value;
  const startDate = req.swagger.params.startDate.value;
  const endDate = req.swagger.params.endDate.value;

  const obj = {
    packing_code,
    supplier,
    status,
    packing,
    serial,
  };
  obj.accuracy = accuracy ? { $lt: accuracy } : undefined;
  obj.$and = startDate && endDate ? [{ date: { $gte: startDate } }, { date: { $lte: endDate } }] : undefined;

  schemas.historyMovement
    .paginate(cleanObject(obj), {
      page,
      populate: ['supplier', 'packing'],
      sort: {
        date: -1,
      },
      limit,
    })
    .then(_.partial(responses.successHandlerPagination, res, req.user.refresh_token))
    .catch(_.partial(responses.errorHandler, res, 'Error to list inventory permanence'));
}

module.exports = {
  historicMovementList,
};
