'use strict';

const xlsxtojson                 = require("xlsx-to-json-lc");
const responses                  = require('../helpers/responses/index')
const schemas                    = require("../schemas/require_schemas")
const fs                         = require('fs');
const _                          = require("lodash");
const NodeGeocoder               = require('node-geocoder');
const maps                       = require('../helpers/request/google_maps');

// REFACTOR THIS PORTION OF THE CODE
// /UPLOAD OF THE TAGS BY EXCEL/
exports.uploadTag = function (req, res) {
  let datetimestamp = Date.now();
  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let dataErros = []
      let typeError = []
      result = result.filter(o => {
        if (!o.code) {
          typeError.push("O codigo não foi inserida");
          return false
        }
        else {
          return true;
        }

        if (typeError.length > 0) {
          dataErros.push({
            errors: typeError,
            line: `Linha ${index + 1}`
          })
          typeError = []
        }
      })

      result = {
        datas: result,
        row_missing: dataErros
      };

      responses.successHandler(res, req.user.refresh_token, result);
    });
  });
};
// /UPLOAD OF THE PLANTS BY EXCEL/
exports.uploadPlant = function (req, res) {
  let datetimestamp = Date.now();

  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }

      //colocar as inferências em relação ao arquivo
      let dataErros = []
      let typeError = []
      Promise.all(result.map(o => maps.reverseGeocode(o.lat ? parseFloat(o.lat) : 0, o.lng ? parseFloat(o.lng) : 0)))
        .then(data => {
          
          result.forEach((o, index) => {

            if (!o.lat) {
              typeError.push("A latitude não foi inserida");
            } else {
              o.lat = parseFloat(o.lat);

            }

            if (!o.lng) {
              typeError.push("A longitude não foi inserida");
            } else {
              o.lng = parseFloat(o.lng);
            }

            if (!o.plant_name) {
              typeError.push("O nome da planta não foi inserido");
            }

            if (o.lat && o.lng) {

              if (data[index].json.status == 'ZERO_RESULTS') {
                typeError.push("Lat ou Lng inseridos estão incorretos");
              } else {
                o.location = data[index].json.results[0].formatted_address;
              }
            }

            if (typeError.length > 0) {
              dataErros.push({
                errors: typeError,
                line: `Linha ${index + 1}`
              })
              typeError = []
            }

          });


          result = result.filter(o => {
            if (o.plant_name && o.lat && o.lng && o.location) {
              return true;
            } else {
              return false
            }
          })
          result = {
            datas: result,
            row_missing: dataErros
          };

          responses.successHandler(res, req.user.refresh_token, result);
        })
        .catch(err => responses.errorHandler(res, 'Error to generate excel', err));
    });
  });
};
// /UPLOAD OF THE PROJECTS BY EXCEL/
exports.uploadProject = function (req, res) {
  let datetimestamp = Date.now();
  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let dataErros = []
      let typeError = []
      result = result.filter((o, index) => {

        if (!o.name) {
          typeError.push("A latitude não foi inserida");
          return false
        }
        else {
          return true;
        }

        if (typeError.length > 0) {
          dataErros.push({
            errors: typeError,
            line: `Linha ${index + 1}`
          })
          typeError = []
        }

      })
      result = {
        datas: result,
        row_missing: dataErros
      };

      responses.successHandler(res, req.user.refresh_token, result);
    })
  });
};

