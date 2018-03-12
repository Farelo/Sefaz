'use strict';

const schemas       = require('../../config/database/require_schemas')
const historic_type = require('../historic/historic_type')

module.exports = function (p) {

    return schemas.historicPackings().remove({ 
        packing_code: p.code, 
        serial: p.serial,
        permanence_time: 0, 
        supplier: p.supplier._id,
        packing: p._id, 
        status: historic_type.MISSING 
    });

}