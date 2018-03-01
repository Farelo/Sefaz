// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

let environment = {
  "production": {
    url:"35.169.169.38", //host do servidor que a API será levantada
    port: '8004', //porta na qual o API será colocada
    database: 'reciclopac',
    urldatabase: "mongo",
    time: "50",
    secret: 'S3cr3t'
  },
  "development": {
    url:"localhost",
    port: '8984',
    database: 'reciclopac',
    urldatabase: "localhost",
    time: "50",
    secret: 'S3cr3t'
  }
}

module.exports = environment[process.env.NODE_ENV];
