'use strict';

const xlsxtojson                 = require("xlsx-to-json-lc");
const successHandler             = require('../helpers/responses/successHandler');
const errorHandler               = require('../helpers/responses/errorHandler');
const fs                         = require('fs');
const _                          = require("lodash");
const mongoose                   = require('mongoose');
const plant                      = mongoose.model('Plant');
const tag                        = mongoose.model('Tags');
const supplier                   = mongoose.model('Supplier');
const project                    = mongoose.model('Project');
const NodeGeocoder               = require('node-geocoder');
const maps                       = require('../helpers/request/google_maps');
mongoose.Promise                 = global.Promise;

// REFACTOR THIS PORTION OF THE CODE
// /UPLOAD OF THE TAGS BY EXCEL/
exports.uploadTag = function(req, res) {
  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      result = result.filter(o => {
        if(o.code){
          return true;
        }else{
          count = count +1;
          return false
        }
      })
      result = {
        datas: result,
        row_missing : count
      };

      successHandler(res, result);
    });
  });
};
// /UPLOAD OF THE PLANTS BY EXCEL/
exports.uploadPlant = function(req, res) {
  var datetimestamp = Date.now();

  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }

      //colocar as inferências em relação ao arquivo
      let count = 0;

      Promise.all(result.map(o => maps.reverseGeocode(o.lat,o.lng)))
      .then( data => {
        result.forEach((o,index) => {
          o.location = data[index].json.results[0].formatted_address;
          o.lat = parseFloat(o.lat);
          o.lng = parseFloat(o.lng);
        });


        result = result.filter(o => {
          if(o.plant_name && o.lat && o.lng){
            return true;
          }else{
            count = count +1;
            return false
          }
        })
        result = {
          datas: result,
          row_missing : count
        };

        successHandler(res, result);
      })
      .catch(err => errorHandler(res, 'Error to generate excel', err));
    });
  });
};
// /UPLOAD OF THE PROJECTS BY EXCEL/
exports.uploadProject = function(req, res) {
  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      result = result.filter(o => {

        if(o.name){
          return true;
        }else{
          count = count +1;
          return false
        }
      })
      result = {
        datas: result,
        row_missing : count
      };

      successHandler(res, result);
    })
  });
};

// /UPLOAD OF THE DEPARTMENTS BY EXCEL/
exports.uploadDepartment = function(req, res) {
  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      Promise.all(result.map(o => plant.findOne({"plant_name": o.plant})))
      .then(data => {

        result.forEach((o,index) => {
          o.plant = data[index];
          o.lat = parseFloat(o.lat);
          o.lng = parseFloat(o.lng);
        });
        result = result.filter( o => {
          if(o.name && o.lat && o.lng){
            return true;
          }else{
            count = count +1;
            return false
          }
        });

        result = {
          datas: result,
          row_missing : count
        };

        successHandler(res, result);
      }).catch(err =>  errorHandler(res, 'Error to generate excel', err))

    })
  });
};
// /UPLOAD OF THE PACKINGS BY EXCEL/
exports.uploadPacking = function(req, res) {
  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      let supplier_data, tag_data, project_data = {};

      Promise.all(result.map(o => tag.findOne({"code": o.tag})))
            .then(data => {
              console.log(data);
              tag_data = data;
              return Promise.all(result.map(o => supplier.findOne({"name": o.supplier, 'duns': o.duns})));
            })
            .then(data => {

              supplier_data = data;
              return Promise.all(result.map(o => project.findOne({"name": o.project})));
            })
            .then(data => {
              project_data = data;

              result.forEach((o,index) => {
                o.supplier = supplier_data[index];
                o.tag = tag_data[index];
                o.code_tag = o.tag.code;
                o.project = project_data[index];
                o.capacity = parseInt(o.capacity);
                o.weigth = parseInt(o.weigth);
                o.width = parseInt(o.width);
                o.heigth = parseInt(o.heigth);
                o.length = parseInt(o.length);
                o.hashPacking = o.supplier._id + o.code;
                delete o['duns'];
              });

              result = result.filter( o => {
                if(o.code && o.serial && o.tag && o.type && o.capacity && o.supplier  && o.project && o.weigth && o.width && o.heigth && o.length){
                  return true;
                }else{
                  count = count +1;
                  return false
                }
              });

              result = {
                datas: result,
                row_missing : count
              };
              successHandler(res, result);
      }).catch(err =>  errorHandler(res, 'Error to generate excel', err))

    });
  });
};
// /UPLOAD OF THE ROUTES BY EXCEL/
exports.uploadRoute = function(req, res) {
  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      let supplier_data, factory_data = {};

      Promise.all(result.map(o => supplier.findOne({"name": o.supplier, 'duns': o.duns}).populate('plant')))
            .then(data => {
              supplier_data = data;
              return Promise.all(result.map(o => plant.findOne({"plant_name": o.plant_factory})));
            })
            .then(data => {
              factory_data = data;
              Promise.all(result.map((o,index) => maps.directions(supplier_data[index].plant.location, factory_data[index].location)))
              .then(data => {

                result.forEach((o,index) => {

                  o.location = {
                    'distance': data[index].json.routes[0].legs[0].distance,
                    'duration': data[index].json.routes[0].legs[0].duration,
                    'start_address': data[index].json.routes[0].legs[0].start_address,
                    'end_address':data[index].json.routes[0].legs[0].end_address
                  }
                  o.supplier = supplier_data[index];
                  o.plant_supplier = supplier_data[index].plant;
                  o.plant_factory = factory_data[index];
                  o.hashPacking = o.supplier._id + o.packing_code;

                  delete o['duns'];
                });

               result = result.filter( o => {
                  if(o.supplier && o.plant_supplier && o.plant_factory && o.packing_code){
                    return true;
                  }else{
                    count = count +1;
                    return false
                  }
                });

                result = {
                  datas: result,
                  row_missing : count
                };
                successHandler(res, result);
              }).catch(err =>  errorHandler(res, 'Error to generate excel', err))
      }).catch(err =>  errorHandler(res, 'Error to generate excel', err))

    });
  });
};
