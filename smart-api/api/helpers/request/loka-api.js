const request = require('request');

module.exports = function (token,device) {
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
                resolve("Device exist");
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
