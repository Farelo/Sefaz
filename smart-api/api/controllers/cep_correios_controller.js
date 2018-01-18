'use strict';
const request         = require('request');
const successHandler  = require('../helpers/responses/successHandler');
const errorHandler    = require('../helpers/responses/errorHandler');

exports.get_CEP = function(req, res){

     let options = {
         url: `https://viacep.com.br/ws/${req.swagger.params.cep.value}/json/`,
         method: 'GET'
     };

     request(options ,function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let parsed = JSON.parse(body);
          successHandler(res, parsed);
        }else{
          errorHandler(res, 'Error to get CEP of the correios', error);
        }

     });
};
