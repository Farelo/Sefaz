
'use strict';

const schemas                    = require('../config/database/require_schemas')
const traveling                  = require('./traveling');
const update_packing             = require('./update_packing');
const alerts_type                = require('./alerts_type');


module.exports = function (result, total, count) {
  console.log(result); //LOG ABOUT PATHS UTILITS

  if(total === count){
    console.log('FINISH FIRST PART OF THE JOB');
    //VERIFY WHICH
    schemas.packing().find({'missing': true, 'traveling': false})
      .populate('tag')
      .populate('actual_plant.plant')
      .populate('department')
      .populate('supplier')
      .populate('routes')
      .populate('project')
      .populate('gc16')
      .then(packings => {
        if(packings.length != 0){

          packings.forEach(p => {

            if(p.routes.length != 0){
              let evaluate = packings.filter( o =>  o.code === p.code && o.missing === true && o.project._id.equals(p.project._id) && o.supplier._id.equals(p.supplier._id));

              if(evaluate.length === 1 ){
                console.log("PACKING",p._id,"IS REALY LOST");
              }else{
                //make thinsgs to evaluate the routes and induce which is the problem
                console.log("PACKING",p._id,"IS NOT LOST");

                let p_clone = JSON.parse(JSON.stringify(p));
                traveling.set(p_clone)
                         .then(p_new => update_packing.set(p_new))
                         .then( p_new => schemas.alert().remove({"packing": p._id,"status": alerts_type.MISSING}))
                         .then(() => console.log("PACKING",p._id,"IS TRAVELING"));
              }
            }else{
              console.log("PACKING",p._id,"IS REALY LOST");
            }
          })
        }else{
          console.log('DOES NOT EXIST PACKINGS MISSING');
        }
      })
  }
}
