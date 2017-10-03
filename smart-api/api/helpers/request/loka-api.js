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
          let date = new Date();
          let start =  date.getTime() - (1000 * 60 * 60 * 24 * 10);
          let end = date.getTime();
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
                      markers : [],
                      positions : []
                    };


                    info.positions.forEach(o => array.markers.push( {'start': new Date(o.date*1000), 'end': (o.to == null ? null : new Date(o.to*1000)),'battery': o.battery,'position': [o.latitude, o.longitude]}))
                    console.log(array.positions);
                    // array.markers.sort(function(a,b){
                    //   if (a.start < b.start) {
                    //     return 1;
                    //   }
                    //   if (a.start > b.start) {
                    //     return -1;
                    //   }
                    //   // a must be equal to b
                    //   return 0;
                    // });
                    array.markers.forEach( o => array.positions.push({lat: o.position[0], lng: o.position[1]}));

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
