'use strict';

const constants          = require('../../api/helpers/utils/constants');
const schemas            = require('../database/require_schemas')

schemas.profile().create(constants.system_user)
schemas.logisticOperator().collection.dropIndex("cpf_1", function (err, results) {
    if(err){
        console.log(err)
    }else{
        console.log(results)
    }
})