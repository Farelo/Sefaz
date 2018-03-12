
let environment = {
  "production": {
    url:"35.169.169.38",
    port: '8005',
    database: 'reciclopacadmin',
    urldatabase: "mongo",
    time: "50",
    secret: 'S3cr3t',
    expiresIn: '2h'    //tempo em que o token irá expirar
  },
  "development": {
    url:"localhost",
    port: '8982',
    database: 'reciclopacadmin',
    urldatabase: "localhost",
    time: "50",
    secret: 'S3cr3t',
    expiresIn: '2h'    //tempo em que o token irá expirar
  }
}

module.exports = environment[process.env.NODE_ENV];
