const cron                       = require('node-cron');
const token                      = require('./token');
const devices                    = require('./devices');
const consultDatabase            = require('./consult');
const updateDevices              = require('./update_devices');
const with_route                 = require('./with_route');
const without_route              = require('./without_route');
const actual_plant               = require('./actual_plant');
const evaluate_department        = require('./evaluate_department');
const verify_finish              = require('./verify_finish');

var task = cron.schedule('*/10 * * * * *', function() {
    token()
      .then(token => devices(token))//Get All devices from SIGFOX LOKA-API
      .then(devices => Promise.all(updateDevices(devices))) //UPDATE ALL PACKINGS WITH INFORMATION FROM LOKA-API
      .then(() =>  Promise.all(consultDatabase())) //RECEIVE ARRAY GET ALL PACKINGS AFTER UPDATE AND PLANTS
      .then(data => analysis(data)); //EVALUETE ALL PACKINGS, TO SEARCH SOME PROBLEM
});

function analysis(data){
  let packings      = data[0]; //GET ALL PACKINGS
  let plants        = data[1]; //GET ALL PLANTS
  let total_packing = packings.length; //get amount the packings on the system
  let count_packing = 0; //count the amount of packings

  packings.forEach(p => {
      let plant  = actual_plant(p,plants); //calculate a distance from packing to plants

      if(plant != null){
        evaluate_department(plant,p).then(department => {
            if(p.routes.length > 0){ //Evaluete if the packing has route ---------------------- EMBALAGENS QUE TEM  ROTA
              with_route(p,plant,department).then(result =>{
                count_packing++;
                verify_finish(result,total_packing,count_packing)
              });

            //embalagen que não estão associadas as rotas ------------------- SEGUNDA LOGICA
            }else{
              without_route(p,plant,department).then(result =>{
                count_packing++;
                verify_finish(result,total_packing,count_packing)
              });
            }
        });
      }else{
        //para embalagens que não foram econtradas dentro de uma planta
        // console.log("aqui");
      }

    });
}
