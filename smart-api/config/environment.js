'use strict';

const environment = {
  "production": {
    url:"35.169.169.38", //host do servidor que a API será levantada
    port: '8004', //porta na qual o API será colocada
    database: 'reciclopac', //base de dados utilizada
    urldatabase: "mongo",  //url de acesso a base de dados 
    time: "50", //tempo da execução do job em segundos 1-59
    secret: 'S3cr3t',  //chave privada da tokenização
    expiresIn: '2h'    //tempo em que o token irá expirar
  },
  "development": {
    url:"localhost",
    port: '8984',
    database: 'gm', //base de dados utilizada
    //database: 'testeinterno',      //base de dados utilizada
    urldatabase: "localhost",  //url de acesso a base de dados 
    time: "50",          //tempo da execução do job em segundos 1-59
    secret: 'S3cr3t',    //chave privada da tokenização
    expiresIn: '2h'     //tempo em que o token irá expirar
  },
  "test": {
    url: "localhost",
    port: '3001',
    database: 'test',      //base de dados utilizada
    urldatabase: "localhost",  //url de acesso a base de dados 
    time: "50",          //tempo da execução do job em segundos 1-59
    secret: 'S3cr3t',    //chave privada da tokenização
    expiresIn: '2h'     //tempo em que o token irá expirar
  }
}

module.exports = environment[process.env.NODE_ENV];
