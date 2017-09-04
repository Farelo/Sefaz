
const mongoose                   = require('mongoose');
mongoose.Promise                 = global.Promise;
const cron                       = require('node-cron');
const packing                    = mongoose.model('Packing');
const route                      = mongoose.model('Route');
const alert                      = mongoose.model('Alerts');
const historic_packings          = mongoose.model('HistoricPackings');
const token                      = require('./token');
const devices                    = require('./devices');
const updateDevices              = require('./update_devices');
const consultDatabase            = require('./consult');
const actual_plant               = require('./actual_plant');
const evaluate_battery           = require('./evaluate_battery');
const permanence_time            = require('./permanence_time');
const evaluate_gc16              = require('./evaluate_gc16');
const historic                   = require('./historic');
const evaluate_missing           = require('./evaluate_missing');
const update_packing             = require('./update_packing');
const incorrect_local            = require('./incorrect_local');
const remove_incorrect_local     = require('./remove_incorrect_local');
const _                          = require("lodash");

var task = cron.schedule('*/10 * * * * *', function() {
    token()
      .then(token => devices(token))//Get All devices from SIGFOX LOKA-API
      .then(devices => Promise.all(updateDevices(devices))) //UPDATE ALL PACKINGS WITH INFORMATION FROM LOKA-API
      .then(() =>  Promise.all(consultDatabase())) //RECEIVE ARRAY GET ALL PACKINGS AFTER UPDATE AND PLANTS
      .then(data => analysis(data)); //EVALUETE ALL PACKINGS, TO SEARCH SOME PROBLEM
});

function analysis(data){
  let packings = data[0]; //GET ALL PACKINGS
  let plants   = data[1]; //GET ALL PLANTS

  packings.forEach(p => {
      let plant  = actual_plant(p,plants); //calculate a distance from packing to plants

      if(p.routes.length > 0){ //Evaluete if the packing has route ---------------------- EMBALAGENS QUE TEM  ROTA

        if(p.actual_plant){
          //Indefitico que ja foi encontrada em uma planta
          if(p.actual_plant.equals(plant._id)){//verifica se esta na mesma planta
            //fazer algo caso esteja na mesma planta
            //insere informações sobre a planta atual
            p = evaluate_gc16.fixed(p,plant);
            evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
              .then(p => incorrect_local(p,plant))  //verificar se esta no local correto
              .then(p => evaluate_missing(p))//VERIFICAR SE A MESMA SUMIU  - VERIFICAR SE A MESMA SUMIU , PARA EMITIR ALERTA, CASO CONTRARIO, REMOVER ALGUM ALERTA
              .then(new_p => permanence_time.fixednoroute(new_p))//VERIFICAR O TEMPO DE PERMANENCIA - EMITIR ALERTA SOBRE O TEMPO DE PERMANENCIA DAR UM UPDATE UPSERT, ESSE CASO É DIFERENTE, NUNCA IRÁ REMoVER
              .then(new_p => Promise.all([update_packing(new_p), historic.update(new_p)]))
              .then(() => console.log("FINISHI VERTENTE ROUTE 2"));

          }else{
            //TEST IT
            //não esta na mesma planta
            //insere informações sobre a planta atual
            p = evaluate_gc16.changed(p,plant);
            //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
            evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
              .then(p => incorrect_local(p,plant))  //verificar se esta no local correto
              .then(p => permanence_time.change(p))//ZERAR TEMPO DE PERMANENCIA - OU REMOVER ALERTA DESSE TIPO CASO EXISTA
              .then(new_p => Promise.all([update_packing(new_p),historic.create(new_p)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
              .then(() => console.log("FINISHI VERTENTE ROUTE 1"));
          }

        }else{
          //não estava associado a nenhuma plant
          //VERIFICA A BATERIA
          //APENAS CRIAR
          //insere informações sobre a planta atual
          p = evaluate_gc16.changed(p,plant);

          //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
          evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
            .then(p => incorrect_local(p,plant))  //verificar se esta no local correto
            .then( p => Promise.all([update_packing(p),historic.create(p)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
            .then( result => console.log("FINISHI VERTENTE ROUTE 3"));
        }

      //embalagen que não estão associadas as rotas ------------------- SEGUNDA LOGICA
      }else{

        if(p.actual_plant.plant){

          //Indefitico que ja foi encontrada em uma planta
          if(p.actual_plant.plant.equals(plant._id)){//verifica se esta na mesma planta
            //fazer algo caso esteja na mesma planta
            //insere informações sobre a planta atual
            p = evaluate_gc16.fixed(p,plant);
            evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
              .then( p => remove_incorrect_local(p)) //REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
              .then(p => evaluate_missing(p))//VERIFICAR SE A MESMA SUMIU  - VERIFICAR SE A MESMA SUMIU , PARA EMITIR ALERTA, CASO CONTRARIO, REMOVER ALGUM ALERTA
              .then(new_p => permanence_time.fixednoroute(new_p))//VERIFICAR O TEMPO DE PERMANENCIA - EMITIR ALERTA SOBRE O TEMPO DE PERMANENCIA DAR UM UPDATE UPSERT, ESSE CASO É DIFERENTE, NUNCA IRÁ REMoVER
              .then(new_p => Promise.all([update_packing(new_p), historic.update(new_p)]))
              .then(() => console.log("FINISHI VERTENTE 2"));

          }else{
            //TEST IT
            //não esta na mesma planta
            //insere informações sobre a planta atual
            p = evaluate_gc16.changed(p,plant);
            //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
            evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
              .then( p => remove_incorrect_local(p))//REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
              .then(p => permanence_time.change(p))//ZERAR TEMPO DE PERMANENCIA - OU REMOVER ALERTA DESSE TIPO CASO EXISTA
              .then(new_p => Promise.all([update_packing(new_p),historic.create(new_p)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
              .then(() => console.log("FINISHI VERTENTE 1"));
          }

        }else{
          //não estava associado a nenhuma plant
          //VERIFICA A BATERIA
          //APENAS CRIAR
          //insere informações sobre a planta atual
          p = evaluate_gc16.changed(p,plant);
          //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
          evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
            .then( p => remove_incorrect_local(p))//REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
            .then( p => Promise.all([update_packing(p),historic.create(p)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
            .then( result => console.log("FINISHI VERTENTE 3"));
        }

      }
  });
}
