'use strict';
/**
 * Module dependencies.
 */
const successHandler             = require('../helpers/responses/successHandler');
const successHandlerPagination   = require('../helpers/responses/successHandlerPagination');
const errorHandler               = require('../helpers/responses/errorHandler');
const mongoose                   = require('mongoose');
const checkpoint                 = mongoose.model('Checkpoint');
const department                 = mongoose.model('Department');
const _                          = require("lodash");
const request                    = require('request');
mongoose.Promise                 = global.Promise;
/**
 * Create a Checkpoint
 */
function joinParams(body, department, dev) {

  body.forEach(function(o) {
    var depart = department.filter(d => d._id.equals(o.department))[0];
    o.plant = depart.plant;
    o.place_id = dev.filter(i => i.attributes.ID === o.code)[0].attributes.Place_id;
  });

  return body;
}

/**
 * Show the current Checkpoint //dar uma olhada nisso
 */
exports.checkpoint_create = function(req, res) {
  var departArray = [];
  var devArray = [];

  req.body.forEach(function(o) {
    departArray.push(department.findOne({
      _id: o.department
    }));
    devArray.push(getInfoScanner(o.code));
  });

  var allObjects = departArray.concat(devArray);

  Promise.all(allObjects)
    .then(result => checkpoint.create(joinParams(req.body, result.slice(0, departArray.length), result.slice(departArray.length, result.length))))
    .then(success => res.json({
      code: 200,
      message: "OK",
      response: success
    }))
    .catch(err => res.status(404).json({
      code: 404,
      message: "ERROR",
      response: err
    }));
};

/**
 * Show the current Checkpoint
 */
exports.checkpoint_read = function(req, res) {
  checkpoint.findOne({
      _id: req.swagger.params.checkpoint_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to read checkpoint'));
};
/**
 * Update a Checkpoint
 */
exports.checkpoint_update = function(req, res) {  

  checkpoint.update({
      _id: req.swagger.params.checkpoint_id.value
    },  req.body,   {
      upsert: true
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to update checkpoint'));
};
/**
 * Delete an Checkpoint
 */
exports.checkpoint_delete = function(req, res) { 

  checkpoint.remove({
      _id: req.swagger.params.checkpoint_id.value
    })
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to delete checkpoint'));
};
/**
 * List of all Checkpoints pagination
 */
exports.checkpoint_list_pagination = function(req, res) { 
  checkpoint.paginate({}, {
      page: parseInt(req.swagger.params.page.value),
      populate: ['department', 'plant'],
      sort: {
        _id: 1
      },
      limit: parseInt(req.swagger.params.limit.value)
    })
    .then(_.partial(successHandlerPagination, res))
    .catch(_.partial(errorHandler, res, 'Error to list checpoints by pagination'));

};
/**
 * List of all Checkpoints
 */
exports.checkpoint_list_all = function(req, res) { 

  var checkpointList = checkpoint.find({})
    .populate("department")
    .populate("plant")
    .then(_.partial(successHandler, res))
    .catch(_.partial(errorHandler, res, 'Error to list all checkpoints'));
};

/*
 PROMISES
*/
function getInfoScanner(code) {
  return new Promise(function(resolve, reject) {
    var options = {
      url: 'http://reciclapac.track.devtec.com.br/api/management/scanners/' + code,
      method: 'GET',
      headers: {
        'x-ha-access': 'reciclapac',
        'content-type': 'application/json'
      }
    }

    var callback = function(error, response, body) {
      if (error)
        reject(error);

      var info = JSON.parse(body);
      resolve(info);
    }

    request(options, callback);
  });
}
