const request = require('request');

module.exports = {
    confirmDevice: function (token,device) {
        return new Promise(function(resolve, reject) {
          var options = {
              url: 'https://loka-app.com/api/deviceDetails?deviceId='+device,
              method: 'POST',
              headers : {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token
              }
          }

            var callback = function(error, response, body) {
                if (error)
                    reject(error);

                try {
                  if(!body.match("Device "+device+" not found")){
                    var info = JSON.parse(body);
                    resolve("Exist device in the system");
                  }else{
                    reject("Code not exist in the system");
                  }
                }
                catch(err) {
                    reject(err);
                }

            }

            request(options, callback);
        });
      },
    positions: function (token,device) {
        return new Promise(function(resolve, reject) {
          var options = {
              url: 'https://loka-app.com/api/deviceDetails?deviceId='+device,
              method: 'POST',
              headers : {
                  'content-type': 'application/json',
                  'Authorization': 'Bearer ' + token
              }
          }

            var callback = function(error, response, body) {
                if (error)
                    reject(error);

                try {
                  if(!body.match("Device "+device+" not found")){
                    var info = JSON.parse(body);
                    var array = {
                      positions : []
                    };
                    info.positions.forEach(p => array.positions.push({lat: p.latitude, lng:p.longitude}));
                    resolve(array);
                  }else{
                    reject("Code not exist in the system");
                  }
                }
                catch(err) {
                    reject(err);
                }

            }

            request(options, callback);
        });

      }

}
