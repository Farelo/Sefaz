const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = function(p, plant) {
  return new Promise(function(resolve, reject) {
    if(p.route.plant_factory.equals(plant._id) || p.route.plant_supplier.equals(plant._id)){ //Make sure the current plant belongs to the route
      p.problem = false;
      console.log("INCORRECT LOCAL: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
      alert.remove({
        "packing": p._id,
        "status": 2
      }).then(() => resolve(p));
    }else{
        p.problem = true;
        alert.find({ //Verifica se o alerta ja existe
          "packing": p._id,
          "status": 2
        }).then(result => {
          if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
            console.log("INCORRECT LOCAL: ALERT CREATE TO PACKING: " + p._id);
            alert.create({
              "correct_plant_factory": p.route.plant_factory,
              "correct_plant_supplier": p.route.plant_supplier,
              "actual_plant": p.actual_plant,
              "packing": p._id,
              "supplier": p.supplier,
              "status": 2,
              "hashpacking": p.hashPacking,
              "serial": p.serial,
              "date": new Date().getTime()
            }).then(() => resolve(p));
          } else {
            console.log("INCORRECT LOCAL: ALERT ALREADY EXIST TO PACKING: " + p._id);
            alert.update({ //Verifica se o alerta ja existe
              "packing": p._id,
              "status": 2
            },{
              "correct_plant_factory": p.route.plant_factory,
              "correct_plant_supplier": p.route.plant_supplier,
              "actual_plant": p.actual_plant,
              "supplier": p.supplier,
              "hashpacking": p.hashPacking,
              "serial": p.serial
            }).then(() => resolve(p));
          }
        });
    }
  });
}
