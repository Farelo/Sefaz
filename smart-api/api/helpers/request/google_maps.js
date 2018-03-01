
const constants = require('../constants');


module.exports = {
  reverseGeocode: function(lat,lng) {

      var googleMapsClient = require('@google/maps').createClient({
        key: constants.google_api.key,
        Promise: Promise // 'Promise' is the native constructor.
      });

    return googleMapsClient.reverseGeocode({
        latlng: [lat, lng]
    }).asPromise();

  },
  directions: function(origin,destination) {
    var googleMapsClient = require('@google/maps').createClient({
      key: constants.google_api.key,
      Promise: Promise // 'Promise' is the native constructor.
    });
   
  return googleMapsClient.directions({
    'origin': origin,
    'destination': destination,
  }).asPromise();
  }
}
