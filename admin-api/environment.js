
let environment = {
  "production": {
    url:"localhost",
    port: '8985',
    database: 'reciclopacadmin',
    urldatabase: "mongo",
    time: "50",
    secret: 'S3cr3t'
  },
  "development": {
    url:"localhost",
    port: '8985',
    database: 'reciclopacadmin',
    urldatabase: "localhost",
    time: "50",
    secret: 'S3cr3t'
  }
}

module.exports = environment[process.env.NODE_ENV];
