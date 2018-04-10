'use strict';

const cron                       = require('node-cron');
const token                      = require('./consults/token');
const devices                    = require('./consults/devices');
const consultDatabase            = require('./consults/consult');
const updateDevices              = require('./updates/update_devices');
const with_route                 = require('./routes/with_route');
const without_route              = require('./routes/without_route');
const evaluate_battery           = require('./alerts/evaluate_battery');
const actual_plant               = require('./positions/actual_plant');
const evaluate_department        = require('./positions/evaluate_department');
const verify_finish              = require('./evaluates/verify_finish');
const evaluate_missing           = require('./alerts/evaluate_missing');
const update_packing             = require('./updates/update_packing');
const traveling                  = require('./alerts/traveling');
const remove_dependencies        = require('./updates/remove_dependencies');
const environment                = require('../config/environment');

var task = cron.schedule(`*/${environment.time} * * * * *`, function() {
    token()
      .then(token => devices(token))//Get All devices from SIGFOX LOKA-API
      .then(devices => Promise.all(updateDevices(devices))) //UPDATE ALL PACKINGS WITH INFORMATION FROM LOKA-API
      .then(() =>  Promise.all(consultDatabase())) //RECEIVE ARRAY GET ALL PACKINGS AFTER UPDATE AND PLANTS
      .then(data => analysis(data)) //EVALUETE ALL PACKINGS, TO SEARCH SOME PROBLEM
      .catch(err => console.log(err))
});

function analysis(data){
  let packings      = data[0]; //GET ALL PACKINGS
  let plants        = data[1]; //GET ALL PLANTS
  let settings      = data[2] //get seetings
  let total_packing = packings.length; //get amount the packings on the system
  let count_packing = 0; //count the amount of packings

  packings.forEach(p => {
    let plant = actual_plant(p, plants, settings); //calculate a distance from packing to plants

      if(plant != null){
        console.log("PACKING HAS PLANT");
        evaluate_department(plant,p).then(department => {
            if(p.routes.length > 0){ //Evaluete if the packing has route ---------------------- EMBALAGENS QUE TEM  ROTA
              with_route(p, plant, department, settings).then(result =>{
                count_packing++;
                verify_finish(result,total_packing,count_packing)
              });

            //embalagen que não estão associadas as rotas ------------------- SEGUNDA LOGICA
            }else{
              without_route(p, plant, department, settings).then(result =>{
                count_packing++;
                verify_finish(result,total_packing,count_packing)
              });
            }
        });
      }else{

        //para embalagens que não foram econtradas dentro de uma planta
        console.log("PACKING HAS NOT PLANT");
        remove_dependencies.without_plant(p)
          .then(new_p => evaluate_battery(new_p, settings))
          .then(new_p => evaluate_missing(new_p))
          .then(new_p => traveling.evaluate_traveling(new_p))
          .then(new_p => update_packing.set(new_p))
          .then(() => update_packing.unset(p))
          .then(result =>{
            count_packing++;
            verify_finish("FINISH VERTENTE SEM PLANTA",total_packing,count_packing)
          });

      }

    });
}
