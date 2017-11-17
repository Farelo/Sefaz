
let environment = {
  "production": {
    url:"localhost",
    port: '8982',
    database: 'reciclopacadmin',
    urldatabase: "mongo"
  },
  "development": {
    url:"localhost",
    port: '8982',
    database: 'reciclopacadmin',
    urldatabase: "localhost"
  }
}


module.exports = function(mode){
  return environment[mode];
};
