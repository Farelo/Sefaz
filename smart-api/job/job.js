
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var cron = require('node-cron');
var checkpoint = mongoose.model('Checkpoint');
var packing = mongoose.model('Packing');
var route = mongoose.model('Route');
var alert = mongoose.model('Alerts');
var historic_packings = mongoose.model('HistoricPackings');
var Scanned = [];
const request = require('request');


// Agendador de tarefas para realizar buscas no recurso changes da API
var task = cron.schedule('*/10 * * * * *', function() {
    checkpoint.find({})
        .then(checkpoints => Promise.all(promisesPlaceDev(checkpoints)))
        .then(devPlace => gettingAllPacking(devPlace))
        .then(promiseResult => resultPromiseWithPackings(promiseResult))
        .catch(err => console.log(err));
});

function promisesPlaceDev(checkpoints) {
    if (checkpoints.length != 0) {
        var arrayOfPromises = [];
        checkpoints.forEach(o => arrayOfPromises.push(getInfoScanner(o.place_id, o)));
        return arrayOfPromises;
    } else {
        throw new Error('No checkpoints registered');
    }
}

function gettingAllPacking(devPlace) {

    devPlace.forEach(function(d) {
        d.devices.forEach(o => Scanned.push({
            "device": o,
            "checkpoint": d.checkpoint
        }));
    });
    if (Scanned.length != 0) {
        var arrayOfTags = [];
        devPlace.forEach(o => arrayOfTags = arrayOfTags.concat(o.devices));
        arrayOfTags = arrayOfTags.map(o => o.mac.toUpperCase());

        return Promise.all([packing.find({
            "tag_mac": {
                "$in": arrayOfTags
            }
        }), packing.find({
            "tag_mac": {
                "$nin": arrayOfTags
            }
        })]);
    } else {
        throw new Error('No exist scanners Online');
    }


}

function resultPromiseWithPackings(promiseResult) {

    var packingsFound = promiseResult[0];
    var packingsNoFound = promiseResult[1];

    if (packingsFound.length != 0) {
        route.find({})
            .populate("supplier")
            .populate("plant_factory")
            .populate("plant_supplier")
            .then(routes => Promise.all(checkingPackings(packingsFound, packingsNoFound, routes)))
            .then(updatePromises => updatePromises)
            .catch(err => console.log(err));
    } else {
        if (packingsNoFound.length != 0) {
            packingsNoFound.forEach(function(pn) {
                pn.missing = true;
                packing.update({
                        _id: pn._id
                    }, pn, {
                        upsert: true
                    })
                    .then(success => console.log(success))
                    .catch(err => console.log(err));
            });
        }
        throw new Error('No exist packings found');
    }

}

