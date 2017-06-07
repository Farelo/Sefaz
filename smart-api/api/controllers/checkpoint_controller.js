'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var checkpoint = mongoose.model('Checkpoint');
const request =  require('request');
var department = mongoose.model('Department');
/**
 * Create a Category
 */
 function joinParams(body,department,dev){

   body.forEach(function(o){
      var depart =  department.filter(d => d._id.equals(o.department))[0];
      o.plant = depart.plant;
      o.place_id = dev.filter(i => i.attributes.ID === o.code )[0].attributes.Place_id;
   });

   return  body;
 }

exports.checkpoint_create = function(req, res) {
    var departArray = [];
    var devArray = [];

    req.body.forEach(function(o){
      departArray.push(department.findOne({_id: o.department}));
      devArray.push(getInfoScanner(o.code));
    });

    var allObjects = departArray.concat(devArray);

    Promise.all(allObjects)
          .then(result => checkpoint.create(joinParams(req.body,result.slice(0,departArray.length),result.slice(departArray.length,result.length))))
          .then(success => res.json({code:200, message: "OK", response: success}))
          .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};


/**
 * Show the current Category
 */
exports.checkpoint_read = function(req, res) {
    checkpoint.findOne({
            _id: req.swagger.params.checkpoint_id.value
        })
        .then(checkpoint => res.json({code:200, message: "OK", data: checkpoint}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Update a Category
 */
exports.checkpoint_update = function(req, res) {  

    checkpoint.update({
            _id: req.swagger.params.checkpoint_id.value
        },  req.body,   {
            upsert: true
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * Delete an Category
 */
exports.checkpoint_delete = function(req, res) { 

    checkpoint.remove({
            _id: req.swagger.params.checkpoint_id.value
        })
        .then(success => res.json({code:200, message: "OK", response: success}))
        .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};
/**
 * List of Categories
 */
exports.checkpoint_list_pagination = function(req, res) { 
    var value = parseInt(req.swagger.params.page.value) > 0 ? ((parseInt(req.swagger.params.page.value) - 1) * parseInt(req.swagger.params.limit.value)) : 0;
    var checkpointList = checkpoint.find({})
          .populate("department")
          .populate("plant")
          .skip(value).limit(parseInt(req.swagger.params.limit.value))
          .sort({_id: 1});

    var count = checkpoint.find({}).count();
    Promise.all([count, checkpointList])
           .then(result =>   res.send({code:200, message: "OK","count": result[0], "checkpoints": result[1]}))
           .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

exports.checkpoint_list_all = function(req, res) { 

    var checkpointList = checkpoint.find({})
          .populate("department")
          .populate("plant")
          .then(checkpoints => res.json({code:200, message: "OK", data: checkpoints}))
          .catch(err => res.status(404).json({code:404, message: "ERROR", response: err}));
};

/*
 PROMISES
*/
function getInfoScanner(code) {
    return new Promise(function (resolve, reject) {
      var options = {
        url: 'http://reciclapac.track.devtec.com.br/api/management/scanners/'+code,
        method: 'GET',
        headers:{
          'x-ha-access' : 'reciclapac',
          'content-type' : 'application/json'
        }
      }

      var callback = function(error, response, body){
        if(error)
          reject(error);

        var info = JSON.parse(body);
        resolve(info);
      }

      request(options, callback);
    });
}
