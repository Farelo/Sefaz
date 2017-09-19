
const mongoose                   = require('mongoose');
const traveling                  = require('./traveling');
mongoose.Promise                 = global.Promise;
const packing                    = mongoose.model('Packing');
const alert                      = mongoose.model('Alerts');
const update_packing             = require('./update_packing');

module.exports = function (result, total, count) {
  console.log(result); //LOG ABOUT PATHS UTILITS

  if(total === count){
    console.log('FINISH FIRST PART OF THE JOB');
    //VERIFY WHICH
    packing.find({'missing': true, 'traveling': false})
      .populate('tag')
      .populate('actual_plant.plant')
      .populate('department')
      .populate('supplier')
      .populate('routes')
      .populate('project')
      .populate('gc16')
      .then(packings => {
        // if(packings.length != 0){
        //
        //   packings.forEach(p => {
        //
        //     if(p.routes.length != 0){
        //       let evaluate = packings.filter( o => o.code === p.code && o.missing === true);
        //       if(evaluate.length === 1 ){
        //         console.log("PACKING",p._id,"IS REALY LOST");
        //       }else{
        //         //make thinsgs to evaluate the routes and induce which is the problem
        //         console.log("PACKING",p._id,"IS NOT LOST");
        //         traveling.create(p)
        //                  .then(p_new => update_packing(p_new))
        //                  .then( p_new => alert.remove({"packing": p._id,"status": 1}))
        //                  .then(() => console.log("PACKING",p._id,"IS TRAVELING"));
        //       }
        //     }else{
        //       console.log("PACKING",p._id,"IS REALY LOST");
        //     }
        //   })
        // }else{
        //   console.log('DOES NOT EXIST PACKINGS MISSING');
        // }
      })
  }
}
