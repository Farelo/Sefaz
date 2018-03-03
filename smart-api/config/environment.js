'use strict';

let environment = {
  "production": {
    url:"35.169.169.38", //host do servidor que a API será levantada
    port: '8004', //porta na qual o API será colocada
    database: 'reciclopac',
    urldatabase: "mongo",
    time: "50",
    secret: 'S3cr3t',  //chave privada da tokenização
    expiresIn: 2000    //tempo em que o token irá expirar
  },
  "development": {
    url:"localhost",
    port: '8984',
    database: 'reciclopac',
    urldatabase: "localhost",
    time: "50",
    secret: 'S3cr3t',    //chave privada da tokenização
    expiresIn: 2000     //tempo em que o token irá expirar
  }
}

module.exports = environment[process.env.NODE_ENV];
