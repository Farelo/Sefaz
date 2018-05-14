'use strict';

const constants          = require('../../api/helpers/utils/constants');
const schemas            = require("../../api/schemas/require_schemas")


schemas.settings.find({}).then(setting => { //inserindo as configurações de usuário
    
    if (!setting.length){//se não existe configuração no sistema a cria 
        schemas.GC16.find({}).then(gc16 => {
            let config = {}
            if (!gc16.length) { //caso o sistema ja estivcesse rodando (essa alteração foi posta quando o sistema estava em produção)
                config = {
                    "_id": 1,
                    "battery_level": constants.battery_level,
                    "clean": 604800000, // a cada semana os dados historicos são removidos de cada uma das embalagens
                    "update_clean": false,
                    "register_gc16": {
                        enable: constants.register_gc16.enable,
                        "days": constants.register_gc16.days
                    },
                    "range_radius": constants.range_radius,
                }
            }else{
                config = {
                    "_id": 1,
                    "battery_level": constants.battery_level,
                    "clean": 604800000, // a cada semana os dados historicos são removidos de cada uma das embalagens
                    "update_clean": false,
                    "register_gc16": {
                        enable: true,
                        "days": constants.register_gc16.days
                    },
                    "range_radius": constants.range_radius,
                }
            }

            schemas.settings.create(config)
                .then(settings => schemas.profile.create(constants.system_user))
                .then(user => schemas.settings.update({ _id: 1 }))
                .then(() => {
                    if (!constants.register_gc16.enable) {
                        return schemas.GC16.create(constants.register_gc16.register)
                    } else {
                        return schemas.GC16.find()
                    }
                })
                .then(gc16 => {

                    if (!constants.register_gc16.enable) {
                        return schemas.settings.update({ _id: 1 }, { "register_gc16.id": gc16._id })
                    } else {
                        return schemas.settings.find()
                    }
                })
                .then(() => console.log("Sistema Configurado"))
                .catch(() => console.log("Ocorreu algum problema na configuração do sistema"))
        })
        
    } else {
        console.log("Sistema Configurado!")
    }
})

