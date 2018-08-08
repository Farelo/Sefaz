const constants = require('../../api/helpers/utils/constants');
const schemas = require('../../api/schemas/require_schemas');

function start() {
  schemas.settings.find({}).then((setting) => {
    // inserindo as configurações de usuário

    if (!setting.length) {
      // se não existe configuração no sistema a cria
      schemas.GC16.find({}).then((gc16) => {
        let config = {};
        if (!gc16.length) {
          // caso o sistema ja estivcesse rodando
          // (essa alteração foi posta quando o sistema estava em produção)
          config = {
            _id: 1,
            battery_level: constants.battery_level,
            // a cada semana os dados historicos são removidos de cada uma das embalagens
            clean: 604800000,
            update_clean: false,
            register_gc16: {
              enable: constants.register_gc16.enable,
              days: constants.register_gc16.days,
            },
            range_radius: constants.range_radius,
          };
        } else {
          config = {
            _id: 1,
            battery_level: constants.battery_level,
            // a cada semana os dados historicos são removidos de cada uma das embalagens
            clean: 604800000,
            update_clean: false,
            register_gc16: {
              enable: true,
              days: constants.register_gc16.days,
            },
            range_radius: constants.range_radius,
          };
        }

        schemas.settings
          .create(config)
          .then(() => schemas.profile.create(constants.system_user))
          .then(() => schemas.settings.update({ _id: 1 }))
          .then(() => {
            if (!constants.register_gc16.enable) {
              return schemas.GC16.create(constants.register_gc16.register);
            }
            return schemas.GC16.find();
          })
          .then(() => {
            if (!constants.register_gc16.enable) {
              return schemas.settings.update({ _id: 1 }, { 'register_gc16.id': gc16._id });
            }
            return schemas.settings.find();
          })
          .then(() => console.log('Sistema Configurado'))
          .catch(() => console.log('Ocorreu algum problema na configuração do sistema'));
      });
    } else {
      console.log('Sistema Configurado!');
    }
  });
}

module.exports = {
  start,
};
