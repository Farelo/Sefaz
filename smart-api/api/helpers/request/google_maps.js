


module.exports = {
  reverseGeocode: function(lat,lng) {

      var googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ',
        Promise: Promise // 'Promise' is the native constructor.
      });

    return googleMapsClient.reverseGeocode({
        latlng: [lat, lng]
    }).asPromise();

  },
  directions: function(origin,destination) {
    var googleMapsClient = require('@google/maps').createClient({
      key: 'AIzaSyDxZgf7T1S7LCVhXMPjDklRIcSqZfAE3WQ',
      Promise: Promise // 'Promise' is the native constructor.
    });
    console.log(origin,destination)
  return googleMapsClient.directions({
    'origin': origin,
    'destination': destination,
  }).asPromise();
  }
}
