const http = require('http');
const debug = require('debug')('server');
const environment = require('../../config/environment');

const port = process.env.PORT || environment.port;

function start(app) {
  const server = http.Server(app);
  server.listen(port, () => {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.HOST) {
        debug(`started on ${process.env.HOST}:${process.env.PORT}`);
      } else if (process.env.DNS) {
        debug(`started on ${process.env.DNS}`);
      } else {
        debug(`started on ${environment.url}:${environment.port}`);
      }
    } else {
      debug(`started on ${environment.url}:${environment.port}`);
    }
  });
}

module.exports = {
  start,
};
