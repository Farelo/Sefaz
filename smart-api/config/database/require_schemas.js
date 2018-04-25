'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Types.ObjectId;

/*
* modulos que serão exportados para o sistema 
*/
module.exports = {
    alert: alert, //retorna o schema de alertas
    profile: profile, //retorna o schema de profile
    packing: packing, //retorna o schema de packing
    plant: plant, //retorna o schema de packing
    department: department, //retorna o schema de department
    historicPackings: historicPackings, //retorna o schema de historicPackings
    packingAbsence: packingAbsence, //retorna o schema de packingAbsence
    GC16: GC16, //retorna o schema de GC16
    supplier: supplier, //retorna o schema de supplier
    project: project, //retorna o schema de project
    tags: tags, //retorna o schema de tags
    route: route, //retorna o schema de route
    logisticOperator: logisticOperator, //retorna o schema de logisticOperator
    settings: settings, //retorna o schema de logisticOperator
    ObjectId: ObjectId //cria um tipo  ObjectId,
}

//retorna o schema de alertas
function alert() {
    return mongoose.model('Alerts');
}

//retorna o schema de profile
function profile() {
    return mongoose.model('Profile');
}

//retorna o schema de GC16
function GC16() {
    return mongoose.model('GC16')
}

//retorna o schema de Packing
function packing() {
    return mongoose.model('Packing');
}

//retorna o schema de plant
function plant() {
    return mongoose.model('Plant');
}

//retorna o schema de department
function department() {
    return mongoose.model('Department');
}

//retorna o schema de historicPackings
function historicPackings() {
    return mongoose.model('HistoricPackings');
}

//retorna o schema de packingAbsence
function packingAbsence() {
    return mongoose.model('PackingAbsence');
}

//retorna o schema de supplier
function supplier() {
    return mongoose.model('Supplier');
}

//retorna o schema de project
function project() {
    return mongoose.model('Project');
}

//retorna o schema de tags
function tags() {
    return mongoose.model('Tags');
}

//retorna o schema de route
function route() {
    return mongoose.model('Route');
}

//retorna o schema de logisticOperator
function logisticOperator() {
    return mongoose.model('LogisticOperator');
}

//retorna o schema de settings
function settings() {
    return mongoose.model('Settings');
}


