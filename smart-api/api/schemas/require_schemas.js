'use strict';

const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId   = mongoose.Types.ObjectId;

/*
* modulos que serão exportados para o sistema 
*/
module.exports = {
    alert: require('./alerts'), //retorna o schema de alertas
    profile: require('./profile'), //retorna o schema de profile
    packing: require('./packing'), //retorna o schema de packing
    plant: require('./plant'), //retorna o schema de packing
    department: require('./department'), //retorna o schema de department
    historicPackings: require('./historic_packings'), //retorna o schema de historicPackings
    packingAbsence: require('./packing_absence'), //retorna o schema de packingAbsence
    GC16: require('./gc16'), //retorna o schema de GC16
    supplier: require('./supplier'), //retorna o schema de supplier
    project: require('./project'), //retorna o schema de project
    tags: require('./tag'), //retorna o schema de tags
    route: require('./route'), //retorna o schema de route
    logisticOperator: require('./logistic_operator'), //retorna o schema de logisticOperator
    settings: require('./settings'), //retorna o schema de logisticOperator
    ObjectId: ObjectId //cria um tipo  ObjectId,
}