// /UPLOAD OF THE DEPARTMENTS BY EXCEL/
exports.uploadDepartment = function (req, res) {
  let datetimestamp = Date.now();
  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let dataErros = []
      let typeError = []
      Promise.all(result.map(o => schemas.plant.findOne({ "plant_name": o.plant })))
        .then(data => {

          result.forEach((o, index) => {
            if (!data[index]) {
              typeError.push("O projeto inserido não pertence ao sistema");
            }
            else {
              o.plant = data[index];
            }

            if (!o.lng) {
              typeError.push("A longitude não foi inserida");
            }
            else {
              o.lng = parseFloat(o.lng);
            }

            if (!o.lat) {
              typeError.push("A latitude não foi inserida");
            }
            else {
              o.lat = parseFloat(o.lat);
            }

            if (typeError.length > 0) {
              dataErros.push({
                errors: typeError,
                line: `Linha ${index + 1}`
              })
              typeError = []
            }
          });

          result = result.filter(o => {
            count = count + 1;
            if (o.name && o.lat && o.lng) {
              return true;
            } else {
              return false
            }
          });

          result = {
            datas: result,
            row_missing: dataErros
          };

          responses.successHandler(res, req.user.refresh_token, result);
        }).catch(err => responses.errorHandler(res, 'Error to generate excel', err))

    })
  });
};
// /UPLOAD OF THE PACKINGS BY EXCEL/
exports.uploadPacking = function (req, res) {
  let datetimestamp = Date.now();
  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let count = 0;
      let supplier_data, tag_data, project_data = {};
      let dataErros = []
      let typeError = []

      Promise.all(result.map(o => schemas.tags.findOne({ "code": o.tag })))
        .then(data => {
          tag_data = data;
          return Promise.all(result.map(o => schemas.supplier.findOne({ "name": o.supplier, 'duns': o.duns })));
        })
        .then(data => {
          supplier_data = data;
          return Promise.all(result.map(o => schemas.project.findOne({ "name": o.project })));
        })
        .then(data => {
          project_data = data;

          result.forEach((o, index) => {
            //avalia as informações contidas no excel
            if (!supplier_data[index]) {
              typeError.push("Duns ou nome do fornecedor estão incorretos");
            }
            else {
              o.supplier = supplier_data[index];
            }

            if (!tag_data[index]) {
              typeError.push("A tag inserida não pertence ao sistema");
            } else {
              o.tag = tag_data[index];
              o.code_tag = o.tag.code;
              if (supplier_data[index]) o.hashPacking = o.supplier._id + o.code;
            }

            if (!project_data[index]) {
              typeError.push("O projeto inserida não pertence ao sistema");
            } else {
              o.project = project_data[index];
            }

            if (!o.capacity) {
              typeError.push("A capacidade não foi inserida");
            } else {
              o.capacity = parseFloat(o.capacity);
            }

            if (!o.weigth) {
              typeError.push("O peso não foi inserido");
            } else {
              o.weigth = parseFloat(o.weigth);
            }

            if (!o.heigth) {
              typeError.push("A altura não foi inserida");
            } else {
              o.heigth = parseFloat(o.heigth);
            }

            if (!o.width) {
              typeError.push("O comprimento não foi inserido");
            } else {
              o.width = parseFloat(o.width);
            }

            if (!o.length) {
              typeError.push("A largura não foi inserida");
            } else {
              o.length = parseFloat(o.length);
            }

            if (typeError.length > 0) {
              dataErros.push({
                errors: typeError,
                line: `Linha ${index + 1}`
              })
              typeError = []
            }

          });

          //remove os que apresentaram problemas
          result = result.filter(o => {
            count = count + 1;
            if (o.code && o.serial && o.tag && o.type && o.capacity && o.supplier && o.project && o.weigth && o.width && o.heigth && o.length) {
              return true;
            } else {
              return false
            }
          });

          result = {
            datas: result,
            row_missing: dataErros
          };
          responses.successHandler(res, req.user.refresh_token, result);
        }).catch(err => responses.errorHandler(res, 'Error to generate excel', err))

    });
  });
};
// /UPLOAD OF THE ROUTES BY EXCEL/
exports.uploadRoute = function (req, res) {
  let datetimestamp = Date.now();
  fs.writeFile(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, req.swagger.params.upfile.value.buffer, function (err, data) {

    xlsxtojson({
      input: `./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function (err, result) {
      fs.unlinkSync(`./uploads/${datetimestamp}${req.swagger.params.upfile.value.originalname}`);
      if (err) {
        responses.errorHandler(res, 'Error to create packing', err);
      }
      //colocar as inferências em relação ao arquivo
      let supplier_data, factory_data, project_data = [];
      let dataErros = []
      let typeError = []
      Promise.all(result.map(o => schemas.supplier.findOne({ "name": o.supplier, 'duns': o.duns }).populate('plant')))
        .then(data => {
          supplier_data = data;
          return Promise.all(result.map(o => schemas.plant.findOne({ "plant_name": o.plant_factory })));
        })
        .then(data => {
          factory_data = data;
          return Promise.all(result.map(o => schemas.project.findOne({ "name": o.project })));
        })
        .then(data => {
          project_data = data;
          return Promise.all(result.map((o, index) => maps.directions(supplier_data[index] ? supplier_data[index].plant.location : 0, factory_data[index] ? factory_data[index].location : 0)));
        })
        .then(data => {

          result.forEach((o, index) => {

            if (!supplier_data[index]) {
              typeError.push("Duns ou nome do fornecedor estão incorretos");
            } else {
              o.supplier = supplier_data[index];
              o.plant_supplier = supplier_data[index].plant;
              delete o['duns'];
              o.hashPacking = o.supplier._id + o.packing_code;
            }
            console.log(project_data[index])
            if (!project_data[index]) {
              typeError.push("O projeto inserido não pertence ao sistema");
            } else {
              o.project = project_data[index];
            }

            if (!factory_data[index]) {
              typeError.push("A Fábrica inserida não pertence ao sistema");
            } else {
              o.plant_factory = factory_data[index];
            }

            if (supplier_data[index] && factory_data[index]) {
              o.location = {
                'distance': data[index].json ? data[index].json.routes[0].legs[0].distance : undefined,
                'duration': data[index].json ? data[index].json.routes[0].legs[0].duration : undefined,
                'start_address': data[index].json ? data[index].json.routes[0].legs[0].start_address : undefined,
                'end_address': data[index].json ? data[index].json.routes[0].legs[0].end_address : undefined
              }

              //define time maxxx and min
              o.time = {
                max: 86400000,
                min: 0
              }
            }

            if (typeError.length > 0) {
              dataErros.push({
                errors: typeError,
                line: `Linha ${index + 1}`
              })
              typeError = []
            }

          });

          result = result.filter(o => {
            if (o.supplier && o.plant_supplier && o.plant_factory && o.packing_code) {
              return true;
            } else {
              return false
            }
          });

          result = {
            datas: result,
            row_missing: dataErros
          };
          responses.successHandler(res, req.user.refresh_token, result);
        }).catch(err => responses.errorHandler(res, 'Error to generate excel', err))
    });
  });
};
