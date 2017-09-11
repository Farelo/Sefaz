
module.exports = function (p, plant) {
  let result = p.routes.filter( r => r.plant_factory.equals(plant._id) || r.plant_supplier.equals(plant._id));
  if(result.length > 0){
    return true;
  }else{
    return false;
  }
}
