'use strict';
const request         = require('request');
const responses       = require('../helpers/responses/index')

exports.get_CEP = function (req, res) {

  let options = {
    url: `https://viacep.com.br/ws/${req.swagger.params.cep.value}/json/`,
    method: 'GET'
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let parsed = JSON.parse(body);
      responses.successHandler(res, req.user.refresh_token, parsed);
    } else {
      responses.errorHandler(res, 'Error to get CEP of the correios', error);
    }

  });
};