//MUDA ISSO DAQUI QUE TEM MUITA COIISA, DEFINIR AS ETAPAS E DESCENTRALIZAR
function checkingPackings(packingsFound, packingsNoFound, routes) {
    var promiseUpdate = [];
    console.log("Run");
    var filterScanned = Scanned.map(s => s.device.mac.toUpperCase());

    if (routes.length != 0) {

        packingsFound.forEach(function(p) {

            var route = routes.filter(r => r.packing_code === p.code && r.supplier._id.equals(p.supplier))[0];
            var indexCheckpoint = filterScanned.indexOf(p.tag_mac);
            var hasProblem = false;
            console.log("Tag: "+p.tag_mac);
            console.log("Planta Scanned: "+Scanned[indexCheckpoint].checkpoint.plant);
            console.log("Planta Atual: "+p.actual_plant);
            if(route){
              var hasProblem = !route.plant_factory._id.equals(Scanned[indexCheckpoint].checkpoint.plant) &&
                  !route.plant_supplier._id.equals(Scanned[indexCheckpoint].checkpoint.plant);
                  p.correct_plant_factory = route.plant_factory._id;
                  p.correct_plant_supplier = route.plant_supplier._id;

            }



            if (p.last_time) {
              if(!hasProblem){
                if (p.department.equals(Scanned[indexCheckpoint].checkpoint.department)) {
                    var oneDay = 1000; // hours*minutes*seconds*milliseconds
                    var date = new Date();
                    var diffDays = Math.round(Math.abs((p.last_time.getTime() - date.getTime()) / (oneDay)));
                    p.amount_days += diffDays;

                    //verifica o tempo de permanencia em um mesmo local
                    if(p.amount_days > 300){
                      if(p.permanence_exceeded){
                        promiseUpdate.push(
                          alert.update({"packing": p._id},{
                          "actual_plant": Scanned[indexCheckpoint].checkpoint.plant,
                          "department": Scanned[indexCheckpoint].checkpoint.department,
                          "packing": p._id,
                          "supplier": p.supplier,
                          "status": "03",
                          "hashpacking": p.hashPacking
                        },{
                            upsert: true
                        }));
                      }else{
                        p.permanence_exceeded = true;
                        promiseUpdate.push(alert.remove({ "packing": p._id , "status": { $ne: "03" }}));
                        promiseUpdate.push(alert.create({
                          "actual_plant": Scanned[indexCheckpoint].checkpoint.plant,
                          "department": Scanned[indexCheckpoint].checkpoint.department,
                          "packing": p._id,
                          "supplier": p.supplier,
                          "status": "03",
                          "hashpacking": p.hashPacking
                        }));
                      }
                    }else{
                      promiseUpdate.push(alert.remove({ "packing": p._id}));
                      p.permanence_exceeded = false;
                    }

                    p.last_time = new Date();
                    p.time_countdown = 0;
                    p.last_time_missing = undefined;
                } else {
                    console.log("Change");
                    promiseUpdate.push(alert.remove({ "packing": p._id}));
                    p.last_time = new Date();
                    p.amount_days = 0;
                    p.time_countdown = 0;
                    p.last_time_missing = undefined;
                }
              }
            } else {
                p.last_time = new Date();
                p.time_countdown = 0;
                p.amount_days = 0;
                p.last_time_missing = undefined;
                p.permanence_exceeded = false;
                promiseUpdate.push(alert.remove({ "packing": p._id}));
                promiseUpdate.push(historic_packings.create({
                    'packing': p._id,
                    'historic': [{
                        plant: Scanned[indexCheckpoint].checkpoint.plant
                    }]
                }));
            }


            p.department = Scanned[indexCheckpoint].checkpoint.department;
            p.actual_plant = Scanned[indexCheckpoint].checkpoint.plant;
            p.hashPacking  =   p.supplier + p.code;
            p.missing = false;


            //insere informações sobre embalagem como problemas para a tabela de alertas
            if(hasProblem ){
              console.log("Problem");
              if(p.problem){
                promiseUpdate.push(
                  alert.update({"packing": p._id},{
                  "actual_plant": Scanned[indexCheckpoint].checkpoint.plant,
                  "department": Scanned[indexCheckpoint].checkpoint.department,
                  "correct_plant_factory": route.plant_factory._id,
                  "correct_plant_supplier": route.plant_supplier._id,
                  "packing": p._id,
                  "supplier": p.supplier,
                  "status": "01",
                  "hashpacking": p.hashPacking
                },{
                    upsert: true
                }));
              }else{
                p.problem = hasProblem;
                promiseUpdate.push(alert.remove({ "packing": p._id , "status": { $ne: "01" }}));
                promiseUpdate.push(alert.create({
                  "actual_plant": Scanned[indexCheckpoint].checkpoint.plant,
                  "department": Scanned[indexCheckpoint].checkpoint.department,
                  "correct_plant_factory": route.plant_factory._id,
                  "correct_plant_supplier": route.plant_supplier._id,
                  "packing": p._id,
                  "supplier": p.supplier,
                  "status": "01",
                  "hashpacking": p.hashPacking
                }));
              }
            }else{
              //caso não exista problema, remover alguma problema antigo que possa ser que tenha sido inserido no sistema
              p.problem = hasProblem;
              if(!p.permanence_exceeded && !hasProblem){
                promiseUpdate.push(alert.remove({ "packing": p._id}));
              }
            }



            promiseUpdate.push(packing.update({
                _id: p._id
            }, p, {
                upsert: true
            }));

            promiseUpdate.push(historic_packings.update({
                'packing': p._id
            }, {
                $push: {
                    historic: {
                        plant: Scanned[indexCheckpoint].checkpoint.plant
                    }
                }
            }));

        });

        packingsNoFound.forEach(function(pn) {
            //var route = routes.filter(r => r.packing_code === pn.code && r.supplier._id.equals(pn.supplier))[0];

            pn.hashPacking  = pn.supplier + pn.code;
            // if(pn.last_time_missing){
            //   var oneDay = 1000; // hours*minutes*seconds*milliseconds
            //   var date = new Date();
            //   //var diffDays = Math.round(Math.abs((pn.last_time.getTime() - date.getTime()) / (oneDay)));
            //   //pn.time_countdown += diffDays;
            //   pn.last_time_missing = new Date();
            // }else{
            //   pn.last_time_missing = new Date();
            //   pn.time_countdown = 0;
            // }
            console.log("MISSING");
            // if(  pn.time_countdown > route.estimeted_time){
              if(pn.missing){
                promiseUpdate.push(
                  alert.update({"packing": pn._id},{
                  "actual_plant": pn.actual_plant,
                  "department": pn.department,
                  "packing": pn._id,
                  "supplier": pn.supplier,
                  "status": "02",
                  "hashpacking": pn.hashPacking
                },{
                    upsert: true
                }));
              }else{
                pn.missing = true;
                promiseUpdate.push(alert.remove({ "packing": pn._id , "status": { $ne: "02" }}));
                promiseUpdate.push( alert.create({
                  "actual_plant": pn.actual_plant,
                  "department": pn.department,
                  "packing": pn._id,
                  "supplier": pn.supplier,
                  "status": "02",
                  "hashpacking": pn.hashPacking
                }));
              }

            // }

            pn.problem = false;

            promiseUpdate.push(packing.update({
                _id: pn._id
            }, pn, {
                upsert: true
            }));
        });

        Scanned = [];
        return promiseUpdate;
        //CASO NENHUMA ROTA TENHA SIDO INSERIDA
    } else {

        packingsFound.forEach(function(p) {
          //console.log(Scanned);
            var indexCheckpoint = filterScanned.indexOf(p.tag_mac);
              console.log("Tag: "+p.tag_mac);
            console.log("Planta Scanned: "+Scanned[indexCheckpoint].checkpoint.plant);
            console.log("Planta Atual: "+p.actual_plant);
              //verifica se o tempo de permanencia foi inserido a essa embalagem
            if (p.last_time) {
              if (p.department.equals(Scanned[indexCheckpoint].checkpoint.department)) {
                  var oneSecond =  1000; // hours*minutes*seconds*milliseconds
                  var date = new Date();
                  var diffDays = Math.round(Math.abs((p.last_time.getTime() - date.getTime()) / (oneSecond)));
                  p.amount_days += diffDays;

                  //verifica o tempo de permanencia em um mesmo local
                  if(p.amount_days > 300){
                    if(p.permanence_exceeded){

                      promiseUpdate.push(
                        alert.update({"packing": p._id},{
                        "actual_plant": Scanned[indexCheckpoint].checkpoint.plant,
                        "department": Scanned[indexCheckpoint].checkpoint.department,
                        "packing": p._id,
                        "supplier": p.supplier,
                        "status": "03",
                        "hashpacking": p.hashPacking
                      },{
                          upsert: true
                      }));
                    }else{
                      //seta a informação de que o tempo de permanencia foi excedido
                      p.permanence_exceeded = true;
                      p.actual_plant = Scanned[indexCheckpoint].checkpoint.plant;
                      p.department = Scanned[indexCheckpoint].checkpoint.department;
                      promiseUpdate.push(alert.remove({ "packing": p._id , "status": { $ne: "03" }}));
                      promiseUpdate.push(alert.create({
                        "actual_plant": p.actual_plant,
                        "department": p.department,
                        "packing": p._id,
                        "supplier": p.supplier,
                        "status": "03",
                        "hashpacking": p.hashPacking
                      }));
                    }
                  }else{
                    promiseUpdate.push(alert.remove({ "packing": p._id}));
                    p.permanence_exceeded = false;
                  }

                  p.last_time = new Date();
                  p.time_countdown = 0;
                  p.last_time_missing = undefined;
              } else {
                console.log("change");

                  promiseUpdate.push(alert.remove({ "packing": p._id}));
                  p.last_time = new Date();
                  p.amount_days = 0;
                  p.time_countdown = 0;
                  p.last_time_missing = undefined;
              }
            } else {
                console.log("FOUBNDE");
                p.last_time = new Date();
                p.amount_days = 0;

                promiseUpdate.push(alert.remove({ "packing": p._id}));
                promiseUpdate.push(historic_packings.create({
                    'packing': p._id,
                    'historic': [{
                        plant: Scanned[indexCheckpoint].checkpoint.plant
                    }]
                }));
            }

            p.department = Scanned[indexCheckpoint].checkpoint.department;
            p.actual_plant = Scanned[indexCheckpoint].checkpoint.plant;
            p.hashPacking  =   p.supplier + p.code;
            p.missing = false;
            p.problem = false;

            promiseUpdate.push(packing.update({
                _id: p._id
            }, p, {
                upsert: true
            }));

            promiseUpdate.push(historic_packings.update({
                'packing': p._id
            }, {
                $push: {
                    historic: {
                        plant: Scanned[indexCheckpoint].checkpoint.plant
                    }
                }
            }));

        });

        packingsNoFound.forEach(function(pn) {

            // if(pn.last_time_missing){
            //   var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            //   var date = new Date();
            //   //var diffDays = Math.round(Math.abs((p.last_time.getTime() - date.getTime()) / (oneDay)));
            //   //pn.time_countdown += diffDays;
            //   pn.last_time_missing = new Date();
            // }else{
            //   pn.last_time_missing = new Date();
            //   pn.time_countdown = 0;
            // }
              pn.hashPacking  =   pn.supplier + pn.code;
              console.log("MISSING");
            if(pn.missing){
              promiseUpdate.push(
                alert.update({"packing": pn._id},{
                "actual_plant": pn.actual_plant,
                "department": pn.department,
                "packing": pn._id,
                "supplier": pn.supplier,
                "status": "02",
                "hashpacking": pn.hashPacking
              },{
                  upsert: true
              }));
            }else{
              pn.missing = true;
              promiseUpdate.push(alert.remove({ "packing": pn._id , "status": { $ne: "02" }}));
              promiseUpdate.push(alert.create({
                "actual_plant": pn.actual_plant,
                "department": pn.department,
                "packing": pn._id,
                "supplier": pn.supplier,
                "status": "02",
                "hashpacking": pn.hashPacking
              }));
            }

            promiseUpdate.push(packing.update({
                _id: pn._id
            }, pn, {
                upsert: true
            }));
        });

        Scanned = [];
        return promiseUpdate;
    }


}

function getInfoScanner(device, checkpoint) {
    return new Promise(function(resolve, reject) {
        var options = {
            url: 'http://reciclapac.track.devtec.com.br/api/place/' + device + '/devices',
            method: 'GET',
            headers: {
                'x-ha-access': 'reciclapac',
                'content-type': 'application/json'
            }
        }

        var callback = function(error, response, body) {
            if (error)
                reject(error);


            try {
              var info = JSON.parse(body);
              info.checkpoint = checkpoint;
              resolve(info);
            }
            catch(err) {
                reject(err);
            }

        }

        request(options, callback);
    });
}
