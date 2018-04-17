
const constants = require('../utils/constants');


module.exports = {
  reverseGeocode: function(lat,lng) {

      let googleMapsClient = require('@google/maps').createClient({
        key: constants.google_api.key,
        Promise: Promise // 'Promise' is the native constructor.
      });

    return googleMapsClient.reverseGeocode({
        latlng: [lat, lng]
    }).asPromise();

  },
  directions: function(origin,destination) {
    let googleMapsClient = require('@google/maps').createClient({
      key: constants.google_api.key,
      Promise: Promise // 'Promise' is the native constructor.
    });
   
  return googleMapsClient.directions({
    'origin': origin,
    'destination': destination,
  }).asPromise();
  }
}
