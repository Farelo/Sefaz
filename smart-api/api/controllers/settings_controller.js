'use strict';
/**
 * Module dependencies.
 */
const responses   = require('../helpers/responses/index')
const schemas     = require("../schemas/require_schemas")
const constants   = require('../helpers/utils/constants');
const _           = require("lodash");
const ObjectId    = schemas.ObjectId

/**
 * Retrieve Settings
 */
exports.settings_retrieve = function (req, res) {
    schemas.settings.find({})
        .catch(_.partial(responses.errorHandler, res, 'Error to retrieve settings '))
        .then(_.partial(responses.successHandler, res, req.user.refresh_token));
};
/**
 * Update Settings
 */
exports.settings_update = function (req, res) {
    schemas.settings.findOne({_id: 1})
    .then(setting => {
    
        if(setting.register_gc16.enable != req.body.register_gc16.enable){
            if (setting.register_gc16.enable ){ //se ja estava habilitado
                //remove todos os gc16 das embalagens e cria o gc16 default se existir gc16
                schemas.GC16
                    .find({})
                    .then(registers => {
                        if (registers.length){ //se existir gc16 deleta todos e remove das embalagens
                            Promise.all(registers.map(o => schemas.GC16.findOne({ _id: o._id }).exec()))
                                .then(documents => Promise.all(documents.map(d => d.remove())))
                                .then(() => schemas.GC16.create(constants.register_gc16.register))
                                .then(gc16 => {
                                    req.body.register_gc16.id = gc16._id
                                    req.body.register_gc16.days = 10
                                    return schemas.settings.update({ _id: 1 }, req.body)
                                })
                                .then(() => schemas.packing.find({}))
                                .then(packings => Promise.all(packings.map(p => schemas.packing.update({ _id: p._id }, { gc16: req.body.register_gc16.id }))))
                                .catch(_.partial(responses.errorHandler, res, 'Error to update settings '))
                                .then(_.partial(responses.successHandler, res, req.user.refresh_token))
                                

                        }else{// apenas cria o gc16 default
                            schemas.GC16.create(constants.register_gc16.register)
                                .then( gc16 => {
                                    req.body.register_gc16.id = gc16._id
                                    req.body.register_gc16.days = 10
                                    return schemas.settings.update({ _id: 1 }, req.body)
                                })
                                .then(() => schemas.packing.find({}))
                                .then(packings => Promise.all(packings.map(p => schemas.packing.update({ _id: p._id }, { gc16: req.body.register_gc16.id }))))
                                .catch(_.partial(responses.errorHandler, res, 'Error to update settings '))
                                .then(_.partial(responses.successHandler, res, req.user.refresh_token)); 
                        }
                    })
                    
           } else{
                //remove o gc16 default
                schemas.GC16
                    .findOne({ _id: req.body.register_gc16.id }).exec()
                    .then(doc => doc.remove())
                    .then(() => schemas.settings.update({
                        _id: 1
                    }, req.body))
                    .catch(_.partial(responses.errorHandler, res, 'Error to update settings '))
                    .then(_.partial(responses.successHandler, res, req.user.refresh_token)); 
           }
        }else{
            schemas.settings.update({
                _id: 1
            }, req.body)
                .catch(_.partial(responses.errorHandler, res, 'Error to update settings '))
                .then(_.partial(responses.successHandler, res, req.user.refresh_token)); 
        }
    })
   
};
