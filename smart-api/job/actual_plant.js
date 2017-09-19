

module.exports = function (packing, plants) {
  let distance = Infinity;
  let plant = {};

  plants.forEach(p => {
    let calculate = getDistanceFromLatLonInKm(packing.position.latitude,packing.position.longitude,p.lat, p.lng);

    if(calculate  < distance){
      distance = calculate;
      plant = p;
    }
  });

  if(distance > 0.5000){
    return null
  }else{
    return plant;
  }

}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2-lat1);  // deg2rad below
  let dLon = deg2rad(lon2-lon1);
  let a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
