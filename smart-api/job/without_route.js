// const traveling                  = require('./traveling');

const evaluate_battery           = require('./evaluate_battery');
const permanence_time            = require('./permanence_time');
const evaluate_gc16              = require('./evaluate_gc16');
const historic                   = require('./historic');
// const evaluate_missing           = require('./evaluate_missing');
const update_packing             = require('./update_packing');
const incorrect_local            = require('./incorrect_local');
const remove_incorrect_local     = require('./remove_incorrect_local');
const _                          = require("lodash");

module.exports  = function(p,plant,department){
  return new Promise(function(resolve, reject) {
    if(p.actual_plant.plant){

      //Indefitico que ja foi encontrada em uma planta
      if(p.actual_plant.plant.equals(plant._id)){//verifica se esta na mesma planta
        //fazer algo caso esteja na mesma planta
        //insere informações sobre a planta atual
        p = evaluate_gc16.fixed(p,plant,department);
        evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
          .then( p_new => remove_incorrect_local(p_new)) //REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
          // .then(p_new => evaluate_missing(p_new))//VERIFICAR SE A MESMA SUMIU  - VERIFICAR SE A MESMA SUMIU , PARA EMITIR ALERTA, CASO CONTRARIO, REMOVER ALGUM ALERTA
          .then(p_new => permanence_time.fixednoroute(p_new))//VERIFICAR O TEMPO DE PERMANENCIA - EMITIR ALERTA SOBRE O TEMPO DE PERMANENCIA DAR UM UPDATE UPSERT, ESSE CASO É DIFERENTE, NUNCA IRÁ REMoVER
          .then(p_new => Promise.all([update_packing(p_new), historic.update(p_new)]))
          .then( result =>  resolve("FINISH VERTENTE 2"));


      }else{
        //TEST IT
        //não esta na mesma planta
        //insere informações sobre a planta atual
        p = evaluate_gc16.changed(p,plant,department);
        //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
        evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
          .then( p_new => remove_incorrect_local(p_new))//REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
          .then(p_new => permanence_time.change(p_new))//ZERAR TEMPO DE PERMANENCIA - OU REMOVER ALERTA DESSE TIPO CASO EXISTA
          .then(p_new => Promise.all([update_packing(p_new),historic.create(p_new)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
          .then( result =>  resolve("FINISH VERTENTE 1"));
      }

    }else{
      //não estava associado a nenhuma plant
      //VERIFICA A BATERIA
      //APENAS CRIAR
      //insere informações sobre a planta atual
      p = evaluate_gc16.changed(p,plant,department);
      //a data é utilizada como parametro para atualizar as informações, ja que ela é fixa
      evaluate_battery(p)//AVALIAR BATERIA - EMITIR ALERTA OU REMOVER CASO EXISTA ALERTA
        .then( p_new => remove_incorrect_local(p_new))//REMOVENDO OS ALERTAS CRIADOS QUANDO EXISTIA ROTAS
        .then( p_new => Promise.all([update_packing(p_new),historic.create(p_new)]))//ATUALIZAR EMBALAGEM COM AS NOVAS INFORMAçÔES E CRIAR HISTORICO (VERIFICAR SE É NECESSÀRIO ATUALIZAR o HISTORICOANTERIOR EM 1 HORA )
        .then( result =>  resolve("FINISH VERTENTE 3"));
    }

  });
}